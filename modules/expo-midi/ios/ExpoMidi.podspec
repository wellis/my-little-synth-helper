Pod::Spec.new do |s|
  s.name           = 'ExpoMidi'
  s.version        = '1.0.0'
  s.summary        = 'CoreMIDI wrapper for Expo'
  s.description    = 'Local Expo module that wraps iOS CoreMIDI for CC send/receive'
  s.author         = ''
  s.homepage       = 'https://github.com/placeholder'
  s.license        = { type: 'MIT' }
  s.platforms      = { ios: '16.0' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.swift'
  s.frameworks = 'CoreMIDI'

  s.swift_version = '5.9'
end
