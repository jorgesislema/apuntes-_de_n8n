# Procesamiento con Python en n8n

## Descripción Técnica

Este documento detalla patrones y soluciones específicas para el procesamiento de datos utilizando Python en n8n, enfocándose en casos de uso avanzados y optimización de rendimiento.

## 1. Procesamiento de Datos Masivos

### 1.1 Chunking y Procesamiento Paralelo
```python
from concurrent.futures import ThreadPoolExecutor
import pandas as pd
import numpy as np

def process_chunk(chunk):
    # Procesamiento por chunk
    processed = chunk.apply(complex_transformation)
    return processed

def process_large_dataset():
    # Obtener datos
    items = $input.all()
    df = pd.DataFrame([item['json'] for item in items])
    
    # Dividir en chunks
    chunks = np.array_split(df, 4)
    
    # Procesamiento paralelo
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(process_chunk, chunks))
    
    # Combinar resultados
    final_df = pd.concat(results)
    return final_df.to_dict('records')
```

### 1.2 Procesamiento en Memoria
```python
import dask.dataframe as dd

def process_large_file():
    # Leer datos con Dask
    ddf = dd.read_csv('large_file.csv')
    
    # Procesamiento distribuido
    result = (ddf
        .map_partitions(transform_partition)
        .compute(scheduler='threads'))
    
    return result.to_dict('records')
```

## 2. Análisis de Datos Científicos

### 2.1 Análisis Estadístico Avanzado
```python
from scipy import stats
import pandas as pd
import numpy as np

def analyze_distribution():
    # Obtener datos
    items = $input.all()
    data = pd.DataFrame([item['json'] for item in items])
    
    # Análisis estadístico
    analysis = {
        'descriptive': data.describe().to_dict(),
        'correlation': data.corr().to_dict(),
        'normality_test': {
            col: stats.normaltest(data[col])._asdict()
            for col in data.select_dtypes(include=[np.number]).columns
        }
    }
    
    return analysis
```

### 2.2 Machine Learning Pipeline
```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

def train_and_evaluate():
    # Preparar datos
    items = $input.all()
    data = pd.DataFrame([item['json'] for item in items])
    X = data.drop('target', axis=1)
    y = data['target']
    
    # Crear pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier())
    ])
    
    # Evaluación
    scores = cross_val_score(pipeline, X, y, cv=5)
    
    return {
        'model_scores': {
            'mean': scores.mean(),
            'std': scores.std(),
            'scores': scores.tolist()
        }
    }
```

## 3. Integración con APIs

### 3.1 APIs REST
```python
import requests
import asyncio
import aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.json()

async def fetch_multiple_apis():
    # Configuración
    urls = $input.first().json['urls']
    
    # Fetch paralelo
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    
    return {
        'results': results,
        'summary': summarize_results(results)
    }
```

### 3.2 WebSockets
```python
import websockets
import json

async def websocket_client():
    uri = $env.WEBSOCKET_URL
    async with websockets.connect(uri) as websocket:
        # Enviar datos
        await websocket.send(json.dumps({
            'type': 'subscribe',
            'channel': 'data_feed'
        }))
        
        # Recibir respuesta
        response = await websocket.recv()
        return json.loads(response)
```

## 4. Procesamiento de Archivos

### 4.1 Excel Avanzado
```python
import pandas as pd
from openpyxl.styles import PatternFill, Font
from openpyxl.utils.dataframe import dataframe_to_rows

def create_report():
    # Procesar datos
    data = process_data()
    df = pd.DataFrame(data)
    
    # Crear Excel
    writer = pd.ExcelWriter('report.xlsx', engine='openpyxl')
    df.to_excel(writer, sheet_name='Data')
    
    # Aplicar formato
    workbook = writer.book
    worksheet = writer.sheets['Data']
    
    for cell in worksheet['A1:Z1']:
        for c in cell:
            c.fill = PatternFill('solid', fgColor='1E88E5')
            c.font = Font(color='FFFFFF', bold=True)
    
    writer.save()
    
    return {
        'binary': {
            'data': open('report.xlsx', 'rb').read(),
            'mimeType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    }
```

### 4.2 PDF Processing
```python
from PyPDF2 import PdfReader, PdfWriter
from io import BytesIO

def process_pdfs():
    # Obtener PDFs
    items = $input.all()
    pdf_data = [BytesIO(item['binary']['data']) for item in items]
    
    # Procesar cada PDF
    results = []
    for pdf in pdf_data:
        reader = PdfReader(pdf)
        # Extraer texto y metadatos
        metadata = reader.metadata
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        
        results.append({
            'metadata': metadata,
            'text': text,
            'pages': len(reader.pages)
        })
    
    return results
```

## 5. Optimización y Rendimiento

### 5.1 Monitoreo de Recursos
```python
import psutil
import time

def monitor_resources():
    start_time = time.time()
    start_memory = psutil.Process().memory_info().rss
    
    # Ejecutar proceso principal
    result = main_process()
    
    # Métricas
    end_time = time.time()
    end_memory = psutil.Process().memory_info().rss
    
    return {
        'result': result,
        'metrics': {
            'execution_time': end_time - start_time,
            'memory_used': end_memory - start_memory,
            'cpu_percent': psutil.cpu_percent()
        }
    }
```

### 5.2 Caching
```python
from functools import lru_cache
import hashlib
import json

@lru_cache(maxsize=100)
def cached_process(data_key):
    # Proceso costoso
    result = expensive_computation()
    return result

def process_with_cache():
    items = $input.all()
    
    # Generar key para cache
    data_key = hashlib.md5(
        json.dumps(items, sort_keys=True).encode()
    ).hexdigest()
    
    return cached_process(data_key)
```

## Referencias

1. [pandas Documentation](https://pandas.pydata.org/docs/)
2. [scikit-learn Documentation](https://scikit-learn.org/stable/)
3. [asyncio Documentation](https://docs.python.org/3/library/asyncio.html)
4. [PyPDF2 Documentation](https://pypdf2.readthedocs.io/)
