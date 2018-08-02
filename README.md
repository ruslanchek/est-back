# est-back

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## Test

```
bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

#Server config
##Create new user
```
adduser realthub
usermod -aG sudo realthub
su - realthub
mkdir -p ~/.ssh && cd ~/.ssh && touch authorized_keys
```

##Install utils and Nginx
```
sudo apt-get update
sudo apt-get install -y htop curl mc nginx
sudo systemctl enable nginx
```

##Basic auth
```
sudo sh -c "echo -n 'happy:' >> /etc/nginx/.htpasswd"
sudo sh -c "openssl passwd -apr1 >> /etc/nginx/.htpasswd"
```

##Nginx config
`sudo nano /etc/nginx/sites-available/default`

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name realthub.com www.realthub.com;

	return 301 https://realthub.com$request_uri;
}

server {
    listen 443 ssl;

    server_name www.realthub.com;
    
    ssl_certificate /etc/nginx/ssl/realthub.crt;
    ssl_certificate_key /etc/nginx/ssl/realthub.key;

    return 301 https://realthub.com$request_uri;
}

server {
    listen 443 ssl;

    server_name realthub.com;
    ssl_certificate /etc/nginx/ssl/realthub.crt;
    ssl_certificate_key /etc/nginx/ssl/realthub.key;
    
    rewrite ^/(.*)/$ /$1 permanent;

    location / {
        root /home/realthub/apps/web/dist;
        try_files $uri $uri/ /index.html;
        gzip_static on;
        expires max;
        add_header Cache-Control public;
        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    location /api {
        proxy_pass http://localhost:5566/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

###Set correct rights for static
`sudo chown -R :www-data ~/apps/web/dist`

###Test Nginx config
`sudo nginx -t`

###Restart Nginx
`sudo service nginx restart`

##NodeJS
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
sudo npm install pm2 -g
pm2 startup
```

##PostgreSQL
```
sudo apt-get install -y postgresql postgresql-contrib
sudo -i -u postgres
psql
```

###Manage
```
createuser --interactive
//Enter name of role to add: realthub
//Shall the new role be a superuser superuser: -y
createdb realthub
```

###Exit
```
\q
exit
```

Then login as new user (relathub)

###As new user
```
psql
\conninfo
SHOW config_file;
sudo nano /etc/postgresql/9.5/main/postgresql.conf
listen_addresses = '*'
sudo /etc/init.d/postgresql restart
```

###Allow all
`sudo nano /etc/postgresql/9.5/main/pg_hba.conf`

```
local   postgres        postgres        peer
host    all             all              0.0.0.0/0                       md5
host    all             all              ::/0                            md5
```

```
sudo /etc/init.d/postgresql restart
psql
ALTER USER realthub PASSWORD '******';
```

