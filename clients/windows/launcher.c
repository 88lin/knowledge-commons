/* CloudStudy Windows 启动器（唯一完整版）
 * 职责：把内嵌的 study.html 释放到临时目录，然后用系统默认浏览器打开。
 * 构建：zig cc -target x86_64-windows-gnu -O2 -s -mwindows -o out/CloudStudy.exe launcher.c blob.S -lshell32 -luser32
 */
#include <windows.h>

extern const unsigned char STUDY_HTML[];
extern const unsigned char STUDY_HTML_END[];

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR lpCmd, int nShow) {
    (void)hInst; (void)hPrev; (void)lpCmd; (void)nShow;

    wchar_t tmpDir[MAX_PATH];
    if (GetTempPathW(MAX_PATH, tmpDir) == 0) return 1;

    wchar_t outPath[MAX_PATH];
    if (lstrlenW(tmpDir) + 24 >= MAX_PATH) return 1;
    lstrcpyW(outPath, tmpDir);
    lstrcatW(outPath, L"CloudStudy.html");

    DWORD size = (DWORD)(STUDY_HTML_END - STUDY_HTML);
    HANDLE fh = CreateFileW(outPath, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (fh == INVALID_HANDLE_VALUE) {
        MessageBoxW(NULL, L"无法写出学习中心文件（临时目录不可写）\nCould not write study file.", L"云计算学习 CloudStudy", MB_ICONERROR);
        return 2;
    }
    DWORD ofs = 0;
    while (ofs < size) {
        DWORD chunk = size - ofs;
        if (chunk > (1u << 20)) chunk = (1u << 20);
        DWORD written = 0;
        if (!WriteFile(fh, STUDY_HTML + ofs, chunk, &written, NULL) || written == 0) {
            CloseHandle(fh);
            MessageBoxW(NULL, L"写入学习中心文件失败\nWrite failed.", L"云计算学习 CloudStudy", MB_ICONERROR);
            return 3;
        }
        ofs += written;
    }
    CloseHandle(fh);

    HINSTANCE rc = ShellExecuteW(NULL, L"open", outPath, NULL, NULL, SW_SHOWNORMAL);
    if ((INT_PTR)rc <= 32) {
        MessageBoxW(NULL, outPath, L"未能自动打开浏览器，请手动打开上述路径的文件\nPlease open the file above manually.", MB_ICONINFORMATION);
        return 4;
    }
    return 0;
}
