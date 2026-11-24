import { QueryRunner } from 'typeorm';
import { CreateRemainingEduquestTables1795541000000 } from './1795541000000-CreateRemainingEduquestTables';

describe('CreateRemainingEduquestTables1795541000000', () => {
  const migration = new CreateRemainingEduquestTables1795541000000();

  it('creates only the 23 missing tables and their foreign keys', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const createForeignKey = jest.fn().mockResolvedValue(undefined);
    const hasTable = jest.fn().mockResolvedValue(false);

    await migration.up({
      query,
      createForeignKey,
      hasTable,
    } as unknown as QueryRunner);

    const statements = query.mock.calls.map(([sql]) => sql as string);
    const createStatements = statements.filter((sql) =>
      sql.startsWith('CREATE TABLE'),
    );
    expect(createStatements).toHaveLength(23);
    expect(createForeignKey).toHaveBeenCalledTimes(34);
    expect(statements.join('\n')).not.toContain('USUARIO_ROL');
    expect(statements.join('\n')).not.toContain('usuarios` DROP');
    expect(hasTable).not.toHaveBeenCalledWith('USUARIO_ROL');
  });

  it('refuses to create tables if the schema is partially present', async () => {
    const query = jest.fn();
    const createForeignKey = jest.fn();
    const hasTable = jest
      .fn()
      .mockImplementation(async (name: string) => name === 'actividades');

    await expect(
      migration.up({
        query,
        createForeignKey,
        hasTable,
      } as unknown as QueryRunner),
    ).rejects.toThrow('Refusing to create existing table actividades');

    expect(query).not.toHaveBeenCalled();
    expect(createForeignKey).not.toHaveBeenCalled();
  });

  it('drops the new tables in reverse dependency order only when empty', async () => {
    const query = jest
      .fn()
      .mockImplementation(async (sql: string) =>
        sql.startsWith('SELECT') ? [] : undefined,
      );
    const hasTable = jest.fn().mockResolvedValue(true);

    await migration.down({
      query,
      hasTable,
    } as unknown as QueryRunner);

    const drops = query.mock.calls
      .map(([sql]) => sql as string)
      .filter((sql) => sql.startsWith('DROP TABLE'));
    expect(drops).toHaveLength(23);
    expect(drops[0]).toBe('DROP TABLE `respuestas_intento`');
    expect(drops[drops.length - 1]).toBe(
      'DROP TABLE `competencias_asignaturas`',
    );
  });

  it('refuses rollback before dropping anything when a table has data', async () => {
    const query = jest.fn().mockResolvedValue([{ present: 1 }]);
    const hasTable = jest.fn().mockResolvedValue(true);

    await expect(
      migration.down({
        query,
        hasTable,
      } as unknown as QueryRunner),
    ).rejects.toThrow('contains data');

    expect(
      query.mock.calls.some(([sql]) => (sql as string).startsWith('DROP TABLE')),
    ).toBe(false);
  });
});
