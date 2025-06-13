import axios from 'axios';
import {VITE_API_KEY, VITE_API_TOKEN} from '../config/config.js';
const URL = 'https://api.themoviedb.org/3'
export const connection = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VITE_API_TOKEN}`,
    },
    params: {
        'api_key': VITE_API_KEY,
        'include_adult': true,
        'language': 'en-US',
    },
});

