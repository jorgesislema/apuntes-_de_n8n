# Slack - Guía Completa de Integración

## ¿Qué es Slack?

Slack es una **plataforma de comunicación empresarial** que centraliza las conversaciones del equipo, permite compartir archivos y facilita la colaboración. En n8n, se puede automatizar notificaciones, crear bots inteligentes, procesar mensajes y expandir significativamente sus capacidades.

### Concepto Técnico
Slack ofrece:
- **API REST**: Para enviar mensajes y obtener información
- **Webhooks**: Para recibir notificaciones en tiempo real
- **Slash commands**: Para crear comandos personalizados
- **Bot tokens**: Para crear aplicaciones automatizadas

## Configuración Inicial

### 1. **Crear Slack App**

#### Paso 1: Crear la App
1. Ve a [Slack API](https://api.slack.com/apps)
2. Clic en **"Create New App"**
3. Selecciona **"From scratch"**
4. Nombre de la app: "n8n Integration"
5. Selecciona tu workspace

#### Paso 2: Configurar Permisos (OAuth & Permissions)
```
Bot Token Scopes:
- chat:write          # Enviar mensajes
- chat:write.public   # Enviar a canales públicos
- channels:read       # Leer lista de canales
- users:read          # Leer información de usuarios
- files:write         # Subir archivos
- reactions:write     # Agregar reacciones
- im:write           # Mensajes directos
```

#### Paso 3: Instalar la App
1. En **"OAuth & Permissions"**
2. Clic en **"Install to Workspace"**
3. Autorizar permisos
4. Copia el **Bot User OAuth Token** (empieza con `xoxb-`)

### 2. **Configurar en n8n**

#### Método 1: Slack OAuth2
1. **Credentials** → **Add Credential**
2. **Slack OAuth2 API**
3. Client ID y Client Secret de tu app
4. **Connect my account**

#### Método 2: Bot Token
1. **Credentials** → **Add Credential**
2. **Slack API**
3. Pega tu Bot Token (`xoxb-...`)

## 💬 Operaciones Principales

### 1. **Enviar Mensajes**

#### Mensaje Simple
```json
{
  "operation": "postMessage",
  "channel": "#general",
  "text": "¡Hola equipo! 👋"
}
```

#### Mensaje con Formato
```json
{
  "operation": "postMessage",
  "channel": "#general",
  "text": "Reporte de ventas",
  "attachments": [
    {
      "color": "good",
      "title": "Ventas del día",
      "text": "Total: $15,420\nMeta: $12,000 ✅",
      "fields": [
        {
          "title": "Vendedor destacado",
          "value": "Ana García",
          "short": true
        },
        {
          "title": "Productos vendidos",
          "value": "127 unidades",
          "short": true
        }
      ]
    }
  ]
}
```

#### Mensaje con Blocks (Moderno)
```json
{
  "operation": "postMessage",
  "channel": "#general",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚀 Nuevo Deployment"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Versión:* 2.1.0\n*Ambiente:* Producción\n*Estado:* ✅ Exitoso"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Ver Logs"
          },
          "url": "https://logs.empresa.com/deploy/2.1.0"
        }
      ]
    }
  ]
}
```

### 2. **Subir Archivos**

#### Subir Archivo Simple
```json
{
  "operation": "uploadFile",
  "channels": ["#general"],
  "fileName": "reporte.pdf",
  "fileContent": "base64_content_here",
  "initialComment": "Reporte mensual adjunto 📊"
}
```

### 3. **Reacciones**

#### Agregar Reacción
```json
{
  "operation": "addReaction",
  "channel": "#general",
  "timestamp": "1234567890.123456",
  "name": "thumbsup"
}
```

### 4. **Obtener Información**

#### Listar Canales
```json
{
  "operation": "getChannels",
  "returnAll": true
}
```

#### Obtener Usuarios
```json
{
  "operation": "getUsers",
  "returnAll": true
}
```

## 🤖 Casos de Uso Comunes

### 1. **Bot de Notificaciones**

#### Workflow: Webhook → Procesar → Slack
```javascript
// En nodo Code - Formatear notificación
const evento = $json;

let color = "good";
let emoji = "✅";

// Determinar color y emoji según tipo
switch (evento.tipo) {
  case "error":
    color = "danger";
    emoji = "❌";
    break;
  case "warning":
    color = "warning";
    emoji = "⚠️";
    break;
  case "info":
    color = "good";
    emoji = "ℹ️";
    break;
}

return [{
  json: {
    channel: evento.urgente ? "#alerts" : "#general",
    text: `${emoji} ${evento.titulo}`,
    attachments: [{
      color: color,
      title: evento.titulo,
      text: evento.descripcion,
      fields: [
        {
          title: "Servicio",
          value: evento.servicio,
          short: true
        },
        {
          title: "Timestamp",
          value: new Date().toLocaleString(),
          short: true
        }
      ],
      footer: "Sistema de Monitoreo",
      ts: Math.floor(Date.now() / 1000)
    }]
  }
}];
```

### 2. **Reporte Automático Diario**

#### Workflow: Cron → Obtener Datos → Slack
```javascript
// En nodo Code - Generar reporte diario
const datos = {
  ventas: 15420,
  nuevosClientes: 23,
  ticketsSoporte: 12,
  uptime: "99.8%"
};

const fecha = new Date().toLocaleDateString('es-ES');

return [{
  json: {
    channel: "#daily-reports",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📊 Reporte Diario - ${fecha}`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*💰 Ventas:*\n$${datos.ventas.toLocaleString()}`
          },
          {
            type: "mrkdwn",
            text: `*👥 Nuevos Clientes:*\n${datos.nuevosClientes}`
          },
          {
            type: "mrkdwn",
            text: `*🎫 Tickets Soporte:*\n${datos.ticketsSoporte}`
          },
          {
            type: "mrkdwn",
            text: `*⚡ Uptime:*\n${datos.uptime}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Generado automáticamente por n8n"
          }
        ]
      }
    ]
  }
}];
```

### 3. **Alertas de Sistema**

#### Workflow: Monitor → Condición → Slack
```javascript
// En nodo Code - Procesar alerta
const metrica = $json;

// Determinar gravedad
let severidad = "info";
let canal = "#monitoring";

if (metrica.cpu > 90 || metrica.memoria > 95) {
  severidad = "crítico";
  canal = "#alerts";
} else if (metrica.cpu > 70 || metrica.memoria > 80) {
  severidad = "advertencia";
  canal = "#monitoring";
}

const mensaje = {
  crítico: {
    color: "danger",
    emoji: "🚨",
    text: "¡ALERTA CRÍTICA!"
  },
  advertencia: {
    color: "warning",
    emoji: "⚠️",
    text: "Advertencia del sistema"
  },
  info: {
    color: "good",
    emoji: "ℹ️",
    text: "Información del sistema"
  }
};

return [{
  json: {
    channel: canal,
    text: `${mensaje[severidad].emoji} ${mensaje[severidad].text}`,
    attachments: [{
      color: mensaje[severidad].color,
      title: "Métricas del Servidor",
      fields: [
        {
          title: "CPU",
          value: `${metrica.cpu}%`,
          short: true
        },
        {
          title: "Memoria",
          value: `${metrica.memoria}%`,
          short: true
        },
        {
          title: "Disco",
          value: `${metrica.disco}%`,
          short: true
        },
        {
          title: "Servidor",
          value: metrica.servidor,
          short: true
        }
      ],
      footer: "Sistema de Monitoreo",
      ts: Math.floor(Date.now() / 1000)
    }]
  }
}];
```

### 4. **Bot de Soporte**

#### Workflow: Slack Trigger → Procesar → Responder
```javascript
// En nodo Code - Procesar mensaje de soporte
const mensaje = $json;

// Detectar tipo de consulta
let tipoConsulta = "general";
let respuesta = "Gracias por tu mensaje. Te ayudaré en un momento.";

const texto = mensaje.text.toLowerCase();

if (texto.includes("password") || texto.includes("contraseña")) {
  tipoConsulta = "password";
  respuesta = "Para resetear tu contraseña, ve a: https://empresa.com/reset";
} else if (texto.includes("error") || texto.includes("problema")) {
  tipoConsulta = "error";
  respuesta = "He registrado tu problema. Un técnico te contactará pronto.";
} else if (texto.includes("factura") || texto.includes("pago")) {
  tipoConsulta = "facturacion";
  respuesta = "Para consultas de facturación, contacta a: facturacion@empresa.com";
}

return [{
  json: {
    channel: mensaje.channel,
    text: respuesta,
    thread_ts: mensaje.ts, // Responder en hilo
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hola <@${mensaje.user}>! ${respuesta}`
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Tipo de consulta: ${tipoConsulta} | Ticket: #${Date.now()}`
          }
        ]
      }
    ]
  }
}];
```

## 🛠️ Técnicas Avanzadas

### 1. **Mensajes Interactivos**

#### Crear Botones de Acción
```javascript
// En nodo Code - Crear mensaje con botones
const solicitud = $json;

return [{
  json: {
    channel: "#approvals",
    text: "Nueva solicitud de vacaciones",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📋 Solicitud de Vacaciones"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Empleado:* ${solicitud.empleado}\n*Fechas:* ${solicitud.inicio} - ${solicitud.fin}\n*Días:* ${solicitud.dias}`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "✅ Aprobar"
            },
            style: "primary",
            value: `approve_${solicitud.id}`,
            action_id: "approve_vacation"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "❌ Rechazar"
            },
            style: "danger",
            value: `reject_${solicitud.id}`,
            action_id: "reject_vacation"
          }
        ]
      }
    ]
  }
}];
```

### 2. **Webhooks Incoming**

#### Configurar Webhook
```javascript
// URL del webhook: https://hooks.slack.com/services/T123/B456/xyz
const webhook = {
  url: "https://hooks.slack.com/services/T123/B456/xyz",
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: {
    text: "Mensaje vía webhook",
    channel: "#general",
    username: "n8n Bot",
    icon_emoji: ":robot_face:"
  }
};
```

### 3. **Mensajes Programados**

#### Enviar Mensaje en Horario Específico
```javascript
// En nodo Code - Verificar horario
const hora = new Date().getHours();
const diaSemana = new Date().getDay();

// Solo enviar en horario laboral (9-17, Lun-Vie)
if (hora >= 9 && hora <= 17 && diaSemana >= 1 && diaSemana <= 5) {
  return [{
    json: {
      enviar: true,
      channel: "#general",
      text: "Recordatorio: Reunión de equipo en 30 minutos 📅"
    }
  }];
} else {
  return [{
    json: {
      enviar: false,
      razon: "Fuera de horario laboral"
    }
  }];
}
```

### 4. **Formateo Avanzado**

#### Crear Mensajes Ricos
```javascript
// En nodo Code - Formatear mensaje rico
const datos = $json;

return [{
  json: {
    channel: "#sales",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎉 Nueva Venta Realizada"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Felicitaciones! Se ha registrado una nueva venta:`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Cliente:*\n${datos.cliente}`
          },
          {
            type: "mrkdwn",
            text: `*Vendedor:*\n${datos.vendedor}`
          },
          {
            type: "mrkdwn",
            text: `*Producto:*\n${datos.producto}`
          },
          {
            type: "mrkdwn",
            text: `*Monto:*\n$${datos.monto.toLocaleString()}`
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `📅 ${new Date().toLocaleDateString()} | 🤖 Automático via n8n`
          }
        ]
      }
    ]
  }
}];
```

## 🔧 Manejo de Errores

### 1. **Validación de Canales**

#### Verificar Canal Existe
```javascript
// En nodo Code - Validar canal
const canal = $json.channel;

// Lista de canales válidos
const canalesValidos = [
  "#general",
  "#alerts",
  "#monitoring",
  "#sales",
  "#support"
];

if (!canalesValidos.includes(canal)) {
  return [{
    json: {
      error: true,
      mensaje: `Canal ${canal} no válido`,
      canalFallback: "#general"
    }
  }];
}

return [{
  json: {
    error: false,
    canal: canal
  }
}];
```

### 2. **Retry Logic**

#### Reintentar Envío
```javascript
// En nodo Code - Lógica de reintentos
const MAX_REINTENTOS = 3;
let intentos = 0;

const enviarMensaje = async () => {
  while (intentos < MAX_REINTENTOS) {
    try {
      // Simular envío
      const resultado = await enviarSlack($json);
      return resultado;
    } catch (error) {
      intentos++;
      if (intentos >= MAX_REINTENTOS) {
        throw new Error(`Falló después de ${MAX_REINTENTOS} intentos`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * intentos));
    }
  }
};
```

## 📊 Monitoreo y Métricas

### 1. **Tracking de Mensajes**

#### Registrar Actividad
```javascript
// En nodo Code - Registrar métricas
const mensaje = $json;

return [{
  json: {
    // Datos del mensaje
    ...mensaje,
    
    // Métricas
    timestamp: new Date().toISOString(),
    longitud: mensaje.text.length,
    canal: mensaje.channel,
    tipo: mensaje.attachments ? "rico" : "simple",
    
    // Metadata
    enviado_por: "n8n",
    workflow_id: "slack_notification",
    version: "1.0"
  }
}];
```

### 2. **Análisis de Respuestas**

#### Medir Engagement
```javascript
// En nodo Code - Analizar respuestas
const respuesta = $json;

const analisis = {
  mensaje_id: respuesta.ts,
  canal: respuesta.channel,
  usuario: respuesta.user,
  tiempo_respuesta: Date.now() - respuesta.mensaje_original_ts,
  tipo_respuesta: respuesta.text ? "texto" : "reaccion",
  engagement: {
    rapido: respuesta.tiempo_respuesta < 300000, // 5 minutos
    activo: respuesta.text.length > 10
  }
};

return [{ json: analisis }];
```

## 📋 Checklist de Mejores Prácticas

### ✅ Configuración
- [ ] App de Slack configurada correctamente
- [ ] Permisos mínimos necesarios
- [ ] Bot tokens seguros
- [ ] Canales apropiados definidos

### ✅ Mensajes
- [ ] Formato consistente
- [ ] Emojis para mejor UX
- [ ] Información contextual
- [ ] Fallbacks para errores

### ✅ Performance
- [ ] Rate limiting considerado
- [ ] Mensajes batched cuando sea posible
- [ ] Timeouts configurados
- [ ] Retry logic implementada

### ✅ Seguridad
- [ ] Tokens no hardcodeados
- [ ] Validación de entrada
- [ ] Canales privados protegidos
- [ ] Logs de auditoría

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Bot de Cumpleaños
Crea un workflow que:
1. Revise una base de datos de empleados
2. Identifique cumpleaños del día
3. Envíe felicitaciones personalizadas
4. Incluya GIF o imagen festiva

### Ejercicio 2: Sistema de Alertas
Crea un sistema que:
1. Monitoree métricas de sistema
2. Envíe alertas según gravedad
3. Incluya botones de acción
4. Escale a diferentes canales

### Ejercicio 3: Reporte Interactivo
Crea un workflow que:
1. Genere reportes de ventas
2. Permita seleccionar período
3. Incluya gráficos como imágenes
4. Envíe a stakeholders relevantes

---

**💡 Recuerda:** Slack es excelente para mantener a tu equipo informado automáticamente. Usa mensajes ricos, canales apropiados y siempre considera el contexto del receptor para crear notificaciones útiles y no molestas.
