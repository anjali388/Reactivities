import { history } from './../..';
import { IActivity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000/api';
const milliseconds = 1000;

axios.interceptors.response.use(undefined, error => {
    if(error.message === 'Network Error' && !error.response)
        toast.error('Network error - make sure API is running!');

    const {status, data, config} = error.response;
    if(status === 404)
        history.push('/notfound');

    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))
        history.push('/notfound');

    if(status === 500)
        toast.error('Server error - check the terminal for more info!');

    throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(milliseconds)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(milliseconds)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(milliseconds)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(milliseconds)).then(responseBody),
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`),
}

const agent = {
    Activities
}

export default agent;