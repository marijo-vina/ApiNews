# ApiNews (noticias-api)

API REST de noticias de México: catálogo de noticias por categoría y estado, usuarios con roles y autenticación JWT.

**Autora:** Marijose Vinajera, estudiante de ingeniería de software (UTM Mérida).

Proyecto del curso de Express.js. El nombre del paquete en `package.json` es `noticias-api`.

## De qué se trata

ApiNews concentra en una sola API lo necesario para publicar y administrar noticias ligadas a un estado de la República y a una categoría. Los lectores pueden listar y consultar sin token. Quien escribe (contribuidor o administrador) autentica con JWT. La administración de usuarios, perfiles y estados queda reservada al administrador.

## Qué hace hoy

**Autenticación**

- Registro público (`POST /api/auth/register`): crea un usuario con `perfil_id = 2` (contribuidor). La contraseña se hashea con bcrypt.
- Login (`POST /api/auth/login`): valida correo y contraseña y devuelve un JWT (expira en 1 hora). El payload lleva `id`, `nombre` y `perfil_id`.

**Noticias**

- Listado y detalle públicos (`GET /api/news`, `GET /api/news/:id`), con categoría, estado y autor incluidos (eager loading).
- Filtro opcional por título: `GET /api/news?titulo=...` (`LIKE`).
- Crear, actualizar y eliminar requieren token y rol contribuidor o administrador.

**Catálogos**

- Categorías: lectura pública; escritura contribuidor/admin.
- Estados (entidad federativa: `nombre`, `abreviacion`): lectura pública; escritura solo admin.
- Perfiles de usuario: lectura pública; escritura solo admin.
- Usuarios: lectura pública; escritura solo admin.

**Validación y seguridad**

- `express-validator` en las rutas de escritura y en auth.
- Middleware `authenticateToken` (Bearer JWT), `isAdmin` (`perfil_id === 1`) e `isContributorOrAdmin` (`perfil_id` 1 o 2).
- CORS habilitado de forma global. Cuerpo JSON con `express.json()`.
- Sequelize sincroniza tablas al arrancar (`sync({ force: false })`).

**Desajuste modelo ↔ validador (noticias)**

El validador de creación exige, entre otros, `resumen`, `contenido`, `descripcion` e `imagen`. El modelo Sequelize solo persiste `titulo`, `descripcion`, `imagen`, `fecha_publicacion`, `categoria_id`, `estado_id`, `usuario_id` y campos de auditoría. Conviene alinear validador y modelo en una mejora posterior.

## Stack

| Pieza | En este repositorio |
| --- | --- |
| Runtime | Node.js (CommonJS, `"type": "commonjs"`) |
| Framework | Express `^5.1.0` |
| ORM / BD | Sequelize `^6.37.7` + `mysql2` `^3.15.2` (MySQL vía variables de entorno) |
| Auth | `jsonwebtoken` `^9.0.2`, `bcryptjs` `^2.4.3` |
| Validación | `express-validator` `^7.1.0` |
| Otros | `cors`, `dotenv` |
| Desarrollo | `nodemon` `^3.1.10` |

Scripts en `package.json`: `start` → `node src/index.js`; `dev` → `nodemon src/index.js`.

## Endpoints

Prefijo base: `/api` (auth bajo `/api/auth`). Puerto por defecto: `4000` (`PORT` en el entorno).

| Método | Ruta | Auth / rol | Qué hace |
| --- | --- | --- | --- |
| `GET` | `/` | Público | Mensaje de salud: API funcionando con MySQL |
| `POST` | `/api/auth/register` | Público | Registra contribuidor (`nombre`, `apellidos`, `nick`, `correo`, `password`) |
| `POST` | `/api/auth/login` | Público | Login; responde `{ message, token }` |
| `GET` | `/api/news` | Público | Lista noticias; query opcional `titulo` |
| `GET` | `/api/news/:id` | Público | Una noticia con categoría, estado y usuario |
| `POST` | `/api/news` | Token + contribuidor/admin | Crea noticia |
| `PUT` | `/api/news/:id` | Token + contribuidor/admin | Actualiza noticia |
| `DELETE` | `/api/news/:id` | Token + contribuidor/admin | Elimina noticia |
| `GET` | `/api/categories` | Público | Lista categorías |
| `GET` | `/api/categories/:id` | Público | Una categoría |
| `POST` / `PUT` / `DELETE` | `/api/categories`… | Token + contribuidor/admin | CRUD de categorías |
| `GET` | `/api/states` | Público | Lista estados |
| `GET` | `/api/states/:id` | Público | Un estado |
| `POST` / `PUT` / `DELETE` | `/api/states`… | Token + admin | CRUD de estados |
| `GET` | `/api/profiles` | Público | Lista perfiles |
| `GET` | `/api/profiles/:id` | Público | Un perfil |
| `POST` / `PUT` / `DELETE` | `/api/profiles`… | Token + admin | CRUD de perfiles |
| `GET` | `/api/users` | Público | Lista usuarios |
| `GET` | `/api/users/:id` | Público | Un usuario |
| `POST` / `PUT` / `DELETE` | `/api/users`… | Token + admin | CRUD de usuarios |

Header de autenticación: `Authorization: Bearer <token>`.

## Modelo de datos

Sequelize define estas entidades (tablas por defecto del modelo: `news`, `users`, `categories`, `states`, `profiles`, según el `define` de cada archivo).

| Modelo | Campos principales | Relaciones |
| --- | --- | --- |
| `News` | `titulo`, `descripcion`, `imagen`, `fecha_publicacion`, `categoria_id`, `estado_id`, `usuario_id`, `activo`, auditoría (`UserAlta`, `FechaAlta`, …) | `belongsTo` Category, State, User |
| `User` | `perfil_id`, `nombre`, `apellidos`, `nick`, `correo` (único), `password`, `activo`, auditoría | `belongsTo` Profile |
| `Category` | `nombre` (único), `descripcion`, `activo`, auditoría | — |
| `State` | `nombre` (único), `abreviacion` (única), `activo`, auditoría | — |
| `Profile` | `nombre` (único), `activo`, auditoría | — |

Roles usados en código: `perfil_id === 1` administrador; `perfil_id === 2` contribuidor.

## Cómo levantarlo

Hace falta Node.js, npm y un MySQL (u compatible) con una base creada. El repositorio **no incluye** `.env.example`; hay que crear un `.env` en la raíz (`.env` ya está en `.gitignore`).

Variables que usa el código:

```env
PORT=4000
DB_NAME=noticias
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=127.0.0.1
DB_DIALECT=mysql
JWT_SECRET=cambia_este_secreto
```

```bash
git clone https://github.com/marijo-vina/ApiNews.git
cd ApiNews
npm install
# Crear el archivo .env con las variables de arriba
npm run dev
# o: npm start
```

El servidor queda en `http://localhost:4000`. Al arrancar autentica MySQL y sincroniza las tablas.

Ejemplo de registro y login:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","apellidos":"Pérez","nick":"ana","correo":"ana@example.com","password":"ClaveFuerte1!"}'

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"ana@example.com","password":"ClaveFuerte1!"}'
```

## Estructura

```text
src/
  index.js                 Entrada: Express, CORS, sync Sequelize, montaje de rutas
  config/database.js       Conexión Sequelize + MySQL desde .env
  models/                  News, User, Category, State, Profile
  controllers/             Auth, News, User, Category, State, Profile
  routes/                  AuthRoute + rutas REST por recurso
  middlewares/jwt.js       authenticateToken, isAdmin, isContributorOrAdmin
  validators/              Reglas express-validator por recurso
  helpers/validationHelper.js  validateResult
package.json               Scripts start / dev y dependencias
.gitignore                 node_modules/, .env
```

## Lo que falta / limitaciones

- No hay `.env.example`, seeders ni migraciones versionadas (solo `sequelize.sync`).
- No hay pruebas automatizadas.
- Lecturas de usuarios y perfiles son públicas (sin token); en un entorno real conviene restringirlas.
- Desajuste entre campos del validador de noticias y el modelo Sequelize (ver arriba).

## Lo que aprendí

Organicé una API Express en capas (rutas → validadores → middlewares JWT → controladores → modelos Sequelize), con roles por `perfil_id` y contraseñas hasheadas. Practiqué CRUD con asociaciones (`belongsTo` / includes) y un filtro de búsqueda sobre noticias.

Licencia: ISC (declarada en `package.json`).
