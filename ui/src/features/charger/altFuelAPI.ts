import axios from 'axios';

const API_KEY = import.meta.env.VITE_NREL_API_KEY || 'DEMO_KEY';
const DEFAULT_LOCATION = "317 S Broadway Los Angeles CA"

export async function fetchChargers(location = DEFAULT_LOCATION) {
  return new Promise<{ data: any }>(async (resolve) => {
    console.log(`find location: ${location}`)
    await axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${API_KEY}&fuel_type=ELEC&access=public&status=E&radius=50&limit=200&location=${location}`)
      .then((response) => {
        resolve({ data: response.data })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  });
}

export async function fetchCharger(id: string) {
  return new Promise<{ data: any }>(async (resolve) => {
    console.log(`get id: ${id}`)
    await axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/${id}.json?api_key=${API_KEY}`)
      .then((response) => {
        resolve({ data: response.data })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  });
}
