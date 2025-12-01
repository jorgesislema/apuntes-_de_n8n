# 📊 Módulo 16: Ciencia e Ingeniería de Datos

n8n es una herramienta poderosa para orquestar pipelines de datos (ETL/ELT) y realizar análisis ligeros.

## Contenido
1. **ETL Pipelines (Extract, Transform, Load)**
   - Extracción de múltiples fuentes (APIs, SQL, CSV).
   - Transformación con Python (Pandas).
   - Carga en Data Warehouses (Snowflake, BigQuery, Postgres).
2. **Análisis de Datos con Python**
   - Uso del nodo `Code` en modo Python.
   - Librerías disponibles: `pandas`, `numpy` (si se habilitan en self-hosted).
3. **Bases de Datos**
   - SQL (Postgres, MySQL) vs NoSQL (MongoDB, Firebase).
   - Ejecución de queries complejas y migraciones.

## Ejemplo: ETL Simple con Python

### Escenario
Leer un CSV de una URL, limpiar datos con Pandas y guardar en PostgreSQL.

### Código Python (Nodo Code)
```python
import pandas as pd
import io

# 1. Obtener datos del nodo anterior (HTTP Request)
csv_content = _input.item.json['data']

# 2. Crear DataFrame
df = pd.read_csv(io.StringIO(csv_content))

# 3. Limpieza: Eliminar filas vacías y convertir fechas
df.dropna(inplace=True)
df['fecha'] = pd.to_datetime(df['fecha'])

# 4. Filtrar ventas mayores a 100
df_high_value = df[df['monto'] > 100]

# 5. Devolver a n8n (convertir a dict)
return df_high_value.to_dict(orient='records')
```

## Configuración de Docker para Python
Para usar librerías externas como `pandas` en n8n self-hosted, debes configurar la variable de entorno:

```bash
NODE_FUNCTION_ALLOW_EXTERNAL=pandas,numpy,scipy
```
O permitir todas:
```bash
NODE_FUNCTION_ALLOW_EXTERNAL=*
```
