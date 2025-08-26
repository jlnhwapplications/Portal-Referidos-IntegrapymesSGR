import axios from 'axios'
import { Entidad, UrlApiDynamics, UrlApi } from '../keys'
import toast from 'react-hot-toast';

const dataInicial = {
    loadingGarantias: false,
    loadingDocumentBody: false,
    retrieveGarantias: false,
    garantias: [],
    garantiasFetch: [],
    adjuntosGarantia: [],
    notaDescarga: [],
    cargaDocumento: '',
    documentoid: '',
}

const ERROR = 'ERROR'
const LOADING_GARANTIAS = 'LOADING_GARANTIAS'
const ERROR_GARANTIAS_FETCH = 'ERROR_GARANTIAS_FETCH'
const LOADING_ADJUNTOS = 'LOADING_ADJUNTOS'
const ERROR_GARANTIAS = 'ERROR_GARANTIAS'
const TODAS_GARANTIAS_EXITO = 'TODAS_GARANTIAS_EXITO'
const TODAS_GARANTIASFETCH_EXITO = 'TODAS_GARANTIASFETCH_EXITO'
const TODOS_ADJUNTOSGARANTIA_EXITO = 'TODOS_ADJUNTOSGARANTIA_EXITO'
const LOADING_CARGAADJUNTOGARANTIA = 'LOADING_CARGAADJUNTOGARANTIA'
const CARGA_ADJUNTOGARANTIA = 'CARGA_ADJUNTOGARANTIA'
const LOADING_NOTADESCARGA = 'LOADING_NOTADESCARGA'
const NOTADESCARGA_EXITO = 'NOTADESCARGA_EXITO'
const NOTADESCARGA_ERROR = 'NOTADESCARGA_ERROR'
const LIMPIAR_DOCUMENTBODY = 'LIMPIAR_DOCUMENTBODY'
const LIMPIAR_GARANTIAS = 'LIMPIAR_GARANTIAS'
const LOADING_IMPORTACIONES = 'LOADING_IMPORTACIONES'
const TODAS__IMPORTACIONES_EXITO = 'TODAS__IMPORTACIONES_EXITO'
const TODAS__IMPORTACIONES_ERROR = 'TODAS__IMPORTACIONES_ERROR'
const LOADING_CARGACHEQUES = 'LOADING_CARGACHEQUES'
const CHEQUES_EXITO = 'CHEQUES_EXITO'
const CHEQUES_ERROR = 'CHEQUES_ERROR'

const ToastError = (msj) => {
    toast.error(msj, {
        theme: "dark",
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export default function garantiasReducers(state = dataInicial, action) {
    switch (action.type) {
        case TODAS_GARANTIAS_EXITO:
            return { ...state, garantias: action.payload, loadingGarantias: action.loadingGarantias }
        case TODAS_GARANTIASFETCH_EXITO:
            return { ...state, garantiasFetch: action.payload, loadingGarantias: action.loadingGarantias, retrieveGarantias: true }
        case LOADING_GARANTIAS:
            return { ...state, loadingGarantias: action.loadingGarantias, retrieveGarantias: false }
        case ERROR_GARANTIAS:
            return { ...state, loadingGarantias: action.loadingGarantias }
        case TODOS_ADJUNTOSGARANTIA_EXITO:
            return { ...state, adjuntosGarantia: action.payload }
        case LOADING_CARGAADJUNTOGARANTIA:
            return { ...state, cargaDocumento: action.cargaDocumento }
        case CARGA_ADJUNTOGARANTIA:
            return { ...state, cargaDocumento: action.cargaDocumento, documentoid: action.documentoid }
        case LOADING_NOTADESCARGA:
            return { ...state, loadingDocumentBody: true }
        case NOTADESCARGA_EXITO:
            return { ...state, notaDescarga: action.payload, loadingDocumentBody: false }
        case NOTADESCARGA_ERROR:
            return { ...state, notaDescarga: [], loadingDocumentBody: false }
        case LIMPIAR_DOCUMENTBODY:
            return { ...state, notaDescarga: [], loadingDocumentBody: false }
        case ERROR_GARANTIAS_FETCH:
            return { ...state, retrieveGarantias: true, loadingGarantias: false }
        case LIMPIAR_GARANTIAS:
            return { ...state, garantiasFetch: [], adjuntosGarantia: [], loadingGarantias: false, retrieveGarantias: false }
        default:
            return { ...state }
    }
}

export const obtenerTodasGarantias = (accountid) => async (dispatch) => {
    dispatch({
        type: LOADING_GARANTIAS,
        loadingGarantias: true,
    })

    try {
        if (accountid != undefined) {
            const response = await axios(`${UrlApiDynamics}Garantia?filter=_new_socioparticipe_value eq ${accountid}&cuit=${Entidad}`)
            dispatch({
                type: TODAS_GARANTIAS_EXITO,
                payload: response.data,
                loadingGarantias: false
            })
        }
    }
    catch (error) {
        dispatch({
            type: ERROR_GARANTIAS,
            loadingGarantias: false
        })
    }
}

export const obtenerGarantiasFetch = (cuentaid, token) => async (dispatch) => {
    dispatch({
        type: LIMPIAR_GARANTIAS,
        loadingGarantias: true,
    })

    try {
        if (cuentaid != undefined) {
            var entidad = "new_garantias"
            var fetch = "<fetch mapping='logical'>" +
                "<entity name='new_garantia'>" +
                "<attribute name='new_monto'/> " +
                "<attribute name='new_name'/> " +
                "<attribute name='new_fechadenegociacion'/>" +
                "<attribute name='statuscode'/> " +
                "<attribute name='new_garantiaid'/> " +
                "<attribute name='createdon'/> " +
                "<attribute name='new_ndeordendelagarantiaotorgada'/> " +
                "<attribute name='new_fechadevencimiento'/> " +
                "<attribute name='new_tipodeoperacion'/> " +
                "<attribute name='new_acreedor'/> " +
                "<attribute name='new_tipodegarantias'/>" +
                "<attribute name='transactioncurrencyid'/> " +
                "<attribute name='new_referido'/> " +
                "<attribute name='new_sociosprotector'/> " +
                "<attribute name='new_fechadecancelada'/> " +
                "<attribute name='new_fechadeanulada'/> " +
                "<attribute name='new_formatodelcheque'/> " +
                "<attribute name='new_numerodecheque'/> " +
                "<attribute name='new_tipochpd'/> " +
                "<attribute name='new_libradorcheque'/> " +
                "<attribute name='new_tasa'/> " +
                "<attribute name='new_plazodias'/> " +
                "<attribute name='new_periodogracia'/> " +
                "<attribute name='new_sistemadeamortizacion'/> " +
                "<attribute name='new_periodicidadpagos'/> " +
                "<attribute name='new_observaciones'/> " +
                "<attribute name='new_fechadeorigen'/> " +
                "<order attribute ='createdon' descending='true' />" +
                "<filter type='and'>" +
                "<condition attribute='new_socioparticipe' operator='eq' value='" + cuentaid + "' />" +
                // "<condition attribute='statecode' operator='eq' value='' />" +
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
                        // dispatch({
                        //     type: TODAS_GARANTIASFETCH_EXITO,
                        //     payload: response.data,
                        //     loadingGarantias: false
                        // })
                        resolve(response.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    }
    catch (error) {
        dispatch({
            type: ERROR_GARANTIAS_FETCH,
            loadingGarantias: false,
        })
    }
}

export const LimpiarGarantiasFetchSelector = () => async (dispatch) => {
    dispatch({
        type: LIMPIAR_GARANTIAS
    })
}

export const obtenerAdjuntosGarantias = (cuentaid, token) => async (dispatch) => {
    // dispatch({
    //     type: LOADING_GARANTIAS,
    //     loadingGarantias: true
    // })
    try {
        var entidad = "new_adjuntoses"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='new_adjuntos'>" +
            "<attribute name='new_adjuntosid'/> " +
            "<attribute name='new_name'/> " +
            "<attribute name='new_tipo'/>" +
            "<attribute name='createdon'/> " +
            "<attribute name='new_garantia'/> " +
            "<attribute name='statuscode'/> " +
            "<order attribute ='createdon' descending='false' />" +
            "<link-entity name='new_garantia' from='new_garantiaid' to='new_garantia' link-type='inner' alias='garantia'>" +
            "<filter type='and'>" +
            "<condition attribute='new_socioparticipe' operator='eq' value='" + cuentaid + "' />" +
            "</filter>" +
            "</link-entity>" +
            "<link-entity name='annotation' from='objectid' to='new_adjuntosid' link-type='outer' alias='nota'>" +
            "<attribute name='annotationid'/> " +
            "<attribute name='filename'/> " +
            "<attribute name='mimetype'/> " +
            "</link-entity>" +
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
                        type: TODOS_ADJUNTOSGARANTIA_EXITO,
                        payload: response.data,
                    })
                    resolve(response.data)
                })
                .catch(err => {
                    reject(err)
                    // console.log(err)
                })
        })
    }
    catch (error) {
        dispatch({
            type: ERROR,
            loadingGarantias: false
        })
    }
}

// export const obtenerNotaADescargar = (notaid, token) => async (dispatch) => {
//     dispatch({
//         type: LOADING_NOTADESCARGA,
//     })

//     var entidad = "annotations"
//     var fetch = "<fetch mapping='logical'>" +
//         "<entity name='annotation'>" +
//         "<attribute name='annotationid'/> " +
//         "<attribute name='documentbody'/> " +
//         "<filter type='and'>" +
//         "<condition attribute='annotationid' operator='eq' value='" + notaid + "' />" +
//         "</filter>" +
//         "</entity>" +
//         "</fetch>";
//     try {
//         await axios.post(`${UrlApi}api/consultafetch`,
//             {
//                 "entidad": entidad,
//                 "fetch": fetch
//             },
//             {
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 }
//             })
//             .then((response) => {
//                 dispatch({
//                     type: NOTADESCARGA_EXITO,
//                     payload: response.data,
//                 })
//             })
//             .catch(err => {
//                 dispatch({
//                     type: NOTADESCARGA_ERROR
//                 })
//             })
//     }
//     catch (error) {
//         dispatch({
//             type: NOTADESCARGA_ERROR
//         })
//     }
// }

export const obtenerNotaADescargar = (notaid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_NOTADESCARGA,
    })

    var entidad = "annotations"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='annotation'>" +
        "<attribute name='annotationid'/> " +
        "<attribute name='filename'/> " +
        "<attribute name='mimetype'/> " +
        "<attribute name='documentbody'/> " +
        "<filter type='and'>" +
        "<condition attribute='annotationid' operator='eq' value='" + notaid + "' />" +
        "</filter>" +
        "</entity>" +
        "</fetch>";
    try {
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
                    resolve(response.data)
                })
                .catch(err => {
                    ToastError("Error al descargar archivo")
                    reject(err)
                })
        })
    }
    catch (error) {
        ToastError("Error al descargar archivo")
        dispatch({
            type: NOTADESCARGA_ERROR
        })
    }
}

export const limpiarDocumentBody = () => async (dispatch) => {
    dispatch({
        type: LIMPIAR_DOCUMENTBODY,
    })
}

export const cargarAdjuntoGarantia = (file, garantiaid, token, toastCustom) => async (dispatch) => {
    dispatch({
        type: LOADING_CARGAADJUNTOGARANTIA,
        cargaDocumento: 'LOADING',
        documentoid: ''
    })

    try {
        const configDocumentos = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'multipart/form-data',
            },
        };
        await toastCustom.promise(axios.post(`${UrlApi}api/socioparticipe/adjuntosgarantia?garantia_id=${garantiaid}`,
            file, configDocumentos), {
            loading: "Cargando...",
            success: (data) => {
                debugger
                dispatch({
                    type: CARGA_ADJUNTOGARANTIA,
                    cargaDocumento: 'EXITO',
                    documentoid: data.data
                })
                return 'Proceso exitoso.';
            },
            error: (error) => {
                debugger
                dispatch({
                    type: CARGA_ADJUNTOGARANTIA,
                    cargaDocumento: 'ERROR',
                    documentoid: ''
                })
                return `Error al cargar documento. ${error}`;
            }
        });
    } catch (err) {
        dispatch({
            type: CARGA_ADJUNTOGARANTIA,
            cargaDocumento: 'ERROR',
            documentoid: ''
        })
        crearExcepcion(`Excepcion al subir documento` + err, token)
    }
}

const crearExcepcion = (error, token) => {
    axios.post(`https://hw365api.azurewebsites.net/api/excepcion`,
        {
            "descripcion": error
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
}

export const cargarECheck = (file, cuenta_id, token, toastCustom) => async (dispatch) => {
    dispatch({
        type: LOADING_CARGACHEQUES,
        cargaCheques: 'LOADING'
    })

    try {
        const configDocumentos = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'multipart/form-data',
            },
        };
        const response = await toastCustom.promise(
            axios.post(`${UrlApi}api/socioparticipe/importadorcheques?account_id=${cuenta_id}`,
                file, configDocumentos),
            {
                loading: "Cargando...",
                success: "Proceso exitoso.",
                error: "Error al cargar el eChek.",
            }
        );
        // return new Promise((resolve, reject) => {
        //     axios.post(`${UrlApi}api/socioparticipe/importadorcheques?account_id=${cuenta_id}`,
        //         file, configDocumentos)
        //         .then((response) => {
        //             resolve(response.data)
        //         })
        //         .catch(err => {
        //             // ToastError("Error al descargar archivo")
        //             reject(err)
        //         })
        // })

    } catch (err) {
        dispatch({
            type: CHEQUES_ERROR,
            cargaCheques: 'ERROR',
            documentoid: ''
        })
        crearExcepcion(`Error en la carga, comuníquese con su oficial.` + err, token)
    }
}

export const obtenerDetalle = (cuenta_id, token) => async (dispatch) => {
    dispatch({
        type: LOADING_IMPORTACIONES,
    })

    var entidad = "new_importacioneses"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_importaciones'>" +
        "<attribute name='new_importacionesid'/> " +
        "<attribute name='new_name'/> " +
        "<attribute name='createdon'/> " +
        "<attribute name='new_detalledeejecucion'/> " +
        "<order attribute ='createdon' descending='true' />" +
        "<filter type='and'>" +
        "<condition attribute='new_cuenta' operator='eq' value='" + cuenta_id + "' />" +
        "</filter>" +
        "<link-entity name='annotation' from='objectid' to='new_importacionesid' link-type='outer' alias='nota'>" +
        "<attribute name='annotationid'/> " +
        "<attribute name='filename'/> " +
        "<attribute name='mimetype'/> " +
        "</link-entity>" +
        "</entity>" +
        "</fetch>";
    try {
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
                    resolve(response.data)
                })
                .catch(err => {
                    ToastError("Error al consultar fetch")
                    reject(err)
                })
        })
    }
    catch (error) {
        ToastError("Error al consultar fetch")
        dispatch({
            type: TODAS__IMPORTACIONES_ERROR
        })
    }
}