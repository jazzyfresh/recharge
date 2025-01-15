// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Favorite, FavoriteData, FavoritePatch, FavoriteQuery, FavoriteService } from './favorites.class'

export type { Favorite, FavoriteData, FavoritePatch, FavoriteQuery }

export type FavoriteClientService = Pick<
  FavoriteService<Params<FavoriteQuery>>,
  (typeof favoriteMethods)[number]
>

export const favoritePath = 'favorites'

export const favoriteMethods: Array<keyof FavoriteService> = ['find', 'get', 'create', 'patch', 'remove']

export const favoriteClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(favoritePath, connection.service(favoritePath), {
    methods: favoriteMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [favoritePath]: FavoriteClientService
  }
}
