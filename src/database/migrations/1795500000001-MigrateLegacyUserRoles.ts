import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateLegacyUserRoles1795500000001
  implements MigrationInterface
{
  name = 'MigrateLegacyUserRoles1795500000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`USUARIO_ROL\` (\`id_usuario\`, \`id_rol\`)
      SELECT candidate.\`id_usuario\`, candidate.\`id_rol\`
      FROM (
        SELECT u.\`id_usuario\`, r.\`id_rol\`
        FROM \`usuarios\` u
        INNER JOIN \`roles\` r ON r.\`id_rol\` = u.\`id_rol\`
        WHERE u.\`id_rol\` IS NOT NULL
          AND (
            u.\`rol\` IS NULL
            OR TRIM(u.\`rol\`) = ''
            OR BINARY u.\`rol\` = BINARY r.\`nombre\`
          )

        UNION

        SELECT u.\`id_usuario\`, r.\`id_rol\`
        FROM \`usuarios\` u
        INNER JOIN \`roles\` r ON BINARY r.\`nombre\` = BINARY u.\`rol\`
        WHERE u.\`id_rol\` IS NULL
          AND u.\`rol\` IS NOT NULL
          AND TRIM(u.\`rol\`) <> ''
      ) AS candidate
      LEFT JOIN \`USUARIO_ROL\` existing
        ON existing.\`id_usuario\` = candidate.\`id_usuario\`
        AND existing.\`id_rol\` = candidate.\`id_rol\`
      WHERE existing.\`id_usuario\` IS NULL
    `);
  }

  async down(): Promise<void> {
    throw new Error(
      'Legacy role assignments cannot be safely reverted automatically; review and restore them manually.',
    );
  }
}
