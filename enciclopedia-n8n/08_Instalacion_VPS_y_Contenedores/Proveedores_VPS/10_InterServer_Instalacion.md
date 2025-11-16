# Instalación de n8n en InterServer VPS

> **Guía completa para instalar n8n en InterServer - El proveedor con precio bloqueado de por vida**

## Índice

- [Introducción a InterServer](#introducción-a-interserver)
- [Creación de Cuenta y VPS](#creación-de-cuenta-y-vps)
- [Configuración Inicial del Servidor](#configuración-inicial-del-servidor)
- [Instalación de n8n con Docker](#instalación-de-n8n-con-docker)
- [Configuración de Seguridad](#configuración-de-seguridad)
- [Optimización para InterServer](#optimización-para-interserver)
- [Configuración de Monitoreo](#configuración-de-monitoreo)
- [Troubleshooting](#troubleshooting)

---

## Introducción a InterServer

InterServer se destaca por su promesa única: precio bloqueado de por vida, sin aumentos sorpresa en las renovaciones.

### Ventajas de InterServer

- **Precio bloqueado**: El precio nunca aumenta
- **Recursos ilimitados**: En algunos planes, transferencia y espacio sin límite
- **Soporte 24/7**: Equipo técnico experimentado
- **99.9% Uptime**: Garantía de disponibilidad
- **Migración gratuita**: Te ayudan a migrar desde otro proveedor
- **30 días garantía**: Devolución completa si no estás satisfecho

### Desventajas a Considerar

- **Ubicaciones limitadas**: Principalmente Estados Unidos
- **Menos automatización**: Más manual que otros proveedores
- **Interface tradicional**: Panel menos moderno que competidores

### Especificaciones Recomendadas

| Uso | Plan Recomendado | Precio Fijo | Recursos |
|-----|------------------|-------------|----------|
| **Desarrollo** | VPS Slice 1 | $6/mes | 1GB RAM, 1 vCPU, 25GB SSD |
| **Personal** | VPS Slice 2 | $12/mes | 2GB RAM, 2 vCPU, 50GB SSD |
| **Pequeño Equipo** | VPS Slice 3 | $18/mes | 4GB RAM, 3 vCPU, 75GB SSD |
| **Producción** | VPS Slice 4 | $24/mes | 8GB RAM, 4 vCPU, 100GB SSD |

---

## Creación de Cuenta y VPS

### Paso 1: Registro en InterServer

1. Ve a [interserver.net](https://interserver.net)
2. Haz click en "VPS Hosting"
3. Selecciona "Linux VPS"
4. Elige el plan que necesites

### Paso 2: Configuración del VPS

En el proceso de pedido:

1. **Seleccionar configuración**:
   ```
   Operating System: Ubuntu 22.04 LTS
   Control Panel: None (usaremos línea de comandos)
   Location: Secaucus, NJ (principal datacenter)
   ```

2. **Información de la cuenta**:
   ```
   Email: tu-email@ejemplo.com
   Password: [contraseña fuerte]
   Billing Info: [información de pago]
   ```

3. **Información adicional**:
   ```
   Hostname: n8n-interserver
   Root Password: [genera contraseña segura]
   ```

### Paso 3: Confirmación y Activación

- **Tiempo de activación**: 15-30 minutos generalmente
- **Email de confirmación**: Contiene detalles de acceso
- **Panel de control**: Acceso a [my.interserver.net](https://my.interserver.net)

### Paso 4: Datos de Conexión

Recibirás por email:
```
Server IP: XXX.XXX.XXX.XXX
Username: root
Password: [tu contraseña segura]
SSH Port: 22
OS: Ubuntu 22.04 LTS
```

---

## Configuración Inicial del Servidor

### Paso 1: Primer Acceso SSH

```bash
# Conectar por SSH
ssh root@TU_IP_SERVIDOR

# Verificar información del servidor
hostnamectl
cat /etc/os-release
```

### Paso 2: Actualización del Sistema

```bash
# Actualizar repositorios
apt update

# Actualizar todos los paquetes
apt upgrade -y

# Instalar herramientas esenciales
apt install -y curl wget git nano vim htop tree unzip zip ufw fail2ban

# Configurar timezone
timedatectl set-timezone America/New_York  # O tu zona preferida
timedatectl status
```

### Paso 3: Configurar Usuario No-Root

```bash
# Crear usuario dedicado para n8n
adduser n8nuser

# Seguir prompts:
# New password: [contraseña segura]
# Retype new password: [confirmar]
# Full Name: n8n User (o presionar Enter)
# [Enter para resto de campos]

# Agregar a grupo sudo
usermod -aG sudo n8nuser

# Verificar grupos
groups n8nuser

# Cambiar a nuevo usuario
su - n8nuser
pwd  # Debe mostrar /home/n8nuser
```

### Paso 4: Configurar SSH Key (Recomendado)

```bash
# Generar SSH key pair
ssh-keygen -t rsa -b 4096 -C "n8n-interserver-$(date +%Y%m%d)"

# Presionar Enter para ubicación por defecto
# Opcionalmente agregar passphrase para seguridad extra

# Ver clave pública
cat ~/.ssh/id_rsa.pub

# Agregar a authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Paso 5: Configuración Básica de Seguridad

```bash
# Regresar a root para configuraciones de sistema
exit

# Configurar hostname
hostnamectl set-hostname n8n-interserver

# Configurar hosts
echo "127.0.0.1 n8n-interserver" >> /etc/hosts

# Verificar
hostnamectl
```

---

## Instalación de n8n con Docker

### Paso 1: Instalar Docker

```bash
# Cambiar a usuario n8n
su - n8nuser

# Descargar script de instalación Docker
curl -fsSL https://get.docker.com -o get-docker.sh

# Instalar Docker
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios de grupo
newgrp docker

# Verificar instalación
docker --version
docker info

# Test inicial
docker run hello-world
```

### Paso 2: Instalar Docker Compose

```bash
# Obtener última versión
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)

# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
```

### Paso 3: Preparar Estructura del Proyecto

```bash
# Crear directorio base
mkdir -p /home/n8nuser/n8n-interserver
cd /home/n8nuser/n8n-interserver

# Crear estructura de directorios
mkdir -p {data,logs,backups,scripts,ssl}

# Verificar estructura
tree . || ls -la
```

### Paso 4: Configuración Docker Compose

```yaml
# Crear archivo docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n_interserver
    restart: always
    ports:
      - "5678:5678"
    environment:
      # Configuración de autenticación
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=InterServerPass123!
      
      # Configuración de URL y webhook
      - WEBHOOK_URL=http://TU_IP_SERVIDOR:5678/
      - N8N_HOST=TU_IP_SERVIDOR
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      
      # Configuración de timezone (InterServer está en EST)
      - GENERIC_TIMEZONE=America/New_York
      - TZ=America/New_York
      
      # Base de datos (SQLite para simplicidad inicial)
      - DB_TYPE=sqlite
      - DB_SQLITE_DATABASE=/home/node/.n8n/database.sqlite
      
      # Configuración de logging
      - N8N_LOG_LEVEL=info
      - N8N_LOG_OUTPUT=file,console
      - N8N_LOG_FILE=/home/node/.n8n/logs/n8n.log
      
      # Configuración de ejecuciones
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168  # 7 días
      
      # Optimización de memoria
      - NODE_OPTIONS=--max-old-space-size=2048
      
      # Configuración de seguridad
      - N8N_SECURE_COOKIE=false  # Cambiar a true con HTTPS
      - N8N_DIAGNOSTICS_ENABLED=false
      
      # Configuración de workflows
      - N8N_DEFAULT_BINARY_DATA_MODE=filesystem
      - N8N_BINARY_DATA_STORAGE_PATH=/home/node/.n8n/binaryData
      
    volumes:
      - ./data:/home/node/.n8n
      - ./logs:/home/node/.n8n/logs
      - /var/run/docker.sock:/var/run/docker.sock:ro
    
    # Configuración de recursos
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'
        reservations:
          memory: 512M
          cpus: '0.5'
    
    # Health check
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # PostgreSQL para producción (comentado inicialmente)
  # postgres:
  #   image: postgres:15
  #   container_name: n8n_postgres
  #   restart: always
  #   environment:
  #     - POSTGRES_DB=n8n
  #     - POSTGRES_USER=n8nuser
  #     - POSTGRES_PASSWORD=PostgresPass123!
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

volumes:
  n8n_data:
    driver: local
  # postgres_data:
  #   driver: local

networks:
  default:
    name: n8n_network
EOF
```

### Paso 5: Variables de Entorno

```bash
# Crear archivo .env
cat > .env << 'EOF'
# InterServer n8n Configuration
COMPOSE_PROJECT_NAME=n8n-interserver

# Basic Authentication
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=CambiarPassword123!

# Server Configuration
SERVER_IP=TU_IP_SERVIDOR
N8N_HOST=TU_IP_SERVIDOR
WEBHOOK_URL=http://TU_IP_SERVIDOR:5678/

# Database Configuration (PostgreSQL)
# DB_TYPE=postgresdb
# DB_POSTGRESDB_HOST=postgres
# DB_POSTGRESDB_PORT=5432
# DB_POSTGRESDB_DATABASE=n8n
# DB_POSTGRESDB_USER=n8nuser
# DB_POSTGRESDB_PASSWORD=PostgresPass123!

# Resource Configuration
NODE_OPTIONS=--max-old-space-size=2048
N8N_LOG_LEVEL=info

# Timezone (InterServer East Coast)
TZ=America/New_York
GENERIC_TIMEZONE=America/New_York

# Security
N8N_SECURE_COOKIE=false
N8N_DIAGNOSTICS_ENABLED=false
EOF

# Obtener IP real del servidor
IP_SERVIDOR=$(curl -s ifconfig.me || curl -s icanhazip.com)
echo "IP del servidor detectada: $IP_SERVIDOR"

# Reemplazar IP en archivos
sed -i "s/TU_IP_SERVIDOR/$IP_SERVIDOR/g" .env
sed -i "s/TU_IP_SERVIDOR/$IP_SERVIDOR/g" docker-compose.yml

echo "Archivos configurados con IP: $IP_SERVIDOR"
```

---

## Configuración de Seguridad

### Paso 1: Configurar Firewall UFW

```bash
# Regresar a root para configuraciones de firewall
su -

# Configurar reglas de firewall
ufw --force enable

# Permitir SSH
ufw allow ssh
ufw allow 22/tcp

# Permitir n8n
ufw allow 5678/tcp

# Permitir HTTP/HTTPS para futuro
ufw allow 80/tcp
ufw allow 443/tcp

# Configuraciones adicionales de seguridad
ufw default deny incoming
ufw default allow outgoing

# Ver estado
ufw status verbose

# Regresar a usuario n8n
su - n8nuser
```

### Paso 2: Configurar Fail2Ban

```bash
# Configurar fail2ban (como root)
sudo nano /etc/fail2ban/jail.local

# Agregar configuración:
cat << 'EOF' | sudo tee /etc/fail2ban/jail.local
[DEFAULT]
# Ban por 1 hora
bantime = 3600

# Ventana de tiempo de 10 minutos
findtime = 600

# Máximo 5 intentos
maxretry = 5

# Ignorar IPs locales
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = false
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled = false
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

# Reiniciar y habilitar fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# Verificar estado
sudo fail2ban-client status
```

### Paso 3: Endurecimiento SSH

```bash
# Backup configuración SSH original
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Crear configuración SSH mejorada
sudo nano /etc/ssh/sshd_config

# Buscar y modificar estas líneas:
# Port 2222                        # Cambiar puerto por defecto (opcional)
# PermitRootLogin no              # Deshabilitar login directo como root
# PasswordAuthentication yes      # Mantener por ahora, cambiar a no si usas keys
# MaxAuthTries 3                  # Máximo 3 intentos de autenticación
# ClientAliveInterval 300         # Keep-alive cada 5 minutos
# ClientAliveCountMax 2           # Máximo 2 keep-alive sin respuesta
# Protocol 2                      # Solo protocolo SSH v2

# Verificar configuración
sudo sshd -t

# Reiniciar SSH (CUIDADO: tener otra sesión abierta como respaldo)
sudo systemctl restart sshd

# Verificar que funciona
sudo systemctl status sshd
```

---

## Iniciar n8n

### Paso 1: Lanzamiento Inicial

```bash
# Asegurar estar en directorio correcto
cd /home/n8nuser/n8n-interserver

# Crear directorios de datos si no existen
mkdir -p data logs

# Iniciar servicios
docker-compose up -d

# Verificar que se esté ejecutando
docker-compose ps

# Ver logs de inicio
docker-compose logs -f n8n
```

### Paso 2: Verificación

```bash
# Verificar que Docker está ejecutándose
docker ps

# Test de conectividad local
curl -I http://localhost:5678

# Test de conectividad externa (desde otra máquina)
curl -I http://TU_IP_SERVIDOR:5678

# Verificar health check
docker-compose exec n8n wget --quiet --tries=1 --spider http://localhost:5678/healthz
echo $?  # Debe devolver 0
```

### Paso 3: Acceso Web Inicial

1. **Abrir navegador**
2. **Ir a**: `http://TU_IP_SERVIDOR:5678`
3. **Usar credenciales**:
   - Usuario: `admin`
   - Password: `CambiarPassword123!`

---

## Optimización para InterServer

### Optimización de Sistema

```bash
# Configurar swap (importante para VPS)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Hacer swap permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimizar swappiness para n8n
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf

# Aplicar configuración
sudo sysctl -p

# Verificar swap
free -h
swapon --show
```

### Configuración de Docker Optimizada

```bash
# Crear configuración Docker optimizada
sudo mkdir -p /etc/docker

cat << 'EOF' | sudo tee /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "20m",
    "max-file": "5"
  },
  "storage-driver": "overlay2",
  "default-runtime": "runc",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ],
  "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF

# Reiniciar Docker para aplicar configuración
sudo systemctl restart docker

# Verificar configuración
docker info | head -20
```

### Script de Monitoreo InterServer

```bash
# Crear script de monitoreo personalizado
cat > monitor-interserver.sh << 'EOF'
#!/bin/bash
# Monitor completo para n8n en InterServer

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================================"
echo "         n8n InterServer Monitor"
echo "================================================"
echo "Servidor: $(hostname)"
echo "Fecha: $(date)"
echo "Ubicación: InterServer Secaucus, NJ"
echo "================================================"

# 1. Estado del sistema
echo -e "\n${GREEN}=== Estado del Sistema ===${NC}"
echo "Uptime: $(uptime -p)"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"

# 2. Uso de CPU y memoria
echo -e "\n${GREEN}=== Recursos del Sistema ===${NC}"
echo "CPU Info:"
grep 'model name' /proc/cpuinfo | head -1 | cut -d: -f2 | xargs
echo "CPU Cores: $(nproc)"

echo -e "\nMemoria:"
free -h | grep -E "^Mem|^Swap"

echo -e "\nUso de disco:"
df -h / | tail -1

# 3. Estado de Docker
echo -e "\n${GREEN}=== Estado de Docker ===${NC}"
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✓${NC} Docker: Activo"
    echo "Versión Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
else
    echo -e "${RED}✗${NC} Docker: Inactivo"
fi

# 4. Estado de n8n
echo -e "\n${GREEN}=== Estado de n8n ===${NC}"
cd /home/n8nuser/n8n-interserver

if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓${NC} n8n: Ejecutándose"
    
    # Health check
    if docker-compose exec -T n8n wget --quiet --tries=1 --spider http://localhost:5678/healthz 2>/dev/null; then
        echo -e "${GREEN}✓${NC} n8n: Health Check OK"
    else
        echo -e "${YELLOW}⚠${NC} n8n: Health Check FAILED"
    fi
    
    # Verificar acceso externo
    if curl -s -I http://localhost:5678 | grep -q "200 OK"; then
        echo -e "${GREEN}✓${NC} n8n: Acceso HTTP OK"
    else
        echo -e "${RED}✗${NC} n8n: Acceso HTTP FAILED"
    fi
else
    echo -e "${RED}✗${NC} n8n: No está ejecutándose"
fi

# 5. Estadísticas de contenedor
echo -e "\n${GREEN}=== Estadísticas de Contenedor ===${NC}"
if docker ps -q -f name=n8n_interserver > /dev/null; then
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}" n8n_interserver
else
    echo "Contenedor n8n no encontrado"
fi

# 6. Estado de la red
echo -e "\n${GREEN}=== Estado de Red ===${NC}"
echo "IP Pública: $(curl -s ifconfig.me)"
echo "Puertos abiertos:"
ss -tlnp | grep -E ":22|:5678|:80|:443" | awk '{print $4}' | sort

# 7. Seguridad
echo -e "\n${GREEN}=== Estado de Seguridad ===${NC}"
if systemctl is-active --quiet ufw; then
    echo -e "${GREEN}✓${NC} UFW: Activo"
else
    echo -e "${RED}✗${NC} UFW: Inactivo"
fi

if systemctl is-active --quiet fail2ban; then
    echo -e "${GREEN}✓${NC} Fail2Ban: Activo"
    fail2ban_jails=$(sudo fail2ban-client status | grep "Jail list:" | cut -d: -f2 | wc -w)
    echo "Jails activas: $fail2ban_jails"
else
    echo -e "${RED}✗${NC} Fail2Ban: Inactivo"
fi

# 8. Últimas líneas del log
echo -e "\n${GREEN}=== Últimas líneas del log n8n ===${NC}"
docker-compose logs --tail=5 n8n 2>/dev/null | tail -5

# 9. Información de backups
echo -e "\n${GREEN}=== Estado de Backups ===${NC}"
if [ -d "backups" ]; then
    backup_count=$(ls backups/*.tar.gz 2>/dev/null | wc -l)
    if [ $backup_count -gt 0 ]; then
        latest_backup=$(ls -t backups/*.tar.gz 2>/dev/null | head -1)
        backup_date=$(stat -c %y "$latest_backup" 2>/dev/null | cut -d' ' -f1)
        echo "Backups disponibles: $backup_count"
        echo "Último backup: $backup_date"
    else
        echo -e "${YELLOW}⚠${NC} No hay backups disponibles"
    fi
else
    echo -e "${YELLOW}⚠${NC} Directorio de backups no existe"
fi

# 10. Alertas críticas
echo -e "\n${GREEN}=== Alertas ===${NC}"
cpu_load=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | xargs)
memory_usage=$(free | awk 'FNR==2{printf "%.0f\n", $3/$2*100}')
disk_usage=$(df / | awk 'FNR==2{print $5}' | cut -d'%' -f1)

if (( $(echo "$cpu_load > 2.0" | bc -l) )); then
    echo -e "${RED}⚠${NC} Alta carga de CPU: $cpu_load"
fi

if [ $memory_usage -gt 85 ]; then
    echo -e "${RED}⚠${NC} Alto uso de memoria: ${memory_usage}%"
fi

if [ $disk_usage -gt 85 ]; then
    echo -e "${RED}⚠${NC} Alto uso de disco: ${disk_usage}%"
fi

if [ $memory_usage -lt 85 ] && [ $disk_usage -lt 85 ] && (( $(echo "$cpu_load < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓${NC} Todos los recursos dentro de límites normales"
fi

echo -e "\n================================================"
echo "Monitor completado - $(date)"
echo "================================================"
EOF

chmod +x monitor-interserver.sh

# Ejecutar monitor
./monitor-interserver.sh
```

---

## Scripts de Automatización

### Script de Backup Completo

```bash
# Script de backup robusto
cat > backup-interserver.sh << 'EOF'
#!/bin/bash
# Script de backup completo para n8n en InterServer

# Configuración
BACKUP_DIR="/home/n8nuser/n8n-interserver/backups"
PROJECT_DIR="/home/n8nuser/n8n-interserver"
DATE=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=14  # Mantener 2 semanas de backups
LOG_FILE="$BACKUP_DIR/backup.log"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función de logging
log() {
    echo -e "[$DATE] $1" | tee -a "$LOG_FILE"
}

echo "=================================================="
log "${GREEN}Iniciando backup de n8n InterServer${NC}"
echo "=================================================="

# Crear directorio de backup si no existe
mkdir -p "$BACKUP_DIR"

# Verificar espacio en disco
available_space=$(df "$BACKUP_DIR" | awk 'NR==2 {print int($4/1024/1024)}')
if [ $available_space -lt 1 ]; then
    log "${RED}ERROR: Espacio insuficiente ($available_space GB disponibles)${NC}"
    exit 1
fi

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Verificar que n8n esté ejecutándose
if ! docker-compose ps | grep -q "Up"; then
    log "${YELLOW}ADVERTENCIA: n8n no está ejecutándose${NC}"
fi

# 1. Parar n8n para backup consistente
log "Pausando n8n para backup consistente..."
docker-compose stop n8n

# Verificar que se detuvo
sleep 5
if docker-compose ps | grep -q "Up"; then
    log "${RED}ERROR: No se pudo parar n8n${NC}"
    exit 1
fi

# 2. Backup de datos de n8n
log "Creando backup de datos de n8n..."
if [ -d "data" ]; then
    tar --exclude='data/logs/*' -czf "$BACKUP_DIR/n8n-data-$DATE.tar.gz" -C data .
    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Backup de datos completado${NC}"
    else
        log "${RED}ERROR: Fallo el backup de datos${NC}"
        docker-compose start n8n
        exit 1
    fi
else
    log "${YELLOW}ADVERTENCIA: Directorio de datos no encontrado${NC}"
fi

# 3. Backup de configuración
log "Creando backup de configuración..."
tar -czf "$BACKUP_DIR/n8n-config-$DATE.tar.gz" docker-compose.yml .env scripts/

if [ $? -eq 0 ]; then
    log "${GREEN}✓ Backup de configuración completado${NC}"
else
    log "${RED}ERROR: Fallo el backup de configuración${NC}"
fi

# 4. Backup de base de datos (si usa PostgreSQL)
if grep -q "postgres" docker-compose.yml && docker-compose ps postgres &>/dev/null; then
    log "Creando backup de PostgreSQL..."
    docker-compose start postgres
    sleep 10
    docker-compose exec -T postgres pg_dump -U n8nuser n8n | gzip > "$BACKUP_DIR/postgres-dump-$DATE.sql.gz"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        log "${GREEN}✓ Backup de PostgreSQL completado${NC}"
    else
        log "${YELLOW}ADVERTENCIA: Fallo el backup de PostgreSQL${NC}"
    fi
fi

# 5. Crear metadata del backup
log "Creando metadata del backup..."
cat > "$BACKUP_DIR/backup-info-$DATE.json" << EOL
{
  "backup_date": "$(date -Iseconds)",
  "backup_type": "full",
  "server_info": {
    "hostname": "$(hostname)",
    "ip": "$(curl -s ifconfig.me)",
    "os": "$(cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"')",
    "provider": "InterServer"
  },
  "n8n_info": {
    "version": "$(docker-compose exec -T n8n n8n --version 2>/dev/null | head -1 | tr -d '\r\n')",
    "container_name": "n8n_interserver"
  },
  "backup_files": [
    "n8n-data-$DATE.tar.gz",
    "n8n-config-$DATE.tar.gz"$([ -f "$BACKUP_DIR/postgres-dump-$DATE.sql.gz" ] && echo ",\n    \"postgres-dump-$DATE.sql.gz\"")
  ]
}
EOL

# 6. Reiniciar n8n
log "Reiniciando n8n..."
docker-compose start n8n

# Esperar que n8n esté listo
sleep 30

# Verificar que n8n esté funcionando
if curl -f http://localhost:5678/healthz &>/dev/null; then
    log "${GREEN}✓ n8n está funcionando correctamente después del backup${NC}"
else
    log "${RED}⚠ ADVERTENCIA: n8n podría tener problemas después del backup${NC}"
    log "Revisa los logs: docker-compose logs n8n"
fi

# 7. Verificar integridad de backups
log "Verificando integridad de backups..."
for backup_file in "$BACKUP_DIR"/n8n-*-$DATE.tar.gz; do
    if [ -f "$backup_file" ]; then
        if tar -tzf "$backup_file" >/dev/null 2>&1; then
            log "${GREEN}✓ $backup_file - Íntegro${NC}"
        else
            log "${RED}✗ $backup_file - Corrupto${NC}"
        fi
    fi
done

# 8. Limpiar backups antiguos
log "Limpiando backups antiguos (>$KEEP_DAYS días)..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$KEEP_DAYS -delete
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$KEEP_DAYS -delete
find "$BACKUP_DIR" -name "backup-info-*.json" -mtime +$KEEP_DAYS -delete

# 9. Estadísticas finales
backup_size=$(du -sh "$BACKUP_DIR"/n8n-*-$DATE.* 2>/dev/null | awk '{total+=$1} END {print total}')
total_backups=$(ls "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
disk_used=$(du -sh "$BACKUP_DIR" | cut -f1)

log "=================================================="
log "${GREEN}Backup completado exitosamente${NC}"
log "Archivos creados en: $BACKUP_DIR"
log "Tamaño del backup: $(du -sh $BACKUP_DIR/n8n-data-$DATE.tar.gz | cut -f1) (datos) + $(du -sh $BACKUP_DIR/n8n-config-$DATE.tar.gz | cut -f1) (config)"
log "Total de backups: $total_backups"
log "Espacio usado por backups: $disk_used"
log "Próximo backup programado en 24 horas"
log "=================================================="
EOF

chmod +x backup-interserver.sh

# Programar backup diario
(crontab -l 2>/dev/null; echo "0 2 * * * /home/n8nuser/n8n-interserver/backup-interserver.sh") | crontab -
echo "Backup diario programado para las 2:00 AM"
```

### Script de Actualización

```bash
# Script de actualización de n8n
cat > update-interserver.sh << 'EOF'
#!/bin/bash
# Script de actualización para n8n en InterServer

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_DIR="/home/n8nuser/n8n-interserver"
DATE=$(date +%Y%m%d_%H%M%S)

log() {
    echo -e "[$DATE] $1"
}

echo "=================================================="
log "${GREEN}Iniciando actualización de n8n${NC}"
echo "=================================================="

cd "$PROJECT_DIR"

# 1. Crear backup pre-actualización
log "Creando backup pre-actualización..."
./backup-interserver.sh

if [ $? -ne 0 ]; then
    log "${RED}ERROR: Fallo el backup. Abortando actualización.${NC}"
    exit 1
fi

# 2. Descargar nuevas imágenes
log "Descargando nuevas imágenes..."
docker-compose pull

# 3. Verificar imágenes descargadas
log "Verificando nuevas imágenes..."
docker images n8nio/n8n

# 4. Parar servicios
log "Parando servicios..."
docker-compose down

# 5. Iniciar con nuevas imágenes
log "Iniciando servicios con nuevas imágenes..."
docker-compose up -d

# 6. Esperar que n8n esté listo
log "Esperando que n8n inicie..."
sleep 60

# 7. Verificar funcionamiento
log "Verificando funcionamiento..."
max_attempts=5
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:5678/healthz &>/dev/null; then
        log "${GREEN}✓ Actualización exitosa - n8n funcionando${NC}"
        
        # Mostrar versión actual
        current_version=$(docker-compose exec -T n8n n8n --version 2>/dev/null | head -1)
        log "Versión actual: $current_version"
        break
    else
        log "${YELLOW}Intento $attempt/$max_attempts - n8n aún no responde${NC}"
        if [ $attempt -eq $max_attempts ]; then
            log "${RED}ERROR: n8n no responde después de la actualización${NC}"
            log "Revisa los logs: docker-compose logs n8n"
            
            # Ofrecer rollback
            read -p "¿Quieres hacer rollback al backup anterior? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                log "Haciendo rollback..."
                # Aquí iría lógica de rollback
            fi
            exit 1
        fi
        sleep 30
        ((attempt++))
    fi
done

# 8. Limpiar imágenes viejas
log "Limpiando imágenes Docker antiguas..."
docker image prune -af

# 9. Verificar contenedores
log "Estado final de contenedores:"
docker-compose ps

log "=================================================="
log "${GREEN}Actualización completada${NC}"
log "=================================================="
EOF

chmod +x update-interserver.sh
```

### Script de Mantenimiento

```bash
# Script de mantenimiento general
cat > maintenance-interserver.sh << 'EOF'
#!/bin/bash
# Script de mantenimiento para InterServer VPS

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "[$(date)] $1"
}

echo "=================================================="
log "${GREEN}Iniciando mantenimiento InterServer VPS${NC}"
echo "=================================================="

# 1. Actualizar sistema
log "Actualizando sistema operativo..."
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
sudo apt autoclean

# 2. Limpiar Docker
log "Limpiando Docker..."
docker system prune -f
docker volume prune -f

# 3. Rotar logs del sistema
log "Rotando logs del sistema..."
sudo journalctl --vacuum-time=7d

# 4. Verificar espacio en disco
log "Verificando espacio en disco..."
df -h | grep -E "/$|/home"

# 5. Verificar memoria
log "Estado de la memoria:"
free -h

# 6. Verificar swap
if [ -f /swapfile ]; then
    log "Verificando swap..."
    swapon --show
else
    log "${YELLOW}No hay swap configurado${NC}"
fi

# 7. Verificar servicios críticos
log "Verificando servicios críticos..."
services=("docker" "ufw" "fail2ban" "ssh")

for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        log "${GREEN}✓${NC} $service: Activo"
    else
        log "${RED}✗${NC} $service: Inactivo"
    fi
done

# 8. Verificar n8n
cd /home/n8nuser/n8n-interserver
if docker-compose ps | grep -q "Up"; then
    log "${GREEN}✓${NC} n8n: Ejecutándose"
    
    # Verificar health
    if docker-compose exec -T n8n wget --quiet --tries=1 --spider http://localhost:5678/healthz 2>/dev/null; then
        log "${GREEN}✓${NC} n8n: Health check OK"
    else
        log "${YELLOW}⚠${NC} n8n: Health check falló"
    fi
else
    log "${RED}✗${NC} n8n: No está ejecutándose"
    log "Intentando reiniciar n8n..."
    docker-compose up -d
fi

# 9. Verificar backups
backup_dir="/home/n8nuser/n8n-interserver/backups"
if [ -d "$backup_dir" ]; then
    backup_count=$(ls "$backup_dir"/*.tar.gz 2>/dev/null | wc -l)
    if [ $backup_count -gt 0 ]; then
        latest_backup=$(ls -t "$backup_dir"/*.tar.gz 2>/dev/null | head -1)
        backup_age=$(( ($(date +%s) - $(stat -c %Y "$latest_backup")) / 86400 ))
        log "Último backup: hace $backup_age días"
        
        if [ $backup_age -gt 7 ]; then
            log "${YELLOW}⚠${NC} El último backup tiene más de 7 días"
        fi
    else
        log "${RED}⚠${NC} No hay backups disponibles"
    fi
fi

# 10. Estadísticas de seguridad
log "Verificando intentos fallidos de SSH..."
failed_attempts=$(sudo grep "authentication failure" /var/log/auth.log | wc -l)
log "Intentos fallidos de SSH hoy: $failed_attempts"

if [ $failed_attempts -gt 20 ]; then
    log "${YELLOW}⚠${NC} Alto número de intentos fallidos de SSH"
fi

# 11. Reporte final
log "=================================================="
log "${GREEN}Mantenimiento completado${NC}"
log "Sistema: $(uptime -p)"
log "Carga: $(uptime | awk -F'load average:' '{print $2}')"
log "Memoria libre: $(free -h | awk 'NR==2{print $7}')"
log "Disco disponible: $(df -h / | awk 'NR==2{print $4}')"
log "=================================================="
EOF

chmod +x maintenance-interserver.sh

# Programar mantenimiento semanal
(crontab -l 2>/dev/null; echo "0 1 * * 0 /home/n8nuser/n8n-interserver/maintenance-interserver.sh >> /home/n8nuser/n8n-interserver/maintenance.log 2>&1") | crontab -
echo "Mantenimiento semanal programado para domingos a la 1:00 AM"
```

---

## Configuración de Monitoreo

### Configurar Alertas por Email

```bash
# Instalar herramientas de email
sudo apt install postfix mailutils -y

# Configurar Postfix (seleccionar "Internet Site")
sudo dpkg-reconfigure postfix

# Script de alertas
cat > alerts-interserver.sh << 'EOF'
#!/bin/bash
# Sistema de alertas para InterServer

EMAIL="tu-email@ejemplo.com"
HOSTNAME=$(hostname)

# Función para enviar alerta
send_alert() {
    subject="$1"
    message="$2"
    
    echo "$message" | mail -s "[$HOSTNAME] $subject" "$EMAIL"
    echo "$(date): ALERT - $subject" >> /home/n8nuser/n8n-interserver/alerts.log
}

# Verificar uso de CPU
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
if (( $(echo "$cpu_usage > 80" | bc -l) )); then
    send_alert "Alta CPU" "CPU usage: $cpu_usage%"
fi

# Verificar memoria
memory_usage=$(free | awk 'FNR==2{printf "%.0f", $3/$2*100}')
if [ $memory_usage -gt 85 ]; then
    send_alert "Alta Memoria" "Memory usage: $memory_usage%"
fi

# Verificar disco
disk_usage=$(df / | awk 'FNR==2{print $5}' | cut -d'%' -f1)
if [ $disk_usage -gt 85 ]; then
    send_alert "Poco Espacio" "Disk usage: $disk_usage%"
fi

# Verificar n8n
if ! curl -f http://localhost:5678/healthz &>/dev/null; then
    send_alert "n8n Down" "n8n no está respondiendo en $(hostname)"
fi
EOF

chmod +x alerts-interserver.sh

# Programar verificación cada 15 minutos
(crontab -l 2>/dev/null; echo "*/15 * * * * /home/n8nuser/n8n-interserver/alerts-interserver.sh") | crontab -
```

---

## Troubleshooting

### Problemas Comunes en InterServer

#### 1. n8n No Inicia

```bash
# Verificar logs detallados
cd /home/n8nuser/n8n-interserver
docker-compose logs n8n

# Verificar recursos
free -h
df -h

# Verificar configuración
docker-compose config

# Reiniciar completamente
docker-compose down
docker-compose up -d
```

#### 2. Problemas de Conectividad

```bash
# Verificar firewall
sudo ufw status verbose

# Verificar puertos
ss -tlnp | grep 5678

# Test de conectividad
curl -I http://localhost:5678
telnet TU_IP_SERVIDOR 5678
```

#### 3. Alto Uso de Memoria

```bash
# Verificar procesos
top -o %MEM

# Verificar contenedores Docker
docker stats

# Ajustar límites en docker-compose.yml
# deploy:
#   resources:
#     limits:
#       memory: 1G
```

#### 4. Problemas de Rendimiento de Red

```bash
# Test de velocidad (InterServer)
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -

# Verificar latencia
ping -c 10 8.8.8.8

# Verificar MTU
ping -M do -s 1472 8.8.8.8
```

#### 5. Problemas de Backup

```bash
# Verificar espacio para backups
df -h /home/n8nuser/n8n-interserver/backups

# Test manual de backup
./backup-interserver.sh

# Verificar cron jobs
crontab -l
```

### Comandos de Diagnóstico

```bash
# Estado completo del sistema
./monitor-interserver.sh

# Logs del sistema
sudo journalctl -u docker -f

# Logs de fail2ban
sudo fail2ban-client status sshd

# Estado de red
ss -tuln | grep LISTEN

# Procesos que más memoria usan
ps aux --sort=-%mem | head -10

# Procesos que más CPU usan
ps aux --sort=-%cpu | head -10
```

---

## Migración desde Otro Proveedor

Si vienes de otro proveedor:

### Paso 1: Backup del Sistema Anterior

```bash
# En el servidor anterior
docker-compose exec n8n n8n export:workflow --all --output=workflows-export.json
docker-compose exec n8n n8n export:credentials --all --output=credentials-export.json
```

### Paso 2: Transfer a InterServer

```bash
# Desde tu máquina local
scp user@servidor-anterior:/path/to/exports/* .
scp *.json n8nuser@TU_IP_INTERSERVER:/home/n8nuser/n8n-interserver/
```

### Paso 3: Import en InterServer

```bash
# En InterServer
cd /home/n8nuser/n8n-interserver
docker-compose exec n8n n8n import:workflow --input=/home/node/.n8n/workflows-export.json
docker-compose exec n8n n8n import:credentials --input=/home/node/.n8n/credentials-export.json
```

---

## Resumen

InterServer es ideal para proyectos a largo plazo que valoran estabilidad de precios:

### Ventajas Clave
- **Precio bloqueado de por vida** - nunca aumenta
- **Recursos generosos** para el precio
- **Soporte técnico experimentado**
- **Garantía de uptime del 99.9%**
- **Migración gratuita** desde otros proveedores

### Consideraciones
- **Ubicación limitada** a Estados Unidos principalmente
- **Interface menos moderna** que otros proveedores
- **Requiere más configuración manual**

### Comandos de Referencia Rápida

```bash
# Monitoreo completo
./monitor-interserver.sh

# Backup manual
./backup-interserver.sh

# Actualización de n8n
./update-interserver.sh

# Mantenimiento general
./maintenance-interserver.sh

# Estado de servicios
docker-compose ps
sudo systemctl status docker ufw fail2ban

# Logs en tiempo real
docker-compose logs -f n8n
```

### URLs de Acceso
- **n8n**: `http://TU_IP_SERVIDOR:5678`
- **Panel InterServer**: [my.interserver.net](https://my.interserver.net)
- **SSH**: `ssh n8nuser@TU_IP_SERVIDOR`

**¡Tu instalación de n8n en InterServer está lista con precio garantizado de por vida!**