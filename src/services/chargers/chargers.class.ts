// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
//
import axios from 'axios'
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

type Charger = any
type ChargerData = any
type ChargerPatch = any
type ChargerQuery = any

export type { Charger, ChargerData, ChargerPatch, ChargerQuery }

export interface ChargerServiceOptions {
  app: Application
}


export interface ChargerParams extends Params<ChargerQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ChargerService<ServiceParams extends ChargerParams = ChargerParams>
  implements ServiceInterface<Charger, ChargerData, ServiceParams, ChargerPatch>
{
  constructor(public options: ChargerServiceOptions) {}

  async find(_params?: ChargerParams): Promise<Charger[]> {
    // Default location: 3rd Street Promenade
    const location = (_params && _params.query && _params.query.location) ?
      _params.query.location : '1351 3rd Street Promenade Santa Monica CA'
    // Nearest electric charging stations:
    //   public access
    //   available status
    //   within 50 mile radius
    return await axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=DEMO_KEY&fuel_type=ELEC&access=public&status=E&radius=50&location=${location}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error('Error:', error)
        return []
      })
  }

  async get(id: Id, _params?: ServiceParams): Promise<Charger> {
    return await axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/${id}.json?api_key=DEMO_KEY`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error('Error:', error)
        return []
      })
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
