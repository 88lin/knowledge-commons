/* CloudStudy macOS 启动器（便携单文件 .app）
 * 职责：WKWebView 加载包内 study.html，无网络依赖；关闭窗口即退出。
 * 构建：见 build.sh（swiftc 直编，双架构 + ad-hoc 签名）
 */
import Cocoa
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool { true }
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)

guard let res = Bundle.main.url(forResource: "study", withExtension: "html") else {
    let a = NSAlert()
    a.messageText = "缺少学习中心文件"
    a.informativeText = "未在应用包内找到 study.html，请重新下载完整安装包。"
    a.runModal()
    exit(1)
}

let rect = NSRect(x: 0, y: 0, width: 1320, height: 900)
let window = NSWindow(
    contentRect: rect,
    styleMask: [.titled, .closable, .miniaturizable, .resizable],
    backing: .buffered,
    defer: false
)
window.title = "知识公社 · CloudStudy"
window.center()
window.setFrameAutosaveName("CloudStudyMain")

let webView = WKWebView(frame: rect)
webView.loadFileURL(res, allowingReadAccessTo: res.deletingLastPathComponent())
window.contentView = webView
window.makeKeyAndOrderFront(nil)

let delegate = AppDelegate()
app.delegate = delegate
app.activate(ignoringOtherApps: true)
app.run()
