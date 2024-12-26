import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = userObject => {
  const request = axios.post(baseUrl, userObject)
  return request.then(response => response.data)
}

const update = (id, updatedUser) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedUser);
  return request.then(response => response.data);
};

export default { getAll, create, update }