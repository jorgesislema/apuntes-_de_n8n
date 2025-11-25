# Testing con Python en n8n

## Descripción Técnica

Este documento detalla las estrategias y mejores prácticas para implementar testing utilizando Python en workflows de n8n.

## 1. Testing Unitario

### 1.1 Configuración de Testing
```python
# test_config.py
import pytest
import json
from typing import Dict, Any

class MockWorkflowContext:
    def __init__(self, input_data: Dict[str, Any]):
        self.input_data = input_data
    
    def all(self):
        return self.input_data

def create_test_input(data: Dict[str, Any]):
    return MockWorkflowContext([{'json': data}])
```

### 1.2 Tests de Funciones
```python
# test_transformations.py
import pytest
from .transformations import process_data

def test_data_transformation():
    # Preparar datos de prueba
    test_input = create_test_input({
        'value': 100,
        'category': 'test'
    })
    
    # Ejecutar transformación
    result = process_data(test_input)
    
    # Validar resultado
    assert result is not None
    assert 'processed_value' in result
    assert result['processed_value'] == 100 * 1.5
```

## 2. Testing de Integración

### 2.1 Mock de APIs
```python
# test_api_integration.py
import pytest
import responses
from .api_client import fetch_external_data

@responses.activate
def test_api_integration():
    # Configurar mock
    responses.add(
        responses.GET,
        'https://api.example.com/data',
        json={'data': [{'id': 1, 'value': 'test'}]},
        status=200
    )
    
    # Ejecutar función
    result = fetch_external_data()
    
    # Validar respuesta
    assert len(result) == 1
    assert result[0]['id'] == 1
```

### 2.2 Mock de Base de Datos
```python
# test_database.py
import pytest
from unittest.mock import patch, MagicMock
from .database_ops import fetch_records

@pytest.fixture
def mock_db_connection():
    with patch('sqlalchemy.create_engine') as mock_engine:
        # Configurar mock
        mock_connection = MagicMock()
        mock_engine.return_value.connect.return_value = mock_connection
        
        # Configurar resultados
        mock_results = [
            {'id': 1, 'name': 'Test 1'},
            {'id': 2, 'name': 'Test 2'}
        ]
        mock_connection.execute.return_value = mock_results
        
        yield mock_connection

def test_database_operations(mock_db_connection):
    # Ejecutar función
    results = fetch_records()
    
    # Validar resultados
    assert len(results) == 2
    assert results[0]['name'] == 'Test 1'
```

## 3. Testing de Performance

### 3.1 Medición de Rendimiento
```python
# test_performance.py
import pytest
import time
import psutil
from .data_processor import process_large_dataset

def test_performance():
    # Preparar datos de prueba
    large_dataset = generate_test_data(1000)
    
    # Medir tiempo y memoria
    start_time = time.time()
    start_memory = psutil.Process().memory_info().rss
    
    # Ejecutar procesamiento
    result = process_large_dataset(large_dataset)
    
    # Calcular métricas
    execution_time = time.time() - start_time
    memory_used = psutil.Process().memory_info().rss - start_memory
    
    # Validar límites
    assert execution_time < 5.0  # máximo 5 segundos
    assert memory_used < 500_000_000  # máximo 500MB
```

### 3.2 Testing de Concurrencia
```python
# test_concurrent.py
import pytest
import asyncio
from .async_processor import process_concurrent

async def test_concurrent_processing():
    # Preparar datos
    test_items = [{'id': i} for i in range(100)]
    
    # Ejecutar procesamiento concurrente
    results = await process_concurrent(test_items)
    
    # Validar resultados
    assert len(results) == 100
    assert all(isinstance(r, dict) for r in results)
```

## 4. Testing de Workflows

### 4.1 Simulación de Workflows
```python
# test_workflow.py
from .workflow_simulator import WorkflowSimulator

def test_complete_workflow():
    # Configurar simulador
    simulator = WorkflowSimulator()
    
    # Definir workflow
    workflow = [
        ('HTTP Request', {'url': 'https://api.example.com/data'}),
        ('Function', {'code': 'return process_data($input)'}),
        ('Set', {'value': '{{ $json.processed }}'}),
    ]
    
    # Ejecutar simulación
    result = simulator.run(workflow)
    
    # Validar resultado final
    assert result.success
    assert 'processed' in result.output
```

### 4.2 Testing de Error Handling
```python
# test_error_handling.py
import pytest
from .error_handler import handle_workflow_error

def test_error_handling():
    # Simular error
    test_error = ValueError("Test error")
    
    # Ejecutar handler
    result = handle_workflow_error(test_error)
    
    # Validar manejo de error
    assert result['success'] == False
    assert 'error' in result
    assert result['error']['type'] == 'ValueError'
```

## 5. Testing de Seguridad

### 5.1 Validación de Inputs
```python
# test_security.py
import pytest
from .input_validator import validate_input

def test_input_validation():
    # Probar inputs maliciosos
    malicious_inputs = [
        "'; DROP TABLE users; --",
        "<script>alert('xss')</script>",
        "../../../etc/passwd"
    ]
    
    # Validar cada input
    for input_data in malicious_inputs:
        with pytest.raises(ValueError):
            validate_input(input_data)
```

### 5.2 Testing de Autenticación
```python
# test_auth.py
import pytest
from .auth_handler import verify_token

def test_token_verification():
    # Token de prueba
    test_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    
    # Verificar token válido
    result = verify_token(test_token)
    assert result['valid'] == True
    
    # Verificar token inválido
    with pytest.raises(ValueError):
        verify_token("invalid_token")
```

## Referencias

1. [pytest Documentation](https://docs.pytest.org/)
2. [Python Testing Best Practices](https://docs.python-guide.org/writing/tests/)
3. [n8n Function Node Documentation](https://docs.n8n.io/nodes/n8n-nodes-base.function/)
