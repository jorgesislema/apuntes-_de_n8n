# Anatomía de un Nodo Personalizado

## Introducción

Un nodo personalizado en n8n es un módulo TypeScript que implementa interfaces específicas para integrarse perfectamente con el ecosistema de n8n.

**Ejemplo:** Es como crear un adaptador especializado que traduce entre n8n y un servicio específico, siguiendo un protocolo estándar que n8n puede entender y ejecutar.

## Estructura de Archivos

### Estructura Básica:
```
mi-nodo-personalizado/
├── package.json              # Configuración del paquete npm
├── tsconfig.json            # Configuración de TypeScript
├── nodes/                   # Directorio de nodos
│   ├── MiNodo/
│   │   ├── MiNodo.node.ts   # Lógica principal del nodo
│   │   ├── MiNodo.node.json # Metadatos del nodo
│   │   └── mi-nodo.svg      # Icono del nodo
│   └── index.ts             # Exportador de nodos
├── credentials/             # Directorio de credenciales
│   ├── MiCredencial.credentials.ts
│   └── index.ts
└── dist/                    # Archivos compilados
```

## Interfaces Principales

### INodeType - Interfaz del Nodo:
```typescript
import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  INodeExecutionData,
  INodePropertyOptions,
} from 'n8n-workflow';

export class MiNodo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Mi Nodo Personalizado',
    name: 'miNodo',
    group: ['transform'],
    version: 1,
    description: 'Descripción de lo que hace el nodo',
    defaults: {
      name: 'Mi Nodo',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // Configuración del nodo
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Lógica de ejecución
  }
}
```

### INodeTypeDescription - Descripción del Nodo:
```typescript
const description: INodeTypeDescription = {
  displayName: 'Mi API Personalizada',
  name: 'miApiPersonalizada',
  icon: 'file:mi-api.svg',
  group: ['input'],
  version: 1,
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  description: 'Interactúa con Mi API personalizada',
  defaults: {
    name: 'Mi API',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
    {
      name: 'miApiCredentials',
      required: true,
    },
  ],
  properties: [
    // Propiedades del nodo
  ],
};
```

## Propiedades del Nodo

### Tipos de Propiedades Comunes:

#### 1. String Input:
```typescript
{
  displayName: 'Endpoint URL',
  name: 'url',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'https://api.example.com/endpoint',
  description: 'URL del endpoint de la API',
}
```

#### 2. Options (Dropdown):
```typescript
{
  displayName: 'Operación',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  options: [
    {
      name: 'Obtener Usuario',
      value: 'getUser',
      description: 'Obtiene información de un usuario',
    },
    {
      name: 'Crear Usuario',
      value: 'createUser',
      description: 'Crea un nuevo usuario',
    },
  ],
  default: 'getUser',
}
```

#### 3. Collection (Grupo de Propiedades):
```typescript
{
  displayName: 'Opciones Adicionales',
  name: 'additionalOptions',
  type: 'collection',
  placeholder: 'Agregar Opción',
  default: {},
  options: [
    {
      displayName: 'Timeout',
      name: 'timeout',
      type: 'number',
      default: 30000,
      description: 'Timeout en milisegundos',
    },
    {
      displayName: 'Reintentos',
      name: 'retries',
      type: 'number',
      default: 3,
      description: 'Número de reintentos en caso de fallo',
    },
  ],
}
```

#### 4. Propiedades Condicionales:
```typescript
{
  displayName: 'ID del Usuario',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      operation: ['getUser', 'updateUser', 'deleteUser'],
    },
  },
  default: '',
  description: 'ID único del usuario',
}
```

## Función Execute

### Estructura Básica:
```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      // Obtener parámetros del nodo
      const operation = this.getNodeParameter('operation', i) as string;
      
      // Obtener credenciales
      const credentials = await this.getCredentials('miApiCredentials');
      
      // Procesar según la operación
      let responseData;
      
      if (operation === 'getUser') {
        const userId = this.getNodeParameter('userId', i) as string;
        responseData = await this.obtenerUsuario(userId, credentials);
      } else if (operation === 'createUser') {
        const userData = this.getNodeParameter('userData', i) as object;
        responseData = await this.crearUsuario(userData, credentials);
      }
      
      // Agregar resultado
      returnData.push({
        json: responseData,
        pairedItem: { item: i },
      });
      
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
        continue;
      }
      throw error;
    }
  }

  return [returnData];
}
```

### Métodos Auxiliares:
```typescript
private async obtenerUsuario(userId: string, credentials: any): Promise<any> {
  const options = {
    method: 'GET',
    url: `https://api.example.com/users/${userId}`,
    headers: {
      'Authorization': `Bearer ${credentials.apiToken}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await this.helpers.request(options);
    return response;
  } catch (error) {
    throw new Error(`Error al obtener usuario: ${error.message}`);
  }
}

private async crearUsuario(userData: any, credentials: any): Promise<any> {
  const options = {
    method: 'POST',
    url: 'https://api.example.com/users',
    headers: {
      'Authorization': `Bearer ${credentials.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  };

  try {
    const response = await this.helpers.request(options);
    return response;
  } catch (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
}
```

## Manejo de Credenciales

### Definición de Credenciales:
```typescript
// credentials/MiApiCredentials.credentials.ts
import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MiApiCredentials implements ICredentialType {
  name = 'miApiCredentials';
  displayName = 'Mi API Credentials';
  documentationUrl = 'https://docs.miapi.com/authentication';
  
  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Token de API obtenido de tu cuenta',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.example.com',
      description: 'URL base de la API',
    },
  ];
}
```

## Validación y Manejo de Errores

### Validación de Entrada:
```typescript
// Validar parámetros requeridos
private validateParameters(parameters: any): void {
  if (!parameters.userId) {
    throw new Error('El ID de usuario es requerido');
  }
  
  if (!parameters.email || !this.isValidEmail(parameters.email)) {
    throw new Error('Email válido es requerido');
  }
}

private isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Manejo de Errores HTTP:
```typescript
private async makeApiRequest(options: any): Promise<any> {
  try {
    const response = await this.helpers.request(options);
    return response;
  } catch (error) {
    // Manejar diferentes tipos de errores HTTP
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      switch (status) {
        case 401:
          throw new Error('Credenciales inválidas. Verifica tu API token.');
        case 403:
          throw new Error('Acceso denegado. Verifica tus permisos.');
        case 404:
          throw new Error('Recurso no encontrado.');
        case 429:
          throw new Error('Rate limit excedido. Intenta nuevamente más tarde.');
        default:
          throw new Error(`Error de API (${status}): ${message}`);
      }
    }
    
    throw new Error(`Error de conexión: ${error.message}`);
  }
}
```

## Testing del Nodo

### Test Básico:
```typescript
// test/MiNodo.test.ts
import { IExecuteFunctions } from 'n8n-workflow';
import { MiNodo } from '../nodes/MiNodo/MiNodo.node';

describe('MiNodo', () => {
  let nodo: MiNodo;
  let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

  beforeEach(() => {
    nodo = new MiNodo();
    mockExecuteFunctions = {
      getInputData: jest.fn(),
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn(),
      helpers: {
        request: jest.fn(),
      },
      continueOnFail: jest.fn().mockReturnValue(false),
    } as any;
  });

  it('debe procesar usuarios correctamente', async () => {
    // Configurar mocks
    mockExecuteFunctions.getInputData.mockReturnValue([{ json: {} }]);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getUser');
    mockExecuteFunctions.getCredentials.mockResolvedValue({ apiToken: 'test-token' });
    mockExecuteFunctions.helpers.request.mockResolvedValue({ id: 1, name: 'Test User' });

    // Ejecutar
    const result = await nodo.execute.call(mockExecuteFunctions);

    // Verificar
    expect(result[0]).toHaveLength(1);
    expect(result[0][0].json).toEqual({ id: 1, name: 'Test User' });
  });
});
```

## Package.json para Nodo

### Configuración Completa:
```json
{
  "name": "n8n-nodes-mi-nodo",
  "version": "1.0.0",
  "description": "Nodo personalizado para n8n",
  "keywords": [
    "n8n-community-node-package"
  ],
  "license": "MIT",
  "homepage": "https://github.com/usuario/n8n-nodes-mi-nodo",
  "author": {
    "name": "Tu Nombre",
    "email": "tu.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/usuario/n8n-nodes-mi-nodo.git"
  },
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier nodes credentials --write",
    "lint": "eslint nodes credentials package.json",
    "lintfix": "eslint nodes credentials package.json --fix",
    "prepublishOnly": "npm run build && npm run lint -s"
  },
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/MiApiCredentials.credentials.js"
    ],
    "nodes": [
      "dist/nodes/MiNodo/MiNodo.node.js"
    ]
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^18.15.0",
    "@typescript-eslint/parser": "^5.57.0",
    "eslint": "^8.37.0",
    "gulp": "^4.0.2",
    "jest": "^29.5.0",
    "n8n-workflow": "^1.0.0",
    "prettier": "^2.8.7",
    "typescript": "^5.0.2"
  },
  "peerDependencies": {
    "n8n-workflow": "*"
  }
}
```

## Mejores Prácticas

### 1. Nomenclatura:
- **Clases:** PascalCase (`MiNodoPersonalizado`)
- **Archivos:** kebab-case (`mi-nodo-personalizado`)
- **Propiedades:** camelCase (`miPropiedad`)

### 2. Documentación:
- Describe claramente qué hace cada propiedad
- Incluye ejemplos en las descripciones
- Documenta los tipos de datos esperados

### 3. Performance:
- Usa `this.helpers.request()` para llamadas HTTP
- Implementa timeout apropiados
- Maneja rate limiting

### 4. Seguridad:
- Nunca hardcodees credenciales
- Usa el sistema de credenciales de n8n
- Valida todas las entradas

## Próximos Pasos

1. Revisa el [Ejemplo Nodo Comunidad](../ejemplo-nodo-comunidad/)
2. Implementa tu primer nodo personalizado
3. Publica en npm siguiendo las guías oficiales
4. Contribuye al [ecosistema de n8n](../../../COMMUNITY.md)

---

**Recuerda:** Un nodo bien diseñado es reutilizable, testeable y sigue las convenciones de n8n. Invierte tiempo en la estructura inicial para facilitar el mantenimiento futuro. 🏗️
