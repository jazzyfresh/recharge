import axios from 'axios';

const DEFAULT_LOCATION = "3rd Street Promenade, Santa Monica, CA"

export function fetchChargers(location = DEFAULT_LOCATION) {
  return new Promise<{ data: any }>((resolve) => {
    console.log(`find location: ${location}`)
    axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=DEMO_KEY&fuel_type=ELEC&access=public&status=E&radius=50&location=${location}`)
      .then((response) => {
        resolve({ data: response.data })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  });
}

export function fetchCharger(id: string) {
  return new Promise<{ data: any }>((resolve) => {
    console.log(`get id: ${id}`)
    axios.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/${id}.json?api_key=DEMO_KEY`)
      .then((response) => {
        resolve({ data: response.data })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  });
}
