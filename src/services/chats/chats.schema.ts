// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ChatsService } from './chats.class'

// Main data model schema
export const chatsSchema = {
  $id: 'Chat',
  type: 'object',
  required: ['id', 'title', 'owner_id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    owner_id: { type: 'string', format: 'uuid' },
  }
} as const;

export type Chats = FromSchema<typeof chatsSchema>
export const chatsValidator = getValidator(chatsSchema, dataValidator)
export const chatsResolver = resolve<Chats, HookContext<ChatsService>>({})

export const chatsExternalResolver = resolve<Chats, HookContext<ChatsService>>({})

// Schema for creating new data
export const chatsDataSchema = {
  $id: 'ChatsData',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'owner_id'],
  properties: {
    ...chatsSchema.properties
  }
} as const
export type ChatsData = FromSchema<typeof chatsDataSchema>
export const chatsDataValidator = getValidator(chatsDataSchema, dataValidator)
export const chatsDataResolver = resolve<ChatsPatch, HookContext<ChatsService>>({});

// Schema for updating existing data
export const chatsPatchSchema = {
  $id: 'ChatsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...chatsSchema.properties
  }
} as const
export type ChatsPatch = FromSchema<typeof chatsPatchSchema>
export const chatsPatchValidator = getValidator(chatsPatchSchema, dataValidator)
export const chatsPatchResolver = resolve<ChatsPatch, HookContext<ChatsService>>({})

// Schema for allowed query properties
export const chatsQuerySchema = {
  $id: 'ChatsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(chatsSchema.properties)
  }
} as const
export type ChatsQuery = FromSchema<typeof chatsQuerySchema>
export const chatsQueryValidator = getValidator(chatsQuerySchema, queryValidator)
export const chatsQueryResolver = resolve<ChatsQuery, HookContext<ChatsService>>({})
