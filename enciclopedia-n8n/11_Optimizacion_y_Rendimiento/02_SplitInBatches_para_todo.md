# Optimización mediante SplitInBatches

## Procesamiento por Lotes en n8n

Este documento detalla las estrategias y mejores prácticas para el procesamiento eficiente de grandes conjuntos de datos mediante el nodo SplitInBatches.

## 1. Fundamentos de Procesamiento por Lotes

### 1.1 Configuración de Lotes
```typescript
interface BatchConfig {
    batchSize: number;
    options: {
        parallelProcessing: boolean;
        retryOnFail: boolean;
        maxRetries: number;
    };
}

class BatchProcessor {
    private config: BatchConfig;
    
    constructor(config: BatchConfig) {
        this.config = {
            batchSize: config.batchSize || 100,
            options: {
                parallelProcessing: config.options?.parallelProcessing || false,
                retryOnFail: config.options?.retryOnFail || true,
                maxRetries: config.options?.maxRetries || 3
            }
        };
    }
    
    async processBatches<T>(items: T[]): Promise<ProcessingResult[]> {
        const batches = this.createBatches(items);
        const results = [];
        
        if (this.config.options.parallelProcessing) {
            results.push(...await this.processParallel(batches));
        } else {
            results.push(...await this.processSequential(batches));
        }
        
        return results;
    }
}
```

### 1.2 Estrategias de Procesamiento

1. **Procesamiento Secuencial**
   - Control preciso del orden de ejecución
   - Menor consumo de recursos
   - Ideal para operaciones dependientes

2. **Procesamiento Paralelo**
   - Mayor rendimiento en operaciones independientes
   - Mejor utilización de recursos disponibles
   - Requiere control de concurrencia

## 2. Implementación Práctica

### 2.1 Configuración del Nodo
```typescript
interface SplitInBatchesConfig {
    batchSize: number;
    options: {
        reset: boolean;
        continue: boolean;
    };
}

// Ejemplo de configuración
const config: SplitInBatchesConfig = {
    batchSize: 100,
    options: {
        reset: true,     // Reiniciar contador para cada ejecución
        continue: false  // Detener en caso de error
    }
};
```

### 2.2 Manejo de Errores
```typescript
class BatchErrorHandler {
    static async handleError(error: Error, batch: any[]): Promise<void> {
        // Logging detallado
        console.error('Error processing batch:', {
            batchSize: batch.length,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        // Reintentar con backoff exponencial
        for (let i = 0; i < 3; i++) {
            try {
                await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
                await processBatch(batch);
                return;
            } catch (retryError) {
                console.error(`Retry ${i + 1} failed`);
            }
        }
        
        // Si todos los reintentos fallan
        throw new Error('Batch processing failed after retries');
    }
}
```

## 3. Optimización de Rendimiento

### 3.1 Ajuste Dinámico de Lotes
```typescript
class DynamicBatchSizer {
    private baseSize: number;
    private metrics: {
        successRate: number[];
        processingTimes: number[];
    };
    
    constructor(initialSize: number = 100) {
        this.baseSize = initialSize;
        this.metrics = {
            successRate: [],
            processingTimes: []
        };
    }
    
    updateMetrics(success: boolean, duration: number): void {
        this.metrics.successRate.push(success ? 1 : 0);
        this.metrics.processingTimes.push(duration);
        
        // Mantener ventana de métricas
        if (this.metrics.successRate.length > 10) {
            this.metrics.successRate.shift();
            this.metrics.processingTimes.shift();
        }
    }
    
    calculateOptimalSize(): number {
        const avgSuccessRate = average(this.metrics.successRate);
        const avgProcessingTime = average(this.metrics.processingTimes);
        
        if (avgSuccessRate > 0.9 && avgProcessingTime < 1000) {
            return this.baseSize * 1.2;
        } else if (avgSuccessRate < 0.7) {
            return this.baseSize * 0.8;
        }
        
        return this.baseSize;
    }
}
```

### 3.2 Monitorización
```typescript
interface BatchMetrics {
    processedItems: number;
    failedItems: number;
    avgProcessingTime: number;
    memoryUsage: number;
}

class BatchMonitor {
    private metrics: BatchMetrics;
    
    constructor() {
        this.metrics = {
            processedItems: 0,
            failedItems: 0,
            avgProcessingTime: 0,
            memoryUsage: 0
        };
    }
    
    trackBatch(success: boolean, duration: number): void {
        // Actualizar métricas
        this.metrics.avgProcessingTime = 
            (this.metrics.avgProcessingTime * this.metrics.processedItems + duration) /
            (this.metrics.processedItems + 1);
            
        if (success) {
            this.metrics.processedItems++;
        } else {
            this.metrics.failedItems++;
        }
        
        this.metrics.memoryUsage = process.memoryUsage().heapUsed;
    }
    
    getMetrics(): BatchMetrics {
        return { ...this.metrics };
    }
}
```

## 4. Casos de Uso

### 4.1 Procesamiento de APIs con Rate Limits
```typescript
class RateLimitedBatchProcessor {
    private rateLimit: number;
    private windowMs: number;
    private requestCount: number;
    private windowStart: number;
    
    constructor(rateLimit: number, windowMs: number) {
        this.rateLimit = rateLimit;
        this.windowMs = windowMs;
        this.requestCount = 0;
        this.windowStart = Date.now();
    }
    
    async processBatch(items: any[]): Promise<void> {
        const now = Date.now();
        if (now - this.windowStart >= this.windowMs) {
            this.requestCount = 0;
            this.windowStart = now;
        }
        
        if (this.requestCount >= this.rateLimit) {
            const waitTime = this.windowMs - (now - this.windowStart);
            await new Promise(r => setTimeout(r, waitTime));
        }
        
        this.requestCount++;
        // Procesar batch
    }
}
```

## 5. Mejores Prácticas

1. **Tamaño de Lotes**
   - Comenzar con tamaños conservadores (50-100)
   - Ajustar según rendimiento observado
   - Considerar límites de APIs y memoria

2. **Manejo de Errores**
   - Implementar retry con backoff
   - Logging detallado de errores
   - Mantener estado de progreso

3. **Monitorización**
   - Trackear métricas clave
   - Alertar sobre anomalías
   - Ajustar configuración según métricas

## Referencias

- [n8n SplitInBatches Documentation](https://docs.n8n.io/nodes/n8n-nodes-base.splitInBatches/)
- [Rate Limiting Best Practices](https://docs.n8n.io/workflows/best-practices/)
- [Error Handling Guide](https://docs.n8n.io/workflows/error-handling/)
