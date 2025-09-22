import axios from 'axios'
import { Entidad, UrlApi, UrlApiDynamics } from '../keys'
// import { toast } from 'react-toastify';
// import toast from 'react-hot-toast';
import { useToast } from "@/@core/components/toast/ToastProvider"
import { firestore } from '@/configs/firebaseConfig'
//Const
const dataInicial = {
    loading: false,
    loadingSociedad: false,
    retrieveCuenta: false,
    loadingLufe: false,
    loadingGenerarLufe: false,
    retrieveLufe: false,
    estadoEntidadLufe: '',
    cuenta: {},
    entidadLufe: {},
    cuentaConGarantia: [],
    sociedadXsocio: [],
    sociedadDeBolsa: [],
    modificarSociedadBolsa: '',
    inactivarCuentaSocioMensaje: '',
    sociedadesDeBolsa: [],
    certificadosPymes: [],
    provincias: [],
    socios: [],
    actualizacionDatos: '',
    actualizacionDatosAlyc: '',
    cuentaIdSeleccionada: '',
    cuentaFetch: [],
    paises: [],
    contactosNotificaciones: [],
    crearCuentaSociedad: '',
    comprobantesDeVenta: [],
    tareas: [],
    inactivarTarea: '',
    loadingComprobante: false,
    loadingCertificado: false,
    loadingSociedades: false,
    loadingSociedadesDeBolsa: false,
    loadingTarea: false,
    retrieveSociedades: false,
    retrieveComprobantes: false,
    retrieveCertificados: false,
}

//Types
const CUENTA_EXITO = 'CUENTA_EXITO'
const ENTIDAD_LUFE_EXITO = 'ENTIDAD_LUFE_EXITO'
const LOADING_ENTIDAD_LUFE = 'LOADING_ENTIDAD_LUFE'
const ENTIDAD_LUFE_ERROR = 'ENTIDAD_LUFE_ERROR'
const LOADING_GENERAR_ENTIDAD = 'LOADING_GENERAR_ENTIDAD'
const GENERAR_ENTIDAD_LUFE_ERROR = 'GENERAR_ENTIDAD_LUFE_ERROR'
const GENERAR_ENTIDAD_LUFE_EXITO = 'GENERAR_ENTIDAD_LUFE_EXITO'
const COMPROBANTE_VENTA_EXITO = 'COMPROBANTE_VENTA_EXITO'
const ACTUALIZAR_CUENTA_EXITO = 'ACTUALIZAR_CUENTA_EXITO'
const ACTUALIZAR_CUENTAALYC_EXITO = 'ACTUALIZAR_CUENTAALYC_EXITO'
const PROVINCIA_EXITO = 'PROVINCIA_EXITO'
const CERTIFICADO_EXITO = 'CERTIFICADO_EXITO'
const CUENTA_SOCIEDAD_SOCIO_EXITO = 'CUENTA_SOCIEDAD_SOCIO_EXITO'
const SOCIEDADXSOCIO_EXITO = 'SOCIEDADXSOCIO_EXITO'
const ERROR_SOCIEDADXSOCIO_EXITO = 'ERROR_SOCIEDADXSOCIO_EXITO'
const SOCIEDADBOLSA_EXITO = 'SOCIEDADBOLSA_EXITO'
const MODIFICAR_SOCIEDAD_EXITO = 'MODIFICAR_SOCIEDAD_EXITO'
const SOCIOS_EXITO = 'SOCIOS_EXITO'
const TAREAS_EXITO = 'TAREAS_EXITO'
const LOADING = "LOADING"
const LOADING_CERTIFICADOS = "LOADING_CERTIFICADOS"
const LOADING_ACTUALIZACION = 'LOADING_ACTUALIZACION'
const LOADING_SOCIEDADES = 'LOADING_SOCIEDADES'
const LOADING_CUENTA_SOCIEDAD_SOCIO = 'LOADING_CUENTA_SOCIEDAD_SOCIO'
const ERROR_CUENTA_SOCIEDAD_SOCIO = 'ERROR_CUENTA_SOCIEDAD_SOCIO'
const ERROR_MODIFICAR_SOCIEDAD = 'ERROR_MODIFICAR_SOCIEDAD'
const ERROR = 'ERROR'
const ERROR_INACTIVACION = 'ERROR_INACTIVACION'
const ERROR_ACTUALIZACION_ALYC = 'ERROR_ACTUALIZACION_ALYC'
const ERROR_GENERAL = 'ERROR_GENERAL'
const CUENTA_ID_SELECCIONADA_EXITO = 'CUENTA_ID_SELECCIONADA_EXITO'
const PYMES_ADHERIDAS_A_GARANTIAS = 'PYMES_ADHERIDAS_A_GARANTIAS'
const ERROR_OBTENER_PYME = 'ERROR_OBTENER_PYME'
const CUENTA_FETCH_EXITO = 'CUENTA_FETCH_EXITO'
const PAISES_FETCH_EXITO = 'PAISES_FETCH_EXITO'
const CONTACTOS_NOTI_FETCH_EXITO = 'CONTACTOS_NOTI_FETCH_EXITO'
const INACTIVAR_CUENTA_EXITO = 'INACTIVAR_CUENTA_EXITO'
const LOADING_COMPROBANTE = 'LOADING_COMPROBANTE'
const LOADING_MOD_SOCIEDAD = 'LOADING_MOD_SOCIEDAD'
const LOADING_INACTIVACION = 'LOADING_INACTIVACION'
const LOADING_INACTIVACION_TAREA = 'LOADING_INACTIVACION_TAREA'
const INACTIVAR_TAREA_EXITO = 'INACTIVAR_TAREA_EXITO'
const LOADING_SOCIEDADES_BOLSA = 'LOADING_SOCIEDADES_BOLSA'
const ERROR_SOCIEDAD_BOLSA = 'ERROR_SOCIEDAD_BOLSA'
const ERROR_INACTIVAR_TAREA = 'ERROR_INACTIVAR_TAREA'
const LOADING_CUENTA = 'LOADING_CUENTA'
const ERROR_COMPROBANTE = 'ERROR_COMPROBANTE'
const ERROR_CERTIFICADO_EXITO = 'ERROR_CERTIFICADO_EXITO'
const CUENTAS_EXITO = 'CUENTAS_EXITO'
const LIMPIAR_CUENTAS = 'LIMPIAR_CUENTAS'
const LOADIN_CUENTAS_EXITO = 'LOADIN_CUENTAS_EXITO'

//Reducers
export default function cuentaReducers(state = dataInicial, action) {
    switch (action.type) {
        case LOADING_CUENTA:
            return { ...state, retrieveCuenta: false }
        case MODIFICAR_SOCIEDAD_EXITO:
            return { ...state, modificarSociedadBolsa: action.modificarSociedadBolsa, loadingSociedad: false }
        case LOADING_MOD_SOCIEDAD:
            return { ...state, modificarSociedadBolsa: action.modificarSociedadBolsa, loadingSociedad: true }
        case CUENTA_SOCIEDAD_SOCIO_EXITO:
            return { ...state, crearCuentaSociedad: action.crearCuentaSociedad, loadingSociedad: false }
        case INACTIVAR_CUENTA_EXITO:
            return { ...state, inactivarCuentaSocioMensaje: action.inactivarCuentaSocioMensaje }
        case LOADING_INACTIVACION:
            return { ...state, inactivarCuentaSocioMensaje: action.inactivarCuentaSocioMensaje }
        case ERROR_INACTIVACION:
            return { ...state, inactivarCuentaSocioMensaje: action.inactivarCuentaSocioMensaje }
        case CONTACTOS_NOTI_FETCH_EXITO:
            return { ...state, contactosNotificaciones: action.payload }
        case PAISES_FETCH_EXITO:
            return { ...state, paises: action.payload, loading: action.loading }
        case CUENTA_FETCH_EXITO:
            return { ...state, cuentaFetch: action.payload }
        case SOCIEDADBOLSA_EXITO:
            return { ...state, sociedadDeBolsa: action.payload, loadingSociedadesDeBolsa: action.loadingSociedadesDeBolsa }
        case SOCIEDADXSOCIO_EXITO:
            return { ...state, sociedadXsocio: action.payload, loadingSociedades: action.loadingSociedades, retrieveSociedades: true }
        case CERTIFICADO_EXITO:
            return { ...state, certificadosPymes: action.payload, loadingCertificado: action.loadingCertificado, retrieveCertificados: true }
        case ERROR_ACTUALIZACION_ALYC:
            return { ...state, actualizacionDatosAlyc: action.actualizacionDatosAlyc }
        case ERROR_GENERAL:
            return { ...state, actualizacionDatos: action.actualizacionDatos }
        case LOADING:
            return { ...state, actualizacionDatos: action.actualizacionDatos }
        case LOADING_ACTUALIZACION:
            return { ...state, actualizacionDatosAlyc: action.actualizacionDatosAlyc, actualizacionDatos: action.actualizacionDatos }
        case CUENTA_EXITO:
            return { ...state, cuenta: action.payload, retrieveCuenta: true }
        case PYMES_ADHERIDAS_A_GARANTIAS:
            return { ...state, cuentaConGarantia: action.payload }
        case CUENTA_ID_SELECCIONADA_EXITO:
            return { ...state, cuentaIdSeleccionada: action.cuentId }
        case PROVINCIA_EXITO:
            return { ...state, provincias: action.payload }
        case ACTUALIZAR_CUENTA_EXITO:
            return { ...state, actualizacionDatos: action.actualizacionDatos }
        case ACTUALIZAR_CUENTAALYC_EXITO:
            return { ...state, actualizacionDatosAlyc: action.actualizacionDatosAlyc }
        case SOCIOS_EXITO:
            return { ...state, socios: action.payload }
        case COMPROBANTE_VENTA_EXITO:
            return { ...state, comprobantesDeVenta: action.payload, loadingComprobante: action.loadingComprobante, retrieveComprobantes: true }
        case LOADING_COMPROBANTE:
            return { ...state, loadingComprobante: action.loadingComprobante, retrieveComprobantes: false }
        case LOADING_CERTIFICADOS:
            return { ...state, loadingCertificado: action.loadingCertificado, retrieveCertificados: false }
        case LOADING_SOCIEDADES:
            return { ...state, loadingSociedades: action.loadingSociedades, retrieveSociedades: false }
        case TAREAS_EXITO:
            return { ...state, tareas: action.payload }
        case LOADING_CUENTA_SOCIEDAD_SOCIO:
            return { ...state, crearCuentaSociedad: action.crearCuentaSociedad, loadingSociedad: true }
        case ERROR_CUENTA_SOCIEDAD_SOCIO:
            return { ...state, crearCuentaSociedad: action.crearCuentaSociedad, loadingSociedad: false }
        case ERROR_SOCIEDAD_BOLSA:
            return { ...state, loadingSociedadesDeBolsa: action.loadingSociedadesDeBolsa }
        case LOADING_SOCIEDADES_BOLSA:
            return { ...state, loadingSociedadesDeBolsa: action.loadingSociedadesDeBolsa }
        case INACTIVAR_TAREA_EXITO:
            return { ...state, inactivarTarea: action.inactivarTarea }
        case ERROR_INACTIVAR_TAREA:
            return { ...state, inactivarTarea: action.inactivarTarea }
        case LOADING_INACTIVACION_TAREA:
            return { ...state, inactivarTarea: action.inactivarTarea }
        case ERROR_SOCIEDADXSOCIO_EXITO:
            return { ...state, loadingSociedades: false, retrieveSociedades: true }
        case ERROR_COMPROBANTE:
            return { ...state, loadingComprobante: false, retrieveComprobantes: true }
        case ERROR_CERTIFICADO_EXITO:
            return { ...state, loadingCertificado: false, retrieveCertificados: true }
        case ERROR_MODIFICAR_SOCIEDAD:
            return { ...state, loadingSociedad: false, modificarSociedadBolsa: action.modificarSociedadBolsa }
        case LOADING_ENTIDAD_LUFE:
            return { ...state, loadingLufe: true, retrieveLufe: false }
        case ENTIDAD_LUFE_EXITO:
            return { ...state, loadingLufe: false, retrieveLufe: true, entidadLufe: action.payload }
        case ENTIDAD_LUFE_ERROR:
            return { ...state, loadingLufe: false, retrieveLufe: true, entidadLufe: {} }
        case LOADING_GENERAR_ENTIDAD:
            return { ...state, loadingGenerarLufe: true, estadoEntidadLufe: "LOADING" }
        case GENERAR_ENTIDAD_LUFE_EXITO:
            return { ...state, loadingGenerarLufe: false, estadoEntidadLufe: "EXITO" }
        case GENERAR_ENTIDAD_LUFE_ERROR:
            return { ...state, loadingGenerarLufe: false, estadoEntidadLufe: "ERROR" }
        case CUENTAS_EXITO:
            return { ...state, cuentas: action.payload, resultadoCuentas: action.resultado }
        case LIMPIAR_CUENTAS:
            return { ...state, cuenta: {}, retrieveCuenta: false }
        case LOADIN_CUENTAS_EXITO:
            return { ...state, cuentas: [], resultadoCuentas: false }
        default:
            return { ...state }
    }
}

//Actions
export const obtenerCuenta = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_CUENTA
    })
    try {
        var entidad = "accounts"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='account'>" +
            "<attribute name='name'/> " +
            "<attribute name='accountid'/> " +
            "<attribute name='emailaddress1'/>" +
            "<attribute name='telephone2'/>" +
            "<attribute name='address1_line1'/>" +
            "<attribute name='new_direccion1numero'/>" +
            "<attribute name='address1_name'/>" +
            "<attribute name='new_direccion1depto'/>" +
            "<attribute name='address1_postalcode'/>" +
            "<attribute name='address1_county'/>" +
            "<attribute name='new_localidad'/>" +
            "<attribute name='new_nmerodedocumento'/>" +
            "<attribute name='new_provincia'/>" +
            "<attribute name='new_inscripcionganancias'/>" +
            "<attribute name='new_contactodenotificaciones'/>" +
            "<attribute name='new_pais'/>" +
            "<attribute name='new_condiciondeinscripcionanteafip'/>" +
            "<attribute name='new_estadodelsocio'/>" +
            "<order attribute ='name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='accountid' operator='eq' value='" + accountid + "' />" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        if (accountid !== undefined) {
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
                        type: CUENTA_EXITO,
                        payload: response.data[0]
                    })
                })
                .catch(err => {
                    // console.log(err)
                })
        }
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerMiCuenta = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_CUENTA
    })
    try {
        var entidad = "accounts"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='account'>" +
            "<attribute name='name'/> " +
            "<attribute name='accountid'/> " +
            "<attribute name='emailaddress1'/>" +
            "<attribute name='telephone2'/>" +
            "<attribute name='address1_line1'/>" +
            "<attribute name='new_direccion1numero'/>" +
            "<attribute name='address1_name'/>" +
            "<attribute name='new_direccion1depto'/>" +
            "<attribute name='address1_postalcode'/>" +
            "<attribute name='address1_county'/>" +
            "<attribute name='new_localidad'/>" +
            "<attribute name='new_nmerodedocumento'/>" +
            "<attribute name='new_provincia'/>" +
            "<attribute name='new_inscripcionganancias'/>" +
            "<attribute name='new_contactodenotificaciones'/>" +
            "<attribute name='new_pais'/>" +
            "<attribute name='new_condiciondeinscripcionanteafip'/>" +
            "<attribute name='new_estadodelsocio'/>" +
            "<order attribute ='name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='accountid' operator='eq' value='" + accountid + "' />" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
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
                    resolve(response.data)
                })
                .catch(err => {
                    // ToastError("Error al buscar Mi Cuenta")
                    reject(err)
                })
        })
    }
    catch (error) {
        // ToastError("Error al buscar Mi Cuenta")
        dispatch({
            type: ERROR
        })
    }
}

export const LimiparCuentaSelector = () => async (dispatch) => {
    dispatch({
        type: LIMPIAR_CUENTAS
    })
}

// export const obtenerCuentasPorReferido = (accountid, token) => async (dispatch) => {
//     dispatch({
//         type: CUENTAS_EXITO,
//         resultado: false
//     })

//     try {
//         var entidad = "accounts"
//         var fetch = "<fetch version='1.0'>" +
//             "<entity name='account'>" +
//             "<attribute name='name' />" +
//             "<attribute name='accountid' />" +
//             "<order attribute='name' descending='false' />" +
//             "<filter type='and'>" +
//             "<condition attribute='new_comercial' operator='eq' value='" + accountid + "' />" +
//             "<condition attribute='new_referido' operator='eq' value='1' />" +
//             "</filter>" +
//             "</entity>" +
//             "</fetch>";

//         if (accountid && token) {
//             await axios.post(`${UrlApi}api/consultafetch`,
//                 {
//                     "entidad": entidad,
//                     "fetch": fetch
//                 },
//                 {
//                     headers: {
//                         "Authorization": `Bearer ${token}`
//                     }
//                 })
//                 .then((response) => {
//                     dispatch({
//                         type: CUENTAS_EXITO,
//                         payload: response.data,
//                         resultado: true
//                     })
//                 })
//                 .catch(err => {
//                     console.log(err)
//                 })
//         }
//     }
//     catch (error) {
//         dispatch({
//             type: CUENTAS_EXITO,
//             resultado: false
//         })
//     }
// }


export const obtenerMisReferidos = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADIN_CUENTAS_EXITO
    })

    try {
        var entidad = "accounts"
        var fetch = "<fetch version='1.0'>" +
            "<entity name='account'>" +
            "<attribute name='name' />" +
            "<attribute name='accountid' />" +
            "<attribute name='emailaddress1'/>" +
            "<attribute name='telephone2'/>" +
            "<attribute name='address1_line1'/>" +
            "<attribute name='new_direccion1numero'/>" +
            "<attribute name='address1_name'/>" +
            "<attribute name='new_direccion1depto'/>" +
            "<attribute name='address1_postalcode'/>" +
            "<attribute name='address1_county'/>" +
            "<attribute name='new_localidad'/>" +
            "<attribute name='new_nmerodedocumento'/>" +
            "<attribute name='new_provincia'/>" +
            "<attribute name='new_inscripcionganancias'/>" +
            "<attribute name='new_contactodenotificaciones'/>" +
            "<attribute name='new_pais'/>" +
            "<attribute name='new_condiciondeinscripcionanteafip'/>" +
            "<attribute name='new_estadodelsocio'/>" +
            "<order attribute ='name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='new_comercial' operator='eq' value='" + accountid + "' />" +
            "<condition attribute='new_referido' operator='eq' value='1' />" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            // "<filter type='or'>" +
            //      "<condition attribute='new_estadodelsocio' operator='eq' value='100000001' />" +
            //      "<condition attribute='new_estadodelsocio' operator='eq' value='100000006' />" +
            //      "<condition attribute='new_estadodelsocio' operator='eq' value='100000000' />" +
            // "</filter>" +
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
                    resolve(response.data)
                })
                .catch(err => {
                    // ToastError("Error al buscar Mi Cuenta")
                    reject(err)
                })
        })
    }
    catch (error) {
        // ToastError("Error al buscar Mi Cuenta")
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerProvincias = (token) => async (dispatch) => {
    try {
        var entidad = "new_provincias"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='new_provincia'>" +
            "<attribute name='new_provinciaid'/> " +
            "<attribute name='new_name'/> " +
            "<attribute name='createdon'/>" +
            "<order attribute ='new_name' descending='false' />" +
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
                    resolve(response.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerPaises = (token) => async (dispatch) => {

    try {
        var entidad = "new_paises"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='new_pais'>" +
            "<attribute name='new_paisid'/> " +
            "<attribute name='new_name'/> " +
            "<attribute name='createdon'/>" +
            "<order attribute ='new_name' descending='false' />" +
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
                    resolve(response.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    catch (error) {
        dispatch({
            type: ERROR,
            loading: false
        })
    }
}



export const obtenerSocios = () => async (dispatch) => {
    // dispatch({
    //     type: LOADING
    // })

    try {
        const response = await axios.get(`${UrlApiDynamics}Account?filter=&cuit=${Entidad}`)
        dispatch({
            type: SOCIOS_EXITO,
            payload: response.data
        })
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerCertificadoPyme = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_CERTIFICADOS,
        loadingCertificado: true
    })

    try {
        var entidad = "new_certificadopymes"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='new_certificadopyme'>" +
            "<attribute name='new_name'/> " +
            "<attribute name='new_vigenciahasta'/> " +
            "<attribute name='new_vigenciadesde'/>" +
            "<attribute name='statuscode'/> " +
            "<attribute name='new_numeroderegistro'/> " +
            "<attribute name='new_certificadopymeid'/> " +
            "<attribute name='new_fechadeemision'/> " +
            "<attribute name='new_categoria'/> " +
            "<attribute name='new_sectoreconomico'/> " +
            "<order attribute ='new_name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='new_socioparticipe' operator='eq' value='" + accountid + "' />" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";

        if (accountid !== undefined) {
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
                        type: CERTIFICADO_EXITO,
                        payload: response.data,
                        loadingCertificado: false
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ERROR_CERTIFICADO_EXITO,
                    })
                })
        }
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerSociedadesXsocio = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_SOCIEDADES,
        loadingSociedades: true
    })

    try {
        if (accountid !== undefined) {
            var entidad = "new_sociedaddebolsaporsocios"
            var fetch = "<fetch mapping='logical'>" +
                "<entity name='new_sociedaddebolsaporsocio'>" +
                "<attribute name='new_cuentacomitente' />" +
                "<attribute name='new_sociedaddebolsaporsocioid' />" +
                "<attribute name='new_socio' />" +
                "<attribute name='new_sociedaddebolsa' />" +
                "<attribute name='new_name' />" +
                "<attribute name='statecode' />" +
                "<order attribute='new_cuentacomitente' descending='false' />" +
                "<filter type='and'>" +
                "<condition attribute='statecode' operator='eq' value='0' />" +
                "<condition attribute='new_socio' operator='eq' uitype='account' value='" + accountid + "' />" +
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
            type: ERROR_SOCIEDADXSOCIO_EXITO,
            loadingSociedades: false
        })
    }
}

export const obtenerSociedadeDeBolsa = (token) => async (dispatch) => {
    dispatch({
        type: LOADING_SOCIEDADES_BOLSA,
        loadingSociedadesDeBolsa: true
    })

    try {
        var entidad = "new_sociedaddebolsas"
        var fetch = "<fetch mapping='logical'>" +
            "<entity name='new_sociedaddebolsa'>" +
            "<attribute name='new_sociedaddebolsaid' />" +
            "<attribute name='new_name' />" +
            "<order attribute='new_name' descending='false' />" +
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
                    resolve(response.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    catch (error) {
        dispatch({
            type: ERROR_SOCIEDAD_BOLSA,
            loadingSociedadesDeBolsa: false
        })
    }
}

export const actualizarDatosCuenta = (accountid, token, telefono = "", calle = "", numero = "", piso = "", depto = "",
    provinciaId = "", localidad = "", municipio = "", codigoPostal = "", inscripcion = "", pais = "", firmante = "", toastCustom) => async (dispatch) => {
        dispatch({
            type: LOADING_ACTUALIZACION,
            actualizacionDatos: 'LOADING',
            actualizacionDatosAlyc: 'PENDING',
        })
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            await toastCustom.promise(axios.put(`${UrlApi}api/socioparticipe/micuenta`,
                {
                    "accountid": accountid,
                    "telephone2": "123123",
                    "address1_line1": calle,
                    "new_direccion1numero": numero.toString(),
                    "address1_name": piso,
                    "new_direccion1depto": depto,
                    "new_provincia": provinciaId,
                    "new_localidad": localidad,
                    "address1_county": municipio,
                    "address1_postalcode": codigoPostal,
                    "new_condiciondeinscripcionanteafip": inscripcion == "" ? 0 : inscripcion,
                    "new_pais": pais,
                },
                config),
                {
                    loading: "Cargando...",
                    success: "Proceso exitoso.",
                    error: "Error al actualizar los datos de la cuenta.",
                }
            );
        } catch (error) {
            dispatch({
                type: ERROR_GENERAL,
                actualizacionDatos: 'ERROR'
            })
        }
    }

export const actualizarDatosAlyc = (accountid, estadoSocio = null, actividad = null, opera = null, montoEstimado = null, proposito = null,
    otros = null, metodoEmision = null, fechaContrato = null, fechaInscripcion = null, numeroInscripcion = null) => async (dispatch) => {
        dispatch({
            type: LOADING_ACTUALIZACION,
            actualizacionDatosAlyc: 'LOADING',
            actualizacionDatos: 'PENDING'
        })

        let socio = null;
        let operaXcuenta = null;
        let metodo = null;

        if (opera !== null) {
            operaXcuenta = opera.value;
        }

        if (estadoSocio !== null) {
            socio = estadoSocio.value;
        }

        if (metodoEmision !== null) {
            metodo = metodoEmision.value;
        }

        if (fechaContrato === '') {
            fechaContrato = null
        }

        try {
            const response = await axios.post(`${UrlApiDynamics}Cuentaalyc?accountId=${accountid}&estadoSocio=${socio}
            &actividad=${actividad}&opera=${operaXcuenta}&montoEstimado=${montoEstimado}&proposito=${proposito}&otros=${otros}
            &metodoEmision=${metodo}&fechaContrato=${fechaContrato}&fechaInscripcion=${fechaInscripcion}
            &numeroInscripcion=${numeroInscripcion}&cuit=${Entidad}`)
            dispatch({
                type: ACTUALIZAR_CUENTAALYC_EXITO,
                payload: response.data,
                actualizacionDatosAlyc: 'EXITO'
            })
        } catch (error) {
            dispatch({
                type: ERROR_ACTUALIZACION_ALYC,
                actualizacionDatosAlyc: 'ERROR'
            })
        }
    }

export const obtenerCuentaIdSeleccionada = (id) => (dispatch) => {
    if (id !== undefined) {
        dispatch({
            type: CUENTA_ID_SELECCIONADA_EXITO,
            cuentId: id
        })
    }
}

export const obtenerCuentaAdheridaGarantiaFetch = () => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    try {
        const response = await axios.get(`${UrlApiDynamics}Fetch?Entidad=Pymes&cuit=${Entidad}`)
        dispatch({
            type: PYMES_ADHERIDAS_A_GARANTIAS,
            payload: response.data
        })
    } catch (error) {
        dispatch({
            type: ERROR_OBTENER_PYME
        })
    }
}

export const obtenerCuentaFetch = (contactid) => async (dispatch) => {
    dispatch({
        type: LOADING
    })

    var entidad = "contacts";
    var fetch = "<fetch mapping='logical' distinct='false'>" +
        "<entity name='contact'>" +
        "<attribute name='fullname' />" +
        "<attribute name='emailaddress1' />" +
        "<attribute name='parentcustomerid' />" +
        "<attribute name='telephone1' />" +
        "<attribute name='statecode' />" +
        "<attribute name='contactid' />" +
        "<filter type='and'>" +
        "<condition attribute='contactid' operator='eq'  uitype='contact' value='" + contactid + "' />" +
        "</filter>" +
        "</entity>" +
        "</fetch>";


    try {
        const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
        dispatch({
            type: CUENTA_FETCH_EXITO,
            payload: response.data
        })
    } catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerContactoDeNotificaciones = (accountid) => async (dispatch) => {
    dispatch({
        type: LOADING
    })

    var entidad = "contacts"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='contact'>" +
        "<attribute name='fullname'/>" +
        "<attribute name='telephone1'/> " +
        "<attribute name='contactid'/> " +
        "<link-entity name='new_participacionaccionaria' from='new_cuentacontactovinculado' to='contactid' link-type='inner' alias='aa'>" +
        "<attribute name='new_tipoderelacion'/> " +
        "<filter type='and'>" +
        "<condition attribute='new_cuentaid' operator='eq' value='" + accountid + "' />" +
        "</filter>" +
        "</link-entity>" +
        "</entity>" +
        "</fetch>";

    try {
        const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
        dispatch({
            type: CONTACTOS_NOTI_FETCH_EXITO,
            payload: response.data
        })
    }

    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerComprobantesDeVenta = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_COMPROBANTE,
        loadingComprobante: true
    })

    var entidad = "new_comprobantedeventas"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_comprobantedeventa'>" +
        "<attribute name='new_comprobantedeventaid'/>" +
        "<attribute name='new_name'/> " +
        "<attribute name='createdon'/>" +
        "<attribute name='new_total'/> " +
        "<attribute name='new_nrocomprobante'/>" +
        "<attribute name='new_tipodecomprobante'/> " +
        "<attribute name='new_urlafip'/> " +
        "<filter type='and'>" +
        "<condition attribute='new_cliente' operator='eq' value='" + accountid + "' />" +
        "</filter>" +
        "<link-entity name='annotation' from='objectid' to='new_comprobantedeventaid' link-type='outer' alias='nota'>" +
        "<attribute name='annotationid'/> " +
        // "<attribute name='documentbody'/>" +
        "<attribute name='filename'/> " +
        // "<attribute name='mimetype'/>" +
        "</link-entity>" +
        "</entity>" +
        "</fetch>";

    axios.post(`https://hw365api.azurewebsites.net/api/consultafetch`,
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
                type: COMPROBANTE_VENTA_EXITO,
                payload: response.data,
                loadingComprobante: false
            })
        })
        .catch(err => {
            dispatch({
                type: ERROR_COMPROBANTE,
            })
        })
}

export const obtenerTareas = (accountid, token) => async (dispatch) => {
    // dispatch({
    //     type: LOADING_COMPROBANTE,
    //     loadingComprobante: true
    // })

    try {
        if (accountid != undefined) {
            var entidad = "tasks"
            var fetch = "<fetch mapping='logical'>" +
                "<entity name='task'>" +
                "<attribute name='subject'/> " +
                "<attribute name='prioritycode'/>" +
                "<attribute name='scheduledend'/> " +
                "<attribute name='createdby'/>" +
                "<attribute name='activityid'/> " +
                "<attribute name='statuscode'/> " +
                "<attribute name='description'/> " +
                "<attribute name='new_tipodenotificacion'/> " +
                "<attribute name='createdon'/> " +
                "<attribute name='statecode'/> " +
                "<filter type='and'>" +
                "<condition attribute='regardingobjectid' operator='eq' value='" + accountid + "' />" +
                "<condition attribute='new_mostrarenportal' operator='eq' value='1' />" +
                // "<condition attribute='statecode' operator='eq' value='0' />" +
                "</filter>" +
                "</entity>" +
                "</fetch>";

            return new Promise((resolve, reject) => {
                axios.post(`https://hw365api.azurewebsites.net/api/consultafetch`,
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
    } catch (error) {
        console.log(error)
    }
}

export const inactivarSociedadBolsa = (id, token, toast) => async (dispatch) => {
    // dispatch({
    //     type: LOADING_INACTIVACION,
    //     inactivarCuentaSocioMensaje: 'LOADING'
    // })
    try {
        debugger
        await toast.promise(axios.put(`${UrlApi}api/socioparticipe/inactivarsociedaddebolsa`,
            {
                "new_sociedaddebolsaporsocioid": id,
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            }
        ), {
            loading: "Cargando...",
            success: "Sociedad de bolsa eliminada con éxito.",
            error: "Ocurrió un error al eliminar la sociedad de bolsa."
            // success: () => {
            //     dispatch({
            //         type: INACTIVAR_CUENTA_EXITO,
            //         inactivarCuentaSocioMensaje: 'EXITO'
            //     })
            //     return 'Proceso exitoso.';
            // },
            // error: (error) => {
            //     dispatch({
            //         type: ERROR_INACTIVACION,
            //         inactivarCuentaSocioMensaje: 'ERROR'
            //     })
            //     return `Error al inactivar sociedad de bolsa. ${error}`;
            // }
        });
    } catch (error) {
        debugger
        dispatch({
            type: ERROR_INACTIVACION,
            inactivarCuentaSocioMensaje: 'ERROR'
        })
    }
}

export const inactivarTarea = (id, token) => async (dispatch) => {
    dispatch({
        type: LOADING_INACTIVACION_TAREA,
        inactivarTarea: 'LOADING'
    })
    try {
        await axios.put(`${UrlApi}api/socioparticipe/inactivartarea`,
            {
                "activityid": id,
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            }
        )
            .then((response) => {
                dispatch({
                    type: INACTIVAR_TAREA_EXITO,
                    inactivarTarea: 'EXITO'
                })
            })
            .catch(err => {
                dispatch({
                    type: ERROR_INACTIVAR_TAREA,
                    inactivarTarea: 'ERROR'
                })
            })
    } catch (error) {
        dispatch({
            type: ERROR_INACTIVAR_TAREA,
            inactivarTarea: 'ERROR'
        })
    }
}

export const EliminarSociedadBolsa = (id, socio, sociedadBolsa, cuentaComitente, token) => async (dispatch) => {
    dispatch({
        type: LOADING,
    })

    try {
        await toast.promise(axios.delete(`${UrlApi}api/socioparticipe/sociedaddebolsa?new_sociedaddebolsaporsocioid=${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            }
        ), {
            loading: "Cargando...",
            success: () => {
                dispatch({
                    type: MODIFICAR_SOCIEDAD_EXITO,
                    modificarSociedadBolsa: 'EXITO'
                })
                return 'Proceso exitoso.';
            },
            error: (error) => {
                dispatch({
                    type: ERROR,
                    inactivarCuentaSocioMensaje: 'ERROR'
                })
                return `Error al inactivar sociedad de bolsa. ${error}`;
            }
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            inactivarCuentaSocioMensaje: 'ERROR'
        })

    }
}

export const CrearSociedadBolsaSocio = (accountid, datos, token, toast) => async (dispatch) => {
    // dispatch({
    //     type: LOADING_CUENTA_SOCIEDAD_SOCIO,
    //     crearCuentaSociedad: 'LOADING'
    // })

    try {
        const { cuentaComitente, sociedades } = datos
        await toast.promise(axios.post(`${UrlApi}api/socioparticipe/sociedaddebolsa`,
            {
                "new_sociedaddebolsaporsocioid": "",
                "new_socio": accountid,
                "new_sociedaddebolsa": sociedades.value,
                "new_cuentacomitente": cuentaComitente
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ), {
            loading: "Cargando...",
            success: "Sociedad de bolsa creada con éxito.",
            error: "Ocurrió un error al crear la sociedad de bolsa."
            // success: () => {
            //     dispatch({
            //         type: CUENTA_SOCIEDAD_SOCIO_EXITO,
            //         crearCuentaSociedad: 'EXITO'
            //     })
            //     return 'Proceso exitoso.';
            // },
            // error: (error) => {
            //     dispatch({
            //         type: ERROR_CUENTA_SOCIEDAD_SOCIO,
            //         crearCuentaSociedad: 'ERROR'
            //     })
            //     return `Error al crear sociedad de bolsa. ${error}`;
            // }
        });
    } catch (error) {
        // dispatch({
        //     type: ERROR_CUENTA_SOCIEDAD_SOCIO,
        //     crearCuentaSociedad: 'ERROR'
        // })
    }
}

export const ModificarSociedadBolsaSocio = (id, accountid, datos, token, toast) => async (dispatch) => {
    // dispatch({
    //     type: LOADING_MOD_SOCIEDAD,
    //     modificarSociedadBolsa: 'LOADING'
    // })


    try {
        const { cuentaComitente, sociedades } = datos
        await toast.promise(axios.put(`${UrlApi}api/socioparticipe/sociedaddebolsa`,
            {
                "new_sociedaddebolsaporsocioid": id,
                "new_socio": accountid,
                "new_sociedaddebolsa": sociedades.value,
                "new_cuentacomitente": cuentaComitente
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ), {
            loading: "Cargando...",
            success: "Sociedad de bolsa actualizada con éxito.",
            error: "Ocurrió un error al actualizar la sociedad de bolsa."
            // success: () => {
            //     dispatch({
            //         type: MODIFICAR_SOCIEDAD_EXITO,
            //         modificarSociedadBolsa: 'EXITO'
            //     })
            //     return 'Proceso exitoso.';
            // },
            // error: (error) => {
            //     dispatch({
            //         type: ERROR_MODIFICAR_SOCIEDAD,
            //         modificarSociedadBolsa: 'ERROR'
            //     })
            //     return `Error al actualizar sociedad de bolsa. ${error}`;
            // }
        });
    } catch (error) {
        console.log(error)
        // dispatch({
        //     type: ERROR_MODIFICAR_SOCIEDAD,
        //     modificarSociedadBolsa: 'ERROR'
        // })
    }
}

export const obtenerEntidadLUFE = (cuit, token) => async (dispatch) => {
    dispatch({
        type: LOADING_ENTIDAD_LUFE
    })
    axios.get(`${UrlApi}api/lufe/consultarentidad?cuit=${cuit}`,
    // axios.get(`https://hw365api.azurewebsites.net/api/lufe/consultarentidad?cuit=${cuit}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            dispatch({
                type: ENTIDAD_LUFE_EXITO,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch({
                type: ENTIDAD_LUFE_ERROR,
            })
        })
}

export const generarEntidadLUFE = (email, razonSocial, cuit, tipoDocumento, token) => async (dispatch) => {
    dispatch({
        type: LOADING_GENERAR_ENTIDAD
    })
    await toast.promise(onboardingLufe(email, razonSocial, cuit, tipoDocumento, token, dispatch), {
        loading: "Aguarde por favor, no cierre la ventana ya que se está procesando la información. Esta tarea puede demorar unos minutos...",
        success: () => {
            dispatch({
                type: GENERAR_ENTIDAD_LUFE_EXITO
            })
            return 'Solicitud enviada 👌';
        },
        error: (error) => {
            dispatch({
                type: GENERAR_ENTIDAD_LUFE_ERROR,
            })
            return `Error al enviar solicitud. ${error}`;
        }
    });
}

const onboardingLufe = (email, razonSocial, cuit, tipoDocumento, token, dispatch) => new Promise(async (resolve, reject) => {
    let invitacion = false
    let creacion = true
    await validarUsuarioEnDynamics(email, razonSocial, cuit, token)
        .then(resp => {
            if (resp.data != null) {
                if (resp.data.length > 0 && resp.data[0].new_invitacion != undefined) {
                    invitacion = resp.data[0].new_invitacion
                    if (!invitacion) {
                        creacion = false
                        crearExcepcion(`La pyme que desea registrar ya existe en el sistema. 
                            ${razonSocial} cuit: ${cuit} Correo: ${email}`, token)
                        reject("La pyme que desea registrar ya existe en el sistema.")
                    }
                } else if (resp.data.length > 0 && (resp.data[0].new_invitacion == undefined ||
                    resp.data[0].new_invitacion == false)) {
                    creacion = false
                    crearExcepcion(`La pyme que desea registrar ya existe en el sistema. 
                            ${razonSocial} cuit: ${cuit} Correo: ${email}`, token)
                    reject("La pyme que desea registrar ya existe en el sistema.")
                }
            }
        })
        .catch(error => {
            reject(error)
        })
    if (creacion) {
        await crearSolicitud(cuit, email, tipoDocumento, token)
            .then(resp => {
                resolve()
            })
            .catch(e => {
                crearExcepcion(`Hubo un error al enviar la solicitud. Por favor, pongase en contacto con nosotros. 
        ${razonSocial} cuit: ${cuit} Correo: ${email} - ${e}`, token)
                reject("Hubo un error al enviar la solicitud. Por favor, pongase en contacto con nosotros.")
            })
    }
})

const validarUsuarioEnDynamics = (email, razonSocial, cuit, token) => new Promise(async (resolve, reject) => {
    var entidad = "accounts"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='account'>" +
        "<attribute name='accountid'/>" +
        "<attribute name='new_invitacion'/> " +
        "<filter type='and'>" +
        "<filter type='or'>" +
        "<condition attribute='emailaddress1' operator='eq' value='" + email + "' />" +
        "<condition attribute='name' operator='eq' value='" + razonSocial + "' />" +
        "<condition attribute='new_nmerodedocumento' operator='eq' value='" + cuit + "' />" +
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
})

const crearSolicitud = (cuit, email, tipoDocumento, token) => new Promise(async (resolve, reject) => {
    axios.post(`https://hw365api.azurewebsites.net/api/lufe/onboardinglufe`,
        {
            "email": email,
            "cuit": cuit.toString(),
            "tipoDocumento": tipoDocumento.value,
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
