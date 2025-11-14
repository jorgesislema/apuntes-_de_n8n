# 🐳 Docker Básico para n8n

> **Guía fundamental para ejecutar n8n con Docker - La forma más simple y efectiva**

## 📋 Índice

- [🌟 ¿Por qué Docker para n8n?](#-por-qué-docker-para-n8n)
- [📋 Instalación de Docker](#-instalación-de-docker)
- [🚀 Primera Ejecución](#-primera-ejecución)
- [🔧 Configuraciones Esenciales](#-configuraciones-esenciales)
- [💾 Persistencia de Datos](#-persistencia-de-datos)
- [🌐 Variables de Entorno](#-variables-de-entorno)
- [🔒 Configuración de Seguridad](#-configuración-de-seguridad)
- [📊 Monitoring y Logs](#-monitoring-y-logs)
- [🆘 Troubleshooting](#-troubleshooting)

---

## 🌟 ¿Por qué Docker para n8n?

### ✅ **Ventajas de Docker**

- **🔄 Consistencia**: Mismo entorno en desarrollo, staging y producción
- **⚡ Rapidez**: Instalación en segundos vs minutos/horas manual
- **🔒 Aislamiento**: No afecta el sistema host
- **📦 Portabilidad**: Funciona idéntico en cualquier sistema con Docker
- **🔄 Rollbacks**: Volver a versiones anteriores instantáneamente
- **📈 Escalabilidad**: Fácil replicación horizontal

### 📊 **Docker vs Instalación Nativa**

| Aspecto | Docker | Instalación Nativa |
|---------|---------|-------------------|
| **⚡ Tiempo de setup** | 2-5 minutos | 15-60 minutos |
| **🔧 Complejidad** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **🔄 Actualizaciones** | `docker pull` | Proceso manual complejo |
| **🗑️ Limpieza** | `docker rm` | Desinstalación manual |
| **🔒 Seguridad** | Aislado | Expuesto al sistema |
| **📊 Rendimiento** | 95-98% nativo | 100% nativo |

---

## 📋 Instalación de Docker

### 🪟 **Windows**

```powershell
# Opción 1: Docker Desktop (recomendado para desarrollo)
# Descargar desde: https://www.docker.com/products/docker-desktop

# Opción 2: Chocolatey
choco install docker-desktop

# Opción 3: Winget
winget install Docker.DockerDesktop

# Verificar instalación
docker --version
docker run hello-world
```

### 🐧 **Linux (Ubuntu/Debian)**

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Agregar clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Relogear o ejecutar
newgrp docker

# Verificar instalación
docker --version
docker run hello-world
```

### 🍎 **macOS**

```bash
# Opción 1: Docker Desktop
# Descargar desde: https://www.docker.com/products/docker-desktop

# Opción 2: Homebrew
brew install --cask docker

# Verificar instalación
docker --version
```

---

## 🚀 Primera Ejecución

### ⚡ **Comando Básico**

```bash
# Ejecutar n8n de forma básica
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# Acceder en: http://localhost:5678
```

### 🔧 **Comando con Configuración Mínima**

```bash
# Ejecutar con configuración básica
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password123 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 📱 **Explicación de Parámetros**

| Parámetro | Descripción | Ejemplo |
|-----------|------------|---------|
| `-d` | **Detached mode**: ejecuta en background | `-d` |
| `--name` | **Nombre del contenedor** | `--name n8n` |
| `-p` | **Port mapping**: host:container | `-p 5678:5678` |
| `-e` | **Variables de entorno** | `-e N8N_HOST=localhost` |
| `-v` | **Volume mapping**: host:container | `-v ~/.n8n:/home/node/.n8n` |
| `--rm` | **Auto-remove**: elimina al parar | `--rm` |
| `-it` | **Interactive + TTY**: modo interactivo | `-it` |

---

## 🔧 Configuraciones Esenciales

### 🏠 **Configuración para Uso Local**

```bash
# Crear directorio para datos
mkdir -p ~/n8n-data

# Ejecutar configuración completa local
docker run -d \
  --name n8n-local \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=mySecurePassword123 \
  -e N8N_HOST=localhost \
  -e WEBHOOK_URL=http://localhost:5678/ \
  -e N8N_METRICS=true \
  -e N8N_LOG_LEVEL=info \
  -v ~/n8n-data:/home/node/.n8n \
  --restart unless-stopped \
  n8nio/n8n:latest
```

### 🌐 **Configuración para Producción**

```bash
# Configuración para servidor de producción
docker run -d \
  --name n8n-production \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=SuperSecurePassword456! \
  -e N8N_HOST=your-domain.com \
  -e N8N_PROTOCOL=https \
  -e WEBHOOK_URL=https://your-domain.com/ \
  -e N8N_METRICS=true \
  -e N8N_LOG_LEVEL=warn \
  -e EXECUTIONS_DATA_PRUNE=true \
  -e EXECUTIONS_DATA_MAX_AGE=168 \
  -v /opt/n8n-data:/home/node/.n8n \
  --restart always \
  n8nio/n8n:latest
```

### 👥 **Configuración Multi-Usuario**

```bash
# Configuración con autenticación deshabilitada para usar proxy externo
docker run -d \
  --name n8n-multiuser \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=false \
  -e N8N_HOST=your-domain.com \
  -e N8N_PROTOCOL=https \
  -e WEBHOOK_URL=https://your-domain.com/ \
  -e N8N_METRICS=true \
  -e N8N_PAYLOAD_SIZE_MAX=16 \
  -v /opt/n8n-data:/home/node/.n8n \
  --restart always \
  n8nio/n8n:latest
```

---

## 💾 Persistencia de Datos

### 📁 **Bind Mounts (Recomendado)**

```bash
# Windows
docker run -d --name n8n -p 5678:5678 -v C:/n8n-data:/home/node/.n8n n8nio/n8n

# Linux/macOS
docker run -d --name n8n -p 5678:5678 -v /home/user/n8n-data:/home/node/.n8n n8nio/n8n

# Estructura de datos
~/n8n-data/
├── config/           # Configuraciones
├── nodes/           # Nodos personalizados
├── credentials/     # Credenciales (encriptadas)
└── workflows/       # Backups de workflows
```

### 🗄️ **Docker Volumes**

```bash
# Crear volume
docker volume create n8n_data

# Usar volume
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Verificar volumes
docker volume ls
docker volume inspect n8n_data

# Backup del volume
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar czf /backup/n8n-backup.tar.gz -C /data .

# Restore del volume
docker run --rm -v n8n_data:/data -v $(pwd):/backup alpine tar xzf /backup/n8n-backup.tar.gz -C /data
```

### 💿 **Temporary Storage (Solo para Testing)**

```bash
# Sin persistencia - se pierde al eliminar container
docker run -d --name n8n-temp -p 5678:5678 n8nio/n8n
```

---

## 🌐 Variables de Entorno

### 🔧 **Variables Principales**

```bash
# Autenticación
N8N_BASIC_AUTH_ACTIVE=true          # Activar autenticación básica
N8N_BASIC_AUTH_USER=admin           # Usuario admin
N8N_BASIC_AUTH_PASSWORD=password    # Contraseña admin

# Configuración de servidor
N8N_HOST=localhost                  # Hostname
N8N_PROTOCOL=http                   # Protocolo (http/https)
N8N_PORT=5678                      # Puerto interno

# Webhooks
WEBHOOK_URL=http://localhost:5678/  # URL base para webhooks

# Base de datos
DB_TYPE=sqlite                      # Tipo: sqlite, postgresdb, mysqldb
DB_SQLITE_VACUUM_ON_STARTUP=true   # Optimizar SQLite al iniciar

# Logging
N8N_LOG_LEVEL=info                 # Nivel: error, warn, info, debug
N8N_LOG_OUTPUT=console             # Salida: console, file

# Performance
N8N_PAYLOAD_SIZE_MAX=16            # Tamaño máximo payload (MB)
EXECUTIONS_PROCESS=main            # Proceso: main, own
```

### 📊 **Variables de Producción**

```bash
# Límites y limpieza
EXECUTIONS_DATA_PRUNE=true         # Limpiar datos antiguos
EXECUTIONS_DATA_MAX_AGE=168        # Retener datos (horas)
EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000  # Máx ejecuciones

# Métricas
N8N_METRICS=true                   # Habilitar métricas Prometheus

# Seguridad
N8N_BLOCK_ENV_ACCESS_IN_NODE=true  # Bloquear acceso a env vars
N8N_DISABLE_UI=false              # Deshabilitar UI (solo API)

# Configuración avanzada
N8N_PUSH_BACKEND=websocket        # Backend para real-time: websocket, sse
```

### 📝 **Archivo .env**

```bash
# Crear archivo .env
cat > .env << 'EOF'
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=mySecurePassword123

# Server Configuration
N8N_HOST=localhost
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/

# Database
DB_TYPE=sqlite

# Logging
N8N_LOG_LEVEL=info

# Performance
N8N_PAYLOAD_SIZE_MAX=16
N8N_METRICS=true
EOF

# Usar archivo .env
docker run -d --name n8n -p 5678:5678 --env-file .env -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

---

## 🔒 Configuración de Seguridad

### 🛡️ **Red Segura**

```bash
# Crear red personalizada
docker network create n8n-network

# Ejecutar en red aislada
docker run -d \
  --name n8n \
  --network n8n-network \
  -p 127.0.0.1:5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password123 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Solo accesible desde localhost
```

### 🔐 **Secrets Management**

```bash
# Usar Docker secrets (en Swarm mode)
echo "mySecurePassword123" | docker secret create n8n_password -

# Crear servicio con secret
docker service create \
  --name n8n \
  --secret n8n_password \
  --publish 5678:5678 \
  -e N8N_BASIC_AUTH_PASSWORD_FILE=/run/secrets/n8n_password \
  n8nio/n8n
```

### 👤 **Usuario No-Root**

```bash
# Verificar que n8n no ejecuta como root
docker run --rm n8nio/n8n whoami
# Output: node (usuario no-root)

# Configurar permisos correctos para bind mount
sudo chown -R 1000:1000 ~/.n8n

# Ejecutar con usuario específico
docker run -d \
  --name n8n \
  --user 1000:1000 \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

---

## 📊 Monitoring y Logs

### 📋 **Comandos de Monitoring**

```bash
# Ver status de contenedor
docker ps
docker stats n8n

# Inspeccionar contenedor
docker inspect n8n

# Ver recursos utilizados
docker exec n8n ps aux
docker exec n8n df -h
docker exec n8n free -h
```

### 📝 **Gestión de Logs**

```bash
# Ver logs en tiempo real
docker logs -f n8n

# Ver últimas 100 líneas
docker logs --tail 100 n8n

# Ver logs con timestamp
docker logs -t n8n

# Ver logs desde una fecha
docker logs --since "2024-01-01T00:00:00" n8n

# Configurar log rotation
docker run -d \
  --name n8n \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=5 \
  -p 5678:5678 \
  n8nio/n8n
```

### 📈 **Health Checks**

```bash
# Dockerfile con health check
cat > Dockerfile << 'EOF'
FROM n8nio/n8n:latest

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5678/healthz || exit 1
EOF

# Ejecutar con health check
docker build -t n8n-with-health .
docker run -d --name n8n -p 5678:5678 n8n-with-health

# Ver status de salud
docker ps
# STATUS column mostrará: healthy/unhealthy/starting
```

---

## 🔄 Gestión de Contenedores

### ⚡ **Comandos Básicos**

```bash
# Listar contenedores
docker ps                    # Solo activos
docker ps -a                # Todos los contenedores

# Parar/Iniciar contenedor
docker stop n8n
docker start n8n
docker restart n8n

# Eliminar contenedor
docker rm n8n              # Si está parado
docker rm -f n8n            # Forzar eliminación

# Ejecutar comandos en contenedor
docker exec -it n8n bash
docker exec -it n8n sh
docker exec n8n npm list   # Ver paquetes instalados
```

### 🔄 **Actualizaciones**

```bash
# Actualizar imagen
docker pull n8nio/n8n:latest

# Recrear contenedor con nueva imagen
docker stop n8n
docker rm n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n:latest

# Script de actualización automatizado
cat > update-n8n.sh << 'EOF'
#!/bin/bash
echo "Updating n8n..."
docker pull n8nio/n8n:latest
docker stop n8n
docker rm n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password123 \
  -v ~/.n8n:/home/node/.n8n \
  --restart unless-stopped \
  n8nio/n8n:latest
echo "n8n updated successfully!"
EOF

chmod +x update-n8n.sh
```

### 🏷️ **Versiones Específicas**

```bash
# Ejecutar versión específica
docker run -d --name n8n -p 5678:5678 n8nio/n8n:1.15.1

# Listar tags disponibles
# Visitar: https://hub.docker.com/r/n8nio/n8n/tags

# Pin a versión para estabilidad
docker run -d \
  --name n8n-stable \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n:1.15.1  # Usar versión específica
```

---

## 🆘 Troubleshooting

### ❌ **Problemas Comunes**

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Port already in use** | Error binding port | Cambiar puerto: `-p 5679:5678` |
| **Permission denied** | Cannot write to volume | `sudo chown -R 1000:1000 ~/.n8n` |
| **Container exits immediately** | Status: Exited | Ver logs: `docker logs n8n` |
| **Cannot reach n8n** | Connection refused | Verificar firewall y port mapping |
| **Slow performance** | High response times | Aumentar resources: `--memory 2g --cpus 2` |

### 🔍 **Comandos de Debug**

```bash
# Información detallada del contenedor
docker inspect n8n

# Procesos dentro del contenedor
docker exec n8n ps aux

# Variables de entorno
docker exec n8n env

# Verificar conectividad de red
docker exec n8n ping google.com

# Verificar espacio en disco
docker system df
docker exec n8n df -h

# Limpiar recursos no utilizados
docker system prune -a
```

### 🚨 **Recuperación de Emergencia**

```bash
# Backup rápido antes de troubleshooting
docker cp n8n:/home/node/.n8n ~/backup-$(date +%Y%m%d)

# Recrear contenedor con logs de debug
docker stop n8n
docker rm n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_LOG_LEVEL=debug \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Ver logs en tiempo real para debug
docker logs -f n8n
```

---

## 📈 Optimización de Performance

### 🚀 **Límites de Recursos**

```bash
# Configurar límites de CPU y memoria
docker run -d \
  --name n8n \
  --memory 2g \
  --cpus 1.5 \
  --memory-reservation 1g \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 📊 **Monitoreo de Recursos**

```bash
# Monitoreo continuo
docker stats n8n

# Script de monitoreo
cat > monitor-n8n.sh << 'EOF'
#!/bin/bash
while true; do
  echo "=== $(date) ==="
  docker stats --no-stream n8n
  echo "=== Container Health ==="
  docker exec n8n curl -f http://localhost:5678/healthz 2>/dev/null && echo "OK" || echo "ERROR"
  sleep 30
done
EOF

chmod +x monitor-n8n.sh
```

---

## ✅ Checklist Final

### 🎯 **Instalación Exitosa**

- [ ] ✅ **Docker instalado** y funcionando
- [ ] ✅ **Contenedor n8n** ejecutándose
- [ ] ✅ **Puerto 5678** accesible
- [ ] ✅ **Datos persistentes** configurados
- [ ] ✅ **Autenticación básica** activada
- [ ] ✅ **Variables de entorno** configuradas
- [ ] ✅ **Health check** funcionando
- [ ] ✅ **Backup automático** configurado

### 🔗 **URLs de Verificación**

```bash
# Local
curl -I http://localhost:5678

# Con autenticación
curl -u admin:password123 http://localhost:5678

# Health check
curl -f http://localhost:5678/healthz
```

---

## 🚀 Próximos Pasos

1. **📦 Migra a Docker Compose** para configuración más avanzada
2. **🗄️ Configura base de datos externa** (PostgreSQL)
3. **🔒 Implementa HTTPS** con reverse proxy
4. **📊 Añade monitoreo** con Prometheus/Grafana
5. **🔄 Configura CI/CD** para actualizaciones automáticas

---

> **🎉 ¡Perfecto!** Ahora dominas Docker para n8n. Tu instalación es robusta, portable y fácil de mantener.

**💡 Tip Final**: Docker es la base perfecta para escalar. El próximo paso es Docker Compose para entornos más complejos.