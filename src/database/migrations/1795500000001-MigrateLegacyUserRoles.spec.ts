import { QueryRunner } from 'typeorm';
import { MigrateLegacyUserRoles1795500000001 } from './1795500000001-MigrateLegacyUserRoles';

describe('MigrateLegacyUserRoles1795500000001', () => {
  const migration = new MigrateLegacyUserRoles1795500000001();

  it('copies only valid, non-conflicting mappings and skips existing pairs', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    await migration.up({ query } as unknown as QueryRunner);

    const sql = query.mock.calls[0][0] as string;
    expect(sql).toContain('INSERT INTO `USUARIO_ROL`');
    expect(sql).toContain('u.`id_rol` IS NOT NULL');
    expect(sql).toContain('BINARY u.`rol` = BINARY r.`nombre`');
    expect(sql).toContain('u.`id_rol` IS NULL');
    expect(sql).toContain('LEFT JOIN `USUARIO_ROL` existing');
    expect(sql).toContain('WHERE existing.`id_usuario` IS NULL');
    expect(sql).not.toMatch(/^\s*(UPDATE|DELETE|ALTER)\b/im);
  });

  it('refuses an unsafe automatic rollback', async () => {
    await expect(migration.down()).rejects.toThrow(
      'Legacy role assignments cannot be safely reverted automatically',
    );
  });
});
