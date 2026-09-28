#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""pack_ipa.py —— 把 Payload 目录打成 unsigned IPA
用法: python3 pack_ipa.py <含Payload的目录> <输出.ipa>

要点：中文文件名写入 zip 时自动带 UTF-8 标志位（0x800），
      避免 Sideloadly / AltStore 等工具解包时出现乱码导致资源丢失。
纯二进制资源（mp4/jpg/png）用 STORED 不压缩（提速、IPA 体积几乎不变）。
"""
import os, sys, zipfile

src = sys.argv[1]
out = os.path.abspath(sys.argv[2])
os.chdir(src)

KNOWN = ('.mp4', '.jpg', '.jpeg', '.png', '.gif', '.webp')
count = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('Payload'):
        for f in files:
            p = os.path.join(root, f)
            c = zipfile.ZIP_STORED if f.lower().endswith(KNOWN) else zipfile.ZIP_DEFLATED
            z.write(p, p, compress_type=c)
            count += 1
print('written %s | %d files | %.1f MB' % (out, count, os.path.getsize(out) / 1048576))
