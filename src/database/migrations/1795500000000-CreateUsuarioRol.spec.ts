import { QueryRunner } from 'typeorm';
import { CreateUsuarioRol1795500000000 } from './1795500000000-CreateUsuarioRol';

describe('CreateUsuarioRol1795500000000', () => {
  const migration = new CreateUsuarioRol1795500000000();

  it('creates the composite-key join table without migrating existing rows', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    await migration.up({ query } as unknown as QueryRunner);

    const sql = query.mock.calls[0][0] as string;
    expect(sql).toContain('CREATE TABLE `USUARIO_ROL`');
    expect(sql).toContain('PRIMARY KEY (`id_usuario`, `id_rol`)');
    expect(sql).toContain('REFERENCES `usuarios` (`id_usuario`)');
    expect(sql).toContain('REFERENCES `roles` (`id_rol`)');
    expect(sql).not.toMatch(/^\s*(INSERT|UPDATE|DELETE)\b/im);
  });

  it('drops only the join table when reverted', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    await migration.down({ query } as unknown as QueryRunner);

    expect(query).toHaveBeenCalledWith('DROP TABLE `USUARIO_ROL`');
  });
});
