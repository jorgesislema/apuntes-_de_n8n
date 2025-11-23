# Peligros de Hardcodear Credenciales

## ¿Qué significa "Hardcodear"?

**Hardcodear** significa escribir datos sensibles directamente en el código fuente, como incluir contraseñas, API keys o tokens de acceso dentro del texto del programa. Esta práctica representa un serio riesgo de seguridad.

### Concepto Técnico
El hardcodeo implica:
- **Exposición de credenciales**: Los datos sensibles quedan visibles en el código
- **Riesgo de filtración**: Las credenciales pueden ser accedidas por personas no autorizadas
- **Dificultad de mantenimiento**: Cambiar credenciales requiere modificar el código

## Ejemplos de Hardcodeo (MAL)

### ❌ Ejemplo 1: API Key en el código
```javascript
// ¡NUNCA HAGAS ESTO!
const apiKey = "sk-1234567890abcdef1234567890abcdef";
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
});
```

### ❌ Ejemplo 2: Contraseña en HTTP Request
```javascript
// ¡PELIGROSO!
const loginData = {
    username: "admin",
    password: "mi_contraseña_super_secreta_123"
};
```

### ❌ Ejemplo 3: Token en URL
```javascript
// ¡TERRIBLE IDEA!
const url = "https://api.slack.com/api/chat.postMessage?token=xoxb-1234567890-abcdef";
```

### ❌ Ejemplo 4: Datos de Base de Datos
```javascript
// ¡EXTREMADAMENTE PELIGROSO!
const dbConfig = {
    host: "production-db.empresa.com",
    user: "admin",
    password: "contraseña_produccion_2024",
    database: "datos_clientes"
};
```

## 💣 ¿Por qué es Peligroso?

### 1. **Visibilidad Total** 👀
```javascript
// Cualquiera que vea tu workflow puede ver esto:
const secretKey = "mi_clave_secreta"; // ¡Todos pueden verlo!
```

### 2. **Historial de Versiones**
```
Git History:
- Commit 1: "Agregué la API key" ← La clave queda PARA SIEMPRE
- Commit 2: "Cambié la API key" ← La anterior sigue visible
- Commit 3: "Removí la API key" ← Muy tarde, ya está registrada
```

### 3. **Logs y Debugging** 📝
```javascript
// Esto aparecerá en los logs:
console.log("Conectando con password:", "mi_contraseña_secreta");
// Los logs son visibles para admins y desarrolladores
```

### 4. **Compartir Workflows** 📤
```javascript
// Cuando exportas tu workflow:
{
    "nodes": [
        {
            "parameters": {
                "authentication": "none",
                "requestMethod": "POST",
                "url": "https://api.servicio.com",
                "headers": {
                    "Authorization": "Bearer tu_token_secreto_aqui"
                }
            }
        }
    ]
}
// ¡El token va incluido en el archivo!
```

## Casos Reales de Problemas

### 📖 Historia Real 1: La Startup que Perdió $50,000
```javascript
// Código que se subió a GitHub público:
const config = {
    aws_access_key: "AKIAIOSFODNN7EXAMPLE",
    aws_secret_key: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    region: "us-east-1"
};
```
**Resultado:** Bots encontraron las credenciales en minutos y usaron la cuenta de AWS para minar criptomonedas.

### 📖 Historia Real 2: La Empresa que Expuso 1 Millón de Emails
```javascript
// En un workflow compartido:
const emailConfig = {
    host: "smtp.empresa.com",
    user: "admin@empresa.com",
    password: "contraseña_email_admin_2024"
};
```
**Resultado:** La credencial se usó para enviar spam masivo desde su dominio.

### 📖 Historia Real 3: El Freelancer que Perdió Todos sus Clientes
```javascript
// En un nodo HTTP Request:
const headers = {
    "Authorization": "Bearer token_que_da_acceso_a_todo"
};
```
**Resultado:** El token se compartió accidentalmente con un cliente, quien tuvo acceso a datos de otros clientes.

## Soluciones Correctas

### ✅ Método 1: Usar Credenciales de n8n
```javascript
// En lugar de hardcodear:
const apiKey = "sk-1234567890abcdef"; // ❌ MAL

// Usa credenciales:
// Configura en Settings → Credentials → Add Credential
// Luego selecciona la credencial en el nodo
```

### ✅ Método 2: Variables de Entorno
```javascript
// En archivo .env:
OPENAI_API_KEY=sk-1234567890abcdef
SLACK_TOKEN=xoxb-1234567890-abcdef
DB_PASSWORD=contraseña_super_segura

// En el código:
const apiKey = process.env.OPENAI_API_KEY; // ✅ CORRECTO
```

### ✅ Método 3: Nodo Set con Expresiones
```javascript
// En un nodo Set:
{
    "values": {
        "string": [
            {
                "name": "api_response",
                "value": "={{ $credentials.openai.api_key }}"
            }
        ]
    }
}
```

### ✅ Método 4: HTTP Request con Credenciales
```javascript
// Configuración del nodo HTTP Request:
{
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "openAiApi",
    "url": "https://api.openai.com/v1/chat/completions"
}
```

## Cómo Identificar Hardcodeo

### 🚨 Señales de Alerta
```javascript
// Busca estas patterns peligrosas:

// 1. Strings largos y aleatorios
const key = "sk-1234567890abcdefghijklmnopqrstuvwxyz"; // ❌

// 2. Palabras clave sospechosas
const password = "mi_contraseña"; // ❌
const token = "xoxb-123456789"; // ❌
const secret = "abc123def456"; // ❌

// 3. URLs con parámetros sensibles
const url = "https://api.com/data?api_key=secret123"; // ❌

// 4. Objetos de configuración
const config = {
    username: "admin",      // ❌
    password: "secret",     // ❌
    database: "production"  // ❌
};
```

### Herramientas para Detectar
```bash
# Buscar patterns peligrosos en workflows exportados:
grep -r "password\|token\|secret\|key" workflows/
grep -r "sk-\|xoxb-\|ghp_" workflows/
grep -r "@gmail\.com\|@empresa\.com" workflows/
```

## 🛠️ Migración de Hardcodeo a Credenciales

### Paso 1: Identificar Credenciales Hardcodeadas
```javascript
// Antes (hardcodeado):
const datos = {
    api_key: "sk-1234567890abcdef",
    webhook_url: "https://hooks.slack.com/services/T123/B456/xyz789",
    db_password: "contraseña_base_datos"
};
```

### Paso 2: Crear Credenciales en n8n
1. **Settings → Credentials → Add Credential**
2. **Seleccionar tipo apropiado**
3. **Llenar campos de manera segura**
4. **Dar nombre descriptivo**

### Paso 3: Actualizar Workflows
```javascript
// Después (usando credenciales):
// Ya no necesitas hardcodear nada
// El nodo automáticamente usa las credenciales configuradas
```

## 📋 Checklist de Seguridad

### ✅ Antes de Publicar/Compartir
- [ ] No hay API keys visibles en el código
- [ ] No hay contraseñas en texto plano
- [ ] No hay tokens de acceso hardcodeados
- [ ] No hay URLs con parámetros sensibles
- [ ] No hay información de bases de datos
- [ ] No hay emails corporativos hardcodeados

### ✅ Configuración Correcta
- [ ] Todas las credenciales están en el sistema de credenciales
- [ ] Variables de entorno para datos sensibles
- [ ] Nombres descriptivos para credenciales
- [ ] Permisos mínimos necesarios
- [ ] Rotación programada de credenciales

### ✅ Mantenimiento
- [ ] Auditoría regular de workflows
- [ ] Revisión de credenciales activas
- [ ] Eliminación de credenciales no utilizadas
- [ ] Actualización de documentación

## 🎓 Ejercicio Práctico

### Encuentra los Problemas:
```javascript
// Workflow con múltiples problemas de seguridad
const configuracion = {
    // Problema 1: API Key hardcodeada
    openai_key: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
    
    // Problema 2: Credenciales de base de datos
    db_config: {
        host: "prod-db.empresa.com",
        user: "admin",
        password: "ContraseñaSegura2024!"
    },
    
    // Problema 3: Token de Slack
    slack_webhook: "https://hooks.slack.com/services/T123456/B789012/xyz789abc123def456ghi789",
    
    // Problema 4: Email corporativo
    notification_email: "admin@empresa-secreta.com",
    
    // Problema 5: Clave de cifrado
    encryption_key: "mi_clave_super_secreta_para_cifrar_datos"
};
```

### Solución Correcta:
```javascript
// ✅ Versión segura:
// 1. Crear credencial OpenAI en n8n
// 2. Crear credencial de base de datos
// 3. Configurar webhook de Slack como credencial
// 4. Usar variables de entorno para email
// 5. Configurar encryption key en variables de entorno

// El workflow ya no contiene información sensible
const resultado = await procesarDatos();
```

## Herramientas Recomendadas

### 1. **git-secrets**
```bash
# Detecta credenciales antes de commit
git secrets --scan
```

### 2. **TruffleHog**
```bash
# Escanea repositorios en busca de secretos
trufflescan --repo=https://github.com/user/repo
```

### 3. **n8n Security Audit**
```bash
# Auditar workflows exportados
n8n audit --workflows=./workflows/
```

---

**Recuerda:** Hardcodear credenciales es una práctica extremadamente peligrosa de seguridad. Puede parecer conveniente, pero expone información crítica. Siempre usa el sistema de credenciales de n8n y variables de entorno para mantener tus datos seguros.
