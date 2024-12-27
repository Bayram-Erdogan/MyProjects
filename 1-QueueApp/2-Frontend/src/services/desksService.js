import axios from "axios";

const baseUrl = '/api/desks';

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

const create = (deskObject) => {
  const request = axios.post(baseUrl, deskObject, getConfig());
  return request.then(response => response.data);
};

const update = (id, updateDesk) => {
  const request = axios.put(`${baseUrl}/${id}`, updateDesk, getConfig());
  return request.then(response => response.data);
};

export default { getAll, create, update };
