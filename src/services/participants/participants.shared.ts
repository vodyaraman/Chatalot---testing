// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Participants,
  ParticipantsData,
  ParticipantsPatch,
  ParticipantsQuery,
  ParticipantsService
} from './participants.class'

export type { Participants, ParticipantsData, ParticipantsPatch, ParticipantsQuery }

export type ParticipantsClientService = Pick<
  ParticipantsService<Params<ParticipantsQuery>>,
  (typeof participantsMethods)[number]
>

export const participantsPath = 'participants'

export const participantsMethods: Array<keyof ParticipantsService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const participantsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(participantsPath, connection.service(participantsPath), {
    methods: participantsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [participantsPath]: ParticipantsClientService
  }
}
