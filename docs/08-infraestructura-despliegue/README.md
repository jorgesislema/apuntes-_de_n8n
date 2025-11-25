# Administración y Escalado (Self-Hosting)

## Introducción

El self-hosting de n8n te permite tener control total sobre tu instancia, datos y configuraciones, siendo ideal para empresas que requieren mayor seguridad y personalización.

**Ejemplo:** Es como tener tu propio servidor de aplicaciones empresariales. En lugar de depender de servicios externos, tienes tu infraestructura propia con control total sobre seguridad, rendimiento y configuración.

## ¿Por qué Self-Host n8n?

### Ventajas:
- **Control total** sobre datos y configuraciones
- **Seguridad empresarial** con políticas internas
- **Escalabilidad** según necesidades específicas
- **Integración** con infraestructura existente
- **Personalización** completa de la plataforma

### Consideraciones:
- **Responsabilidad** de mantenimiento y actualizaciones
- **Conocimientos técnicos** requeridos
- **Costos** de infraestructura y personal
- **Monitoreo** y backup propios

## Métodos de Instalación

### 1. Docker (Recomendado)
**Ventajas:** Fácil despliegue, aislamiento, portabilidad
**Desventajas:** Requiere conocimientos de Docker

### 2. npm/Node.js
**Ventajas:** Control directo, personalización máxima
**Desventajas:** Más complejo de mantener

### 3. Kubernetes
**Ventajas:** Alta disponibilidad, escalabilidad automática
**Desventajas:** Complejidad de configuración

## Contenido del Capítulo

### 1. [Instalación con Docker](./01_Instalacion_Docker.md)
- Docker Compose básico
- Configuración de volúmenes
- Variables de entorno

### 2. [Instalación Manual (npm)](./02_Instalacion_Manual_npm.md)
- Instalación desde npm
- Configuración de PM2
- Proxy reverso con Nginx

### 3. [Despliegue en Kubernetes](./03_Despliegue_Kubernetes.md)
- Manifiestos YAML
- Ingress y SSL
- Escalado horizontal

### 4. [Configuración de Base de Datos](./04_Configuracion_Base_de_Datos.md)
- PostgreSQL setup
- MySQL configuración
- Migración de datos

### 5. [Configuración de Autenticación](./05_Configuracion_Autenticacion.md)
- LDAP integration
- OAuth providers
- SAML configuration

### 6. [Monitoreo y Logs](./06_Monitoreo_y_Logs.md)
- Prometheus metrics
- ELK stack integration
- Health checks

### 7. [Backup y Recuperación](./07_Backup_y_Recuperacion.md)
- Estrategias de backup
- Automatización
- Disaster recovery

### 8. [Escalado y Performance](./08_Escalado_y_Performance.md)
- Load balancing
- Caching strategies
- Resource optimization

### 9. [Seguridad Empresarial](./09_Seguridad_Empresarial.md)
- Network security
- Encryption at rest
- Audit logging

### 10. [Actualizaciones y Mantenimiento](./10_Actualizaciones_y_Mantenimiento.md)
- Update strategies
- Rollback procedures
- Maintenance windows

## Arquitectura de Despliegue

### Arquitectura Básica:
```
[Load Balancer] → [n8n Instance] → [Database]
                      ↓
                [File Storage]
```

### Arquitectura Escalada:
```
[Load Balancer] → [n8n Instance 1] → [Database Cluster]
                → [n8n Instance 2] → [Redis Cache]
                → [n8n Instance 3] → [Shared Storage]
                      ↓
                [Monitoring Stack]
```

## Requisitos de Sistema

### Mínimos:
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disco:** 20 GB SSD
- **Red:** 100 Mbps

### Recomendados (Producción):
- **CPU:** 4+ cores
- **RAM:** 8+ GB
- **Disco:** 100+ GB SSD
- **Red:** 1 Gbps
- **Backup:** Storage adicional

### Para Alta Escala:
- **CPU:** 8+ cores por instancia
- **RAM:** 16+ GB por instancia
- **Disco:** 500+ GB SSD NVMe
- **Red:** 10 Gbps
- **Redundancia:** Múltiples zonas

## Variables de Entorno Importantes

### Configuración Básica:
```bash
# Database
N8N_DATABASE_TYPE=postgresdb
N8N_DATABASE_HOST=localhost
N8N_DATABASE_PORT=5432
N8N_DATABASE_NAME=n8n
N8N_DATABASE_USER=n8n
N8N_DATABASE_PASSWORD=secure_password

# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin_password

# Encryption
N8N_ENCRYPTION_KEY=your_encryption_key_here

# External URLs
N8N_EDITOR_BASE_URL=https://n8n.yourcompany.com
N8N_WEBHOOK_URL=https://n8n.yourcompany.com
```

### Configuración de Performance:
```bash
# Execution
N8N_EXECUTION_TIMEOUT=300
N8N_EXECUTION_TIMEOUT_MAX=3600
N8N_EXECUTION_DATA_SAVE_ON_ERROR=all
N8N_EXECUTION_DATA_SAVE_ON_SUCCESS=all

# Logging
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console,file
N8N_LOG_FILE_LOCATION=./logs/
```

## Docker Compose Ejemplo

### docker-compose.yml:
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_DATABASE_TYPE=postgresdb
      - N8N_DATABASE_HOST=postgres
      - N8N_DATABASE_PORT=5432
      - N8N_DATABASE_NAME=n8n
      - N8N_DATABASE_USER=n8n
      - N8N_DATABASE_PASSWORD=n8n_password
      - N8N_ENCRYPTION_KEY=your_encryption_key
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/home/node/workflows
    depends_on:
      - postgres
    
  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  n8n_data:
  postgres_data:
  redis_data:
```

## Configuración de Nginx

### nginx.conf:
```nginx
upstream n8n_backend {
    server 127.0.0.1:5678;
    # Agregar más instancias para load balancing
    # server 127.0.0.1:5679;
}

server {
    listen 80;
    server_name n8n.yourcompany.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name n8n.yourcompany.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    client_max_body_size 50M;
    
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## Monitoreo Básico

### Health Check Script:
```bash
#!/bin/bash
# health-check.sh

URL="http://localhost:5678/healthz"
TIMEOUT=30

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT $URL)

if [ $response -eq 200 ]; then
    echo "n8n is healthy"
    exit 0
else
    echo "n8n is unhealthy (HTTP $response)"
    exit 1
fi
```

## Mejores Prácticas

### 1. Seguridad:
- Usar HTTPS siempre
- Configurar firewall apropiadamente
- Implementar VPN para acceso interno
- Rotar passwords regularmente

### 2. Performance:
- Usar SSD para base de datos
- Implementar caching con Redis
- Monitorear uso de recursos
- Optimizar queries de base de datos

### 3. Mantenimiento:
- Automatizar backups
- Configurar alertas de monitoreo
- Documentar configuraciones
- Mantener logs rotativos

### 4. Escalabilidad:
- Usar load balancers
- Implementar auto-scaling
- Separar componentes por función
- Usar CDN para assets estáticos

## Solución de Problemas

### Problemas Comunes:
1. **Database connection errors**
2. **Memory issues**
3. **Webhook timeouts**
4. **Authentication failures**

### Herramientas de Diagnóstico:
- `docker logs n8n`
- `htop` para recursos
- `netstat` para conexiones
- `pg_stat_activity` para PostgreSQL

## Próximos Pasos

1. Configura [Instalación con Docker](./01_Instalacion_Docker.md)
2. Implementa [Monitoreo](./06_Monitoreo_y_Logs.md)
3. Configura [Backup](./07_Backup_y_Recuperacion.md)
4. Explora [Recetario de Soluciones](../09_Recetario_de_Soluciones_(Cookbook)/)

---

**Recuerda:** El self-hosting requiere conocimientos técnicos sólidos y un compromiso con el mantenimiento continuo. Planifica bien tu arquitectura antes de implementar en producción. 🏗️
