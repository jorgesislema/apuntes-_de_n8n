# 🎼 Docker Compose para n8n

> **La forma profesional de desplegar n8n - Configuración declarativa y multi-servicio**

## 📋 Índice

- [🌟 ¿Por qué Docker Compose?](#-por-qué-docker-compose)
- [📋 Instalación de Docker Compose](#-instalación-de-docker-compose)
- [🏗️ Arquitecturas Disponibles](#️-arquitecturas-disponibles)
- [⚡ Setup Básico](#-setup-básico)
- [🗄️ Con Base de Datos PostgreSQL](#️-con-base-de-datos-postgresql)
- [🌐 Con Reverse Proxy (Nginx)](#-con-reverse-proxy-nginx)
- [🔒 Stack Completo con SSL](#-stack-completo-con-ssl)
- [📊 Con Monitoreo (Prometheus + Grafana)](#-con-monitoreo-prometheus--grafana)
- [🔄 Gestión y Mantenimiento](#-gestión-y-mantenimiento)

---

## 🌟 ¿Por qué Docker Compose?

### ✅ **Ventajas sobre Docker Básico**

- **📝 Configuración declarativa**: Todo en archivos YAML
- **🔄 Reproducibilidad**: Mismo setup en cualquier entorno
- **🔗 Multi-contenedor**: Gestiona servicios relacionados
- **🌐 Networking automático**: Conectividad entre servicios
- **📦 Volumes compartidos**: Datos persistentes entre servicios
- **⚡ Una sola línea**: `docker-compose up -d`

### 📊 **Comparación de Métodos**

| Característica | Docker Run | Docker Compose | Kubernetes |
|----------------|------------|----------------|------------|
| **📝 Complejidad** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **🔧 Multi-servicio** | ❌ | ✅ | ✅ |
| **📊 Escalabilidad** | ❌ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **🚀 Tiempo setup** | 2 min | 5 min | 30+ min |
| **💼 Prod-ready** | ❌ | ✅ | ✅ |

---

## 📋 Instalación de Docker Compose

### 🪟 **Windows**
```powershell
# Incluido con Docker Desktop
docker-compose --version

# O instalar standalone
Invoke-WebRequest "https://github.com/docker/compose/releases/latest/download/docker-compose-windows-x86_64.exe" -UseBasicParsing -OutFile $Env:ProgramFiles\Docker\docker-compose.exe
```

### 🐧 **Linux**
```bash
# Método 1: Desde repositorio oficial
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Método 2: Usando pip
pip3 install docker-compose

# Verificar instalación
docker-compose --version
```

### 🍎 **macOS**
```bash
# Incluido con Docker Desktop
docker-compose --version

# O usando Homebrew
brew install docker-compose
```

---

## 🏗️ Arquitecturas Disponibles

### 🏠 **1. Setup Básico**
```
┌─────────────────┐
│     n8n         │
│   Container     │
│   + SQLite      │
└─────────────────┘
```

### 🗄️ **2. Con PostgreSQL**
```
┌─────────────────┐    ┌─────────────────┐
│     n8n         │◄──►│   PostgreSQL    │
│   Container     │    │   Container     │
│                 │    │   + Volume      │
└─────────────────┘    └─────────────────┘
```

### 🌐 **3. Con Reverse Proxy**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │◄──►│     n8n         │◄──►│   PostgreSQL    │
│   + SSL/TLS     │    │   Container     │    │   Container     │
│   + Port 80/443 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 📊 **4. Stack Completo**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │◄──►│     n8n         │◄──►│   PostgreSQL    │
│   + SSL/TLS     │    │   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Prometheus   │    │    Grafana      │    │     Redis       │
│   Monitoring    │    │   Dashboard     │    │     Cache       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ⚡ Setup Básico

### 📁 **Estructura de Proyecto**

```
n8n-docker/
├── docker-compose.yml
├── .env
├── data/
│   ├── n8n/
│   └── postgres/
├── config/
│   └── nginx.conf
└── scripts/
    ├── backup.sh
    └── restore.sh
```

### 📝 **docker-compose.yml Básico**

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "${N8N_PORT:-5678}:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=${N8N_BASIC_AUTH_ACTIVE:-true}
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER:-admin}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - N8N_HOST=${N8N_HOST:-localhost}
      - N8N_PROTOCOL=${N8N_PROTOCOL:-http}
      - WEBHOOK_URL=${WEBHOOK_URL:-http://localhost:5678/}
      - N8N_METRICS=${N8N_METRICS:-true}
      - N8N_LOG_LEVEL=${N8N_LOG_LEVEL:-info}
    volumes:
      - ./data/n8n:/home/node/.n8n
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5678/healthz || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  n8n_data:

networks:
  n8n_network:
    driver: bridge
```

### 🔐 **Archivo .env**

```bash
# Crear archivo .env
cat > .env << 'EOF'
# =================================
# n8n Configuration
# =================================
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=YourSecurePassword123!

# Server Configuration
N8N_HOST=localhost
N8N_PROTOCOL=http
N8N_PORT=5678
WEBHOOK_URL=http://localhost:5678/

# Logging & Metrics
N8N_LOG_LEVEL=info
N8N_METRICS=true

# =================================
# Environment
# =================================
COMPOSE_PROJECT_NAME=n8n
EOF
```

### 🚀 **Iniciar Servicios**

```bash
# Crear directorios
mkdir -p data/n8n data/postgres config scripts

# Configurar permisos
chmod 755 data/n8n
sudo chown -R 1000:1000 data/n8n

# Iniciar servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

---

## 🗄️ Con Base de Datos PostgreSQL

### 📝 **docker-compose.yml con PostgreSQL**

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "${N8N_PORT:-5678}:5678"
    environment:
      # Autenticación
      - N8N_BASIC_AUTH_ACTIVE=${N8N_BASIC_AUTH_ACTIVE:-true}
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER:-admin}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      
      # Configuración del servidor
      - N8N_HOST=${N8N_HOST:-localhost}
      - N8N_PROTOCOL=${N8N_PROTOCOL:-http}
      - WEBHOOK_URL=${WEBHOOK_URL}
      
      # Base de datos PostgreSQL
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      
      # Performance y logging
      - N8N_METRICS=true
      - N8N_LOG_LEVEL=info
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
      - N8N_PAYLOAD_SIZE_MAX=16
    volumes:
      - ./data/n8n:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5678/healthz || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    container_name: n8n_postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-n8n}
      - POSTGRES_USER=${POSTGRES_USER:-n8nuser}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./config/postgres:/docker-entrypoint-initdb.d:ro
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-n8nuser} -d ${POSTGRES_DB:-n8n}"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  n8n_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/16

volumes:
  n8n_data:
    driver: local
  postgres_data:
    driver: local
```

### 🔐 **Archivo .env Completo**

```bash
cat > .env << 'EOF'
# =================================
# n8n Configuration
# =================================
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=YourSuperSecurePassword123!

# Server Configuration
N8N_HOST=your-domain.com
N8N_PROTOCOL=https
N8N_PORT=5678
WEBHOOK_URL=https://your-domain.com/

# =================================
# PostgreSQL Configuration
# =================================
POSTGRES_DB=n8n
POSTGRES_USER=n8nuser
POSTGRES_PASSWORD=PostgreSQLSecurePassword456!
POSTGRES_PORT=5432

# =================================
# Environment
# =================================
COMPOSE_PROJECT_NAME=n8n-production
EOF
```

### 🗄️ **Optimización PostgreSQL**

```bash
# Crear config/postgres/postgresql.conf
mkdir -p config/postgres
cat > config/postgres/postgresql.conf << 'EOF'
# Configuración optimizada para n8n
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB

# Logging
log_destination = 'stderr'
log_statement = 'error'
log_min_duration_statement = 1000
EOF

# Crear script de inicialización
cat > config/postgres/01-init.sql << 'EOF'
-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar timezone
SET timezone = 'UTC';

-- Crear índices adicionales para n8n
-- (Estos se crearán automáticamente por n8n, pero podemos optimizarlos)
EOF
```

---

## 🌐 Con Reverse Proxy (Nginx)

### 🔧 **docker-compose.yml con Nginx**

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: n8n_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./config/nginx/conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - n8n
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    expose:
      - "5678"
    environment:
      # No exponer puerto directamente
      - N8N_BASIC_AUTH_ACTIVE=${N8N_BASIC_AUTH_ACTIVE}
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - N8N_HOST=${N8N_HOST}
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://${N8N_HOST}/
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_METRICS=true
      - N8N_LOG_LEVEL=info
    volumes:
      - ./data/n8n:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - n8n_network

  postgres:
    image: postgres:15-alpine
    container_name: n8n_postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    expose:
      - "5432"
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  n8n_network:
    driver: bridge
```

### 🌐 **Configuración Nginx**

```bash
# Crear directorio y archivo nginx.conf
mkdir -p config/nginx/conf.d logs/nginx ssl

cat > config/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    multi_accept on;
    use epoll;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Incluir configuraciones de sitios
    include /etc/nginx/conf.d/*.conf;
}
EOF

# Crear configuración del sitio
cat > config/nginx/conf.d/n8n.conf << 'EOF'
upstream n8n_backend {
    server n8n:5678;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # n8n proxy
    location / {
        proxy_pass http://n8n_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Webhook endpoint optimization
    location /webhook/ {
        proxy_pass http://n8n_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # No timeout for webhooks
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
EOF
```

---

## 🔒 Stack Completo con SSL

### 📄 **docker-compose.yml Completo**

```yaml
version: '3.8'

services:
  # ========================================
  # Nginx Reverse Proxy
  # ========================================
  nginx:
    image: nginx:alpine
    container_name: n8n_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx:/etc/nginx:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - n8n
    networks:
      - n8n_network
      - monitoring_network

  # ========================================
  # Certbot for SSL
  # ========================================
  certbot:
    image: certbot/certbot:latest
    container_name: n8n_certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./logs/certbot:/var/log/letsencrypt
      - ./config/certbot:/etc/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@domain.com --agree-tos --no-eff-email -d your-domain.com
    networks:
      - n8n_network

  # ========================================
  # n8n Main Application
  # ========================================
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    expose:
      - "5678"
    environment:
      # Authentication
      - N8N_BASIC_AUTH_ACTIVE=${N8N_BASIC_AUTH_ACTIVE}
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      
      # Server Configuration
      - N8N_HOST=${N8N_HOST}
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - WEBHOOK_URL=https://${N8N_HOST}/
      
      # Database Configuration
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      
      # Performance & Monitoring
      - N8N_METRICS=true
      - N8N_LOG_LEVEL=${N8N_LOG_LEVEL:-info}
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
      - N8N_PAYLOAD_SIZE_MAX=16
      - EXECUTIONS_PROCESS=main
      
      # Security
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=true
      
      # Cache (Redis)
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
      - ./data/n8n:/home/node/.n8n
      - ./logs/n8n:/home/node/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - n8n_network
      - monitoring_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5678/healthz || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ========================================
  # PostgreSQL Database
  # ========================================
  postgres:
    image: postgres:15-alpine
    container_name: n8n_postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./config/postgres:/docker-entrypoint-initdb.d:ro
      - ./logs/postgres:/var/log/postgresql
    expose:
      - "5432"
    networks:
      - n8n_network
      - monitoring_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ========================================
  # Redis Cache
  # ========================================
  redis:
    image: redis:7-alpine
    container_name: n8n_redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - ./data/redis:/data
      - ./logs/redis:/var/log/redis
    expose:
      - "6379"
    networks:
      - n8n_network
      - monitoring_network
    healthcheck:
      test: ["CMD-SHELL", "redis-cli --no-auth-warning -a ${REDIS_PASSWORD} ping | grep PONG"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  n8n_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/16
  monitoring_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.21.0.0/16

volumes:
  n8n_data:
    driver: local
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

### 🔐 **Archivo .env para Producción**

```bash
cat > .env << 'EOF'
# =================================
# n8n Configuration
# =================================
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=YourSuperSecureN8NPassword123!

# Server Configuration
N8N_HOST=your-domain.com
N8N_LOG_LEVEL=warn

# =================================
# Database Configuration
# =================================
POSTGRES_DB=n8n_production
POSTGRES_USER=n8nuser
POSTGRES_PASSWORD=SuperSecurePostgreSQLPassword456!

# =================================
# Redis Configuration
# =================================
REDIS_PASSWORD=SecureRedisPassword789!

# =================================
# Environment
# =================================
COMPOSE_PROJECT_NAME=n8n-production
COMPOSE_FILE=docker-compose.yml

# =================================
# SSL/TLS Configuration
# =================================
SSL_EMAIL=your-email@domain.com
SSL_DOMAIN=your-domain.com
EOF
```

---

## 📊 Con Monitoreo (Prometheus + Grafana)

### 📊 **docker-compose.monitoring.yml**

```yaml
version: '3.8'

services:
  # ========================================
  # Prometheus Monitoring
  # ========================================
  prometheus:
    image: prom/prometheus:latest
    container_name: n8n_prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus:/etc/prometheus:ro
      - ./data/prometheus:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    networks:
      - monitoring_network

  # ========================================
  # Grafana Dashboard
  # ========================================
  grafana:
    image: grafana/grafana:latest
    container_name: n8n_grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=${GRAFANA_USER:-admin}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource
    volumes:
      - ./data/grafana:/var/lib/grafana
      - ./config/grafana:/etc/grafana:ro
      - ./config/grafana/dashboards:/var/lib/grafana/dashboards:ro
    depends_on:
      - prometheus
    networks:
      - monitoring_network

  # ========================================
  # Node Exporter (System Metrics)
  # ========================================
  node-exporter:
    image: prom/node-exporter:latest
    container_name: n8n_node_exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring_network

  # ========================================
  # cAdvisor (Container Metrics)
  # ========================================
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: n8n_cadvisor
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    networks:
      - monitoring_network

  # ========================================
  # Alertmanager
  # ========================================
  alertmanager:
    image: prom/alertmanager:latest
    container_name: n8n_alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./config/alertmanager:/etc/alertmanager:ro
      - ./data/alertmanager:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    networks:
      - monitoring_network

networks:
  monitoring_network:
    external: true
```

### 🔧 **Configuración Prometheus**

```bash
# Crear config/prometheus/prometheus.yml
mkdir -p config/prometheus config/grafana config/alertmanager

cat > config/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # n8n metrics
  - job_name: 'n8n'
    static_configs:
      - targets: ['n8n:5678']
    metrics_path: '/metrics'
    scrape_interval: 30s

  # System metrics
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Container metrics
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  # PostgreSQL metrics
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Redis metrics
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
EOF

# Crear reglas de alerta
mkdir -p config/prometheus/rules
cat > config/prometheus/rules/n8n.yml << 'EOF'
groups:
  - name: n8n.rules
    rules:
      - alert: N8NDown
        expr: up{job="n8n"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "n8n instance is down"
          description: "n8n instance {{ $labels.instance }} has been down for more than 1 minute."

      - alert: N8NHighMemoryUsage
        expr: (container_memory_usage_bytes{name="n8n"} / container_spec_memory_limit_bytes{name="n8n"}) > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "n8n high memory usage"
          description: "n8n memory usage is above 90% for 5 minutes."

      - alert: PostgreSQLDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "PostgreSQL instance is down"
          description: "PostgreSQL instance {{ $labels.instance }} has been down for more than 1 minute."
EOF
```

### 📊 **Dashboard Grafana**

```bash
# Crear dashboard básico para n8n
cat > config/grafana/dashboards/n8n-dashboard.json << 'EOF'
{
  "dashboard": {
    "title": "n8n Monitoring Dashboard",
    "panels": [
      {
        "title": "n8n Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"n8n\"}",
            "legendFormat": "n8n Status"
          }
        ]
      },
      {
        "title": "Active Workflows",
        "type": "stat",
        "targets": [
          {
            "expr": "n8n_workflow_executions_total",
            "legendFormat": "Total Executions"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "container_memory_usage_bytes{name=\"n8n\"}",
            "legendFormat": "Memory Usage"
          }
        ]
      },
      {
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(container_cpu_usage_seconds_total{name=\"n8n\"}[5m]) * 100",
            "legendFormat": "CPU Usage %"
          }
        ]
      }
    ]
  }
}
EOF
```

---

## 🔄 Gestión y Mantenimiento

### 🚀 **Comandos Esenciales**

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f n8n

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart n8n

# Recrear servicios
docker-compose up -d --force-recreate

# Actualizar imágenes
docker-compose pull
docker-compose up -d --force-recreate
```

### 🔄 **Scripts de Automatización**

```bash
# Crear script de backup
cat > scripts/backup.sh << 'EOF'
#!/bin/bash

# Configuración
BACKUP_DIR="/backups/n8n"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="n8n_backup_$DATE"

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

# Parar servicios temporalmente
docker-compose stop n8n

# Backup de datos n8n
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_n8n.tar.gz" -C ./data/n8n .

# Backup de base de datos PostgreSQL
docker-compose exec postgres pg_dump -U n8nuser n8n | gzip > "$BACKUP_DIR/${BACKUP_NAME}_postgres.sql.gz"

# Backup de configuraciones
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" config/ .env docker-compose.yml

# Reiniciar servicios
docker-compose start n8n

echo "Backup completed: $BACKUP_NAME"
EOF

chmod +x scripts/backup.sh

# Script de actualización
cat > scripts/update.sh << 'EOF'
#!/bin/bash

echo "Updating n8n stack..."

# Backup antes de actualizar
./scripts/backup.sh

# Pull nuevas imágenes
docker-compose pull

# Recrear servicios con nuevas imágenes
docker-compose up -d --force-recreate

# Verificar que todo esté funcionando
sleep 30
docker-compose ps

echo "Update completed!"
EOF

chmod +x scripts/update.sh

# Script de monitoreo
cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

while true; do
    clear
    echo "=== n8n Stack Status $(date) ==="
    docker-compose ps
    echo ""
    echo "=== Resource Usage ==="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    echo ""
    echo "=== Disk Usage ==="
    du -sh data/*
    echo ""
    sleep 30
done
EOF

chmod +x scripts/monitor.sh
```

### 📊 **Configurar Cron para Mantenimiento**

```bash
# Agregar al crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/n8n-docker/scripts/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 4 * * 0 /path/to/n8n-docker/scripts/update.sh") | crontab -

# Ver crontab actual
crontab -l
```

---

## ✅ Checklist de Producción

### 🎯 **Verificación Completa**

- [ ] ✅ **Docker Compose** instalado y funcionando
- [ ] ✅ **Servicios iniciados** correctamente
- [ ] ✅ **PostgreSQL** conectado y saludable
- [ ] ✅ **Nginx** sirviendo HTTPS
- [ ] ✅ **SSL/TLS** configurado y válido
- [ ] ✅ **Backups automáticos** configurados
- [ ] ✅ **Monitoreo** activo
- [ ] ✅ **Logs** configurados y rotando
- [ ] ✅ **Health checks** funcionando
- [ ] ✅ **Firewall** configurado
- [ ] ✅ **Variables sensibles** en .env

### 🔗 **URLs de Verificación**

```bash
# Aplicación principal
curl -I https://your-domain.com

# Health checks
curl https://your-domain.com/healthz

# Métricas (si están expuestas)
curl https://your-domain.com/metrics

# Grafana (si está configurado)
curl -I http://localhost:3000
```

---

## 🆘 Troubleshooting

### ❌ **Problemas Comunes**

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Service won't start** | Exit code 1 | `docker-compose logs service_name` |
| **Database connection** | Connection refused | Verificar `depends_on` y health checks |
| **SSL certificate** | Certificate error | Verificar paths en nginx config |
| **Port conflicts** | Address already in use | Cambiar puertos en docker-compose.yml |
| **Permission denied** | Volume mount fails | `sudo chown -R 1000:1000 data/` |

### 🔍 **Comandos de Debug**

```bash
# Ver todos los contenedores y su estado
docker-compose ps -a

# Inspeccionar red
docker network inspect n8n_n8n_network

# Ver configuración de un servicio
docker-compose config

# Validar docker-compose.yml
docker-compose config --quiet

# Ver logs de todos los servicios
docker-compose logs

# Ejecutar comando en contenedor
docker-compose exec n8n bash
```

---

## 🚀 Próximos Pasos

1. **☸️ Migrar a Kubernetes** para mayor escalabilidad
2. **🔄 Implementar CI/CD** con GitLab/GitHub Actions
3. **🌍 Configurar CDN** para mejor rendimiento global
4. **📊 Mejorar observabilidad** con distributed tracing
5. **🔒 Implementar secretos** con Vault o cloud providers

---

> **🎉 ¡Excelente!** Ahora tienes un deployment profesional de n8n con Docker Compose. Tu stack es robusto, escalable y listo para producción.

**💡 Tip Final**: Docker Compose es perfecto para la mayoría de casos de uso. Para necesidades enterprise más complejas, considera Kubernetes como siguiente paso.