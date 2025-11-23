# Tipos de Credenciales en n8n

## ¿Qué son las Credenciales?

Las credenciales son **identificadores de autenticación** que permiten a n8n acceder a servicios externos de manera segura y autorizada. Funcionan como mecanismos de verificación de identidad entre n8n y los sistemas con los que se integra.

### Concepto Técnico
Las credenciales actúan como sistemas de autenticación que incluyen:
- **Claves de API**: Identificadores únicos para acceso programático
- **Tokens de acceso**: Credenciales temporales con permisos específicos
- **Certificados**: Métodos de autenticación basados en criptografía

## Tipos Principales de Credenciales

### 1. **API Key**
La más simple y común. Es como una contraseña especial que identifica tu aplicación.

**Características:**
- Una sola cadena de texto
- Usualmente larga y aleatoria
- Permanente hasta que la cambies
- Fácil de usar pero menos segura

**Ejemplo Visual:**
```
API Key: sk-1234567890abcdef1234567890abcdef
```

**Servicios que usan API Key:**
- OpenAI
- SendGrid
- Stripe
- WeatherAPI
- Many HTTP APIs

**Cómo configurar:**
1. Ve a **Credentials** → **Add Credential**
2. Selecciona el servicio
3. Pega tu API Key
4. Dale un nombre descriptivo

### 2. **Usuario y Contraseña** 👤
El método más tradicional, como entrar a tu email.

**Características:**
- Dos campos: username/email y password
- Familiar para todos
- Menos seguro que métodos modernos
- Algunas veces requiere autenticación adicional

**Servicios que usan Usuario/Contraseña:**
- SMTP (email)
- FTP
- Databases (MySQL, PostgreSQL)
- LDAP

**Configuración:**
```
Usuario: mi_usuario@empresa.com
Contraseña: mi_contraseña_segura
```

### 3. **OAuth2** 🔄
El método más seguro y moderno. Es como tener un pase temporal que puedes revocar.

**Características:**
- No necesitas compartir tu contraseña
- Permisos específicos y limitados
- Tokens que expiran automáticamente
- Puedes revocar acceso en cualquier momento

**Cómo funciona OAuth2:**
1. **Autorización**: Le dices al servicio "permite que n8n acceda a mis datos"
2. **Token**: El servicio te da un token especial
3. **Acceso**: n8n usa ese token para acceder a tus datos
4. **Renovación**: El token se renueva automáticamente

**Servicios que usan OAuth2:**
- Google (Gmail, Sheets, Drive)
- Microsoft (Outlook, Teams)
- Slack
- Facebook
- Twitter
- GitHub

### 4. **Bearer Token** 🎫
Un token que "llevas" contigo para demostrar quién eres.

**Características:**
- Token único y temporal
- Se envía en cada petición
- Más seguro que API Keys
- Puede expirar

**Formato:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. **Basic Auth** 🔒
Combinación de usuario y contraseña codificada en Base64.

**Características:**
- Simple de implementar
- Menos seguro (se puede decodificar fácilmente)
- Común en APIs internas
- Se envía en cada petición

**Formato:**
```
Authorization: Basic bXlfdXNlcjpteV9wYXNzd29yZA==
```

### 6. **JWT (JSON Web Token)** 📜
Un token que contiene información sobre el usuario y permisos.

**Características:**
- Contiene información del usuario
- Puede incluir permisos específicos
- Tiene fecha de expiración
- Se puede validar sin consultar servidor

**Estructura:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## 🛠️ Configuración Detallada por Tipo

### OAuth2 - Configuración Paso a Paso

#### Para Google Services:
1. **Crear Proyecto en Google Cloud:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un nuevo proyecto
   - Habilita las APIs necesarias (Gmail, Sheets, etc.)

2. **Configurar OAuth2:**
   - Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client"
   - Tipo: Web Application
   - Authorized redirect URIs: `https://tu-n8n.com/rest/oauth2-credential/callback`

3. **En n8n:**
   - Credentials → Add → Google OAuth2
   - Client ID: (del paso anterior)
   - Client Secret: (del paso anterior)
   - Scopes: Permisos específicos que necesitas

#### Para Slack:
1. **Crear Slack App:**
   - Ve a [Slack API](https://api.slack.com/apps)
   - Crea nueva app
   - Configura permisos (scopes)

2. **OAuth Settings:**
   - Redirect URL: `https://tu-n8n.com/rest/oauth2-credential/callback`
   - Instala la app en tu workspace

3. **En n8n:**
   - Credentials → Add → Slack OAuth2
   - Client ID y Client Secret de tu app

### API Key - Mejores Prácticas

#### Obtener API Key:
1. **OpenAI:**
   - Ve a [OpenAI Platform](https://platform.openai.com)
   - API Keys → Create new secret key
   - Copia la key (solo se muestra una vez)

2. **SendGrid:**
   - Dashboard → Settings → API Keys
   - Create API Key con permisos específicos

#### Configurar en n8n:
```
Credential Name: OpenAI - Producción
API Key: sk-1234567890abcdef1234567890abcdef
```

### Base de Datos - Configuración

#### MySQL/PostgreSQL:
```
Host: localhost
Port: 3306 (MySQL) / 5432 (PostgreSQL)
Database: mi_base_datos
Username: mi_usuario
Password: mi_contraseña_segura
```

#### MongoDB:
```
Connection String: mongodb://usuario:contraseña@localhost:27017/mi_db
```

## 🔐 Configuración de Seguridad

### 1. **Encriptación de Credenciales**

n8n encripta automáticamente todas las credenciales usando:
- **AES-256**: Para encriptar los valores
- **Encryption Key**: Clave maestra para proteger todo

**Configurar Encryption Key:**
```bash
# En tu archivo .env
N8N_ENCRYPTION_KEY=tu_clave_super_segura_de_32_caracteres
```

### 2. **Variables de Entorno**

Para mayor seguridad, usa variables de entorno:

```bash
# .env file
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
SLACK_API_TOKEN=tu_slack_token
```

### 3. **Rotación de Credenciales**

**Calendario de rotación recomendado:**
- **API Keys**: Cada 90 días
- **Passwords**: Cada 60 días
- **OAuth Tokens**: Se renuevan automáticamente
- **Database**: Cada 180 días

## 🚦 Tipos de Permisos

### Permisos de Google (Scopes)
```
https://www.googleapis.com/auth/gmail.readonly        # Solo lectura Gmail
https://www.googleapis.com/auth/gmail.send           # Enviar emails
https://www.googleapis.com/auth/spreadsheets         # Google Sheets
https://www.googleapis.com/auth/drive.file          # Google Drive
```

### Permisos de Slack
```
channels:read      # Leer canales
chat:write        # Escribir mensajes
files:read        # Leer archivos
users:read        # Leer información de usuarios
```

### Permisos de Base de Datos
```
SELECT            # Leer datos
INSERT            # Insertar datos
UPDATE            # Actualizar datos
DELETE            # Eliminar datos
CREATE            # Crear tablas
```

## 📋 Plantilla de Documentación de Credenciales

```markdown
## Credencial: [Nombre del Servicio]

**Tipo:** OAuth2 / API Key / Basic Auth

**Propósito:** Para qué se usa esta credencial

**Configuración:**
- Client ID: [valor]
- Client Secret: [valor]
- Scopes: [lista de permisos]

**Seguridad:**
- Fecha de creación: [fecha]
- Último uso: [fecha]
- Próxima rotación: [fecha]

**Workflows que la usan:**
- Workflow 1: [descripción]
- Workflow 2: [descripción]

**Contacto responsable:** [persona/equipo]
```

## Troubleshooting Común

### Error de OAuth2
```
Error: invalid_grant
Solución: Regenerar token o verificar configuración
```

### API Key inválida
```
Error: Unauthorized (401)
Solución: Verificar que la API Key sea correcta y activa
```

### Token expirado
```
Error: Token expired
Solución: Renovar token o reautorizar
```

## Checklist de Seguridad

### ✅ Configuración Inicial
- [ ] Encryption key configurada
- [ ] Variables de entorno para datos sensibles
- [ ] Credenciales con nombres descriptivos
- [ ] Permisos mínimos necesarios

### ✅ Mantenimiento
- [ ] Rotación programada de credenciales
- [ ] Monitoreo de uso
- [ ] Backup de configuraciones
- [ ] Documentación actualizada

### ✅ Buenas Prácticas
- [ ] Una credencial por servicio/propósito
- [ ] Nombres descriptivos y únicos
- [ ] Permisos específicos, no genéricos
- [ ] Revocación de credenciales no utilizadas

---

**Recuerda:** Las credenciales son elementos críticos de seguridad - mantenlas seguras, no las compartas innecesariamente, y cámbialas regularmente para mantener tu workflow protegido.
