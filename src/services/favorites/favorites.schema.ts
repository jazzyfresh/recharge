// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FavoriteService } from './favorites.class'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const favoriteSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    chargerId: Type.Number(),
    userId: Type.String({ objectid: true }),
		user: Type.Ref(userSchema)
  },
  { $id: 'Favorite', additionalProperties: false }
)
export type Favorite = Static<typeof favoriteSchema>
export const favoriteValidator = getValidator(favoriteSchema, dataValidator)
export const favoriteResolver = resolve<Favorite, HookContext<FavoriteService>>({
  user: virtual(async (favorite, context) => {
    return context.app.service('users').get(favorite.userId)
  })
})

export const favoriteExternalResolver = resolve<Favorite, HookContext<FavoriteService>>({})

// Schema for creating new entries
export const favoriteDataSchema = Type.Pick(favoriteSchema, ['chargerId'], {
  $id: 'FavoriteData'
})
export type FavoriteData = Static<typeof favoriteDataSchema>
export const favoriteDataValidator = getValidator(favoriteDataSchema, dataValidator)
export const favoriteDataResolver = resolve<Favorite, HookContext>({
  userId: async (_value, _favorite, context) => {
    return context.params.user._id
  }
})

// Schema for updating existing entries
export const favoritePatchSchema = Type.Partial(favoriteSchema, {
  $id: 'FavoritePatch'
})
export type FavoritePatch = Static<typeof favoritePatchSchema>
export const favoritePatchValidator = getValidator(favoritePatchSchema, dataValidator)
export const favoritePatchResolver = resolve<Favorite, HookContext<FavoriteService>>({})

// Schema for allowed query properties
export const favoriteQueryProperties = Type.Pick(favoriteSchema, ['_id', 'chargerId', 'userId'])
export const favoriteQuerySchema = Type.Intersect(
  [
    querySyntax(favoriteQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type FavoriteQuery = Static<typeof favoriteQuerySchema>
export const favoriteQueryValidator = getValidator(favoriteQuerySchema, queryValidator)
export const favoriteQueryResolver = resolve<FavoriteQuery, HookContext<FavoriteService>>({})
