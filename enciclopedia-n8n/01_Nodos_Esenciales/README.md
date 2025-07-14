# Nodos Esenciales en n8n

## Implementación y Uso de Nodos Core

Esta sección documenta los nodos fundamentales de n8n y sus patrones de implementación.

## 1. Nodos de Procesamiento

### 1.1 Function Node
```typescript
interface INodeExecutionData {
    json: IDataObject;
    binary?: IBinaryData;
}

// Implementación de función de procesamiento
function processData(items: INodeExecutionData[]): INodeExecutionData[] {
    return items.map(item => ({
        json: {
            ...item.json,
            processed: true,
            timestamp: new Date().toISOString()
        }
    }));
}
```

### 1.2 Switch Node
```typescript
interface SwitchCondition {
    field: string;
    operation: 'equals' | 'notEquals' | 'contains' | 'regex';
    value: any;
}

class SwitchRouter {
    private conditions: SwitchCondition[];
    
    constructor(conditions: SwitchCondition[]) {
        this.conditions = conditions;
    }
    
    route(item: IDataObject): number {
        for (let i = 0; i < this.conditions.length; i++) {
            const condition = this.conditions[i];
            if (this.evaluateCondition(item, condition)) {
                return i;
            }
        }
        return -1; // Default output
    }
    
    private evaluateCondition(item: IDataObject, condition: SwitchCondition): boolean {
        const value = get(item, condition.field);
        
        switch (condition.operation) {
            case 'equals':
                return value === condition.value;
            case 'notEquals':
                return value !== condition.value;
            case 'contains':
                return String(value).includes(String(condition.value));
            case 'regex':
                return new RegExp(condition.value).test(String(value));
            default:
                return false;
        }
    }
}
```

## 2. Nodos HTTP

### 2.1 HTTP Request Node
```typescript
interface HttpRequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    body?: any;
    authentication?: {
        type: 'basic' | 'bearer' | 'oauth2';
        credentials: any;
    };
}

class HttpClient {
    async request(config: HttpRequestConfig): Promise<INodeExecutionData> {
        try {
            const response = await axios({
                method: config.method,
                url: config.url,
                headers: this.prepareHeaders(config),
                data: config.body
            });
            
            return {
                json: {
                    statusCode: response.status,
                    headers: response.headers,
                    data: response.data
                }
            };
        } catch (error) {
            throw new Error(`HTTP Request failed: ${error.message}`);
        }
    }
    
    private prepareHeaders(config: HttpRequestConfig): Record<string, string> {
        const headers = { ...config.headers };
        
        if (config.authentication) {
            switch (config.authentication.type) {
                case 'basic':
                    headers['Authorization'] = 'Basic ' + Buffer.from(
                        `${config.authentication.credentials.username}:${config.authentication.credentials.password}`
                    ).toString('base64');
                    break;
                case 'bearer':
                    headers['Authorization'] = `Bearer ${config.authentication.credentials.token}`;
                    break;
            }
        }
        
        return headers;
    }
}
```

## 3. Nodos de Datos

### 3.1 CSV Node
```typescript
interface CsvOptions {
    delimiter: string;
    hasHeader: boolean;
    columns?: string[];
}

class CsvProcessor {
    static parse(csvData: string, options: CsvOptions): INodeExecutionData[] {
        const lines = csvData.split('\n').filter(Boolean);
        const delimiter = options.delimiter;
        
        let columns = options.columns;
        let startIndex = 0;
        
        if (options.hasHeader && !columns) {
            columns = lines[0].split(delimiter);
            startIndex = 1;
        }
        
        return lines.slice(startIndex).map(line => {
            const values = line.split(delimiter);
            const json: IDataObject = {};
            
            columns?.forEach((column, index) => {
                json[column] = values[index];
            });
            
            return { json };
        });
    }
    
    static stringify(items: INodeExecutionData[], options: CsvOptions): string {
        const lines: string[] = [];
        const columns = options.columns ?? Object.keys(items[0].json);
        
        if (options.hasHeader) {
            lines.push(columns.join(options.delimiter));
        }
        
        items.forEach(item => {
            const values = columns.map(column => item.json[column]);
            lines.push(values.join(options.delimiter));
        });
        
        return lines.join('\n');
    }
}
```

## 4. Nodos de Control de Flujo

### 4.1 IF Node
```typescript
interface IfCondition {
    field: string;
    operation: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
    value: any;
}

class ConditionalRouter {
    static evaluateCondition(item: IDataObject, condition: IfCondition): boolean {
        const value = get(item, condition.field);
        
        switch (condition.operation) {
            case 'equals':
                return value === condition.value;
            case 'notEquals':
                return value !== condition.value;
            case 'greaterThan':
                return value > condition.value;
            case 'lessThan':
                return value < condition.value;
            default:
                return false;
        }
    }
    
    static route(items: INodeExecutionData[], condition: IfCondition): {
        true: INodeExecutionData[];
        false: INodeExecutionData[];
    } {
        return items.reduce((acc, item) => {
            const result = this.evaluateCondition(item.json, condition);
            acc[result ? 'true' : 'false'].push(item);
            return acc;
        }, { true: [], false: [] } as Record<string, INodeExecutionData[]>);
    }
}
```

## 5. Nodos de Transformación

### 5.1 Set Node
```typescript
interface SetOperation {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    value: any;
}

class DataTransformer {
    static transform(items: INodeExecutionData[], operations: SetOperation[]): INodeExecutionData[] {
        return items.map(item => ({
            json: operations.reduce((acc, operation) => {
                set(acc, operation.field, this.convertValue(operation.value, operation.type));
                return acc;
            }, { ...item.json })
        }));
    }
    
    private static convertValue(value: any, type: string): any {
        switch (type) {
            case 'string':
                return String(value);
            case 'number':
                return Number(value);
            case 'boolean':
                return Boolean(value);
            case 'array':
                return Array.isArray(value) ? value : [value];
            case 'object':
                return typeof value === 'object' ? value : {};
            default:
                return value;
        }
    }
}
```

## Referencias

- [Nodos Core Documentation](https://docs.n8n.io/nodes/core-nodes/)
- [Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
- [Flow Control Best Practices](https://docs.n8n.io/workflows/flow-logic/)
