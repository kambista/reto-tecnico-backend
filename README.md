# Kambista Backend Developer Challenge

👋 ¡Hola!

Somos Kambista y estamos buscando un nuevo miembro para nuestro equipo de tecnología.

Para esta etapa hemos preparado un reto técnico enfocado en desarrollo backend. El objetivo es evaluar tu capacidad para diseñar APIs, procesar información, validar datos y escribir código mantenible.

## Objetivo

Construir un servicio backend simplificado para procesar operaciones de cambio de divisas.

## Tecnologías

### Requeridas

- Node.js
- TypeScript
- NestJS o Express

### Deseables

- MongoDB
- Jest
- Swagger/OpenAPI

> Puedes utilizar librerías adicionales si consideras que aportan valor a la solución.

---

# Caso

Kambista necesita registrar operaciones de cambio de USD a PEN.

Cada operación representa una solicitud de cambio realizada por un cliente.

---

# Requerimientos

## 1. Registrar una transacción

Crear el siguiente endpoint:

```http
POST /transactions
```
### Request

```json
{
  "customerId": "123",
  "amountUsd": 100
}
```
### Comportamiento esperado

1. Validar la información recibida.
2. Obtener un tipo de cambio fijo de 3.75.
3. Calcular el monto equivalente en PEN.
4. Registrar la operación.
5. Retornar la información generada.

### Response

```json
{
  "transactionId": "uuid",
  "exchangeRate": 3.75,
  "amountUsd": 100,
  "amountPen": 375,
  "status": "COMPLETED"
}
```
---

## 2. Consultar una transacción

Crear el endpoint:

```http
GET /transactions/:id
```
### Response

```json
{
  "transactionId": "uuid",
  "customerId": "123",
  "exchangeRate": 3.75,
  "amountUsd": 100,
  "amountPen": 375,
  "status": "COMPLETED"
}
```
---

## 3. Procesamiento masivo mediante CSV

Crear el endpoint:

```http
POST /transactions/upload
```
El endpoint debe aceptar un archivo CSV.

### Ejemplo

```csv
customerId,amountUsd
123,100
456,250
789,50
```
### Comportamiento esperado

Por cada fila:

1. Validar la información.
2. Procesar la transacción.
3. Registrar el resultado.

### Response sugerida

```json 
{   "processed": 3,   "failed": 0 } 
```
---

# Validaciones

## customerId

- Obligatorio.

## amountUsd

- Obligatorio.
- Debe ser numérico.
- Debe ser mayor a cero.

### Ejemplo de error

```json
{
  "success": false,
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount must be greater than zero"
  }
}
```
---

# Persistencia

Las transacciones deben almacenarse para poder ser consultadas posteriormente.

Puedes elegir la estrategia de persistencia que consideres adecuada.

---

# Testing

Implementar al menos:

- 1 prueba unitaria.
- 1 prueba de integración o e2e.

---

# README

Incluir en la documentación:

- Instrucciones de instalación.
- Instrucciones de ejecución.
- Decisiones técnicas relevantes.
- Supuestos realizados durante el desarrollo.

---

# Criterios de evaluación

Evaluaremos principalmente:

- Calidad de código.
- Organización del proyecto.
- Manejo de errores.
- Validaciones.
- Testing.
- Legibilidad.
- Buenas prácticas.
- Mantenibilidad.

---

# Bonus (Opcional)

- Swagger/OpenAPI.
- Logging.
- Docker.
- Cobertura adicional de pruebas.

---

# Entrega

1. Crear un fork del repositorio.
2. Crear una rama con el siguiente formato:

```bash
git checkout -b nombre-apellido
```

3. Implementar la solución.
4. Crear un Pull Request con los cambios realizados.
5. Compartir el enlace del Pull Request para su revisión.

---

# Tiempo estimado

Entre 4 y 6 horas.

No es necesario implementar funcionalidades adicionales fuera de los requerimientos indicados.

¡Muchos éxitos! 🚀