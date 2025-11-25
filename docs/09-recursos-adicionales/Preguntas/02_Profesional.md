# Preguntas de Entrevista n8n – Nivel Profesional

A continuación se presentan preguntas y respuestas de nivel profesional para entrevistas técnicas sobre n8n. Cada pregunta está acompañada de una respuesta clara y profesional.

---

**1. ¿Cómo implementarías un workflow que procese datos en tiempo real usando n8n?**

Utilizaría nodos de Webhook o Trigger para recibir datos en tiempo real, procesaría la información con nodos Code o Set, y almacenaría los resultados en una base de datos o enviaría notificaciones según la lógica de negocio.

---

**2. ¿Qué estrategias usarías para manejar errores y reintentos en workflows críticos?**

Implementaría nodos de control de flujo como IF, Try-Catch en nodos Code, y configuraría reintentos automáticos en los nodos que lo permitan. Además, registraría los errores para su posterior análisis.

---

**3. ¿Cómo optimizarías un workflow que procesa grandes volúmenes de datos?**

Dividiría el procesamiento en lotes usando SplitInBatches, optimizaría el uso de memoria y paralelizaría tareas cuando sea posible.

---

**4. ¿Cómo versionarías y documentarías workflows en un equipo grande?**

Usaría control de versiones (Git), documentaría cada workflow y nodo, y establecería convenciones de nombres y comentarios claros.

---

**5. ¿Cómo asegurarías la seguridad de las credenciales en n8n?**

Nunca hardcodearía credenciales, usaría el sistema de credenciales seguro de n8n y restringiría el acceso según roles.

---

**6. ¿Cómo integrarías n8n con un sistema legacy que no tiene API?**

Usaría scraping, conectores de base de datos, o automatización de correo/FTP según el caso.

---

**7. ¿Cómo harías logging y monitoreo de workflows en producción?**

Configurar logs, alertas, y usar herramientas externas de monitoreo como Prometheus, Grafana o Sentry.

---

**8. ¿Cómo manejarías la paginación de una API en n8n?**

Implementaría una solución robusta utilizando el siguiente enfoque:

1. Configuración inicial:
```typescript
interface PaginationConfig {
    pageSize: number;
    maxPages?: number;
    pageParam: string;
    totalParam?: string;
}

class PaginationHandler {
    private config: PaginationConfig;
    private currentPage: number = 1;
    private hasMore: boolean = true;
    
    async processAllPages(apiCall: (page: number) => Promise<any>): Promise<any[]> {
        const results = [];
        
        while (this.hasMore && (!this.config.maxPages || this.currentPage <= this.config.maxPages)) {
            const response = await apiCall(this.currentPage);
            results.push(...response.data);
            
            this.hasMore = this.checkHasMore(response);
            this.currentPage++;
            
            // Rate limiting consideración
            await new Promise(r => setTimeout(r, 1000));
        }
        
        return results;
    }
}
```

2. Implementación con SplitInBatches para gestión de memoria.
3. Manejo de errores y reintentos con backoff exponencial.
4. Monitorización de límites de API y rate limiting.

---

**9. ¿Cómo harías pruebas unitarias de workflows en n8n?**

Implementaría una estrategia de testing completa:

1. Framework de Testing:
```typescript
interface WorkflowTest {
    name: string;
    input: any;
    expectedOutput: any;
    setup?: () => Promise<void>;
    teardown?: () => Promise<void>;
}

class WorkflowTester {
    async runTest(test: WorkflowTest): Promise<TestResult> {
        try {
            if (test.setup) await test.setup();
            
            const result = await this.executeWorkflow(test.input);
            const validation = this.validateOutput(result, test.expectedOutput);
            
            if (test.teardown) await test.teardown();
            
            return {
                success: validation.success,
                message: validation.message,
                actual: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error
            };
        }
    }
}
```

2. Mocking de servicios externos usando nodos Code.
3. Fixtures y datos de prueba estandarizados.
4. Pipeline de CI/CD para ejecución automatizada.

---

**10. ¿Cómo automatizarías el despliegue de workflows en diferentes entornos?**

Implementaría un sistema de despliegue automatizado:

1. Pipeline de CI/CD:
```yaml
# .github/workflows/n8n-deploy.yml
name: N8N Deployment
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Workflows
        run: |
          # Exportar workflows
          n8n export:workflow --all --output=workflows.json
          
          # Transformar variables de entorno
          node transform-env.js
          
          # Desplegar a entorno específico
          n8n import:workflow --input=workflows.json
```

2. Gestión de configuración:
```typescript
interface EnvironmentConfig {
    apiUrls: Record<string, string>;
    credentials: Record<string, string>;
    settings: Record<string, any>;
}

class ConfigurationManager {
    async transformConfig(
        workflow: any, 
        targetEnv: string
    ): Promise<any> {
        // Reemplazar variables según entorno
        return this.replaceEnvironmentVariables(
            workflow, 
            this.getEnvConfig(targetEnv)
        );
    }
}
```

3. Control de versiones de workflows.
4. Scripts de validación post-despliegue.

---

**11. ¿Cómo manejarías workflows dependientes entre sí?**

Implementaría un sistema de orquestación:

1. Gestor de Dependencias:
```typescript
interface WorkflowDependency {
    id: string;
    prerequisites: string[];
    timeout: number;
    retryPolicy: RetryConfig;
}

class WorkflowOrchestrator {
    private dependencies: Map<string, WorkflowDependency>;
    private messageQueue: MessageQueue;
    
    async scheduleWorkflow(workflowId: string): Promise<void> {
        const dependency = this.dependencies.get(workflowId);
        await this.ensurePrerequisites(dependency);
        
        // Publicar evento de inicio
        await this.messageQueue.publish('workflow.start', {
            workflowId,
            timestamp: new Date(),
            correlationId: uuid()
        });
    }
}
```

2. Sistema de mensajería para comunicación asíncrona.
3. Monitorización de estado y progreso.
4. Manejo de fallos en cascada.

---

**12. ¿Cómo asegurarías la trazabilidad de los datos procesados?**

Implementaría un sistema completo de auditoría:

1. Sistema de Trazabilidad:
```typescript
interface AuditRecord {
    id: string;
    timestamp: Date;
    workflowId: string;
    nodeId: string;
    input: any;
    output: any;
    metadata: {
        duration: number;
        status: string;
        user: string;
    };
}

class DataTracker {
    async trackExecution(
        context: ExecutionContext,
        data: any
    ): Promise<void> {
        const record: AuditRecord = {
            id: uuid(),
            timestamp: new Date(),
            workflowId: context.workflowId,
            nodeId: context.nodeId,
            input: this.sanitizeData(data.input),
            output: this.sanitizeData(data.output),
            metadata: this.getExecutionMetadata(context)
        };
        
        await this.persistAuditRecord(record);
    }
}
```

2. Almacenamiento seguro de logs estructurados.
3. Sistema de consulta y análisis de trazas.
4. Herramientas de visualización de flujo de datos.

---

**13. ¿Cómo manejarías la autenticación OAuth2 en n8n?**

Configurar credenciales OAuth2 en n8n y seguir el flujo de autorización estándar para obtener y refrescar tokens.

---

**14. ¿Cómo implementarías un workflow multiusuario seguro?**

Usaría control de acceso basado en roles y segmentaría los datos y workflows por usuario.

---

**15. ¿Cómo manejarías workflows que requieren aprobación manual?**

Implementaría nodos Wait y notificaciones para pausar el flujo hasta recibir la aprobación.

---

**16. ¿Cómo harías rollback de acciones en caso de error?**

Implementaría lógica de compensación en nodos Code o workflows de reversión.

---

**17. ¿Cómo optimizarías el uso de APIs con límites de rate limit?**

Implementaría control de reintentos, esperas (Wait) y manejo de errores específicos de rate limit.

---

**18. ¿Cómo gestionarías la rotación de credenciales?**

Automatizaría la actualización de credenciales y notificaría a los administradores cuando sea necesario.

---

**19. ¿Cómo asegurarías la integridad de los datos procesados?**

Validaría los datos en cada paso y usaría checksums o hashes cuando sea necesario.

---

**20. ¿Cómo manejarías workflows que requieren alta disponibilidad?**

Desplegaría n8n en clúster, balancearía carga y configuraría failover y backups automáticos.

---

**21. ¿Cómo implementarías un sistema de notificaciones en tiempo real?**

Usaría nodos de WebSocket o servicios de terceros como Firebase Cloud Messaging para enviar notificaciones instantáneas.

---

**22. ¿Qué consideraciones tendrías al trabajar con datos sensibles?**

Cumpliría con normativas de protección de datos, usaría encriptación y limitaría el acceso a la información sensible.

---

**23. ¿Cómo manejarías la concurrencia en la ejecución de workflows?**

Configurar límites de concurrencia en n8n y diseñar workflows idempotentes que puedan manejar ejecuciones múltiples sin efectos adversos.

---

**24. ¿Cómo integrarías n8n con servicios de mensajería como Slack o Microsoft Teams?**

Usaría nodos específicos para cada servicio o APIs webhooks para enviar y recibir mensajes.

---

**25. ¿Cómo implementarías un sistema de caché para mejorar el rendimiento?**

Usaría nodos de caché en memoria o bases de datos rápidas como Redis para almacenar resultados intermedios.

---

**26. ¿Cómo manejarías la deserialización de datos complejos en n8n?**

Usaría nodos Code para transformar datos en formatos complejos a estructuras más simples y manejables.

---

**27. ¿Cómo asegurarías la disponibilidad e integridad del sistema n8n?**

Desplegaría en un entorno redundante, haría backups regulares y monitorearía la salud del sistema constantemente.

---

**28. ¿Cómo implementarías un sistema de auditoría para los workflows?**

Registrar cada ejecución de workflow, incluyendo entradas, salidas y errores, para permitir auditorías posteriores.

---

**29. ¿Qué técnicas usarías para la limpieza y preparación de datos en n8n?**

Usaría nodos de transformación como Set, Rename, y funciones en nodos Code para limpiar y preparar datos.

---

**30. ¿Cómo manejarías la integración de n8n con bases de datos no relacionales?**

Usaría nodos específicos para cada tipo de base de datos o conectores genéricos como el nodo HTTP Request.

---

**31. ¿Cómo implementarías un sistema de control de calidad de datos?**

Validar datos contra reglas de negocio y rangos esperados, y registrar o corregir datos que no cumplan con los criterios.

---

**32. ¿Cómo manejarías la comunicación entre microservicios usando n8n?**

Usaría nodos HTTP Request o gRPC para comunicarme con otros microservicios de manera eficiente.

---

**33. ¿Cómo asegurarías la escalabilidad de los workflows en n8n?**

Diseñaría workflows eficientes, usaría colas para desacoplar componentes y escalaría horizontalmente los nodos que lo requieran.

---

**34. ¿Cómo implementarías un sistema de gestión de errores centralizado?**

Usaría un workflow dedicado a manejar errores, recibir notificaciones y registrar detalles del error para su análisis.

---

**35. ¿Qué consideraciones tendrías al trabajar con APIs de terceros?**

Revisar la documentación, manejar límites de uso, y asegurarme de que la API tenga el rendimiento y la fiabilidad necesarias.

---

(Otras preguntas pueden ser añadidas siguiendo el mismo formato para llegar a 100 si es necesario)
