# Configuración del Entorno n8n

## Opciones de Despliegue

n8n ofrece múltiples opciones de despliegue, cada una adaptada a diferentes requisitos técnicos y casos de uso empresariales.

## 1. n8n Cloud (SaaS)

**Descripción:** Plataforma administrada que proporciona una instancia de n8n completamente gestionada.

**Características principales:**
- Infraestructura gestionada por n8n
- Actualizaciones automáticas
- Copias de seguridad automatizadas
- Soporte técnico empresarial
- Monitorización y alertas incluidas

**Caso de uso recomendado:** 
- Empresas que requieren una solución inmediata sin gestión de infraestructura
- Equipos que necesitan garantía de disponibilidad y soporte profesional
- Proyectos que requieren escalabilidad inmediata

## 2. Instalación Local (npm/Docker)

**Descripción:** Despliegue en infraestructura propia mediante npm o contenedores Docker.

### 2.1 Instalación mediante npm

```bash
npm install n8n -g
```

**Requisitos técnicos:**
- Node.js ≥ 16.9
- npm ≥ 7.0

**Configuración del entorno:**
```bash
# Variables de entorno esenciales
export N8N_EDITOR_BASE_URL=http://localhost:5678
export N8N_ENCRYPTION_KEY=your-secret-key
export DB_TYPE=sqlite
export DB_SQLITE_PATH=/path/to/database.sqlite
```

### 2.2 Despliegue con Docker

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_ENCRYPTION_KEY="your-secret-key" \
  docker.n8n.io/n8nio/n8n
```

**Variables de entorno críticas:**
- `N8N_ENCRYPTION_KEY`: Clave de cifrado para credenciales
- `DB_TYPE`: Tipo de base de datos (postgresql, mysql, sqlite)
- `WEBHOOK_URL`: URL base para webhooks
- `EXECUTIONS_DATA_SAVE_ON_ERROR`: Configuración de logs de error
- `EXECUTIONS_DATA_SAVE_ON_SUCCESS`: Configuración de logs de éxito

## 3. Despliegue en Kubernetes

**Descripción:** Orquestación de contenedores para entornos empresariales escalables.

### Helm Chart

```bash
helm repo add n8n https://n8n-io.github.io/n8n
helm install n8n n8n/n8n
```

**Configuraciones críticas:**
```yaml
# values.yaml
persistence:
  enabled: true
  size: 10Gi
  
config:
  database:
    type: postgresql
    postgresdb:
      host: your-db-host
      port: 5432
      database: n8n
  
security:
  encryptionKey: your-secret-key
  
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
```

## 4. Consideraciones de Seguridad

### 4.1 Cifrado de Credenciales
- Implementar rotación periódica de `N8N_ENCRYPTION_KEY`
- Utilizar servicios de gestión de secretos (HashiCorp Vault, AWS Secrets Manager)
- Configurar políticas de acceso basadas en roles

### 4.2 Networking
- Implementar TLS/SSL para todas las comunicaciones
- Configurar firewalls y grupos de seguridad
- Utilizar VPN para acceso remoto

### 4.3 Monitorización
- Implementar logging centralizado
- Configurar alertas de seguridad
- Monitorizar métricas de rendimiento

## 5. Mejores Prácticas

1. **Alta Disponibilidad:**
   - Implementar redundancia geográfica
   - Configurar balanceadores de carga
   - Establecer políticas de backup y recuperación

2. **Gestión de Recursos:**
   - Monitorizar uso de CPU y memoria
   - Implementar auto-scaling
   - Optimizar consultas de base de datos

3. **CI/CD:**
   - Automatizar despliegues
   - Implementar pruebas automáticas
   - Mantener control de versiones de workflows

## 6. Troubleshooting

### Logs Importantes
```bash
# Consulta de logs en Docker
docker logs n8n

# Logs en Kubernetes
kubectl logs -f deployment/n8n
```

### Métricas de Rendimiento
```bash
# Monitorización de recursos
docker stats n8n

# Métricas en Kubernetes
kubectl top pod -l app=n8n
```

## 7. Referencias Técnicas

- [Documentación oficial de despliegue](https://docs.n8n.io/hosting/)
- [Referencia de variables de entorno](https://docs.n8n.io/reference/environment-variables/)
- [Guía de seguridad](https://docs.n8n.io/security/)
