# Workflows Avanzados y Patrones

## Introducción a los Patrones de Workflow

Los **patrones de workflow** son **metodologías probadas** que han sido desarrolladas y perfeccionadas por la comunidad. Estos patrones proporcionan estructuras base para crear workflows más eficientes, mantenibles y confiables.

### Concepto Técnico
Los patrones de workflow ofrecen:
- **Estructuras reutilizables**: Soluciones probadas para problemas comunes
- **Mejores prácticas**: Técnicas optimizadas para casos específicos
- **Escalabilidad**: Fundamentos para workflows complejos

## Patrones Fundamentales

### 1. **Patrón de Procesamiento en Lotes**
Procesar múltiples elementos de manera eficiente, como lavar todos los platos juntos en lugar de uno por uno.

**Cuándo usar:**
- Tienes muchos elementos similares para procesar
- Quieres optimizar el rendimiento
- Necesitas mantener el orden de procesamiento

**Ejemplo básico:**
```
Start → HTTP Request (obtener lista) → Code (procesar lote) → End
```

### 2. **Patrón de Retry con Exponential Backoff** 🔄
Intentar de nuevo cuando algo falla, pero esperando más tiempo entre cada intento.

**Cuándo usar:**
- APIs que a veces fallan temporalmente
- Conexiones de red inestables
- Servicios con límites de velocidad

**Ejemplo básico:**
```
Start → HTTP Request → If (¿falló?) → Wait → HTTP Request (retry)
```

### 3. **Patrón de Fan-Out/Fan-In**
Dividir trabajo en múltiples rutas paralelas y luego combinar los resultados.

**Cuándo usar:**
- Procesar datos en paralelo
- Obtener información de múltiples fuentes
- Optimizar tiempos de ejecución

**Ejemplo básico:**
```
Start → Split → [API1, API2, API3] → Merge → Process → End
```

### 4. **Patrón de Estado y Workflow** 📊
Mantener un estado entre diferentes ejecuciones del workflow.

**Cuándo usar:**
- Procesos que requieren continuidad
- Workflows que procesan datos incrementalmente
- Sistemas que necesitan recordar el progreso

### 5. **Patrón de Transformación de Datos** 🔄
Convertir datos de un formato a otro de manera estructurada.

**Cuándo usar:**
- Integrar sistemas diferentes
- Limpiar y validar datos
- Adaptar formatos de API

## Patrones por Categoría

### 🔄 Patrones de Control de Flujo

#### **Patrón Condicional Múltiple**
```
Start → Get Data → Switch:
├── Case 1: Urgente → Slack → Email
├── Case 2: Normal → Email
└── Default: Log → End
```

#### **Patrón de Bucle Controlado**
```
Start → Initialize → Loop:
├── Process Item
├── Check Condition
└── Continue/Break → End
```

### 🌐 Patrones de Integración

#### **Patrón de Webhook + Procesamiento**
```
Webhook → Validate → Transform → Multiple Outputs:
├── Database → Log
├── Notification → User
└── Analytics → Dashboard
```

#### **Patrón de Sincronización Bidireccional**
```
System A ↔ Transform ↔ System B
    ↓         ↓         ↓
  Log A   Conflicts   Log B
```

### 📊 Patrones de Manejo de Datos

#### **Patrón de Agregación**
```
Multiple Sources → Collect → Aggregate → Report:
├── Sum/Count → Dashboard
├── Average → Alerts
└── Min/Max → Monitoring
```

#### **Patrón de Validación y Limpieza**
```
Raw Data → Validate → Clean → Enrich → Store:
├── Valid → Process → Success
└── Invalid → Error Handler → Retry/Discard
```

### 🚨 Patrones de Manejo de Errores

#### **Patrón de Circuit Breaker**
```
Start → Check Health → If (Service OK):
├── YES → Process → Success
└── NO → Fallback → Alternative Service
```

#### **Patrón de Dead Letter Queue**
```
Process → If (Error) → Retry → If (Still Error) → Dead Letter → Manual Review
```

## 🛠️ Implementación de Patrones

### 1. **Patrón de Procesamiento en Lotes**

#### Configuración:
```javascript
// En nodo Code
const BATCH_SIZE = 100;
const batches = [];

// Dividir items en lotes
for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
}

// Procesar cada lote
return batches.map((batch, index) => ({
    json: {
        batchNumber: index + 1,
        items: batch.map(item => item.json),
        size: batch.length
    }
}));
```

#### Workflow Structure:
```
Start → Get Data → Code (Create Batches) → HTTP Request (Process Batch) → Merge Results → End
```

### 2. **Patrón de Retry con Exponential Backoff**

#### Configuración:
```javascript
// En nodo Code
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 segundo

const processWithRetry = async (data, retryCount = 0) => {
    try {
        // Intentar procesar
        const result = await processData(data);
        return { success: true, data: result };
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            const delay = BASE_DELAY * Math.pow(2, retryCount);
            await new Promise(resolve => setTimeout(resolve, delay));
            return processWithRetry(data, retryCount + 1);
        }
        return { success: false, error: error.message };
    }
};
```

### 3. **Patrón de Fan-Out/Fan-In**

#### Configuración Fan-Out:
```javascript
// Nodo Code - Dividir trabajo
const tasks = items[0].json.urls.map((url, index) => ({
    json: {
        taskId: index,
        url: url,
        priority: index < 3 ? 'high' : 'normal'
    }
}));

return tasks;
```

#### Configuración Fan-In:
```javascript
// Nodo Code - Combinar resultados
const results = items.map(item => item.json);
const combined = {
    totalTasks: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results: results,
    completedAt: new Date().toISOString()
};

return [{ json: combined }];
```

## Mejores Prácticas por Patrón

### 📊 Patrones de Datos

#### **Validación Robusta**
```javascript
// Siempre validar antes de procesar
const validateData = (data) => {
    const errors = [];
    
    if (!data.id) errors.push('ID requerido');
    if (!data.email || !isValidEmail(data.email)) errors.push('Email inválido');
    if (!data.timestamp) errors.push('Timestamp requerido');
    
    return { valid: errors.length === 0, errors };
};
```

#### **Transformación Segura**
```javascript
// Manejar datos faltantes o incorrectos
const safeTransform = (data) => {
    return {
        id: data.id || generateId(),
        name: data.name?.trim() || 'Sin nombre',
        email: data.email?.toLowerCase() || null,
        age: parseInt(data.age) || 0,
        createdAt: new Date().toISOString()
    };
};
```

### 🔄 Patrones de Control

#### **Condiciones Claras**
```javascript
// En nodo IF - Usar condiciones claras
const priority = $json.priority;
const isUrgent = priority === 'high' || priority === 'urgent';
const isBusinessHours = new Date().getHours() >= 9 && new Date().getHours() < 17;

return isUrgent && isBusinessHours;
```

#### **Loops Seguros**
```javascript
// Evitar loops infinitos
const MAX_ITERATIONS = 1000;
let iterations = 0;

while (hasMoreData() && iterations < MAX_ITERATIONS) {
    processData();
    iterations++;
}

if (iterations >= MAX_ITERATIONS) {
    throw new Error('Loop límite alcanzado');
}
```

### 🌐 Patrones de Integración

#### **Manejo de Rate Limits**
```javascript
// Respetar límites de API
const RATE_LIMIT = 100; // requests per minute
const DELAY_BETWEEN_REQUESTS = 60000 / RATE_LIMIT; // 600ms

// Implementar delay automático
await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
```

#### **Timeouts Apropiados**
```javascript
// Configurar timeouts realistas
const timeout = {
    fast: 5000,    // 5 segundos para APIs rápidas
    normal: 30000, // 30 segundos para procesamiento normal
    slow: 120000   // 2 minutos para procesos lentos
};
```

## 🎨 Patrones de Arquitectura

### 1. **Arquitectura por Capas**
```
┌─────────────────┐
│  Presentation   │ ← Webhooks, Triggers
├─────────────────┤
│   Business      │ ← Logic, Transformations
├─────────────────┤
│   Data Access   │ ← Database, APIs
├─────────────────┤
│   Integration   │ ← External Services
└─────────────────┘
```

### 2. **Arquitectura de Microservicios**
```
User Request → Gateway → Service A → Database A
                    ├─→ Service B → Database B
                    └─→ Service C → External API
```

### 3. **Arquitectura Basada en Eventos**
```
Event Source → Event Router → [Handler 1, Handler 2, Handler 3] → Event Store
```

## 📋 Checklist de Implementación

### ✅ Antes de Implementar
- [ ] Identificar el patrón apropiado
- [ ] Definir casos de uso específicos
- [ ] Planificar manejo de errores
- [ ] Establecer métricas de éxito

### ✅ Durante la Implementación
- [ ] Seguir nomenclatura consistente
- [ ] Documentar decisiones importantes
- [ ] Implementar logging apropiado
- [ ] Configurar monitoreo

### ✅ Después de la Implementación
- [ ] Probar escenarios de error
- [ ] Validar performance
- [ ] Documentar para el equipo
- [ ] Planificar mantenimiento

## 🎓 Ejercicios Prácticos

### Ejercicio 1: Implementar Patrón de Retry
Crea un workflow que:
1. Intente conectar a una API
2. Si falla, espere 1 segundo y reintente
3. Si falla otra vez, espere 2 segundos
4. Si falla una tercera vez, espere 4 segundos
5. Después de 3 intentos, envíe una notificación de error

### Ejercicio 2: Patrón Fan-Out/Fan-In
Crea un workflow que:
1. Reciba una lista de URLs
2. Haga peticiones paralelas a todas
3. Combine los resultados en un reporte
4. Envíe el reporte por email

### Ejercicio 3: Patrón de Validación
Crea un workflow que:
1. Reciba datos de usuarios
2. Valide cada campo
3. Separe válidos de inválidos
4. Procese válidos y notifique inválidos

---

**Recuerda:** Los patrones son herramientas, no reglas absolutas. Adapta cada patrón a tus necesidades específicas y siempre considera la mantenibilidad y escalabilidad de tu solución.
