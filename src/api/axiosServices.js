import instance from './axiosInstance'

const axiosService = async (httpMethod, url, reqBody) => {
    try {
        const response = await instance({
            method: httpMethod,
            url: url,
            data: reqBody
        })

        return response

    } catch (err) {
        throw err
    }
}

export default axiosService