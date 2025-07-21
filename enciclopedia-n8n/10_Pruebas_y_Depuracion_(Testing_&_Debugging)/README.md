# Testing y Depuración en n8n

## Introducción

El testing y la depuración son procesos críticos en el desarrollo y mantenimiento de flujos de trabajo en n8n. Este capítulo presenta metodologías sistemáticas, herramientas especializadas y mejores prácticas para asegurar la calidad, confiabilidad y rendimiento óptimo de las automatizaciones.

## Fundamentos del Testing

La implementación de una estrategia robusta de testing es esencial para:

### Objetivos Fundamentales:

1. **Aseguramiento de Calidad**
   - Validación de lógica de negocio
   - Verificación de integridad de datos
   - Cumplimiento de requisitos funcionales
   - Documentación técnica automatizada
   - Prevención de regresiones

2. **Metodologías de Testing**
   - **Unit Testing**: Validación granular de nodos y componentes
   - **Integration Testing**: Verificación de interacciones entre módulos
   - **End-to-End Testing**: Validación de flujos completos
   - **Performance Testing**: Análisis de rendimiento y escalabilidad
   - **Security Testing**: Evaluación de vulnerabilidades y cumplimiento

## Estructura del Contenido

### 1. [El Panel de Depuración](./01_El_Panel_de_Depuracion.md)
- Análisis de estructuras de datos
- Inspección de ejecución
- Técnicas de validación
- Optimización del proceso de debugging

### 2. [Estrategias de Testing](./02_Estrategias_de_Testing.md)
- Metodologías de testing
- Automatización de pruebas
- Patrones de implementación
- Gestión de casos de prueba

### 3. [Herramientas Avanzadas de Depuración](./03_Herramientas_Avanzadas_Depuracion.md)
- Técnicas de logging estructurado
- Análisis de rendimiento
- Debugging remoto
- Integración con APM

## Implementación Práctica

### 1. Metodología de Testing
```typescript
// Ejemplo de estructura de test
interface TestCase {
  description: string;
  input: {
    node: string;
    data: any;
  };
  expected: {
    output: any;
    status: string;
  };
  validation: (result: any) => boolean;
}
```

### 2. Integración Continua
- Pipeline de testing automatizado
- Validación de calidad de código
- Métricas de cobertura
- Análisis estático

### 3. Monitoreo y Análisis
- Telemetría de ejecución
- Análisis de rendimiento
- Tracking de errores
- Métricas operacionales

## Mejores Prácticas y Patrones

### 1. Arquitectura de Testing
- Diseño modular de pruebas
- Separación de concerns
- Reutilización de componentes
- Patrones de validación

### 2. Estrategias de Implementación
```typescript
// Ejemplo de patrón de testing
class WorkflowTestSuite {
  private context: TestContext;
  
  async setup() {
    // Configuración del entorno
  }
  
  async execute() {
    // Ejecución de casos de prueba
  }
  
  async validate() {
    // Validación de resultados
  }
  
  async teardown() {
    // Limpieza de recursos
  }
}
```

### 3. Gestión de Calidad
- Métricas de calidad
- Análisis de cobertura
- Documentación técnica
- Revisión de código

## Recursos Técnicos

1. **Documentación Oficial**
   - [n8n Testing Guide](https://docs.n8n.io/workflows/testing/)
   - [Debugging Reference](https://docs.n8n.io/reference/debugging/)
   - [Performance Best Practices](https://docs.n8n.io/reference/performance/)

2. **Herramientas Recomendadas**
   - APM Solutions
   - Testing Frameworks
   - Debugging Tools
   - Monitoring Platforms

3. **Referencias Adicionales**
   - Patrones de automatización
   - Guías de implementación
   - Casos de estudio
   - Mejores prácticas de la industria

### Browser DevTools:
- **Network Tab** - Monitorear llamadas HTTP
- **Console** - Ver logs y errores
- **Elements** - Inspeccionar DOM
- **Performance** - Analizar rendimiento

### Logging Avanzado:
```javascript
// Logging personalizado en Code node
const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
  },
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, data);
    }
  }
};

// Uso
logger.info('Processing user data', { userId: $json.id });
```

## Testing de Workflows

### Preparación de Datos de Prueba:
```javascript
// Generar datos de prueba
const testData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ],
  orders: [
    { id: 1001, userId: 1, amount: 99.99, status: 'pending' },
    { id: 1002, userId: 2, amount: 149.50, status: 'completed' }
  ]
};

return testData.users.map(user => ({ json: user }));
```

### Validación de Resultados:
```javascript
// Función de validación
function validateOutput(items, expectedSchema) {
  const errors = [];
  
  items.forEach((item, index) => {
    const data = item.json;
    
    // Verificar campos requeridos
    Object.keys(expectedSchema).forEach(field => {
      if (expectedSchema[field].required && !data[field]) {
        errors.push(`Item ${index}: Missing required field '${field}'`);
      }
      
      // Verificar tipo de datos
      if (data[field] && typeof data[field] !== expectedSchema[field].type) {
        errors.push(`Item ${index}: Field '${field}' has wrong type`);
      }
    });
  });
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }
  
  return items;
}

// Esquema de ejemplo
const userSchema = {
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  email: { type: 'string', required: true }
};

return validateOutput(items, userSchema);
```

## Debugging Común

### Problemas Frecuentes:

#### 1. Datos Vacíos:
```javascript
// Verificar si hay datos
if (!items || items.length === 0) {
  throw new Error('No input data received');
}

// Verificar estructura de datos
items.forEach((item, index) => {
  if (!item.json) {
    throw new Error(`Item ${index} has no json property`);
  }
});
```

#### 2. Errores de API:
```javascript
// Manejo robusto de errores de API
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }
  
  return await response.json();
} catch (error) {
  // Log detallado del error
  console.error('API Request failed:', {
    url,
    options,
    error: error.message,
    timestamp: new Date().toISOString()
  });
  
  throw error;
}
```

#### 3. Problemas de Formato:
```javascript
// Validar y formatear datos
function formatData(data) {
  return {
    id: parseInt(data.id),
    name: String(data.name || '').trim(),
    email: String(data.email || '').toLowerCase(),
    createdAt: new Date(data.createdAt).toISOString()
  };
}

// Aplicar formateo con validación
const formattedItems = items.map(item => {
  try {
    return { json: formatData(item.json) };
  } catch (error) {
    throw new Error(`Format error for item: ${JSON.stringify(item.json)}`);
  }
});
```

## Monitoreo en Producción

### Health Checks:
```javascript
// Health check personalizado
const healthCheck = {
  timestamp: new Date().toISOString(),
  status: 'healthy',
  checks: {}
};

// Verificar conexión a base de datos
try {
  await checkDatabase();
  healthCheck.checks.database = 'ok';
} catch (error) {
  healthCheck.status = 'unhealthy';
  healthCheck.checks.database = 'failed';
}

// Verificar APIs externas
try {
  await checkExternalAPIs();
  healthCheck.checks.externalAPIs = 'ok';
} catch (error) {
  healthCheck.status = 'unhealthy';
  healthCheck.checks.externalAPIs = 'failed';
}

return [{ json: healthCheck }];
```

### Métricas de Performance:
```javascript
// Medir tiempo de ejecución
const startTime = Date.now();

// Tu lógica aquí
const result = await processData(items);

const endTime = Date.now();
const executionTime = endTime - startTime;

// Log de métricas
console.log(`Execution metrics:`, {
  executionTime: `${executionTime}ms`,
  itemsProcessed: items.length,
  itemsPerSecond: Math.round(items.length / (executionTime / 1000))
});

return result;
```

## Testing de Integraciones

### Mock Services:
```javascript
// Mock de servicio externo
const mockAPIResponse = {
  users: [
    { id: 1, name: 'Test User 1' },
    { id: 2, name: 'Test User 2' }
  ]
};

// Usar mock en desarrollo
if (process.env.NODE_ENV === 'development') {
  return mockAPIResponse.users.map(user => ({ json: user }));
}

// Llamada real en producción
const response = await fetch('https://api.example.com/users');
return await response.json();
```

### Validación de APIs:
```javascript
// Validar respuesta de API
function validateAPIResponse(response, expectedFields) {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format');
  }
  
  expectedFields.forEach(field => {
    if (!(field in response)) {
      throw new Error(`Missing field '${field}' in API response`);
    }
  });
  
  return response;
}

// Uso
const apiResponse = await fetch(url).then(r => r.json());
const validatedResponse = validateAPIResponse(apiResponse, ['id', 'name', 'email']);
```

## Mejores Prácticas

### 1. Testing:
- Escribe tests antes de implementar
- Cubre casos edge y de error
- Usa datos de prueba realistas
- Automatiza testing repetitivo

### 2. Debugging:
- Usa logging estructurado
- Captura contexto relevante
- Implementa error boundaries
- Documenta soluciones encontradas

### 3. Monitoreo:
- Implementa health checks
- Monitorea métricas clave
- Configura alertas apropiadas
- Revisa logs regularmente

### 4. Mantenimiento:
- Mantén tests actualizados
- Refactoriza código regularmente
- Documenta cambios importantes
- Revisa performance periódicamente

## Checklist de Testing

### Pre-Producción:
- [ ] Workflow funciona con datos de prueba
- [ ] Manejo de errores implementado
- [ ] Validación de datos configurada
- [ ] Logging apropiado agregado
- [ ] Performance acceptable
- [ ] Seguridad validada

### Post-Producción:
- [ ] Monitoreo configurado
- [ ] Alertas establecidas
- [ ] Backup y recovery testeado
- [ ] Documentación actualizada
- [ ] Team training completado

## Herramientas Recomendadas

### Testing:
- **Jest** - Unit testing
- **Postman** - API testing
- **Newman** - Automated API testing
- **Cypress** - E2E testing

### Monitoring:
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **ELK Stack** - Logging
- **Sentry** - Error tracking

### Debugging:
- **ngrok** - Webhook testing
- **Webhook.site** - Request inspection
- **JSONLint** - JSON validation
- **Curl** - API testing

## Próximos Pasos

1. Implementa [Estrategias de Testing](./01_Estrategias_Testing.md)
2. Configura [Herramientas de Depuración](./02_Herramientas_Depuracion.md)
3. Practica [Testing de Workflows](./03_Testing_Workflows.md)
4. Estudia [Optimización y Rendimiento](../11_Optimizacion_y_Rendimiento/)

---

**Recuerda:** El testing y debugging no son opcionales en producción. Invertir tiempo en estas prácticas desde el principio te ahorrará horas de problemas más adelante. 🧪
