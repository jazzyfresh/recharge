// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Charger, ChargerData, ChargerPatch, ChargerQuery, ChargerService } from './chargers.class'

export type { Charger, ChargerData, ChargerPatch, ChargerQuery }

export type ChargerClientService = Pick<ChargerService<Params<ChargerQuery>>, (typeof chargerMethods)[number]>

export const chargerPath = 'chargers'

export const chargerMethods: Array<keyof ChargerService> = ['find', 'get']

export const chargerClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(chargerPath, connection.service(chargerPath), {
    methods: chargerMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [chargerPath]: ChargerClientService
  }
}
