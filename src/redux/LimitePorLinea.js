import axios from 'axios'
import { Entidad, UrlApiDynamics, UrlApi } from '../keys'
import { resolve } from 'styled-jsx/css'

const dataInicial = {
    loadingGral: false,
    loadingLinea: false,
    loadingLimite: false,
    loadingLimitePrestamos: false,
    retrieveLimites: false,
    limites: [],
    limitesGeneral: [],
    limite: {},
    limitePrestamo: []
}

const LIMITE_GENERAL_EXITO = 'LIMITE_GENERAL_EXITO'
const LIMITE_TODOS_EXITO = 'LIMITE_TODOS_EXITO'
const LIMITE_EXITO = 'LIMITE_EXITO'
const ERROR = 'ERROR'
const ERROR_LIMITE = 'ERROR_LIMITE'
const LOADING_LIMITE_GRAL = 'LOADING_LIMITE_GRAL'
const LOADING_LIMITE_LINEA = 'LOADING_LIMITE_LINEA'
const LOADING_LIMITE = 'LOADING_LIMITE'
const LOADING_LIMITE_PRESTAMO = 'LOADING_LIMITE_PRESTAMO'
const ERROR_PRESTAMO = 'ERROR_PRESTAMO'
const LIMITE_PRESTAMO_EXITO = 'LIMITE_PRESTAMO_EXITO'

export default function limitesReducers(state = dataInicial, action) {
    switch (action.type) {
        case LIMITE_GENERAL_EXITO:
            return { ...state, limitesGeneral: action.payload, loadingGral: action.loadingGral }
        case LIMITE_PRESTAMO_EXITO:
            return { ...state, limitePrestamo: action.payload, loadingLimitePrestamos: action.loadingLimitePrestamos }
        case LIMITE_TODOS_EXITO:
            return { ...state, limites: action.payload, loadingLinea: action.loadingLinea, retrieveLimites: true }
        case LIMITE_EXITO:
            return { ...state, limite: action.payload, loadingLimite: action.loadingLimite }
        case LOADING_LIMITE:
            return { ...state, loadingLimite: action.loadingLimite }
        case LOADING_LIMITE_GRAL:
            return { ...state, loadingGral: action.loadingGral }
        case LOADING_LIMITE_LINEA:
            return { ...state, loadingLinea: action.loadingLinea, retrieveLimites: false }
        case LOADING_LIMITE_PRESTAMO:
            return { ...state, loadingLimitePrestamos: action.loadingLimitePrestamos }
        case ERROR_PRESTAMO:
            return { ...state, loadingLimitePrestamos: action.loadingLimitePrestamos }
        case ERROR_LIMITE:
            return { ...state, retrieveLimites: true, loadingLinea: false }
        case ERROR:
            return { ...dataInicial }
        default:
            return { ...state }
    }
}

export const obtenerTodosLimitesPorLineas = (cuentaid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_LIMITE_LINEA,
        loadingLinea: true
    })
    try {
        if (cuentaid != undefined) {
            var entidad = "new_productoses"
            var fetch = "<fetch mapping='logical' distinct='false'>" +
                "<entity name='new_productos'>" +
                "<attribute name='new_topeporlineacomercial' />" +
                "<attribute name='new_name' />" +
                "<attribute name='new_montodisponibleporoperacion' />" +
                "<attribute name='statuscode' />" +
                "<attribute name='transactioncurrencyid' />" +
                "<attribute name='new_topeporlineacomercialusd' />" +
                "<attribute name='new_montoutilizadoporoperacion' />" +
                "<attribute name='new_tipochpd' />" +
                "<attribute name='new_lineatipodeoperacion' />" +
                "<attribute name='new_productosid' />" +
                "<attribute name='new_montoutilizadogeneral' />" +
                "<attribute name='new_montodisponiblegeneral' />" +
                "<attribute name='new_mostrarenportalsocio' />" +
                "<attribute name='new_vigenciahasta' />" +
                "<attribute name='statecode' />" +
                "<order attribute='createdon' descending='false' />" +
                "<filter type='and'>" +
                // "<condition attribute='statecode' operator='eq' value='0' />" +
                // "<condition attribute='statuscode' operator='eq' value='100000001' />" +
                //"<condition attribute='new_lineatipodeoperacion' operator='eq' value='100000000' />" +
                "<condition attribute='new_cuenta' operator='eq' value='" + cuentaid + "' />" +
                "<condition attribute='new_mostrarenportalsocio' operator='eq' value='1' />" +
                "</filter>" +
                "</entity>" +
                "</fetch>";

            return new Promise((resolve, reject) => {
                axios.post(`${UrlApi}api/consultafetch`,
                    {
                        "entidad": entidad,
                        "fetch": fetch
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        dispatch({
                            type: LIMITE_TODOS_EXITO,
                            payload: response.data,
                            loadingLinea: false
                        })
                        resolve(response.data)
                    })
                    .catch(err => {
                        reject(err)
                        // dispatch({
                        //     type: ERROR_LIMITE
                        // })
                    })
            })
        }
    }
    catch (error) {
        dispatch({
            type: ERROR_LIMITE,
            loadingLinea: false
        })
    }
}

export const obtenerLimitePorLineaPrestamo = (cuentaid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_LIMITE_PRESTAMO,
        loadingLimitePrestamos: true
    })

    var entidad = "new_productoses"
    var fetch = "<fetch mapping='logical' distinct='false'>" +
        "<entity name='new_productos'>" +
        "<attribute name='new_topeporlineacomercial' />" +
        "<attribute name='new_name' />" +
        "<attribute name='new_montodisponibleporoperacion' />" +
        "<attribute name='new_topeporlineacomercialusd' />" +
        "<attribute name='new_montoutilizadoporoperacion' />" +
        "<attribute name='new_lineatipodeoperacion' />" +
        "<attribute name='new_montoutilizadogeneral' />" +
        "<attribute name='new_montodisponiblegeneral' />" +
        "<order attribute='transactioncurrencyid' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='statecode' operator='eq' value='0' />" +
        "<condition attribute='statuscode' operator='eq' value='100000001' />" +
        "<condition attribute='new_lineatipodeoperacion' operator='eq' value='11' />" +
        "<condition attribute='new_cuenta' operator='eq' value='" + cuentaid + "' />" +
        "</filter>" +
        "</entity>" +
        "</fetch>";

    try {
        await axios.post(`${UrlApi}api/consultafetch`,
            {
                "entidad": entidad,
                "fetch": fetch
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((response) => {
                dispatch({
                    type: LIMITE_PRESTAMO_EXITO,
                    payload: response.data,
                    loadingLimitePrestamos: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_PRESTAMO,
            loadingLimitePrestamos: false
        })
    }
}

export const obtenerTodosLimitesPorLineasGeneral = (accountid) => async (dispatch) => {
    dispatch({
        type: LOADING_LIMITE_GRAL,
        loadingGral: true
    })

    try {
        var entidad = "new_productoses";
        var fetch = "<fetch mapping='logical' distinct='false'>" +
            "<entity name='new_productos'>" +
            "<attribute name='new_topeporlineacomercial' />" +
            "<attribute name='new_montodisponibleporoperacion' />" +
            "<attribute name='statuscode' />" +
            "<attribute name='transactioncurrencyid' />" +
            "<attribute name='new_topeporlineacomercialusd' />" +
            "<attribute name='new_montoutilizadoporoperacion' />" +
            "<attribute name='new_tipochpd' />" +
            "<attribute name='new_lineatipodeoperacion' />" +
            "<attribute name='new_productosid' />" +
            "<attribute name='new_montoutilizadogeneral' />" +
            "<attribute name='new_montodisponiblegeneral' />" +
            "<attribute name='new_mostrarenportalsocio' />" +
            "<order attribute='transactioncurrencyid' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            "<condition attribute='new_lineatipodeoperacion' operator='eq' value='100000000' />" +
            "<condition attribute='new_cuenta' operator='eq' uitype='account' value='" + accountid + "' />" +
            // "<condition attribute='new_mostrarenportalsocio' operator='eq' value='1' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
        dispatch({
            type: LIMITE_GENERAL_EXITO,
            payload: response.data,
            loadingGral: false
        })
    } catch (error) {
        dispatch({
            type: ERROR,
            loadingGral: false
        })
    }
}

// export const obtenerTodosLimitesPorLineas = (accountid) => async (dispatch) => {
//     dispatch({
//         type: LOADING_LIMITE_LINEA,
//         loadingLinea: true
//     })

//     try {

//         var entidad = "new_productoses";
//         var fetch = "<fetch mapping='logical' distinct='false'>" +
//             "<entity name='new_productos'>" +
//             "<attribute name='new_topeporlineacomercial' />" +
//             "<attribute name='new_montodisponibleporoperacion' />" +
//             "<attribute name='statuscode' />" +
//             "<attribute name='transactioncurrencyid' />" +
//             "<attribute name='new_topeporlineacomercialusd' />" +
//             "<attribute name='new_montoutilizadoporoperacion' />" +
//             "<attribute name='new_tipochpd' />" +
//             "<attribute name='new_lineatipodeoperacion' />" +
//             "<attribute name='new_productosid' />" +
//             "<attribute name='new_mostrarenportalsocio' />" +
//             "<order attribute='transactioncurrencyid' descending='false' />" +
//             "<filter type='and'>" +
//             "<condition attribute='statecode' operator='eq' value='0' />" +
//             "<condition attribute='new_lineatipodeoperacion' operator='ne' value='100000000' />" +
//             "<condition attribute='new_cuenta' operator='eq' uitype='account' value='" + accountid + "' />" +
//             // "<condition attribute='new_mostrarenportalsocio' operator='eq' value='1' />" +
//             "</filter>" +
//             "</entity>" +
//             "</fetch>";

//         const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
//         dispatch({
//             type: LIMITE_TODOS_EXITO,
//             payload: response.data,
//             loadingLinea: false
//         })
//     } catch (error) {
//         dispatch({
//             type: ERROR,
//             loadingLinea: false
//         })
//     }
// }

export const obtenerLimitePorLinea = (accountid) => async (dispatch) => {
    dispatch({
        type: LOADING_LIMITE,
        loadingLimite: true
    })

    try {
        if (accountid != undefined) {
            const response = await axios.get(`${UrlApiDynamics}Limiteporlinea?filter=new_lineatipodeoperacion eq 100000000 and _new_cuenta_value eq ${accountid}&cuit=${Entidad}`)
            const limite = response.data
            dispatch({
                type: LIMITE_EXITO,
                payload: limite[0],
                loadingLimite: false
            })
        }
    } catch (error) {
        dispatch({
            type: ERROR,
            loadingLimite: false
        })
    }
}