# Antipatrón: Nodo Code Monolítico

## Descripción del Problema

El antipatrón de Nodo Code Monolítico ocurre cuando se implementa lógica de negocio compleja en un único nodo Code, resultando en código difícil de mantener, probar y depurar.

## Impacto Técnico

1. **Problemas de Mantenibilidad**
   - Código difícil de entender
   - Alta complejidad ciclomática
   - Dificultad para realizar cambios

2. **Dificultades de Testing**
   - Imposibilidad de pruebas unitarias
   - Cobertura de código limitada
   - Dificultad para simular escenarios

## Ejemplo del Antipatrón

```typescript
// Antipatrón: Nodo Code monolítico
async function processData(items: IDataObject[]): Promise<IDataObject[]> {
    const results = [];
    
    for (const item of items) {
        // Validación
        if (!item.id || !item.data) {
            throw new Error('Invalid data');
        }
        
        // Transformación
        const transformed = {
            id: item.id,
            processedData: doComplexTransformation(item.data),
            metadata: {
                timestamp: new Date(),
                status: 'processed'
            }
        };
        
        // Enriquecimiento
        const enriched = await enrichData(transformed);
        
        // Validación de negocio
        if (!isValidBusinessRules(enriched)) {
            throw new Error('Business validation failed');
        }
        
        // Cálculos
        const calculated = performComplexCalculations(enriched);
        
        // Formato final
        results.push(formatOutput(calculated));
    }
    
    return results;
}
```

## Solución: Arquitectura Modular

### 1. Separación de Responsabilidades
```typescript
// 1. Interfaces claras
interface DataValidator {
    validate(data: IDataObject): boolean;
}

interface DataTransformer {
    transform(data: IDataObject): IDataObject;
}

interface DataEnricher {
    enrich(data: IDataObject): Promise<IDataObject>;
}

// 2. Implementaciones modulares
class InputValidator implements DataValidator {
    validate(data: IDataObject): boolean {
        return Boolean(data.id && data.data);
    }
}

class BusinessRuleValidator implements DataValidator {
    validate(data: IDataObject): boolean {
        // Implementar reglas de negocio específicas
        return this.validateBusinessRules(data);
    }
    
    private validateBusinessRules(data: IDataObject): boolean {
        // Implementación de reglas de negocio
        return true;
    }
}
```

### 2. Implementación en n8n
```typescript
// Nodos separados por responsabilidad
class ValidationNode implements INodeType {
    async execute(items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
        const validator = new InputValidator();
        return items.filter(item => validator.validate(item.json));
    }
}

class TransformationNode implements INodeType {
    async execute(items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
        const transformer = new DataTransformer();
        return items.map(item => ({
            json: transformer.transform(item.json)
        }));
    }
}

class EnrichmentNode implements INodeType {
    async execute(items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
        const enricher = new DataEnricher();
        return Promise.all(
            items.map(async item => ({
                json: await enricher.enrich(item.json)
            }))
        );
    }
}
```

## Patrones de Diseño Recomendados

### 1. Chain of Responsibility
```typescript
abstract class DataProcessor {
    protected next: DataProcessor | null = null;
    
    setNext(processor: DataProcessor): DataProcessor {
        this.next = processor;
        return processor;
    }
    
    async process(data: IDataObject): Promise<IDataObject> {
        const processed = await this.doProcess(data);
        if (this.next) {
            return this.next.process(processed);
        }
        return processed;
    }
    
    protected abstract doProcess(data: IDataObject): Promise<IDataObject>;
}
```

### 2. Factory Method
```typescript
class ProcessorFactory {
    static createProcessor(type: string): DataProcessor {
        switch (type) {
            case 'validation':
                return new ValidationProcessor();
            case 'transformation':
                return new TransformationProcessor();
            case 'enrichment':
                return new EnrichmentProcessor();
            default:
                throw new Error(`Unknown processor type: ${type}`);
        }
    }
}
```

## Mejores Prácticas

1. **Separación de Responsabilidades**
   - Un nodo, una responsabilidad
   - Interfaces claras y cohesivas
   - Dependencias explícitas

2. **Testing**
```typescript
describe('DataProcessor', () => {
    let validator: InputValidator;
    let transformer: DataTransformer;
    
    beforeEach(() => {
        validator = new InputValidator();
        transformer = new DataTransformer();
    });
    
    test('should validate input correctly', () => {
        const input = { id: '1', data: 'test' };
        expect(validator.validate(input)).toBe(true);
    });
    
    test('should transform data correctly', () => {
        const input = { id: '1', data: 'test' };
        const result = transformer.transform(input);
        expect(result).toHaveProperty('processedData');
    });
});
```

3. **Monitorización**
```typescript
class ProcessingMetrics {
    private metrics: Map<string, {
        count: number;
        errors: number;
        duration: number[];
    }>;
    
    trackProcessing(type: string, duration: number, success: boolean): void {
        const metric = this.metrics.get(type) || {
            count: 0,
            errors: 0,
            duration: []
        };
        
        metric.count++;
        if (!success) metric.errors++;
        metric.duration.push(duration);
        
        this.metrics.set(type, metric);
    }
    
    getMetrics(): Record<string, {
        avgDuration: number;
        errorRate: number;
        totalCount: number;
    }> {
        const result: Record<string, any> = {};
        
        for (const [type, metric] of this.metrics.entries()) {
            result[type] = {
                avgDuration: average(metric.duration),
                errorRate: metric.errors / metric.count,
                totalCount: metric.count
            };
        }
        
        return result;
    }
}
```

## Referencias

- [Clean Code Principles](https://docs.n8n.io/workflows/best-practices/)
- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [Testing Best Practices](https://docs.n8n.io/hosting/testing/)
