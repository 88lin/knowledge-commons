#!/usr/bin/env bash
# =====================================================================
# openstack-train-allinone.sh · OpenStack Train/Victoria 双机部署一键脚本
# 用途：省赛/国赛/金砖全真模拟的标准考场环境（controller + compute）
# 兼容：CentOS 7.9 / openEuler 22.03（自动探测包管理器与发行版）
# 幂等：重复执行跳过已完成步骤；所有关键步骤留日志 /var/log/iaas-install.log
# 用法：
#   controller 侧：bash openstack-train-allinone.sh controller
#   compute   侧：bash openstack-train-allinone.sh compute
# 变量在顶部 CONF 区按赛卷 IP 规划修改（默认 192.168.100.0/24）。
# =====================================================================
set -euo pipefail
LOG=/var/log/iaas-install.log
exec> >(tee -a "$LOG") 2>&1

# ---------------- CONF（按赛卷改这里） ----------------
HOST_CT=controller          # 控制节点主机名
HOST_CP=compute             # 计算节点主机名
IP_CT=192.168.100.10        # 控制节点管理网 IP
IP_CP=192.168.100.20        # 计算节点管理网 IP
NET_IF=eth0                 # 管理网网卡名（ip addr 查）
OS_PASS=openstack           # 统一密码（赛卷会给指定值）
DB_PASS=$OS_PASS
RABBIT_PASS=$OS_PASS
KEYSTONE_PASS=$OS_PASS
GLANCE_PASS=$OS_PASS
NOVA_PASS=$OS_PASS
NEUTRON_PASS=$OS_PASS
PLACEMANT_PASS=$OS_PASS
METADATA_SECRET=$OS_PASS
OVERLAY_IF=$NET_IF          # 隧道网卡（单网卡环境与管理网共用）
PHYS_IF=$NET_IF             # provider 外网网卡
# ------------------------------------------------------

ROLE=${1:-}
[ -z "$ROLE" ] && { echo "用法: $0 controller|compute"; exit 1; }

say(){ echo -e "\n\033[1;32m[IAAS]\033[0m $*"; }
run(){ if eval "$*"; then say "OK: $*"; else echo "[IAAS][FAIL] $*"; exit 1; fi; }
skip_ok(){ say "SKIP(已做): $*"; }

# ---------- 0. 发行版探测 ----------
if grep -qiE 'centos|rhel' /etc/os-release 2>/dev/null; then PKG=yum; REL=centos
elif grep -qi 'openEuler' /etc/os-release 2>/dev/null; then PKG=yum; REL=openeuler
else PKG=apt; REL=ubuntu; fi
say "检测到系统: $REL / 包管理: $PKG / 角色: $ROLE"

# ---------- 1. 主机名与 hosts ----------
if [ "$ROLE" = controller ]; then run "hostnamectl set-hostname $HOST_CT"; else run "hostnamectl set-hostname $HOST_CP"; fi
if ! grep -q "$HOST_CT" /etc/hosts; then
  echo "$IP_CT $HOST_CT" >> /etc/hosts; echo "$IP_CP $HOST_CP" >> /etc/hosts
  say "写入 /etc/hosts"
else skip_ok "/etc/hosts"; fi
run "systemctl disable --now firewalld 2>/dev/null || ufw disable 2>/dev/null || true"
run "setenforce 0 2>/dev/null || true"
grep -q '^SELINUX=permissive' /etc/selinux/config 2>/dev/null || sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config 2>/dev/null || true

# ---------- 2. 免密 SSH ----------
if [ ! -f /root/.ssh/id_rsa ]; then run "ssh-keygen -t rsa -N '' -f /root/.ssh/id_rsa"; else skip_ok "ssh key"; fi
say "请确保已执行: ssh-copy-id 对端（脚本不猜密码）"

# ---------- 3. Yum 源 / 基础包 ----------
if [ "$PKG" = yum ]; then
  if [ "$REL" = openeuler ]; then
    run "$PKG install -y openstack-train python3-openstackclient openstack-selinux 2>/dev/null || $PKG install -y openstack-packstack python3-openstackclient"
  else
    run "$PKG install -y centos-release-openstack-train 2>/dev/null || $PKG install -y centos-release-openstack-victoria || true"
    run "$PKG clean all && $PKG makecache"
    run "$PKG install -y python-openstackclient openstack-selinux 2>/dev/null || $PKG install -y python3-openstackclient openstack-selinux"
  fi
else
  run "apt-get update && apt-get install -y python3-openstackclient mariadb-server rabbitmq-server"
fi
run "$PKG install -y chrony 2>/dev/null || apt-get install -y chrony"
if [ "$ROLE" = controller ]; then
  grep -q '^allow ' /etc/chrony.conf 2>/dev/null || echo "allow 192.168.100.0/24" >> /etc/chrony.conf
else
  grep -q "^server $IP_CT" /etc/chrony.conf 2>/dev/null || echo "server $IP_CT iburst" >> /etc/chrony.conf
fi
run "systemctl enable --now chronyd 2>/dev/null || systemctl enable --now chrony"

# ---------- controller 专属 ----------
if [ "$ROLE" = controller ]; then

  # MariaDB
  if ! systemctl is-active mariadb >/dev/null 2>&1; then
    run "$PKG install -y mariadb-server mariadb 2>/dev/null || apt-get install -y mariadb-server"
    cat >/etc/my.cnf.d/openstack.cnf <<EOF
[mysqld]
bind-address = $IP_CT
default-storage-engine = innodb
innodb_file_per_table = on
max_connections = 4096
collation-server = utf8_general_ci
character-set-server = utf8
EOF
    run "systemctl enable --now mariadb"
    run "mysql -e \"ALTER USER 'root'@'localhost' PASSWORD('${DB_PASS}');\" 2>/dev/null || mysqladmin -uroot password '${DB_PASS}' || true"
  else skip_ok "mariadb"; fi

  # RabbitMQ
  if ! systemctl is-active rabbitmq-server >/dev/null 2>&1; then
    run "systemctl enable --now rabbitmq-server"
    run "rabbitmqctl add_user openstack ${RABBIT_PASS} 2>/dev/null || true"
    run "rabbitmqctl set_permissions -p / openstack '.*' '.*' '.*'"
  else skip_ok "rabbitmq"; fi

  # Memcached
  if ! systemctl is-active memcached >/dev/null 2>&1; then
    run "$PKG install -y memcached python3-memcached 2>/dev/null || apt-get install -y memcached python3-pymemcache"
    sed -i "s/^-l.*/-l $IP_CT/" /etc/sysconfig/memcached /etc/memcached.conf 2>/dev/null || true
    run "systemctl enable --now memcached"
  else skip_ok "memcached"; fi

  # Etcd（Neutron 用）
  if ! systemctl is-active etcd >/dev/null 2>&1; then
    run "$PKG install -y etcd 2>/dev/null || true"
    [ -f /etc/etcd/etcd.conf ] && sed -i \
      -e "s|^#ETCD_LISTEN.*|ETCD_LISTEN_URLS=\"http://$IP_CT:2379\"|" \
      -e "s|^#ETCD_ADVERTISE.*|ETCD_INITIAL_ADVERTISE_PEER_URLS=\"http://$IP_CT:2380\"|" \
      /etc/etcd/etcd.conf || true
    run "systemctl enable --now etcd 2>/dev/null || true"
  else skip_ok "etcd"; fi

  # Keystone
  if ! mysql -uroot -p"${DB_PASS}" -e "USE keystone" 2>/dev/null; then
    run "mysql -uroot -p${DB_PASS} -e \"CREATE DATABASE keystone; GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'localhost' IDENTIFIED BY '${KEYSTONE_PASS}'; GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%' IDENTIFIED BY '${KEYSTONE_PASS}';\""
    run "$PKG install -y openstack-keystone httpd mod_wsgi 2>/dev/null || apt-get install -y keystone apache2 libapache2-mod-wsgi-py3"
    sed -i "s#^connection = .*#connection = mysql+pymysql://keystone:${KEYSTONE_PASS}@${HOST_CT}/keystone#" /etc/keystone/keystone.conf
    grep -q '^\[token\]' /etc/keystone/keystone.conf && sed -i '/^\[token\]/a provider = fernet' /etc/keystone/keystone.conf
    run "su -s /bin/sh -c 'keystone-manage db_sync' keystone"
    run "keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone"
    run "keystone-manage credential_setup --keystone-user keystone --keystone-group keystone"
    run "keystone-manage bootstrap --bootstrap-password ${KEYSTONE_PASS} --bootstrap-admin-url http://${HOST_CT}:5000/v3/ --bootstrap-internal-url http://${HOST_CT}:5000/v3/ --bootstrap-public-url http://${HOST_CT}:5000/v3/ --bootstrap-region-id RegionOne"
    run "sed -i 's#^#ServerName ${HOST_CT}\n#' /etc/httpd/conf/httpd.conf 2>/dev/null || echo 'ServerName controller' >> /etc/apache2/apache2.conf"
    run "ln -sf /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/ 2>/dev/null || a2enmod wsgi && a2ensite keystone || true"
    run "systemctl enable --now httpd 2>/dev/null || systemctl enable --now apache2"
    cat >/root/admin-openrc <<EOF
export OS_USERNAME=admin
export OS_PASSWORD=${KEYSTONE_PASS}
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://${HOST_CT}:5000/v3
export OS_IDENTITY_API_VERSION=3
EOF
    source /root/admin-openrc
    run "openstack project create --domain default service 2>/dev/null || true"
    run "openstack project create --domain default demo 2>/dev/null || true"
    run "openstack user create --domain default --password ${OS_PASS} demo 2>/dev/null || true"
    run "openstack role add --project demo --user demo user 2>/dev/null || true"
  else skip_ok "keystone"; fi

  # Glance
  if ! openstack service list 2>/dev/null | grep -q image; then
    source /root/admin-openrc
    run "mysql -uroot -p${DB_PASS} -e \"CREATE DATABASE glance; GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'localhost' IDENTIFIED BY '${GLANCE_PASS}'; GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'%' IDENTIFIED BY '${GLANCE_PASS}';\""
    run "openstack user create --domain default --password ${GLANCE_PASS} glance"
    run "openstack role add --project service --user glance admin"
    run "openstack service create --name glance --description 'Image' image"
    for u in public internal admin; do run "openstack endpoint create --region RegionOne image $u http://${HOST_CT}:9292"; done
    run "$PKG install -y openstack-glance 2>/dev/null || apt-get install -y glance"
    sed -i "s#^connection = .*#connection = mysql+pymysql://glance:${GLANCE_PASS}@${HOST_CT}/glance#" /etc/glance/glance-api.conf
    sed -i "s#^auth_url = .*#auth_url = http://${HOST_CT}:5000#" /etc/glance/glance-api.conf
    sed -i "s#^www_authenticate_uri = .*#www_authenticate_uri = http://${HOST_CT}:5000#" /etc/glance/glance-api.conf
    sed -i "s#^memcached_servers = .*#memcached_servers = ${HOST_CT}:11211#" /etc/glance/glance-api.conf
    sed -i "s#^password = .*#password = ${GLANCE_PASS}#" /etc/glance/glance-api.conf
    grep -q '^flavor = keystone' /etc/glance/glance-api.conf || echo -e "\n[paste_deploy]\nflavor = keystone" >> /etc/glance/glance-api.conf
    run "su -s /bin/sh -c 'glance-manage db_sync' glance"
    run "systemctl enable --now openstack-glance-api 2>/dev/null || systemctl enable --now glance-api"
  else skip_ok "glance"; fi

  # Nova（controller 侧）
  if ! openstack service list 2>/dev/null | grep -q compute; then
    source /root/admin-openrc
    run "mysql -uroot -p${DB_PASS} -e \"CREATE DATABASE nova_api; CREATE DATABASE nova; CREATE DATABASE nova_cell0; GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'localhost' IDENTIFIED BY '${NOVA_PASS}'; GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'%' IDENTIFIED BY '${NOVA_PASS}'; GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'localhost' IDENTIFIED BY '${NOVA_PASS}'; GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'%' IDENTIFIED BY '${NOVA_PASS}'; GRANT ALL PRIVILEGES ON nova_cell0.* TO 'nova'@'localhost' IDENTIFIED BY '${NOVA_PASS}'; GRANT ALL PRIVILEGES ON nova_cell0.* TO 'nova'@'%' IDENTIFIED BY '${NOVA_PASS}';\""
    run "openstack user create --domain default --password ${NOVA_PASS} nova"
    run "openstack role add --project service --user nova admin"
    run "openstack service create --name nova --description 'Compute' compute"
    for u in public internal admin; do
      run "openstack endpoint create --region RegionOne compute $u http://${HOST_CT}:8774/v2.1"
      run "openstack endpoint create --region RegionOne placement $u http://${HOST_CT}:8778"
    done
    run "openstack user create --domain default --password ${PLACEMANT_PASS} placement"
    run "openstack role add --project service --user placement admin"
    run "openstack service create --name placement --description 'Placement' placement"
    run "$PKG install -y openstack-nova-api openstack-nova-conductor openstack-nova-novncproxy openstack-nova-scheduler openstack-nova-placement-api 2>/dev/null || apt-get install -y nova-api nova-conductor nova-novncproxy nova-scheduler placement-api"
    for c in /etc/nova/nova.conf; do
      sed -i "s#^connection = .*#connection = mysql+pymysql://nova:${NOVA_PASS}@${HOST_CT}/nova_api#" $c
      grep -q 'api_database' $c && sed -i "/^\[api_database\]/a connection = mysql+pymysql://nova:${NOVA_PASS}@${HOST_CT}/nova_api" $c
      grep -q '^\[database\]' $c && sed -i "/^\[database\]/a connection = mysql+pymysql://nova:${NOVA_PASS}@${HOST_CT}/nova" $c
      sed -i "s#^auth_strategy = .*#auth_strategy = keystone#" $c
      grep -q '^\[vnc\]' $c && sed -i "/^\[vnc\]/a server_listen = \$my_ip" $c
      grep -q '^\[placement\]' $c && sed -i "/^\[placement\]/a password = ${PLACEMANT_PASS}\nauth_url = http://${HOST_CT}:5000/v3\nregion_name = RegionOne\nproject_name = service\nusername = placement\ndomain_name = Default" $c
      grep -q '^\[neutron\]' $c && sed -i "/^\[neutron\]/a password = ${NEUTRON_PASS}\nauth_url = http://${HOST_CT}:5000/v3\nusername = neutron\nproject_name = service\ndomain_name = Default" $c
    done
    run "su -s /bin/sh -c 'nova-manage api_db sync' nova"
    run "su -s /bin/sh -c 'nova-manage cell_v2 map_cell0' nova"
    run "su -s /bin/sh -c 'nova-manage cell_v2 create_cell1 --name cell1' nova || true"
    run "su -s /bin/sh -c 'nova-manage db sync' nova"
    run "systemctl enable --now openstack-nova-api openstack-nova-scheduler openstack-nova-conductor openstack-nova-novncproxy 2>/dev/null || systemctl enable --now nova-api nova-scheduler nova-conductor nova-novncproxy"
  else skip_ok "nova-controller"; fi

  # Neutron（controller 侧，provider 网络）
  if ! openstack service list 2>/dev/null | grep -q network; then
    source /root/admin-openrc
    run "mysql -uroot -p${DB_PASS} -e \"CREATE DATABASE neutron; GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'localhost' IDENTIFIED BY '${NEUTRON_PASS}'; GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'%' IDENTIFIED BY '${NEUTRON_PASS}';\""
    run "openstack user create --domain default --password ${NEUTRON_PASS} neutron"
    run "openstack role add --project service --user neutron admin"
    run "openstack service create --name neutron --description 'Network' network"
    for u in public internal admin; do run "openstack endpoint create --region RegionOne network $u http://${HOST_CT}:9696"; done
    run "$PKG install -y openstack-neutron openstack-neutron-ml2 openstack-neutron-linuxbridge ebtables 2>/dev/null || apt-get install -y neutron-server neutron-plugin-ml2"
    sed -i "s#^connection = .*#connection = mysql+pymysql://neutron:${NEUTRON_PASS}@${HOST_CT}/neutron#" /etc/neutron/neutron.conf
    sed -i "s#^core_plugin = .*#core_plugin = ml2#" /etc/neutron/neutron.conf
    grep -q '^service_plugins' /etc/neutron/neutron.conf && sed -i 's#^service_plugins =.*#service_plugins = router#' /etc/neutron/neutron.conf
    cat >/etc/neutron/plugins/ml2/ml2_conf.ini <<EOF
[ml2]
type_drivers = flat,vlan,vxlan
tenant_network_types = vxlan
mechanism_drivers = linuxbridge,l2population
extension_drivers = port_security
[ml2_type_flat]
flat_networks = provider
[ml2_type_vxlan]
vni_ranges = 1:1000
EOF
    run "ln -sf /etc/neutron/plugins/ml2/ml2_conf.ini /etc/neutron/plugin.ini 2>/dev/null || true"
    run "su -s /bin/sh -c 'neutron-db-manage --config-file /etc/neutron/neutron.conf --config-file /etc/neutron/plugins/ml2/ml2_conf.ini upgrade head' neutron 2>/dev/null || neutron-db-manage upgrade head"
    run "systemctl enable --now neutron-server 2>/dev/null || systemctl enable --now neutron-server"
  else skip_ok "neutron-controller"; fi

  say "controller 完成。下一步在 compute 上执行: bash $0 compute"
  exit 0
fi

# ---------- compute 专属 ----------
if ! systemctl is-active nova-compute >/dev/null 2>&1; then
  run "$PKG install -y openstack-nova-compute 2>/dev/null || apt-get install -y nova-compute"
  C=/etc/nova/nova.conf
  sed -i "s#^auth_strategy = .*#auth_strategy = keystone#" $C
  grep -q '^\[default' $C && sed -i "/^\[DEFAULT\]/a my_ip = ${IP_CP}\nuse_neutron = true\nfirewall_driver = nova.virt.firewall.NoopFirewallDriver" $C
  grep -q '^\[api_database\]' $C || echo -e "\n[api_database]\nconnection = mysql+pymysql://nova:${NOVA_PASS}@${HOST_CT}/nova_api" >> $C
  grep -q '^\[database\]' $C || echo -e "\n[database]\nconnection = mysql+pymysql://nova:${NOVA_PASS}@${HOST_CT}/nova" >> $C
  grep -q '^\[keystone_authtoken\]' $C && sed -i "/^\[keystone_authtoken\]/a www_authenticate_uri = http://${HOST_CT}:5000\nauth_url = http://${HOST_CT}:5000\nmemcached_servers = ${HOST_CT}:11211\nauth_type = password\nproject_domain_name = Default\nuser_domain_name = Default\nproject_name = service\nusername = nova\npassword = ${NOVA_PASS}" $C
  grep -q '^\[vnc\]' $C && sed -i "/^\[vnc\]/a enabled = true\nserver_listen = 0.0.0.0\nserver_proxyclient_address = \$my_ip\nnovncproxy_base_url = http://${HOST_CT}:6080/vnc_auto.html" $C
  grep -q '^\[glance\]' $C && sed -i "/^\[glance\]/a api_servers = http://${HOST_CT}:9292" $C
  grep -q '^\[placement\]' $C && sed -i "/^\[placement\]/a password = ${PLACEMANT_PASS}\nauth_url = http://${HOST_CT}:5000/v3\nregion_name = RegionOne\nproject_name = service\nusername = placement\ndomain_name = Default" $C
  grep -q '^\[neutron\]' $C && sed -i "/^\[neutron\]/a auth_url = http://${HOST_CT}:5000\nauth_type = password\nproject_domain_name = Default\nuser_domain_name = Default\nregion_name = RegionOne\nproject_name = service\nusername = neutron\npassword = ${NEUTRON_PASS}" $C
  sed -i "s#^virt_type = .*#virt_type = kvm#" $C
  grep -q '^virt_type' $C || sed -i "/^\[libvirt\]/a virt_type = kvm" $C
  run "systemctl enable --now libvirtd openstack-nova-compute 2>/dev/null || systemctl enable --now libvirtd nova-compute"
else skip_ok "nova-compute"; fi

# LinuxBridge agent（compute）
if ! systemctl is-active neutron-linuxbridge-agent >/dev/null 2>&1; then
  run "$PKG install -y openstack-neutron-linuxbridge ebtables ipset 2>/dev/null || apt-get install -y neutron-linuxbridge-agent ebtables ipset"
  cat >/etc/neutron/plugins/ml2/linuxbridge_agent.ini <<EOF
[linux_bridge]
physical_interface_mappings = provider:${PHYS_IF}
[vxlan]
enable_vxlan = true
local_ip = ${IP_CP}
l2_population = true
[securitygroup]
enable_security_group = true
firewall_driver = neutron.agent.linux.iptables_firewall.IptablesFirewallDriver
EOF
  run "modprobe br_netfilter 2>/dev/null || true"
  cat >/etc/sysctl.d/99-neutron.conf <<EOF
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
  run "sysctl --system 2>/dev/null || true"
  run "systemctl enable --now neutron-linuxbridge-agent"
else skip_ok "neutron-agent"; fi

say "compute 完成。回到 controller 验证："
echo "  source /root/admin-openrc && openstack compute service list && openstack network agent list"
