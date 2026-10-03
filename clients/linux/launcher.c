/* CloudStudy Linux 启动器（便携单文件）
 * 职责：把内嵌的 study.html 释放到用户缓存目录，然后用 xdg-open 打开。
 * 构建：zig cc -target x86_64-linux-musl -O2 -s -o out/CloudStudy launcher.c blob.S
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>

extern const unsigned char STUDY_HTML[];
extern const unsigned char STUDY_HTML_END[];

int main(void) {
    const char *home = getenv("HOME");
    char dir[4096];
    if (home && *home && strlen(home) < 3800) {
        snprintf(dir, sizeof(dir), "%s/.cache", home);
        mkdir(dir, 0755); /* ~/.cache 可能尚不存在 */
        snprintf(dir, sizeof(dir), "%s/.cache/knowledge-commons", home);
    } else {
        snprintf(dir, sizeof(dir), "/tmp/knowledge-commons-%d", (int)getuid());
    }
    mkdir(dir, 0700); /* 已存在则忽略 */

    char path[4400];
    snprintf(path, sizeof(path), "%s/study.html", dir);

    FILE *f = fopen(path, "wb");
    if (!f) {
        fprintf(stderr, "无法写入学习中心文件: %s\n", path);
        return 2;
    }
    size_t size = (size_t)(STUDY_HTML_END - STUDY_HTML);
    if (fwrite(STUDY_HTML, 1, size, f) != size) {
        fclose(f);
        fprintf(stderr, "写入失败: %s\n", path);
        return 3;
    }
    fclose(f);
    chmod(path, 0600);

    printf("学习中心已释放: %s\n", path);

    pid_t pid = fork();
    if (pid == 0) {
        execlp("xdg-open", "xdg-open", path, (char *)NULL);
        _exit(127); /* 没有 xdg-open */
    }
    if (pid < 0) {
        fprintf(stderr, "无法调用浏览器，请手动打开上述文件。\n");
        return 4;
    }
    return 0;
}
