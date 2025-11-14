# ☁️ Instalación de n8n en AWS EC2

> **Guía profesional para desplegar n8n en Amazon Web Services - Para entornos empresariales y alta escala**

## 📋 Índice

- [🌟 ¿Por qué AWS EC2?](#-por-qué-aws-ec2)
- [🏗️ Arquitectura Recomendada](#️-arquitectura-recomendada)
- [📋 Requisitos Previos](#-requisitos-previos)
- [🚀 Creación de Instancia EC2](#-creación-de-instancia-ec2)
- [🔐 Configuración de Seguridad](#-configuración-de-seguridad)
- [📦 Instalación con Docker](#-instalación-con-docker)
- [🗄️ Configuración RDS](#️-configuración-rds)
- [⚖️ Load Balancer y Auto Scaling](#️-load-balancer-y-auto-scaling)
- [📊 Monitoreo con CloudWatch](#-monitoreo-con-cloudwatch)

---

## 🌟 ¿Por qué AWS EC2?

### ✅ **Ventajas**
- **🔒 Seguridad enterprise**: IAM, VPC, Security Groups
- **📈 Escalabilidad infinita**: Auto Scaling, Load Balancers
- **🌍 Global**: 25+ regiones, 80+ availability zones
- **🛠️ Ecosistema completo**: RDS, S3, CloudWatch, ECS, EKS
- **💼 Enterprise ready**: Compliance, SLAs, soporte 24/7
- **🔄 Alta disponibilidad**: Multi-AZ, automatic failover

### 📊 **Tipos de Instancia Recomendadas**

| Uso | Instancia | vCPUs | RAM | Storage | Precio/Hora | Precio/Mes* |
|-----|-----------|--------|-----|---------|-------------|-------------|
| **🧪 Testing** | t3.micro | 2 | 1GB | EBS | $0.0104 | ~$7.50 |
| **👤 Personal** | t3.small | 2 | 2GB | EBS | $0.0208 | ~$15 |
| **👥 Team** | t3.medium | 2 | 4GB | EBS | $0.0416 | ~$30 |
| **🏢 Production** | t3.large | 2 | 8GB | EBS | $0.0832 | ~$60 |
| **🚀 High Performance** | c5.xlarge | 4 | 8GB | EBS | $0.17 | ~$122 |

*Precios estimados para us-east-1, pueden variar

---

## 🏗️ Arquitectura Recomendada

### 🏢 **Producción Empresarial**

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Account                           │
├─────────────────────────────────────────────────────────────┤
│                         Region                              │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │   AZ-1a         │              │   AZ-1b         │      │
│  │                 │              │                 │      │
│  │ ┌─────────────┐ │              │ ┌─────────────┐ │      │
│  │ │Public Subnet│ │              │ │Public Subnet│ │      │
│  │ │             │ │              │ │             │ │      │
│  │ │    ALB      │ │              │ │   Standby   │ │      │
│  │ └─────────────┘ │              │ └─────────────┘ │      │
│  │                 │              │                 │      │
│  │ ┌─────────────┐ │              │ ┌─────────────┐ │      │
│  │ │Private      │ │              │ │Private      │ │      │
│  │ │Subnet       │ │              │ │Subnet       │ │      │
│  │ │             │ │              │ │             │ │      │
│  │ │ EC2 (n8n)   │ │              │ │ EC2 (n8n)   │ │      │
│  │ │             │ │              │ │             │ │      │
│  │ └─────────────┘ │              │ └─────────────┘ │      │
│  │                 │              │                 │      │
│  │ ┌─────────────┐ │              │ ┌─────────────┐ │      │
│  │ │DB Subnet    │ │              │ │DB Subnet    │ │      │
│  │ │             │ │              │ │             │ │      │
│  │ │RDS Primary  │ │              │ │RDS Standby  │ │      │
│  │ └─────────────┘ │              │ └─────────────┘ │      │
│  └─────────────────┘              └─────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Requisitos Previos

### 🔑 **Cuenta AWS y Herramientas**
1. **Cuenta AWS** con billing configurado
2. **AWS CLI v2** instalado y configurado
3. **Key Pair** para acceso SSH
4. **Conocimiento básico** de VPC y Security Groups

### 🛠️ **Instalación AWS CLI**

```powershell
# Windows con Chocolatey
choco install awscli

# O descargar MSI desde AWS
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Verificar instalación
aws --version

# Configurar credenciales
aws configure
```

### 🔐 **Configuración Inicial**

```bash
# Configurar AWS CLI
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json

# Verificar configuración
aws sts get-caller-identity
aws ec2 describe-regions
```

---

## 🚀 Creación de Instancia EC2

### 🌐 **Crear VPC y Subnets**

```bash
# Crear VPC
VPC_ID=$(aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=n8n-vpc}]' \
    --query 'Vpc.VpcId' --output text)

echo "VPC ID: $VPC_ID"

# Crear Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=n8n-igw}]' \
    --query 'InternetGateway.InternetGatewayId' --output text)

# Attach IGW a VPC
aws ec2 attach-internet-gateway \
    --internet-gateway-id $IGW_ID \
    --vpc-id $VPC_ID

# Crear Public Subnet
PUBLIC_SUBNET_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.1.0/24 \
    --availability-zone us-east-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=n8n-public-subnet}]' \
    --query 'Subnet.SubnetId' --output text)

# Crear Private Subnet
PRIVATE_SUBNET_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.2.0/24 \
    --availability-zone us-east-1a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=n8n-private-subnet}]' \
    --query 'Subnet.SubnetId' --output text)

# Configurar Route Table
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
    --vpc-id $VPC_ID \
    --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=n8n-public-rt}]' \
    --query 'RouteTable.RouteTableId' --output text)

# Crear ruta a Internet
aws ec2 create-route \
    --route-table-id $ROUTE_TABLE_ID \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id $IGW_ID

# Asociar subnet con route table
aws ec2 associate-route-table \
    --subnet-id $PUBLIC_SUBNET_ID \
    --route-table-id $ROUTE_TABLE_ID
```

### 🔒 **Crear Security Groups**

```bash
# Security Group para n8n
N8N_SG_ID=$(aws ec2 create-security-group \
    --group-name n8n-security-group \
    --description "Security group for n8n application" \
    --vpc-id $VPC_ID \
    --tag-specifications 'ResourceType=security-group,Tags=[{Key=Name,Value=n8n-sg}]' \
    --query 'GroupId' --output text)

# Permitir SSH (Puerto 22)
aws ec2 authorize-security-group-ingress \
    --group-id $N8N_SG_ID \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

# Permitir HTTP (Puerto 80)
aws ec2 authorize-security-group-ingress \
    --group-id $N8N_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Permitir HTTPS (Puerto 443)
aws ec2 authorize-security-group-ingress \
    --group-id $N8N_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Permitir n8n (Puerto 5678) - solo para testing
aws ec2 authorize-security-group-ingress \
    --group-id $N8N_SG_ID \
    --protocol tcp \
    --port 5678 \
    --cidr 0.0.0.0/0
```

### 🚀 **Crear Key Pair**

```bash
# Crear Key Pair
aws ec2 create-key-pair \
    --key-name n8n-keypair \
    --query 'KeyMaterial' \
    --output text > n8n-keypair.pem

# Configurar permisos (Linux/Mac)
chmod 400 n8n-keypair.pem

# En Windows PowerShell
icacls n8n-keypair.pem /inheritance:r
icacls n8n-keypair.pem /grant:r "$($env:USERNAME):R"
```

### 🖥️ **Lanzar Instancia EC2**

```bash
# Obtener AMI ID de Ubuntu 22.04
AMI_ID=$(aws ec2 describe-images \
    --owners 099720109477 \
    --filters 'Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*' \
    --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
    --output text)

# Crear instancia EC2
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type t3.medium \
    --key-name n8n-keypair \
    --security-group-ids $N8N_SG_ID \
    --subnet-id $PUBLIC_SUBNET_ID \
    --associate-public-ip-address \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=n8n-production}]' \
    --user-data file://user-data.sh \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Instance ID: $INSTANCE_ID"

# Obtener IP pública
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "Public IP: $PUBLIC_IP"
```

### 📝 **Crear User Data Script**

```bash
# Crear archivo user-data.sh
cat > user-data.sh << 'EOF'
#!/bin/bash

# Actualizar sistema
apt update && apt upgrade -y

# Instalar utilidades básicas
apt install -y curl wget git nano htop ufw fail2ban

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Crear usuario para n8n
useradd -m -s /bin/bash n8nuser
usermod -aG sudo,docker n8nuser

# Configurar firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 5678
ufw --force enable

# Crear directorio para n8n
mkdir -p /home/n8nuser/n8n-production
chown -R n8nuser:n8nuser /home/n8nuser/n8n-production

# Signal que la instalación terminó
/opt/aws/bin/cfn-signal -e $? --stack $AWS_DEFAULT_REGION --resource AutoScalingGroup --region $AWS_DEFAULT_REGION
EOF
```

---

## 🔐 Configuración de Seguridad

### 🔐 **IAM Roles y Policies**

```bash
# Crear IAM Role para EC2
aws iam create-role \
    --role-name n8n-ec2-role \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "ec2.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }'

# Crear policy para CloudWatch y SSM
aws iam create-policy \
    --policy-name n8n-ec2-policy \
    --policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "cloudwatch:PutMetricData",
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                    "ssm:GetParameter",
                    "ssm:GetParameters",
                    "ssm:GetParametersByPath"
                ],
                "Resource": "*"
            }
        ]
    }'

# Attachar policy al role
aws iam attach-role-policy \
    --role-name n8n-ec2-role \
    --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/n8n-ec2-policy

# Crear Instance Profile
aws iam create-instance-profile --instance-profile-name n8n-ec2-instance-profile
aws iam add-role-to-instance-profile \
    --instance-profile-name n8n-ec2-instance-profile \
    --role-name n8n-ec2-role
```

### 🔑 **AWS Systems Manager Parameter Store**

```bash
# Almacenar credenciales de forma segura
aws ssm put-parameter \
    --name "/n8n/production/db_password" \
    --value "YourSecureDBPassword123!" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/n8n/production/auth_password" \
    --value "YourN8NPassword456!" \
    --type "SecureString"

aws ssm put-parameter \
    --name "/n8n/production/webhook_url" \
    --value "https://your-domain.com" \
    --type "String"
```

---

## 📦 Instalación con Docker

### 🔗 **Conexión SSH**

```bash
# Conectar a la instancia
ssh -i n8n-keypair.pem ubuntu@$PUBLIC_IP

# Cambiar a usuario n8n
sudo su - n8nuser
cd ~/n8n-production
```

### 🎼 **Docker Compose con AWS Secrets**

```bash
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD_FILE=/run/secrets/n8n_auth_password
      - N8N_HOST=${N8N_HOST}
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - WEBHOOK_URL=${WEBHOOK_URL}
      - N8N_METRICS=true
      - N8N_LOG_LEVEL=info
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=${DB_HOST}
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8nuser
      - DB_POSTGRESDB_PASSWORD_FILE=/run/secrets/db_password
      - AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
    volumes:
      - n8n_data:/home/node/.n8n
    secrets:
      - n8n_auth_password
      - db_password
    networks:
      - n8n_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5678 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: n8n_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - n8n
    networks:
      - n8n_network

secrets:
  n8n_auth_password:
    external: true
  db_password:
    external: true

volumes:
  n8n_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /home/n8nuser/n8n-data

networks:
  n8n_network:
    driver: bridge
EOF
```

### 🔐 **Script para obtener secrets de AWS**

```bash
# Crear script para obtener secrets
cat > get-secrets.sh << 'EOF'
#!/bin/bash

# Obtener parámetros de SSM
DB_PASSWORD=$(aws ssm get-parameter --name "/n8n/production/db_password" --with-decryption --query 'Parameter.Value' --output text)
AUTH_PASSWORD=$(aws ssm get-parameter --name "/n8n/production/auth_password" --with-decryption --query 'Parameter.Value' --output text)

# Crear archivos de secrets para Docker
echo "$DB_PASSWORD" | docker secret create db_password -
echo "$AUTH_PASSWORD" | docker secret create n8n_auth_password -

echo "Secrets created successfully"
EOF

chmod +x get-secrets.sh
./get-secrets.sh
```

---

## 🗄️ Configuración RDS

### 🗄️ **Crear RDS PostgreSQL**

```bash
# Crear DB Subnet Group
aws rds create-db-subnet-group \
    --db-subnet-group-name n8n-db-subnet-group \
    --db-subnet-group-description "Subnet group for n8n database" \
    --subnet-ids $PRIVATE_SUBNET_ID $PRIVATE_SUBNET_2_ID \
    --tags Key=Name,Value=n8n-db-subnet-group

# Crear Security Group para RDS
RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name n8n-rds-security-group \
    --description "Security group for n8n RDS database" \
    --vpc-id $VPC_ID \
    --query 'GroupId' --output text)

# Permitir conexiones desde n8n security group
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $N8N_SG_ID

# Crear instancia RDS
aws rds create-db-instance \
    --db-instance-identifier n8n-database \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.3 \
    --master-username n8nuser \
    --master-user-password "$(aws ssm get-parameter --name "/n8n/production/db_password" --with-decryption --query 'Parameter.Value' --output text)" \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids $RDS_SG_ID \
    --db-subnet-group-name n8n-db-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --tags Key=Name,Value=n8n-production-db
```

### 📊 **Obtener Endpoint de RDS**

```bash
# Esperar a que RDS esté disponible (puede tomar 5-10 minutos)
aws rds wait db-instance-available --db-instance-identifier n8n-database

# Obtener endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier n8n-database \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

echo "DB Endpoint: $DB_ENDPOINT"

# Guardar endpoint en Parameter Store
aws ssm put-parameter \
    --name "/n8n/production/db_endpoint" \
    --value "$DB_ENDPOINT" \
    --type "String"
```

---

## ⚖️ Load Balancer y Auto Scaling

### 🔄 **Application Load Balancer**

```bash
# Crear Target Group
TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
    --name n8n-targets \
    --protocol HTTP \
    --port 5678 \
    --vpc-id $VPC_ID \
    --health-check-path /healthz \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 10 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

# Registrar instancia EC2
aws elbv2 register-targets \
    --target-group-arn $TARGET_GROUP_ARN \
    --targets Id=$INSTANCE_ID,Port=5678

# Crear ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name n8n-load-balancer \
    --subnets $PUBLIC_SUBNET_ID $PUBLIC_SUBNET_2_ID \
    --security-groups $N8N_SG_ID \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)

# Crear Listener
aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN
```

### 📏 **Auto Scaling Group**

```bash
# Crear Launch Template
aws ec2 create-launch-template \
    --launch-template-name n8n-launch-template \
    --launch-template-data '{
        "ImageId": "'$AMI_ID'",
        "InstanceType": "t3.medium",
        "KeyName": "n8n-keypair",
        "SecurityGroupIds": ["'$N8N_SG_ID'"],
        "IamInstanceProfile": {
            "Name": "n8n-ec2-instance-profile"
        },
        "UserData": "'$(base64 -w 0 user-data.sh)'"
    }'

# Crear Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name n8n-asg \
    --launch-template LaunchTemplateName=n8n-launch-template,Version=1 \
    --min-size 2 \
    --max-size 5 \
    --desired-capacity 2 \
    --target-group-arns $TARGET_GROUP_ARN \
    --vpc-zone-identifier "$PUBLIC_SUBNET_ID,$PUBLIC_SUBNET_2_ID" \
    --health-check-type ELB \
    --health-check-grace-period 300 \
    --tags Key=Name,Value=n8n-asg-instance,PropagateAtLaunch=true
```

---

## 📊 Monitoreo con CloudWatch

### 📈 **CloudWatch Agent**

```bash
# Instalar CloudWatch Agent en EC2
# (Incluir en user-data.sh)
cat >> user-data.sh << 'EOF'

# Descargar e instalar CloudWatch Agent
wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb

# Configurar CloudWatch Agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'CW_EOF'
{
    "metrics": {
        "namespace": "n8n/Production",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/var/log/docker.log",
                        "log_group_name": "n8n/docker",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    }
}
CW_EOF

# Iniciar CloudWatch Agent
systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent
EOF
```

### 🚨 **CloudWatch Alarms**

```bash
# Crear alarma para CPU alto
aws cloudwatch put-metric-alarm \
    --alarm-name "n8n-high-cpu" \
    --alarm-description "n8n CPU utilization is too high" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:us-east-1:123456789012:n8n-alerts \
    --dimensions Name=InstanceId,Value=$INSTANCE_ID

# Crear alarma para memoria alta
aws cloudwatch put-metric-alarm \
    --alarm-name "n8n-high-memory" \
    --alarm-description "n8n Memory utilization is too high" \
    --metric-name MemoryUtilization \
    --namespace n8n/Production \
    --statistic Average \
    --period 300 \
    --threshold 85 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --alarm-actions arn:aws:sns:us-east-1:123456789012:n8n-alerts
```

---

## 💰 Optimización de Costos

### 💡 **Estrategias de Ahorro**

1. **🕐 Reserved Instances**: 30-60% descuento para cargas de trabajo predecibles
2. **💡 Spot Instances**: Hasta 90% descuento para desarrollo
3. **📊 Right Sizing**: Monitorear y ajustar tipos de instancia
4. **⏰ Scheduled Scaling**: Auto-apagar instancias fuera de horario laboral

### 📊 **Calculadora de Costos Mensual**

```bash
# Instancia t3.medium 24/7
EC2_COST=$((30 * 24 * 0.0416))  # ~$30/mes

# RDS db.t3.micro Multi-AZ
RDS_COST=$((30 * 24 * 0.034))   # ~$25/mes

# ALB
ALB_COST=16.20                  # $16.20/mes

# EBS storage (100GB)
EBS_COST=$((100 * 0.10))        # $10/mes

# Total estimado
TOTAL_COST=$((EC2_COST + RDS_COST + ALB_COST + EBS_COST))
echo "Costo estimado mensual: \$${TOTAL_COST}"
```

---

## ✅ Verificación y Testing

### 🧪 **Health Checks**

```bash
# Verificar instancia
aws ec2 describe-instance-status --instance-ids $INSTANCE_ID

# Verificar ALB
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

curl -I http://$ALB_DNS

# Verificar targets
aws elbv2 describe-target-health --target-group-arn $TARGET_GROUP_ARN
```

### 📊 **Monitoreo Continuo**

```bash
# Script de monitoreo
cat > monitor.sh << 'EOF'
#!/bin/bash

# Verificar estado de servicios
docker-compose ps

# Verificar métricas básicas
echo "=== CPU Usage ==="
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'

echo "=== Memory Usage ==="
free | grep Mem | awk '{printf("%.2f%\n", ($3/$2) * 100.0)}'

echo "=== Disk Usage ==="
df -h / | awk 'NR==2{printf "%s\n", $5}'

# Verificar conectividad de n8n
curl -f http://localhost:5678/healthz || echo "n8n health check failed"
EOF

chmod +x monitor.sh
```

---

## 🆘 Solución de Problemas

### ❌ **Problemas Comunes**

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Instance unreachable** | SSH timeout | Verificar Security Group y NACL |
| **RDS connection failed** | DB connection error | Verificar Security Group y subnet group |
| **High latency** | Slow response times | Verificar CloudWatch metrics, considerar upgrade |
| **Auto Scaling issues** | Instances not launching | Verificar Launch Template y IAM permissions |

### 🔍 **Comandos de Troubleshooting**

```bash
# Logs de CloudWatch Agent
sudo journalctl -u amazon-cloudwatch-agent

# Estado de Auto Scaling
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names n8n-asg

# Verificar ALB targets
aws elbv2 describe-target-health --target-group-arn $TARGET_GROUP_ARN

# CloudWatch Logs
aws logs describe-log-groups --log-group-name-prefix n8n/
```

---

## 🚀 Próximos Pasos

Una vez que tienes n8n ejecutándose en AWS:

1. **🔒 Implementa WAF** para protección avanzada
2. **📊 Configura X-Ray** para tracing distribuido
3. **🔄 Implementa CI/CD** con CodePipeline
4. **🌍 Configura CloudFront** para CDN global
5. **🔐 Integra Secrets Manager** para rotación automática
6. **📱 Configura SNS/SQS** para notificaciones

---

> **🎉 ¡Felicitaciones!** Has desplegado n8n en AWS de manera profesional y escalable. Tu instalación está lista para manejar cargas de trabajo empresariales con alta disponibilidad y seguridad.

**💡 Tip Pro**: Considera usar AWS ECS o EKS para containerización avanzada y gestión de microservicios.