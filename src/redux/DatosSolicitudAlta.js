import axios from 'axios'
import { Entidad, UrlApi, UrlApiDynamics, cliente } from '../keys'
import toast from 'react-hot-toast';
import { KeyboardReturnSharp } from '@mui/icons-material';

const dataInicial = {
    loading: false,
    loadingCondiciones: false,
    loadingActividades: false,
    loadingTiposDocumentos: false,
    loadingReferidor: false,
    loadingOnboarding: true,
    retrieveTipoDocumento: false,
    retrieveActividadAFIP: false,
    retrieveCondicionAFIP: false,
    retrieveReferidor: false,
    estadoOnboarding: '',
    porcentajeOnboarding: 0,
    robot: false,
    referidores: [],
    tiposDocumentos: [],
    actividades: [],
    condiciones: [],
    documentos: [],
    carpetas: [],
    condicionesAFIP: [],
    documentosNoCargados: [],
    razonSocial: ''
}

const LOADING = 'LOADING'
const LOADING_CONDICIONES_AFIP = 'LOADING_CONDICIONES_AFIP'
const LOADING_CONDICIONES = 'LOADING_CONDICIONES'
const LOADING_TIPODOCUMENTO = 'LOADING_TIPODOCUMENTO'
const LOADING_ACTIVIDADES = 'LOADING_ACTIVIDADES'
const LOADING_REFERIDORES = 'LOADING_REFERIDORES'
const ERROR = 'ERROR'
const ERROR_CONDICIONES_AFIP = "ERROR_CONDICIONES_AFIP"
const ERROR_TIPODOCUMENTO = 'ERROR_TIPODOCUMENTO'
const ERROR_CONDICIONES = 'ERROR_CONDICIONES'
const ERROR_ACTIVIDADES = 'ERROR_ACTIVIDADES'
const ERROR_REFERIDORES = 'REFERIDORES'
const TODOS_TIPDOCUMENTO_EXITO = 'TODOS_TIPDOCUMENTO_EXITO'
const TODAS_ACTIVIDADES_EXITO = 'TODAS_ACTIVIDADES_EXITO'
const TODAS_CONDICIONES_EXITO = 'TODAS_CONDICIONES_EXITO'
const TODOS_DOCUMENTO_EXITO = 'TODOS_DOCUMENTO_EXITO'
const TODOS_CONDICIONES_EXITO = 'TODOS_CONDICIONES_EXITO'
const TODOS_REFERIDORES_EXITO = 'TODOS_REFERIDORES_EXITO'
const CARPETAS_EXITO = 'CARPETAS_EXITO'
const ONBOARDING_EXITO = 'ONBOARDING_EXITO'
const ONBOARDING_ERROR = 'ONBOARDING_ERROR'
const LOADING_ONBOARDING = 'LOADING_ONBOARDING'
const PORCENTAJE_ONBOARDING = 'PORCENTAJE_ONBOARDING'
const ROBOT = 'ROBOT'

export default function datosReducers(state = dataInicial, action) {
    switch (action.type) {
        case TODOS_TIPDOCUMENTO_EXITO:
            return { ...state, tiposDocumentos: action.payload, loading: action.loading, retrieveTipoDocumento: action.retrieveTipoDocumento }
        case TODAS_ACTIVIDADES_EXITO:
            return { ...state, actividades: action.payload, loading: action.loading, retrieveActividadAFIP: action.retrieveActividadAFIP }
        case TODAS_CONDICIONES_EXITO:
            return { ...state, condiciones: action.payload, loading: action.loading, retrieveCondicionAFIP: action.retrieveCondicionAFIP }
        case TODOS_DOCUMENTO_EXITO:
            return { ...state, documentos: action.payload, loading: action.loading }
        case TODOS_CONDICIONES_EXITO:
            return { ...state, condicionesAFIP: action.payload, loadingCondiciones: action.loadingCondiciones }
        case CARPETAS_EXITO:
            return { ...state, carpetas: action.payload }
        case ONBOARDING_EXITO:
            return { ...state, estadoOnboarding: action.estadoOnboarding, loadingOnboarding: action.loadingOnboarding, porcentajeOnboarding: action.porcentajeOnboarding, documentosNoCargados: action.documentosNoCargados, razonSocial: action.razonSocial }
        case ONBOARDING_ERROR:
            return { ...state, estadoOnboarding: action.estadoOnboarding, loadingOnboarding: action.loadingOnboarding, porcentajeOnboarding: action.porcentajeOnboarding, documentosNoCargados: [], razonSocial: "" }
        case LOADING_ONBOARDING:
            return { ...state, loadingOnboarding: action.loadingOnboarding, estadoOnboarding: action.estadoOnboarding, porcentajeOnboarding: action.porcentajeOnboarding, documentosNoCargados: [], razonSocial: "" }
        case PORCENTAJE_ONBOARDING:
            return { ...state, porcentajeOnboarding: action.porcentajeOnboarding }
        case ROBOT:
            return { ...state, robot: action.robot }
        case ERROR_CONDICIONES:
            return { ...state, loadingCondiciones: action.loadingCondiciones }
        case LOADING_TIPODOCUMENTO:
            return { ...state, loadingTiposDocumentos: action.loadingTiposDocumentos, retrieveTipoDocumento: action.retrieveTipoDocumento }
        case ERROR_TIPODOCUMENTO:
            return { ...state, loadingTiposDocumentos: action.loadingTiposDocumentos, retrieveTipoDocumento: action.retrieveTipoDocumento }
        case LOADING_ACTIVIDADES:
            return { ...state, loadingActividades: action.loadingActividades, retrieveActividadAFIP: action.retrieveActividadAFIP }
        case ERROR_ACTIVIDADES:
            return { ...state, loadingActividades: action.loadingActividades, retrieveActividadAFIP: action.retrieveActividadAFIP }
        case LOADING_REFERIDORES:
            return { ...state, loadingReferidor: action.loadingReferidor, retrieveReferidor: action.retrieveReferidor }
        case TODOS_REFERIDORES_EXITO:
            return { ...state, referidores: action.payload, loadingReferidor: action.loadingReferidor, retrieveReferidor: action.retrieveReferidor }
        case ERROR_REFERIDORES:
            return { ...state, loadingReferidor: action.loadingReferidor, retrieveReferidor: action.retrieveReferidor }
        case ERROR_CONDICIONES_AFIP:
            return { ...state, retrieveCondicionAFIP: action.retrieveCondicionAFIP }
        case LOADING_CONDICIONES_AFIP:
            return { ...state, retrieveCondicionAFIP: action.retrieveCondicionAFIP }
        default:
            return { ...state }
    }
}

export const obtenerTipoDeDocumentos = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_TIPODOCUMENTO,
        loadingTiposDocumentos: true,
        retrieveTipoDocumento: false
    })

    try {
        var entidad = 'new_tipodedocumentos'
        var fetch = "<entity name='new_tipodedocumento'>" +
            "<attribute name='new_name' />" +
            "<attribute name='new_codigo' />" +
            "<attribute name='new_tipodedocumentoid' />" +
            "<attribute name='new_onboarding' />" +
            "<order attribute='new_name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            "<condition attribute='new_onboarding' operator='eq' value='1' />" +
            "</filter>" +
            "</entity>";

        return new Promise((resolve, reject) => {
            axios.post(`${UrlApi}api/consultafetchs`,
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
                        type: TODOS_TIPDOCUMENTO_EXITO,
                        payload: response.data,
                        loadingTiposDocumentos: false,
                        retrieveTipoDocumento: true
                    })
                    resolve(response.data)
                })
                .catch(err => {
                    dispatch({
                        type: ERROR_TIPODOCUMENTO,
                        loadingTiposDocumentos: false,
                        retrieveTipoDocumento: true
                    })
                    reject(err)
                })
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_TIPODOCUMENTO,
            loadingTiposDocumentos: false,
            retrieveTipoDocumento: true
        })
    }
}

export const obtenerCondicionImpositiva = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_CONDICIONES_AFIP,
        loading: true,
        retrieveCondicionAFIP: false
    })

    try {

        var entidad = 'new_condiciondeinscipcionanteafips'
        var fetch = "<fetch mapping='logical' distinct='false'>" +
            "<entity name='new_condiciondeinscipcionanteafip'>" +
            "<attribute name='new_name' />" +
            "<attribute name='new_condiciondeinscipcionanteafipid' />" +
            "<filter type='and'>" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        // const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
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
            type: TODAS_CONDICIONES_EXITO,
            payload: response.data,
            loading: false,
            retrieveCondicionAFIP: true
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_CONDICIONES_AFIP,
            loading: false,
            retrieveCondicionAFIP: true
        })
    }
}

export const obtenerActividadesAFIP = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_ACTIVIDADES,
        loadingActividades: true,
        retrieveActividadAFIP: false
    })

    try {
        var entidad = "new_actividadafips"
        var fetch = "<fetch mapping='logical' distinct='false'>" +
            "<entity name='new_actividadafip'>" +
            "<attribute name='new_name' />" +
            "<attribute name='new_codigo' />" +
            "<attribute name='new_actividadafipid' />" +
            "<order attribute='new_name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
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
            type: TODAS_ACTIVIDADES_EXITO,
            payload: response.data,
            loadingActividades: false,
            retrieveActividadAFIP: true
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_ACTIVIDADES,
            loadingActividades: false,
            retrieveActividadAFIP: true
        })
    }
}

export const obtenerDocumentosOnboardingFETCH = (token) => async (dispatch) => {
    dispatch({
        type: LOADING,
        loading: true
    })
    var entidad = "new_documentacions"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_documentacion'>" +
        "<attribute name='new_documentacionid'/>" +
        "<attribute name='new_name'/> " +
        "<attribute name='new_codigo'/> " +
        "<attribute name='new_condicionimpositiva'/> " +
        "<attribute name='new_descripcion'/> " +
        "<attribute name='new_estadodelsocio'/> " +
        "<attribute name='new_grupoeconomico'/> " +
        "<attribute name='new_solicituddealta'/>" +
        "<attribute name='new_personeria'/> " +
        "<attribute name='new_tipodedocumento'/> " +
        "<attribute name='new_tipodefiador'/> " +
        "<attribute name='new_urlplantilla'/> " +
        "<attribute name='new_onboarding'/> " +
        "<attribute name='statecode'/> " +
        "<attribute name='new_requeridoenportal'/> " +
        "<order attribute ='new_codigo' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='new_onboarding' operator='eq' value='1' />" +
        "</filter>" +
        // "<link-entity name='new_documentacion' from='new_documentacionid' to='new_documentoid' link-type='outer' alias='documento'>" +
        // "<attribute name='new_urlplantilla'/> " +
        // "<attribute name='new_descripcion'/> " +
        // "</link-entity>" +
        "</entity>" +
        "</fetch>"
    try {
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
            type: TODOS_DOCUMENTO_EXITO,
            payload: response.data,
            loading: false
        })
    }
    catch (error) {
        // console.log(error)
        dispatch({
            type: ERROR,
            loading: false
        })
    }
}

export const obtenerCondicionesDeInscripcionFETCH = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_CONDICIONES,
        loadingCondiciones: true
    })

    var entidad = "new_new_documentacion_new_condiciondeinscipset"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_new_documentacion_new_condiciondeinscip'>" +
        "<attribute name='new_new_documentacion_new_condiciondeinscipid'/> " +
        "<attribute name='new_documentacionid'/> " +
        "<attribute name='new_condiciondeinscipcionanteafipid'/> " +
        "</entity>" +
        "</fetch>"
    try {
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
            type: TODOS_CONDICIONES_EXITO,
            payload: response.data,
            loadingCondiciones: false
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_CONDICIONES,
            loadingCondiciones: false
        })
    }
}

export const obtenerReferidor = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_REFERIDORES,
        loadingReferidor: true,
        retrieveReferidor: false
    })

    var entidad = "accounts"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='account'>" +
        "<attribute name='name'/> " +
        "<attribute name='new_nmerodedocumento'/> " +
        "<attribute name='accountid'/> " +
        "<order attribute='name' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='new_relacionamientoconlasgr' operator='contain-values'>" +
        "<value>100000004</value>" +
        "</condition>" +
        "</filter>" +
        "</entity>" +
        "</fetch>"
    try {
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
            type: TODOS_REFERIDORES_EXITO,
            payload: response.data,
            loadingReferidor: false,
            retrieveReferidor: true
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_REFERIDORES,
            loadingReferidor: false,
            retrieveReferidor: true
        })
    }
}

export const obtenerDestinoDeFondos = (token) => async () => {

    try {
        debugger
        var entidad = 'new_destinodefondoses';
        var fetch = "<entity name='new_destinodefondos'>" +
            "<attribute name='new_destinodefondosid' />" +
            "<attribute name='new_name' />" +
            "<order attribute='new_name' descending='false'/>" +
            "</entity>"
        debugger
        return new Promise((resolve, reject) => {
            axios.post(`${UrlApi}api/consultafetchs`,
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
                    reject(err)
                })
        })
    }
    catch (error) {
        console.log(error)
    }
}

export const agregarDocumentoAcarpeta = (carpetas) => (dispatch) => {
    try {
        dispatch({
            type: CARPETAS_EXITO,
            payload: carpetas
        })
    } catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const cargarSolicitudDeAlta = (solicitud, files, token, referidoId) => async (dispatch) => {
    debugger
    dispatch({
        type: LOADING_ONBOARDING,
        loadingOnboarding: true,
        porcentajeOnboarding: 5,
        estadoOnboarding: "LOADING"
    })

    try {
        await toast.promise(onboarding(solicitud, files, token, dispatch, referidoId), {
            loading: "Procesando solicitud...",
            success: () => {
                return 'Solicitud enviada 👌';
            },
            error: (error) => {
                dispatch({
                    type: ONBOARDING_ERROR,
                    estadoOnboarding: 'ERROR',
                    loadingOnboarding: false,
                    porcentajeOnboarding: 0,
                })
                return `Error al enviar solicitud. ${error}`;
            }
        });
    }
    catch (error) {
        dispatch({
            type: ONBOARDING_ERROR,
            estadoOnboarding: 'ERROR',
            loadingOnboarding: false,
            porcentajeOnboarding: 0,
        })
        crearExcepcion(`Excepcion en solicitud de alta - ${solicitud.razonSocial} - ${solicitud.cuit} - ${solicitud.email} `, token)
    }
}

const onboarding = (solicitud, files, token, dispatch, referidoId) => new Promise(async (resolve, reject) => {
    try {
        let invitacion = false
        let cuentaExistente = false
        let errorCuenta = false
        let errorSolicitud = false
        var documentacionPorCuenta = solicitud.documentosDTOs
        var solicitud_id
        var accountid
        var documentosNoCargados = []
        await validarUsuarioEnDynamics(solicitud, token)
            .then(resp => {
                if (resp.data != null) {
                    if (resp.data.length > 0 && resp.data[0].new_invitacion != undefined) {
                        invitacion = resp.data[0].new_invitacion
                        if (!invitacion) {
                            crearExcepcion(`La pyme que desea registrar ya existe en el sistema. 
                                ${solicitud.nombreRazonSocial} cuit: ${solicitud.cuitCuilCdi} Correo: ${solicitud.email}`, token)
                            reject("La pyme que desea registrar ya existe en el sistema")
                            cuentaExistente = true
                        }
                    } else if (resp.data.length > 0 && (resp.data[0].new_invitacion == undefined ||
                        resp.data[0].new_invitacion == false)) {
                        crearExcepcion(`La pyme que desea registrar ya existe en el sistema. 
                                ${solicitud.nombreRazonSocial} cuit: ${solicitud.cuitCuilCdi} Correo: ${solicitud.email}`, token)
                        reject("La pyme que desea registrar ya existe en el sistema")
                        cuentaExistente = true
                    }
                }
            })
            .catch(error => {
                reject(error)
            })
        if (cuentaExistente === true) {
            return
        }
        dispatch({
            type: PORCENTAJE_ONBOARDING,
            porcentajeOnboarding: 15
        })
        await crearSolicitud(solicitud, invitacion, token, referidoId)
            .then(resp => {
                if (resp.data != null) {
                    solicitud_id = resp.data
                }
            })
            .catch(e => {
                crearExcepcion(`Hubo un error al enviar la solicitud. Por favor, pongase en contacto con nosotros. 
                ${solicitud.nombreRazonSocial} cuit: ${solicitud.cuitCuilCdi} Correo: ${solicitud.email} - ${e?.response?.data}`, token)
                reject("Hubo un error al enviar la solicitud. Por favor, pongase en contacto con nosotros.")
                errorSolicitud = true
            })

        if (errorSolicitud === true) {
            return
        }

        if (solicitud_id !== undefined && solicitud_id !== null) {
            dispatch({
                type: PORCENTAJE_ONBOARDING,
                porcentajeOnboarding: 40
            })

            await ObtenerAccountid(solicitud_id, token)
                .then(resp => {
                    if (resp.data != null && resp.data.length > 0) {
                        accountid = resp.data[0].accountid
                    }
                })
                .catch(e => {
                    crearExcepcion(`Hubo un error al enviar la solicitud. Por favor, pongase en contacto con nosotros. 
                     ${solicitud.nombreRazonSocial} cuit: ${solicitud.cuitCuilCdi} Correo: ${solicitud.email} - ${e?.response?.data}`, token)
                    reject("Hubo un error al enviar la solicitud. Por favor, pongase en contacto con nosotros.")
                    errorCuenta = true
                })

            if (errorCuenta === true) {
                return
            }

            dispatch({
                type: PORCENTAJE_ONBOARDING,
                porcentajeOnboarding: 50
            })

            if (solicitud?.entidadLufeEncontrada === false ||
                solicitud?.entidadLufeEncontrada === undefined ||
                solicitud?.entidadLufeEncontrada === null ||
                documentacionLufeYParametrizada === true) {
                if (documentacionPorCuenta != null && documentacionPorCuenta.length > 0) {
                    var documentaciones = []
                    for (let elemento of documentacionPorCuenta) {
                        var documentacion = {
                            "new_documentoid": elemento.new_documentacionid
                        }
                        documentaciones.push(documentacion)
                    }
                    if (documentaciones.length > 0) {
                        await axios.post(`${UrlApi}api/onboarding/documentoporcuenta?socio_id=${accountid}
                    &solicitud_id=${solicitud_id}`,
                            documentaciones,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                            .then(respuesta => {
                                if (respuesta.data == "ERROR") {
                                    crearExcepcion(`Error al crear documentacion por cuenta para la cuenta 
                                    ${solicitud?.nombreRazonSocial} cuit: ${solicitud?.cuitCuilCdi} Correo: ${solicitud?.email}`, token)
                                }
                            })
                            .catch(error => {
                                crearExcepcion(`Error al crear documentacion por cuenta para la cuenta 
                                ${solicitud.nombreRazonSocial} cuit: ${solicitud.cuitCuilCdi} Correo: ${solicitud.email} - ${error?.response?.data}`, token)
                            })
                    }
                }

                dispatch({
                    type: PORCENTAJE_ONBOARDING,
                    porcentajeOnboarding: 65
                })

                if (files != null && files.length > 0) {
                    for (let index = 0; index < files.length; index++) {
                        var reFormData = new FormData();
                        var element = files[index];
                        reFormData.append(`body${index}/${files[index].documentoId}`, element);
                        await axios.post(`${UrlApi}api/onboarding/adjuntosdocuxcuenta?socio_id=${accountid}
                                    &solicitud_id=${solicitud_id}`, reFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data', // Importante para el envío de archivos
                                'Authorization': `Bearer ${token}`,
                            },
                        })
                            .then(respuesta => {
                                if (respuesta.data != "EXITO") {
                                    crearExcepcion(`Error al crear documento con adjunto para la cuenta ${accountid} - ${respuesta.data}`, token)
                                }
                            })
                            .catch(error => {
                                documentosNoCargados.push(element?.name)
                                let errorMessage = ''
                                if (error.response) {
                                    errorMessage = error.response?.data?.error;
                                }
                                else if (error.request) {
                                    // La solicitud se hizo pero no se recibió respuesta del servidor (puede deberse a problemas de red)
                                    errorMessage = 'Error en la solicitud: no se recibió respuesta del servidor'
                                } else {
                                    // Ocurrió un error durante la configuración de la solicitud
                                    errorMessage = `Error en la configuración de la solicitud: ${error.message}`
                                }
                                crearExcepcion(`Error al crear documento con adjunto para la cuenta ${accountid} - ${errorMessage}`, token)
                            })
                    }
                }
            }

            dispatch({
                type: PORCENTAJE_ONBOARDING,
                porcentajeOnboarding: 85
            })
            if (accountid != null && solicitud.accionistas.length > 0) {
                await axios.post(`${UrlApi}api/onboarding/relacionaccionistas?cuentaid=${accountid}`,
                    solicitud.accionistas,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(respuesta => {
                        resolve(respuesta.data)
                        if (respuesta.data == "ERROR") {
                            crearExcepcion(`Error al crear accionistas para la cuenta ${accountid} Correo: ${solicitud.email}`, token)
                            // estadoOnboarding = "ERROR POST CUENTA"
                        }
                    })
                    .catch(error => {
                        crearExcepcion(`Error al crear accionistas para la cuenta ${accountid} Correo: ${solicitud.email} - ${error}`, token)
                        // estadoOnboarding = "ERROR POST CUENTA"
                    })
            }
            if (documentosNoCargados?.length > 0) {
                let documentosNoCargadosAux = []
                documentosNoCargadosAux = files.filter(item => documentosNoCargados?.includes(item?.name))
                if (documentosNoCargadosAux?.length > 0) {
                    await generarDocumentacionPorCuenta(accountid, documentosNoCargadosAux, token)
                        .then(() => {
                            documentosNoCargados = []
                        })
                        .catch((error) => {
                            documentosNoCargados = error
                        })
                }
            }
        } else {
            reject("Error al crear la cuenta.")
        }
        if (accountid != null && accountid != undefined && solicitud_id !== undefined && solicitud_id !== null) {
            //limpio el localstorage para poder realizar otro onboarding
            localStorage.clear()
            dispatch({
                type: ONBOARDING_EXITO,
                estadoOnboarding: 'EXITO',
                loadingOnboarding: false,
                porcentajeOnboarding: 100,
                documentosNoCargados: documentosNoCargados,
                razonSocial: solicitud.nombreRazonSocial
            })
        }
        resolve()
    }
    catch (error) {
        reject(error)
    }
})

export const generarDocumentacionPorCuenta = (accountid, files, token) =>
    new Promise(async (resolve, reject) => {
        try {
            if (files != null && files.length > 0) {
                let documentosNoCargados = []
                let errores = false
                for (let index = 0; index < files.length; index++) {
                    var reFormData = new FormData();
                    var element = files[index];
                    reFormData.append(`body${index}/${files[index].documentoId}`, element);
                    await axios
                        .post(
                            `${UrlApi}api/onboarding/adjuntosdocuxcuentaexistente?socio_id=${accountid}`,
                            reFormData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data", // Importante para el envío de archivos
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )
                        .then((respuesta) => {
                            if (respuesta.data != "EXITO") {
                                errores = true
                                documentosNoCargados.push(element?.name);
                                crearExcepcion(`Error al crear documento con adjunto para la cuenta ${accountid}`, token);
                            }
                        })
                        .catch((error) => {
                            errores = true
                            documentosNoCargados.push(element?.name);
                            let errorMessage = "";
                            if (error.response) {
                                errorMessage = error.response.data.error;
                            } else if (error.request) {
                                // La solicitud se hizo pero no se recibió respuesta del servidor (puede deberse a problemas de red)
                                errorMessage = "Error en la solicitud: no se recibió respuesta del servidor";
                            } else {
                                // Ocurrió un error durante la configuración de la solicitud
                                errorMessage = `Error en la configuración de la solicitud: ${error.message}`;
                            }
                            crearExcepcion(
                                `Error al crear documento con adjunto para la cuenta ${accountid} - ${errorMessage}`,
                                token
                            );
                            crearErrorLog("Error al generar documento", `Error al crear documento con adjunto para la cuenta ${accountid} - ${errorMessage}. Documentos: ${element?.name}`, token)
                        });
                }
                if (errores) {
                    reject(documentosNoCargados)
                } else {
                    resolve("Documentos generados con exito!")
                }
            }
            resolve("No se encontraron documentos cargados")
        } catch (error) {
            crearErrorLog("Error al generar documento", `Error ${error}`, token)
            reject(error)
        }
    });


const validarUsuarioEnDynamics = (solicitud, token) => new Promise(async (resolve, reject) => {
    try {
        var entidad = "accounts"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='account'>" +
            "<attribute name='accountid'/>" +
            "<attribute name='new_invitacion'/> " +
            "<filter type='and'>" +
            "<filter type='or'>" +
            "<condition attribute='emailaddress1' operator='eq' value='" + solicitud.email + "' />" +
            "<condition attribute='name' operator='eq' value='" + solicitud.razonSocial + "' />" +
            "<condition attribute='new_nmerodedocumento' operator='eq' value='" + solicitud.cuitCuilCdi + "' />" +
            "</filter>" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        axios.post(`${UrlApi}api/consultafetch`,
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
            .then((data) => { return resolve(data) })
            .catch((error) => { return reject(error) })
    }
    catch (error) {
        return reject(error)
    }
})

const ObtenerAccountid = (solicitud_id, token) => new Promise(async (resolve, reject) => {
    try {
        var entidad = "accounts"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='account'>" +
            "<attribute name='accountid'/>" +
            "<filter type='and'>" +
            "<filter type='or'>" +
            "<condition attribute='new_solicituddealta' operator='eq' value='" + solicitud_id + "' />" +
            "</filter>" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        axios.post(`${UrlApi}api/consultafetch`,
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
            .then((data) => { return resolve(data) })
            .catch((error) => { return reject(error) })
    }
    catch (error) {
        return reject(error)
    }
})

const crearSolicitud = (solicitud, invitacion, token, referidoId) => new Promise(async (resolve, reject) => {
    try {
        debugger
        axios.post(`${UrlApi}api/onboardingprueba`,
            {
                "personeria": solicitud.personeria ? solicitud.personeria : "",
                "razonSocial": solicitud.nombreRazonSocial ? solicitud.nombreRazonSocial : "",
                "cuit": solicitud.cuitCuilCdi ? solicitud.cuitCuilCdi : "",
                "cuitcuil": solicitud.cuitCuil ? solicitud.cuitCuil : "",
                "email": solicitud.usuarioPortal ? solicitud.usuarioPortal : "",
                "telefono": solicitud.telefono ? solicitud.telefono : "",
                "nombreContacto": solicitud.nombre ? solicitud.nombre : "",
                "apellido": solicitud.apellido ? solicitud.apellido : "",
                "tipoDocumento": solicitud.tipoDeDocumento.value ? solicitud.tipoDeDocumento.value : "",
                "productoServicio": solicitud.servicio ? solicitud.servicio : "",
                "actividadAFIP": solicitud.actividad.value ? solicitud.actividad.value : "",
                "monto": '',
                "tipoRelacion": solicitud.relacionCuenta ? solicitud.relacionCuenta : "",
                "tipoSocietario": solicitud.tipoSocietario ? solicitud.tipoSocietario : "",
                "condicionImpositiva": solicitud.condicionImp.value ? solicitud.condicionImp.value : "",
                "cantidadMujeres": solicitud.cantidadMujeresDecision ? solicitud.cantidadMujeresDecision : "",
                "empleadas": solicitud.cantidadEmujeres ? solicitud.cantidadEmujeres : "",
                "discapacitados": solicitud.cantidadPdiscapacidad ? solicitud.cantidadPdiscapacidad : "",
                "otro": solicitud.otro ? solicitud.otro : "",
                "sectorEconomico": "",
                "inicioActividad": "",
                "resena": "",
                "emailNotificaciones": solicitud.emailNotificaciones ? solicitud.emailNotificaciones : "",
                "invitacion": (invitacion != false) ? invitacion.toString() : "false",
                "cuitReferidor": referidoId ? referidoId : null,
                "facturacion": solicitud.facturacionIngreso ? solicitud.facturacionIngreso : "",
                "creadaPorApiLufe": solicitud.entidadLufeEncontrada != undefined ? solicitud.entidadLufeEncontrada.toString() : "",
                "calle": solicitud?.calle ? solicitud.calle : "",
                "numero": solicitud?.calleNumero ? solicitud.calleNumero : "",
                "piso": solicitud?.piso ? solicitud.piso : "",
                "departamento": solicitud?.depto ? solicitud.depto : "",
                "codigoPostal": solicitud?.codPostal ? solicitud.codPostal : "",
                "municipio": solicitud?.munParCom ? solicitud.munParCom : "",
                "localidad": solicitud?.localidad ? solicitud.localidad : "",
                "provincia": solicitud?.provincia ? solicitud.provincia.value : "",
                "pais": solicitud?.pais?.value ? solicitud.pais.value : "",
                "destinoLineaDeCredito": solicitud?.destinoLineaDeCredito?.value ? solicitud.destinoLineaDeCredito.value : "",
                "lineaDeCredito": solicitud?.lineaDeCredito ? solicitud.lineaDeCredito : ""
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((data) => { return resolve(data) })
            .catch((error) => { return reject(error) })
    }
    catch (error) {
        return reject(error)
    }
})

export const setearRobot = (estado) => (dispatch) => {
    dispatch({
        type: ROBOT,
        robot: estado
    })
}

const soliciudLufe = (cuit, accountid, token) => new Promise(async (resolve, reject) => {
    axios.post(`https://hw365api.azurewebsites.net/api/lufe/onbdocumentosyautoridadeslufe`,
        {
            "accountid": accountid,
            "cuit": cuit
        },
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((data) => {
            return resolve(data)
        })
        .catch((error) => {
            return reject(error)
        })
})

const crearExcepcion = (error, token) => {
    try {
        axios.post(`${UrlApi}api/excepcion`,
            {
                "descripcion": error
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    }
    catch (error) {
        console.log(error)
    }
}

export const validarUsuarioEnDynamicsPorCuit = (cuitCuil, token) =>
    new Promise(async (resolve, reject) => {
        const entidad = "accounts";
        const fetch =
            "<fetch mapping='logical'>" +
            "<entity name='account'>" +
            "<attribute name='accountid'/>" +
            "<attribute name='new_invitacion'/> " +
            "<filter type='and'>" +
            "<condition attribute='new_nmerodedocumento' operator='eq' value='" + cuitCuil + "' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        try {
            const response = await axios.post(`${UrlApi}api/consultafetch`, {
                "entidad": entidad,
                "fetch": fetch
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // Verifica si data contiene el array esperado y si su longitud es mayor o igual a 1
            if (response.data && Array.isArray(response.data) && response.data.length >= 1) {
                resolve(true);
            } else {
                resolve(false); // No hay datos o array está vacío
            }
        } catch (error) {
            reject(error);
        }
    });

export const validarUsuarioEnDynamicsPorCorreoElectronico = (correo, token) =>
    new Promise(async (resolve, reject) => {
        const entidad = "accounts";
        const fetch =
            "<fetch mapping='logical'>" +
            "<entity name='account'>" +
            "<attribute name='accountid'/>" +
            "<attribute name='new_invitacion'/> " +
            "<filter type='and'>" +
            "<condition attribute='emailaddress1' operator='eq' value='" + correo + "' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        try {
            const response = await axios.post(`${UrlApi}api/consultafetch`, {
                "entidad": entidad,
                "fetch": fetch
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            debugger
            // Verifica si data contiene el array esperado y si su longitud es mayor o igual a 1
            if (response.data && Array.isArray(response.data) && response.data.length >= 1) {
                resolve(true);
            } else {
                resolve(false); // No hay datos o array está vacío
            }
        } catch (error) {
            reject(error);
        }
    });

const crearErrorLog = (mensaje, error, token) => {
    axios.post(
        `${UrlApi}api/errorlog`,
        {
            Level: "Error",
            Message: mensaje,
            Source: cliente,
            StackTrace: error
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};