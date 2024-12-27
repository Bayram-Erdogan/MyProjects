import axios from "axios";

const baseUrl = '/api/queues';


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

const create = (queueObject) => {
  const request = axios.post(baseUrl, queueObject, getConfig());
  return request.then(response => response.data);
};

const getActive = () => {
  const request = axios.get(`${baseUrl}/active`, getConfig());
  return request.then(response => response.data);
};

const update = (id, updatedQueue) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedQueue, getConfig());
  return request.then(response => response.data);
};

export default { getAll, create, getActive, update };
