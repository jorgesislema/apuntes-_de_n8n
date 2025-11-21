# Python en n8n: Guía Completa

## Introducción

Esta guía detalla las diferentes formas de utilizar Python en n8n, abarcando desde procesamiento de datos hasta integraciones avanzadas y análisis científico.

## 1. Áreas de Aplicación

### 1.1 Procesamiento de Datos
```python
# Function Node: Transformación de Datos
import pandas as pd
import numpy as np

def transform_data():
    # Obtener datos
    items = $input.all()
    
    # Crear DataFrame
    df = pd.DataFrame([item['json'] for item in items])
    
    # Transformaciones
    df['fecha'] = pd.to_datetime(df['fecha'])
    df['valor_normalizado'] = (df['valor'] - df['valor'].mean()) / df['valor'].std()
    
    return df.to_dict('records')
```

### 1.2 Análisis Científico
```python
# Function Node: Análisis Estadístico
from scipy import stats
import seaborn as sns
import matplotlib.pyplot as plt

def analyze_data():
    items = $input.all()
    data = [item['json']['value'] for item in items]
    
    # Análisis estadístico
    stats_result = {
        'mean': np.mean(data),
        'std': np.std(data),
        'skew': stats.skew(data),
        'kurtosis': stats.kurtosis(data)
    }
    
    # Visualización
    plt.figure(figsize=(10, 6))
    sns.histplot(data)
    plt.savefig('/tmp/distribution.png')
    
    return {
        'statistics': stats_result,
        'visualization': {
            'binary': open('/tmp/distribution.png', 'rb').read()
        }
    }
```

### 1.3 Machine Learning
```python
# Function Node: Predicción con Modelo
from sklearn.ensemble import RandomForestClassifier
import joblib

def predict():
    # Cargar modelo pre-entrenado
    model = joblib.load('model.pkl')
    
    # Preparar datos
    items = $input.all()
    features = np.array([item['json']['features'] for item in items])
    
    # Realizar predicciones
    predictions = model.predict_proba(features)
    
    return [
        {
            'id': item['json']['id'],
            'prediction': pred.tolist()
        }
        for item, pred in zip(items, predictions)
    ]
```

## 2. Integración con Servicios

### 2.1 APIs y Web Services
```python
# Function Node: Integración con APIs
import requests
from datetime import datetime

def fetch_and_process():
    # Configuración
    api_url = $env.API_URL
    headers = {
        "Authorization": f"Bearer {$env.API_TOKEN}"
    }
    
    # Llamada a API
    response = requests.get(api_url, headers=headers)
    data = response.json()
    
    # Procesamiento
    processed_data = [
        {
            "id": item["id"],
            "processed_at": datetime.now().isoformat(),
            "data": process_item(item)
        }
        for item in data
    ]
    
    return processed_data
```

### 2.2 Bases de Datos
```python
# Function Node: Operaciones con Base de Datos
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

def database_operations():
    # Conexión
    engine = sa.create_engine($env.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Consulta
        result = session.execute(
            sa.text("SELECT * FROM table WHERE status = :status"),
            {"status": "active"}
        )
        
        return [dict(row) for row in result]
    finally:
        session.close()
```

## 3. Procesamiento de Archivos

### 3.1 Excel y CSV
```python
# Function Node: Procesamiento de Excel
import openpyxl
import io

def process_excel():
    # Obtener archivo binario
    binary_data = $input.first().binary['data']
    
    # Leer Excel
    wb = openpyxl.load_workbook(io.BytesIO(binary_data))
    sheet = wb.active
    
    # Procesar datos
    data = []
    for row in sheet.iter_rows(min_row=2, values_only=True):
        data.append({
            "column1": row[0],
            "column2": row[1]
        })
    
    return data
```

### 3.2 Documentos PDF
```python
# Function Node: Extracción de PDF
import PyPDF2
import io

def extract_pdf_text():
    # Obtener PDF
    pdf_data = $input.first().binary['data']
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_data))
    
    # Extraer texto
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    
    return {"text": text}
```

## 4. Mejores Prácticas

### 4.1 Gestión de Dependencias
```python
# requirements.txt
pandas>=1.5.0
numpy>=1.21.0
scikit-learn>=1.0.0
requests>=2.28.0
sqlalchemy>=1.4.0
openpyxl>=3.0.0
PyPDF2>=3.0.0
python-dotenv>=0.19.0
```

### 4.2 Manejo de Errores
```python
# Function Node: Manejo de Errores
def safe_process():
    try:
        # Código principal
        result = process_data()
        return {"success": True, "data": result}
    except Exception as e:
        # Logging estructurado
        logging.error(f"Error: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": {
                "message": str(e),
                "type": type(e).__name__,
                "timestamp": datetime.now().isoformat()
            }
        }
```

## 5. Testing y Validación

### 5.1 Testing Unitario
```python
# test_functions.py
import pytest

def test_data_transformation():
    # Datos de prueba
    test_data = [{"json": {"value": 10}}]
    
    # Ejecutar transformación
    result = transform_data(test_data)
    
    # Validar resultado
    assert len(result) == 1
    assert "valor_normalizado" in result[0]
```

## Referencias

1. [Documentación de n8n Python](https://docs.n8n.io/nodes/core-nodes/function/)
2. [pandas Documentation](https://pandas.pydata.org/docs/)
3. [scikit-learn Documentation](https://scikit-learn.org/stable/)
