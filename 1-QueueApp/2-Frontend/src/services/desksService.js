import axios from "axios"
const baseUrl ='/api/desks'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response =>response.data)
}

const create = deskObject => {
    const request = axios.post(baseUrl,deskObject)
    return request.then(response => response.data)
}

const update = (id, updateDesk) => {
    const request = axios.put(`${baseUrl}/${id}`, updateDesk);
    return request.then(response => response.data);
};

export default {getAll, create, update}