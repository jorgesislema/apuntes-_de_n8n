# Antipatrones de Seguridad en n8n

## Introducción

La seguridad en workflows de n8n es crítica para proteger datos sensibles y mantener la integridad de las automatizaciones. Este documento analiza los antipatrones de seguridad más comunes y proporciona implementaciones seguras validadas.

## 1. Credenciales Hardcodeadas

### Descripción
Inclusión directa de credenciales, tokens o claves de API en el código de los workflows o nodos.

### Impacto de Seguridad
- Exposición de datos sensibles
- Vulnerabilidad a ataques
- Incumplimiento de compliance
- Dificultad en rotación de credenciales

### Solución
```javascript
// Antipatrón
const apiKey = "1234567890abcdef";

// Solución: Usar Credentials
const credentials = await this.getCredentials('myApiAuth');
const apiKey = credentials.apiKey;

// Solución: Variables de Entorno
const config = {
  apiKey: process.env.API_KEY,
  endpoint: process.env.API_ENDPOINT
};
```

## 2. Transmisión Insegura de Datos

### Descripción
Transferencia de datos sensibles sin cifrado adecuado o a través de canales no seguros.

### Impacto de Seguridad
- Interceptación de datos
- Man-in-the-middle attacks
- Fuga de información
- Violación de privacidad

### Solución
```javascript
// Implementación de cifrado
const crypto = require('crypto');

class SecureDataTransfer {
  constructor(encryptionKey) {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto
      .createHash('sha256')
      .update(encryptionKey)
      .digest();
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}
```

## 3. Validación Insuficiente

### Descripción
Falta de validación adecuada de datos de entrada, parámetros y respuestas de API.

### Impacto de Seguridad
- Inyección de código
- XSS attacks
- Manipulación de datos
- Bypass de controles

### Solución
```javascript
// Implementación de validación robusta
const Joi = require('joi');

class InputValidator {
  static userSchema = Joi.object({
    id: Joi.string().uuid().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'admin').required(),
    metadata: Joi.object().unknown(true)
  });

  static async validateUser(data) {
    try {
      return await this.userSchema.validateAsync(data, {
        abortEarly: false,
        stripUnknown: true
      });
    } catch (error) {
      throw new Error(`Validation failed: ${error.details.map(d => d.message).join(', ')}`);
    }
  }

  static sanitizeInput(input) {
    return {
      ...input,
      email: input.email?.toLowerCase().trim(),
      metadata: this.sanitizeObject(input.metadata)
    };
  }

  static sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = typeof value === 'string' 
        ? this.escapeHTML(value)
        : this.sanitizeObject(value);
    }
    return sanitized;
  }

  static escapeHTML(str) {
    return str.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }
}
```

## Mejores Prácticas

1. **Gestión de Credenciales**
   - Usar el sistema de credenciales de n8n
   - Implementar rotación de credenciales
   - Auditar accesos y uso

2. **Transmisión de Datos**
   - Usar TLS/SSL para conexiones
   - Implementar cifrado end-to-end
   - Validar certificados SSL

3. **Validación y Sanitización**
   - Validar todos los inputs
   - Sanitizar datos antes de procesamiento
   - Implementar rate limiting

## Herramientas y Recursos

### Security Testing
- OWASP ZAP
- SonarQube Security Rules
- npm audit

### Monitoreo
- Security Information and Event Management (SIEM)
- Log Analysis Tools
- Intrusion Detection Systems

## Referencias

1. [OWASP Top 10](https://owasp.org/www-project-top-ten/)
2. [n8n Security Best Practices](https://docs.n8n.io/hosting/security/)
3. [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
