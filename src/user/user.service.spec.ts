import { DataSource, EntityManager, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService role assignments', () => {
  const userRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };
  const roleRepository = { findOneBy: jest.fn() };
  const userRoleRepository = {
    findOneBy: jest.fn(),
    upsert: jest.fn(),
    remove: jest.fn(),
  };
  const dataSource = { transaction: jest.fn() };
  const service = new UserService(
    userRepository as unknown as Repository<User>,
    roleRepository as unknown as Repository<Role>,
    userRoleRepository as unknown as Repository<UserRole>,
    dataSource as unknown as DataSource,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user and assigns each requested role in the transaction', async () => {
    const roles = [
      { id_rol: 2, nombre: 'docente' },
      { id_rol: 5, nombre: 'administrador' },
    ];
    const manager = {
      find: jest.fn().mockResolvedValue(roles),
      create: jest.fn((_entity, values) => values),
      save: jest
        .fn()
        .mockImplementation((entity, value) =>
          entity === User ? { ...value, id_usuario: 20 } : value,
        ),
    };
    dataSource.transaction.mockImplementation(
      (work: (manager: EntityManager) => Promise<number>) =>
        work(manager as unknown as EntityManager),
    );
    userRepository.findOneBy.mockResolvedValue(null);
    userRepository.findOne.mockResolvedValue({
      id_usuario: 20,
      nombre: 'Ada',
      apellido: null,
      correo: 'ada@example.test',
      estado: 'activo',
      fecha_registro: new Date(),
      userRoles: roles.map((role) => ({ role })),
    });

    const result = await service.create({
      nombre: 'Ada',
      apellido: undefined,
      correo: 'ada@example.test',
      password: 'secure-password',
      roleIds: [2, 5],
    });

    expect(manager.save).toHaveBeenCalledWith(
      UserRole,
      expect.arrayContaining([
        expect.objectContaining({ id_usuario: 20, id_rol: 2 }),
        expect.objectContaining({ id_usuario: 20, id_rol: 5 }),
      ]),
    );
    expect(result.roles.map((role) => role.id_rol)).toEqual([2, 5]);
    expect(result).not.toHaveProperty('rol');
  });

  it('adds a role idempotently without replacing the other assignments', async () => {
    const roles = [
      { id_rol: 2, nombre: 'docente' },
      { id_rol: 5, nombre: 'administrador' },
    ];
    userRepository.findOne.mockResolvedValue({
      id_usuario: 20,
      userRoles: roles.map((role) => ({ role })),
    });
    roleRepository.findOneBy.mockResolvedValue(roles[1]);

    const result = await service.addRole(20, 5);

    expect(userRoleRepository.upsert).toHaveBeenCalledWith(
      { id_usuario: 20, id_rol: 5 },
      ['id_usuario', 'id_rol'],
    );
    expect(result.map((role) => role.id_rol)).toEqual([2, 5]);
  });

  it('removes only the requested role assignment', async () => {
    const remainingRole = { id_rol: 2, nombre: 'docente' };
    userRepository.findOne
      .mockResolvedValueOnce({
        id_usuario: 20,
        userRoles: [
          { role: remainingRole },
          { role: { id_rol: 5, nombre: 'administrador' } },
        ],
      })
      .mockResolvedValueOnce({
        id_usuario: 20,
        userRoles: [{ role: remainingRole }],
      });
    roleRepository.findOneBy.mockResolvedValue({
      id_rol: 5,
      nombre: 'administrador',
    });
    const assignment = { id_usuario: 20, id_rol: 5 };
    userRoleRepository.findOneBy.mockResolvedValue(assignment);

    const result = await service.removeRole(20, 5);

    expect(userRoleRepository.remove).toHaveBeenCalledWith(assignment);
    expect(result.map((role) => role.id_rol)).toEqual([2]);
  });

  it('rejects role IDs that do not exist', async () => {
    userRepository.findOne.mockResolvedValue({
      id_usuario: 20,
      userRoles: [],
    });
    roleRepository.findOneBy.mockResolvedValue(null);

    await expect(service.addRole(20, 99)).rejects.toThrow(
      'Rol con ID 99 no encontrado',
    );
    expect(userRoleRepository.upsert).not.toHaveBeenCalled();
  });
});
