This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

# deploy to vps

## Stap 1
```bash
ssh root@<DROPLET_IP>

sudo apt update && sudo apt upgrade -y

sudo apt install -y nodejs npm nginx
```

## Stap 2
```bash
sudo nano /etc/nginx/sites-available/nextjs
```
```json
server {
  listen 80;
  server_name YOUR_IP_ADDRESS;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```shell
sudo ln -s /etc/nginx/sites-available/nextjs /etc/nginx/sites-enabled/

sudo nginx -t

sudo service nginx restart
```
##  Stap 3 

```shell
cd /var/www

node -v
sudo apt-get remove nodejs

curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh

nano /tmp/nodesource_setup.sh

sudo bash /tmp/nodesource_setup.sh

git clone https://github.com/ktsyr1/alam.git

NEXT_PUBLIC_API="https://app.alamalmoubdien.com/api"
DB="mongodb+srv://ktsyr1:idlibtp123@cluster0-6xfyu.mongodb.net/alam"
secret="dev"
Email="alsbil.notification@gmail.com"
Pass="foxifwpissdiyqjd"
API="http://app.alamalmoubdien.com/api" 
```

# stap 4

```shell
sudo npm install -g pm2 &&

cd /var/www/alam &&

pm2 start npm --name "alam" -- start &&

pm2 save
```


# stap 5

```shell
 apt-get update &&  sudo apt-get install certbot &&  apt-get install python-certbot-nginx  && apt-get install python3-certbot-nginx 

 nano /etc/nginx/conf.d/app.alamalmoubdien.com.conf

 server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/alam;
    server_name app.alamalmoubdien.com;
}

nginx -t && nginx -s reload && sudo certbot --nginx -d app.alamalmoubdien.com

crontab -e
0 12 * * * /usr/bin/certbot renew --quiet


```
server {

    listen 80;
    server_name app.alamalmoubdien.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}



