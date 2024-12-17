import axios from "axios";
const baseUrl = '/api/customers'

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data)
}

const create = (customerObject) => {
    const request = axios.post(baseUrl, customerObject);
    return request.then(response => response.data)
}

export default {getAll, create}