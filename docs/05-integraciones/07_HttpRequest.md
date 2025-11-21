# HTTP Request - La Navaja Suiza de n8n

## ¿Qué es el Nodo HTTP Request?

El nodo HTTP Request es como un mensajero muy inteligente que puede ir a cualquier lugar de internet, pedir información, enviar datos, y traerte la respuesta. Es uno de los nodos más poderosos y versátiles de n8n.

**Ejemplo:** Es como tener un cliente universal que puede comunicarse con cualquier API, enviar peticiones, recibir respuestas, y traerte toda la información que necesitas.

## Conceptos Básicos de HTTP

### ¿Qué es HTTP?
**HTTP** (HyperText Transfer Protocol) es el idioma que usan las computadoras para comunicarse en internet.

**Ejemplo:** Cuando escribes "www.google.com" en tu navegador, tu computadora envía un mensaje HTTP a Google diciendo "¡Hola! ¿Puedes mostrarme tu página principal?"

### Métodos HTTP Principales

#### 1. GET - "Dame información"
**Qué hace:** Pide información sin modificar nada.

**Ejemplo:** Es como hacer una consulta de solo lectura - solo quieres obtener información, no modificar nada.

**Uso común:**
- Obtener datos de una API
- Consultar el estado de un servicio
- Descargar archivos

**Ejemplo práctico:**
```
GET https://api.clima.com/tiempo/madrid
```

#### 2. POST - "Aquí tienes nueva información"
**Qué hace:** Envía nueva información para crear algo.

**Ejemplo:** Es como enviar un documento nuevo al servidor - le proporcionas información nueva para que la procese.

**Uso común:**
- Crear nuevos registros
- Enviar formularios
- Subir archivos

**Ejemplo práctico:**
```
POST https://api.tienda.com/productos
{
  "nombre": "Camiseta",
  "precio": 25.99,
  "color": "azul"
}
```

#### 3. PUT - "Reemplaza esta información"
**Qué hace:** Actualiza información existente completamente.

**Ejemplo:** Es como reemplazar completamente un registro en una base de datos.

**Uso común:**
- Actualizar perfiles de usuario
- Modificar configuraciones
- Reemplazar documentos

#### 4. PATCH - "Cambia solo esto"
**Qué hace:** Actualiza solo parte de la información.

**Ejemplo:** Es como actualizar solo campos específicos de un registro existente.

**Uso común:**
- Actualizar solo algunos campos
- Cambios parciales
- Actualizaciones menores

#### 5. DELETE - "Elimina esto"
**Qué hace:** Borra información.

**Ejemplo:** Es como eliminar un registro específico de una base de datos.

**Uso común:**
- Eliminar registros
- Cancelar suscripciones
- Limpiar datos

## Configuración del Nodo HTTP Request

### 1. URL (Dirección)
**Qué es:** La dirección exacta donde quieres enviar tu petición.

**Ejemplos:**
```
https://api.ejemplo.com/usuarios
https://webhook.site/tu-webhook-id
https://jsonplaceholder.typicode.com/posts
```

### 2. Método (Method)
**Qué es:** El tipo de acción que quieres realizar.

**Cuándo usar cada uno:**
- **GET:** Para obtener datos
- **POST:** Para crear algo nuevo
- **PUT:** Para actualizar completamente
- **PATCH:** Para actualizar parcialmente
- **DELETE:** Para eliminar

### 3. Headers (Encabezados)
**Qué son:** Información adicional sobre tu petición.

**Ejemplos comunes:**
```
Content-Type: application/json
Authorization: Bearer tu-token-aqui
User-Agent: n8n-workflow
Accept: application/json
```

### 4. Body (Cuerpo)
**Qué es:** Los datos que envías con tu petición (principalmente con POST y PUT).

**Formato JSON:**
```json
{
  "nombre": "Juan",
  "email": "juan@ejemplo.com",
  "edad": 30
}
```

## Autenticación (Authentication)

### 1. Sin Autenticación
**Cuándo usar:** APIs públicas que no requieren identificación.

### 2. Basic Auth
**Qué es:** Usuario y contraseña básicos.

**Ejemplo:**
```
Usuario: admin
Contraseña: mi_password_secreto
```

### 3. API Key
**Qué es:** Una clave única que identifica tu aplicación.

**Ejemplos:**
- En Header: `X-API-Key: tu-clave-aqui`
- En Query: `?api_key=tu-clave-aqui`

### 4. Bearer Token
**Qué es:** Un token de acceso, común en APIs modernas.

**Ejemplo:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. OAuth2
**Qué es:** Autenticación avanzada que usa tokens temporales.

**Cuándo usar:** Con servicios como Google, Facebook, Twitter.

## Manejo de Respuestas

### Códigos de Estado HTTP
**Qué son:** Números que indican si tu petición fue exitosa o no.

#### Códigos de Éxito (200-299)
- **200 OK:** Todo salió perfecto
- **201 Created:** Se creó algo nuevo exitosamente
- **204 No Content:** Exitoso, pero no hay contenido que devolver

#### Códigos de Error del Cliente (400-499)
- **400 Bad Request:** Tu petición está mal formada
- **401 Unauthorized:** Necesitas autenticarte
- **403 Forbidden:** No tienes permiso
- **404 Not Found:** No se encontró lo que buscas
- **429 Too Many Requests:** Estás haciendo demasiadas peticiones

#### Códigos de Error del Servidor (500-599)
- **500 Internal Server Error:** Algo salió mal en el servidor
- **502 Bad Gateway:** Problema de conexión
- **503 Service Unavailable:** El servicio no está disponible

## Ejemplos Prácticos

### 1. Obtener Datos del Clima
```json
{
  "método": "GET",
  "url": "https://api.openweathermap.org/data/2.5/weather",
  "parámetros": {
    "q": "Madrid",
    "appid": "tu-api-key",
    "units": "metric",
    "lang": "es"
  }
}
```

### 2. Crear un Usuario
```json
{
  "método": "POST",
  "url": "https://api.miapp.com/usuarios",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer tu-token"
  },
  "body": {
    "nombre": "Ana García",
    "email": "ana@ejemplo.com",
    "rol": "usuario"
  }
}
```

### 3. Actualizar Información
```json
{
  "método": "PATCH",
  "url": "https://api.miapp.com/usuarios/123",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "nuevo-email@ejemplo.com"
  }
}
```

## Consejos y Mejores Prácticas

### 1. Manejo de Errores
```javascript
// En el nodo HTTP Request, habilita "Continue on Fail"
// Luego usa un nodo IF para verificar el código de estado
{{ $json.code >= 200 && $json.code < 300 }}
```

### 2. Timeout (Tiempo de Espera)
```
- Para APIs rápidas: 10-30 segundos
- Para APIs lentas: 60-120 segundos
- Para descargas: 300+ segundos
```

### 3. Retry (Reintentos)
```
- Habilita reintentos automáticos
- Configura 3-5 intentos máximo
- Usa delays incrementales
```

### 4. Rate Limiting
```
- Respeta los límites de la API
- Usa delays entre peticiones
- Implementa backoff exponencial
```

## Depuración y Solución de Problemas

### 1. Verificar la URL
```
✅ Correcto: https://api.ejemplo.com/datos
❌ Incorrecto: http://api.ejemplo.com/datos (sin SSL)
❌ Incorrecto: api.ejemplo.com/datos (sin protocolo)
```

### 2. Verificar Headers
```javascript
// Usar el panel de depuración para ver:
// - Headers enviados
// - Headers recibidos
// - Código de estado
// - Tiempo de respuesta
```

### 3. Verificar Body
```json
// Asegúrate de que el JSON sea válido
{
  "nombre": "Juan",
  "edad": 30
}

// NO esto:
{
  "nombre": "Juan",
  "edad": 30,  // ← coma extra
}
```

## Casos de Uso Comunes

### 1. Integración con APIs de Terceros
- Obtener datos de CRM
- Sincronizar inventarios
- Consultar servicios de pago

### 2. Webhooks
- Recibir notificaciones
- Triggers de eventos
- Integraciones en tiempo real

### 3. Monitoreo y Alertas
- Verificar estado de servicios
- Healthchecks automáticos
- Alertas de disponibilidad

### 4. Procesamiento de Datos
- Transformar formatos
- Validar información
- Enriquecer datos

## Próximos Pasos

1. Practica con APIs públicas gratuitas
2. Implementa manejo de errores
3. Aprende sobre [Manejo de Datos](../02_Manejo_de_Datos_y_Expresiones/)
4. Explora [Integraciones Avanzadas](../03_Workflows_Avanzados_y_Patrones/)

---

**Recuerda:** El nodo HTTP Request es como aprender a conducir. Al principio parece complicado con tantos controles, pero una vez que dominas los conceptos básicos, te abre un mundo de posibilidades. ¡Cada API es un destino nuevo que puedes explorar! 🚗🌐
