import axios from 'axios';

const RECHARGE_API_URL = import.meta.env.VITE_RECHARGE_API_URL || 'localhost:8000';

export async function fetchFavorites(user) {
  return new Promise<{ data: any }>(async (resolve) => {
    await axios.get(`http://${RECHARGE_API_URL}/favorites?user=${user}`)
    .then((response) => {
      resolve({ data: response.data.map(obj => obj["chargerId"]) })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  });
}

export async function postFavorite(user, chargerId) {
  return new Promise<{ data: any }>(async (resolve) => {
    await axios.post(`http://${RECHARGE_API_URL}/favorites`, {
      username: user,
      chargerId: chargerId,
    })
    .then((response) => {
      resolve({ data: response.data })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  });
}

export async function postFeedback(user, chargerId, rating, description) {
  return new Promise<{ data: any }>(async (resolve) => {
    await axios.post(`http://${RECHARGE_API_URL}/feedback`, {
      username: user,
      chargerId: chargerId,
      rating: rating,
      description: description,
    })
    .then((response) => {
      resolve({ data: response.data })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  });
}
