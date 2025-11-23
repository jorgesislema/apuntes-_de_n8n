# Credenciales y Seguridad en n8n

## Introducción

La seguridad en n8n es como las llaves de tu casa. Necesitas proteger tus credenciales para que solo tú puedas acceder a tus servicios, pero también necesitas que sea práctico para el uso diario.

**Ejemplo:** Es como un sistema de gestión de credenciales empresarial. Tienes un repositorio seguro para almacenar información sensible, pero no expones estas credenciales en la configuración pública.

## ¿Qué son las Credenciales?

**Concepto:** Las credenciales son información secreta que n8n usa para conectarse a tus servicios (como Google, Slack, etc.) en tu nombre.

**Tipos comunes:**
- **Contraseñas** - Como la de tu email
- **API Keys** - Códigos especiales para programas
- **Tokens** - Permisos temporales
- **Certificados** - Identificación digital

## Tipos de Credenciales en n8n

### 1. Basic Auth (Usuario y Contraseña)
**Cuándo usar:** Servicios simples que requieren usuario y contraseña.

**Ejemplo:**
```
Usuario: admin
Contraseña: mi_password_secreto
```

**Servicios comunes:** FTP, algunos APIs básicos, sistemas internos

### 2. API Key
**Cuándo usar:** Servicios que te dan una clave única para identificarte.

**Ejemplo:**
```
API Key: sk-abc123def456ghi789
```

**Servicios comunes:** OpenAI, weather APIs, muchos servicios de terceros

### 3. OAuth2
**Cuándo usar:** Servicios modernos como Google, Facebook, Twitter.

**Ventajas:**
- Más seguro que contraseñas
- Permisos granulares
- Tokens expiran automáticamente

**Servicios comunes:** Google Workspace, Slack, Microsoft, GitHub

### 4. JWT (JSON Web Token)
**Cuándo usar:** Servicios que usan tokens firmados digitalmente.

**Características:**
- Contiene información cifrada
- Expira automáticamente
- Muy seguro

### 5. Header Authentication
**Cuándo usar:** APIs que requieren headers específicos.

**Ejemplo:**
```
Authorization: Bearer tu-token-aqui
X-API-Key: tu-api-key
```

## Configuración de Credenciales

### Paso 1: Acceder a Credenciales
```
1. Ve a n8n
2. Clic en "Credentials" en el menú lateral
3. Clic en "Create New"
4. Selecciona el tipo de credencial
```

### Paso 2: Configurar Credencial
```
1. Ingresa la información requerida
2. Pon un nombre descriptivo
3. Prueba la conexión
4. Guarda la credencial
```

### Paso 3: Usar en Workflows
```
1. En cualquier nodo que lo requiera
2. Selecciona "Existing Credential"
3. Elige la credencial configurada
4. ¡Listo para usar!
```

## Mejores Prácticas de Seguridad

### 🔐 Nombres Descriptivos
❌ **Malo:**
```
Credencial1
MiAPI
Test123
```

✅ **Bueno:**
```
Gmail-Empresa-Marketing
Slack-Equipo-Desarrollo
OpenAI-ChatBot-Soporte
```

### 🎯 Permisos Mínimos
**Principio:** Solo otorga los permisos mínimos necesarios.

**Ejemplo OAuth2:**
```
✅ Solicitar solo: "Leer emails"
❌ Solicitar: "Acceso completo a cuenta"
```

### 🔄 Rotación Regular
**Frecuencia recomendada:**
- **API Keys:** Cada 90 días
- **Passwords:** Cada 60 días
- **OAuth tokens:** Se renuevan automáticamente

### 🚫 Nunca Hardcodear
❌ **NUNCA hagas esto:**
```javascript
// ¡MAL! Credenciales en código
const apiKey = "sk-abc123def456ghi789";
const password = "mi_password_secreto";
```

✅ **Siempre usa credenciales de n8n:**
```javascript
// ¡BIEN! Usa el sistema de credenciales
// Las credenciales se configuran en la UI
```

## Archivos de Aprendizaje

En esta carpeta encontrarás:

1. **[01_Tipos_de_Credenciales.md](./01_Tipos_de_Credenciales.md)** - Guía detallada de cada tipo
2. **[02_Peligros_de_Hardcodear.md](./02_Peligros_de_Hardcodear.md)** - Por qué nunca debes hardcodear

## Casos de Uso por Tipo

### Gmail (OAuth2)
```
1. Configurar OAuth2 en Google Cloud Console
2. Obtener Client ID y Client Secret
3. Configurar en n8n
4. Autorizar acceso
```

### Slack (OAuth2)
```
1. Crear Slack App
2. Configurar OAuth scopes
3. Obtener Bot Token
4. Configurar en n8n
```

### OpenAI (API Key)
```
1. Ir a platform.openai.com
2. Generar API Key
3. Configurar en n8n
4. Listo para usar
```

### Base de Datos (Basic Auth)
```
1. Crear usuario en la base de datos
2. Asignar permisos mínimos
3. Configurar en n8n
4. Probar conexión
```

## Solución de Problemas

### Error: "Authentication failed"
**Posibles causas:**
- Credenciales incorrectas
- Permisos insuficientes
- Token expirado
- Configuración incorrecta

**Soluciones:**
1. Verificar credenciales
2. Renovar tokens
3. Revisar permisos
4. Consultar documentación del servicio

### Error: "Invalid scope"
**Causa:** Permisos OAuth2 incorrectos

**Solución:**
1. Revisar scopes requeridos
2. Reconfigurar OAuth2
3. Renovar autorización

### Error: "Rate limit exceeded"
**Causa:** Demasiadas peticiones muy rápido

**Solución:**
1. Implementar delays
2. Usar paginación
3. Optimizar workflows

## Monitoreo y Auditoría

### 📊 Revisar Regularmente
- **Credenciales activas:** ¿Cuáles están en uso?
- **Permisos:** ¿Son los mínimos necesarios?
- **Accesos:** ¿Hay actividad sospechosa?

### 🔍 Logs y Alertas
- Configura alertas para fallos de autenticación
- Revisa logs de acceso regularmente
- Monitorea uso de APIs

### 🚨 Respuesta a Incidentes
**Si sospechas compromiso:**
1. Cambiar credenciales inmediatamente
2. Revisar logs de acceso
3. Notificar al equipo
4. Documentar el incidente

## Compliance y Regulaciones

### GDPR (Europa)
- Cifrado de credenciales
- Derecho al olvido
- Consentimiento explícito
- Auditoría de accesos

### SOC 2 (EE.UU.)
- Controles de acceso
- Encriptación en tránsito y reposo
- Monitoreo continuo
- Gestión de vulnerabilidades

### ISO 27001
- Gestión de riesgos
- Políticas de seguridad
- Revisiones regulares
- Capacitación del personal

## Herramientas Útiles

### Gestores de Credenciales
- **1Password** - Para equipos
- **LastPass** - Personal y empresarial
- **Bitwarden** - Open source
- **Azure Key Vault** - Empresarial

### Monitoreo
- **Datadog** - APM y monitoring
- **New Relic** - Performance monitoring
- **Splunk** - Log analysis
- **Elastic Security** - SIEM

### Testing
- **Postman** - Testing de APIs
- **curl** - Línea de comandos
- **Insomnia** - API client
- **HTTPie** - API testing

## Próximos Pasos

1. Revisa tus credenciales actuales
2. Implementa nombres descriptivos
3. Configura rotación regular
4. Aprende sobre [tipos específicos](./01_Tipos_de_Credenciales.md)
5. Entiende los [peligros del hardcoding](./02_Peligros_de_Hardcodear.md)

---

**Recuerda:** La seguridad es un proceso continuo que requiere atención constante y mejores prácticas sistemáticas. Cada medida de precaución implementada incrementa la confiabilidad y seguridad de tu automatización.
