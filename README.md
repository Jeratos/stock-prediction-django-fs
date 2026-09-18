# 📈 Stock Prediction Web Application

A full-stack stock market prediction platform built with **Django REST Framework (DRF)** and **React (Vite + Tailwind CSS)**, fully containerized using **Docker** and automated with **GitHub Actions CI/CD** for continuous deployment to any **VPS** (Hostinger, DigitalOcean, Hetzner, Linode) or **AWS EC2**.

---

## 📑 Table of Contents

1. [Project Architecture & Structure](#project-architecture--structure)
2. [Local Development with Docker](#local-development-with-docker)
   - [Backend Dockerfile](#1-backend-dockerfile-backend-drfdockerfile)
   - [Frontend Dockerfile](#2-frontend-dockerfile-frontend-reactdockerfile)
   - [Docker Compose](#3-docker-compose-docker-composeyml)
   - [Running Locally](#4-running-locally)
3. [Server Setup Guide (VPS & AWS EC2)](#server-setup-guide-vps--aws-ec2)
   - [Step 1: Launch Server & Security Rules / Firewall](#step-1-launch-server--configure-ports--firewall)
   - [Step 2: Connect & Install Docker & Docker Compose](#step-2-connect--install-docker-and-docker-compose)
   - [Step 3: Setup SSH Authentication for GitHub Actions](#step-3-setup-ssh-authentication-for-github-actions)
   - [Step 4: Initial Code Clone & Environment Setup](#step-4-initial-code-clone--environment-setup)
4. [GitHub Actions CI/CD Pipeline](#github-actions-cicd-pipeline)
   - [Setting GitHub Secrets](#setting-github-repository-secrets)
   - [Workflow Configuration File](#workflow-configuration-deployyaml)
   - [Testing Automated Deployment](#testing-automated-deployment)
5. [Useful Operational Commands & Troubleshooting](#useful-operational-commands--troubleshooting)

---

## 🏛️ Project Architecture & Structure

```
stock-prediction/
├── .github/
│   └── workflows/
│       └── deploy.yaml         # CI/CD pipeline triggered on git push
├── backend-DRF/
│   ├── .env                    # Django environment secrets (SECRET_KEY, DEBUG)
│   ├── Dockerfile              # Python 3.12 slim container
│   ├── requirements.txt        # Python dependencies
│   ├── manage.py
│   └── stock_pradiction_main/  # Django project settings & API endpoints
├── frontend-react/
│   ├── .env                    # Frontend environment (VITE_BASE_URL)
│   ├── Dockerfile              # Node 20 alpine dev/build container
│   ├── package.json
│   ├── vite.config.ts          # Vite server port & network host configuration
│   └── src/                    # React UI & components
└── docker-compose.yml          # Orchestrates frontend & backend containers
```

---

## 🐳 Local Development with Docker

### 1. Backend Dockerfile (`backend-DRF/Dockerfile`)
Uses Python 3.12 slim, installs dependencies, runs database migrations, and exposes port 8000:
```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
```

### 2. Frontend Dockerfile (`frontend-react/Dockerfile`)
Uses Node 20 alpine, mounts code, and runs Vite with external network access enabled:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5175

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### 3. Docker Compose (`docker-compose.yml`)
Binds ports and mounts local directories for hot-reloading:
```yaml
services:
  backend:
    build:
      context: ./backend-DRF
      dockerfile: Dockerfile
    container_name: stock_prediction_backend
    command: >
      sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
    ports:
      - "8000:8000"
    volumes:
      - ./backend-DRF:/app
    env_file:
      - ./backend-DRF/.env

  frontend:
    build:
      context: ./frontend-react
      dockerfile: Dockerfile
    container_name: stock_prediction_frontend
    ports:
      - "5175:5175"
    volumes:
      - ./frontend-react:/app
      - /app/node_modules
    env_file:
      - ./frontend-react/.env
    depends_on:
      - backend
```

### 4. Running Locally
```powershell
# Build and run containers in detached mode
docker compose up --build -d

# Check running containers
docker compose ps

# View live container logs
docker compose logs -f

# Stop containers
docker compose down
```
- **Backend API**: `http://localhost:8000`
- **Frontend App**: `http://localhost:5175`

---

## 🌐 Server Setup Guide (VPS & AWS EC2)

Follow these steps on a clean Ubuntu 22.04 or 24.04 server.

### Step 1: Launch Server & Configure Ports / Firewall

#### For AWS EC2:
1. Launch an Ubuntu instance (e.g., `t2.medium` or `t3.small`).
2. In the **Security Group** Inbound Rules, add:
   | Type | Port Range | Source | Purpose |
   | :--- | :--- | :--- | :--- |
   | **SSH** | `22` | `0.0.0.0/0` (or your IP) | Remote SSH Access |
   | **Custom TCP** | `8000` | `0.0.0.0/0` | Django Backend API |
   | **Custom TCP** | `5175` | `0.0.0.0/0` | React Frontend App |
   | **HTTP** | `80` | `0.0.0.0/0` | Web Traffic / Nginx |
   | **HTTPS** | `443` | `0.0.0.0/0` | SSL Traffic |

#### For VPS (Hostinger, DigitalOcean, Hetzner, etc.):
If `ufw` (firewall) is enabled, allow the ports:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 8000/tcp
sudo ufw allow 5175/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

### Step 2: Connect & Install Docker and Docker Compose

1. SSH into your server:
   ```bash
   ssh root@<YOUR_SERVER_IP>
   # Or for EC2:
   # ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
   ```

2. Update system packages:
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

3. Install Docker using the official convenience script:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

4. Install Docker Compose plugin & verify:
   ```bash
   sudo apt-get install -y docker-compose-plugin
   docker --version
   docker compose version
   ```

5. *(Optional for non-root users e.g. `ubuntu` on EC2)*: Allow running docker without `sudo`:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

---

### Step 3: Setup SSH Authentication for GitHub Actions

GitHub Actions needs an SSH private key to log into your server and run deployment commands automatically.

1. **On your local machine** (or on the server), generate a dedicated SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy"
   ```
   - When prompted for the file path, save it (e.g. `id_ed25519_deploy`).
   - Leave the passphrase **empty** (press `Enter` twice).

2. **Add the Public Key to the Server**:
   On your server, append the content of `id_ed25519_deploy.pub` to `authorized_keys`:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   nano ~/.ssh/authorized_keys
   ```
   Paste the public key on a new line and save (`Ctrl+O`, `Enter`, `Ctrl+X`).
   Set permissions:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Keep the Private Key (`id_ed25519_deploy`)**:
   You will copy the entire contents of this private key (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) into GitHub Secrets in the next section.

---

### Step 4: Initial Code Clone & Environment Setup

On your server, clone the repository into the exact folder path used by your deployment script:

```bash
# Create directory structure if needed (e.g., /root/ayush/)
mkdir -p /root/ayush
cd /root/ayush

# Clone repository
git clone https://github.com/Jeratos/stock-prediction-django-fs.git
cd stock-prediction-django-fs
```

#### Configure Production `.env` Files
Since `.env` files are not committed to Git for security, create them directly on the server:

1. **Backend `.env`**:
   ```bash
   nano backend-DRF/.env
   ```
   Add:
   ```env
   SECRET_KEY=your-production-secret-key-here
   DEBUG=False
   ```

2. **Frontend `.env`**:
   ```bash
   nano frontend-react/.env
   ```
   Add your server IP or domain:
   ```env
   VITE_BASE_URL=http://<YOUR_SERVER_IP>:8000/api/v1
   ```

3. **Test run on server**:
   ```bash
   docker compose up -d --build
   docker compose ps
   ```
   Access `http://<YOUR_SERVER_IP>:5175` to confirm it is up and running.

---

## 🚀 GitHub Actions CI/CD Pipeline

Every time you push to the `main` branch, GitHub Actions connects via SSH to your server, pulls the latest changes, and rebuilds the containers without downtime.

### Setting GitHub Repository Secrets

1. Navigate to your GitHub repository:
   **Settings** > **Secrets and variables** > **Actions** > Click **New repository secret**.
2. Add the following three secrets:

| Secret Name | Value | Example |
| :--- | :--- | :--- |
| `SSH_HOST` | Server public IP address or domain | `194.164.52.12` or `ec2-xx-xx-xx.compute.amazonaws.com` |
| `VPS_USER` | SSH username | `root` (VPS) or `ubuntu` (AWS EC2) |
| `SSH_KEY` | Entire private key (`id_ed25519_deploy`) | `-----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----` |

---

### Workflow Configuration (`.github/workflows/deploy.yaml`)

This workflow runs on every push to `main`:

```yaml
name: Deploy

on: 
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps: 
      - name: Checkout Code 
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with: 
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.VPS_USER }}   
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /root/ayush/stock-prediction-django-fs
            git pull origin main
            docker compose up -d --build
```

> **Note for AWS EC2 Users**: If your username is `ubuntu` and the project was cloned into `/home/ubuntu/stock-prediction-django-fs`, adjust the `cd` path accordingly in `deploy.yaml`:
> ```bash
> cd /home/ubuntu/stock-prediction-django-fs
> ```

---

### Testing Automated Deployment

1. Make a commit on your local machine:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```
2. Go to the **Actions** tab in your GitHub repository.
3. Click on the running **Deploy** workflow to view live execution logs.
4. Once completed with a green checkmark, your server will automatically be running the updated build.

---

## 🛠️ Useful Operational Commands & Troubleshooting

### Check Container Status
```bash
docker compose ps
```

### View Live Logs
```bash
# View all logs
docker compose logs -f

# View only backend or frontend logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart Containers
```bash
docker compose restart
```

### Rebuild from Scratch (Clear Cache)
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Prune Old / Unused Docker Images (Save Disk Space)
```bash
docker system prune -af
```

### Common Issues & Solutions

- **Permission Denied (publickey)**:
  - Make sure the public key is pasted correctly in `~/.ssh/authorized_keys` on the server.
  - Verify file permissions: `chmod 700 ~/.ssh` and `chmod 600 ~/.ssh/authorized_keys`.
  - Confirm `SSH_KEY` in GitHub Secrets contains the **private** key (not `.pub`).
- **Port 5175 / 8000 Not Accessible**:
  - Check AWS Security Group or VPS firewall (`ufw status`).
  - Make sure `vite.config.ts` includes `server: { host: true, port: 5175 }`.
- **Git Pull Conflicts on Server**:
  - Avoid editing code directly on the server. If files are changed on the server, reset before pulling:
    ```bash
    git reset --hard HEAD
    git pull origin main
    ```
