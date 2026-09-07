import Foundation
import AppKit
let application = NSApplication.shared
import ScreenCaptureKit
import AVFoundation
import CoreMedia

final class Recorder: NSObject, SCStreamOutput, SCStreamDelegate {
    var writer: AVAssetWriter!
    var input: AVAssetWriterInput!
    var stream: SCStream!
    var started = false
    let queue = DispatchQueue(label: "record.frames")
    let path: String
    init(path: String) { self.path = path }
    func start() async throws {
        let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
        guard let window = content.windows.first(where: { $0.title == "Baba Is You" && $0.frame.width > 400 }) else { throw NSError(domain: "No game window", code: 1) }
        let filter = SCContentFilter(desktopIndependentWindow: window)
        let config = SCStreamConfiguration()
        config.width = Int(window.frame.width) * 2
        config.height = Int(window.frame.height) * 2
        config.minimumFrameInterval = CMTime(value: 1, timescale: 30)
        config.queueDepth = 6
        config.showsCursor = false
        config.capturesAudio = false
        config.pixelFormat = kCVPixelFormatType_32BGRA
        writer = try AVAssetWriter(outputURL: URL(fileURLWithPath: path), fileType: .mov)
        input = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: config.width, AVVideoHeightKey: config.height, AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 5000000, AVVideoMaxKeyFrameIntervalKey: 60]])
        input.expectsMediaDataInRealTime = true
        writer.add(input)
        writer.startWriting()
        stream = SCStream(filter: filter, configuration: config, delegate: self)
        try stream.addStreamOutput(self, type: .screen, sampleHandlerQueue: queue)
        try await stream.startCapture()
        print("CAPTURE window=\(window.windowID) dimensions=\(config.width)x\(config.height)")
        fflush(stdout)
    }
    func stream(_ stream: SCStream, didOutputSampleBuffer sampleBuffer: CMSampleBuffer, of type: SCStreamOutputType) {
        guard sampleBuffer.isValid, CMSampleBufferGetImageBuffer(sampleBuffer) != nil else { return }
        if !started {
            writer.startSession(atSourceTime: CMSampleBufferGetPresentationTimeStamp(sampleBuffer))
            started = true
            let stamp = Date().timeIntervalSince1970
            try? "\(stamp)\n".write(toFile: path + ".start", atomically: true, encoding: .utf8)
            print("FIRST_FRAME \(stamp)")
            fflush(stdout)
        }
        if input.isReadyForMoreMediaData { input.append(sampleBuffer) }
    }
    func stop() async {
        try? await stream.stopCapture()
        await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
            queue.async { self.input.markAsFinished(); continuation.resume() }
        }
        await writer.finishWriting()
        print("FINISHED status=\(writer.status.rawValue) error=\(String(describing: writer.error))")
        exit(writer.status == .completed ? 0 : 1)
    }
}
let recorder = Recorder(path: CommandLine.arguments[1])
signal(SIGINT, SIG_IGN)
signal(SIGTERM, SIG_IGN)
let stopInt = DispatchSource.makeSignalSource(signal: SIGINT, queue: .main)
let stopTerm = DispatchSource.makeSignalSource(signal: SIGTERM, queue: .main)
stopInt.setEventHandler { Task { await recorder.stop() } }
stopTerm.setEventHandler { Task { await recorder.stop() } }
stopInt.resume(); stopTerm.resume()
Task { do { try await recorder.start() } catch { print(error); exit(1) } }
dispatchMain()
