import axios from 'axios'
import { UrlApi } from '../keys'

export const registrarError = (message, exceptionDetails, source, token) => async (dispatch) => {
    try {

        let error = {
            level: "Error",
            message: message ? message : "",
            exceptionDetails: exceptionDetails ? exceptionDetails : "",
            source:  source ? source : "",
        }

        return new Promise((resolve, reject) => {
            axios.post(`${UrlApi}api/errorlog`,
                error,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then((response) => {
                    resolve(response.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    catch (error) {
        console.log(`Error : ${error}`)
    }
}