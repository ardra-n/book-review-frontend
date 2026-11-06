import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
})

// Global Error Handling
instance.interceptors.response.use(
    (response) => {
        console.log('API RESPONSE RECEIVED...')
        return response
    },
    (error) => {
        if (error.response) {
            const status = error.response.status

            if (status === 404) {
                console.log('API is Not Found...')
            } else if (status === 500) {
                console.log('Something went wrong...')
            }
        } else if (error.request) {
            console.log('No response from the server')
        } else {
            console.log('Error:', error.message)
        }

        return Promise.reject(error)
    }
)

export default instance