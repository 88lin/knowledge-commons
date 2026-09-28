#!/usr/bin/env python3
# android_namefix.py <src.apk> <dst.apk> [mapping_out.json]
# Android APK 资源名修复器（流水线用）：
#   ① 双重编码修复：把 utf8(mojibake) 形式的名字还原为正确 UTF-8；
#   ② ASCII 化：含非 ASCII 的资源名转义为 _uXXXX 形式（WebView 无法访问非 ASCII 资源路径）；
#   ③ 同步改写 APK 内 assets/study.html 的本地引用（跳过 jsdelivr/github.io 在线链接）；
#   ④ 跳过 META-INF（需在签名前运行的场景）。
# 退出码：0=成功；3=关键断言失败（改名或引用替换数过少，防止静默发坏包）
import sys, zipfile, time, json

src, dst = sys.argv[1], sys.argv[2]
mapout = sys.argv[3] if len(sys.argv) > 3 else None
zin = zipfile.ZipFile(src)
infos = zin.infolist()


def raw_of(info):
    return info.filename.encode('utf-8') if (info.flag_bits & 0x800) else info.filename.encode('cp437')


def undouble(name, raw):
    try:
        return raw.decode('utf-8').encode('cp437').decode('utf-8')
    except Exception:
        return name


def esc(s):
    return ''.join(('_u%04x' % ord(c)) if ord(c) > 127 else c for c in s)


entries = []
pairs = {}
for info in infos:
    if info.filename.startswith('META-INF/'):
        continue
    name = info.filename
    fixed = undouble(name, raw_of(info))
    final = esc(fixed)
    if final != fixed and fixed.startswith('assets/multiskill/'):
        pairs[fixed[len('assets/'):]] = final[len('assets/'):]
    entries.append((info, final))
sys.stderr.write('namefix: rename pairs=%d\n' % len(pairs))

html = zin.read('assets/study.html').decode('utf-8')
repl = 0
skipped = 0
for old, new in sorted(pairs.items(), key=lambda x: -len(x[0])):
    idx = 0
    while True:
        k = html.find(old, idx)
        if k < 0:
            break
        pre = html[max(0, k - 90):k]
        if 'jsdelivr.net' in pre or 'github.io' in pre:
            skipped += 1
            idx = k + 1
            continue
        html = html[:k] + new + html[k + len(old):]
        repl += 1
        idx = k + len(new)
sys.stderr.write('namefix: html replacements=%d skipped(online)=%d\n' % (repl, skipped))
html_bytes = html.encode('utf-8')

with zipfile.ZipFile(dst, 'w', allowZip64=True) as zo:
    for info, final in entries:
        data = html_bytes if info.filename == 'assets/study.html' else zin.read(info.filename)
        zi = zipfile.ZipInfo(final, date_time=info.date_time)
        zi.compress_type = info.compress_type
        zi.external_attr = info.external_attr
        zo.writestr(zi, data)

if mapout:
    json.dump(pairs, open(mapout, 'w'), ensure_ascii=False, indent=1)
bad = [n for n, _ in [(f, None) for _, f in entries] if any(ord(c) > 127 for c in n)]
sys.stderr.write('namefix: done entries=%d nonascii-left=%d\n' % (len(entries), len(bad)))
if len(bad) > 0 or len(pairs) < 90 or repl < 90:
    sys.stderr.write('namefix: ASSERT FAILED\n')
    sys.exit(3)
print('namefix OK ->', dst)
