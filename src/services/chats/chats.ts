// chats.ts

// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  chatsDataValidator,
  chatsPatchValidator,
  chatsQueryValidator,
  chatsResolver,
  chatsExternalResolver,
  chatsDataResolver,
  chatsPatchResolver,
  chatsQueryResolver,
  ChatsData
} from './chats.schema'

import type { Application } from '../../declarations'
import { ChatsService, getOptions } from './chats.class'
import { chatsPath, chatsMethods } from './chats.shared'
import { v4 as uuidv4 } from 'uuid';
import { Paginated } from '@feathersjs/feathers/lib/declarations'

export * from './chats.class'
export * from './chats.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const chats = (app: Application) => {
  // Register our service on the Feathers application
  app.use(chatsPath, new ChatsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: chatsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  app.service('chats').hooks({
    before: {
      find: [
        async (context) => {
          const { userId } = context.params.query || {} as any;
  
          // Проверка на наличие userId в запросе
          if (userId) {
            // Получаем все chatId для данного участника из таблицы participants
            const participantChatIds = await app.service('participants').Model
              .select('chatId')
              .from('participants')
              .where('userId', userId);
  
            if (!participantChatIds.length) {
              context.result = [];
              return context;
            }
  
            const chatIds = participantChatIds.map((participant) => participant.chatId);
  
            // Обновляем запрос для поиска чатов с полученными chatIds
            context.params.query = {
              id: { $in: chatIds }
            };
          }
  
          return context;
        }
      ]
    }
  });  
  // Initialize hooks
  app.service(chatsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(chatsExternalResolver),
        schemaHooks.resolveResult(chatsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(chatsQueryValidator), schemaHooks.resolveQuery(chatsQueryResolver)],
      find: [],
      get: [],
      create: [
        async (context) => {
          const data = context.data as Partial<ChatsData>;
          if (!data.id) {
            data.id = uuidv4();
          }
          if (!data.title || !data.owner_id ) {
            throw new Error('Title, owner_id, and participants are required fields cannot be empty.');
          }
          console.log(context)
          return context;
        },
        schemaHooks.validateData(chatsDataValidator),
        schemaHooks.resolveData(chatsDataResolver)
      ],
      patch: [
        async (context) => {
          const data = context.data as Partial<ChatsData>;
      
          // Если нужно обновить заголовок чата
          if (data?.title) {
            if (!data.title) {
              throw new Error('Title is required for updating a chat.');
            }
          }
        schemaHooks.validateData(chatsPatchValidator),
        schemaHooks.resolveData(chatsPatchResolver)
        }
      ],
      

      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [chatsPath]: ChatsService
  }
}
