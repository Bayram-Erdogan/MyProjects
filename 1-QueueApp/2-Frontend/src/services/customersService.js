import axios from "axios";

const baseUrl = '/api/customers';

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

const create = (customerObject) => {
  const request = axios.post(baseUrl, customerObject, getConfig());
  return request.then(response => response.data);
};

const update = (id, updateCustomer) => {
  const request = axios.put(`${baseUrl}/${id}`, updateCustomer, getConfig());
  return request.then(response => response.data);
};

const leaveQueue = (id) => {
  const request = axios.put(`${baseUrl}/${id}`, { status: 'abandoned' }, getConfig());
  return request.then(response => response.data);
};
export default { getAll, create, update,leaveQueue };
