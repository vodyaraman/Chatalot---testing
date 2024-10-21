// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  messagesDataValidator,
  messagesPatchValidator,
  messagesQueryValidator,
  messagesResolver,
  messagesExternalResolver,
  messagesDataResolver,
  messagesPatchResolver,
  messagesQueryResolver,
  MessagesData
} from './messages.schema'

import type { Application } from '../../declarations'
import { MessagesService, getOptions } from './messages.class'
import { messagesPath, messagesMethods } from './messages.shared'
import { v4 as uuidv4 } from 'uuid';

export * from './messages.class'
export * from './messages.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const messages = (app: Application) => {
  // Register our service on the Feathers application
  app.use(messagesPath, new MessagesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: messagesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(messagesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(messagesExternalResolver),
        schemaHooks.resolveResult(messagesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(messagesQueryValidator),
        schemaHooks.resolveQuery(messagesQueryResolver)
      ],
      find: [
        async (context) => {
          // Adding sorting logic to ensure messages are returned in the correct order
          if (!context.params.query) {
            context.params.query = {};
          }
          context.params.query.$sort = { createdAt: 1 }; // Sort messages by 'createdAt' in ascending order
          return context;
        }
      ],
      get: [],
      create: [
        async (context) => {
          const data = context.data as Partial<MessagesData>;
          if (!data.id) {
            data.id = uuidv4();
            
          }
          return context
        },
        schemaHooks.validateData(messagesDataValidator),
        schemaHooks.resolveData(messagesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(messagesPatchValidator),
        schemaHooks.resolveData(messagesPatchResolver)
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
    [messagesPath]: MessagesService
  }
}
