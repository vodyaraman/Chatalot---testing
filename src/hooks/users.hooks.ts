import { hooks as schemaHooks } from '@feathersjs/schema';
import { authenticate } from '@feathersjs/authentication';
import { passwordHash } from '@feathersjs/authentication-local';
import type { HookContext } from '@feathersjs/feathers';

const userHooks = {
  before: {
    all: [],
    find: [authenticate('jwt') as any], // Указали `as any` для временного обхода проблем с типизацией
    get: [authenticate('jwt') as any],
    create: [
      passwordHash({ strategy: 'local' }) as any // Хэширование пароля при создании пользователя
    ],
    update: [authenticate('jwt') as any],
    patch: [
      authenticate('jwt') as any,
      passwordHash({ strategy: 'local' }) as any // Хэширование при обновлении пароля
    ],
    remove: [authenticate('jwt') as any]
  },
  after: {},
  error: {}
};

export default userHooks;
