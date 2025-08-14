import axios from 'axios'
import { UrlApi, authMail, authPass } from '../keys'

const dataInicial = {
    loading: false,
    token: '',
    resultado: '',
    refreshToken: '',
    resultadoRefresh: ''
}

const LOADING = 'LOADING'
const TOKEN_EXITO = 'TOKEN_EXITO'
const TOKEN_ERROR = 'TOKEN_ERROR'

const LOADING_REFRESH = 'LOADING_REFRESH'
const REFRESH_EXITO = 'REFRESH_EXITO'
const REFRESH_ERROR = 'REFRESH_ERROR'


//Reducers
export default function tokenReducer(state = dataInicial, action) {
    switch (action.type) {
        case TOKEN_EXITO:
            return { ...state, token: action.payload }
        case TOKEN_ERROR:
            return { ...dataInicial, resultado: action.resultado }
        case LOADING:
            return { ...state, resultado: action.resultado }
        case REFRESH_EXITO:
            return { ...state, refreshToken: action.payload }
        case REFRESH_ERROR:
            return { ...dataInicial, resultadoRefresh: action.resultadoRefresh }
        case LOADING_REFRESH:
            return { ...state, resultadoRefresh: action.resultadoRefresh }
        default:
            return { ...state }
    }
}

export const loginToken = () => async (dispatch) => {
    dispatch({
        type: LOADING,
        resultado: 'LOADING',
    })
    try {
        const response = await axios.post(`${UrlApi}api/Usuarios/login`, {
            "email": authMail,
            "password": authPass
        })
        dispatch({
            type: TOKEN_EXITO,
            payload: response.data,
            resultado: 'EXITO!'
        })
    }
    catch (error) {
        console.log("error del token: ", error)
        dispatch({
            type: TOKEN_ERROR,
            resultado: 'ERROR'
        })
    }
}

export const refreshToken = (token, expiracion) => async (dispatch) => {
    dispatch({
        type: LOADING_REFRESH,
        resultadoRefresh: 'LOADING',
    })
    try {

        const response = await axios.get(`${UrlApi}api/Usuarios/RenovarToken`,{
            headers: {
              "Authorization": `Bearer ${token}`
            },
            params: {
              token: token,
              expiracion: expiracion
            }
          });
        dispatch({
            type: REFRESH_EXITO,
            payload: response.data,
            resultadoRefresh: 'EXITO!'
        })
    }
    catch (error) {
        console.log(error)
        dispatch({
            type: REFRESH_ERROR,
            resultadoRefresh: 'ERROR'
        })
    }
}