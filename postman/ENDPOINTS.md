# Inventario de endpoints EduQuest

Generado desde los controladores y DTO del código fuente. Los nombres con `*` son requeridos por el DTO; los demás son opcionales. En consultas se listan filtros y paginación cuando existen.

## Preparación y autenticación

- Base URL local sugerida: `http://localhost:3000` (variable `baseUrl`).
- `POST /auth/login` recibe `correo` y `password`; responde con `access_token` y `user`. El test de la colección guarda automáticamente `access_token` en `token`.
- Las rutas protegidas envían `Authorization: Bearer {{token}}`. Solo `POST /auth/login` es público; `/user` y `/role` además requieren `rol=administrador`.
- No existe endpoint público de registro. `POST /user` exige administrador. En la consulta de solo lectura realizada durante esta preparación se encontró `0` usuarios con `rol=administrador` y `estado=activo`; no hay bootstrap/seed en el repo. El primer administrador debe aprovisionarse por un procedimiento administrativo seguro fuera de la API (con contraseña hasheada con el mecanismo bcrypt de la aplicación). Después se podrá iniciar sesión y crear usuarios por API.
- La ruta raíz `GET /` aparece en `AppController`, pero no está registrada en `AppModule`; en la prueba HTTP previa respondió 404 y no se incluye como endpoint disponible.

## Orden de pruebas y dependencias

1. Aprovisionar el administrador; iniciar sesión; completar `token`, `adminEmail`, `adminPassword` y `newUserPassword` en el entorno.
2. Crear institución, asignatura, usuario estudiante y usuario docente; luego perfiles estudiante/docente. `POST /student` crea también el perfil de gamificación.
3. Crear grado y competencia; después unidad temática y tema; curso requiere institución, grado, asignatura y docente. Crear inscripción antes de intentos.
4. Crear rúbrica y criterio antes de vincularlos opcionalmente a actividad/evaluación. Crear actividad y curso asignado antes de problema/opción/intento/evaluación. La opción de respuesta requiere problema.
5. Crear historia dentro de sprint antes de tarea; tarea requiere también sprint. Las transacciones e insignias requieren perfil/estudiante existentes.
6. La colección captura IDs de las respuestas de creación en variables del entorno. Los IDs que no se generan en la colección deben ingresarse manualmente en el entorno.
7. No ejecutes una colección completa sobre producción. Los DELETE están separados por módulo y solo pasan la guarda si el ID coincide con un ID creado exitosamente por esta colección; respetar igualmente dependencias de FK al limpiar datos.

## Inventario

### Autenticación

Login es público; perfil requiere token.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/auth/login` | Iniciar sesión y obtener JWT | — | correo*, password* | No |
| GET | `/auth/profile` | Consultar el perfil autenticado | — | — | Sí — cualquier usuario autenticado |

### Usuarios

Todas las rutas requieren JWT de administrador.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/user` | Crear registro | — | nombre*, apellido, correo*, password*, rol | Sí — administrador |
| GET | `/user` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — administrador |
| GET | `/user/:id` | Consultar registro por identificador | Path: `id` | — | Sí — administrador |
| PUT | `/user/:id` | Actualizar registro | Path: `id` | nombre, apellido, correo, password, rol | Sí — administrador |

### Roles

Todas las rutas requieren JWT de administrador.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/role` | Crear registro | — | nombre*, descripcion | Sí — administrador |
| GET | `/role` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — administrador |
| GET | `/role/:id` | Consultar registro por identificador | Path: `id` | — | Sí — administrador |
| GET | `/role/nombre/:nombre` | Buscar por nombre | Path: `nombre` | — | Sí — administrador |
| PUT | `/role/:id` | Actualizar registro | Path: `id` | nombre, descripcion | Sí — administrador |
| DELETE | `/role/:id` | Eliminar registro | Path: `id` | — | Sí — administrador |

### Instituciones

CRUD de instituciones; autenticación JWT.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/institution` | Crear registro | — | nombre*, direccion, telefono, correo, estado | Sí — cualquier usuario autenticado |
| GET | `/institution` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — cualquier usuario autenticado |
| GET | `/institution/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| GET | `/institution/nombre/:nombre` | Buscar por nombre | Path: `nombre` | — | Sí — cualquier usuario autenticado |
| GET | `/institution/estado/:estado` | Filtrar por estado | Path: `estado` | — | Sí — cualquier usuario autenticado |
| PUT | `/institution/:id` | Actualizar registro | Path: `id` | nombre, direccion, telefono, correo, estado | Sí — cualquier usuario autenticado |
| DELETE | `/institution/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

### Estudiantes

CRUD y consultas de perfiles; la creación genera perfil de gamificación.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/student` | Crear registro | — | id_usuario*, codigo_estudiante, carrera, semestre, estado | Sí — cualquier usuario autenticado |
| GET | `/student` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — cualquier usuario autenticado |
| GET | `/student/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| GET | `/student/usuario/:idUsuario` | Buscar perfil por usuario | Path: `idUsuario` | — | Sí — cualquier usuario autenticado |
| GET | `/student/carrera/:carrera` | Buscar estudiantes por carrera | Path: `carrera` | — | Sí — cualquier usuario autenticado |
| PUT | `/student/:id` | Actualizar registro | Path: `id` | id_usuario, codigo_estudiante, carrera, semestre, estado | Sí — cualquier usuario autenticado |
| DELETE | `/student/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

### Docentes

CRUD y búsquedas por usuario/especialidad.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/teacher` | Crear registro | — | id_usuario*, codigo_docente, especialidad, titulo, estado | Sí — cualquier usuario autenticado |
| GET | `/teacher` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — cualquier usuario autenticado |
| GET | `/teacher/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| GET | `/teacher/usuario/:idUsuario` | Buscar perfil por usuario | Path: `idUsuario` | — | Sí — cualquier usuario autenticado |
| GET | `/teacher/especialidad/:especialidad` | Buscar docentes por especialidad | Path: `especialidad` | — | Sí — cualquier usuario autenticado |
| PUT | `/teacher/:id` | Actualizar registro | Path: `id` | id_usuario, codigo_docente, especialidad, titulo, estado | Sí — cualquier usuario autenticado |
| DELETE | `/teacher/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

### Gestión académica

Grados, asignaturas, unidades, temas, competencias, cursos, inscripciones y horarios.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/grade` | Crear registro | — | nombre*, nivel_educativo, tipo, nivel_esperado, id_institucion* | Sí — cualquier usuario autenticado |
| GET | `/grade` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_institucion, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/grade/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/grade/:id` | Actualizar registro | Path: `id` | nombre, nivel_educativo, tipo, nivel_esperado, id_institucion | Sí — cualquier usuario autenticado |
| DELETE | `/grade/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/subject` | Crear registro | — | nombre*, descripcion, area | Sí — cualquier usuario autenticado |
| GET | `/subject` | Listar registros (con filtros cuando el DTO lo permite) | Query: area, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/subject/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/subject/:id` | Actualizar registro | Path: `id` | nombre, descripcion, area | Sí — cualquier usuario autenticado |
| DELETE | `/subject/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/thematic-unit` | Crear registro | — | nombre*, descripcion, orden*, id_asignatura* | Sí — cualquier usuario autenticado |
| GET | `/thematic-unit` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_asignatura, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/thematic-unit/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/thematic-unit/:id` | Actualizar registro | Path: `id` | nombre, descripcion, orden, id_asignatura | Sí — cualquier usuario autenticado |
| DELETE | `/thematic-unit/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/topic` | Crear registro | — | nombre*, descripcion, orden*, id_unidad* | Sí — cualquier usuario autenticado |
| GET | `/topic` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_unidad, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/topic/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/topic/:id` | Actualizar registro | Path: `id` | nombre, descripcion, orden, id_unidad | Sí — cualquier usuario autenticado |
| DELETE | `/topic/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/competence` | Crear registro | — | nombre*, descripcion, tipo, nivel_esperado, id_asignaturas | Sí — cualquier usuario autenticado |
| GET | `/competence` | Listar registros (con filtros cuando el DTO lo permite) | Query: tipo, id_asignatura, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/competence/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/competence/:id` | Actualizar registro | Path: `id` | nombre, descripcion, tipo, nivel_esperado, id_asignaturas | Sí — cualquier usuario autenticado |
| DELETE | `/competence/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/course` | Crear registro | — | nombre*, codigo_acceso, periodo_academico, cupo_maximo, fecha_inicio, fecha_fin, estado, id_institucion*, id_grado*, id_asignatura*, id_docente* | Sí — cualquier usuario autenticado |
| GET | `/course` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_institucion, id_grado, id_asignatura, id_docente, id_estudiante, estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/course/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/course/:id` | Actualizar registro | Path: `id` | nombre, codigo_acceso, periodo_academico, cupo_maximo, fecha_inicio, fecha_fin, estado, id_institucion, id_grado, id_asignatura, id_docente | Sí — cualquier usuario autenticado |
| DELETE | `/course/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/enrollment` | Crear registro | — | fecha_inicio*, estado, nota_final_curso, id_estudiante*, id_curso* | Sí — cualquier usuario autenticado |
| GET | `/enrollment` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_estudiante, id_curso, estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/enrollment/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/enrollment/:id` | Actualizar registro | Path: `id` | fecha_inicio, estado, nota_final_curso, id_estudiante, id_curso | Sí — cualquier usuario autenticado |
| DELETE | `/enrollment/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/course-schedule` | Crear registro | — | dia_semana*, hora_inicio*, hora_fin*, aula*, id_curso* | Sí — cualquier usuario autenticado |
| GET | `/course-schedule` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_curso, dia_semana, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/course-schedule/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/course-schedule/:id` | Actualizar registro | Path: `id` | dia_semana, hora_inicio, hora_fin, aula, id_curso | Sí — cualquier usuario autenticado |
| DELETE | `/course-schedule/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

### Actividades y ABP

Actividades, niveles, problemas, opciones y relaciones curso/competencia.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/activity` | Crear registro | — | nombre*, descripcion, tipo*, dificultad*, tiempo_limite, intentos_maximos, objetivo_pedagogico, puntaje_maximo*, estado, id_niveles, id_rubrica | Sí — cualquier usuario autenticado |
| GET | `/activity` | Listar registros (con filtros cuando el DTO lo permite) | Query: tipo, dificultad, estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/activity/:id` | Actualizar registro | Path: `id` | nombre, descripcion, tipo, dificultad, tiempo_limite, intentos_maximos, objetivo_pedagogico, puntaje_maximo, estado, id_niveles, id_rubrica | Sí — cualquier usuario autenticado |
| DELETE | `/activity/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/activity-level` | Crear registro | — | nombre*, descripcion, numero_nivel*, puntaje_nivel*, orden* | Sí — cualquier usuario autenticado |
| GET | `/activity-level` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — cualquier usuario autenticado |
| GET | `/activity-level/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/activity-level/:id` | Actualizar registro | Path: `id` | nombre, descripcion, numero_nivel, puntaje_nivel, orden | Sí — cualquier usuario autenticado |
| DELETE | `/activity-level/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/activity-course` | Crear registro | — | fecha_apertura, fecha_cierre, peso_evaluativo*, estado, id_actividad*, id_curso* | Sí — cualquier usuario autenticado |
| GET | `/activity-course` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_actividad, id_curso, estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-course/course/:id_curso` | Consultar actividades por curso | Path: `id_curso`<br>Query: id_actividad, id_curso, estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-course/student/:id_estudiante/available` | Consultar actividades disponibles para estudiante inscrito | Path: `id_estudiante`<br>Query: id_actividad, id_curso, estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-course/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/activity-course/:id` | Actualizar registro | Path: `id` | fecha_apertura, fecha_cierre, peso_evaluativo, estado, id_actividad, id_curso | Sí — cualquier usuario autenticado |
| DELETE | `/activity-course/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/problem` | Crear registro | — | enunciado*, contexto, nivel_dificultad*, puntaje*, orden*, retroalimentacion_auto, id_actividad* | Sí — cualquier usuario autenticado |
| GET | `/problem` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_actividad, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/problem/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/problem/:id` | Actualizar registro | Path: `id` | enunciado, contexto, nivel_dificultad, puntaje, orden, retroalimentacion_auto, id_actividad | Sí — cualquier usuario autenticado |
| DELETE | `/problem/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/answer-option` | Crear registro | — | texto_opcion*, es_correcta, orden*, id_problema* | Sí — cualquier usuario autenticado |
| GET | `/answer-option` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_problema, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/answer-option/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/answer-option/:id` | Actualizar registro | Path: `id` | texto_opcion, es_correcta, orden, id_problema | Sí — cualquier usuario autenticado |
| DELETE | `/answer-option/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/activity-competence` | Crear registro | — | id_actividad*, id_competencia*, peso* | Sí — cualquier usuario autenticado |
| GET | `/activity-competence` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_actividad, id_competencia, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-competence/competence/:id_competencia` | Consultar actividades por competencia | Path: `id_competencia`<br>Query: id_actividad, id_competencia, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-competence/:id_actividad/:id_competencia` | Consultar registro por identificador | Path: `id_actividad`, `id_competencia` | — | Sí — cualquier usuario autenticado |
| PUT | `/activity-competence/:id_actividad/:id_competencia` | Actualizar registro | Path: `id_actividad`, `id_competencia` | peso* | Sí — cualquier usuario autenticado |
| DELETE | `/activity-competence/:id_actividad/:id_competencia` | Eliminar registro | Path: `id_actividad`, `id_competencia` | — | Sí — cualquier usuario autenticado |

### Evaluación

Rúbricas, criterios, evaluaciones, intentos y respuestas.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/rubric` | Crear registro | — | nombre*, descripcion, tipo* | Sí — cualquier usuario autenticado |
| GET | `/rubric` | Listar registros (con filtros cuando el DTO lo permite) | Query: tipo, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/rubric/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/rubric/:id` | Actualizar registro | Path: `id` | nombre, descripcion, tipo | Sí — cualquier usuario autenticado |
| DELETE | `/rubric/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/rubric-criterion` | Crear registro | — | nombre*, descripcion, peso*, puntaje*, maximo*, id_rubrica* | Sí — cualquier usuario autenticado |
| GET | `/rubric-criterion` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_rubrica, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/rubric-criterion/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/rubric-criterion/:id` | Actualizar registro | Path: `id` | nombre, descripcion, peso, puntaje, maximo, id_rubrica | Sí — cualquier usuario autenticado |
| DELETE | `/rubric-criterion/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/evaluation` | Crear registro | — | id_actividad_curso*, retroalimentacion_auto | Sí — cualquier usuario autenticado |
| GET | `/evaluation` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_actividad_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/evaluation/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/evaluation/:id/recalculate` | Recalcular evaluación | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/evaluation/:id` | Actualizar registro | Path: `id` | nota_final, retroalimentacion_auto, retroalimentacion_docente | Sí — cualquier usuario autenticado |
| DELETE | `/evaluation/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/evaluation-criterion` | Crear registro | — | id_evaluacion*, id_criterio*, puntaje_asignado*, observacion | Sí — cualquier usuario autenticado |
| GET | `/evaluation-criterion` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_evaluacion, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/evaluation-criterion/:id_evaluacion/:id_criterio` | Consultar registro por identificador | Path: `id_evaluacion`, `id_criterio` | — | Sí — cualquier usuario autenticado |
| PUT | `/evaluation-criterion/:id_evaluacion/:id_criterio` | Actualizar registro | Path: `id_evaluacion`, `id_criterio` | puntaje_asignado, observacion | Sí — cualquier usuario autenticado |
| DELETE | `/evaluation-criterion/:id_evaluacion/:id_criterio` | Eliminar registro | Path: `id_evaluacion`, `id_criterio` | — | Sí — cualquier usuario autenticado |
| POST | `/activity-attempt` | Crear registro | — | id_inscripcion*, id_actividad_curso* | Sí — cualquier usuario autenticado |
| GET | `/activity-attempt` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_inscripcion, id_actividad_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-attempt/enrollment/:id_inscripcion/history` | Operación findHistory | Path: `id_inscripcion`<br>Query: id_inscripcion, id_actividad_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-attempt/results/student/:id_estudiante` | Consultar resultados por estudiante | Path: `id_estudiante`<br>Query: id_inscripcion, id_actividad_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-attempt/results/activity-course/:id_actividad_curso` | Consultar resultados por actividad asignada | Path: `id_actividad_curso`<br>Query: id_inscripcion, id_actividad_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/activity-attempt/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/activity-attempt/:id/finish` | Finalizar intento | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/attempt-response/attempt/:id_intento` | Crear registro | Path: `id_intento` | id_problema*, id_opcion, respuesta_texto | Sí — cualquier usuario autenticado |
| GET | `/attempt-response` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_intento, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/attempt-response/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| DELETE | `/attempt-response/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

### Gamificación

Perfiles, transacciones, insignias y asignaciones.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| GET | `/gamification-profile/ranking` | Consultar ranking general | — | — | Sí — cualquier usuario autenticado |
| GET | `/gamification-profile/ranking/course/:id_curso` | Consultar ranking por curso | Path: `id_curso` | — | Sí — cualquier usuario autenticado |
| GET | `/gamification-profile/:id_estudiante` | Operación findByStudent | Path: `id_estudiante` | — | Sí — cualquier usuario autenticado |
| POST | `/point-transaction` | Crear registro | — | id_estudiante*, tipo_transaccion*, monto*, descripcion | Sí — cualquier usuario autenticado |
| GET | `/point-transaction` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_estudiante, id_perfil, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/point-transaction/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/badge` | Crear registro | — | nombre*, descripcion, imagen_url, tipo*, criterio_obtencion*, puntos_asociados | Sí — cualquier usuario autenticado |
| GET | `/badge` | Listar registros (con filtros cuando el DTO lo permite) | — | — | Sí — cualquier usuario autenticado |
| GET | `/badge/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/badge/:id` | Actualizar registro | Path: `id` | nombre, descripcion, imagen_url, tipo, criterio_obtencion, puntos_asociados | Sí — cualquier usuario autenticado |
| DELETE | `/badge/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/student-badge` | Asignar insignia a estudiante | — | id_estudiante*, id_insignia*, id_curso | Sí — cualquier usuario autenticado |
| GET | `/student-badge` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_estudiante, id_insignia, id_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/student-badge/student/:id_estudiante` | Operación findByStudent | Path: `id_estudiante` | — | Sí — cualquier usuario autenticado |

### Seguimiento

Progreso de competencias y reportes.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/competence-progress` | Crear registro | — | id_estudiante*, id_competencia*, nivel_alcanzado* | Sí — cualquier usuario autenticado |
| GET | `/competence-progress` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_estudiante, id_competencia, id_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/competence-progress/student/:id_estudiante/competencies` | Consultar competencias desarrolladas y pendientes | Path: `id_estudiante`<br>Query: id_estudiante, id_competencia, id_curso, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/competence-progress/student/:id_estudiante` | Consultar progreso por estudiante | Path: `id_estudiante` | — | Sí — cualquier usuario autenticado |
| GET | `/competence-progress/course/:id_curso` | Consultar progreso por curso | Path: `id_curso` | — | Sí — cualquier usuario autenticado |
| PUT | `/competence-progress/student/:id_estudiante/competence/:id_competencia` | Actualizar registro | Path: `id_estudiante`, `id_competencia` | nivel_alcanzado* | Sí — cualquier usuario autenticado |
| POST | `/report/generate` | Operación generate | — | tipo_reporte*, id_curso, id_estudiante, id_docente, parametros | Sí — cualquier usuario autenticado |
| GET | `/report` | Listar registros (con filtros cuando el DTO lo permite) | Query: tipo_reporte, id_curso, id_estudiante, id_docente, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/report/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/report/:id/archive` | Archivar reporte | Path: `id` | — | Sí — cualquier usuario autenticado |
| DELETE | `/report/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

### Gestión SCRUM

Sprints, historias de usuario y tareas.

| Método | Ruta | Descripción | Parámetros / filtros | Datos del body | JWT / rol |
|---|---|---|---|---|---|
| POST | `/sprint` | Crear registro | — | nombre*, objetivo, fecha_inicio*, fecha_fin*, estado | Sí — cualquier usuario autenticado |
| GET | `/sprint` | Listar registros (con filtros cuando el DTO lo permite) | Query: estado, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/sprint/:id/historias` | Consultar historias del sprint | Path: `id` | — | Sí — cualquier usuario autenticado |
| GET | `/sprint/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/sprint/:id` | Actualizar registro | Path: `id` | nombre, objetivo, fecha_inicio, fecha_fin, estado | Sí — cualquier usuario autenticado |
| DELETE | `/sprint/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/user-story` | Crear registro | — | codigo*, descripcion*, prioridad, criterios_aceptacion, estado, id_sprint* | Sí — cualquier usuario autenticado |
| GET | `/user-story` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_sprint, estado, prioridad, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/user-story/:id/tasks` | Consultar tareas de historia | Path: `id` | — | Sí — cualquier usuario autenticado |
| GET | `/user-story/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/user-story/:id` | Actualizar registro | Path: `id` | codigo, descripcion, prioridad, criterios_aceptacion, estado, id_sprint | Sí — cualquier usuario autenticado |
| DELETE | `/user-story/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |
| POST | `/scrum-task` | Crear registro | — | titulo*, descripcion, estado, prioridad, estimacion_horas, fecha_cierre, id_historia*, id_sprint*, id_responsable | Sí — cualquier usuario autenticado |
| GET | `/scrum-task` | Listar registros (con filtros cuando el DTO lo permite) | Query: id_responsable, id_sprint, id_historia, estado, prioridad, page, limit | — | Sí — cualquier usuario autenticado |
| GET | `/scrum-task/:id` | Consultar registro por identificador | Path: `id` | — | Sí — cualquier usuario autenticado |
| PUT | `/scrum-task/:id` | Actualizar registro | Path: `id` | titulo, descripcion, estado, prioridad, estimacion_horas, fecha_cierre, id_historia, id_sprint, id_responsable | Sí — cualquier usuario autenticado |
| DELETE | `/scrum-task/:id` | Eliminar registro | Path: `id` | — | Sí — cualquier usuario autenticado |

## Notas de payload

- La colección Postman contiene cuerpos JSON de ejemplo para las rutas POST/PUT basados en las propiedades de los DTO. Los campos FK usan variables `{{id_*}}`; completa las que no se hayan creado previamente.
- Fechas de curso/Sprint usan formato ISO `YYYY-MM-DD`; horarios usan `HH:mm`; `dia_semana` debe ser un día válido en español.
- El DTO de insignia acepta criterios `PUNTOS_ACUMULADOS`, `ACTIVIDADES_COMPLETADAS` o `COMPETENCIA_NIVEL`; el ejemplo usa el primero.
- La API no expone DELETE para usuario, algunos registros de evaluación/seguimiento/gamificación son de solo lectura o se gestionan mediante acciones específicas; la colección refleja los métodos que existen.
