# 🌊 Instalación de n8n en DigitalOcean

> **Guía paso a paso para desplegar n8n en DigitalOcean - La opción más amigable para principiantes**

## 📋 Índice

- [🌟 ¿Por qué DigitalOcean?](#-por-qué-digitalocean)
- [📋 Requisitos Previos](#-requisitos-previos)
- [🚀 Creación del Droplet](#-creación-del-droplet)
- [🔧 Configuración Inicial](#-configuración-inicial)
- [📦 Instalación con Docker](#-instalación-con-docker)
- [🎼 Instalación con Docker Compose](#-instalación-con-docker-compose)
- [🔒 Configuración de Seguridad](#-configuración-de-seguridad)
- [🌐 Configuración de Dominio](#-configuración-de-dominio)
- [📊 Monitoreo Básico](#-monitoreo-básico)

---

## 🌟 ¿Por qué DigitalOcean?

### ✅ **Ventajas**
- **🎯 Simplicidad**: Interface más amigable del mercado
- **📖 Documentación**: Tutoriales excelentes y community support
- **💰 Precio transparente**: Sin costos ocultos, billing predecible
- **🚀 Performance**: SSD NVMe, networking optimizado
- **🌍 Global**: Múltiples datacenters worldwide
- **🔧 One-Click Apps**: Instalaciones preconfiguradas

### 📊 **Configuraciones Recomendadas**

| Uso | vCPUs | RAM | Storage | Precio/Mes | Droplet Size |
|-----|-------|-----|---------|------------|--------------|
| **🧪 Testing** | 1 | 1GB | 25GB SSD | $6 | s-1vcpu-1gb |
| **👤 Personal** | 1 | 2GB | 50GB SSD | $12 | s-1vcpu-2gb |
| **👥 Equipo** | 2 | 4GB | 80GB SSD | $24 | s-2vcpu-4gb |
| **🏢 Producción** | 4 | 8GB | 160GB SSD | $48 | s-4vcpu-8gb |

---

## 📋 Requisitos Previos

### 🔑 **Cuenta y Configuración**
1. **Cuenta DigitalOcean** (🎁 $100 créditos gratis con referral)
2. **SSH Key** configurada
3. **Dominio** (opcional pero recomendado)
4. **Básicos de terminal** Linux

### 🛠️ **Herramientas Locales**
```bash
# Windows (PowerShell)
# Instalar OpenSSH si no está disponible
Add-WindowsCapability -Online -Name OpenSSH.Client

# Verificar conexión SSH
ssh -V
```

---

## 🚀 Creación del Droplet

### 📺 **Paso 1: Crear Droplet via Web Console**

1. **Login** en DigitalOcean Dashboard
2. **Create → Droplets**
3. **Configuración recomendada**:

```yaml
Image: Ubuntu 22.04 LTS x64
Plan: 
  - Basic: $12/mes (2GB RAM, 1 vCPU, 50GB SSD)
  - Regular Intel with SSD
Datacenter: 
  - Elige el más cercano a tus usuarios
  - Recomendado: Nueva York, Amsterdam, Singapur
Authentication:
  - SSH Keys (más seguro)
  - O Password (cambiar inmediatamente)
Hostname: n8n-production
Tags: n8n, automation, production
```

### 🖥️ **Paso 2: Crear Droplet via CLI (Opcional)**

```bash
# Instalar doctl (DigitalOcean CLI)
# Windows con Chocolatey
choco install doctl

# Autenticarse
doctl auth init

# Crear droplet
doctl compute droplet create n8n-prod \
  --image ubuntu-22-04-x64 \
  --size s-1vcpu-2gb \
  --region nyc3 \
  --ssh-keys $(doctl compute ssh-key list --format ID --no-header) \
  --tag-names n8n,production
```

---

## 🔧 Configuración Inicial

### 🔐 **Conexión SSH**

```bash
# Conectar al droplet
ssh root@YOUR_DROPLET_IP

# Actualizar sistema
apt update && apt upgrade -y

# Instalar utilidades básicas
apt install -y curl wget git nano htop ufw fail2ban
```

### 👤 **Crear Usuario No-Root**

```bash
# Crear usuario
adduser n8nuser
usermod -aG sudo n8nuser

# Configurar SSH para nuevo usuario
mkdir /home/n8nuser/.ssh
cp ~/.ssh/authorized_keys /home/n8nuser/.ssh/
chown -R n8nuser:n8nuser /home/n8nuser/.ssh
chmod 700 /home/n8nuser/.ssh
chmod 600 /home/n8nuser/.ssh/authorized_keys

# Probar conexión
ssh n8nuser@YOUR_DROPLET_IP
```

### 🔥 **Configurar Firewall Básico**

```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5678  # n8n puerto
sudo ufw --force enable

# Verificar status
sudo ufw status
```

---

## 📦 Instalación con Docker

### 🐳 **Instalar Docker**

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker n8nuser

# Logout y login para aplicar cambios
exit
ssh n8nuser@YOUR_DROPLET_IP

# Verificar instalación
docker --version
docker run hello-world
```

### 🚀 **Ejecutar n8n con Docker**

```bash
# Crear directorio para datos
mkdir -p ~/.n8n

# Ejecutar n8n básico
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=YourSecurePassword123! \
  -e N8N_HOST=YOUR_DROPLET_IP \
  -e WEBHOOK_URL=http://YOUR_DROPLET_IP:5678/ \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Verificar que funciona
docker ps
curl http://YOUR_DROPLET_IP:5678
```

---

## 🎼 Instalación con Docker Compose

### 📝 **Crear docker-compose.yml**

```bash
# Crear directorio del proyecto
mkdir ~/n8n-production
cd ~/n8n-production

# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - N8N_HOST=${N8N_HOST}
      - N8N_PROTOCOL=${N8N_PROTOCOL}
      - N8N_PORT=5678
      - WEBHOOK_URL=${WEBHOOK_URL}
      - N8N_METRICS=true
      - N8N_LOG_LEVEL=info
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
    networks:
      - n8n_network

  postgres:
    image: postgres:15
    container_name: n8n_postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - n8n_network

  nginx:
    image: nginx:alpine
    container_name: n8n_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - n8n
    networks:
      - n8n_network

volumes:
  n8n_data:
  postgres_data:

networks:
  n8n_network:
    driver: bridge
EOF
```

### 🔐 **Crear archivo .env**

```bash
# Crear archivo de variables de entorno
cat > .env << 'EOF'
# n8n Configuration
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=YourSuperSecurePassword123!
N8N_HOST=your-domain.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-domain.com

# Database Configuration
POSTGRES_DB=n8n
POSTGRES_USER=n8n_user
POSTGRES_PASSWORD=AnotherSecurePassword456!
EOF

# Proteger archivo de variables
chmod 600 .env
```

### 🌐 **Crear configuración Nginx**

```bash
# Crear nginx.conf
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream n8n {
        server n8n:5678;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        ssl_session_timeout 1d;
        ssl_session_cache shared:MozTLS:10m;
        ssl_session_tickets off;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;

        add_header Strict-Transport-Security "max-age=63072000" always;

        client_max_body_size 16M;

        location / {
            proxy_pass http://n8n;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF
```

### 🚀 **Iniciar los Servicios**

```bash
# Ejecutar con docker-compose
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f n8n
```

---

## 🔒 Configuración de Seguridad

### 🔐 **SSL con Let's Encrypt**

```bash
# Instalar certbot
sudo apt install -y snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Crear certificado
sudo certbot certonly --standalone \
  -d your-domain.com \
  --email your-email@domain.com \
  --agree-tos \
  --no-eff-email

# Copiar certificados
sudo mkdir -p ~/n8n-production/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ~/n8n-production/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ~/n8n-production/ssl/key.pem
sudo chown -R n8nuser:n8nuser ~/n8n-production/ssl
```

### 🔄 **Auto-renovación SSL**

```bash
# Crear script de renovación
cat > ~/ssl-renew.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ~/n8n-production/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ~/n8n-production/ssl/key.pem
docker-compose -f ~/n8n-production/docker-compose.yml restart nginx
EOF

chmod +x ~/ssl-renew.sh

# Configurar crontab
(crontab -l 2>/dev/null; echo "0 3 * * * ~/ssl-renew.sh") | crontab -
```

---

## 🌐 Configuración de Dominio

### 📍 **DNS en DigitalOcean**

1. **Agregar dominio** en DigitalOcean Dashboard
2. **Crear registros DNS**:

```
A     @          YOUR_DROPLET_IP
A     www        YOUR_DROPLET_IP
AAAA  @          YOUR_DROPLET_IPv6 (opcional)
CNAME webhook    your-domain.com
```

### 🔗 **Configurar Subdominios** (Opcional)

```bash
# Para subdominios como n8n.your-domain.com
# Actualizar nginx.conf y certificados
server_name n8n.your-domain.com;

# Obtener certificado para subdominio
sudo certbot certonly --standalone -d n8n.your-domain.com
```

---

## 📊 Monitoreo Básico

### 📈 **Instalar htop y monitoring tools**

```bash
# Herramientas de monitoreo
sudo apt install -y htop iotop nethogs

# Ver recursos en tiempo real
htop

# Monitorear docker containers
docker stats
```

### 🔍 **Logs y Debugging**

```bash
# Ver logs de n8n
docker-compose logs -f n8n

# Ver logs del sistema
sudo journalctl -fu docker

# Revisar uso de disco
df -h
du -sh ~/.n8n
```

### 📱 **Configurar Alertas Básicas**

```bash
# Script de monitoreo simple
cat > ~/monitor-n8n.sh << 'EOF'
#!/bin/bash

# Verificar que n8n esté corriendo
if ! docker ps | grep -q n8n; then
    echo "n8n container is down!" | mail -s "n8n Alert" your-email@domain.com
    docker-compose -f ~/n8n-production/docker-compose.yml restart
fi

# Verificar uso de disco
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is ${DISK_USAGE}%" | mail -s "Disk Usage Alert" your-email@domain.com
fi
EOF

chmod +x ~/monitor-n8n.sh

# Ejecutar cada 5 minutos
(crontab -l 2>/dev/null; echo "*/5 * * * * ~/monitor-n8n.sh") | crontab -
```

---

## ✅ Verificación Final

### 🧪 **Checklist de Instalación**

- [ ] ✅ **Droplet creado** y accesible via SSH
- [ ] ✅ **Usuario no-root** configurado
- [ ] ✅ **Firewall activado** con puertos necesarios
- [ ] ✅ **Docker instalado** y funcionando
- [ ] ✅ **n8n ejecutándose** en containers
- [ ] ✅ **Base de datos** PostgreSQL funcionando
- [ ] ✅ **SSL certificado** instalado y válido
- [ ] ✅ **Nginx proxy** configurado correctamente
- [ ] ✅ **Dominio apuntando** al droplet
- [ ] ✅ **Backup automático** configurado
- [ ] ✅ **Monitoreo básico** activo

### 🔗 **URLs de Prueba**

```bash
# Verificar que todo funciona
curl -I https://your-domain.com
curl -I https://your-domain.com/webhook-test/your-webhook-id

# Verificar redirección HTTP → HTTPS
curl -I http://your-domain.com
```

---

## 🆘 Solución de Problemas

### ❌ **Problemas Comunes**

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **No se conecta** | Connection refused | Verificar firewall y puertos |
| **SSL error** | Certificate invalid | Renovar certificado Let's Encrypt |
| **n8n no inicia** | Container exits | Verificar logs: `docker-compose logs n8n` |
| **DB connection** | Database error | Verificar PostgreSQL container |
| **Performance lenta** | Timeouts | Aumentar recursos del droplet |

### 🔍 **Comandos de Debug**

```bash
# Estado general
docker-compose ps
docker-compose logs --tail=50

# Recursos del sistema
free -h
df -h
top

# Conectividad
netstat -tlnp
ss -tlnp
```

---

## 💰 Optimización de Costos

### 💡 **Tips para Ahorrar**

1. **🕐 Apagar durante desarrollo**: Snapshots para preservar configuración
2. **📊 Monitoring de uso**: DigitalOcean Monitoring gratis
3. **🔄 Reserved Instances**: Para uso de producción a largo plazo
4. **📦 Imágenes optimizadas**: Usar Alpine Linux cuando sea posible

### 📊 **Cálculo de Costos Mensuales**

```
Droplet s-2vcpu-4gb:     $24/mes
Backup automático:       $2.40/mes (10% del droplet)
Load Balancer:           $10/mes (si necesario)
Volúmenes adicionales:   $0.10/GB/mes

Total típico:            ~$27-35/mes
```

---

## 🚀 Próximos Pasos

Una vez que tienes n8n ejecutándose exitosamente:

1. **📖 Configura autenticación** OAuth o SAML
2. **🔄 Implementa backup automático** completo
3. **📊 Configura monitoreo avanzado** con Grafana
4. **🚀 Escala horizontalmente** con múltiples instancias
5. **🔒 Implementa seguridad avanzada** con VPC y WAF

---

> **🎉 ¡Felicitaciones!** Has instalado exitosamente n8n en DigitalOcean. Tu instancia está lista para automatizar workflows de manera profesional y escalable.

**💡 Tip final**: Considera configurar un entorno de staging idéntico para probar workflows antes de desplegar a producción.