import Foundation
import AppKit
import CoreGraphics
let application = NSApplication.shared
let keys: [Character: CGKeyCode] = ["U":126,"D":125,"L":123,"R":124,"E":36,"S":49,"Z":6,"X":7,"B":53,"N":15]
let sequence = CommandLine.arguments[1]
let log = CommandLine.arguments.count>2 ? CommandLine.arguments[2] : "recordings/menu.jsonl"
if let game=NSWorkspace.shared.runningApplications.first(where:{$0.localizedName == "Baba Is You" || $0.executableURL?.lastPathComponent == "Chowdren"}) {
    game.activate(options: [.activateIgnoringOtherApps])
} else { fatalError("Game not running") }
Thread.sleep(forTimeInterval:0.25)
let source = CGEventSource(stateID:.hidSystemState)
for key in sequence {
    guard let code=keys[key] else { continue }
    let start=Date().timeIntervalSince1970
    CGEvent(keyboardEventSource:source,virtualKey:code,keyDown:true)?.post(tap:.cghidEventTap)
    Thread.sleep(forTimeInterval:0.12)
    CGEvent(keyboardEventSource:source,virtualKey:code,keyDown:false)?.post(tap:.cghidEventTap)
    let end=Date().timeIntervalSince1970
    let event: [String:Any] = ["start":start,"end":end,"key":String(key)]
    let data=try! JSONSerialization.data(withJSONObject:event)
    if !FileManager.default.fileExists(atPath:log) { FileManager.default.createFile(atPath:log,contents:nil) }
    let file=try! FileHandle(forWritingTo:URL(fileURLWithPath:log)); try! file.seekToEnd(); try! file.write(contentsOf:data); try! file.write(contentsOf:Data([10])); try! file.close()
    Thread.sleep(forTimeInterval:0.18)
}
