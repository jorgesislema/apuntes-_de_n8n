# Seguridad en n8n

## Aspectos Fundamentales de Seguridad

Este documento proporciona una guía exhaustiva sobre las mejores prácticas de seguridad en implementaciones de n8n.

## 1. Autenticación y Autorización

### 1.1 Configuración de Autenticación
```typescript
// Implementación de autenticación JWT
class AuthenticationService {
    private readonly secret: string;
    private readonly expiresIn: string;
    
    constructor() {
        this.secret = process.env.JWT_SECRET!;
        this.expiresIn = '24h';
    }
    
    generateToken(userId: string): string {
        return jwt.sign({ userId }, this.secret, { expiresIn: this.expiresIn });
    }
    
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new AuthenticationError('Token inválido o expirado');
        }
    }
}
```

### 1.2 Control de Acceso
```typescript
// Implementación de RBAC (Role-Based Access Control)
class AccessControl {
    private roles: Map<string, Set<string>>;
    
    constructor() {
        this.roles = new Map();
    }
    
    addRole(role: string, permissions: string[]): void {
        this.roles.set(role, new Set(permissions));
    }
    
    canAccess(role: string, permission: string): boolean {
        const rolePermissions = this.roles.get(role);
        return rolePermissions?.has(permission) ?? false;
    }
}
```

## 2. Gestión de Credenciales

### 2.1 Cifrado de Credenciales
```typescript
// Servicio de cifrado para credenciales
class CredentialEncryption {
    private readonly algorithm = 'aes-256-gcm';
    private readonly key: Buffer;
    
    constructor(encryptionKey: string) {
        this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
    }
    
    encrypt(data: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return `${iv.toString('hex')}:${encrypted}:${cipher.getAuthTag().toString('hex')}`;
    }
    
    decrypt(encryptedData: string): string {
        const [ivHex, encrypted, authTag] = encryptedData.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }
}
```

## 3. Protección de Datos

### 3.1 Sanitización de Datos
```typescript
// Servicio de sanitización de entrada
class InputSanitizer {
    static sanitizeObject(obj: any): any {
        if (typeof obj !== 'object') return this.sanitizeValue(obj);
        
        return Object.entries(obj).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: this.sanitizeValue(value)
        }), {});
    }
    
    private static sanitizeValue(value: any): any {
        if (typeof value === 'string') {
            return this.escapeHtml(value.trim());
        }
        return value;
    }
    
    private static escapeHtml(str: string): string {
        const map: {[key: string]: string} = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, m => map[m]);
    }
}
```

### 3.2 Validación de Datos
```typescript
// Esquemas de validación
const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').required()
});

// Middleware de validación
function validateInput(schema: Joi.Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            res.status(400).json({ error: error.details[0].message });
        }
    };
}
```

## 4. Seguridad en la Red

### 4.1 Configuración de HTTPS
```typescript
// Configuración de servidor HTTPS
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('path/to/key.pem'),
    cert: fs.readFileSync('path/to/cert.pem'),
    ciphers: [
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384'
    ].join(':'),
    honorCipherOrder: true,
    minVersion: 'TLSv1.2'
};

https.createServer(options, app).listen(443);
```

### 4.2 Headers de Seguridad
```typescript
// Middleware de headers de seguridad
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});
```

## 5. Auditoría y Logging

### 5.1 Sistema de Auditoría
```typescript
// Servicio de auditoría
class AuditService {
    private readonly logger: winston.Logger;
    
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: 'audit.log' })
            ]
        });
    }
    
    logAction(userId: string, action: string, details: any): void {
        this.logger.info('Audit Log', {
            timestamp: new Date().toISOString(),
            userId,
            action,
            details,
            ip: request.ip
        });
    }
}
```

## Referencias

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [n8n Security Documentation](https://docs.n8n.io/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
