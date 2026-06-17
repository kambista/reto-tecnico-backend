# Kambista - Sistema de Gestión de Transacciones

API REST para la gestión de transacciones comerciales con soporte para carga masiva de datos.

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Supuestos de Desarrollo](#supuestos-de-desarrollo)

## 🔧 Instalación

1. **Configurar variables de entorno**

   Copia el archivo de ejemplo a `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Modificar variables de entorno (Opcional)**

   Abre el archivo `.env` y modifica los valores según tus necesidades:
   ```env
   # APP
   NODE_ENV=development
   PORT=3000

   # DATABASE - Cambiar si lo deseas
   MONGO_USER=root
   MONGO_PASSWORD=examplepassword  # ⚠️ Cambiar para producción
   DB_NAME=myapp
   MONGO_HOST=mongodb
   MONGO_PORT=27017
   MONGO_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin
   ```

   **⚠️ Para Producción:**
   - Cambia `MONGO_PASSWORD` a una contraseña fuerte
   - Establece `NODE_ENV=production`

## 🚀 Ejecución

### Levantar la Aplicación con Docker

Con las variables de entorno configuradas, ejecuta:

```bash
docker compose up --build -d
```

### Verificar que los Servicios están Corriendo

```bash
docker compose ps
```

Deberías ver dos servicios corriendo:
- `app` en puerto `3000`
- `mongodb` en puerto `27017`

### Acceder a la Aplicación

- **API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Detener la Aplicación

```bash
docker compose down
```

### Ver Logs

```bash
docker compose logs -f app  # Logs de la aplicación
docker compose logs -f mongodb  # Logs de MongoDB
```

---

## 🧪 Tests

### Ejecutar Tests

```bash
npm test
```

### Rutas de Tests

#### Tests E2E
- **`src/features/transaction/presentation/route.test.ts`** - Tests de endpoints HTTP

#### Tests Unitarios
- **`src/features/transaction/domain/entities/transaction.entity.test.ts`** - Tests de la entidad Transaction
- **`src/features/transaction/application/dtos/register-transaction-input.dto.impl.test.ts`** - Tests del DTO de validación

### Casos de Prueba

#### Transaction Entity (`transaction.entity.test.ts`)
- Deberia crear una transaccion con propiedades validas
- Deberia convertir USD a PEN correctamente
- Deberia lanzar un error cuando se intenta convertir USD a PEN con un tipo de operación incorrecto

#### RegisterTransactionInputDTO (`register-transaction-input.dto.impl.test.ts`)
- Deberia crear una instancia de RegisterTransactionInputDTOImpl con propiedades validas
- Deberia retornar errores de validacion si el customerId es invalido
- Deberia retornar errores de validacion si el amountUsd no es numerico
- Deberia retornar errores de validacion si el amountUsd es menor a cero
- Deberia retornar errores de validacion si el amountUsd es igual a cero

#### Transaction Routes E2E (`route.test.ts`)
- Registrar una transacción
- Registrar una transacción con datos inválidos
- Obtener una transacción
- No existe la transacción

---

## 🏗️ Decisiones Técnicas

### Flujo de Validación de Archivos Excel/CSV

El upload de transacciones implementa un proceso de **dos fases**:

#### **Fase 1: Validación**
Cuando se carga un archivo, primero se valida cada fila:
- Se verifica que los datos sean válidos
- Si hay errores, se recopilan sin interrumpir el procesamiento
- Se retorna un array con todos los errores encontrados

#### **Fase 2: Registro (Solo si no hay errores)**
Si la validación es exitosa (sin errores):
- Se registran todas las transacciones en la base de datos
- Se retorna confirmación del registro

#### Ejemplo de Respuesta con Errores

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/transactions/upload \
  -F "file=@transactions.csv"
```

**Response (HTTP 400):**
```json
{
    "success": false,
    "errors": [
        "Fila 3: customerId is not valid"
    ]
}
```

#### Ejemplo de Respuesta Exitosa

**Response (HTTP 201):**
```json
[
    {
        "transactionId": "6a3222f1c0b579ffbe58269c",
        "customerId": "6a30db37f65c98f64050a327",
        "exchangeRate": 3.75,
        "amountUsd": 100,
        "amountPen": 375,
        "status": "completed"
    },
    {
        "transactionId": "6a3222f1c0b579ffbe58269d",
        "customerId": "6a30db37f65c98f64050a327",
        "exchangeRate": 3.75,
        "amountUsd": 250,
        "amountPen": 937.5,
        "status": "completed"
    }
]
```

---

## 📝 Notas

### Herramientas de Asistencia Utilizadas

- **Documentación Swagger**: Desarrollada con asistencia de Claude
- **Tests**: Desarrollados con asistencia del autocompletado de Copilot
- **MongoMemoryServer**: Instalación y configuración con asistencia de Gemini y Medium
- **Configuración TypeScript**: Configuración con asistencia de Gemini y Medium

