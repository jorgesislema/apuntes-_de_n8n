# Instalación de n8n en Hostinger VPS

> **Guía completa para instalar n8n en Hostinger - El proveedor más amigable para principiantes**

## Índice

- [Introducción a Hostinger](#introducción-a-hostinger)
- [Creación de Cuenta y VPS](#creación-de-cuenta-y-vps)
- [Configuración Inicial del Servidor](#configuración-inicial-del-servidor)
- [Instalación de n8n con Docker](#instalación-de-n8n-con-docker)
- [Configuración de Seguridad](#configuración-de-seguridad)
- [Configuración del Panel hPanel](#configuración-del-panel-hpanel)
- [Optimización para Hostinger](#optimización-para-hostinger)
- [Troubleshooting](#troubleshooting)

---

## Introducción a Hostinger

Hostinger se destaca por su interfaz extremadamente amigable y soporte en español, perfecto para usuarios que comienzan con VPS.

### Ventajas de Hostinger

- **Interfaz muy amigable**: Panel hPanel intuitivo
- **Soporte en español**: Chat 24/7 en español
- **Precios competitivos**: Desde $1.99/mes
- **Configuración automática**: Muchas tareas automatizadas
- **Backups incluidos**: Backups semanales automáticos
- **Red global**: 7 ubicaciones mundiales

### Desventajas a Considerar

- **Recursos limitados en planes básicos**: Menos recursos que competidores
- **Menos control avanzado**: Enfocado en simplicidad vs control
- **Renovaciones más caras**: Precios promocionales para primer periodo

### Especificaciones Recomendadas

| Uso | Plan Recomendado | Precio Promo | Recursos |
|-----|------------------|--------------|----------|
| **Testing/Personal** | VPS 1 | $1.99/mes | 1GB RAM, 1 vCPU, 20GB SSD |
| **Desarrollo** | VPS 2 | $2.99/mes | 2GB RAM, 2 vCPU, 40GB SSD |
| **Pequeño Equipo** | VPS 3 | $4.99/mes | 3GB RAM, 2 vCPU, 60GB SSD |
| **Producción** | VPS 4 | $8.99/mes | 4GB RAM, 3 vCPU, 80GB SSD |

---

## Creación de Cuenta y VPS

### Paso 1: Registro en Hostinger

1. Ve a [hostinger.com](https://hostinger.com)
2. Haz click en "VPS Hosting"
3. Selecciona el plan que necesites
4. Completa el registro:
   ```
   Email: tu-email@ejemplo.com
   Password: [contraseña segura]
   Información de pago: [tarjeta/PayPal]
   ```
5. Aprovecha códigos de descuento si están disponibles

### Paso 2: Acceder al Panel hPanel

1. **Ingresa al hPanel** en [hostinger.com/cpanel-login](https://hostinger.com/cpanel-login)
2. **Busca tu VPS** en la sección "VPS"
3. **Click en "Administrar"**

### Paso 3: Configurar el VPS

#### Configuración Inicial en hPanel

1. **Ve a "VPS" → "Configuraciones"**
2. **Elige el sistema operativo**:
   ```
   Recomendado: Ubuntu 22.04
   Alternativas: Ubuntu 20.04, CentOS 8, Debian 11
   ```

3. **Configurar acceso**:
   - **Nombre de host**: n8n-hostinger
   - **Contraseña root**: [genera contraseña fuerte]
   - **SSH Key**: [opcional, agregar si tienes]

4. **Ubicación del servidor**:
   - **Estados Unidos** (East/West)
   - **Reino Unido** (Europa)
   - **Países Bajos** (Europa)
   - **Singapur** (Asia)
   - **Brasil** (Sudamérica)
   - **India** (Asia)

5. **Click en "Crear VPS"**

### Paso 4: Obtener Datos de Conexión

En el hPanel verás:
```
IP Address: XXX.XXX.XXX.XXX
Username: root
Password: [tu contraseña]
SSH Port: 22
```

---

## Configuración Inicial del Servidor

### Paso 1: Conexión SSH

Hostinger ofrece varias formas de conectarse:

#### Opción A: Browser Terminal (Más fácil)
1. En hPanel, ve a tu VPS
2. Click en "Browser Terminal"
3. Se abrirá terminal en el navegador
4. Login automático como root

#### Opción B: SSH Tradicional
```bash
# Desde tu computadora
ssh root@TU_IP_SERVIDOR

# O usando PuTTY en Windows
# Host: TU_IP_SERVIDOR
# Port: 22
# Username: root
# Password: tu_contraseña
```

### Paso 2: Actualización del Sistema

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar herramientas esenciales
apt install -y curl wget git nano htop ufw unzip

# Verificar información del sistema
hostnamectl
```

### Paso 3: Configurar Usuario Dedicado

```bash
# Crear usuario para n8n
adduser n8nuser

# Seguir prompts:
# New password: [contraseña segura]
# Retype new password: [repetir contraseña]
# [Enter para valores por defecto en datos personales]

# Agregar a sudo
usermod -aG sudo n8nuser

# Cambiar a usuario n8n
su - n8nuser
```

### Paso 4: Configuración Básica de Seguridad

```bash
# Regresar a root temporalmente
exit

# Configurar timezone
timedatectl set-timezone America/Mexico_City

# Configurar hostname
hostnamectl set-hostname n8n-hostinger

# Verificar
hostnamectl
```

---

## Instalación de n8n con Docker

### Paso 1: Instalar Docker

```bash
# Cambiar a usuario n8n
su - n8nuser

# Instalar Docker (script oficial)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios sin reiniciar
newgrp docker

# Verificar instalación
docker --version
docker run hello-world
```

### Paso 2: Instalar Docker Compose

```bash
# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker-compose --version
```

### Paso 3: Crear Estructura de Proyecto

```bash
# Crear directorio de trabajo
mkdir -p /home/n8nuser/n8n-hostinger
cd /home/n8nuser/n8n-hostinger

# Crear estructura
mkdir -p {data,logs,backups,scripts}
```

### Paso 4: Configuración Docker Compose

```yaml
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n_hostinger
    restart: always
    ports:
      - "5678:5678"
    environment:
      # Configuración básica
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=CambiarPassword123!
      
      # Configuración de URL
      - WEBHOOK_URL=http://TU_IP_SERVIDOR:5678/
      - N8N_HOST=TU_IP_SERVIDOR
      - N8N_PORT=5678
      
      # Timezone
      - GENERIC_TIMEZONE=America/Mexico_City
      - TZ=America/Mexico_City
      
      # Base de datos SQLite (simple para Hostinger)
      - DB_TYPE=sqlite
      - DB_SQLITE_DATABASE=/home/node/.n8n/database.sqlite
      
      # Configuración de logging
      - N8N_LOG_LEVEL=info
      - N8N_LOG_FILE=/home/node/.n8n/logs/n8n.log
      
      # Optimización para Hostinger
      - NODE_OPTIONS=--max-old-space-size=1024
      
      # Configuración de ejecución
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
    
    volumes:
      - ./data:/home/node/.n8n
      - ./logs:/home/node/.n8n/logs
      - /var/run/docker.sock:/var/run/docker.sock:ro
    
    # Límites de recursos para Hostinger
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

    # Healthcheck
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  n8n_data:
    driver: local
EOF
```

### Paso 5: Variables de Entorno

```bash
# Crear archivo .env
cat > .env << 'EOF'
# Hostinger n8n Configuration
COMPOSE_PROJECT_NAME=n8n-hostinger

# Basic Authentication
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=MiPasswordSegura123!

# Server Configuration
SERVER_IP=TU_IP_SERVIDOR
N8N_HOST=TU_IP_SERVIDOR
WEBHOOK_URL=http://TU_IP_SERVIDOR:5678/

# Resource Configuration for Hostinger
NODE_OPTIONS=--max-old-space-size=1024
N8N_LOG_LEVEL=info

# Timezone
TZ=America/Mexico_City
GENERIC_TIMEZONE=America/Mexico_City
EOF

# Obtener IP real del servidor
IP_SERVIDOR=$(curl -s ifconfig.me)
echo "IP del servidor: $IP_SERVIDOR"

# Reemplazar en archivos
sed -i "s/TU_IP_SERVIDOR/$IP_SERVIDOR/g" .env
sed -i "s/TU_IP_SERVIDOR/$IP_SERVIDOR/g" docker-compose.yml

echo "Archivos configurados con IP: $IP_SERVIDOR"
```

---

## Configuración de Seguridad

### Paso 1: Configurar Firewall con UFW

```bash
# Activar UFW
sudo ufw --force enable

# Permitir SSH
sudo ufw allow ssh

# Permitir n8n
sudo ufw allow 5678/tcp

# Permitir HTTP/HTTPS para futuro
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ver reglas
sudo ufw status verbose
```

### Paso 2: Instalar y Configurar Fail2Ban

```bash
# Instalar fail2ban
sudo apt install fail2ban -y

# Crear configuración personalizada
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Editar configuración
sudo nano /etc/fail2ban/jail.local

# Buscar [DEFAULT] y modificar:
# bantime = 3600      # 1 hora de ban
# findtime = 600      # 10 minutos de ventana
# maxretry = 5        # 5 intentos máximo

# Buscar [sshd] y asegurar:
# enabled = true
# port = ssh
# maxretry = 3        # Solo 3 intentos para SSH

# Reiniciar fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# Verificar estado
sudo fail2ban-client status
```

### Paso 3: Configuración SSH Mejorada

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config

# Cambios recomendados:
# Port 2222                      # Cambiar puerto (opcional)
# PermitRootLogin no            # Deshabilitar root login
# MaxAuthTries 3                # Máximo 3 intentos
# ClientAliveInterval 300       # Keep-alive cada 5 min
# ClientAliveCountMax 2         # Max 2 keep-alive sin respuesta

# Reiniciar SSH
sudo systemctl restart sshd

# IMPORTANTE: Prueba nueva conexión en otra terminal antes de cerrar esta
```

---

## Configuración del Panel hPanel

### Paso 1: Configurar Monitoreo en hPanel

1. **Ve a hPanel → VPS → Monitoreo**
2. **Habilita alertas**:
   - CPU > 80%
   - RAM > 85%
   - Disco > 85%
3. **Configura notificaciones por email**

### Paso 2: Configurar Backups en hPanel

1. **Ve a hPanel → VPS → Backups**
2. **Habilita backup automático semanal**
3. **Configura retención**: 4 semanas
4. **Hora de backup**: 2:00 AM (tu timezone)

### Paso 3: Configurar Dominio (Opcional)

Si tienes un dominio registrado en Hostinger:

1. **Ve a hPanel → Dominios**
2. **Selecciona tu dominio**
3. **Ve a "DNS Zone Editor"**
4. **Agregar registro A**:
   ```
   Type: A
   Name: n8n (o subdominio que prefieras)
   Points to: TU_IP_VPS
   TTL: 14400
   ```
5. **Guardar cambios**

---

## Iniciar n8n

### Paso 1: Lanzar Contenedores

```bash
# Asegurar estar en directorio correcto
cd /home/n8nuser/n8n-hostinger

# Iniciar servicios en background
docker-compose up -d

# Verificar que esté ejecutándose
docker-compose ps

# Ver logs iniciales
docker-compose logs -f n8n
```

### Paso 2: Verificar Funcionamiento

```bash
# Test local
curl http://localhost:5678

# Test externo
curl http://TU_IP_SERVIDOR:5678

# Verificar salud del contenedor
docker-compose exec n8n wget --quiet --tries=1 --spider http://localhost:5678/healthz
echo $?  # Debe retornar 0 si está sano
```

### Paso 3: Acceso Web

1. **Abre navegador**
2. **Ve a**: `http://TU_IP_SERVIDOR:5678`
3. **Login con credenciales**:
   - Usuario: `admin`
   - Password: `MiPasswordSegura123!`

---

## Optimización para Hostinger

### Optimización de Memoria

```bash
# Crear archivo swap (especialmente para VPS 1-2GB)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacer permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Configurar swappiness para optimizar
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# Verificar
free -h
cat /proc/swaps
```

### Script de Monitoreo Hostinger

```bash
# Crear script de monitoreo
cat > monitor-hostinger.sh << 'EOF'
#!/bin/bash
# Monitor para n8n en Hostinger

echo "=== n8n Monitor Hostinger ==="
echo "Fecha: $(date)"
echo "Hostname: $(hostname)"
echo

# Estado de Docker
echo "--- Docker Status ---"
if systemctl is-active docker &>/dev/null; then
    echo "✓ Docker: Activo"
else
    echo "✗ Docker: Inactivo"
fi

# Estado de n8n
echo
echo "--- n8n Status ---"
if docker-compose ps | grep -q "Up"; then
    echo "✓ n8n: Ejecutándose"
    
    # Health check
    if docker-compose exec -T n8n wget --quiet --tries=1 --spider http://localhost:5678/healthz 2>/dev/null; then
        echo "✓ n8n: Saludable"
    else
        echo "⚠ n8n: Responde pero no healthy"
    fi
else
    echo "✗ n8n: No ejecutándose"
fi

# Recursos
echo
echo "--- Recursos ---"
echo "CPU Load: $(uptime | awk -F'load average:' '{ print $2 }')"
echo "Memoria:"
free -h | grep -E "^Mem|^Swap"

echo
echo "--- Disco ---"
df -h / | grep -v Filesystem

echo
echo "--- n8n Container Stats ---"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" n8n_hostinger 2>/dev/null || echo "Container no encontrado"

echo
echo "--- Últimas 5 líneas del log ---"
docker-compose logs --tail=5 n8n 2>/dev/null || echo "No se pudieron obtener logs"
EOF

chmod +x monitor-hostinger.sh

# Ejecutar monitor
./monitor-hostinger.sh
```

### Configuración de Logs Optimizada

```bash
# Configurar rotación de logs para Docker
sudo nano /etc/docker/daemon.json

# Contenido:
cat << 'EOF' | sudo tee /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Reiniciar Docker
sudo systemctl restart docker

# Reiniciar n8n para aplicar cambios
cd /home/n8nuser/n8n-hostinger
docker-compose restart
```

---

## Configurar SSL/HTTPS

### Paso 1: Instalar Nginx

```bash
# Instalar Nginx
sudo apt install nginx -y

# Iniciar y habilitar
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar
sudo systemctl status nginx
```

### Paso 2: Configurar Reverse Proxy

```bash
# Crear configuración para n8n
sudo nano /etc/nginx/sites-available/n8n

# Contenido (reemplazar tu-dominio.com):
cat << 'EOF' | sudo tee /etc/nginx/sites-available/n8n
server {
    listen 80;
    server_name tu-dominio.com;  # Cambiar por tu dominio

    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support for n8n
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout       60s;
        proxy_send_timeout          60s;
        proxy_read_timeout          60s;
    }
}
EOF

# Activar sitio
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/

# Desactivar sitio por defecto
sudo unlink /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### Paso 3: Certificado SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL (reemplazar tu-dominio.com)
sudo certbot --nginx -d tu-dominio.com

# Seguir prompts:
# Email: tu-email@ejemplo.com
# Términos: A (Accept)
# Emails promocionales: Y/N (tu preferencia)
# HTTPS redirect: 2 (Redirect HTTP to HTTPS)

# Verificar auto-renovación
sudo certbot renew --dry-run

# Programar renovación automática
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
```

---

## Scripts de Automatización

### Backup Script

```bash
# Crear script de backup
cat > backup-hostinger.sh << 'EOF'
#!/bin/bash
# Script de backup para n8n en Hostinger

BACKUP_DIR="/home/n8nuser/n8n-hostinger/backups"
DATE=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=7

echo "=== Backup n8n Hostinger ==="
echo "Fecha: $(date)"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Parar n8n para consistencia
echo "Pausando n8n..."
cd /home/n8nuser/n8n-hostinger
docker-compose stop n8n

# Backup de datos
echo "Backing up data..."
sudo tar czf $BACKUP_DIR/n8n-data-$DATE.tar.gz -C data .

# Backup de configuración
echo "Backing up configuration..."
tar czf $BACKUP_DIR/n8n-config-$DATE.tar.gz docker-compose.yml .env

# Restart n8n
echo "Reiniciando n8n..."
docker-compose start n8n

# Limpiar backups antiguos
echo "Limpiando backups antiguos..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "Backup completado en $BACKUP_DIR"
ls -la $BACKUP_DIR/

# Verificar que n8n esté funcionando
sleep 10
if curl -f http://localhost:5678/healthz &>/dev/null; then
    echo "✓ n8n funcionando correctamente después del backup"
else
    echo "⚠ ADVERTENCIA: n8n podría tener problemas"
fi
EOF

chmod +x backup-hostinger.sh

# Programar backup diario
(crontab -l 2>/dev/null; echo "0 3 * * * /home/n8nuser/n8n-hostinger/backup-hostinger.sh >> /home/n8nuser/n8n-hostinger/backup.log 2>&1") | crontab -
```

### Update Script

```bash
# Script de actualización
cat > update-n8n.sh << 'EOF'
#!/bin/bash
# Actualizar n8n en Hostinger

echo "=== Actualización n8n ==="
echo "Fecha: $(date)"

cd /home/n8nuser/n8n-hostinger

# Backup antes de actualizar
echo "Creando backup pre-actualización..."
./backup-hostinger.sh

# Descargar nueva imagen
echo "Descargando nueva imagen..."
docker-compose pull n8n

# Reiniciar con nueva imagen
echo "Reiniciando servicios..."
docker-compose up -d

# Verificar funcionamiento
echo "Verificando funcionamiento..."
sleep 30

if curl -f http://localhost:5678/healthz &>/dev/null; then
    echo "✓ Actualización exitosa"
else
    echo "✗ Problema después de actualización"
    echo "Revisa logs: docker-compose logs n8n"
fi

# Limpiar imágenes viejas
echo "Limpiando imágenes viejas..."
docker image prune -f

echo "Actualización completada"
EOF

chmod +x update-n8n.sh
```

---

## Troubleshooting

### Problemas Comunes en Hostinger

#### 1. n8n No Inicia
```bash
# Verificar logs
docker-compose logs n8n

# Verificar recursos
free -h
df -h

# Verificar Docker
sudo systemctl status docker

# Reiniciar todo
docker-compose down
docker-compose up -d
```

#### 2. Poco Espacio en Disco
```bash
# Verificar uso
df -h

# Limpiar Docker
docker system prune -af

# Limpiar logs del sistema
sudo journalctl --vacuum-time=7d

# Limpiar backups antiguos
find /home/n8nuser/n8n-hostinger/backups -mtime +7 -delete
```

#### 3. Memoria Insuficiente
```bash
# Verificar memoria
free -h

# Verificar procesos
top -o %MEM

# Reiniciar n8n
docker-compose restart n8n

# Si persiste, agregar más swap
sudo fallocate -l 2G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

#### 4. Conectividad Lenta desde hPanel
```bash
# Test de conectividad
ping -c 4 google.com

# Test de DNS
nslookup google.com

# Verificar carga del servidor
uptime
```

#### 5. Problemas con SSL/Certbot
```bash
# Verificar nginx
sudo nginx -t

# Renovar certificado manualmente
sudo certbot renew --force-renewal

# Verificar cron para renovación
sudo crontab -l | grep certbot
```

### Comandos de Mantenimiento Útiles

```bash
# Estado general del sistema
./monitor-hostinger.sh

# Backup manual
./backup-hostinger.sh

# Actualización manual
./update-n8n.sh

# Ver logs en tiempo real
docker-compose logs -f n8n

# Reiniciar n8n
docker-compose restart n8n

# Estado completo de Docker
docker-compose ps
docker stats

# Uso de disco por Docker
docker system df

# Limpiar sistema
docker system prune -af
sudo apt autoremove -y
sudo apt autoclean
```

---

## Configuración desde hPanel

### Monitoreo Avanzado

1. **Ve a hPanel → VPS → Estadísticas**
2. **Configura alertas**:
   - CPU > 80% por 5 minutos
   - RAM > 90% por 3 minutos
   - Disco > 85%
   - Load average > 2.0

3. **Email de alertas**: Configurar en "Contactos"

### Backup Desde hPanel

1. **Ve a hPanel → VPS → Backups**
2. **Configurar backup automático**:
   - Frecuencia: Semanal
   - Día: Domingo
   - Hora: 2:00 AM
   - Retención: 4 semanas

### Recuperación desde hPanel

En caso de problemas severos:

1. **Ve a hPanel → VPS → Backups**
2. **Selecciona backup reciente**
3. **Click "Restore"**
4. **Confirmar restauración**

---

## Resumen

Hostinger es ideal para principiantes que buscan simplicidad:

### Ventajas Clave
- **Interfaz súper amigable** con hPanel
- **Soporte 24/7 en español**
- **Configuración automatizada** de muchos aspectos
- **Backups incluidos** en el plan
- **Precios promocionales** muy atractivos

### Consideraciones
- **Recursos limitados** en planes básicos
- **Renovaciones más caras** que precio promocional
- **Menos control granular** que proveedores técnicos

### Comandos de Referencia Rápida

```bash
# Estado del sistema
./monitor-hostinger.sh

# Backup manual
./backup-hostinger.sh

# Actualizar n8n
./update-n8n.sh

# Logs en tiempo real
docker-compose logs -f n8n

# Reiniciar servicios
docker-compose restart

# Monitoreo de recursos
docker stats
```

### Acceso Directo
- **n8n**: `http://tu-dominio.com` o `http://TU_IP:5678`
- **hPanel**: [hostinger.com/cpanel-login](https://hostinger.com/cpanel-login)
- **SSH Browser Terminal**: Desde hPanel → VPS → Browser Terminal

**¡Tu instalación de n8n en Hostinger está lista para usar de forma súper simple!**