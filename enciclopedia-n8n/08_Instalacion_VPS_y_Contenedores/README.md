# Instalación de n8n en VPS y Contenedores

> **Guía completa para desplegar n8n en servidores virtuales y entornos containerizados**

## Índice

- [Introducción](#introducción)
- [Comparativa de Proveedores VPS](#comparativa-de-proveedores-vps)
- [Tipos de Contenedores para n8n](#tipos-de-contenedores-para-n8n)
- [Estructura de esta Sección](#estructura-de-esta-sección)
- [Casos de Uso Recomendados](#casos-de-uso-recomendados)

---

## Introducción

Esta sección te guiará paso a paso para instalar y configurar n8n en diferentes entornos VPS y contenedores, desde configuraciones básicas hasta despliegues de producción escalables.

### ¿Por qué usar VPS para n8n?

- **Control total**: Configuración personalizada sin limitaciones
- **Costo-efectivo**: Mejor relación precio-rendimiento para uso intensivo
- **Escalabilidad**: Recursos ajustables según necesidades
- **Seguridad**: Entorno aislado y configuración de seguridad personalizada
- **Disponibilidad**: Acceso 24/7 desde cualquier lugar

---

## Comparativa de Proveedores VPS

| Proveedor | Precio/Mes | Rendimiento | Facilidad | Ubicaciones | Recomendado para |
|-----------|------------|-------------|-----------|-------------|------------------|
| **DigitalOcean** | $5-40 | Excelente | Muy Fácil | Global | Principiantes, desarrollo |
| **Linode** | $5-40 | Excelente | Fácil | Global | Desarrolladores avanzados |
| **Vultr** | $3.50-40 | Muy Bueno | Fácil | Global | Budget-friendly |
| **AWS EC2** | $3.50-100+ | Excelente | Moderado | Global | Empresas, alta escala |
| **Google Cloud** | $4.20-60 | Excelente | Moderado | Global | Integración GCP |
| **Azure** | $4-60 | Excelente | Moderado | Global | Entornos Microsoft |
| **Hetzner** | €3-50 | Excelente | Fácil | Europa | Europa, mejor precio |
| **OVH** | €3-40 | Muy Bueno | Moderado | Europa/US | Europa, Francia |
| **CloudCone** | $1.99-25 | Muy Bueno | Fácil | US/Asia | Presupuesto limitado |
| **Hostinger** | $1.99-29 | Bueno | Muy Fácil | Global | Principiantes absolutos |
| **InterServer** | $6-50 | Muy Bueno | Fácil | US | Precio fijo garantizado |

### Recomendaciones por Escenario

| Escenario | Proveedor Recomendado | Configuración Mínima |
|-----------|----------------------|---------------------|
| **Desarrollo/Testing** | DigitalOcean, Vultr, CloudCone | 1GB RAM, 1 vCPU, 25GB SSD |
| **Uso Personal** | Linode, Hetzner, Hostinger | 2GB RAM, 1 vCPU, 50GB SSD |
| **Equipo Pequeño** | DigitalOcean, Linode, InterServer | 4GB RAM, 2 vCPU, 80GB SSD |
| **Producción Empresarial** | AWS, Google Cloud, Azure | 8GB RAM, 4 vCPU, 160GB SSD |
| **Alta Disponibilidad** | AWS, Google Cloud | Multi-región, Load Balancer |
| **Presupuesto Limitado** | CloudCone, Hostinger, Vultr | 1-2GB RAM, optimizado |

### Detalles de Nuevos Proveedores

#### **CloudCone** - cloudcone.com
- **Especialidad**: VPS ultra-económicos con promociones frecuentes
- **Ventajas**: Precios muy competitivos, promociones regulares, recursos generosos
- **Ubicaciones**: Los Angeles, Nueva York, Singapur
- **Ideal para**: Proyectos con presupuesto muy limitado, testing
- **Planes típicos**: $1.99-25/mes

#### **Hostinger** - hostinger.com  
- **Especialidad**: Hosting para principiantes con interfaz muy amigable
- **Ventajas**: Panel de control intuitivo, soporte 24/7 en español, precios competitivos
- **Ubicaciones**: Global (Europa, Asia, América)
- **Ideal para**: Usuarios sin experiencia técnica, proyectos personales
- **Planes típicos**: $1.99-29/mes

#### **InterServer** - interserver.net
- **Especialidad**: Precios fijos garantizados sin aumentos
- **Ventajas**: Precio bloqueado de por vida, recursos ilimitados en algunos planes
- **Ubicaciones**: Principalmente Estados Unidos
- **Ideal para**: Proyectos a largo plazo, estabilidad de precios
- **Planes típicos**: $6-50/mes

---

## Tipos de Contenedores para n8n

### Docker (Recomendado para principiantes)
```bash
# Instalación básica
docker run -d --name n8n -p 5678:5678 n8nio/n8n
```

**Ventajas:**
- Fácil instalación y configuración
- Aislamiento completo del sistema host
- Rollbacks rápidos
- Configuración reproducible

**Desventajas:**
- Rendimiento ligeramente inferior al nativo
- Curva de aprendizaje para Docker

---

### Docker Compose (Recomendado para producción)
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
    volumes:
      - n8n_data:/home/node/.n8n
```

**Ventajas:**
- Configuración declarativa
- Fácil gestión de múltiples servicios
- Escalabilidad horizontal
- Backup y restore simplificado

---

### Kubernetes (Para alta escala)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n
spec:
  replicas: 3
  selector:
    matchLabels:
      app: n8n
```

**Ventajas:**
- Auto-scaling automático
- Alta disponibilidad
- Rolling updates sin downtime
- Gestión avanzada de recursos

**Desventajas:**
- Complejidad muy alta
- Requiere conocimientos avanzados
- Overhead de recursos

---

## Estructura de esta Sección

```
08_Instalacion_VPS_y_Contenedores/
├── Proveedores_VPS/
│   ├── 01_DigitalOcean_Instalacion.md
│   ├── 02_AWS_EC2_Instalacion.md
│   ├── 03_Linode_Instalacion.md
│   ├── 04_Google_Cloud_Instalacion.md
│   ├── 05_Azure_Instalacion.md
│   ├── 06_Vultr_Instalacion.md
│   ├── 07_Hetzner_Instalacion.md
│   ├── 08_CloudCone_Instalacion.md
│   ├── 09_Hostinger_Instalacion.md
│   ├── 10_InterServer_Instalacion.md
│   └── 11_Comparativa_Rendimiento.md
├── Contenedores_y_Docker/
│   ├── 01_Docker_Basico.md
│   ├── 02_Docker_Compose.md
│   ├── 03_Kubernetes_Deployment.md
│   ├── 04_Docker_Swarm.md
│   ├── 05_Configuraciones_Avanzadas.md
│   └── 06_Troubleshooting_Contenedores.md
└── Seguridad_y_Optimizacion/
    ├── 01_SSL_y_HTTPS.md
    ├── 02_Firewall_y_Seguridad.md
    ├── 03_Backup_y_Restore.md
    ├── 04_Monitoreo_y_Alertas.md
    ├── 05_Optimizacion_Rendimiento.md
    └── 06_Escalabilidad_Horizontal.md
```

---

## Casos de Uso Recomendados

### **Desarrollo y Testing**
- **Proveedor**: DigitalOcean, Vultr o CloudCone
- **Configuración**: 1-2GB RAM, Docker básico
- **Costo**: $2-10/mes

### **Uso Personal/Freelance**
- **Proveedor**: Linode, Hetzner o Hostinger
- **Configuración**: 2-4GB RAM, Docker Compose
- **Costo**: $5-20/mes

### **Equipos Pequeños (5-20 usuarios)**
- **Proveedor**: DigitalOcean, Linode o InterServer
- **Configuración**: 4-8GB RAM, Docker Compose con PostgreSQL
- **Costo**: $15-40/mes

### **Producción Empresarial**
- **Proveedor**: AWS, Google Cloud, o Azure
- **Configuración**: Kubernetes, múltiples instancias, base de datos gestionada
- **Costo**: $100-500+/mes

---

## Comenzando

1. **Lee la comparativa de proveedores** para elegir el mejor para tu caso
2. **Sigue la guía específica** de tu proveedor elegido
3. **Configura el tipo de contenedor** según tus necesidades
4. **Implementa seguridad** siguiendo nuestras mejores prácticas
5. **Configura monitoreo** para mantener la salud de tu instalación

---

## ¿Necesitas Ayuda?

- **Problemas comunes**: Consulta `Troubleshooting_Contenedores.md`
- **Configuración segura**: Revisa la carpeta `Seguridad_y_Optimizacion`
- **Optimización**: Ve a `Optimizacion_Rendimiento.md`

---

> **Tip**: Si es tu primera vez, te recomendamos comenzar con **DigitalOcean + Docker Compose** o **Hostinger + Docker básico** - son las combinaciones más amigables para aprender.

**¡Vamos a desplegar n8n como un profesional!**