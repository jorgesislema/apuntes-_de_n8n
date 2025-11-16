# 💾 Backup y Restore para n8n

> **Guía completa para proteger y recuperar tus datos de n8n - Nunca pierdas tu trabajo**

## 📋 Índice

- [🌟 Importancia del Backup](#-importancia-del-backup)
- [📂 ¿Qué Hacer Backup?](#-qué-hacer-backup)
- [🔄 Estrategias de Backup](#-estrategias-de-backup)
- [💾 Backup Manual](#-backup-manual)
- [⚡ Backup Automatizado](#-backup-automatizado)
- [☁️ Backup en la Nube](#️-backup-en-la-nube)
- [🔄 Restore y Recuperación](#-restore-y-recuperación)
- [🧪 Testing de Backups](#-testing-de-backups)
- [📊 Monitoreo y Alertas](#-monitoreo-y-alertas)

---

## 🌟 Importancia del Backup

### 💥 **Escenarios de Pérdida**

- **🖥️ Fallo de hardware**: Disco duro se daña
- **🔥 Desastre natural**: Incendio, inundación, etc.
- **👨‍💻 Error humano**: Borrado accidental de datos
- **🦠 Malware/Ransomware**: Cifrado malicioso de datos
- **☁️ Fallo del proveedor**: VPS/cloud provider tiene problemas
- **🔧 Actualización fallida**: Update corrompe la instalación
- **💻 Migración**: Cambio de servidor o provider

### 📊 **Estadísticas de Pérdida de Datos**

| Causa | % de Casos | Tiempo de Recuperación |
|-------|------------|----------------------|
| **Error humano** | 40% | 2-8 horas |
| **Fallo de hardware** | 35% | 4-24 horas |
| **Malware** | 15% | 1-7 días |
| **Desastre natural** | 10% | 1-30 días |

### 💰 **Costo de NO tener Backup**

- **⏱️ Tiempo perdido**: Recrear workflows manualmente
- **💼 Pérdida de negocio**: Automaciones interrumpidas
- **😰 Estrés**: Presión para recuperar datos críticos
- **🔧 Costo de recuperación**: Servicios especializados ($1000-10000+)

---

## 📂 ¿Qué Hacer Backup?

### 🗂️ **Datos Esenciales de n8n**

```
~/.n8n/                          # Directorio principal
├── config/                      # Configuraciones
│   └── config.json             # Configuración principal
├── credentials/                 # Credenciales (CRÍTICO)
│   └── *.json                  # Archivos de credenciales encriptadas
├── workflows/                   # Workflows (CRÍTICO)
│   └── *.json                  # Definiciones de workflows
├── nodes/                       # Nodos personalizados
│   └── custom-nodes/           # Código de nodos custom
├── backups/                     # Backups internos de n8n
│   ├── workflows/              # Exports automáticos
│   └── credentials/            # Exports de credenciales
└── logs/                        # Logs (opcional)
    └── n8n.log                 # Archivos de log
```

### 🗄️ **Base de Datos** (si usas PostgreSQL/MySQL)

```sql
-- Estructura de base de datos n8n
-- Tablas críticas:
execution_entity        -- Historial de ejecuciones
workflow_entity         -- Definiciones de workflows
credentials_entity      -- Credenciales encriptadas
user_entity            -- Usuarios (si usas multi-user)
settings                -- Configuraciones globales
```

### ⚙️ **Configuraciones del Sistema**

```
/opt/n8n/                       # Directorio de instalación
├── docker-compose.yml         # Configuración Docker
├── .env                       # Variables de entorno (CRÍTICO)
├── nginx/                     # Configuración del proxy
│   └── nginx.conf             # Configuración de Nginx
├── ssl/                       # Certificados SSL
│   ├── cert.pem              # Certificado público
│   └── key.pem               # Clave privada (CRÍTICO)
└── scripts/                   # Scripts de mantenimiento
    ├── backup.sh             # Scripts de backup
    └── restore.sh            # Scripts de restore
```

---

## 🔄 Estrategias de Backup

### 📊 **Tipos de Backup**

| Tipo | Descripción | Frecuencia | Ventajas | Desventajas |
|------|-------------|-----------|----------|-------------|
| **🔄 Completo** | Todo el dataset | Semanal | Simple, completo | Lento, ocupa espacio |
| **📈 Incremental** | Solo cambios desde último backup | Diario | Rápido, eficiente | Restore complejo |
| **📊 Diferencial** | Cambios desde último completo | Diario | Balance eficiencia/simplicidad | Crece con el tiempo |
| **🔄 Snapshot** | Estado específico en el tiempo | Por evento | Instantáneo | Depende del storage |

### 🎯 **Estrategia 3-2-1**

```
3 Copias de los datos críticos
├── 1 Copia primaria (producción)
├── 1 Copia local (backup local)
└── 1 Copia remota (backup offsite)

2 Tipos de media diferentes
├── Local: SSD/HDD
└── Remota: Cloud storage

1 Copia geográficamente separada
└── Cloud provider diferente o localización física distinta
```

### ⏰ **Cronograma Recomendado**

| Componente | Frecuencia | Retención | Método |
|------------|-----------|-----------|--------|
| **Workflows** | Cada 4 horas | 30 días | Incremental |
| **Credenciales** | Diario | 90 días | Completo |
| **Base de datos** | Diario | 30 días | Completo |
| **Configuraciones** | Semanal | 180 días | Completo |
| **Sistema completo** | Semanal | 30 días | Snapshot |

---

## 💾 Backup Manual

### 📁 **Backup de Datos n8n**

```bash
#!/bin/bash
# backup-manual.sh - Backup manual completo

# Configuración
BACKUP_DIR="/backups/n8n"
DATE=$(date +%Y%m%d_%H%M%S)
N8N_DATA_DIR="$HOME/.n8n"
DOCKER_PROJECT="n8n"

echo "🔄 Iniciando backup manual de n8n..."

# Crear directorio de backup
mkdir -p "$BACKUP_DIR/$DATE"

# 1. Parar n8n temporalmente para consistencia
echo "⏸️ Pausando servicios..."
docker-compose -p $DOCKER_PROJECT stop n8n

# 2. Backup de datos n8n
echo "💾 Backup de datos n8n..."
tar -czf "$BACKUP_DIR/$DATE/n8n-data.tar.gz" -C "$(dirname $N8N_DATA_DIR)" "$(basename $N8N_DATA_DIR)"

# 3. Backup de workflows (export JSON)
echo "📋 Export de workflows..."
if [ -d "$N8N_DATA_DIR/workflows" ]; then
    cp -r "$N8N_DATA_DIR/workflows" "$BACKUP_DIR/$DATE/workflows-export"
fi

# 4. Backup de configuraciones Docker
echo "⚙️ Backup de configuraciones..."
tar -czf "$BACKUP_DIR/$DATE/config.tar.gz" docker-compose.yml .env nginx/ ssl/

# 5. Backup de base de datos (si es PostgreSQL)
if docker-compose -p $DOCKER_PROJECT ps postgres &>/dev/null; then
    echo "🗄️ Backup de base de datos PostgreSQL..."
    docker-compose -p $DOCKER_PROJECT exec postgres pg_dump -U n8nuser n8n | gzip > "$BACKUP_DIR/$DATE/postgres-dump.sql.gz"
fi

# 6. Crear metadata del backup
echo "📝 Creando metadata..."
cat > "$BACKUP_DIR/$DATE/backup-info.json" << EOF
{
  "backup_date": "$(date -Iseconds)",
  "backup_type": "manual",
  "n8n_version": "$(docker-compose -p $DOCKER_PROJECT exec n8n n8n --version 2>/dev/null | head -1)",
  "system_info": {
    "hostname": "$(hostname)",
    "os": "$(uname -a)",
    "docker_version": "$(docker --version)"
  },
  "backup_size": "$(du -sh $BACKUP_DIR/$DATE | cut -f1)",
  "components": [
    "n8n-data",
    "workflows-export", 
    "docker-config",
    "postgres-database"
  ]
}
EOF

# 7. Reiniciar servicios
echo "▶️ Reiniciando servicios..."
docker-compose -p $DOCKER_PROJECT start n8n

# 8. Verificar que n8n esté funcionando
sleep 10
if curl -f http://localhost:5678/healthz &>/dev/null; then
    echo "✅ n8n está funcionando correctamente"
else
    echo "⚠️ ADVERTENCIA: n8n podría no estar respondiendo"
fi

# 9. Comprimir backup completo
echo "📦 Comprimiendo backup completo..."
cd "$BACKUP_DIR"
tar -czf "n8n-backup-$DATE.tar.gz" "$DATE/"
rm -rf "$DATE/"

echo "🎉 Backup completado: $BACKUP_DIR/n8n-backup-$DATE.tar.gz"
echo "📊 Tamaño del backup: $(du -sh $BACKUP_DIR/n8n-backup-$DATE.tar.gz | cut -f1)"
```

### 📋 **Backup Específico de Workflows**

```bash
#!/bin/bash
# backup-workflows.sh - Solo workflows

N8N_URL="http://localhost:5678"
BACKUP_DIR="/backups/workflows"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "📋 Exportando workflows..."

# Usar n8n CLI para export
docker-compose exec n8n n8n export:workflow --all --output="/home/node/export-$DATE.json"

# Copiar export al host
docker cp n8n:/home/node/export-$DATE.json "$BACKUP_DIR/workflows-$DATE.json"

# Limpiar archivo temporal
docker-compose exec n8n rm "/home/node/export-$DATE.json"

echo "✅ Workflows exportados: $BACKUP_DIR/workflows-$DATE.json"
```

---

## ⚡ Backup Automatizado

### 🔄 **Script de Backup Automatizado**

```bash
#!/bin/bash
# auto-backup.sh - Sistema completo de backup automatizado

# ========================================
# Configuración
# ========================================
BACKUP_BASE_DIR="/backups/n8n"
RETENTION_DAYS=30
MAX_BACKUPS=10
N8N_DATA_DIR="$HOME/.n8n"
DOCKER_PROJECT="n8n"
LOG_FILE="/var/log/n8n-backup.log"

# Configuración de notificaciones (opcional)
NOTIFY_EMAIL="admin@yourdomain.com"
SLACK_WEBHOOK=""

# ========================================
# Funciones
# ========================================
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify() {
    local message="$1"
    local level="$2"  # INFO, WARNING, ERROR
    
    log "$level: $message"
    
    # Email notification (opcional)
    if [ ! -z "$NOTIFY_EMAIL" ]; then
        echo "$message" | mail -s "n8n Backup $level" "$NOTIFY_EMAIL" 2>/dev/null || true
    fi
    
    # Slack notification (opcional)
    if [ ! -z "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🔄 n8n Backup $level: $message\"}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

cleanup_old_backups() {
    log "🗑️ Limpiando backups antiguos..."
    
    # Eliminar backups más antiguos que RETENTION_DAYS
    find "$BACKUP_BASE_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
    
    # Mantener solo MAX_BACKUPS más recientes
    ls -t "$BACKUP_BASE_DIR"/*.tar.gz 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
    
    log "✅ Limpieza completada"
}

check_disk_space() {
    local required_space_gb=5  # GB mínimos requeridos
    local available_space=$(df "$BACKUP_BASE_DIR" | awk 'NR==2 {print int($4/1024/1024)}')
    
    if [ "$available_space" -lt "$required_space_gb" ]; then
        notify "Espacio insuficiente para backup: ${available_space}GB disponibles, ${required_space_gb}GB requeridos" "ERROR"
        return 1
    fi
    
    log "💾 Espacio disponible: ${available_space}GB"
    return 0
}

backup_database() {
    local backup_dir="$1"
    
    log "🗄️ Iniciando backup de base de datos..."
    
    if docker-compose -p $DOCKER_PROJECT ps postgres &>/dev/null; then
        # PostgreSQL backup
        docker-compose -p $DOCKER_PROJECT exec -T postgres pg_dump -U n8nuser n8n | gzip > "$backup_dir/postgres-dump.sql.gz"
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            log "✅ Backup PostgreSQL completado"
        else
            notify "Error en backup de PostgreSQL" "ERROR"
            return 1
        fi
    elif docker-compose -p $DOCKER_PROJECT ps mysql &>/dev/null; then
        # MySQL backup
        docker-compose -p $DOCKER_PROJECT exec -T mysql mysqldump -u n8nuser -p n8n | gzip > "$backup_dir/mysql-dump.sql.gz"
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            log "✅ Backup MySQL completado"
        else
            notify "Error en backup de MySQL" "ERROR"
            return 1
        fi
    else
        log "ℹ️ No se detectó base de datos externa (usando SQLite)"
    fi
    
    return 0
}

# ========================================
# Script Principal
# ========================================
main() {
    local start_time=$(date +%s)
    local date_stamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$BACKUP_BASE_DIR/$date_stamp"
    local backup_file="$BACKUP_BASE_DIR/n8n-backup-$date_stamp.tar.gz"
    
    log "🚀 Iniciando backup automatizado de n8n"
    
    # Verificar prerrequisitos
    if ! check_disk_space; then
        exit 1
    fi
    
    mkdir -p "$backup_dir"
    
    # 1. Parar servicios para garantizar consistencia
    log "⏸️ Pausando servicios n8n..."
    if ! docker-compose -p $DOCKER_PROJECT stop n8n; then
        notify "Error pausando servicios n8n" "ERROR"
        exit 1
    fi
    
    # 2. Backup de datos n8n
    log "💾 Backup de datos n8n..."
    if tar -czf "$backup_dir/n8n-data.tar.gz" -C "$(dirname $N8N_DATA_DIR)" "$(basename $N8N_DATA_DIR)" 2>/dev/null; then
        log "✅ Backup de datos n8n completado"
    else
        notify "Error en backup de datos n8n" "ERROR"
        docker-compose -p $DOCKER_PROJECT start n8n
        exit 1
    fi
    
    # 3. Export de workflows
    log "📋 Export de workflows..."
    docker-compose -p $DOCKER_PROJECT start n8n
    sleep 15  # Esperar que n8n inicie
    
    docker-compose -p $DOCKER_PROJECT exec -T n8n n8n export:workflow --all --output="/tmp/workflows-export.json" 2>/dev/null
    docker cp "${DOCKER_PROJECT}_n8n_1:/tmp/workflows-export.json" "$backup_dir/workflows-export.json" 2>/dev/null || log "⚠️ No se pudieron exportar workflows"
    
    # 4. Backup de configuraciones
    log "⚙️ Backup de configuraciones..."
    tar -czf "$backup_dir/config.tar.gz" docker-compose.yml .env nginx/ ssl/ scripts/ 2>/dev/null || true
    
    # 5. Backup de base de datos
    backup_database "$backup_dir"
    
    # 6. Crear metadata
    log "📝 Creando metadata..."
    cat > "$backup_dir/backup-info.json" << EOF
{
  "backup_date": "$(date -Iseconds)",
  "backup_type": "automated",
  "retention_days": $RETENTION_DAYS,
  "n8n_version": "$(docker-compose -p $DOCKER_PROJECT exec -T n8n n8n --version 2>/dev/null | head -1 | tr -d '\r')",
  "system_info": {
    "hostname": "$(hostname)",
    "os": "$(uname -a)",
    "docker_version": "$(docker --version)",
    "backup_script_version": "1.0"
  }
}
EOF
    
    # 7. Comprimir backup final
    log "📦 Comprimiendo backup final..."
    cd "$BACKUP_BASE_DIR"
    tar -czf "n8n-backup-$date_stamp.tar.gz" "$date_stamp/"
    rm -rf "$date_stamp/"
    
    # 8. Verificar integridad del backup
    log "🔍 Verificando integridad..."
    if tar -tzf "$backup_file" >/dev/null 2>&1; then
        local backup_size=$(du -sh "$backup_file" | cut -f1)
        log "✅ Backup íntegro: $backup_size"
    else
        notify "Error: Backup corrupto" "ERROR"
        exit 1
    fi
    
    # 9. Limpiar backups antiguos
    cleanup_old_backups
    
    # 10. Verificar que n8n esté funcionando
    sleep 10
    if curl -f http://localhost:5678/healthz &>/dev/null; then
        log "✅ n8n funcionando correctamente"
    else
        notify "ADVERTENCIA: n8n podría no estar respondiendo" "WARNING"
    fi
    
    # Estadísticas finales
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local backup_size=$(du -sh "$backup_file" | cut -f1)
    
    notify "Backup completado exitosamente en ${duration}s. Tamaño: $backup_size" "INFO"
}

# Ejecutar script principal
main "$@"
```

### ⏰ **Configurar Cron**

```bash
# Instalar el script
sudo cp auto-backup.sh /opt/n8n-backup.sh
sudo chmod +x /opt/n8n-backup.sh

# Configurar crontab para backup diario a las 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/n8n-backup.sh >> /var/log/n8n-backup.log 2>&1") | crontab -

# Backup cada 4 horas (más frecuente)
(crontab -l 2>/dev/null; echo "0 */4 * * * /opt/n8n-backup.sh >> /var/log/n8n-backup.log 2>&1") | crontab -

# Backup semanal completo los domingos
(crontab -l 2>/dev/null; echo "0 1 * * 0 /opt/n8n-backup-weekly.sh >> /var/log/n8n-backup.log 2>&1") | crontab -

# Ver crontab actual
crontab -l
```

---

## ☁️ Backup en la Nube

### 🌩️ **AWS S3 Integration**

```bash
#!/bin/bash
# backup-s3.sh - Backup a Amazon S3

# Configuración AWS
S3_BUCKET="my-n8n-backups"
S3_REGION="us-east-1"
AWS_PROFILE="default"

# Configuración local
LOCAL_BACKUP_DIR="/backups/n8n"
RETENTION_CLOUD=90  # días

sync_to_s3() {
    local local_backup="$1"
    local s3_key="n8n-backups/$(basename $local_backup)"
    
    log "☁️ Subiendo backup a S3..."
    
    # Subir archivo
    aws s3 cp "$local_backup" "s3://$S3_BUCKET/$s3_key" \
        --region "$S3_REGION" \
        --profile "$AWS_PROFILE" \
        --storage-class STANDARD_IA
    
    if [ $? -eq 0 ]; then
        log "✅ Backup subido a S3: $s3_key"
        
        # Configurar lifecycle para eliminar después de X días
        aws s3api put-object-tagging \
            --bucket "$S3_BUCKET" \
            --key "$s3_key" \
            --tagging "TagSet=[{Key=retention,Value=${RETENTION_CLOUD}d}]" \
            --region "$S3_REGION" \
            --profile "$AWS_PROFILE"
    else
        notify "Error subiendo backup a S3" "ERROR"
        return 1
    fi
    
    return 0
}

cleanup_s3_old_backups() {
    log "🗑️ Limpiando backups antiguos en S3..."
    
    # Listar y eliminar backups antiguos
    aws s3 ls "s3://$S3_BUCKET/n8n-backups/" \
        --region "$S3_REGION" \
        --profile "$AWS_PROFILE" | \
    while read -r line; do
        createDate=$(echo "$line" | awk '{print $1" "$2}')
        createDate=$(date -d "$createDate" +%s)
        olderThan=$(date -d "-${RETENTION_CLOUD} days" +%s)
        
        if [[ $createDate -lt $olderThan ]]; then
            fileName=$(echo "$line" | awk '{$1=$2=$3=""; print $0}' | sed 's/^[ \t]*//')
            if [[ $fileName != "" ]]; then
                aws s3 rm "s3://$S3_BUCKET/n8n-backups/$fileName" \
                    --region "$S3_REGION" \
                    --profile "$AWS_PROFILE"
                log "🗑️ Eliminado backup antiguo: $fileName"
            fi
        fi
    done
}
```

### 📊 **Google Drive Integration**

```bash
#!/bin/bash
# backup-gdrive.sh - Backup a Google Drive usando rclone

# Configurar rclone primero:
# rclone config

GDRIVE_REMOTE="gdrive"
GDRIVE_FOLDER="n8n-backups"

sync_to_gdrive() {
    local local_backup="$1"
    
    log "☁️ Subiendo backup a Google Drive..."
    
    # Subir archivo
    rclone copy "$local_backup" "$GDRIVE_REMOTE:$GDRIVE_FOLDER" \
        --progress \
        --transfers 4 \
        --checkers 8
    
    if [ $? -eq 0 ]; then
        log "✅ Backup subido a Google Drive"
    else
        notify "Error subiendo backup a Google Drive" "ERROR"
        return 1
    fi
    
    return 0
}

cleanup_gdrive_old_backups() {
    log "🗑️ Limpiando backups antiguos en Google Drive..."
    
    # Eliminar archivos más antiguos que X días
    rclone delete "$GDRIVE_REMOTE:$GDRIVE_FOLDER" \
        --min-age "${RETENTION_CLOUD}d" \
        --dry-run  # Quitar para ejecutar realmente
}
```

### 🔄 **Backup Multi-Cloud**

```bash
#!/bin/bash
# backup-multi-cloud.sh - Backup a múltiples proveedores

backup_to_clouds() {
    local local_backup="$1"
    local success=0
    local total=0
    
    log "🌐 Iniciando backup multi-cloud..."
    
    # AWS S3
    if [ ! -z "$S3_BUCKET" ]; then
        total=$((total + 1))
        if sync_to_s3 "$local_backup"; then
            success=$((success + 1))
        fi
    fi
    
    # Google Drive
    if command -v rclone &> /dev/null; then
        total=$((total + 1))
        if sync_to_gdrive "$local_backup"; then
            success=$((success + 1))
        fi
    fi
    
    # Dropbox (usando rclone)
    if rclone listremotes | grep -q "dropbox:"; then
        total=$((total + 1))
        if rclone copy "$local_backup" "dropbox:n8n-backups"; then
            success=$((success + 1))
            log "✅ Backup subido a Dropbox"
        else
            log "❌ Error subiendo a Dropbox"
        fi
    fi
    
    # Resumen
    log "📊 Backup cloud: $success/$total proveedores exitosos"
    
    if [ $success -eq 0 ]; then
        notify "CRÍTICO: Falló backup en todos los proveedores cloud" "ERROR"
        return 1
    elif [ $success -lt $total ]; then
        notify "ADVERTENCIA: Backup falló en algunos proveedores ($success/$total)" "WARNING"
    else
        log "✅ Backup exitoso en todos los proveedores cloud"
    fi
    
    return 0
}
```

---

## 🔄 Restore y Recuperación

### 📦 **Restore Completo**

```bash
#!/bin/bash
# restore.sh - Restauración completa de n8n

# Configuración
BACKUP_FILE="$1"
RESTORE_DIR="/tmp/n8n-restore-$(date +%s)"
N8N_DATA_DIR="$HOME/.n8n"
DOCKER_PROJECT="n8n"

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Uso: $0 <backup-file.tar.gz>"
    echo "📁 Backups disponibles:"
    ls -la /backups/n8n/n8n-backup-*.tar.gz 2>/dev/null || echo "No hay backups disponibles"
    exit 1
fi

restore_backup() {
    log "🔄 Iniciando restauración desde: $BACKUP_FILE"
    
    # Verificar archivo existe
    if [ ! -f "$BACKUP_FILE" ]; then
        log "❌ Archivo de backup no encontrado: $BACKUP_FILE"
        exit 1
    fi
    
    # Crear directorio temporal
    mkdir -p "$RESTORE_DIR"
    
    # Extraer backup
    log "📦 Extrayendo backup..."
    tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"
    
    if [ $? -ne 0 ]; then
        log "❌ Error extrayendo backup"
        exit 1
    fi
    
    # Encontrar directorio de backup
    BACKUP_CONTENT_DIR=$(find "$RESTORE_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
    
    if [ -z "$BACKUP_CONTENT_DIR" ]; then
        log "❌ No se encontró contenido del backup"
        exit 1
    fi
    
    # Mostrar información del backup
    if [ -f "$BACKUP_CONTENT_DIR/backup-info.json" ]; then
        log "📋 Información del backup:"
        cat "$BACKUP_CONTENT_DIR/backup-info.json" | jq '.' 2>/dev/null || cat "$BACKUP_CONTENT_DIR/backup-info.json"
        echo ""
    fi
    
    # Confirmación
    read -p "🤔 ¿Continuar con la restauración? Esto sobrescribirá datos existentes (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "❌ Restauración cancelada"
        cleanup_restore
        exit 1
    fi
    
    # Parar servicios
    log "⏸️ Parando servicios n8n..."
    docker-compose -p $DOCKER_PROJECT down
    
    # Backup de datos actuales (por seguridad)
    if [ -d "$N8N_DATA_DIR" ]; then
        log "💾 Creando backup de seguridad de datos actuales..."
        mv "$N8N_DATA_DIR" "${N8N_DATA_DIR}.backup.$(date +%s)"
    fi
    
    # Restaurar datos n8n
    if [ -f "$BACKUP_CONTENT_DIR/n8n-data.tar.gz" ]; then
        log "📁 Restaurando datos n8n..."
        mkdir -p "$(dirname $N8N_DATA_DIR)"
        tar -xzf "$BACKUP_CONTENT_DIR/n8n-data.tar.gz" -C "$(dirname $N8N_DATA_DIR)"
        
        if [ $? -eq 0 ]; then
            log "✅ Datos n8n restaurados"
        else
            log "❌ Error restaurando datos n8n"
            return 1
        fi
    fi
    
    # Restaurar configuraciones
    if [ -f "$BACKUP_CONTENT_DIR/config.tar.gz" ]; then
        log "⚙️ Restaurando configuraciones..."
        tar -xzf "$BACKUP_CONTENT_DIR/config.tar.gz" -C "."
        log "✅ Configuraciones restauradas"
    fi
    
    # Restaurar base de datos
    restore_database "$BACKUP_CONTENT_DIR"
    
    # Iniciar servicios
    log "▶️ Iniciando servicios..."
    docker-compose -p $DOCKER_PROJECT up -d
    
    # Verificar que funcione
    log "🔍 Verificando funcionamiento..."
    sleep 30
    
    if curl -f http://localhost:5678/healthz &>/dev/null; then
        log "🎉 ¡Restauración exitosa! n8n está funcionando"
    else
        log "⚠️ ADVERTENCIA: n8n podría no estar respondiendo correctamente"
        log "📝 Revisa los logs: docker-compose logs n8n"
    fi
    
    cleanup_restore
}

restore_database() {
    local backup_dir="$1"
    
    # PostgreSQL
    if [ -f "$backup_dir/postgres-dump.sql.gz" ]; then
        log "🗄️ Restaurando base de datos PostgreSQL..."
        
        # Esperar a que PostgreSQL esté listo
        sleep 15
        
        # Restaurar dump
        zcat "$backup_dir/postgres-dump.sql.gz" | docker-compose -p $DOCKER_PROJECT exec -T postgres psql -U n8nuser n8n
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            log "✅ Base de datos PostgreSQL restaurada"
        else
            log "❌ Error restaurando PostgreSQL"
        fi
    fi
    
    # MySQL
    if [ -f "$backup_dir/mysql-dump.sql.gz" ]; then
        log "🗄️ Restaurando base de datos MySQL..."
        
        sleep 15
        
        zcat "$backup_dir/mysql-dump.sql.gz" | docker-compose -p $DOCKER_PROJECT exec -T mysql mysql -u n8nuser -p n8n
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            log "✅ Base de datos MySQL restaurada"
        else
            log "❌ Error restaurando MySQL"
        fi
    fi
}

cleanup_restore() {
    log "🗑️ Limpiando archivos temporales..."
    rm -rf "$RESTORE_DIR"
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Ejecutar restauración
restore_backup
```

### 🎯 **Restore Selectivo**

```bash
#!/bin/bash
# restore-selective.sh - Restaurar solo componentes específicos

restore_workflows_only() {
    local backup_file="$1"
    
    log "📋 Restaurando solo workflows..."
    
    # Extraer y encontrar export de workflows
    TEMP_DIR="/tmp/restore-workflows-$(date +%s)"
    mkdir -p "$TEMP_DIR"
    tar -xzf "$backup_file" -C "$TEMP_DIR"
    
    BACKUP_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
    
    if [ -f "$BACKUP_DIR/workflows-export.json" ]; then
        # Importar workflows usando n8n CLI
        docker cp "$BACKUP_DIR/workflows-export.json" n8n:/tmp/import-workflows.json
        docker-compose exec n8n n8n import:workflow --input="/tmp/import-workflows.json"
        
        log "✅ Workflows restaurados"
    else
        log "❌ No se encontró export de workflows en el backup"
    fi
    
    rm -rf "$TEMP_DIR"
}

restore_credentials_only() {
    local backup_file="$1"
    
    log "🔐 Restaurando solo credenciales..."
    
    # Parar n8n
    docker-compose stop n8n
    
    # Extraer y restaurar solo credenciales
    TEMP_DIR="/tmp/restore-creds-$(date +%s)"
    mkdir -p "$TEMP_DIR"
    tar -xzf "$backup_file" -C "$TEMP_DIR"
    
    BACKUP_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
    
    if [ -f "$BACKUP_DIR/n8n-data.tar.gz" ]; then
        # Extraer solo credenciales
        tar -xzf "$BACKUP_DIR/n8n-data.tar.gz" -C "$TEMP_DIR" --wildcards "**/credentials/*"
        
        # Copiar credenciales
        cp -r "$TEMP_DIR/.n8n/credentials/"* "$HOME/.n8n/credentials/"
        
        log "✅ Credenciales restauradas"
    fi
    
    # Reiniciar n8n
    docker-compose start n8n
    
    rm -rf "$TEMP_DIR"
}

# Menú interactivo
echo "🔄 Restauración Selectiva de n8n"
echo "=================================="
echo "1) Solo workflows"
echo "2) Solo credenciales"
echo "3) Solo configuraciones"
echo "4) Restauración completa"
echo ""
read -p "Selecciona una opción [1-4]: " option

case $option in
    1) restore_workflows_only "$1" ;;
    2) restore_credentials_only "$1" ;;
    3) restore_configs_only "$1" ;;
    4) ./restore.sh "$1" ;;
    *) echo "❌ Opción inválida" ;;
esac
```

---

## 🧪 Testing de Backups

### 🔍 **Validación de Integridad**

```bash
#!/bin/bash
# test-backup.sh - Validar integridad del backup

test_backup_integrity() {
    local backup_file="$1"
    
    log "🧪 Iniciando test de integridad del backup..."
    
    # Test 1: Verificar que el archivo existe y no está corrupto
    if [ ! -f "$backup_file" ]; then
        log "❌ Test 1 FAILED: Archivo no existe"
        return 1
    fi
    
    if tar -tzf "$backup_file" >/dev/null 2>&1; then
        log "✅ Test 1 PASSED: Archivo tar íntegro"
    else
        log "❌ Test 1 FAILED: Archivo tar corrupto"
        return 1
    fi
    
    # Test 2: Verificar contenidos esperados
    local contents=$(tar -tzf "$backup_file")
    
    if echo "$contents" | grep -q "n8n-data.tar.gz"; then
        log "✅ Test 2 PASSED: Datos n8n presentes"
    else
        log "❌ Test 2 FAILED: Datos n8n faltantes"
        return 1
    fi
    
    if echo "$contents" | grep -q "backup-info.json"; then
        log "✅ Test 3 PASSED: Metadata presente"
    else
        log "⚠️ Test 3 WARNING: Metadata faltante"
    fi
    
    # Test 3: Verificar tamaño razonable
    local size_bytes=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file")
    local size_mb=$((size_bytes / 1024 / 1024))
    
    if [ $size_mb -gt 1 ] && [ $size_mb -lt 10000 ]; then
        log "✅ Test 4 PASSED: Tamaño razonable (${size_mb}MB)"
    else
        log "⚠️ Test 4 WARNING: Tamaño inusual (${size_mb}MB)"
    fi
    
    log "🎉 Tests de integridad completados"
    return 0
}

test_restore_dry_run() {
    local backup_file="$1"
    
    log "🧪 Test de restore (dry run)..."
    
    # Crear entorno temporal
    TEMP_ENV="/tmp/n8n-test-$(date +%s)"
    mkdir -p "$TEMP_ENV"
    cd "$TEMP_ENV"
    
    # Extraer backup
    tar -xzf "$backup_file"
    BACKUP_DIR=$(find . -mindepth 1 -maxdepth 1 -type d | head -1)
    
    # Verificar componentes
    local score=0
    local total=0
    
    # Test datos n8n
    total=$((total + 1))
    if [ -f "$BACKUP_DIR/n8n-data.tar.gz" ]; then
        if tar -tzf "$BACKUP_DIR/n8n-data.tar.gz" | grep -q "workflows"; then
            log "✅ Datos n8n válidos"
            score=$((score + 1))
        else
            log "❌ Datos n8n inválidos"
        fi
    fi
    
    # Test configuración
    total=$((total + 1))
    if [ -f "$BACKUP_DIR/config.tar.gz" ]; then
        if tar -tzf "$BACKUP_DIR/config.tar.gz" | grep -q "docker-compose.yml"; then
            log "✅ Configuración válida"
            score=$((score + 1))
        else
            log "❌ Configuración inválida"
        fi
    fi
    
    # Test base de datos
    total=$((total + 1))
    if [ -f "$BACKUP_DIR/postgres-dump.sql.gz" ] || [ -f "$BACKUP_DIR/mysql-dump.sql.gz" ]; then
        log "✅ Backup de BD presente"
        score=$((score + 1))
    else
        log "ℹ️ No hay backup de BD (SQLite en uso)"
        score=$((score + 1))  # No penalizar si usa SQLite
    fi
    
    # Cleanup
    cd /
    rm -rf "$TEMP_ENV"
    
    # Resultado
    local percentage=$((score * 100 / total))
    log "📊 Score del backup: $score/$total ($percentage%)"
    
    if [ $percentage -ge 80 ]; then
        log "🎉 Backup VÁLIDO para restore"
        return 0
    else
        log "❌ Backup NO RECOMENDADO para restore"
        return 1
    fi
}

# Script principal de testing
if [ -z "$1" ]; then
    echo "Uso: $0 <backup-file.tar.gz>"
    exit 1
fi

test_backup_integrity "$1"
test_restore_dry_run "$1"
```

### 🎯 **Test de Restore Completo**

```bash
#!/bin/bash
# test-full-restore.sh - Test completo de restauración en entorno aislado

test_full_restore() {
    local backup_file="$1"
    local test_name="test-$(date +%s)"
    
    log "🧪 Iniciando test completo de restore..."
    
    # Crear entorno de test aislado
    local test_dir="/tmp/n8n-restore-test-$test_name"
    mkdir -p "$test_dir"
    cd "$test_dir"
    
    # Copiar configuración base
    cp /opt/n8n-production/docker-compose.yml .
    cp /opt/n8n-production/.env .env.test
    
    # Modificar configuración para test
    sed -i 's/n8n-production/n8n-test-'$test_name'/g' docker-compose.yml
    sed -i 's/5678:5678/5679:5678/g' docker-compose.yml  # Usar puerto diferente
    
    # Ejecutar restore en entorno de test
    COMPOSE_PROJECT_NAME="n8n-test-$test_name" ./restore.sh "$backup_file"
    
    # Verificar que el restore funcionó
    sleep 30
    
    if curl -f http://localhost:5679/healthz &>/dev/null; then
        log "✅ Test de restore EXITOSO"
        
        # Tests adicionales
        test_workflows_loadable
        test_credentials_loadable
        
        result=0
    else
        log "❌ Test de restore FALLIDO"
        result=1
    fi
    
    # Cleanup del entorno de test
    cd /tmp
    docker-compose -f "$test_dir/docker-compose.yml" -p "n8n-test-$test_name" down -v
    rm -rf "$test_dir"
    
    return $result
}

test_workflows_loadable() {
    log "🧪 Testing workflows cargables..."
    
    # Obtener lista de workflows via API
    local response=$(curl -s http://localhost:5679/api/v1/workflows 2>/dev/null)
    
    if echo "$response" | grep -q '"data"'; then
        local count=$(echo "$response" | jq '.data | length' 2>/dev/null || echo "0")
        log "✅ $count workflows cargados exitosamente"
    else
        log "❌ Error cargando workflows"
    fi
}
```

---

## 📊 Monitoreo y Alertas

### 📈 **Monitor de Backups**

```bash
#!/bin/bash
# monitor-backups.sh - Monitoreo de estado de backups

BACKUP_DIR="/backups/n8n"
MAX_AGE_HOURS=25  # Máximo tiempo sin backup
LOG_FILE="/var/log/backup-monitor.log"

check_backup_status() {
    log "🔍 Verificando estado de backups..."
    
    # Encontrar backup más reciente
    local latest_backup=$(ls -t "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | head -1)
    
    if [ -z "$latest_backup" ]; then
        notify "CRÍTICO: No se encontraron backups" "ERROR"
        return 1
    fi
    
    # Verificar edad del backup
    local backup_time=$(stat -c %Y "$latest_backup")
    local current_time=$(date +%s)
    local age_hours=$(( (current_time - backup_time) / 3600 ))
    
    if [ $age_hours -gt $MAX_AGE_HOURS ]; then
        notify "ADVERTENCIA: Último backup tiene $age_hours horas (máx: $MAX_AGE_HOURS)" "WARNING"
    else
        log "✅ Backup reciente encontrado ($age_hours horas)"
    fi
    
    # Verificar integridad del último backup
    if tar -tzf "$latest_backup" >/dev/null 2>&1; then
        log "✅ Backup íntegro"
    else
        notify "CRÍTICO: Último backup está corrupto" "ERROR"
        return 1
    fi
    
    # Verificar espacio en disco
    local available_gb=$(df "$BACKUP_DIR" | awk 'NR==2 {print int($4/1024/1024)}')
    if [ $available_gb -lt 5 ]; then
        notify "ADVERTENCIA: Poco espacio en disco: ${available_gb}GB" "WARNING"
    fi
    
    # Estadísticas
    local total_backups=$(ls "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    
    log "📊 Total backups: $total_backups, Espacio usado: $total_size"
    
    return 0
}

generate_backup_report() {
    log "📋 Generando reporte de backups..."
    
    local report_file="/tmp/backup-report-$(date +%Y%m%d).txt"
    
    cat > "$report_file" << EOF
# Reporte de Backups n8n
## Generado: $(date)

### Estado General
- Último backup: $(ls -t "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | head -1 | xargs basename)
- Edad: $(( ($(date +%s) - $(stat -c %Y $(ls -t "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | head -1))) / 3600 )) horas
- Total backups: $(ls "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | wc -l)
- Espacio usado: $(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

### Backups Recientes
EOF
    
    # Listar últimos 10 backups
    ls -lt "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | head -10 | while read -r line; do
        echo "- $line" >> "$report_file"
    done
    
    echo "📋 Reporte generado: $report_file"
}

# Ejecutar monitoring
check_backup_status
generate_backup_report
```

### 🚨 **Alertas Inteligentes**

```bash
#!/bin/bash
# smart-alerts.sh - Sistema de alertas inteligente

# Configuración de alertas
ALERT_CONFIG="/etc/n8n-backup-alerts.conf"

# Crear configuración por defecto si no existe
if [ ! -f "$ALERT_CONFIG" ]; then
    cat > "$ALERT_CONFIG" << 'EOF'
# Configuración de alertas n8n backup
BACKUP_MAX_AGE_HOURS=25
DISK_WARNING_THRESHOLD=5  # GB
DISK_CRITICAL_THRESHOLD=2  # GB
BACKUP_SIZE_MIN_MB=50
BACKUP_SIZE_MAX_MB=5000
CONSECUTIVE_FAILURES_CRITICAL=3
EMAIL_ALERTS=true
SLACK_ALERTS=false
TELEGRAM_ALERTS=false
EOF
fi

source "$ALERT_CONFIG"

send_alert() {
    local message="$1"
    local level="$2"  # INFO, WARNING, ERROR, CRITICAL
    local component="$3"  # backup, disk, network, etc.
    
    # Log local
    log "[$level] $component: $message"
    
    # Email
    if [ "$EMAIL_ALERTS" = "true" ] && [ ! -z "$NOTIFY_EMAIL" ]; then
        echo "$message" | mail -s "n8n Backup Alert [$level]" "$NOTIFY_EMAIL"
    fi
    
    # Slack
    if [ "$SLACK_ALERTS" = "true" ] && [ ! -z "$SLACK_WEBHOOK" ]; then
        local emoji
        case $level in
            INFO) emoji=":information_source:" ;;
            WARNING) emoji=":warning:" ;;
            ERROR) emoji=":x:" ;;
            CRITICAL) emoji=":rotating_light:" ;;
        esac
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$emoji n8n Backup [$level]: $message\"}" \
            "$SLACK_WEBHOOK" 2>/dev/null
    fi
    
    # Telegram
    if [ "$TELEGRAM_ALERTS" = "true" ] && [ ! -z "$TELEGRAM_BOT_TOKEN" ] && [ ! -z "$TELEGRAM_CHAT_ID" ]; then
        curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
            -d chat_id="$TELEGRAM_CHAT_ID" \
            -d text="🔄 n8n Backup [$level]: $message"
    fi
}

check_backup_health() {
    local issues=0
    
    # Verificar edad del backup
    local latest_backup=$(ls -t "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | head -1)
    if [ ! -z "$latest_backup" ]; then
        local backup_age_hours=$(( ($(date +%s) - $(stat -c %Y "$latest_backup")) / 3600 ))
        
        if [ $backup_age_hours -gt $BACKUP_MAX_AGE_HOURS ]; then
            send_alert "Último backup muy antiguo: $backup_age_hours horas" "WARNING" "backup"
            issues=$((issues + 1))
        fi
    else
        send_alert "No se encontraron backups" "CRITICAL" "backup"
        return 1
    fi
    
    # Verificar espacio en disco
    local available_gb=$(df "$BACKUP_DIR" | awk 'NR==2 {print int($4/1024/1024)}')
    
    if [ $available_gb -le $DISK_CRITICAL_THRESHOLD ]; then
        send_alert "CRÍTICO: Espacio en disco: ${available_gb}GB" "CRITICAL" "disk"
        issues=$((issues + 1))
    elif [ $available_gb -le $DISK_WARNING_THRESHOLD ]; then
        send_alert "Poco espacio en disco: ${available_gb}GB" "WARNING" "disk"
    fi
    
    # Verificar tamaño del backup
    local backup_size_mb=$(du -m "$latest_backup" | cut -f1)
    
    if [ $backup_size_mb -lt $BACKUP_SIZE_MIN_MB ]; then
        send_alert "Backup suspiciosamente pequeño: ${backup_size_mb}MB" "WARNING" "backup"
        issues=$((issues + 1))
    elif [ $backup_size_mb -gt $BACKUP_SIZE_MAX_MB ]; then
        send_alert "Backup muy grande: ${backup_size_mb}MB" "INFO" "backup"
    fi
    
    # Verificar tendencia de fallos
    local recent_failures=$(grep "ERROR\|FAILED" "$LOG_FILE" | tail -20 | wc -l)
    if [ $recent_failures -ge $CONSECUTIVE_FAILURES_CRITICAL ]; then
        send_alert "Múltiples fallos recientes: $recent_failures" "CRITICAL" "backup"
    fi
    
    if [ $issues -eq 0 ]; then
        send_alert "Todos los sistemas de backup funcionando correctamente" "INFO" "status"
    fi
    
    return $issues
}

# Configurar cron para alertas
# 0 */6 * * * /opt/smart-alerts.sh
check_backup_health
```

---

## ✅ Checklist Backup Completo

### 🎯 **Implementación Exitosa**

- [ ] ✅ **Backup manual** funcionando
- [ ] ✅ **Backup automatizado** configurado
- [ ] ✅ **Backup en la nube** activo
- [ ] ✅ **Script de restore** probado
- [ ] ✅ **Testing de integridad** implementado
- [ ] ✅ **Monitoreo** configurado
- [ ] ✅ **Alertas** activadas
- [ ] ✅ **Documentación** actualizada
- [ ] ✅ **Cronograma 3-2-1** seguido
- [ ] ✅ **Restore probado** en entorno aislado

### 📊 **Métricas de Backup**

```bash
# Script de métricas
echo "📊 Estadísticas de Backup n8n"
echo "============================="
echo "Último backup: $(ls -t /backups/n8n/n8n-backup-*.tar.gz | head -1 | xargs basename)"
echo "Edad: $(( ($(date +%s) - $(stat -c %Y $(ls -t /backups/n8n/n8n-backup-*.tar.gz | head -1))) / 3600 )) horas"
echo "Total backups: $(ls /backups/n8n/n8n-backup-*.tar.gz 2>/dev/null | wc -l)"
echo "Espacio usado: $(du -sh /backups/n8n | cut -f1)"
echo "Espacio disponible: $(df -h /backups | awk 'NR==2 {print $4}')"
```

---

## 🚨 Plan de Recuperación ante Desastres

### 🔥 **Escenarios de Emergencia**

1. **🖥️ Fallo completo del servidor**
   - Tiempo de recuperación: 2-4 horas
   - Backup necesario: Completo + Configuración
   - Acción: Restaurar en nuevo servidor

2. **💾 Corrupción de datos**
   - Tiempo de recuperación: 30-60 minutos
   - Backup necesario: Datos + DB
   - Acción: Restore selectivo

3. **🦠 Ataque malware/ransomware**
   - Tiempo de recuperación: 1-8 horas
   - Backup necesario: Completo offline
   - Acción: Servidor limpio + Restore

4. **☁️ Fallo del proveedor VPS**
   - Tiempo de recuperación: 1-24 horas
   - Backup necesario: Multi-cloud
   - Acción: Migrar a proveedor alternativo

---

> **💾 ¡Perfecto!** Tu estrategia de backup es robusta y completa. Tus datos están seguros y puedes dormir tranquilo sabiendo que puedes recuperar tu n8n en cualquier momento.

**💡 Tip Final**: Un backup no probado es como no tener backup. Prueba tus restores regularmente - preferiblemente en un entorno separado cada mes.