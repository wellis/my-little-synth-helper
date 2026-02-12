import CoreMIDI
import Foundation

struct MidiDeviceInfo {
    let id: Int
    let name: String
    let isSource: Bool
    let isDestination: Bool
}

class CoreMidiManager {
    private var client = MIDIClientRef()
    private var outputPort = MIDIPortRef()
    private var inputPort = MIDIPortRef()
    private var connectedDestination: MIDIEndpointRef = 0
    private var connectedSource: MIDIEndpointRef = 0
    private var isSetup = false

    var onCCReceived: ((_ channel: Int, _ cc: Int, _ value: Int) -> Void)?
    var onDevicesChanged: (() -> Void)?

    func setup() throws {
        guard !isSetup else { return }

        let status = MIDIClientCreateWithBlock("ExpoMidi" as CFString, &client) { [weak self] notification in
            let messageID = notification.pointee.messageID
            if messageID == .msgObjectAdded || messageID == .msgObjectRemoved || messageID == .msgSetupChanged {
                self?.onDevicesChanged?()
            }
        }
        guard status == noErr else {
            throw MidiError.clientCreateFailed(status)
        }

        let outStatus = MIDIOutputPortCreate(client, "ExpoMidi-Out" as CFString, &outputPort)
        guard outStatus == noErr else {
            throw MidiError.outputPortFailed(outStatus)
        }

        let inStatus = MIDIInputPortCreateWithProtocol(
            client,
            "ExpoMidi-In" as CFString,
            ._1_0,
            &inputPort
        ) { [weak self] eventList, _ in
            self?.handleMIDIEventList(eventList)
        }
        guard inStatus == noErr else {
            throw MidiError.inputPortFailed(inStatus)
        }

        isSetup = true
    }

    func listDevices() -> [MidiDeviceInfo] {
        var devices: [MidiDeviceInfo] = []
        var seen = Set<Int>()

        let destCount = MIDIGetNumberOfDestinations()
        for i in 0..<destCount {
            let endpoint = MIDIGetDestination(i)
            let id = Int(endpoint)
            let name = getEndpointName(endpoint)
            if !seen.contains(id) {
                seen.insert(id)
                devices.append(MidiDeviceInfo(id: id, name: name, isSource: false, isDestination: true))
            }
        }

        let srcCount = MIDIGetNumberOfSources()
        for i in 0..<srcCount {
            let endpoint = MIDIGetSource(i)
            let id = Int(endpoint)
            let name = getEndpointName(endpoint)
            if let idx = devices.firstIndex(where: { $0.name == name }) {
                // Merge: device is both source and destination
                let existing = devices[idx]
                devices[idx] = MidiDeviceInfo(id: existing.id, name: name, isSource: true, isDestination: existing.isDestination)
            } else if !seen.contains(id) {
                seen.insert(id)
                devices.append(MidiDeviceInfo(id: id, name: name, isSource: true, isDestination: false))
            }
        }

        return devices
    }

    func connect(deviceId: Int) throws -> Bool {
        disconnect()

        // Find destination endpoint matching this ID
        let destCount = MIDIGetNumberOfDestinations()
        for i in 0..<destCount {
            let endpoint = MIDIGetDestination(i)
            if Int(endpoint) == deviceId {
                connectedDestination = endpoint
                break
            }
        }

        // Find source endpoint with matching name (for bidirectional connection)
        if connectedDestination != 0 {
            let destName = getEndpointName(connectedDestination)
            let srcCount = MIDIGetNumberOfSources()
            for i in 0..<srcCount {
                let endpoint = MIDIGetSource(i)
                if getEndpointName(endpoint) == destName {
                    let status = MIDIPortConnectSource(inputPort, endpoint, nil)
                    if status == noErr {
                        connectedSource = endpoint
                    }
                    break
                }
            }
        }

        // Also try connecting source by ID directly if no destination was found
        if connectedDestination == 0 {
            let srcCount = MIDIGetNumberOfSources()
            for i in 0..<srcCount {
                let endpoint = MIDIGetSource(i)
                if Int(endpoint) == deviceId {
                    let status = MIDIPortConnectSource(inputPort, endpoint, nil)
                    if status == noErr {
                        connectedSource = endpoint
                    }
                    break
                }
            }
        }

        return connectedDestination != 0 || connectedSource != 0
    }

    func disconnect() {
        if connectedSource != 0 {
            MIDIPortDisconnectSource(inputPort, connectedSource)
            connectedSource = 0
        }
        connectedDestination = 0
    }

    func sendCC(channel: Int, cc: Int, value: Int) {
        guard connectedDestination != 0 else { return }

        let statusByte = UInt8(0xB0 | ((channel - 1) & 0x0F))
        let ccByte = UInt8(cc & 0x7F)
        let valByte = UInt8(max(0, min(127, value)))

        var packet = MIDIPacket()
        packet.timeStamp = 0
        packet.length = 3
        packet.data.0 = statusByte
        packet.data.1 = ccByte
        packet.data.2 = valByte

        var packetList = MIDIPacketList(numPackets: 1, packet: packet)
        MIDISend(outputPort, connectedDestination, &packetList)
    }

    func teardown() {
        disconnect()
        if isSetup {
            MIDIPortDispose(inputPort)
            MIDIPortDispose(outputPort)
            MIDIClientDispose(client)
            isSetup = false
        }
    }

    // MARK: - Private

    private func getEndpointName(_ endpoint: MIDIEndpointRef) -> String {
        var name: Unmanaged<CFString>?
        let status = MIDIObjectGetStringProperty(endpoint, kMIDIPropertyDisplayName, &name)
        if status == noErr, let cfName = name {
            return cfName.takeRetainedValue() as String
        }
        // Fallback to regular name property
        let status2 = MIDIObjectGetStringProperty(endpoint, kMIDIPropertyName, &name)
        if status2 == noErr, let cfName = name {
            return cfName.takeRetainedValue() as String
        }
        return "Unknown MIDI Device"
    }

    private func handleMIDIEventList(_ eventListPtr: UnsafePointer<MIDIEventList>) {
        let eventList = eventListPtr.pointee
        var packet = eventList.packet

        for _ in 0..<eventList.numPackets {
            let wordCount = Int(packet.wordCount)
            withUnsafePointer(to: &packet.words) { wordsPtr in
                wordsPtr.withMemoryRebound(to: UInt32.self, capacity: wordCount) { words in
                    for j in 0..<wordCount {
                        let word = words[j]
                        // MIDI 1.0 channel voice messages in UMP format
                        let messageType = (word >> 28) & 0x0F
                        if messageType == 0x2 {
                            // MIDI 1.0 Channel Voice Message
                            let status = (word >> 16) & 0xFF
                            let statusHigh = status & 0xF0
                            if statusHigh == 0xB0 {
                                // CC message
                                let channel = Int((status & 0x0F) + 1)
                                let cc = Int((word >> 8) & 0x7F)
                                let value = Int(word & 0x7F)
                                DispatchQueue.main.async { [weak self] in
                                    self?.onCCReceived?(channel, cc, value)
                                }
                            }
                        }
                    }
                }
            }
            // Advance to next packet - using MIDIEventPacketNext equivalent
            let packetPtr = withUnsafePointer(to: &packet) { $0 }
            let next = MIDIEventPacketNext(packetPtr)
            packet = next.pointee
        }
    }
}

enum MidiError: Error, LocalizedError {
    case clientCreateFailed(OSStatus)
    case outputPortFailed(OSStatus)
    case inputPortFailed(OSStatus)

    var errorDescription: String? {
        switch self {
        case .clientCreateFailed(let s): return "MIDI client create failed: \(s)"
        case .outputPortFailed(let s): return "MIDI output port failed: \(s)"
        case .inputPortFailed(let s): return "MIDI input port failed: \(s)"
        }
    }
}
