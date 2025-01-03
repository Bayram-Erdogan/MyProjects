import axios from 'axios'
const baseUrl = '/api/signIn'

const signIn = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { signIn }