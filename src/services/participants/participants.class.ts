// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  Participants,
  ParticipantsData,
  ParticipantsPatch,
  ParticipantsQuery
} from './participants.schema'

export type { Participants, ParticipantsData, ParticipantsPatch, ParticipantsQuery }

export interface ParticipantsParams extends KnexAdapterParams<ParticipantsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ParticipantsService<ServiceParams extends Params = ParticipantsParams> extends KnexService<
  Participants,
  ParticipantsData,
  ParticipantsParams,
  ParticipantsPatch
> {
  async findByChat(params: ParticipantsParams): Promise<Participants[]> {
    const { query } = params || {};

    if (!query || !query.chatId) {
      throw new Error('chatId is required');
    }

    const participants = await this.Model
      .select('participants.id', 'users.username', 'users.avatar') // выбираем только нужные поля
      .from('participants')
      .join('users', 'participants.userId', '=', 'users.id')
      .where('participants.chatId', query.chatId);

    // Возвращаем только необходимые поля
    return participants.map(participant => ({
      id: participant.id,
      username: participant.username,
      avatar: participant.avatar
    })) as any;
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'participants'
  }
}
