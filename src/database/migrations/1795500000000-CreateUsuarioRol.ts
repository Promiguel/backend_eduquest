import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsuarioRol1795500000000 implements MigrationInterface {
  name = 'CreateUsuarioRol1795500000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`USUARIO_ROL\` (
        \`id_usuario\` int NOT NULL,
        \`id_rol\` int NOT NULL,
        INDEX \`IDX_USUARIO_ROL_id_rol\` (\`id_rol\`),
        PRIMARY KEY (\`id_usuario\`, \`id_rol\`),
        CONSTRAINT \`FK_USUARIO_ROL_usuarios_id_usuario\`
          FOREIGN KEY (\`id_usuario\`) REFERENCES \`usuarios\` (\`id_usuario\`)
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_USUARIO_ROL_roles_id_rol\`
          FOREIGN KEY (\`id_rol\`) REFERENCES \`roles\` (\`id_rol\`)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `USUARIO_ROL`');
  }
}
