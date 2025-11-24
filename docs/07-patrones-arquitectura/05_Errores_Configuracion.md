# Errores de Configuración en n8n

## Introducción

La configuración correcta de nodos y workflows en n8n es crucial para su funcionamiento confiable. Este documento detalla los errores de configuración más comunes y proporciona guías para su corrección.

## 1. Configuración Incorrecta de Nodos

### Descripción
Errores en la configuración de parámetros, opciones y comportamiento de los nodos que llevan a resultados inesperados.

### Impacto Técnico
- Fallos en ejecución
- Resultados incorrectos
- Pérdida de datos
- Comportamiento impredecible

### Solución
```javascript
// Configuración de nodo HTTP Request
const httpNodeConfig = {
  authentication: 'genericCredentialType',
  requestMethod: 'POST',
  url: '={{$env.API_BASE_URL}}/endpoint',
  options: {
    timeout: 5000,
    ignoreSSLIssues: false,
    redirect: {
      follow: true,
      maxRedirects: 3
    },
    proxy: {
      enabled: false,
      configuration: {
        protocol: 'http',
        host: '',
        port: 8080,
        auth: {
          username: '',
          password: ''
        }
      }
    }
  },
  headerParameters: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Validación de configuración
function validateNodeConfig(config) {
  const requiredFields = ['url', 'requestMethod'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (config.options?.timeout < 1000) {
    throw new Error('Timeout must be at least 1000ms');
  }
}
```

## 2. Manejo de Errores Ausente

### Descripción
Falta de implementación de manejo de errores y recuperación en puntos críticos del workflow.

### Impacto Técnico
- Fallos silenciosos
- Pérdida de contexto de error
- Dificultad en debugging
- Inestabilidad del sistema

### Solución
```javascript
// Implementación de error handling robusto
class WorkflowError extends Error {
  constructor(message, metadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends WorkflowError {}
class APIError extends WorkflowError {}
class ProcessingError extends WorkflowError {}

// Handler centralizado de errores
async function errorHandler(error, context) {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    workflowId: $workflow.id,
    executionId: $execution.id,
    nodeId: context.nodeId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      metadata: error.metadata
    }
  };

  // Log estructurado
  console.error(JSON.stringify(errorInfo));

  // Notificación según severidad
  if (error instanceof APIError) {
    await notifyTeam('api-errors', errorInfo);
  }

  // Recuperación según tipo
  if (error instanceof ValidationError) {
    return await handleValidationError(error);
  }

  throw error; // Re-throw si no se puede manejar
}
```

## 3. Validación de Datos Deficiente

### Descripción
Falta de validación adecuada de datos de entrada y salida en los nodos del workflow.

### Impacto Técnico
- Corrupción de datos
- Errores en cascada
- Inconsistencia en resultados
- Vulnerabilidades de seguridad

### Solución
```javascript
// Implementación de validación robusta
class DataValidator {
  static schemas = {
    user: {
      type: 'object',
      required: ['id', 'email', 'role'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['user', 'admin'] }
      }
    },
    
    transaction: {
      type: 'object',
      required: ['amount', 'currency', 'date'],
      properties: {
        amount: { type: 'number', minimum: 0 },
        currency: { type: 'string', pattern: '^[A-Z]{3}$' },
        date: { type: 'string', format: 'date-time' }
      }
    }
  };

  static async validate(data, schemaName) {
    const schema = this.schemas[schemaName];
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }

    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid) {
      throw new ValidationError(
        'Data validation failed',
        { errors: validate.errors }
      );
    }
    
    return data;
  }
}

// Uso en nodo
try {
  const validatedUser = await DataValidator.validate(
    inputData.json,
    'user'
  );
  // Procesar datos validados
} catch (error) {
  await errorHandler(error, { nodeId: 'UserProcessor' });
}
```

## Mejores Prácticas

1. **Configuración de Nodos**
   - Documentar todos los parámetros
   - Validar valores de configuración
   - Usar variables de entorno
   
2. **Error Handling**
   - Implementar manejo centralizado
   - Categorizar errores apropiadamente
   - Mantener contexto de error
   
3. **Validación de Datos**
   - Validar inputs y outputs
   - Usar esquemas de validación
   - Implementar sanitización

## Herramientas y Recursos

### Testing
- Jest para unit testing
- Schema validation tools
- API mocking

### Monitoreo
- Error tracking systems
- Log aggregation
- Performance monitoring

## Referencias

1. [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
2. [Error Handling Patterns](https://www.joyent.com/node-js/production/design/errors)
3. [Data Validation Best Practices](https://json-schema.org/learn/miscellaneous-examples.html)
