import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

const TABLES = [
  {
    name: 'competencias_asignaturas',
    createSql:
      'CREATE TABLE `competencias_asignaturas` (`id_competencia` int NOT NULL, `id_asignatura` int NOT NULL, INDEX `IDX_3abbf83014ee4de89b616dc4a1` (`id_competencia`), INDEX `IDX_627be0b440bd0957b7f4a6ffed` (`id_asignatura`), PRIMARY KEY (`id_competencia`, `id_asignatura`)) ENGINE=InnoDB',
  },
  {
    name: 'insignias',
    createSql:
      "CREATE TABLE `insignias` (`id_insignia` int NOT NULL AUTO_INCREMENT, `nombre` varchar(120) NOT NULL, `descripcion` text NULL, `imagen_url` varchar(500) NULL, `tipo` varchar(50) NOT NULL, `criterio_obtencion` json NOT NULL, `puntos_asociados` int NOT NULL DEFAULT '0', PRIMARY KEY (`id_insignia`)) ENGINE=InnoDB",
  },
  {
    name: 'niveles_actividad',
    createSql:
      'CREATE TABLE `niveles_actividad` (`id_nivel` int NOT NULL AUTO_INCREMENT, `nombre` varchar(100) NOT NULL, `descripcion` text NULL, `numero_nivel` int NOT NULL, `puntaje_nivel` decimal(8,2) NOT NULL, `orden` int NOT NULL, PRIMARY KEY (`id_nivel`)) ENGINE=InnoDB',
  },
  {
    name: 'perfiles_gamificacion',
    createSql:
      "CREATE TABLE `perfiles_gamificacion` (`id_perfil` int NOT NULL AUTO_INCREMENT, `nivel` int NOT NULL DEFAULT '1', `puntos_totales` int NOT NULL DEFAULT '0', `nivel_actual` int NOT NULL DEFAULT '1', `fecha_actualizacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id_estudiante` int NOT NULL, UNIQUE INDEX `REL_1080328bf6b108e7c32751b325` (`id_estudiante`), PRIMARY KEY (`id_perfil`)) ENGINE=InnoDB",
  },
  {
    name: 'progreso_competencias',
    createSql:
      "CREATE TABLE `progreso_competencias` (`id_progreso` int NOT NULL AUTO_INCREMENT, `nivel_alcanzado` int NOT NULL, `fecha_actualizacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id_estudiante` int NOT NULL, `id_competencia` int NOT NULL, UNIQUE INDEX `uq_progreso_estudiante_competencia` (`id_estudiante`, `id_competencia`), PRIMARY KEY (`id_progreso`)) ENGINE=InnoDB",
  },
  {
    name: 'reportes',
    createSql:
      'CREATE TABLE `reportes` (`id_reporte` int NOT NULL AUTO_INCREMENT, `tipo_reporte` varchar(50) NOT NULL, `parametros` json NULL, `fecha_generacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fecha_archivo` datetime NULL, `id_curso` int NULL, `id_estudiante` int NULL, `id_docente` int NULL, PRIMARY KEY (`id_reporte`)) ENGINE=InnoDB',
  },
  {
    name: 'rubricas',
    createSql:
      'CREATE TABLE `rubricas` (`id_rubrica` int NOT NULL AUTO_INCREMENT, `nombre` varchar(150) NOT NULL, `descripcion` text NULL, `tipo` varchar(50) NOT NULL, PRIMARY KEY (`id_rubrica`)) ENGINE=InnoDB',
  },
  {
    name: 'sprints',
    createSql:
      "CREATE TABLE `sprints` (`id_sprint` int NOT NULL AUTO_INCREMENT, `nombre` varchar(150) NOT NULL, `objetivo` text NULL, `fecha_inicio` date NOT NULL, `fecha_fin` date NOT NULL, `estado` varchar(30) NOT NULL DEFAULT 'planificado', PRIMARY KEY (`id_sprint`)) ENGINE=InnoDB",
  },
  {
    name: 'actividades',
    createSql:
      "CREATE TABLE `actividades` (`id_actividad` int NOT NULL AUTO_INCREMENT, `nombre` varchar(150) NOT NULL, `descripcion` text NULL, `tipo` varchar(50) NOT NULL, `dificultad` varchar(50) NOT NULL, `tiempo_limite` int NULL, `intentos_maximos` int NULL, `objetivo_pedagogico` text NULL, `puntaje_maximo` decimal(8,2) NOT NULL, `estado` varchar(20) NOT NULL DEFAULT 'activo', `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fecha_modificacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id_rubrica` int NULL, PRIMARY KEY (`id_actividad`)) ENGINE=InnoDB",
  },
  {
    name: 'criterios_rubrica',
    createSql:
      'CREATE TABLE `criterios_rubrica` (`id_criterio` int NOT NULL AUTO_INCREMENT, `nombre` varchar(150) NOT NULL, `descripcion` text NULL, `peso` decimal(7,2) NOT NULL, `puntaje` decimal(8,2) NOT NULL, `maximo` decimal(8,2) NOT NULL, `id_rubrica` int NOT NULL, PRIMARY KEY (`id_criterio`)) ENGINE=InnoDB',
  },
  {
    name: 'estudiantes_insignias',
    createSql:
      'CREATE TABLE `estudiantes_insignias` (`id_estudiante_insignia` int NOT NULL AUTO_INCREMENT, `fecha_obtencion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id_estudiante` int NOT NULL, `id_insignia` int NOT NULL, `id_curso` int NULL, UNIQUE INDEX `uq_estudiante_insignia_curso` (`id_estudiante`, `id_insignia`, `id_curso`), PRIMARY KEY (`id_estudiante_insignia`)) ENGINE=InnoDB',
  },
  {
    name: 'historias_usuario',
    createSql:
      "CREATE TABLE `historias_usuario` (`id_historia` int NOT NULL AUTO_INCREMENT, `codigo` varchar(50) NOT NULL, `descripcion` text NOT NULL, `prioridad` varchar(30) NOT NULL DEFAULT 'media', `criterios_aceptacion` text NULL, `estado` varchar(30) NOT NULL DEFAULT 'pendiente', `id_sprint` int NOT NULL, PRIMARY KEY (`id_historia`)) ENGINE=InnoDB",
  },
  {
    name: 'transacciones_puntos',
    createSql:
      'CREATE TABLE `transacciones_puntos` (`id_transaccion` int NOT NULL AUTO_INCREMENT, `tipo_transaccion` varchar(20) NOT NULL, `monto` int NOT NULL, `fecha` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `descripcion` varchar(255) NULL, `id_perfil` int NOT NULL, PRIMARY KEY (`id_transaccion`)) ENGINE=InnoDB',
  },
  {
    name: 'actividades_competencias',
    createSql:
      'CREATE TABLE `actividades_competencias` (`id_actividad` int NOT NULL, `id_competencia` int NOT NULL, `peso` decimal(7,2) NOT NULL, PRIMARY KEY (`id_actividad`, `id_competencia`)) ENGINE=InnoDB',
  },
  {
    name: 'actividades_curso',
    createSql:
      "CREATE TABLE `actividades_curso` (`id_actividad_curso` int NOT NULL AUTO_INCREMENT, `fecha_asignacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fecha_apertura` datetime NULL, `fecha_cierre` datetime NULL, `peso_evaluativo` decimal(7,2) NOT NULL, `estado` varchar(20) NOT NULL DEFAULT 'activo', `id_actividad` int NOT NULL, `id_curso` int NOT NULL, PRIMARY KEY (`id_actividad_curso`)) ENGINE=InnoDB",
  },
  {
    name: 'actividades_niveles',
    createSql:
      'CREATE TABLE `actividades_niveles` (`id_actividad` int NOT NULL, `id_nivel` int NOT NULL, INDEX `IDX_953c5aecabe992e7c0cfdea4e1` (`id_actividad`), INDEX `IDX_93ceb564c47a12268385a825c8` (`id_nivel`), PRIMARY KEY (`id_actividad`, `id_nivel`)) ENGINE=InnoDB',
  },
  {
    name: 'problemas',
    createSql:
      'CREATE TABLE `problemas` (`id_problema` int NOT NULL AUTO_INCREMENT, `enunciado` text NOT NULL, `contexto` text NULL, `nivel_dificultad` varchar(50) NOT NULL, `puntaje` decimal(8,2) NOT NULL, `orden` int NOT NULL, `retroalimentacion_auto` text NULL, `id_actividad` int NOT NULL, PRIMARY KEY (`id_problema`)) ENGINE=InnoDB',
  },
  {
    name: 'tareas',
    createSql:
      "CREATE TABLE `tareas` (`id_tarea` int NOT NULL AUTO_INCREMENT, `titulo` varchar(180) NOT NULL, `descripcion` text NULL, `estado` varchar(30) NOT NULL DEFAULT 'pendiente', `prioridad` varchar(30) NOT NULL DEFAULT 'media', `estimacion_horas` decimal(7,2) NOT NULL DEFAULT '0.00', `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fecha_cierre` datetime NULL, `id_historia` int NOT NULL, `id_sprint` int NOT NULL, `id_responsable` int NULL, PRIMARY KEY (`id_tarea`)) ENGINE=InnoDB",
  },
  {
    name: 'evaluaciones',
    createSql:
      "CREATE TABLE `evaluaciones` (`id_evaluacion` int NOT NULL AUTO_INCREMENT, `nota_final` decimal(8,2) NOT NULL DEFAULT '0.00', `porcentaje` decimal(7,2) NOT NULL DEFAULT '0.00', `retroalimentacion_auto` text NULL, `retroalimentacion_docente` text NULL, `nota_modificada` tinyint NOT NULL DEFAULT 0, `fecha_evaluacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `id_actividad_curso` int NOT NULL, PRIMARY KEY (`id_evaluacion`)) ENGINE=InnoDB",
  },
  {
    name: 'intentos_actividad',
    createSql:
      "CREATE TABLE `intentos_actividad` (`id_intento` int NOT NULL AUTO_INCREMENT, `numero_intento` int NOT NULL, `fecha_inicio` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fecha_fin` datetime NULL, `tiempo_total_seg` int NULL, `puntaje_total` decimal(8,2) NOT NULL DEFAULT '0.00', `estado` varchar(30) NOT NULL DEFAULT 'en_progreso', `es_mejor_intento` tinyint NOT NULL DEFAULT 0, `id_inscripcion` int NOT NULL, `id_actividad_curso` int NOT NULL, UNIQUE INDEX `uq_intento_inscripcion_actividad_numero` (`id_inscripcion`, `id_actividad_curso`, `numero_intento`), PRIMARY KEY (`id_intento`)) ENGINE=InnoDB",
  },
  {
    name: 'opciones_respuesta',
    createSql:
      'CREATE TABLE `opciones_respuesta` (`id_opcion` int NOT NULL AUTO_INCREMENT, `texto_opcion` text NOT NULL, `es_correcta` tinyint NOT NULL DEFAULT 0, `orden` int NOT NULL, `id_problema` int NOT NULL, PRIMARY KEY (`id_opcion`)) ENGINE=InnoDB',
  },
  {
    name: 'evaluaciones_criterios',
    createSql:
      'CREATE TABLE `evaluaciones_criterios` (`id_evaluacion` int NOT NULL, `id_criterio` int NOT NULL, `puntaje_asignado` decimal(8,2) NOT NULL, `observacion` text NULL, PRIMARY KEY (`id_evaluacion`, `id_criterio`)) ENGINE=InnoDB',
  },
  {
    name: 'respuestas_intento',
    createSql:
      "CREATE TABLE `respuestas_intento` (`id_respuesta` int NOT NULL AUTO_INCREMENT, `respuesta_texto` text NULL, `es_correcta` tinyint NOT NULL DEFAULT 0, `puntaje_obtenido` decimal(8,2) NOT NULL DEFAULT '0.00', `retroalimentacion` text NULL, `id_intento` int NOT NULL, `id_problema` int NOT NULL, `id_opcion` int NULL, UNIQUE INDEX `uq_respuesta_intento_problema` (`id_intento`, `id_problema`), PRIMARY KEY (`id_respuesta`)) ENGINE=InnoDB",
  },
];

const FOREIGN_KEYS = [
  {
    table: 'actividades_competencias',
    name: 'FK_c6ae5362dfb962ffeb6e7dba49d',
    columns: ['id_actividad'],
    referencedTable: 'actividades',
    referencedColumns: ['id_actividad'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'actividades_competencias',
    name: 'FK_59b434efe0ed985fb1ba03d88e3',
    columns: ['id_competencia'],
    referencedTable: 'competencias',
    referencedColumns: ['id_competencia'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'transacciones_puntos',
    name: 'FK_49d2112c2e7c6ddaf2e1ae7247a',
    columns: ['id_perfil'],
    referencedTable: 'perfiles_gamificacion',
    referencedColumns: ['id_perfil'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'perfiles_gamificacion',
    name: 'FK_1080328bf6b108e7c32751b3250',
    columns: ['id_estudiante'],
    referencedTable: 'estudiantes',
    referencedColumns: ['id_estudiante'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'estudiantes_insignias',
    name: 'FK_2008080bc837328f4d021f3d064',
    columns: ['id_estudiante'],
    referencedTable: 'estudiantes',
    referencedColumns: ['id_estudiante'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'estudiantes_insignias',
    name: 'FK_7a77f2cfd76f15523fdba14c260',
    columns: ['id_insignia'],
    referencedTable: 'insignias',
    referencedColumns: ['id_insignia'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'estudiantes_insignias',
    name: 'FK_68448e1e0c82d1b4ef315dcc3e6',
    columns: ['id_curso'],
    referencedTable: 'cursos',
    referencedColumns: ['id_curso'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'reportes',
    name: 'FK_1ef18f97c16d39b7332c76e0814',
    columns: ['id_curso'],
    referencedTable: 'cursos',
    referencedColumns: ['id_curso'],
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'reportes',
    name: 'FK_7f9e3d9eb2e5a44746c796bed10',
    columns: ['id_estudiante'],
    referencedTable: 'estudiantes',
    referencedColumns: ['id_estudiante'],
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'reportes',
    name: 'FK_6cec2ed22194e0c2266831c8fd3',
    columns: ['id_docente'],
    referencedTable: 'docentes',
    referencedColumns: ['id_docente'],
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'progreso_competencias',
    name: 'FK_7f901da9bd4a373e0e9c0227988',
    columns: ['id_estudiante'],
    referencedTable: 'estudiantes',
    referencedColumns: ['id_estudiante'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'progreso_competencias',
    name: 'FK_a73920360ea2caccbe5186c33ca',
    columns: ['id_competencia'],
    referencedTable: 'competencias',
    referencedColumns: ['id_competencia'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'criterios_rubrica',
    name: 'FK_ec2d8345c72011ea1aa0b7fbf16',
    columns: ['id_rubrica'],
    referencedTable: 'rubricas',
    referencedColumns: ['id_rubrica'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'evaluaciones_criterios',
    name: 'FK_1ddca96f3e61108c3d564532d73',
    columns: ['id_evaluacion'],
    referencedTable: 'evaluaciones',
    referencedColumns: ['id_evaluacion'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'evaluaciones_criterios',
    name: 'FK_5b51d4dda2469b75dfd4610d316',
    columns: ['id_criterio'],
    referencedTable: 'criterios_rubrica',
    referencedColumns: ['id_criterio'],
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'evaluaciones',
    name: 'FK_9c223600201cdb2d67d7c11fd2b',
    columns: ['id_actividad_curso'],
    referencedTable: 'actividades_curso',
    referencedColumns: ['id_actividad_curso'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'opciones_respuesta',
    name: 'FK_5f37526e3993868fbb2c38583c2',
    columns: ['id_problema'],
    referencedTable: 'problemas',
    referencedColumns: ['id_problema'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'problemas',
    name: 'FK_ebd2ed375715c5b2075274f554e',
    columns: ['id_actividad'],
    referencedTable: 'actividades',
    referencedColumns: ['id_actividad'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'respuestas_intento',
    name: 'FK_ddec4e043ddea1bb2985abea566',
    columns: ['id_intento'],
    referencedTable: 'intentos_actividad',
    referencedColumns: ['id_intento'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'respuestas_intento',
    name: 'FK_1f4f222e86142cf5ab7da5e351e',
    columns: ['id_problema'],
    referencedTable: 'problemas',
    referencedColumns: ['id_problema'],
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'respuestas_intento',
    name: 'FK_172b0c727cbc966bb100999d591',
    columns: ['id_opcion'],
    referencedTable: 'opciones_respuesta',
    referencedColumns: ['id_opcion'],
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'intentos_actividad',
    name: 'FK_67a920f200f6babe738698c2250',
    columns: ['id_inscripcion'],
    referencedTable: 'inscripciones',
    referencedColumns: ['id_inscripcion'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'intentos_actividad',
    name: 'FK_09ed03928c0729d323c04062446',
    columns: ['id_actividad_curso'],
    referencedTable: 'actividades_curso',
    referencedColumns: ['id_actividad_curso'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'actividades_curso',
    name: 'FK_5837f071e42b1d4fdbe0639742a',
    columns: ['id_actividad'],
    referencedTable: 'actividades',
    referencedColumns: ['id_actividad'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'actividades_curso',
    name: 'FK_381b8a749268b7550e73c7a6cad',
    columns: ['id_curso'],
    referencedTable: 'cursos',
    referencedColumns: ['id_curso'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'actividades',
    name: 'FK_1c88a328ec1036d7c9e3fc1eddf',
    columns: ['id_rubrica'],
    referencedTable: 'rubricas',
    referencedColumns: ['id_rubrica'],
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'historias_usuario',
    name: 'FK_c3e7034790fb4534252dacfa92c',
    columns: ['id_sprint'],
    referencedTable: 'sprints',
    referencedColumns: ['id_sprint'],
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'tareas',
    name: 'FK_919f6363607cb2a8e535033bbf8',
    columns: ['id_historia'],
    referencedTable: 'historias_usuario',
    referencedColumns: ['id_historia'],
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'tareas',
    name: 'FK_486f5c399c21e8dda3d169f58bb',
    columns: ['id_sprint'],
    referencedTable: 'sprints',
    referencedColumns: ['id_sprint'],
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'tareas',
    name: 'FK_31be93a1ed2440d6f80381c313f',
    columns: ['id_responsable'],
    referencedTable: 'usuarios',
    referencedColumns: ['id_usuario'],
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    table: 'competencias_asignaturas',
    name: 'FK_3abbf83014ee4de89b616dc4a1d',
    columns: ['id_competencia'],
    referencedTable: 'competencias',
    referencedColumns: ['id_competencia'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  {
    table: 'competencias_asignaturas',
    name: 'FK_627be0b440bd0957b7f4a6ffedf',
    columns: ['id_asignatura'],
    referencedTable: 'asignaturas',
    referencedColumns: ['id_asignatura'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  {
    table: 'actividades_niveles',
    name: 'FK_953c5aecabe992e7c0cfdea4e1e',
    columns: ['id_actividad'],
    referencedTable: 'actividades',
    referencedColumns: ['id_actividad'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  {
    table: 'actividades_niveles',
    name: 'FK_93ceb564c47a12268385a825c8c',
    columns: ['id_nivel'],
    referencedTable: 'niveles_actividad',
    referencedColumns: ['id_nivel'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
];

export class CreateRemainingEduquestTables1795541000000
  implements MigrationInterface
{
  name = 'CreateRemainingEduquestTables1795541000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES) {
      if (await queryRunner.hasTable(table.name)) {
        throw new Error(
          `Refusing to create existing table ${table.name}; inspect the partial schema first.`,
        );
      }
    }

    for (const table of TABLES) {
      await queryRunner.query(table.createSql);
    }

    for (const foreignKey of FOREIGN_KEYS) {
      await queryRunner.createForeignKey(
        foreignKey.table,
        new TableForeignKey({
          name: foreignKey.name,
          columnNames: foreignKey.columns,
          referencedTableName: foreignKey.referencedTable,
          referencedColumnNames: foreignKey.referencedColumns,
          onDelete: foreignKey.onDelete,
          onUpdate: foreignKey.onUpdate,
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES) {
      if (!(await queryRunner.hasTable(table.name))) {
        throw new Error(
          `Refusing to roll back an incomplete schema; ${table.name} is missing.`,
        );
      }
      const rows: unknown[] = await queryRunner.query(
        `SELECT 1 FROM \`${table.name}\` LIMIT 1`,
      );
      if (rows.length > 0) {
        throw new Error(
          `Refusing to drop ${table.name}; it contains data. Export or review the data before rollback.`,
        );
      }
    }

    for (const table of [...TABLES].reverse()) {
      await queryRunner.query(`DROP TABLE \`${table.name}\``);
    }
  }
}
