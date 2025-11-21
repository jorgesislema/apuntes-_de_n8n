# Nodos de Transformación de Datos

## Descripción Técnica

Los nodos de transformación son componentes especializados en la manipulación, conversión y procesamiento de estructuras de datos en n8n, permitiendo transformaciones complejas y mapping de datos entre diferentes formatos y esquemas.

## 1. Set Node

### 1.1 Configuración Técnica
```typescript
interface SetNodeValue {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'expression';
  value: any;
  options?: {
    allowUnescaped: boolean;
    dotNotation: boolean;
  };
}

interface SetNodeConfiguration {
  values: SetNodeValue[];
  options: {
    includeOriginal: boolean;
    nullValue: boolean;
  };
}
```

### 1.2 Patrones de Transformación

#### 1.2.1 Mapping Simple
```javascript
// Ejemplo: Transformación de estructura
{
  "values": [
    {
      "name": "user.fullName",
      "type": "expression",
      "value": "{{ $json.firstName }} {{ $json.lastName }}"
    },
    {
      "name": "user.age",
      "type": "number",
      "value": "{{ $json.age }}"
    }
  ]
}
```

#### 1.2.2 Transformación Compleja
```javascript
// Ejemplo: Transformación con lógica
{
  "values": [
    {
      "name": "status",
      "type": "expression",
      "value": "{{ $json.age >= 18 ? 'adult' : 'minor' }}"
    },
    {
      "name": "permissions",
      "type": "array",
      "value": "{{ $json.roles.map(role => role.permissions).flat() }}"
    }
  ]
}
```

## 2. Function Node

### 2.1 Configuración Técnica
```typescript
interface FunctionNodeConfiguration {
  code: string;
  outputs: number;
  language: 'javascript' | 'typescript' | 'python';
  options: {
    timeout: number;
    sandboxMode: boolean;
    pythonVersion?: '3.9' | '3.10' | '3.11';
    pythonPath?: string;
  };
}
```

### 2.2 Uso de Python en Function Node

#### 2.2.1 Configuración de Python
Para utilizar Python en n8n, asegúrate de:
1. Tener Python instalado en el sistema
2. Configurar la ruta de Python en n8n
3. Instalar los paquetes necesarios

#### 2.2.2 Ejemplos en Python
```python
# Ejemplo: Procesamiento de datos con pandas
import pandas as pd
import numpy as np

def process_data(items):
    # Convertir items a DataFrame
    df = pd.DataFrame([item['json'] for item in items])
    
    # Realizar transformaciones
    df['processed_date'] = pd.to_datetime(df['date'])
    df['value_normalized'] = (df['value'] - df['value'].mean()) / df['value'].std()
    
    # Agrupar y calcular estadísticas
    summary = df.groupby('category').agg({
        'value': ['sum', 'mean', 'count'],
        'status': 'nunique'
    })
    
    return {
        'processed_data': df.to_dict('records'),
        'summary': summary.to_dict()
    }

def main():
    # Obtener todos los items
    items = $input.all()
    
    # Procesar datos
    result = process_data(items)
    
    return result

# Ejecutar función principal
output = main()
```

#### 2.2.3 Integración con APIs usando Python
```python
# Ejemplo: Consumo de API REST con requests
import requests
from datetime import datetime
import json

def fetch_and_process():
    # Configuración
    api_url = "https://api.example.com/data"
    headers = {
        "Authorization": f"Bearer {$env.API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Realizar petición
    response = requests.get(api_url, headers=headers)
    data = response.json()
    
    # Procesar datos
    processed_data = []
    for item in data:
        processed_item = {
            "id": item["id"],
            "processed_at": datetime.now().isoformat(),
            "metrics": {
                "value": float(item["value"]),
                "category": item["category"].upper(),
                "score": calculate_score(item)
            }
        }
        processed_data.append(processed_item)
    
    return processed_data

def calculate_score(item):
    # Lógica de cálculo personalizada
    base_score = float(item["base_value"])
    multiplier = 1.5 if item["priority"] == "high" else 1.0
    return base_score * multiplier

# Ejecutar y devolver resultados
output = fetch_and_process()
```

#### 2.2.4 Procesamiento de Datos Científicos
```python
# Ejemplo: Análisis de datos con numpy y scikit-learn
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import numpy as np

def analyze_data():
    # Obtener datos
    items = $input.all()
    data = np.array([item['json']['values'] for item in items])
    
    # Preprocesamiento
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(data)
    
    # Análisis de clusters
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(data_scaled)
    
    # Preparar resultados
    results = []
    for i, item in enumerate(items):
        results.append({
            "id": item['json']['id'],
            "cluster": int(clusters[i]),
            "centroid_distance": float(
                np.linalg.norm(data_scaled[i] - kmeans.cluster_centers_[clusters[i]])
            ),
            "metrics": {
                "scaled_values": data_scaled[i].tolist(),
                "cluster_center": kmeans.cluster_centers_[clusters[i]].tolist()
            }
        })
    
    return {
        "results": results,
        "model_info": {
            "n_clusters": kmeans.n_clusters,
            "inertia": float(kmeans.inertia_),
            "n_iterations": int(kmeans.n_iter_)
        }
    }

# Ejecutar análisis
output = analyze_data()
```

### 2.2 Patrones de Implementación

#### 2.2.1 Transformación de Datos
```javascript
// Ejemplo: Procesamiento complejo
function processItems($input) {
  const items = $input.all();
  return items.map(item => {
    return {
      id: item.json.id,
      processed: {
        name: item.json.name.toLowerCase(),
        categories: item.json.categories.filter(c => c.active),
        metadata: {
          processedAt: new Date().toISOString(),
          version: '1.0'
        }
      }
    };
  });
}
```

#### 2.2.2 Agregación de Datos
```javascript
// Ejemplo: Cálculos y agregaciones
function aggregateData($input) {
  const items = $input.all();
  return {
    summary: {
      total: items.reduce((sum, item) => sum + item.json.amount, 0),
      count: items.length,
      average: items.reduce((sum, item) => sum + item.json.amount, 0) / items.length,
      categories: [...new Set(items.map(item => item.json.category))]
    }
  };
}
```

## 3. Item Lists Node

### 3.1 Configuración Técnica
```typescript
interface ItemListsNodeConfiguration {
  operation: 'sort' | 'filter' | 'limit' | 'removeDuplicates';
  options: {
    sortFields?: Array<{
      field: string;
      order: 'ASC' | 'DESC';
    }>;
    filterConditions?: Array<{
      field: string;
      operation: string;
      value: any;
    }>;
    limit?: number;
    removeBy?: string;
  };
}
```

### 3.2 Operaciones Comunes

#### 3.2.1 Ordenamiento
```javascript
// Ejemplo: Ordenamiento múltiple
{
  "operation": "sort",
  "options": {
    "sortFields": [
      {
        "field": "priority",
        "order": "DESC"
      },
      {
        "field": "createdAt",
        "order": "ASC"
      }
    ]
  }
}
```

#### 3.2.2 Filtrado
```javascript
// Ejemplo: Filtrado compuesto
{
  "operation": "filter",
  "options": {
    "filterConditions": [
      {
        "field": "status",
        "operation": "equals",
        "value": "active"
      },
      {
        "field": "score",
        "operation": "greaterThan",
        "value": 80
      }
    ]
  }
}
```

## 4. Move Binary Data Node

### 4.1 Configuración Técnica
```typescript
interface MoveBinaryDataConfiguration {
  mode: 'jsonToBinary' | 'binaryToJson';
  property: string;
  options: {
    keepSource: boolean;
    encoding: string;
  };
}
```

### 4.2 Casos de Uso

#### 4.2.1 Conversión JSON a Binario
```javascript
// Ejemplo: Datos a archivo
{
  "mode": "jsonToBinary",
  "property": "fileData",
  "options": {
    "keepSource": false,
    "encoding": "base64"
  }
}
```

#### 4.2.2 Conversión Binario a JSON
```javascript
// Ejemplo: Archivo a datos
{
  "mode": "binaryToJson",
  "property": "content",
  "options": {
    "keepSource": true,
    "encoding": "utf8"
  }
}
```

## Mejores Prácticas

### 1. Optimización con Python
- Utilizar pandas para operaciones masivas
- Aprovechar numpy para cálculos vectorizados
- Implementar procesamiento paralelo con multiprocessing
- Gestionar eficientemente la memoria
- Utilizar generadores para grandes conjuntos de datos

### 2. Gestión de Dependencias
- Mantener un requirements.txt actualizado
```python
# requirements.txt
pandas>=1.5.0
numpy>=1.21.0
scikit-learn>=1.0.0
requests>=2.28.0
python-dotenv>=0.19.0
```
- Utilizar entornos virtuales
- Documentar versiones específicas
- Gestionar conflictos de dependencias

### 3. Manejo de Datos en Python
- Validación con pydantic
```python
from pydantic import BaseModel, validator

class DataModel(BaseModel):
    id: str
    value: float
    category: str
    
    @validator('value')
    def validate_value(cls, v):
        if v < 0:
            raise ValueError('Value must be positive')
        return v
```
- Sanitización de inputs
- Manejo de tipos con typing
- Control de excepciones específicas

### 4. Integración y Testing
- Implementar tests unitarios con pytest
- Documentar con docstrings
- Logging estructurado
- Control de versiones del código

### 5. Consideraciones de Rendimiento
- Monitoreo de uso de memoria
- Profiling de código Python
- Optimización de queries pandas
- Gestión de caché

## Referencias

1. [Documentación de Transformación](https://docs.n8n.io/nodes/core-nodes/)
2. [Mejores Prácticas](https://docs.n8n.io/workflows/best-practices/)
3. [Patrones de Transformación](https://docs.n8n.io/workflows/)
