import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const handler = jest.fn();
  const controller = jest.fn();
  const requiredRoles = ['docente'];

  function createGuard(user: { roles?: string[]; rol?: string | null }) {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(requiredRoles),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: () => handler,
      getClass: () => controller,
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as ExecutionContext;
    return guard.canActivate(context);
  }

  it('allows access when any assigned role matches', () => {
    expect(
      createGuard({ roles: ['estudiante', 'docente'] }),
    ).toBe(true);
  });

  it('denies access when none of the assigned roles match', () => {
    expect(createGuard({ roles: ['estudiante'] })).toBe(false);
  });

  it('continues to accept a legacy scalar role principal', () => {
    expect(createGuard({ rol: 'docente' })).toBe(true);
  });
});
