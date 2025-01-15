// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { chargerClient } from './services/chargers/chargers.shared'
export type { Charger, ChargerData, ChargerQuery, ChargerPatch } from './services/chargers/chargers.shared'

import { feedbackClient } from './services/feedback/feedback.shared'
export type {
  Feedback,
  FeedbackData,
  FeedbackQuery,
  FeedbackPatch
} from './services/feedback/feedback.shared'

import { favoriteClient } from './services/favorites/favorites.shared'
export type {
  Favorite,
  FavoriteData,
  FavoriteQuery,
  FavoritePatch
} from './services/favorites/favorites.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the xeal-demo app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(favoriteClient)
  client.configure(feedbackClient)
  client.configure(chargerClient)
  return client
}
