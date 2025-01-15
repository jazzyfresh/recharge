// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { ChargerService, getOptions } from './chargers.class'
import { chargerPath, chargerMethods } from './chargers.shared'

export * from './chargers.class'

// A configure function that registers the service and its hooks via `app.configure`
export const charger = (app: Application) => {
  // Register our service on the Feathers application
  app.use(chargerPath, new ChargerService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: chargerMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(chargerPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: []
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
    [chargerPath]: ChargerService
  }
}
