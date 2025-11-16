# Instalación de n8n en CloudCone VPS

> **Guía completa para instalar n8n en CloudCone - El proveedor ultra-económico**

## Índice

- [Introducción a CloudCone](#introducción-a-cloudcone)
- [Creación de Cuenta y VPS](#creación-de-cuenta-y-vps)
- [Configuración Inicial del Servidor](#configuración-inicial-del-servidor)
- [Instalación de n8n con Docker](#instalación-de-n8n-con-docker)
- [Configuración de Seguridad](#configuración-de-seguridad)
- [Optimización para CloudCone](#optimización-para-cloudcone)
- [Troubleshooting](#troubleshooting)

---

## Introducción a CloudCone

CloudCone es conocido por ofrecer VPS de alta calidad a precios extremadamente competitivos, con promociones frecuentes y recursos generosos.

### Ventajas de CloudCone

- **Precios ultra-competitivos**: Desde $1.99/mes
- **Promociones frecuentes**: Ofertas especiales regulares
- **Recursos generosos**: Más RAM y almacenamiento por el precio
- **Red de calidad**: Buena conectividad internacional
- **Panel simple**: Interfaz fácil de usar

### Desventajas a Considerar

- **Soporte limitado**: No tan robusto como proveedores premium
- **Ubicaciones limitadas**: Solo 3 ubicaciones principales
- **Menor garantía SLA**: Para el precio, menor garantía de uptime

### Especificaciones Recomendadas

| Uso | Plan Recomendado | Precio | Recursos |
|-----|------------------|---------|----------|
| **Testing/Desarrollo** | VPS-1 | $1.99/mes | 512MB RAM, 1 vCPU, 10GB SSD |
| **Personal/Pequeño** | VPS-2 | $3.99/mes | 1GB RAM, 1 vCPU, 25GB SSD |
| **Equipo** | VPS-3 | $7.99/mes | 2GB RAM, 2 vCPU, 40GB SSD |
| **Producción** | VPS-4 | $15.99/mes | 4GB RAM, 2 vCPU, 60GB SSD |

---

## Creación de Cuenta y VPS

### Paso 1: Registro en CloudCone

1. Ve a [cloudcone.com](https://cloudcone.com)
2. Haz click en "Sign Up"
3. Completa el formulario de registro:
   ```
   Email: tu-email@ejemplo.com
   Password: [contraseña segura]
   First Name: [tu nombre]
   Last Name: [tu apellido]
   ```
4. Verifica tu email

### Paso 2: Aprovecha las Promociones

CloudCone frecuentemente tiene ofertas especiales:
- **Flash Sales**: Hasta 70% descuento
- **Promociones anuales**: Descuentos por pago anual
- **Cupones de descuento**: Revisa su página de ofertas

### Paso 3: Crear el VPS

1. **Ingresa al panel de control**
2. **Selecciona "Order New Service"**
3. **Elige la ubicación**:
   - **Los Angeles** (mejor para América)
   - **Nueva York** (mejor para América/Europa)
   - **Singapur** (mejor para Asia/Oceanía)

4. **Selecciona el plan** según tus necesidades
5. **Elige el sistema operativo**:
   ```
   Recomendado: Ubuntu 22.04 LTS
   Alternativas: Ubuntu 20.04 LTS, CentOS 8, Debian 11
   ```

6. **Configuración adicional**:
   ```
   Hostname: n8n-cloudcone-1
   Root Password: [genera contraseña fuerte]
   SSH Keys: [opcional, pero recomendado]
   ```

7. **Revisa y confirma** el pedido

### Paso 4: Acceso Inicial

Después de 2-5 minutos recibirás los detalles por email:
```
IP Address: XXX.XXX.XXX.XXX
Username: root
Password: [tu contraseña]
SSH Port: 22
```

---

## Configuración Inicial del Servidor

### Paso 1: Conexión SSH

```bash
# Conectar via SSH
ssh root@TU_IP_SERVIDOR

# O si configuraste SSH key
ssh -i ~/.ssh/id_rsa root@TU_IP_SERVIDOR
```

### Paso 2: Actualización del Sistema

```bash
# Actualizar listas de paquetes
apt update

# Actualizar todos los paquetes
apt upgrade -y

# Instalar utilidades esenciales
apt install -y curl wget git ufw fail2ban htop nano
```

### Paso 3: Crear Usuario No-Root

```bash
# Crear usuario para n8n
adduser n8nuser

# Agregar a sudo
usermod -aG sudo n8nuser

# Cambiar a usuario n8n
su - n8nuser
```

### Paso 4: Configuración de SSH (Opcional pero Recomendado)

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config

# Cambios recomendados:
# Port 2222                    # Cambiar puerto por defecto
# PermitRootLogin no          # Deshabilitar login root
# PasswordAuthentication no   # Solo SSH keys (opcional)

# Reiniciar SSH
sudo systemctl restart sshd
```

---

## Instalación de n8n con Docker

### Paso 1: Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker

# Verificar instalación
docker --version
docker run hello-world
```

### Paso 2: Instalar Docker Compose

```bash
# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
```

### Paso 3: Crear Directorio de Trabajo

```bash
# Crear directorio para n8n
mkdir -p /home/n8nuser/n8n-cloudcone
cd /home/n8nuser/n8n-cloudcone
```

### Paso 4: Configuración Docker Compose

```yaml
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n_cloudcone
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      # Configuración básica
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=TuPasswordSegura123!
      
      # URL pública (cambiar por tu IP)
      - WEBHOOK_URL=http://TU_IP_SERVIDOR:5678/
      
      # Configuración de timezone
      - GENERIC_TIMEZONE=America/Mexico_City
      - TZ=America/Mexico_City
      
      # Optimización para CloudCone (recursos limitados)
      - N8N_LOG_LEVEL=warn
      - NODE_OPTIONS=--max-old-space-size=512
      
      # Configuración de base de datos (SQLite para simplicidad)
      - DB_TYPE=sqlite
      - DB_SQLITE_DATABASE=/home/node/.n8n/database.sqlite
    
    volumes:
      - n8n_data:/home/node/.n8n
      - /var/run/docker.sock:/var/run/docker.sock:ro
    
    # Optimización de recursos para CloudCone
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

volumes:
  n8n_data:
    driver: local
EOF
```

### Paso 5: Configurar Variables de Entorno

```bash
# Crear archivo .env
cat > .env << 'EOF'
# CloudCone n8n Configuration
COMPOSE_PROJECT_NAME=n8n-cloudcone

# Basic Auth
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=CambiarEstaPassword123!

# Server Configuration
SERVER_IP=TU_IP_SERVIDOR
WEBHOOK_URL=http://TU_IP_SERVIDOR:5678/

# Resource limits for CloudCone
NODE_OPTIONS=--max-old-space-size=512
N8N_LOG_LEVEL=warn
EOF

# Reemplazar IP real
IP_SERVIDOR=$(curl -s ifconfig.me)
sed -i "s/TU_IP_SERVIDOR/$IP_SERVIDOR/g" .env
sed -i "s/TU_IP_SERVIDOR/$IP_SERVIDOR/g" docker-compose.yml
```

---

## Configuración de Seguridad

### Paso 1: Configurar Firewall

```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH (puerto cambiado si lo modificaste)
sudo ufw allow 22/tcp  # o tu puerto personalizado

# Permitir n8n
sudo ufw allow 5678/tcp

# Permitir HTTP/HTTPS para futuro
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ver estado
sudo ufw status
```

### Paso 2: Configurar Fail2Ban

```bash
# Crear configuración para SSH
sudo nano /etc/fail2ban/jail.local

# Agregar contenido:
cat << 'EOF' | sudo tee /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200
EOF

# Reiniciar fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

### Paso 3: Iniciar n8n

```bash
# Iniciar servicios
docker-compose up -d

# Verificar que esté ejecutándose
docker-compose ps
docker-compose logs -f n8n
```

### Paso 4: Verificar Instalación

```bash
# Verificar que n8n esté respondiendo
curl http://localhost:5678

# Verificar desde exterior
curl http://TU_IP_SERVIDOR:5678
```

---

## Optimización para CloudCone

### Optimización de Memoria

```bash
# Crear archivo de swap (importante para VPS pequeños)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacer permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verificar swap
free -h
```

### Configuración de Docker para Pocos Recursos

```bash
# Crear configuración Docker optimizada
sudo mkdir -p /etc/docker
cat << 'EOF' | sudo tee /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-runtime": "runc",
  "runtimes": {
    "runc": {
      "path": "runc"
    }
  }
}
EOF

# Reiniciar Docker
sudo systemctl restart docker
```

### Script de Monitoreo Simple

```bash
# Crear script de monitoreo
cat > monitor.sh << 'EOF'
#!/bin/bash
# Monitor simple para CloudCone VPS

echo "=== n8n Status en CloudCone ==="
echo "Fecha: $(date)"
echo

# Docker containers
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo

# Uso de memoria
echo "Memoria:"
free -h
echo

# Uso de disco
echo "Disco:"
df -h /
echo

# Load average
echo "Load Average:"
uptime
echo

# n8n health check
echo "n8n Health:"
if curl -f http://localhost:5678/healthz &>/dev/null; then
    echo "✓ n8n está funcionando"
else
    echo "✗ n8n no responde"
fi
EOF

chmod +x monitor.sh

# Ejecutar monitoreo
./monitor.sh
```

---

## Configuración SSL con Let's Encrypt

### Paso 1: Instalar Nginx

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración para n8n
sudo nano /etc/nginx/sites-available/n8n

# Contenido:
cat << 'EOF' | sudo tee /etc/nginx/sites-available/n8n
server {
    listen 80;
    server_name TU_DOMINIO.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# Activar sitio
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Paso 2: Certificado SSL

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado (reemplaza tu-dominio.com)
sudo certbot --nginx -d tu-dominio.com

# Verificar auto-renovación
sudo certbot renew --dry-run
```

---

## Backup Automatizado

```bash
# Script de backup simple para CloudCone
cat > backup.sh << 'EOF'
#!/bin/bash
# Backup simple para CloudCone (espacio limitado)

BACKUP_DIR="/home/n8nuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Iniciando backup CloudCone..."

# Parar n8n
docker-compose stop n8n

# Backup datos
docker run --rm -v n8n-cloudcone_n8n_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/n8n-data-$DATE.tar.gz -C /data .

# Backup configuración
tar czf $BACKUP_DIR/config-$DATE.tar.gz docker-compose.yml .env

# Reiniciar n8n
docker-compose start n8n

echo "Backup completado: $BACKUP_DIR"

# Limpiar backups antiguos (mantener solo 3)
ls -t $BACKUP_DIR/n8n-data-*.tar.gz | tail -n +4 | xargs rm -f
ls -t $BACKUP_DIR/config-*.tar.gz | tail -n +4 | xargs rm -f
EOF

chmod +x backup.sh

# Programar backup semanal
(crontab -l 2>/dev/null; echo "0 2 * * 0 /home/n8nuser/n8n-cloudcone/backup.sh") | crontab -
```

---

## Troubleshooting

### Problemas Comunes en CloudCone

#### 1. Poco Memoria / OOM Kills
```bash
# Verificar memoria
free -h
cat /var/log/syslog | grep "Out of memory"

# Solución: Agregar más swap
sudo dd if=/dev/zero of=/swapfile2 bs=1M count=512
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

#### 2. n8n se Cierra Inesperadamente
```bash
# Verificar logs
docker-compose logs n8n

# Verificar recursos
docker stats

# Reducir límites de memoria en docker-compose.yml
```

#### 3. Conectividad Lenta
```bash
# Verificar latencia
ping -c 4 8.8.8.8

# Test de velocidad
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -
```

#### 4. Espacio en Disco Agotado
```bash
# Verificar espacio
df -h

# Limpiar Docker
docker system prune -af

# Limpiar logs
sudo journalctl --vacuum-time=7d
```

### Scripts de Mantenimiento

```bash
# Crear script de mantenimiento
cat > mantenimiento.sh << 'EOF'
#!/bin/bash
# Mantenimiento CloudCone VPS

echo "=== Mantenimiento CloudCone n8n ==="

# Limpiar Docker
echo "Limpiando Docker..."
docker system prune -f

# Limpiar logs
echo "Limpiando logs..."
sudo journalctl --vacuum-time=7d

# Verificar espacio
echo "Espacio en disco:"
df -h /

# Verificar memoria
echo "Memoria:"
free -h

# Reiniciar n8n si usa mucha memoria
MEMORY_USAGE=$(docker stats n8n_cloudcone --no-stream --format "{{.MemUsage}}" | cut -d'/' -f1 | sed 's/MiB//')
if (( $(echo "$MEMORY_USAGE > 400" | bc -l) )); then
    echo "Reiniciando n8n por alto uso de memoria..."
    docker-compose restart n8n
fi

echo "Mantenimiento completado"
EOF

chmod +x mantenimiento.sh

# Programar mantenimiento semanal
(crontab -l 2>/dev/null; echo "0 3 * * 1 /home/n8nuser/n8n-cloudcone/mantenimiento.sh") | crontab -
```

---

## Resumen

CloudCone es una excelente opción para proyectos con presupuesto limitado:

### Ventajas
- **Precio imbatible** desde $1.99/mes
- **Promociones frecuentes** con descuentos significativos
- **Recursos generosos** para el precio
- **Configuración simple** con Docker

### Consideraciones
- **Recursos limitados** requieren optimización
- **Soporte básico** comparado con proveedores premium
- **Monitoreo activo** necesario por recursos limitados

### Comandos de Referencia Rápida

```bash
# Estado del sistema
./monitor.sh

# Backup manual
./backup.sh

# Mantenimiento
./mantenimiento.sh

# Logs de n8n
docker-compose logs -f n8n

# Reiniciar n8n
docker-compose restart n8n

# Ver uso de recursos
docker stats
```

**Tu instalación de n8n en CloudCone está lista para usar de forma económica y eficiente!**