# Guía de Contribución

## Proceso de Contribución al Proyecto

Este documento describe los estándares técnicos y procesos para contribuir a la documentación y recursos de n8n.

## 1. Estándares de Código

### 1.1 Formato de Código
```typescript
// Configuración de ESLint
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always']
    }
};

// Configuración de Prettier
module.exports = {
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5'
};
```

### 1.2 Convenciones de Nombrado
```typescript
// Nombres de Clases: PascalCase
class DataTransformer {
    // Propiedades privadas: camelCase con _
    private _config: Configuration;
    
    // Métodos públicos: camelCase
    public transformData(): void {
        // Implementación
    }
}

// Interfaces: PascalCase con I prefijo
interface INodeConfig {
    name: string;
    type: string;
}

// Enums: PascalCase
enum HttpMethod {
    GET = 'GET',
    POST = 'POST'
}

// Constantes: SNAKE_CASE mayúsculas
const MAX_RETRY_ATTEMPTS = 3;
```

## 2. Proceso de Pull Request

### 2.1 Checklist de PR
```markdown
- [ ] Código sigue los estándares establecidos
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Changelog actualizado
- [ ] Revisión de seguridad completada
```

### 2.2 Estructura de Commits
```bash
# Formato de commit
<tipo>(<alcance>): <descripción>

# Tipos válidos:
# feat: Nueva característica
# fix: Corrección de bug
# docs: Cambios en documentación
# style: Cambios de formato
# refactor: Refactorización de código
# test: Adición/modificación de tests
# chore: Cambios en build/tools

# Ejemplo:
feat(nodos): implementar nuevo nodo HTTP con retry
```

## 3. Testing

### 3.1 Unit Tests
```typescript
describe('DataTransformer', () => {
    let transformer: DataTransformer;
    
    beforeEach(() => {
        transformer = new DataTransformer();
    });
    
    test('should transform data correctly', () => {
        const input = { raw: 'data' };
        const expected = { processed: 'data' };
        
        expect(transformer.transform(input)).toEqual(expected);
    });
});
```

### 3.2 Integration Tests
```typescript
describe('NodeIntegration', () => {
    test('should integrate with external service', async () => {
        const node = new ExternalServiceNode();
        const result = await node.execute();
        
        expect(result).toMatchSchema(responseSchema);
    });
});
```

## 4. Documentación

### 4.1 Documentación de Código
```typescript
/**
 * Procesa datos según la configuración especificada.
 * 
 * @param {INodeExecutionData[]} items - Items a procesar
 * @param {ProcessingOptions} options - Opciones de procesamiento
 * @returns {Promise<INodeExecutionData[]>} Items procesados
 * @throws {ProcessingError} Si ocurre un error durante el procesamiento
 * 
 * @example
 * const processor = new DataProcessor();
 * const result = await processor.process(items, {
 *     batch: true,
 *     maxRetries: 3
 * });
 */
async process(
    items: INodeExecutionData[],
    options: ProcessingOptions
): Promise<INodeExecutionData[]> {
    // Implementación
}
```

### 4.2 README Template
```markdown
# Nombre del Componente

## Descripción
Descripción técnica detallada del componente.

## Instalación
```bash
npm install @n8n/component
```

## Uso
```typescript
import { Component } from '@n8n/component';

const component = new Component();
await component.initialize();
```

## API
Documentación detallada de la API.

## Tests
```bash
npm run test
```

## Contribución
Instrucciones para contribuir.
```

## 5. Seguridad

### 5.1 Revisión de Seguridad
```typescript
interface SecurityChecklist {
    inputValidation: boolean;
    authentication: boolean;
    authorization: boolean;
    dataEncryption: boolean;
    secureComms: boolean;
    errorHandling: boolean;
    logging: boolean;
}

class SecurityReview {
    static validatePR(checklist: SecurityChecklist): boolean {
        return Object.values(checklist).every(check => check);
    }
}
```

## Referencias

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Jest Testing Framework](https://jestjs.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)
