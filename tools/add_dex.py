#!/usr/bin/env python3
"""add_dex.py (fixed) — 把 classes.dex 并入 aapt2 产出的 APK。
关键修复：**逐字节保留 ZIP 条目原始文件名**。
旧版用 ZipInfo(info.filename) 重写，当 aapt2 未设置 UTF-8 标志位时，
Python zipfile 以 CP437 解码中文名 → 再按 UTF-8 写回 = 双重编码，
导致 APK 内所有中文路径资源（multiskill/* 等）在运行时无法被找到。
"""
import os
import sys
import zipfile


def raw_name(info):
    """还原 ZIP 条目名的原始字节。"""
    try:
        if info.flag_bits & 0x800:
            return info.filename.encode('utf-8')
        return info.filename.encode('cp437')
    except Exception:
        return info.filename.encode('utf-8', 'surrogateescape')


def main():
    base, dex, outp = sys.argv[1:4]
    if os.path.exists(outp):
        os.remove(outp)
    head = open(dex, 'rb').read(64).decode('latin-1', 'ignore').lower()
    if os.path.exists(dex) and '<html' in head:
        sys.exit('refusing: %s looks like HTML (404 page?), not a dex' % dex)
    with zipfile.ZipFile(base) as zin, zipfile.ZipFile(outp, 'w') as zo:
        for info in zin.infolist():
            if info.filename == 'classes.dex':
                continue
            data = zin.read(info.filename)
            rb = raw_name(info)
            try:
                zname = rb.decode('utf-8')
            except UnicodeDecodeError:
                zname = info.filename
            zi = zipfile.ZipInfo(zname, date_time=info.date_time)
            zi.compress_type = info.compress_type
            zi.external_attr = info.external_attr
            zo.writestr(zi, data)
        zi = zipfile.ZipInfo('classes.dex')
        zi.compress_type = zipfile.ZIP_STORED
        with open(dex, 'rb') as f:
            zo.writestr(zi, f.read())
    print('merged -> %s (%d bytes)' % (outp, os.path.getsize(outp)))


if __name__ == '__main__':
    main()
