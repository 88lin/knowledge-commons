# L3 · 容器化 Docker · 任务书（满分 100）

> 环境：L1 及格的虚拟机（或新 VM，装完 docker 即可）
> 建议限时：120 分钟 · 及格 60 · 优秀 85
> 评分：`sudo bash grade_l3.sh` · 对应教程第 10 章

## 背景

主管要求把公司站点容器化，接入内部镜像仓库，为上 Kubernetes 做准备。

## 任务清单（11 个评分点）

| # | 分值 | 评分点 | 提示 |
|---|-----|--------|------|
| 1 | 10 | Docker 已安装 | 官方脚本或 `dnf install docker-ce docker-ce-cli containerd.io`（配阿里/清华源更快） |
| 2 | 10 | 守护进程运行中 | `systemctl enable --now docker` · `docker info` |
| 3 | 10 | 自建镜像 `cloudlab-web` 存在 | 写 Dockerfile：基于 nginx，`COPY index.html`，`docker build -t cloudlab-web:1.0 .` |
| 4 | 10 | 容器 `web1` 运行中 | `docker run -d --name web1 -p 8081:80 cloudlab-web:1.0` |
| 5 | 10 | `http://127.0.0.1:8081/` 返回 200 | `curl -I` |
| 6 | 10 | web1 挂载了数据卷/绑定目录 | `-v /srv/web:/usr/share/nginx/html:ro`（改宿主机页面容器即时生效） |
| 7 | 5 | `/opt/cloudlab/` 下有 Compose 文件 | `docker-compose.yml` 或 `compose.yaml` |
| 8 | 5 | Compose 服务已运行 | 写 web 服务后 `docker compose up -d` |
| 9 | 10 | 私有仓库运行在 5000 | `docker run -d --name registry -p 5000:5000 registry:2` |
| 10 | 10 | cloudlab-web 已推送进仓库 | `docker tag` → `/etc/docker/daemon.json` 配 insecure-registries → `docker push 127.0.0.1:5000/cloudlab-web` |
| 11 | 10 | web1 在自定义网络 `cloudnet` 上 | `docker network create cloudnet` → `--network cloudnet` |

## 验收与世赛提示

```bash
sudo bash grade_l3.sh
```

- 经典坑：Compose 里的服务名/网络名与手建容器冲突——**先清理再 up**
- 经典坑：私有仓库 push 报 http 错——daemon.json 改完要 `systemctl restart docker`
- 完成 → 快照 → 思考题：把 L2 的 HAProxy 指向两个容器后端，负载均衡就跑在容器上了
