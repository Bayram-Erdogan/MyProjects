import axios from 'axios';

const baseUrl = '/api/users';


const getConfig = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getAll = () => {
  const request = axios.get(baseUrl, getConfig());
  return request.then(response => response.data);
};

const create = (userObject) => {
  const request = axios.post(baseUrl, userObject, getConfig());
  return request.then(response => response.data);
};

const update = (id, updatedUser) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedUser, getConfig());
  return request.then(response => response.data);
};

export default { getAll, create, update };
