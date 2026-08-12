# Bolsa de Empleo - EIF209 Programacion 4

Aplicacion web tipo SPA (Single Page Application) para la gestion de una bolsa de empleo: empresas que publican puestos, oferentes (candidatos) que buscan trabajo y postulan, y un panel de administracion para aprobar cuentas nuevas. Proyecto del curso EIF209 Programacion 4, periodo 2026-01.

## Descripcion

El sistema conecta a dos tipos de usuarios principales: empresas, que publican y gestionan sus puestos de trabajo, y oferentes, que arman un perfil con sus habilidades y curriculum y pueden ser encontrados por las empresas al buscar candidatos. Un administrador aprueba el registro de empresas y oferentes antes de que puedan operar en la plataforma. La autenticacion se maneja con JWT y el acceso a cada funcionalidad esta restringido segun el rol del usuario.

## Funcionalidades

- Autenticacion con JWT (`/api/auth/login`).
- Registro de empresas y de oferentes (`/api/registro/empresa`, `/api/registro/oferente`).
- Aprobacion de cuentas por parte de un administrador (empresas y oferentes pendientes).
- Gestion de puestos: creacion, listado de puestos propios, desactivacion y consulta de puestos disponibles.
- Perfil de oferente: gestion de habilidades/caracteristicas y carga de curriculum (CV en PDF).
- Busqueda de candidatos por parte de las empresas, filtrando por caracteristicas.
- Catalogo de caracteristicas/habilidades, de uso publico (busqueda, registro) y administrable por el rol admin.
- Vista publica: puestos recientes y busqueda publica de puestos, sin necesidad de autenticacion.

## Arquitectura

Aplicacion dividida en backend (API REST) y frontend (SPA), con el backend sirviendo tambien el build del frontend como recurso estatico.

```
Frontend (React + Vite)  --HTTP/JSON-->  Backend (Spring Boot)  --JPA-->  PostgreSQL
                                                │
                                          JWT + Spring Security
```

### Backend (backend/)

```
src/main/java/com/una/bolsaempleo/
├── controller/    # AdminController, AuthController, CandidatoController,
│                  # CaracteristicaController, OferenteController, PuestoController,
│                  # RegistroController, PublicoController, PingController
├── dto/           # Objetos de transferencia (requests/responses)
├── entity/        # Entidades JPA (Usuario, Empresa, Oferente, Puesto, Caracteristica, Rol, ...)
├── repository/    # Repositorios Spring Data JPA
├── security/      # JWT (JwtService, JwtAuthenticationFilter), SecurityConfig
├── service/       # Logica de negocio
└── config/        # WebConfig (fallback SPA a index.html), SpaController
```

### Frontend (frontend/)

SPA construida con React y Vite, consumiendo la API REST del backend.

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| React 18 + Vite | Frontend SPA |
| Spring Boot 3.5 | Backend / API REST |
| Spring Security + JWT (jjwt) | Autenticacion y autorizacion |
| Spring Data JPA | Acceso a datos |
| PostgreSQL | Motor de base de datos |
| Lombok | Reduccion de codigo repetitivo en el backend |
| Maven | Gestion de dependencias y build del backend |

Nota: el proyecto usa PostgreSQL como base de datos (ver `application.properties`), no MySQL.

## Base de datos

El esquema de base de datos se encuentra en `database/script.sql`. Entidades principales: Usuario, Rol, Empresa, Oferente, Puesto, Caracteristica, con tablas de relacion OferenteCaracteristica y PuestoCaracteristica para modelar las habilidades requeridas por puesto y las que posee cada oferente.


## API

La documentacion de endpoints se mantiene en [API.md](./API.md). Principales grupos de rutas:

| Prefijo | Descripcion |
|---|---|
| /api/auth | Login |
| /api/registro | Registro de empresas y oferentes |
| /api/admin | Aprobacion de empresas y oferentes pendientes (solo admin) |
| /api/puestos | Creacion, listado y desactivacion de puestos |
| /api/oferente | Habilidades y curriculum del oferente autenticado |
| /api/candidatos | Busqueda de candidatos y consulta de curriculum |
| /api/caracteristicas | Catalogo de habilidades/caracteristicas (lectura publica, escritura admin) |
| /api (publico) | Puestos recientes y busqueda publica, ping de estado |

## Autores

- Bryan F. - [@BryanF0304](https://github.com/BryanF0304)
- Jostin Campos Cortés - [@iJostin](https://github.com/iJostin)
