# Manejo de Datos y Expresiones en n8n

## Procesamiento y Transformación de Datos

Esta sección documenta técnicas avanzadas para el procesamiento y transformación de datos en n8n.

## 1. Manipulación de Datos

### 1.1 Transformación de Objetos
```typescript
// Servicio de transformación de datos
class DataTransformer {
    static transformObject(data: any, schema: TransformationSchema): any {
        return Object.entries(schema).reduce((acc, [key, transform]) => ({
            ...acc,
            [key]: typeof transform === 'function' 
                ? transform(data)
                : data[transform]
        }), {});
    }
    
    static flattenObject(obj: any, prefix = ''): any {
        return Object.keys(obj).reduce((acc, key) => {
            const prop = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof prop === 'object' && prop !== null) {
                return { ...acc, ...this.flattenObject(prop, newKey) };
            }
            
            return { ...acc, [newKey]: prop };
        }, {});
    }
}
```

### 1.2 Validación de Datos
```typescript
// Esquemas de validación con Joi
const dataSchema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    metadata: Joi.object().unknown(true)
});

// Función de validación
async function validateData(data: any): Promise<ValidationResult> {
    try {
        await dataSchema.validateAsync(data);
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            errors: error.details.map((d: any) => d.message)
        };
    }
}
```

## 2. Expresiones n8n

### 2.1 Expresiones de Fecha
```typescript
class DateExpressions {
    static formatDate(date: Date, format: string): string {
        return moment(date).format(format);
    }
    
    static calculateDateDiff(date1: Date, date2: Date, unit: moment.DurationInputArg2): number {
        return moment(date1).diff(date2, unit);
    }
    
    static addToDate(date: Date, amount: number, unit: moment.DurationInputArg2): Date {
        return moment(date).add(amount, unit).toDate();
    }
}
```

### 2.2 Expresiones de Texto
```typescript
class StringExpressions {
    static interpolate(template: string, data: any): string {
        return template.replace(/\${(.*?)}/g, (match, key) => {
            return get(data, key, '');
        });
    }
    
    static splitAndTrim(text: string, separator: string): string[] {
        return text.split(separator).map(s => s.trim()).filter(Boolean);
    }
}
```

## 3. Procesamiento de Arrays

### 3.1 Array Operations
```typescript
class ArrayProcessor {
    static chunk<T>(array: T[], size: number): T[][] {
        return array.reduce((acc, item, i) => {
            const chunkIndex = Math.floor(i / size);
            if (!acc[chunkIndex]) acc[chunkIndex] = [];
            acc[chunkIndex].push(item);
            return acc;
        }, [] as T[][]);
    }
    
    static uniqueBy<T>(array: T[], key: keyof T): T[] {
        return Array.from(
            new Map(array.map(item => [item[key], item])).values()
        );
    }
    
    static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
        return array.reduce((acc, item) => {
            const groupKey = String(item[key]);
            if (!acc[groupKey]) acc[groupKey] = [];
            acc[groupKey].push(item);
            return acc;
        }, {} as Record<string, T[]>);
    }
}
```

## 4. JSON Processing

### 4.1 JSON Transform
```typescript
class JsonTransformer {
    static transform(data: any, mapping: object): any {
        const result: any = {};
        
        for (const [key, path] of Object.entries(mapping)) {
            result[key] = get(data, path as string);
        }
        
        return result;
    }
    
    static merge(objects: any[]): any {
        return objects.reduce((acc, obj) => {
            return mergeWith(acc, obj, (objValue, srcValue) => {
                if (Array.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            });
        }, {});
    }
}
```

## 5. Procesamiento en Lotes

### 5.1 Batch Processing
```typescript
class BatchProcessor {
    private readonly batchSize: number;
    private readonly processingFn: (items: any[]) => Promise<any[]>;
    
    constructor(batchSize: number, processingFn: (items: any[]) => Promise<any[]>) {
        this.batchSize = batchSize;
        this.processingFn = processingFn;
    }
    
    async processBatches(items: any[]): Promise<any[]> {
        const batches = ArrayProcessor.chunk(items, this.batchSize);
        const results = [];
        
        for (const batch of batches) {
            const batchResults = await this.processingFn(batch);
            results.push(...batchResults);
        }
        
        return results;
    }
}
```

## 6. Error Handling

### 6.1 Error Management
```typescript
class ErrorHandler {
    static handleProcessingError(error: Error, item: any): ProcessingResult {
        return {
            success: false,
            error: {
                message: error.message,
                stack: error.stack,
                item: item
            }
        };
    }
    
    static async retryOperation<T>(
        operation: () => Promise<T>,
        retries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.retryOperation(operation, retries - 1, delay * 2);
        }
    }
}
```

## Referencias

- [n8n Expressions Documentation](https://docs.n8n.io/code-examples/expressions/)
- [Data Processing Guide](https://docs.n8n.io/data/)
- [Error Handling Best Practices](https://docs.n8n.io/hosting/reliability/)
