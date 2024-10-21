// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { MessagesService } from './messages.class'

// Main data model schema
export const messagesSchema = {
  $id: 'Messages',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'userId', 'chatId', 'content'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    userId: { type: 'string' },
    chatId: { type: 'string' },
    content: { type: 'string' },
    images: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
  }
} as const
export type Messages = FromSchema<typeof messagesSchema>
export const messagesValidator = getValidator(messagesSchema, dataValidator)
export const messagesResolver = resolve<Messages, HookContext<MessagesService>>({})

export const messagesExternalResolver = resolve<Messages, HookContext<MessagesService>>({})

// Schema for creating new data
export const messagesDataSchema = {
  $id: 'MessagesData',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'userId', 'chatId', 'content'],
  properties: {
    ...messagesSchema.properties
  }
} as const
export type MessagesData = FromSchema<typeof messagesDataSchema>
export const messagesDataValidator = getValidator(messagesDataSchema, dataValidator)
export const messagesDataResolver = resolve<MessagesData, HookContext<MessagesService>>({})

// Schema for updating existing data
export const messagesPatchSchema = {
  $id: 'MessagesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...messagesSchema.properties
  }
} as const
export type MessagesPatch = FromSchema<typeof messagesPatchSchema>
export const messagesPatchValidator = getValidator(messagesPatchSchema, dataValidator)
export const messagesPatchResolver = resolve<MessagesPatch, HookContext<MessagesService>>({})

// Schema for allowed query properties
export const messagesQuerySchema = {
  $id: 'MessagesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(messagesSchema.properties)
  }
} as const
export type MessagesQuery = FromSchema<typeof messagesQuerySchema>
export const messagesQueryValidator = getValidator(messagesQuerySchema, queryValidator)
export const messagesQueryResolver = resolve<MessagesQuery, HookContext<MessagesService>>({})
