import { participants } from './participants/participants'
import { messages } from './messages/messages'
import { chats } from './chats/chats'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(participants)
  app.configure(messages)
  app.configure(chats)
  app.configure(user)
  // All services will be registered here
}
