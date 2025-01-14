// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  favoriteDataValidator,
  favoritePatchValidator,
  favoriteQueryValidator,
  favoriteResolver,
  favoriteExternalResolver,
  favoriteDataResolver,
  favoritePatchResolver,
  favoriteQueryResolver
} from './favorites.schema'

import type { Application } from '../../declarations'
import { FavoriteService, getOptions } from './favorites.class'
import { favoritePath, favoriteMethods } from './favorites.shared'

export * from './favorites.class'
export * from './favorites.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const favorite = (app: Application) => {
  // Register our service on the Feathers application
  app.use(favoritePath, new FavoriteService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: favoriteMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(favoritePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(favoriteExternalResolver),
        schemaHooks.resolveResult(favoriteResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(favoriteQueryValidator),
        schemaHooks.resolveQuery(favoriteQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(favoriteDataValidator),
        schemaHooks.resolveData(favoriteDataResolver)
      ],
      patch: [
        schemaHooks.validateData(favoritePatchValidator),
        schemaHooks.resolveData(favoritePatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [favoritePath]: FavoriteService
  }
}
