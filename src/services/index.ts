import { feedback } from './feedback/feedback'
import { favorite } from './favorites/favorites'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(feedback)
  app.configure(favorite)
  app.configure(user)
  // All services will be registered here
}
