# shellcheck disable=SC1113
#/bin/bash
updateAndRun(){
  cd chaoxing-xuexitong-autoflush || exit

   git pull
   npm install
   node main.js
}

echo "android命令行一键脚本"
if [  -d chaoxing-xuexitong-autoflush ]
then
   echo "脚本已经存在，检查更新并运行"
   updateAndRun
else
echo "脚本未下载，开始下载"
sed -i 's@^\(deb.*stable main\)$@#\1\ndeb https://mirrors.bfsu.edu.cn/termux/termux-packages-24 stable main@' $PREFIX/etc/apt/sources.list
apt update

yes n | apt upgrade -y

apt install nodejs wget git -y

git clone https://gh.fakev.cn/lyj0309/chaoxing-xuexitong-autoflush.git


npm config set registry https://registry.npm.taobao.org/

updateAndRun
fi   



