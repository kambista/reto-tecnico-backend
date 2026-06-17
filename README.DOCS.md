# Kambista Backend Challenge

## Descripción

Servicio backend para registrar y consultar operaciones de cambio de divisas, incluyendo procesamiento masivo mediante archivos CSV.

## Tecnologías utilizadas

* NestJS
* TypeScript
* MongoDB
* Mongoose
* Docker
* Swagger
* Jest

## Arquitectura

Se implementó una arquitectura inspirada en Hexagonal Architecture (Ports & Adapters), separando responsabilidades en capas.

```text
src/
├── exchange
│   ├── application
│   ├── domain
│   ├── infrastructure
│   └── dto
├── common
│   ├── constants
│   └── pipes
```

### Application

Contiene los casos de uso de la aplicación y coordina las operaciones del dominio.

### Domain

Contiene las entidades de negocio y los contratos (interfaces) de persistencia.

### Infrastructure

Contiene implementaciones concretas de acceso a datos y adaptadores externos.

### DTO

Contiene los contratos de entrada y salida de la API.

## Instalación

```bash
npm install
```

## Variables de entorno

```env
MONGODB_URI=mongodb://localhost:27017/kambista
PORT=3000
```

## Ejecución local

```bash
npm run start:dev
```

## Docker

```bash
docker compose up --build
```

## Documentación Swagger

Disponible en:

http://localhost:3000/api/docs

## Testing

Ejecutar pruebas unitarias:

```bash
npm run test
```

Ejecutar pruebas e2e:

```bash
npm run test:e2e
```

## Endpoints

### Crear operación

POST /exchange

### Obtener operación

GET /exchange/:id

### Procesar CSV

POST /exchange/upload

## Decisiones técnicas

* Se utilizó una arquitectura inspirada en Hexagonal Architecture para desacoplar la lógica de negocio de la persistencia.
* Se implementó el patrón Repository para abstraer el acceso a datos.
* Se eligió MongoDB por simplicidad y flexibilidad en el almacenamiento de documentos.
* Se utilizó Decimal.js para evitar errores de precisión en operaciones monetarias.
* Se implementó carga masiva mediante archivos CSV.
* Se utilizó UUID como identificador externo de las transacciones.
* Se documentó la API mediante Swagger.
* Se implementaron pruebas unitarias para validar la lógica principal.

## Supuestos

* El tipo de cambio utilizado es fijo: 3.75.
* Solo se soporta conversión USD → PEN.
* Todas las operaciones se registran con estado COMPLETED.
