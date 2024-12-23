import axios from "axios"
const baseUrl ='/api/queues'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (queueObject) => {
    const request = axios.post(baseUrl, queueObject)
    return request.then(response => response.data)
}

const getActive = () => {
    const request = axios.get(`${baseUrl}/active`);
    return request.then(response => response.data);
  };

const update = (id, updatedQueue) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedQueue);
    return request.then(response => response.data);
};

export default { getAll, create, getActive, update };