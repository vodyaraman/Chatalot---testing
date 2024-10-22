// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ParticipantsService } from './participants.class'

// Main data model schema
  export const participantsSchema = {
    $id: 'Participants',
    type: 'object',
    additionalProperties: false,
    required: ['id', 'chatId', 'userId'],
    properties: {
      id: { type: 'string', format: 'uuid' }, 
      chatId: { type: 'string', },
      userId: { type: 'string', } 
    }
  } as const;

  export interface ExportParticipant {
    id: string;
    username: string;
    avatar: string;
  }

export type Participants = FromSchema<typeof participantsSchema>
export const participantsValidator = getValidator(participantsSchema, dataValidator)
export const participantsResolver = resolve<Participants, HookContext<ParticipantsService>>({})

export const participantsExternalResolver = resolve<Participants, HookContext<ParticipantsService>>({})

// Schema for creating new data
export const participantsDataSchema = {
  $id: 'ParticipantsData',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'chatId', 'userId'],
  properties: {
    ...participantsSchema.properties
  }
} as const
export type ParticipantsData = FromSchema<typeof participantsDataSchema>
export const participantsDataValidator = getValidator(participantsDataSchema, dataValidator)
export const participantsDataResolver = resolve<ParticipantsData, HookContext<ParticipantsService>>({})

// Schema for updating existing data
export const participantsPatchSchema = {
  $id: 'ParticipantsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...participantsSchema.properties
  }
} as const
export type ParticipantsPatch = FromSchema<typeof participantsPatchSchema>
export const participantsPatchValidator = getValidator(participantsPatchSchema, dataValidator)
export const participantsPatchResolver = resolve<ParticipantsPatch, HookContext<ParticipantsService>>({})

// Schema for allowed query properties
export const participantsQuerySchema = {
  $id: 'ParticipantsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(participantsSchema.properties)
  }
} as const
export type ParticipantsQuery = FromSchema<typeof participantsQuerySchema>
export const participantsQueryValidator = getValidator(participantsQuerySchema, queryValidator)
export const participantsQueryResolver = resolve<ParticipantsQuery, HookContext<ParticipantsService>>({})
