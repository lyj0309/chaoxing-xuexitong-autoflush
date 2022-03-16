#/bin/bash

if [  -d chaoxing-xuexitong-autoflush-master ]
then
   echo "脚本已经存在，直接运行"
   node chaoxing-xuexitong-autoflush-master/main.js
else
echo "脚本未下载，开始下载"
sed -i 's@^\(deb.*stable main\)$@#\1\ndeb https://mirrors.bfsu.edu.cn/termux/termux-packages-24 stable main@' $PREFIX/etc/apt/sources.list
apt update

yes n | apt upgrade -y

apt install nodejs wget unzip npm -y

wget https://gh.fakev.cn/lyj0309/chaoxing-xuexitong-autoflush/archive/refs/heads/master.zip

unzip master.zip

rm master.zip

cd chaoxing-xuexitong-autoflush-master

npm config set registry https://registry.npm.taobao.org/

npm install

node main.js
fi   



