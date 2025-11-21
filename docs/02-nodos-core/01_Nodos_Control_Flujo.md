# Nodos de Control de Flujo

## Descripción Técnica

Los nodos de control de flujo son componentes fundamentales en n8n que permiten implementar lógica condicional, bifurcaciones y patrones de enrutamiento complejos en los workflows.

## 1. IF Node

### 1.1 Configuración Técnica
```typescript
interface IFCondition {
  value1: {
    type: 'expression' | 'value';
    value: any;
  };
  operation: {
    type: string;
    operation: string;
  };
  value2: {
    type: 'expression' | 'value';
    value: any;
  };
}

interface IFNodeConfiguration {
  conditions: IFCondition[];
  combination: 'any' | 'all';
  dataMode: 'pairs' | 'separate';
}
```

### 1.2 Patrones de Implementación

#### 1.2.1 Validación de Datos
```javascript
// Ejemplo: Validación de estructura de datos
{
  "conditions": [
    {
      "value1": "{{ $json.data.type }}",
      "operation": "equals",
      "value2": "valid_type"
    },
    {
      "value1": "{{ $json.data.status }}",
      "operation": "notEquals",
      "value2": "error"
    }
  ],
  "combination": "all"
}
```

#### 1.2.2 Enrutamiento Condicional
```javascript
// Ejemplo: Enrutamiento basado en valor
{
  "conditions": [
    {
      "value1": "{{ $json.priority }}",
      "operation": "equals",
      "value2": "high"
    }
  ],
  "combination": "any"
}
```

## 2. Switch Node

### 2.1 Configuración Técnica
```typescript
interface SwitchRule {
  conditions: Array<{
    value1: string;
    operation: string;
    value2: any;
  }>;
  output: number;
}

interface SwitchNodeConfiguration {
  mode: 'single' | 'multiple';
  rules: SwitchRule[];
  fallbackOutput: number;
  options: {
    passBinaryData: boolean;
  };
}
```

### 2.2 Patrones de Uso

#### 2.2.1 Clasificación de Datos
```javascript
// Ejemplo: Clasificación por categoría
{
  "rules": [
    {
      "conditions": [
        {
          "value1": "{{ $json.category }}",
          "operation": "equals",
          "value2": "urgent"
        }
      ],
      "output": 0
    },
    {
      "conditions": [
        {
          "value1": "{{ $json.category }}",
          "operation": "equals",
          "value2": "normal"
        }
      ],
      "output": 1
    }
  ],
  "fallbackOutput": 2
}
```

#### 2.2.2 Procesamiento Multi-ruta
```javascript
// Ejemplo: Distribución por tipo
{
  "rules": [
    {
      "conditions": [
        {
          "value1": "{{ $json.type }}",
          "operation": "equals",
          "value2": "email"
        }
      ],
      "output": 0
    },
    {
      "conditions": [
        {
          "value1": "{{ $json.type }}",
          "operation": "equals",
          "value2": "sms"
        }
      ],
      "output": 1
    }
  ],
  "fallbackOutput": 2
}
```

## 3. Merge Node

### 3.1 Configuración Técnica
```typescript
interface MergeNodeConfiguration {
  mode: 'combine' | 'multiplex' | 'pass-through';
  mergeByFields: {
    [key: string]: string;
  };
  options: {
    joinIntoArray: boolean;
    outputDataFrom: 'input1' | 'input2' | 'both';
  };
}
```

### 3.2 Estrategias de Combinación

#### 3.2.1 Combinación Simple
```javascript
// Ejemplo: Unión de datos
{
  "mode": "combine",
  "options": {
    "joinIntoArray": true,
    "outputDataFrom": "both"
  }
}
```

#### 3.2.2 Combinación por Campo
```javascript
// Ejemplo: Merge por ID
{
  "mode": "multiplex",
  "mergeByFields": {
    "id": "id"
  },
  "options": {
    "outputDataFrom": "both"
  }
}
```

## 4. Split Node

### 4.1 Configuración Técnica
```typescript
interface SplitNodeConfiguration {
  type: 'value' | 'regex' | 'expression';
  value: string;
  options: {
    includeEmpty: boolean;
    limit: number;
  };
}
```

### 4.2 Patrones de División

#### 4.2.1 División por Valor
```javascript
// Ejemplo: Split por delimitador
{
  "type": "value",
  "value": ",",
  "options": {
    "includeEmpty": false
  }
}
```

#### 4.2.2 División por Expresión
```javascript
// Ejemplo: Split por expresión
{
  "type": "expression",
  "value": "{{ $json.data }}",
  "options": {
    "limit": 10
  }
}
```

## Mejores Prácticas

### 1. Diseño de Flujos
- Modularización de lógica
- Manejo de casos borde
- Documentación clara
- Testing exhaustivo

### 2. Optimización
- Control de flujo eficiente
- Minimización de branches
- Gestión de memoria
- Monitoreo de performance

### 3. Manejo de Errores
- Validación de inputs
- Fallback paths
- Logging estructurado
- Recuperación de errores

## Referencias

1. [Documentación de Control de Flujo](https://docs.n8n.io/nodes/core-nodes/if/)
2. [Patrones de Diseño en n8n](https://docs.n8n.io/workflows/best-practices/)
3. [Optimización de Workflows](https://docs.n8n.io/workflows/)
