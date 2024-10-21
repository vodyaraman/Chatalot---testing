// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Chats, ChatsData, ChatsPatch, ChatsQuery } from './chats.schema'

export type { Chats, ChatsData, ChatsPatch, ChatsQuery }

export interface ChatsParams extends KnexAdapterParams<ChatsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ChatsService<ServiceParams extends Params = ChatsParams> extends KnexService<
  Chats,
  ChatsData,
  ChatsParams,
  ChatsPatch
> {
  async getChatWithMessages(chatId: string, params?: ServiceParams) {
    const chat = await this.get(chatId, params);
    const messages = await this.options.Model('messages').where({ chatId });
    return {
      ...chat,
      messages
    };
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'chats'
  }
}
