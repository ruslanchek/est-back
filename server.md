#user
adduser realthub
usermod -aG sudo realthub
su - realthub
mkdir -p ~/.ssh && cd ~/.ssh && touch authorized_keys

#utils and nginx
sudo apt-get update
sudo apt-get install -y curl mc nginx
sudo systemctl enable nginx

#node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
sudo npm install pm2 -g

#postgres
sudo apt-get install -y postgresql postgresql-contrib
sudo -i -u postgres
psql

##postgres manage
createuser --interactive
//Enter name of role to add: realthub
//Shall the new role be a superuser superuser: -y
createdb realthub

##postgres exit
\q
exit

##postgres next as realhub user
psql
\conninfo
SHOW config_file;
sudo nano /etc/postgresql/9.5/main/postgresql.conf
listen_addresses = '*'
sudo /etc/init.d/postgresql restart

##postgres allow all
sudo nano /etc/postgresql/9.5/main/pg_hba.conf

local   postgres        postgres        peer
host    all             all              0.0.0.0/0                       md5
host    all             all              ::/0                            md5

sudo /etc/init.d/postgresql restart
psql
ALTER USER realthub PASSWORD 'my_postgres_password';