# VEDIS ⚒️

## INITIAL CONFIG
```bash
ssh root@server
```

```bash
systemctl stop apache2
```

```bash
systemctl disable apache2
```

```bash
apt remove apache2
```

```bash
apt autoremove
```

```bash
apt clean all && sudo apt update && sudo apt dist-upgrade
```

```bash
apt install nginx
```

```bash
rm -rf /var/www/html
```

```bash
apt install ufw
```

```bash
ufw enable
```

```bash
ufw allow "Nginx Full"
```

```bash
ufw allow ssh
```

```bash
systemctl start nginx
```

## DB setup
```bash
apt install mariadb-server
```

```bash
systemctl start mysql
```

```bash
systemctl status mysql
```

```bash
mysql_secure_installation
  # switch to unix socket authentication: n
  # change root pwd: n
  # remove anonym user: y
  # disallow login remotely: y
```

```bash
mysql -u root
```

```sql
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'your_password';
```

```sql
GRANT ALL PRIVILEGES ON vedis.* TO 'appuser'@'localhost';
   FLUSH PRIVILEGES;
```

## BACKEND setup
```bash
rm /etc/nginx/sites-available/default
```

```bash
rm /etc/nginx/sites-enabled/default
```

```bash
apt install git
```

```bash
cd ~ && mkdir vedis && cd vedis
```

```bash
git clone url .
```

```bash
nano /etc/nginx/sites-available/vedis
###
server {
  listen 80;
  server_name vedis.study www.vedis.study;

  location / {
        root /var/www/vedis;
        index  index.html index.htm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        try_files $uri $uri/ /index.html;
  }

  location /api {
        proxy_pass http://185.233.117.181:8800;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
ln -s /etc/nginx/sites-available/vedis /etc/nginx/sites-enabled/vedis
```

```bash
systemctl reload nginx
```

```bash
nginx -t
```

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

```bash
apt-get install -y nodejs
```

```bash
node -v && npm -v 
```

```bash
cd backend && npm i
```

```bash
nano .env # just copy backend .env

```

```bash
node server.js
```

```bash
npm i -g pm2
```

```bash
pm2 start --name backend server.js
```

```bash
pm2 startup ubuntu
```

```bash
pm2 list
```

## FRONTEND setup
```bash
npm install -g @angular/cli@16.1.0
```

```bash
npm install --legacy-peer-deps
```

```bash
npm run build
```

```bash
mkdir /var/www/vedis
```

```bash
cp -r dist/frontend/* /var/www/vedis
```

```bash
systemctl reload nginx
```

## SSL Certification
```bash
apt install certbot python3-certbot-nginx
```

```bash
certbot --nginx -d vedis.study -d www.vedis.study
```

```bash
systemctl status certbot.timer
```

## Email setup
👉 https://www.youtube.com/watch?v=3dIVesHEAzc
