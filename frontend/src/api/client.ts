import axios, { AxiosInstance } from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api'

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message ||
            'Request failed'
        return Promise.reject(new Error(message))
    }
)

export default apiClient
