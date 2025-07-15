# Nodos Esenciales y Flujo en n8n

## Introducción

Los nodos esenciales son como las herramientas básicas que todo carpintero necesita: martillo, destornillador, sierra. En n8n, estos nodos son los bloques fundamentales que usarás en casi todos tus workflows.

## ¿Qué son los Nodos Esenciales?

**Concepto:** Son los nodos más importantes que debes dominar para crear workflows efectivos.

**Ejemplo:** Es como aprender los componentes fundamentales de un sistema. Una vez que los conoces, puedes crear configuraciones complejas y construir soluciones sofisticadas.

## Categorías de Nodos Esenciales

### 1. Nodos Trigger (Disparadores)
**Función:** Inician tu workflow cuando algo específico sucede.

#### Nodos incluidos:
- **Start** - Inicio manual
- **Manual Trigger** - Disparador manual con datos
- **Cron** - Programación temporal
- **Webhook** - Recibe datos externos

### 2. Nodos de Control de Flujo
**Función:** Controlan cómo se mueven los datos a través de tu workflow.

#### Nodos incluidos:
- **If** - Toma decisiones
- **Switch** - Múltiples rutas
- **Merge** - Combina datos
- **Set** - Modifica datos

### 3. Nodos de Comunicación
**Función:** Envían y reciben información de servicios externos.

#### Nodos incluidos:
- **HTTP Request** - Llamadas a APIs
- **Email** - Envío de correos
- **Slack** - Mensajería
- **Webhook** - Recibe datos

## Workflow Básico Ejemplo

```
Start → HTTP Request → If → Email
                       ↓
                   Slack Message
```

**Explicación:** 
1. **Start:** Iniciamos manualmente
2. **HTTP Request:** Obtenemos datos del clima
3. **If:** ¿Va a llover?
4. **Email/Slack:** Enviamos alerta dependiendo del resultado

## Archivos de Práctica

En esta carpeta encontrarás workflows JSON que puedes importar directamente en n8n:

1. **[01_Start.json](./01_Start.json)** - Workflow básico con nodo Start
2. **[02_Manual_Trigger.json](./02_Manual_Trigger.json)** - Usando Manual Trigger
3. **[03_Cron.json](./03_Cron.json)** - Programación temporal
4. **[04_If.json](./04_If.json)** - Toma de decisiones
5. **[05_Switch.json](./05_Switch.json)** - Múltiples rutas
6. **[06_Merge.json](./06_Merge.json)** - Combinando datos
7. **[07_HttpRequest.md](./07_HttpRequest.md)** - Guía completa de HTTP Request

## Cómo Usar los Ejemplos

### 1. Importar un Workflow
```
1. Abre n8n
2. Clic en "New Workflow"
3. Clic en los tres puntos (...)
4. Selecciona "Import from file"
5. Elige el archivo JSON
6. ¡Listo para usar!
```

### 2. Ejecutar un Workflow
```
1. Haz clic en "Execute Workflow"
2. Observa cómo se ejecuta cada nodo
3. Revisa los datos en cada paso
4. Modifica configuraciones y vuelve a ejecutar
```

## Patrones Comunes

### 1. Patrón de Validación
```
Trigger → Validar Datos → If → Procesar → Notificar
```

### 2. Patrón de Transformación
```
Trigger → Obtener Datos → Transformar → Guardar → Confirmar
```

### 3. Patrón de Monitoreo
```
Cron → Verificar Estado → Switch → Alertas por Canal
```

## Consejos para Principiantes

### 1. Empieza Simple
- Usa solo 2-3 nodos por workflow
- Prueba cada nodo individualmente
- Añade complejidad gradualmente

### 2. Usa Nombres Descriptivos
❌ **Malo:** "HTTP Request"
✅ **Bueno:** "Obtener Datos del Cliente"

### 3. Agrega Comentarios
```
Usa el campo "Notes" para explicar:
- Qué hace cada nodo
- Por qué lo configuraste así
- Datos importantes para recordar
```

### 4. Prueba Frecuentemente
- Ejecuta después de cada cambio
- Verifica que los datos fluyan correctamente
- Revisa los mensajes de error

## Ejercicios de Práctica

### Ejercicio 1: Mi Primera Automatización
**Objetivo:** Crear un workflow que envíe un email diario con el clima.

**Pasos:**
1. Usa Cron para ejecutar diariamente
2. HTTP Request para obtener datos del clima
3. Set para formatear el mensaje
4. Email para enviar el reporte

### Ejercicio 2: Procesador de Formularios
**Objetivo:** Procesar datos de un formulario web.

**Pasos:**
1. Webhook para recibir datos del formulario
2. If para validar campos requeridos
3. Switch para categorizar por tipo de consulta
4. Email diferente según la categoría

### Ejercicio 3: Monitor de Salud
**Objetivo:** Verificar que un sitio web esté funcionando.

**Pasos:**
1. Cron para ejecutar cada 5 minutos
2. HTTP Request para hacer ping al sitio
3. If para verificar el estado
4. Slack para alertar si hay problemas

## Errores Comunes y Soluciones

### Error: "Node failed to execute"
**Causa:** Configuración incorrecta del nodo
**Solución:** Revisa todos los campos requeridos

### Error: "Authentication failed"
**Causa:** Credenciales incorrectas o expiradas
**Solución:** Verifica y actualiza las credenciales

### Error: "Timeout"
**Causa:** El nodo tardó demasiado en responder
**Solución:** Aumenta el timeout o verifica la conexión

## Próximos Pasos

1. Practica con cada archivo JSON incluido
2. Modifica los ejemplos para tus necesidades
3. Combina diferentes nodos para crear workflows más complejos
4. Aprende sobre [Manejo de Datos](../02_Manejo_de_Datos_y_Expresiones/)

---

**Recuerda:** Dominar estos nodos esenciales es como aprender a tocar las notas básicas en un piano. Una vez que las domines, podrás crear sinfonías increíbles de automatización. ¡Practica con cada ejemplo hasta que se vuelva natural! 🎵
