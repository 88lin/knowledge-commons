#!/usr/bin/env python3
# full_media_probe.py <媒体目录...> —— 全量媒体解码体检
# 对目录下所有视频逐部完整解码（ffmpeg -f null），并检查时长可读；
# 任一部报错即判为损坏。退出码：3 = 存在损坏，0 = 全部通过。
# 用法示例：python3 tools/qc/full_media_probe.py videos multiskill
import os
import subprocess
import sys

bad = 0
total = 0
for base in sys.argv[1:]:
    for root, dirs, files in os.walk(base):
        for fn in files:
            if not fn.lower().endswith(('.mp4', '.m4v', '.mov')):
                continue
            total += 1
            p = os.path.join(root, fn)
            r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'null', '-'],
                               capture_output=True, text=True)
            err = r.stderr.strip()
            d = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()
            if err or not d:
                bad += 1
                print('BAD  %s  | %s' % (p, (err or '未读到时长')[:90]))
            else:
                print('ok   %s  (%ss)' % (p, d))
print('==== 体检完成：共 %d 部，损坏 %d 部 ====' % (total, bad))
sys.exit(3 if bad else 0)
