# Server Setup README (Git + Docker + Nginx)

This guide deploys the backend service on Ubuntu using Git, Docker, and Nginx reverse proxy.

Target domain format:
- projectname.vishwkarma.net

Container networking model:
- App runs on internal container port 3000
- Docker publishes only to localhost on host machine
- Nginx handles public traffic

## 1) Install required packages on Ubuntu

Run as a sudo user:

sudo apt update
sudo apt install -y git docker.io docker-compose-plugin nginx
sudo systemctl enable --now docker
sudo systemctl enable --now nginx

Optional: allow your user to run docker without sudo (re-login required):

sudo usermod -aG docker $USER

## 2) Clone repository

cd /opt
sudo git clone https://github.com/VanshGolakiya-2910/Taskmanger.git
sudo chown -R $USER:$USER /opt/Taskmanger
cd /opt/Taskmanger

## 3) Create environment file

cp .env.example .env

Open .env and set production values:
- NODE_ENV=production
- PORT=3000
- HOST=0.0.0.0
- DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME
- REDIS_URL
- JWT_ACCESS_SECRET (strong, 32+ chars)
- JWT_REFRESH_SECRET (strong, 32+ chars)
- ALLOWED_ORIGINS=https://projectname.vishwkarma.net

Important:
- Do not commit .env
- Use strong secrets

## 4) Build image on server

cd /opt/Taskmanger
docker build -t taskmanager:latest -f Dockerfile .

## 5) Run container (localhost bind only)

docker rm -f taskmanager 2>/dev/null || true

docker run -d \
  --name taskmanager \
  --env-file /opt/Taskmanger/.env \
  -p 127.0.0.1:3000:3000 \
  --restart unless-stopped \
  taskmanager:latest

## 6) Verify health

curl http://127.0.0.1:3000/health

Expected response: status ok

## 7) Configure Nginx reverse proxy

Create site config:

sudo nano /etc/nginx/sites-available/taskmanager.vishwkarma.net

Paste:

server {
    listen 80;
    server_name taskmanager.vishwkarma.net;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

Enable and reload:

sudo ln -sf /etc/nginx/sites-available/taskmanager.vishwkarma.net /etc/nginx/sites-enabled/taskmanager.vishwkarma.net
sudo nginx -t
sudo systemctl reload nginx

## 8) Firewall (recommended)

Keep app private and expose only web ports:

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000/tcp

## 9) Update deployment via Git

cd /opt/Taskmanger
git pull origin main
docker build -t taskmanager:latest -f Dockerfile .
docker rm -f taskmanager
docker run -d \
  --name taskmanager \
  --env-file /opt/Taskmanger/.env \
  -p 127.0.0.1:3000:3000 \
  --restart unless-stopped \
  taskmanager:latest

## 10) Logs and status

docker ps
docker logs -f taskmanager

Notes:
- App logs are stdout/stderr via docker logs
- No HTTPS inside container; terminate TLS at Nginx
- No direct internet exposure of container port
