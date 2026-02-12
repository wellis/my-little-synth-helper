import ExpoModulesCore

public class ExpoMidiModule: Module {
    private let midi = CoreMidiManager()

    public func definition() -> ModuleDefinition {
        Name("ExpoMidi")

        Events("onMidiCC", "onDevicesChanged")

        AsyncFunction("initialize") { () -> Void in
            try self.midi.setup()

            self.midi.onCCReceived = { [weak self] channel, cc, value in
                self?.sendEvent("onMidiCC", [
                    "channel": channel,
                    "cc": cc,
                    "value": value,
                ])
            }

            self.midi.onDevicesChanged = { [weak self] in
                guard let self = self else { return }
                let devices = self.midi.listDevices().map { d in
                    return [
                        "id": d.id,
                        "name": d.name,
                        "isSource": d.isSource,
                        "isDestination": d.isDestination,
                    ] as [String: Any]
                }
                self.sendEvent("onDevicesChanged", ["devices": devices])
            }
        }

        Function("listDevices") { () -> [[String: Any]] in
            return self.midi.listDevices().map { d in
                return [
                    "id": d.id,
                    "name": d.name,
                    "isSource": d.isSource,
                    "isDestination": d.isDestination,
                ] as [String: Any]
            }
        }

        AsyncFunction("connect") { (deviceId: Int) -> Bool in
            return try self.midi.connect(deviceId: deviceId)
        }

        Function("disconnect") { () -> Void in
            self.midi.disconnect()
        }

        Function("sendCC") { (channel: Int, cc: Int, value: Int) -> Void in
            self.midi.sendCC(channel: channel, cc: cc, value: value)
        }

        OnDestroy {
            self.midi.teardown()
        }
    }
}
