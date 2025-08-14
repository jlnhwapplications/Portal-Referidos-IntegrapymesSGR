import axios from 'axios'
import { Entidad, UrlApiDynamics, UnidadDeNegocio, UrlApi } from '@/keys'
//Const
const dataInicial = {
    loading: false,
    retrieveUnidad: false,
    unidadesDeNegocio: [],
    unidadDeNegocio: [],
    mostrarLineasPortal: [],
    mostrarLineas: false
}

//Types
const MOSTRAR_LINEAS = 'MOSTRAR_LINEAS'
const UNIDADESNEGOCIO_EXITO = 'UNIDADESNEGOCIO_EXITO'
const LOADING_UNIDADDENEGOCIO = "LOADING_UNIDADDENEGOCIO"
const UN_EXITO = 'UN_EXITO'
const LOADING_UN = "LOADING_UN"
const ERROR_UN = 'ERROR_UN'
const ERROR = 'ERROR'
const ERROR_UNIDAD_LIMITES = 'ERROR_UNIDAD_LIMITES'

//Reducers
export default function unidadesNegocioReducers(state = dataInicial, action) {
    switch (action.type) {
        case MOSTRAR_LINEAS:
            return { ...state, mostrarLineasPortal: action.payload, mostrarLineas: action.mostrarLineas, retrieveUnidad: true }
        case LOADING_UNIDADDENEGOCIO:
            return { ...state, retrieveUnidad: false }
        case UNIDADESNEGOCIO_EXITO:
            return { ...state, unidadesDeNegocio: action.payload }
        case LOADING_UN:
            return { ...state, loading: true }
        case UN_EXITO:
            return { ...state, unidadDeNegocio: action.payload, loading: false }
        case ERROR_UN:
            return { ...state, loading: false }
        case ERROR_UNIDAD_LIMITES:
            return { ...state, retrieveUnidad: true }
        default:
            return { ...dataInicial }
    }
}

//Actions
export const obtenerUnidadDeNegocio = () => async (dispatch) => {
    dispatch({
        type: LOADING_UNIDADDENEGOCIO
    })

    try {
        const response = await axios.get(`${UrlApiDynamics}UnidadDeNegocio?filter=businessunitid eq ${UnidadDeNegocio}&cuit=${Entidad}`)
        dispatch({
            type: UNIDADESNEGOCIO_EXITO,
            payload: response.data
        })
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerUN = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_UN
    })

    try {
        var entidad = "businessunits";
        var fetch = "<fetch  mapping='logical' distinct='false'>" +
            "<entity name='businessunit'>" +
            "<attribute name='parentbusinessunitid' />" +
            "<attribute name='businessunitid' />" +
            "<attribute name='new_textoconfirmacionsolicitudaltasgr' />" +
            "<order attribute='name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='parentbusinessunitid' operator='null' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        const response = await axios.post(`${UrlApi}api/consultafetch`,
            {
                "entidad": entidad,
                "fetch": fetch
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        dispatch({
            type: UN_EXITO,
            payload: response.data,
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_UN
        })
    }
}


export const obtenerLineasXUN = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_UNIDADDENEGOCIO
    })

    try {
        var entidad = "businessunits";
        var fetch = "<fetch  mapping='logical' distinct='false'>" +
            "<entity name='businessunit'>" +
            "<attribute name='name' />" +
            "<attribute name='address1_telephone1' />" +
            "<attribute name='websiteurl' />" +
            "<attribute name='parentbusinessunitid' />" +
            "<attribute name='businessunitid' />" +
            "<attribute name='new_mostrarlineascomercialesenportalsocio' />" +
            "<order attribute='name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='parentbusinessunitid' operator='null' />" +
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
                        resolve(response.data.length > 0 ? response.data[0].new_mostrarlineascomercialesenportalsocio : false)
                    })
                    .catch(err => {
                        // ToastError("Error al buscar Mi Cuenta")
                        reject(err)
                    })
            })

        // const response = await axios.post(`${UrlApi}api/consultafetch`,
        //     {
        //         "entidad": entidad,
        //         "fetch": fetch
        //     },
        //     {
        //         headers: {
        //             "Authorization": `Bearer ${token}`
        //         }
        //     }
        // )
        // dispatch({
        //     type: MOSTRAR_LINEAS,
        //     payload: response.data,
        //     mostrarLineas: response.data.length > 0 ? response.data[0].new_mostrarlineascomercialesenportalsocio : false
        // })
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

