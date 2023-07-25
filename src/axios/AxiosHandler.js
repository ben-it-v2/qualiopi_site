import axios from "axios";

const AxiosHandler = () => {
    const API_IP = "http://localhost:3001/api/";

    const createURL = (url) => {
        return (`${API_IP}${url}`);
    }

    const post = (url, args, config) => {
        return (axios.post(createURL(url), args, config));
    }

    const patch = (url, args, config) => {
        return (axios.patch(createURL(url), args, config));
    }

    const get = (url, args, config) => {
        return (axios.get(createURL(url), args, config));
    }

    return ({post, patch, get});
}

export default AxiosHandler;
