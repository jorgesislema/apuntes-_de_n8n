# 🔒 SSL y HTTPS para n8n

> **Guía completa para configurar SSL/TLS seguro en instalaciones de n8n**

## 📋 Índice

- [🌟 ¿Por qué SSL/HTTPS?](#-por-qué-sslhttps)
- [🔧 Métodos de Implementación](#-métodos-de-implementación)
- [🆓 Let's Encrypt (Gratis)](#-lets-encrypt-gratis)
- [💼 Certificados Comerciales](#-certificados-comerciales)
- [🔒 Configuración Nginx](#-configuración-nginx)
- [🛡️ Mejores Prácticas de Seguridad](#️-mejores-prácticas-de-seguridad)
- [🔄 Renovación Automática](#-renovación-automática)
- [🧪 Testing y Validación](#-testing-y-validación)

---

## 🌟 ¿Por qué SSL/HTTPS?

### ✅ **Beneficios Críticos**

- **🔐 Encriptación**: Protege datos en tránsito
- **🛡️ Autenticación**: Verifica identidad del servidor
- **✅ Integridad**: Previene manipulación de datos
- **📈 SEO**: Google favorece sitios HTTPS
- **🚀 Performance**: HTTP/2 requiere HTTPS
- **👥 Confianza**: Users expect HTTPS
- **📱 Mobile**: Apps móviles requieren HTTPS

### ⚠️ **Riesgos sin SSL**

| Sin HTTPS | Con HTTPS |
|-----------|-----------|
| **🔓 Datos visibles** | **🔒 Datos encriptados** |
| **👁️ Espionaje fácil** | **🛡️ Protección contra sniffing** |
| **✏️ Man-in-the-middle** | **🔐 Autenticación verificada** |
| **❌ Warnings del browser** | **✅ Candado verde** |
| **🚫 Features limitadas** | **🚀 Todas las features** |

---

## 🔧 Métodos de Implementación

### 📊 **Comparación de Opciones**

| Método | Costo | Dificultad | Renovación | Validación | Recomendado Para |
|--------|-------|------------|------------|------------|------------------|
| **Let's Encrypt** | 🆓 Gratis | ⭐⭐ | 🔄 Auto | Domain | 95% casos |
| **Cloudflare** | 🆓 Gratis | ⭐ | 🔄 Auto | Proxy | Fácil + CDN |
| **ZeroSSL** | 🆓 Gratis | ⭐⭐ | 🔄 Auto | Domain | Alternativa LE |
| **Comercial** | 💰 $50-500/año | ⭐⭐⭐ | 📅 Manual | EV/OV | Enterprise |
| **Wildcard** | 💰 $100+/año | ⭐⭐⭐ | 📅 Manual | DNS | Subdominios |

### 🏗️ **Arquitecturas SSL**

```
1. Terminación SSL en Load Balancer
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Internet     │◄──►│  Load Balancer  │◄──►│      n8n        │
│   (HTTPS:443)   │    │   + SSL Cert    │    │   (HTTP:5678)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘

2. Terminación SSL en Nginx
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Internet     │◄──►│     Nginx       │◄──►│      n8n        │
│   (HTTPS:443)   │    │   + SSL Cert    │    │   (HTTP:5678)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘

3. SSL End-to-End
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Internet     │◄──►│     Nginx       │◄──►│      n8n        │
│   (HTTPS:443)   │    │   + SSL Cert    │    │   + SSL Cert    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🆓 Let's Encrypt (Gratis)

### 🔧 **Instalación Certbot**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# CentOS/RHEL
sudo yum install -y epel-release
sudo yum install -y certbot python3-certbot-nginx

# Verificar instalación
certbot --version
```

### 🌐 **Método 1: Standalone**

```bash
# Parar nginx temporalmente
sudo systemctl stop nginx

# Obtener certificado standalone
sudo certbot certonly \
  --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  --email your-email@domain.com \
  --agree-tos \
  --no-eff-email

# Verificar certificados
sudo certbot certificates

# Archivos generados
ls -la /etc/letsencrypt/live/your-domain.com/
```

### 🔌 **Método 2: Webroot**

```bash
# Crear directorio webroot
sudo mkdir -p /var/www/certbot

# Configurar nginx para webroot
cat > /etc/nginx/sites-available/certbot << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/certbot /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Obtener certificado usando webroot
sudo certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d your-domain.com \
  -d www.your-domain.com \
  --email your-email@domain.com \
  --agree-tos \
  --no-eff-email
```

### 🐳 **Con Docker Compose**

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - certbot_www:/var/www/certbot
    depends_on:
      - n8n

  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - certbot_www:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@domain.com --agree-tos --no-eff-email -d your-domain.com

volumes:
  certbot_www:
```

### 📝 **Script de Obtención SSL**

```bash
# Crear script get-ssl.sh
cat > get-ssl.sh << 'EOF'
#!/bin/bash

DOMAIN="your-domain.com"
EMAIL="your-email@domain.com"

echo "🔒 Obteniendo certificado SSL para $DOMAIN..."

# Verificar que el dominio apunte al servidor
CURRENT_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN)

if [ "$CURRENT_IP" != "$DOMAIN_IP" ]; then
    echo "❌ El dominio $DOMAIN no apunta a este servidor ($CURRENT_IP vs $DOMAIN_IP)"
    exit 1
fi

# Parar servicios que usan puerto 80
docker-compose down nginx 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true

# Obtener certificado
sudo certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ Certificado obtenido exitosamente"
    
    # Copiar certificados para Docker
    sudo mkdir -p ./ssl
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/key.pem
    sudo chown -R $USER:$USER ./ssl
    
    echo "✅ Certificados copiados a ./ssl/"
    
    # Reiniciar servicios
    docker-compose up -d
    
else
    echo "❌ Error obteniendo certificado"
    exit 1
fi
EOF

chmod +x get-ssl.sh
```

---

## 💼 Certificados Comerciales

### 🏢 **Proveedores Recomendados**

| Proveedor | DV Cert | OV Cert | EV Cert | Wildcard | Características |
|-----------|---------|---------|---------|----------|----------------|
| **DigiCert** | $175/año | $350/año | $395/año | $595/año | Premium, soporte 24/7 |
| **GlobalSign** | $149/año | $249/año | $599/año | $349/año | Reconocimiento global |
| **Comodo** | $85/año | $199/año | $299/año | $199/año | Económico |
| **RapidSSL** | $49/año | N/A | N/A | $169/año | Básico, rápido |

### 📋 **Proceso de Instalación**

```bash
# 1. Generar CSR (Certificate Signing Request)
openssl req -new -newkey rsa:2048 -nodes -keyout your-domain.com.key -out your-domain.com.csr

# 2. Información requerida
Country Name (2 letter code) [XX]: US
State or Province Name (full name) []: California
Locality Name (eg, city) []: San Francisco
Organization Name (eg, company) []: Your Company Inc
Organizational Unit Name (eg, section) []: IT Department
Common Name (eg, your name or your server's hostname) []: your-domain.com
Email Address []: admin@your-domain.com

# 3. Enviar CSR al proveedor y recibir certificados
# 4. Instalar certificados recibidos

# Estructura típica de archivos:
# your-domain.com.crt    (Certificado principal)
# intermediate.crt       (Certificado intermedio)
# your-domain.com.key    (Clave privada)

# 5. Crear fullchain certificate
cat your-domain.com.crt intermediate.crt > fullchain.crt
```

---

## 🔒 Configuración Nginx

### 🌐 **Configuración SSL Optimizada**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # ========================================
    # SSL Configuration
    # ========================================
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL Protocols y Ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # SSL Session
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ssl/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # ========================================
    # Security Headers
    # ========================================
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Other security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self';" always;
    
    # Remove server signature
    server_tokens off;

    # ========================================
    # Performance Optimizations
    # ========================================
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Client settings
    client_max_body_size 16M;
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;

    # ========================================
    # n8n Proxy Configuration
    # ========================================
    location / {
        proxy_pass http://n8n:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Webhook optimization
    location /webhook/ {
        proxy_pass http://n8n:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Extended timeouts for webhooks
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        # No buffering for real-time webhooks
        proxy_buffering off;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 🔧 **Configuración SSL Mínima**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://n8n:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🛡️ Mejores Prácticas de Seguridad

### 🔒 **SSL/TLS Hardening**

```nginx
# Configuración SSL ultra-segura
ssl_protocols TLSv1.3;  # Solo TLS 1.3 (más restrictivo)
ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers on;
ssl_ecdh_curve secp384r1;
ssl_session_timeout 5m;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;

# DH Parameters para Perfect Forward Secrecy
ssl_dhparam /etc/nginx/ssl/dhparam.pem;

# Generar DHParams
openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

### 🔐 **Headers de Seguridad Avanzados**

```nginx
# HSTS con preload
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# CSP estricto para n8n
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' wss: https:; font-src 'self' data:; object-src 'none'; media-src 'self' blob:; worker-src 'self' blob:; child-src 'self' blob:; form-action 'self';" always;

# Prevent clickjacking
add_header X-Frame-Options "DENY" always;

# MIME type sniffing protection
add_header X-Content-Type-Options "nosniff" always;

# XSS Protection
add_header X-XSS-Protection "1; mode=block" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
```

### 🧪 **Testing de Configuración SSL**

```bash
# Test SSL configuration
curl -I https://your-domain.com

# Check SSL certificate details
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Test SSL Labs (online)
# https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

# Test with testssl.sh
git clone --depth 1 https://github.com/drwetter/testssl.sh.git
cd testssl.sh
./testssl.sh https://your-domain.com
```

---

## 🔄 Renovación Automática

### ⚡ **Renovación Let's Encrypt**

```bash
# Test de renovación
sudo certbot renew --dry-run

# Renovación real
sudo certbot renew --quiet

# Script de renovación personalizado
cat > /opt/ssl-renew.sh << 'EOF'
#!/bin/bash

# Renovar certificados
certbot renew --quiet --no-self-upgrade

# Si hay certificados nuevos, recargar nginx
if [ $? -eq 0 ]; then
    # Copiar certificados para Docker
    DOMAIN="your-domain.com"
    
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/n8n-docker/ssl/cert.pem
        cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/n8n-docker/ssl/key.pem
        
        # Recargar nginx en Docker
        docker-compose -f /opt/n8n-docker/docker-compose.yml exec nginx nginx -s reload
        
        echo "$(date): SSL certificates renewed and nginx reloaded"
    fi
fi
EOF

chmod +x /opt/ssl-renew.sh

# Añadir al crontab
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/ssl-renew.sh >> /var/log/ssl-renew.log 2>&1") | crontab -
```

### 🐳 **Renovación con Docker**

```bash
# Script para Docker Compose
cat > scripts/renew-ssl.sh << 'EOF'
#!/bin/bash

echo "🔄 Renovando certificados SSL..."

# Parar nginx para standalone renewal
docker-compose stop nginx

# Renovar con certbot standalone
docker run --rm \
    -v ./ssl:/etc/letsencrypt \
    -p 80:80 \
    certbot/certbot renew \
    --standalone \
    --quiet

if [ $? -eq 0 ]; then
    echo "✅ Certificados renovados exitosamente"
    
    # Copiar certificados
    docker run --rm \
        -v ./ssl:/etc/letsencrypt \
        -v ./ssl-active:/ssl-output \
        alpine/openssl sh -c "
            cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /ssl-output/cert.pem
            cp /etc/letsencrypt/live/your-domain.com/privkey.pem /ssl-output/key.pem
        "
    
    # Reiniciar nginx
    docker-compose up -d nginx
    
else
    echo "❌ Error renovando certificados"
    # Reiniciar nginx de todos modos
    docker-compose up -d nginx
fi
EOF

chmod +x scripts/renew-ssl.sh

# Crontab para renovación automática
(crontab -l 2>/dev/null; echo "0 3 */15 * * /opt/n8n-docker/scripts/renew-ssl.sh") | crontab -
```

---

## 🧪 Testing y Validación

### 🔍 **Tests Básicos**

```bash
# 1. Verificar respuesta HTTPS
curl -I https://your-domain.com
# Expected: 200 OK with security headers

# 2. Verificar redirección HTTP → HTTPS
curl -I http://your-domain.com
# Expected: 301 redirect to https://

# 3. Verificar certificado
openssl s_client -connect your-domain.com:443 -servername your-domain.com <<< "Q" | openssl x509 -noout -dates
# Expected: Valid date range

# 4. Test WebSocket (para n8n)
wscat -c wss://your-domain.com/ws
# Expected: Connection successful
```

### 📊 **SSL Quality Tests**

```bash
# SSL Labs API test
curl -s "https://api.ssllabs.com/api/v3/analyze?host=your-domain.com" | jq '.endpoints[0].grade'

# Security headers test
curl -I https://your-domain.com | grep -E "(Strict-Transport|X-Frame|X-Content|CSP)"

# TLS version test
nmap --script ssl-enum-ciphers -p 443 your-domain.com

# Certificate transparency test
curl -s "https://crt.sh/?q=your-domain.com&output=json" | jq '.[0].common_name'
```

### 🎯 **Automated Testing Script**

```bash
cat > scripts/ssl-test.sh << 'EOF'
#!/bin/bash

DOMAIN="your-domain.com"
EXPECTED_GRADE="A"

echo "🧪 Testing SSL configuration for $DOMAIN..."

# Test 1: Basic connectivity
echo "📡 Testing HTTPS connectivity..."
if curl -I https://$DOMAIN --max-time 10 >/dev/null 2>&1; then
    echo "✅ HTTPS connectivity: PASS"
else
    echo "❌ HTTPS connectivity: FAIL"
    exit 1
fi

# Test 2: HTTP redirect
echo "🔄 Testing HTTP to HTTPS redirect..."
REDIRECT=$(curl -I http://$DOMAIN --max-time 10 2>/dev/null | grep "Location:" | grep "https://")
if [ ! -z "$REDIRECT" ]; then
    echo "✅ HTTP redirect: PASS"
else
    echo "❌ HTTP redirect: FAIL"
fi

# Test 3: Security headers
echo "🛡️ Testing security headers..."
HEADERS=$(curl -I https://$DOMAIN --max-time 10 2>/dev/null)

if echo "$HEADERS" | grep -q "Strict-Transport-Security"; then
    echo "✅ HSTS header: PASS"
else
    echo "❌ HSTS header: MISSING"
fi

if echo "$HEADERS" | grep -q "X-Frame-Options"; then
    echo "✅ X-Frame-Options: PASS"
else
    echo "❌ X-Frame-Options: MISSING"
fi

# Test 4: Certificate validity
echo "📜 Testing certificate validity..."
CERT_EXPIRY=$(openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null <<< "Q" | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$CERT_EXPIRY" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_REMAINING=$(( ($EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))

if [ $DAYS_REMAINING -gt 30 ]; then
    echo "✅ Certificate validity: PASS ($DAYS_REMAINING days remaining)"
else
    echo "⚠️ Certificate validity: WARNING ($DAYS_REMAINING days remaining)"
fi

echo "🎉 SSL testing completed!"
EOF

chmod +x scripts/ssl-test.sh
```

---

## ⚡ Configuración Express

### 🚀 **Setup SSL en 5 Minutos**

```bash
# 1. Variables de configuración
export DOMAIN="your-domain.com"
export EMAIL="your-email@domain.com"

# 2. Obtener certificado Let's Encrypt
sudo certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email

# 3. Copiar certificados para Docker
mkdir -p ssl
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown -R $USER:$USER ssl/

# 4. Crear nginx.conf mínimo
cat > nginx.conf << EOF
events { worker_connections 1024; }
http {
    upstream n8n { server n8n:5678; }
    server {
        listen 80;
        return 301 https://\$server_name\$request_uri;
    }
    server {
        listen 443 ssl;
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        location / {
            proxy_pass http://n8n;
            proxy_set_header Host \$host;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }
    }
}
EOF

# 5. Actualizar docker-compose.yml para incluir nginx
# 6. Iniciar servicios
docker-compose up -d

echo "🎉 SSL configurado exitosamente para https://$DOMAIN"
```

---

## ✅ Checklist Final SSL

### 🎯 **Verificación Completa**

- [ ] ✅ **Certificado SSL** instalado y válido
- [ ] ✅ **Redirección HTTP → HTTPS** funcionando
- [ ] ✅ **Security headers** configurados
- [ ] ✅ **TLS 1.2/1.3** únicamente habilitado
- [ ] ✅ **Perfect Forward Secrecy** activo
- [ ] ✅ **OCSP Stapling** configurado
- [ ] ✅ **Renovación automática** programada
- [ ] ✅ **Monitoreo de expiración** activo
- [ ] ✅ **Backup de certificados** configurado
- [ ] ✅ **SSL Grade A+** en SSL Labs

### 🌟 **URLs de Verificación**

```bash
# Test final completo
./scripts/ssl-test.sh

# SSL Labs online test
# https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

# Security headers test
# https://securityheaders.com/?q=your-domain.com
```

---

## 🆘 Troubleshooting SSL

### ❌ **Problemas Comunes**

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Certificate not trusted** | Browser warning | Verificar certificado intermedio |
| **Mixed content** | Console errors | Asegurar todas las URLs usen HTTPS |
| **Certificate mismatch** | Name mismatch error | Verificar Common Name/SAN |
| **Renewal fails** | Certificate expires | Verificar permisos de certbot |
| **Nginx won't start** | SSL error | Verificar paths de certificados |

### 🔧 **Comandos de Debug**

```bash
# Verificar configuración nginx
nginx -t

# Test de conectividad SSL
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Ver detalles del certificado
openssl x509 -in ssl/cert.pem -text -noout

# Debug de renovación
certbot renew --dry-run --verbose

# Logs de certbot
journalctl -u certbot
```

---

> **🔒 ¡Perfecto!** Tu n8n ahora está protegido con SSL/HTTPS de grado empresarial. Los datos están seguros y tienes la confianza de tus usuarios.

**💡 Tip Final**: Configura monitoreo de certificados para recibir alertas antes de que expiren. La seguridad es un proceso continuo.