import axios from 'axios';
import { API } from '../../config/apiUrl';

class DataService {
    // Fetch tickets with pagination
    getData = (page = 1, pageSize = 10) => {
        return axios.get(`${API}/Ticket`, {
            params: { page, pageSize },
            headers: {
                'Accept': '*/*',
            },
        });
    };

    // Fetch a single ticket by ID
    getRequest = (id) => {
        return axios.get(`${API}/Ticket/${id}`);
    };

    // Save a new ticket
    saveRequest = (ticket) => {
        return axios.post(`${API}/Ticket`, ticket);
    };

    // Update an existing ticket by ID
    updateRequest = (id, ticket) => {
        return axios.put(`${API}/Ticket/${id}`, ticket);
    };

    // Delete a ticket by ID
    deleteRequest = (id) => {
        return axios.delete(`${API}/Ticket/${id}`);
    };
}

export default new DataService();
