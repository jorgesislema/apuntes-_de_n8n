# Gestión de Memoria en n8n

## Fundamentos de Gestión de Memoria

La gestión eficiente de memoria es crucial para el rendimiento y la estabilidad de n8n, especialmente en entornos de producción con alta carga de workflows.

## Variables de Entorno para Gestión de Memoria

### EXECUTIONS_DATA_PRUNE
```bash
# Configuración de limpieza de datos de ejecución
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=48      # Horas de retención
EXECUTIONS_DATA_PRUNE_TIMEOUT=3600  # Intervalo de limpieza en segundos
```

Esta configuración permite:
- Eliminar automáticamente datos de ejecuciones antiguas
- Prevenir el crecimiento descontrolado de la base de datos
- Optimizar el uso de memoria del sistema

## Estrategias de Optimización de Memoria

### 1. Gestión de Datos en Workflows
```typescript
// Implementación de limpieza de datos en memoria
function cleanWorkflowData(data: INodeExecutionData[]): INodeExecutionData[] {
    return data.map(item => ({
        json: {
            // Seleccionar solo los campos necesarios
            id: item.json.id,
            status: item.json.status
            // Omitir datos innecesarios
        }
    }));
}
```

### 2. Procesamiento por Lotes
```typescript
// Procesamiento eficiente de grandes conjuntos de datos
async function processBatch(items: any[], batchSize: number): Promise<void> {
    const batches = chunk(items, batchSize);
    
    for (const batch of batches) {
        await processItems(batch);
        // Liberar memoria después de cada lote
        global.gc();
    }
}
```

### 3. Monitorización de Memoria

```typescript
interface MemoryMetrics {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
}

function getMemoryUsage(): MemoryMetrics {
    const usage = process.memoryUsage();
    return {
        heapUsed: usage.heapUsed / 1024 / 1024,  // MB
        heapTotal: usage.heapTotal / 1024 / 1024, // MB
        external: usage.external / 1024 / 1024,    // MB
        rss: usage.rss / 1024 / 1024              // MB
    };
}
```

## Configuraciones Recomendadas

### 1. Para Entornos de Desarrollo
```bash
# Configuración para desarrollo
NODE_OPTIONS="--max-old-space-size=1024"  # 1GB heap
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=24                # 24 horas
```

### 2. Para Producción
```bash
# Configuración para producción
NODE_OPTIONS="--max-old-space-size=4096"  # 4GB heap
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=72                # 72 horas
EXECUTIONS_DATA_PRUNE_TIMEOUT=7200        # Limpieza cada 2 horas
```

## Mejores Prácticas

1. **Monitorización Continua**
   - Implementar alertas de uso de memoria
   - Monitorear tendencias de crecimiento
   - Identificar workflows con alto consumo

2. **Optimización de Datos**
   - Filtrar datos innecesarios temprano en el workflow
   - Utilizar transformaciones eficientes
   - Implementar limpieza periódica de datos

3. **Gestión de Caché**
   ```typescript
   class CacheManager {
       private static instance: CacheManager;
       private cache: Map<string, {
           data: any,
           timestamp: number
       }>;
       
       private constructor() {
           this.cache = new Map();
       }
       
       static getInstance(): CacheManager {
           if (!CacheManager.instance) {
               CacheManager.instance = new CacheManager();
           }
           return CacheManager.instance;
       }
       
       set(key: string, value: any, ttl: number): void {
           this.cache.set(key, {
               data: value,
               timestamp: Date.now() + ttl
           });
       }
       
       get(key: string): any {
           const item = this.cache.get(key);
           if (!item) return null;
           
           if (Date.now() > item.timestamp) {
               this.cache.delete(key);
               return null;
           }
           
           return item.data;
       }
       
       cleanup(): void {
           const now = Date.now();
           for (const [key, value] of this.cache.entries()) {
               if (now > value.timestamp) {
                   this.cache.delete(key);
               }
           }
       }
   }
   ```

## Troubleshooting

### Problemas Comunes y Soluciones

1. **Memory Leaks**
   ```typescript
   // Detección de memory leaks
   const heapDiff = require('heapdump');
   
   function detectMemoryLeaks(): void {
       const baseline = process.memoryUsage().heapUsed;
       // Ejecutar operaciones
       const current = process.memoryUsage().heapUsed;
       
       if ((current - baseline) / baseline > 0.2) { // 20% incremento
           heapDiff.writeSnapshot(`./heap-${Date.now()}.heapsnapshot`);
       }
   }
   ```

2. **Alta Latencia**
   - Implementar timeout en operaciones
   - Utilizar streaming para grandes conjuntos de datos
   - Optimizar consultas a base de datos

## Referencias

- [Node.js Memory Management](https://nodejs.org/api/process.html#process_process_memoryusage)
- [n8n Performance Guide](https://docs.n8n.io/hosting/performance/)
- [Memory Profiling Tools](https://nodejs.org/en/docs/guides/diagnostics/memory/)
