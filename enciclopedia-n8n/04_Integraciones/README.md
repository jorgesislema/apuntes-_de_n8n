# Integraciones Clave en n8n

## Implementación de Integraciones Empresariales

Este documento proporciona guías técnicas detalladas para implementar integraciones comunes en entornos empresariales.

## 1. Integraciones con APIs REST

### 1.1 Autenticación OAuth2
```typescript
interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    authUrl: string;
    tokenUrl: string;
    scope: string[];
}

class OAuth2Client {
    private config: OAuth2Config;
    private tokens: {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
    };
    
    constructor(config: OAuth2Config) {
        this.config = config;
    }
    
    async authenticate(): Promise<void> {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            response_type: 'code',
            scope: this.config.scope.join(' ')
        });
        
        const authUrl = `${this.config.authUrl}?${params.toString()}`;
        // Implementar flujo de autorización
    }
    
    async refreshAccessToken(): Promise<void> {
        // Implementar refresh token
    }
}
```

### 1.2 Rate Limiting
```typescript
class RateLimiter {
    private readonly queue: Array<() => Promise<any>>;
    private readonly requestsPerSecond: number;
    private lastRequestTime: number;
    
    constructor(requestsPerSecond: number) {
        this.queue = [];
        this.requestsPerSecond = requestsPerSecond;
        this.lastRequestTime = Date.now();
    }
    
    async executeRequest<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }
    
    private async processQueue(): Promise<void> {
        if (this.queue.length === 0) return;
        
        const now = Date.now();
        const timeToWait = Math.max(0, 1000/this.requestsPerSecond - (now - this.lastRequestTime));
        
        await new Promise(resolve => setTimeout(resolve, timeToWait));
        
        const request = this.queue.shift();
        if (request) {
            this.lastRequestTime = Date.now();
            await request();
            this.processQueue();
        }
    }
}
```

## 2. Integraciones con Bases de Datos

### 2.1 Pool de Conexiones
```typescript
import { Pool, PoolConfig } from 'pg';

class DatabasePool {
    private static instance: DatabasePool;
    private pool: Pool;
    
    private constructor(config: PoolConfig) {
        this.pool = new Pool(config);
    }
    
    static getInstance(config: PoolConfig): DatabasePool {
        if (!DatabasePool.instance) {
            DatabasePool.instance = new DatabasePool(config);
        }
        return DatabasePool.instance;
    }
    
    async query<T>(sql: string, params?: any[]): Promise<T[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }
}
```

### 2.2 Transacciones
```typescript
class TransactionManager {
    private pool: DatabasePool;
    
    constructor(pool: DatabasePool) {
        this.pool = pool;
    }
    
    async executeTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
```

## 3. Integración con Message Queues

### 3.1 RabbitMQ Integration
```typescript
import { Connection, Channel, connect } from 'amqplib';

class MessageQueue {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    
    async connect(url: string): Promise<void> {
        this.connection = await connect(url);
        this.channel = await this.connection.createChannel();
    }
    
    async publishMessage(queue: string, message: any): Promise<void> {
        if (!this.channel) throw new Error('No channel available');
        
        await this.channel.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }
    
    async consumeMessages(queue: string, callback: (msg: any) => Promise<void>): Promise<void> {
        if (!this.channel) throw new Error('No channel available');
        
        await this.channel.assertQueue(queue);
        await this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    await callback(content);
                    this.channel?.ack(msg);
                } catch (error) {
                    this.channel?.nack(msg);
                }
            }
        });
    }
}
```

## 4. Webhooks

### 4.1 Webhook Manager
```typescript
interface WebhookConfig {
    url: string;
    secret: string;
    events: string[];
}

class WebhookManager {
    private webhooks: Map<string, WebhookConfig>;
    
    constructor() {
        this.webhooks = new Map();
    }
    
    registerWebhook(id: string, config: WebhookConfig): void {
        this.webhooks.set(id, config);
    }
    
    async triggerWebhook(id: string, payload: any): Promise<void> {
        const config = this.webhooks.get(id);
        if (!config) throw new Error('Webhook not found');
        
        const signature = this.generateSignature(payload, config.secret);
        
        await axios.post(config.url, payload, {
            headers: {
                'X-Webhook-Signature': signature
            }
        });
    }
    
    private generateSignature(payload: any, secret: string): string {
        return crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
    }
}
```

## 5. Monitorización y Logging

### 5.1 Integration Monitor
```typescript
class IntegrationMonitor {
    private metrics: {
        requests: number;
        errors: number;
        latency: number[];
    };
    
    constructor() {
        this.metrics = {
            requests: 0,
            errors: 0,
            latency: []
        };
    }
    
    trackRequest(duration: number, success: boolean): void {
        this.metrics.requests++;
        this.metrics.latency.push(duration);
        
        if (!success) {
            this.metrics.errors++;
        }
    }
    
    getMetrics(): any {
        return {
            totalRequests: this.metrics.requests,
            errorRate: (this.metrics.errors / this.metrics.requests) * 100,
            averageLatency: this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length
        };
    }
}
```

## Referencias

- [API Integration Best Practices](https://docs.n8n.io/integrations/creating-nodes/)
- [Database Integration Guide](https://docs.n8n.io/hosting/databases/)
- [Message Queue Documentation](https://docs.n8n.io/hosting/scaling/)
