import axios from 'axios';

export default axios.create({
    // baseURL: 'https://gravity-guy.herokuapp.com'
    baseURL: 'http://localhost:5000'
})