// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import { v4 as uuidv4 } from 'uuid';

import {
  participantsDataValidator,
  participantsPatchValidator,
  participantsQueryValidator,
  participantsResolver,
  participantsExternalResolver,
  participantsDataResolver,
  participantsPatchResolver,
  participantsQueryResolver
} from './participants.schema'

import type { Application } from '../../declarations'
import { ParticipantsService, getOptions } from './participants.class'
import { participantsPath, participantsMethods } from './participants.shared'

export * from './participants.class'
export * from './participants.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const participants = (app: Application) => {
  // Register our service on the Feathers application
  app.use(participantsPath, new ParticipantsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: participantsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })

  // Initialize hooks
  app.service(participantsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(participantsExternalResolver),
        schemaHooks.resolveResult(participantsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(participantsQueryValidator),
        schemaHooks.resolveQuery(participantsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        async (context) => {
          if (!context?.id) {
            context.id = uuidv4();
          }
          return context;
        },
        schemaHooks.validateData(participantsDataValidator),
        schemaHooks.resolveData(participantsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(participantsPatchValidator),
        schemaHooks.resolveData(participantsPatchResolver)
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
    [participantsPath]: ParticipantsService
  }
}
