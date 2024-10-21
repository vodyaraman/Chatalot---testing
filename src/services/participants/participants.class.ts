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
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'participants'
  }
}
