import axios from 'axios'
import { UrlApi } from '../keys'
import toast from 'react-hot-toast';
import moment from 'moment'

const dataInicial = {
    operaciones: [],
    acreedores: [],
    destinoDeFondos: [],
    garantia: [],
    documentosXOperacion: [],
    documentosDeOperacion: [],
    documentosXID: [],
    operacionXID: [],
    cargaOP: '',
    cargaGarantia: '',
    cargaDocumento: '',
    documentoid: '',
    refreshOperaciones: false,
    loadingOperaciones: false,
    retrieveOperaciones: false,
    loadingDocumentoOperacion: false
}

const ERROR_OPERACIONES = 'ERROR_OPERACIONES'
const ERROR_OPERACIONES_FETCH = 'ERROR_OPERACIONES_FETCH'
const LOADING_OPERACIONES = 'LOADING_OPERACIONES'
const TODAS_OPERACIONES_EXITO = 'TODAS_OPERACIONES_EXITO'
const OPERACIONXID_EXITO = 'OPERACIONXID_EXITO'
const TODOS_ACREEDORES_EXITO = 'TODOS_ACREEDORES_EXITO'
const TODAS_DESTINOSDEFONFOS_EXITO = 'TODAS_DESTINOSDEFONFOS_EXITO'
const CARGAOP = 'CARGAOP'
const CARGAGARANTIA = 'CARGAGARANTIA'
const ACTUALIZAR_REFRESH_OPERACIONES = 'ACTUALIZAR_REFRESH_OPERACIONES'
const CARGA_DOCUMENTOXOPERACION = 'CARGA_DOCUMENTOXOPERACION'
const CARGA_DOCUMENTOXOPERACION_ERROR = 'CARGA_DOCUMENTOXOPERACION_ERROR'
const TODAS_DOCUMENTOSXOP_EXITO = 'TODAS_DOCUMENTOSXOP_EXITO'
const TODAS_DOCUMENTOSDEOP_EXITO = 'TODAS_DOCUMENTOSDEOP_EXITO'
const DOCUMENTOSXID_EXITO = 'DOCUMENTOSXID_EXITO'
const LOADING_CARGAOPERACION = 'LOADING_CARGAOPERACION'
const LOADING_CARGADOCUMENTO = 'LOADING_CARGADOCUMENTO'
const LOADING_CARGAGARANTIA = 'LOADING_CARGAGARANTIA'
const LOADING_DOCUMENTOSXID = 'LOADING_DOCUMENTOSXID'
const LOADING_OPERACIONXID = 'LOADING_OPERACIONXID'
const LIMPIAR_CARGA_DOCUMENTO = 'LIMPIAR_CARGA_DOCUMENTO'

export default function operacionesReducers(state = dataInicial, action) {
    switch (action.type) {
        case TODAS_OPERACIONES_EXITO:
            return { ...state, operaciones: action.payload, refreshOperaciones: action.refreshOperaciones, loadingOperaciones: action.loadingOperaciones, retrieveOperaciones: true }
        case TODOS_ACREEDORES_EXITO:
            return { ...state, acreedores: action.payload }
        case TODAS_DESTINOSDEFONFOS_EXITO:
            return { ...state, destinoDeFondos: action.payload }
        case CARGAOP:
            return { ...state, cargaOP: action.payload }
        case OPERACIONXID_EXITO:
            return { ...state, operacionXID: action.payload }
        case CARGAGARANTIA:
            return { ...state, cargaGarantia: action.payload, garantia: action.garantia }
        case ACTUALIZAR_REFRESH_OPERACIONES:
            return { ...state, refreshOperaciones: action.refreshOperaciones }
        case LOADING_OPERACIONES:
            return { ...state, loadingOperaciones: action.loadingOperaciones, retrieveOperaciones: false }
        case CARGA_DOCUMENTOXOPERACION:
            return { ...state, cargaDocumento: action.cargaDocumento, documentoid: action.documentoid, loadingDocumentoOperacion: false }
        case CARGA_DOCUMENTOXOPERACION_ERROR:
            return { ...state, cargaDocumento: action.cargaDocumento, documentoid: action.documentoid, loadingDocumentoOperacion: false }
        case TODAS_DOCUMENTOSXOP_EXITO:
            return { ...state, documentosXOperacion: action.payload }
        case TODAS_DOCUMENTOSDEOP_EXITO:
            return { ...state, documentosDeOperacion: action.payload }
        case DOCUMENTOSXID_EXITO:
            return { ...state, documentosXID: action.payload, documentoid: '' }
        case LOADING_DOCUMENTOSXID:
            return { ...state, documentosXID: action.payload }
        case LOADING_CARGADOCUMENTO:
            return { ...state, cargaDocumento: action.cargaDocumento, documentoid: action.documentoid, loadingDocumentoOperacion: true }
        case LOADING_CARGAGARANTIA:
            return { ...state, cargaGarantia: action.cargaGarantia, garantia: action.garantia }
        case LOADING_CARGAOPERACION:
            return { ...state, cargaOP: action.payload }
        case LOADING_OPERACIONXID:
            return { ...state, operacionXID: action.payload }
        case LIMPIAR_CARGA_DOCUMENTO:
            return { ...state, cargaDocumento: action.cargaDocumento }
        case ERROR_OPERACIONES_FETCH:
            return { ...state, loadingOperaciones: false, retrieveOperaciones: true }
        default:
            return { ...state }
    }
}

export const obtenerOperaciones = (cuentaid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_OPERACIONES,
        loadingOperaciones: true
    })

    try {
        debugger
        if (cuentaid != null) {
            var entidad = "new_operacions"
            var fetch = "<fetch mapping='logical'>" +
                "<entity name='new_operacion'>" +
                "<attribute name='new_name'/> " +
                "<attribute name='new_socioparticipe'/> " +
                "<attribute name='new_nrooperacion'/> " +
                "<attribute name='new_tipooperacin'/>" +
                "<attribute name='new_tipogarantia'/> " +
                "<attribute name='new_tipodecheque'/> " +
                "<attribute name='new_montototal'/> " +
                "<attribute name='new_cantidadgarantias'/> " +
                "<attribute name='new_operacionid'/> " +
                "<attribute name='new_socioprotector'/> " +
                "<attribute name='new_referido'/> " +
                "<attribute name='createdon'/> " +
                "<attribute name='statuscode'/> " +
                "<attribute name='new_productocomercial'/> " +
                "<attribute name='new_fechadeenvio'/> " +
                "<attribute name='new_fechadeinstrumentacion'/> " +
                "<attribute name='new_destinodefondo'/> " +
                "<attribute name='new_acreedor'/> " +
                "<attribute name='new_montodelaoperacion'/> " +
                "<order attribute ='createdon' descending='false' />" +
                "<filter type='and'>" +
                // "<condition attribute='statecode' operator='eq' value='1' />" + //Inactivo
                "<condition attribute='new_socioparticipe' operator='eq' value='" + cuentaid + "' />" +
                "</filter>" +
                "<link-entity name='new_garantia' from='new_operacion' to='new_operacionid' link-type='outer' alias='garantia'>" +
                "<attribute name='new_garantiaid'/> " +
                "<attribute name='new_ndeordendelagarantiaotorgada'/> " +
                "<attribute name='new_socioparticipe'/> " +
                "<attribute name='new_tipodegarantias'/> " +
                "<attribute name='new_fechadenegociacion'/> " +
                "<attribute name='new_fechadevencimiento'/> " +
                "<attribute name='new_monto'/> " +
                "<attribute name='statuscode'/> " +
                "<attribute name='new_acreedor'/> " +
                "<attribute name='createdon'/> " +
                "<attribute name='new_tipodeoperacion'/> " +
                "</link-entity>" +
                "<link-entity name='new_documentacionporoperacion' from='new_operacion' to='new_operacionid' link-type='outer' alias='documentaciones'>" +
                "<attribute name='new_documentacionporoperacionid'/> " +
                "<attribute name='new_name'/> " +
                "<attribute name='new_documento'/> " +
                "<attribute name='new_operacion'/> " +
                "<attribute name='statuscode'/> " +
                "<attribute name='new_fechadevencimiento'/> " +
                "<attribute name='new_vinculocompartido'/> " +
                "<link-entity name='new_documentacion' from='new_documentacionid' to='new_documento' link-type='outer' alias='documentos'>" +
                "<attribute name='new_urlplantilla'/> " +
                "<attribute name='new_descripcion'/> " +
                "</link-entity>" +
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
            type: ERROR_OPERACIONES_FETCH,
            loadingOperaciones: false
        })
    }
}

export const obtenerOperacionPorID = (operacionid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_OPERACIONXID,
        operacionXID: []
    })

    var entidad = "new_operacions"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_operacion'>" +
        "<attribute name='new_socioparticipe'/> " +
        "<attribute name='new_nrooperacion'/> " +
        "<attribute name='new_tipooperacin'/>" +
        "<attribute name='new_tipogarantia'/> " +
        "<attribute name='new_tipodecheque'/> " +
        "<attribute name='new_montototal'/> " +
        "<attribute name='new_cantidadgarantias'/> " +
        "<attribute name='new_operacionid'/> " +
        "<attribute name='new_socioprotector'/> " +
        "<attribute name='new_referido'/> " +
        "<attribute name='createdon'/> " +
        "<attribute name='statuscode'/> " +
        "<attribute name='new_productocomercial'/> " +
        "<attribute name='new_fechadeenvio'/> " +
        "<attribute name='new_fechadeinstrumentacion'/> " +
        "<attribute name='new_destinodefondo'/> " +
        "<attribute name='new_acreedor'/> " +
        "<attribute name='new_montodelaoperacion'/> " +
        "<order attribute ='createdon' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='new_operacionid' operator='eq' value='" + operacionid + "' />" +
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
                    type: OPERACIONXID_EXITO,
                    payload: response.data,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_OPERACIONES
            // loadingOperaciones: false
        })
    }
}

export const obteneAcreedores = (token) => async (dispatch) => {
    var entidad = "new_acreedors"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_acreedor'>" +
        "<attribute name='new_acreedorid'/> " +
        "<attribute name='new_name'/> " +
        "<attribute name='new_tipodeacreedor'/> " +
        "<attribute name='new_montocalificado'/> " +
        "<order attribute ='new_name' descending='false' />" +
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
                    type: TODOS_ACREEDORES_EXITO,
                    payload: response.data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_OPERACIONES,
            loading: false
        })
    }
}

export const obtenerDestinoDeFondos = (token) => async (dispatch) => {
    var entidad = "new_destinodefondoses"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_destinodefondos'>" +
        "<attribute name='new_destinodefondosid'/> " +
        "<attribute name='new_name'/> " +
        "<order attribute ='new_name' descending='false' />" +
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
                    type: TODAS_DESTINOSDEFONFOS_EXITO,
                    payload: response.data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_OPERACIONES,
            loading: false
        })
    }
}

export const obtenerDocumentosPorOperacion = (accoutid, token) => async (dispatch) => {

    var entidad = "annotations"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='annotation'>" +
        "<attribute name='annotationid'/> " +
        "<attribute name='subject'/> " +
        "<attribute name='filename'/> " +
        "<attribute name='objectid'/> " +
        "<order attribute ='filename' descending='false' />" +
        "<link-entity name='new_operacion' from='new_operacionid' to='objectid' link-type='inner' alias='operacion'>" +
        "<filter type='and'>" +
        "<condition attribute='new_socioparticipe' operator='eq' value='" + accoutid + "' />" +
        "</filter>" +
        "</link-entity>" +
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
                    type: TODAS_DOCUMENTOSXOP_EXITO,
                    payload: response.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_OPERACIONES,
            loading: false
        })
    }
}

export const obtenerDocumentosDeOperacion = (accoutid, token) => async (dispatch) => {
    var entidad = "new_documentacionporoperacions"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='new_documentacionporoperacion'>" +
        "<attribute name='new_documentacionporoperacionid'/> " +
        "<attribute name='new_name'/> " +
        "<attribute name='new_documento'/> " +
        "<attribute name='new_operacion'/> " +
        "<attribute name='statuscode'/> " +
        "<attribute name='new_fechadevencimiento'/> " +
        "<attribute name='new_vinculocompartido'/> " +
        "<order attribute ='new_name' descending='false' />" +
        "<link-entity name='new_operacion' from='new_operacionid' to='new_operacion' link-type='inner' alias='operacion'>" +
        "<filter type='and'>" +
        "<condition attribute='new_socioparticipe' operator='eq' value='" + accoutid + "' />" +
        "</filter>" +
        "</link-entity>" +
        "<link-entity name='new_documentacion' from='new_documentacionid' to='new_documento' link-type='outer' alias='documento'>" +
        "<attribute name='new_urlplantilla'/> " +
        "<attribute name='new_descripcion'/> " +
        "</link-entity>" +
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
                    type: TODAS_DOCUMENTOSDEOP_EXITO,
                    payload: response.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_OPERACIONES,
            loading: false
        })
    }
}

export const obtenerDocumentosPorID = (notaid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_DOCUMENTOSXID,
        documentosXID: []
    })

    var entidad = "annotations"
    var fetch = "<fetch mapping='logical'>" +
        "<entity name='annotation'>" +
        "<attribute name='annotationid'/> " +
        "<attribute name='subject'/> " +
        "<attribute name='filename'/> " +
        "<attribute name='objectid'/> " +
        "<order attribute ='filename' descending='false' />" +
        "<filter type='and'>" +
        "<condition attribute='annotationid' operator='eq' value='" + notaid + "' />" +
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
                    type: DOCUMENTOSXID_EXITO,
                    payload: response.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR_OPERACIONES,
            loading: false
        })
    }
}

export const cargarOperacion = (operacion, cuenta_id, token) => async (dispatch) => {
    dispatch({
        type: LOADING_CARGAOPERACION,
        payload: "LOADING"
    })

    try {
        const cargaOP = () => new Promise(async (resolve, reject) => {
            axios.post(`${UrlApi}/api/socioparticipe/operaciones`,
                {
                    "new_socioparticipe": cuenta_id,
                    "new_tipooperacin": (operacion.tipoDeOperacion != '') ? parseInt(operacion.tipoDeOperacion) : 0,
                    "new_tipodecheque": (operacion.formatoDelCheque != '') ? parseInt(operacion.formatoDelCheque) : 0,
                    "new_destinodefondo": operacion.destionDeFondos.value,
                    "new_acreedor": operacion.acreedor.value
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
                .then((data) => {
                    dispatch({
                        type: CARGAOP,
                        payload: "EXITO"
                    })
                    return resolve(data)
                })
                .catch((error) => {
                    dispatch({
                        type: CARGAOP,
                        payload: "ERROR"
                    })
                    return reject(error)
                })
        })

        const response = await toast.promise(
            cargaOP,
            {
                pending: 'Procesando...',
                success: 'Operación creada con exito',
                error: {
                    render({ data }) {
                        return `Error al crear operacion, pongase en contacto con mesa de ayuda`
                    }
                }
            },
            {
                theme: "dark",
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        )
    } catch (err) {
        crearExcepcion(`Excepcion al crear operación`, token)
    }
}

export const cargarGarantiaPromise2 = (garantia, cuenta_id, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let librador = null;

            if (garantia.cuitLibrador !== "" && garantia.razonSocialLibrador !== "") {
                librador = {
                    new_cuitlibrador: garantia.cuitLibrador,
                    new_name: garantia.razonSocialLibrador,
                };
            }

            const response = await axios.post(
                `${UrlApi}api/socioparticipe/cargargarantia`,
                {
                    new_socioparticipe: cuenta_id,
                    new_tipodeoperacion: garantia.tipoDeOperacion !== "" ? parseInt(garantia.tipoDeOperacion) : 0,
                    new_monto: garantia.montoBruto,
                    new_formatodelcheque: garantia.formatoDelCheque !== "" ? parseInt(garantia.formatoDelCheque) : 0,
                    new_numerodecheque: garantia.numeroCheque,
                    new_acreedor: garantia?.acreedor?.value,
                    new_tipochpd: garantia.tipoCHPD ? garantia.tipoCHPD : 0,
                    librador: librador,
                    new_fechadevencimiento: garantia.fechaVencimiento ? moment(garantia.fechaVencimiento).format("YYYY-MM-DD") : "",
                    new_tasa: garantia?.tasa ? parseInt(garantia?.tasa) : 0,
                    new_plazodias: garantia?.plazoDias ? garantia?.plazoDias : 0,
                    new_periodogracia: garantia?.plazoGracia ? garantia?.plazoGracia : 0,
                    new_sistemadeamortizacion: garantia?.sistemaAmortizacion ? parseInt(garantia?.sistemaAmortizacion) : 0,
                    new_periodicidadpagos: garantia?.periocidadDePago ? parseInt(garantia?.periocidadDePago) : 0,
                    new_observaciones: garantia?.observaciones,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            resolve(response.data); // Éxito
        } catch (err) {
            reject(err); // Error
        }
    });
};

export const cargarGarantiaPromise = (garantia, cuenta_id, token, toastCustom) => async (dispatch) => {
    try {
        debugger
        let librador = null;

        if (garantia.cuitLibrador !== "" && garantia.razonSocialLibrador !== "") {
            librador = {
                new_cuitlibrador: garantia.cuitLibrador,
                new_name: garantia.razonSocialLibrador,
            };
        }

        const response = await toastCustom.promise(
            axios.post(
                `${UrlApi}api/socioparticipe/cargargarantia`,
                {
                    new_socioparticipe: cuenta_id,
                    new_tipodeoperacion: garantia.tipoDeOperacion !== "" ? parseInt(garantia.tipoDeOperacion) : 0,
                    new_monto: garantia.montoBruto,
                    new_formatodelcheque: garantia.formatoDelCheque !== "" ? parseInt(garantia.formatoDelCheque) : 0,
                    new_numerodecheque: garantia.numeroCheque,
                    new_acreedor: garantia?.acreedor?.value,
                    new_tipochpd: garantia.tipoCHPD ? garantia.tipoCHPD : 0,
                    librador: librador,
                    new_fechadevencimiento: garantia.fechaVencimiento ? moment(garantia.fechaVencimiento).format("YYYY-MM-DD") : "",
                    new_tasa: garantia?.tasa ? parseInt(garantia?.tasa) : 0,
                    new_plazodias: garantia?.plazoDias ? garantia?.plazoDias : 0,
                    new_periodogracia: garantia?.plazoGracia ? garantia?.plazoGracia : 0,
                    new_sistemadeamortizacion: garantia?.sistemaAmortizacion ? parseInt(garantia?.sistemaAmortizacion) : 0,
                    new_periodicidadpagos: garantia?.periocidadDePago ? parseInt(garantia?.periocidadDePago) : 0,
                    new_observaciones: garantia?.observaciones,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ),
            {
                loading: "Cargando...",
                success: "Proceso exitoso.",
                error: "Error al cargar la carantia.",
            }
        );

    } catch (error) {
        debugger
        console.log(error); // Lanzar la excepción para manejarla en createDocuXcuenta
    }
};

export const cargarGarantia = (garantia, cuenta_id, token) => async (dispatch) => {
    dispatch({
        type: LOADING_CARGAGARANTIA,
        payload: "LOADING",
        garantia: ''
    })
    try {
        var librador = null
        if (garantia.cuitLibrador != '' && garantia.razonSocialLibrador != '') {
            librador = {
                "new_cuitlibrador": garantia.cuitLibrador,
                "new_name": garantia.razonSocialLibrador
            }
        }
        await toast.promise(axios.post(`${UrlApi}api/socioparticipe/cargargarantia`,
            {
                "new_socioparticipe": cuenta_id,
                "new_tipodeoperacion": garantia.tipoDeOperacion != '' ? parseInt(garantia.tipoDeOperacion) : 0,
                "new_monto": garantia.montoBruto,
                "new_formatodelcheque": garantia.formatoDelCheque != '' ? parseInt(garantia.formatoDelCheque) : 0,
                "new_numerodecheque": garantia.numeroCheque,
                "new_acreedor": garantia?.acreedor?.value,
                "new_tipochpd": garantia.tipoCHPD ? garantia.tipoCHPD : 0,
                "librador": librador,
                "new_fechadevencimiento": garantia.fechaVencimiento ? moment(garantia.fechaVencimiento).format("YYYY-MM-DD") : '',
                "new_tasa": garantia?.tasa ? parseInt(garantia?.tasa) : 0,
                "new_plazodias": garantia?.plazoDias ? garantia?.plazoDias : 0,
                "new_periodogracia": garantia?.plazoGracia ? garantia?.plazoGracia : 0,
                "new_sistemadeamortizacion": garantia?.sistemaAmortizacion ? parseInt(garantia?.sistemaAmortizacion) : 0,
                "new_periodicidadpagos": garantia?.periocidadDePago ? parseInt(garantia?.periocidadDePago) : 0,
                "new_observaciones": garantia?.observaciones,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ), {
            loading: "Cargando...",
            success: (data) => {
                dispatch({
                    type: CARGAGARANTIA,
                    payload: "EXITO",
                    garantia: data.data
                })
                return 'Proceso exitoso.';
            },
            error: (error) => {
                dispatch({
                    type: CARGAGARANTIA,
                    payload: "ERROR"
                })
                return `Error al crear garantía, por favor ponerse en contacto con la SGR. ${error}`;
            }
        });

    } catch (err) {
        dispatch({
            type: CARGAGARANTIA,
            payload: "ERROR"
        })
        crearExcepcion(`Excepcion al crear garantía` + err, token)
    }
}

// const cargaGarantia = () => new Promise(async (resolve, reject) => {
//     var librador = null
//     if (garantia.cuitLibrador != '' && garantia.razonSocialLibrador != '') {
//         librador = {
//             "new_cuitlibrador": garantia.cuitLibrador,
//             "new_name": garantia.razonSocialLibrador
//         }
//     }
//     axios.post(`${UrlApi}/api/socioparticipe/garantia`,
//         {
//             "new_socioparticipe": cuenta_id,
//             "new_tipodeoperacion": garantia.tipoDeOperacion != '' ? parseInt(garantia.tipoDeOperacion) : 0,
//             "new_monto": garantia.montoBruto,
//             "new_formatodelcheque": garantia.formatoDelCheque != '' ? parseInt(garantia.formatoDelCheque) : 0,
//             "new_numerodecheque": garantia.numeroCheque,
//             "new_acreedor": garantia?.acreedor?.value,
//             "new_tipochpd": garantia.tipoCHPD ? garantia.tipoCHPD : 0,
//             "librador": librador,
//             "new_fechadevencimiento": garantia.fechaVencimiento ? moment(garantia.fechaVencimiento).format("YYYY-MM-DD") : '',
//             "new_tasa": garantia?.tasa ? parseInt(garantia?.tasa) : 0,
//             "new_plazodias": garantia?.plazoDias ? garantia?.plazoDias : 0,
//             "new_periodogracia": garantia?.plazoGracia ? garantia?.plazoGracia : 0,
//             "new_sistemadeamortizacion": garantia?.sistemaAmortizacion ? parseInt(garantia?.sistemaAmortizacion) : 0,
//             "new_periodicidadpagos": garantia?.periocidadDePago ? parseInt(garantia?.periocidadDePago) : 0,
//             "new_observaciones": garantia?.observaciones,
//         },
//         {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         }
//     )
//         .then((data) => {
//             dispatch({
//                 type: CARGAGARANTIA,
//                 payload: "EXITO",
//                 garantia: data.data
//             })
//             return resolve(data)
//         })
//         .catch((error) => {
//             dispatch({
//                 type: CARGAGARANTIA,
//                 payload: "ERROR"
//             })
//             return reject(error)
//         })
// })

// const response = await toast.promise(
//     cargaGarantia,
//     {
//         pending: 'Procesando...',
//         success: 'Garantía creada con exito',
//         error: {
//             render({ data }) {
//                 return `Error al crear garantia, por favor ponerse en contacto con la SGR`
//             }
//         }
//     },
//     {
//         theme: "dark",
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//     }
// )

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

export const cargarDocumentacionPorOperacion = (file, operacionid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_CARGADOCUMENTO,
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
        await toast.promise(axios.post(`${UrlApi}api/socioparticipe/documentacionporoperacion?operacion_id=${operacionid}`,
            file, configDocumentos), {
            loading: "Cargando...",
            success: (data) => {
                dispatch({
                    type: CARGA_DOCUMENTOXOPERACION,
                    cargaDocumento: 'EXITO',
                    documentoid: data.data
                })
                return 'Proceso exitoso.';
            },
            error: (error) => {
                dispatch({
                    type: CARGA_DOCUMENTOXOPERACION_ERROR,
                    cargaDocumento: 'ERROR',
                    documentoid: ''
                })
                return `Error al cargar documento. ${error}`;
            }
        });
    } catch (err) {
        dispatch({
            type: CARGA_DOCUMENTOXOPERACION_ERROR,
            cargaDocumento: 'ERROR',
            documentoid: ''
        })
        crearExcepcion(`Excepcion al subir documento` + err, token)
    }
}

export const limpiarCargaDocumento = () => (dispatch) => {
    dispatch({
        type: LIMPIAR_CARGA_DOCUMENTO,
        cargaDocumento: ''
    })
}

export const refreshOperaciones = (refresh = false) => (dispatch) => {
    dispatch({
        type: ACTUALIZAR_REFRESH_OPERACIONES,
        refreshOperaciones: refresh
    })
}