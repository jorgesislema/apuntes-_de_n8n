# 🛠️ Módulo 08: Administración y Escalado (Self-Hosting)

Guía para desplegar, asegurar y escalar n8n en tu propia infraestructura.

## Contenido
1. **Despliegue con Docker Compose**
   - Configuración básica y persistencia de datos.
2. **Variables de Entorno (.env)**
   - Seguridad, zonas horarias y configuración de librerías.
3. **Escalado Horizontal**
   - Modo Cola (Queue Mode) con Redis.
   - Workers y Webhook Processors.
4. **Mantenimiento**
   - Pruning (Limpieza de base de datos).
   - Backups.

## Docker Compose Básico

```yaml
version: "3"
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=supersecreto
      - GENERIC_TIMEZONE=America/Mexico_City
      - TZ=America/Mexico_City
    volumes:
      - n8n_data:/home/node/.n8n
    restart: always

volumes:
  n8n_data:
```

## Comandos de Mantenimiento (Pruning)
Si tu disco se llena, es probable que la base de datos SQLite tenga demasiadas ejecuciones guardadas.

**Variable de entorno para auto-limpieza:**
```bash
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168 # Horas (7 días)
EXECUTIONS_DATA_PRUNE_MAX_COUNT=50000 # Máximo de ejecuciones a guardar
```
