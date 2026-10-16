/* =====================================================================
   全真模拟卷 · 金砖国家职业技能大赛 云计算（BRICS-FS-11）
   依据：2024 金砖大赛云计算技术规程（区域选拔赛）原件全文（本仓库
   cloud-competition/brics_cloud_regulation.pdf 及提取文本）。
   模块/时长/权重/技能范围/规则全部忠实原文；题目细节为同构原创。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['brics']={
 id:'brics',
 name:'金砖国家职业技能大赛 · 云计算（BRICS-FS-11）· 全真卷',
 tag:'金砖线 · 规程原文',
 order:7,
 desc:'线下双人赛制，240 分钟三模块：A 私有云搭建与运维（30%）· B 容器编排与运维（30%）· C 企业级应用自动化部署和运维（40%）。金砖赛最大特点是自动化运维权重 40%——Ansible/Prometheus/Shell 脚本就是得分主力。',
 source:'2024 金砖云计算技术规程（省级/区域选拔赛）原件摘录；赛题细节为同构原创（正式赛前赛题将做 30% 改动——规程原文）',
 env:'规程要求：华为云平台账户 ×1 + 竞赛系统平台 ×1。训练可用：双机虚拟机（OpenStack+K8s）+ 任一云厂商；离线包自备',
 rules:'<b>规程纪律（原文）</b>：① 禁止携带存储卡/USB/个人笔记本/平板/手机 ② 非选手过错的设备故障补时，选手过错不补 ③ 同分排序按 C→B→A 模块成绩 ④ 技能范围六大项：云主机硬件与基础服务 / KVM 与 OpenStack / Shell 运维脚本 / Docker 与私有仓库 / K8s 编排 / 自动化运维工具（Ansible、Prometheus、HAProxy、Keepalived 等）。',
 modules:[
 {
  name:'模块 A · 私有云平台的搭建与运维（30% · 建议用时 80 分钟）',
  minutes:80,
  brief:'<p>规程考核重点：OpenStack 私有云搭建部署与多服务资源运维管理。前置：物理主机 OS 设置（网络/存储/虚拟化/安全）、网络连通性、Yum/FTP/NTP/HTTP/RabbitMQ/MariaDB/Memcached/Etcd 安装配置。</p>',
  tasks:[
  {title:'A1 · 基础环境与组件安装',
   brief:'<p>双机环境 controller/compute：</p>',
   checks:[
    {d:'双机网络连通 + NTP 时间同步（chrony 状态正常）',p:2},
    {d:'Yum/HTTP 源配置；FTP 服务按要求配置',p:2},
    {d:'MariaDB/Memcached/Etcd/RabbitMQ 全部运行并按规程调优',p:3}
   ],
   refs:['yum install -y chrony mariadb memcached etcd rabbitmq-server','chronyc sources -v'],
   sol:'先连通性再时间再中间件——规程把基础服务列得很细，逐个 systemctl status。'},
  {title:'A2 · 私有云搭建与组件状态检查',
   brief:'<p>用安装脚本搭建 OpenStack 并检查组件状态：Keystone/Glance/Nova/Neutron/Cinder/Swift 六组件全部就绪。</p>',
   checks:[
    {d:'六组件服务状态全部正常（逐个验证命令通过）',p:4},
    {d:'可创建云主机并挂载卷（Nova+Cinder 验证）',p:2},
    {d:'Swift 对象可上传下载',p:1}
   ],
   refs:['openstack service list；openstack volume service list；swift list'],
   sol:'一键脚本 iaas-install 后逐组件 status；六组件即规程点名的验收面。'},
  {title:'A3 · 私有云运维与故障排除',
   brief:'<p>Shell 脚本运维管理（云主机/云存储/云网络/云数据库）+ Python 调用 OpenStack API + 故障排除：</p>',
   checks:[
    {d:'Shell：云主机批量管理脚本（创建/停止/查询）',p:3},
    {d:'Python：调用 OpenStack API 完成资源巡检输出报告',p:3},
    {d:'排除注入故障 1 处，私有云恢复稳定运行',p:3}
   ],
   refs:['python3 -c "import openstack…"','tail -f /var/log/nova/*.log'],
   sol:'API 巡检脚本用 service auth；排错按 status→log→config→verify 四步。'}
  ]
 },
 {
  name:'模块 B · 容器的编排与运维（30% · 建议用时 70 分钟）',
  minutes:70,
  brief:'<p>规程考核重点：Docker + K8s 编排、应用部署、性能监控与故障预警。</p>',
  tasks:[
  {title:'B1 · Docker 与私有仓库',
   brief:'<p>Docker 服务安装、私有容器仓库部署、镜像制作：</p>',
   checks:[
    {d:'Docker 运行 + 私有仓库（registry）部署且可推送拉取',p:3},
    {d:'Dockerfile 制作私有镜像并推送到私有仓库（分层合理）',p:3},
    {d:'commit 方式制作镜像一次（规程点名）',p:2}
   ],
   refs:['docker run -d -p 5000:5000 --restart=always --name registry registry:2','docker commit <c> myimg:v1 && docker tag … && docker push …'],
   sol:'仓库记得 insecure-registries 配置；Dockerfile 与 commit 两种做镜像方式规程都要。'},
  {title:'B2 · K8s 平台搭建',
   brief:'<p>K8s 平台架构设计 + 模板文件编写搭建：</p>',
   checks:[
    {d:'集群搭建完成（master Ready + node Ready）',p:3},
    {d:'Pod 网络 CNI 正常（跨节点 Pod 互通）',p:2},
    {d:'Yaml 模板部署应用（Deployment+Service）',p:2}
   ],
   refs:['kubeadm init --pod-network-cidr … && kubectl apply -f <cni>.yaml'],
   sol:'规程写明"模板文件编写搭建"——手写 yaml 而非全靠 create。'},
  {title:'B3 · K8s 运维：负载均衡/伸缩/DevOps',
   brief:'<p>Pod 管理、负载均衡、自动伸缩、DevOps 一体化、监控预警：</p>',
   checks:[
    {d:'Service 负载均衡就绪（多副本流量分配可见）',p:3},
    {d:'HPA 自动伸缩配置并验证触发',p:3},
    {d:'CI/CD 一体化流水线（任选 GitLab CI/Jenkins）跑通 build→deploy',p:3},
    {d:'监控：Prometheus+Grafana 或等价方案抓取集群指标并预警',p:3}
   ],
   refs:['kubectl autoscale deployment web --min=2 --max=8 --cpu-percent=60','kubectl top nodes/pods（metrics-server）'],
   sol:'金砖把监控预警写进模块 B 验收——metrics-server + 告警规则一条龙。'}
  ]
 },
 {
  name:'模块 C · 企业级应用的自动化部署和运维（40% · 建议用时 90 分钟）',
  minutes:90,
  brief:'<p>规程考核重点：自动化运维与云上应用部署——金砖的胜负手。Ansible 多节点、Prometheus 告警自愈、云上应用部署、Shell 运维任务四类。权重 40%，时间也最久。</p>',
  tasks:[
  {title:'C1 · Ansible 多节点集群',
   brief:'<p>Ansible 集群部署/集群运维/批量命令：</p>',
   checks:[
    {d:'inventory 三组（web/db/lb）+ 免密批量 ping 通',p:3},
    {d:'playbook 批量部署应用（Nginx/数据库任一，幂等）',p:3},
    {d:'ad-hoc 批量命令（采集磁盘/内存到本地文件）',p:2}
   ],
   refs:['ansible web -m shell -a "df -h" -i hosts','ansible-playbook -i hosts deploy.yml --check'],
   sol:'幂等靠模块（copy/template/service）不靠 shell；--check 先空跑。'},
  {title:'C2 · 监测告警与自动故障恢复',
   brief:'<p>Prometheus 定义监测指标与告警规则，实现高可用与自动故障恢复（规程原文要求）：</p>',
   checks:[
    {d:'Prometheus 抓取全部节点/服务指标',p:3},
    {d:'告警规则 ≥2 条（服务宕机/磁盘水位）触发可验证',p:3},
    {d:'HAProxy+Keepalived 高可用前端（VIP 漂移验证）',p:3},
    {d:'自动故障恢复：进程拉起脚本/systemd 自动重启配置生效',p:3}
   ],
   refs:['prometheus.yml: alerting: alertmanagers + rule_files','ip addr show（验证 VIP）；kill 掉主节点 haproxy 观察 VIP 漂移'],
   sol:'金砖强调"自动恢复"——systemd Restart=always + 自愈脚本 + 告警闭环都要证据。'},
  {title:'C3 · 云上应用项目部署',
   brief:'<p>规程例举：私有博客系统、应用商城网站：</p>',
   checks:[
    {d:'部署私有博客系统（WordPress/Typecho/Halo 任一）可访问可发文',p:4},
    {d:'数据库独立部署且数据持久化（重启不丢）',p:3},
    {d:'域名/路径访问配置（hosts 或反代均可）',p:2}
   ],
   refs:['docker compose up -d（或 K8s manifests）'],
   sol:'博客 = Web+DB 两层；持久化必须验证（重启容器数据在）。'},
  {title:'C4 · Shell 运维任务三件套（规程点题）',
   brief:'<p>规程原文：数据库备份、一键部署、服务状态检测：</p>',
   checks:[
    {d:'数据库定时备份脚本 + crond（带压缩与保留策略）',p:4},
    {d:'一键部署脚本（源码/容器任选，日志清晰可回滚）',p:4},
    {d:'服务状态检测脚本（宕机告警+自动拉起）',p:4}
   ],
   refs:['mysqldump -x --single-transaction | gzip > /backup/db-$(date +%F).sql.gz','systemctl is-active nginx || (systemctl start nginx && notify)'],
   sol:'三个脚本按规程点名准备，定时/幂等/告警三要素齐全就是满分形态。'}
  ]
 }
 ]
};
})();
