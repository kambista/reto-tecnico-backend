# Instrucciones de instalación.
1. clonar el repositorio
2. instalar dependencias 
```
yarn install 
```
2. configurar las variables de entorno, basarte del archivo 
```
.env.template
```
3. probar el endpoint con locamente con http://localhost:3000/api/v1 (GET)

# Instrucciones de ejecución.
1. yarn start:dev
2. La API estará disponible localmente en: http://localhost:3000/api/v1
3. Para acceder a la documentación interactiva de la API (Swagger), ingresar a: http://localhost:3000/api/v1/docs

# Instrucciones de ejecución de pruebas e2e 
1. configurar la variables de entorno env.test, basandose en el archvio env.test.template
2. usar el comando para levantar la base de datos de prueba
```
yarn db:test:up
```
3. Ejecutar pruebas unitarias 
```
yarn test
```
4. Ejecutar pruebas e2e
```
yarn test:e2e
```
5. Apagar la base de datos de pruebas 
```
yarn db:test:down 
```
# Decisiones técnicas relevantes.
- Para el ambiente Dev se decidio usar un cluster de mongoDb
- Para el ambiente test e2e se decicidio tener crear una base de datos aparte, para diferencias ambientes y crear sus comando respectivos en package json 
comando como:
```
yarn db:test:up
yarn db:test:down
```
- Se decidio usar perfiles (profiles: - test) en el archivo docker compose para diferencias, los servicios por ambien o uso.
- se decidio crear un modulo prisma y un servicio para que las consultas se haga a travez de ella.
- se decidio agregar una carpeta test para diferencias los archivos de tipo test de ese modulo.
- se modificó la configuración predeterminada del archivo jest-e2e.json para permitir que las pruebas e2e coexistan dentro de la carpeta de cada módulo (src/transaction/test/e2e).
- se creo archivos reutilizables como mocks y stubs para su uso recurrente en pruebas unitarias.
- se creo un ExceptionFilter para interceptar los errores de Class-validator y tener un formato ante las fallas de formato.
- Se agrego el uso de repository pattern y Entities para el desacoplamiento del ORM prisma.
# Supuestos realizados durante el desarrollo.
- El valor minimo de amountUsd para la creación de transacciones es de 1 dolar.
- Se elegio prisma 6 como ORM por su conpatibilidad con mongoDb
- Se asumio que los errores en el endpoint /transactions/upload, si el archivo csv tiene un error de formato, se para el proceso.
- Se agrego a los endpoint, el global prefix api/v1
