import axios from 'axios'
import { Entidad, UrlApiDynamics, UrlApi } from '../keys'
import toast from 'react-hot-toast';
import moment from 'moment/moment';

const dataInicial = {
    loading: false,
    relaciones: [],
    CreacionDatos: '',
    edicionDatos: '',
    InactivacionDatos: '',
    relacionesFetch: [],
    inactivar: '',
    loadingRelaciones: false,
    loadingRelacion: false,
    retrieveRelaciones: false
}

const RELACIONES_EXITO = 'RELACIONES_EXITO'
const RELACIONES_FETCH_EXITO = 'RELACIONES_FETCH_EXITO'
const INACTIVAR_CUENTA = 'INACTIVAR_CUENTA'
const CREAR_CUENTA = 'CREAR_CUENTA'
const LOADING = "LOADING"
const LOADING_RELACIONES = "LOADING_RELACIONES"
const ERROR = 'ERROR'
const EDITAR_RELACION = 'EDITAR_RELACION'
const ELIMINAR_RELACION = 'ELIMINAR_RELACION'
const LOADING_RELACION = 'LOADING_RELACION'
const LOADING_INACTIVACION_RELACION = 'LOADING_INACTIVACION_RELACION'
const ERROR_RELACION = 'ERROR_RELACION'
const ERROR_INACTIVACION = 'ERROR_INACTIVACION'
const LIMPIAR_RELACIONES = 'LIMPIAR_RELACIONES'

export default function relacionesReducers(state = dataInicial, action) {
    switch (action.type) {
        case RELACIONES_EXITO:
            return { ...state, relaciones: action.payload, loadingRelaciones: action.loadingRelaciones, retrieveRelaciones: action.retrieveRelaciones }
        case RELACIONES_FETCH_EXITO:
            return { ...state, relacionesFetch: action.payload, loading: action.loading, retrieveRelaciones: action.retrieveRelaciones }
        case EDITAR_RELACION:
            return { ...state, edicionDatos: action.edicionDatos }
        case ELIMINAR_RELACION:
            return { ...state, inactivar: action.inactivar }
        case LOADING_INACTIVACION_RELACION:
            return { ...state, inactivar: action.inactivar }
        case ERROR_INACTIVACION:
            return { ...state, inactivar: action.inactivar }
        case INACTIVAR_CUENTA:
            return { ...state, InactivacionDatos: action.InactivacionDatos }
        case LOADING_RELACIONES:
            return { ...state, loadingRelaciones: action.loadingRelaciones, retrieveRelaciones: action.retrieveRelaciones }
        case LOADING_RELACION:
            return { ...state, loadingRelacion: action.loadingRelacion, CreacionDatos: action.CreacionDatos }
        case CREAR_CUENTA:
            return { ...state, CreacionDatos: action.CreacionDatos, loadingRelacion: action.loadingRelacion }
        case ERROR_RELACION:
            return { ...state, loadingRelacion: action.loadingRelacion, CreacionDatos: action.CreacionDatos }
        case ERROR:
            return { ...state, loadingRelaciones: action.loadingRelaciones, retrieveRelaciones: action.retrieveRelaciones }
        case LIMPIAR_RELACIONES:
            return { ...state, relacionesFetch: [], loading: false, retrieveRelaciones: false }
        default:
            return { ...state }
    }
}

export const obtenerRelaciones = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_RELACIONES,
        loadingRelaciones: true
    })
    var entidad = "new_participacionaccionarias"
    var fetch = "<fetch mapping='logical' distinct='false'>" +
        "<entity name='new_participacionaccionaria'>" +
        "<attribute name='new_name' />" +
        "<attribute name='new_participacionaccionariaid'/>" +
        "<attribute name='new_cuentacontactovinculado'/> " +
        "<attribute name='new_tipoderelacion'/> " +
        "<attribute name='statecode'/> " +
        "<attribute name='new_porcentajedeparticipacion'/> " +
        "<attribute name='new_porcentajebeneficiario'/> " +
        "<attribute name='new_cargo' />" +
        "<filter type='and'>" +
        "<condition attribute='statecode' operator='eq' value='0' />" +
        "<condition attribute='new_cuentaid' operator='eq' value='" + accountid + "' />" +
        "</filter>" +
        "<link-entity name='contact' from='contactid' to='new_cuentacontactovinculado' link-type='outer' alias='ab'>" +
        "<attribute name='new_personaexpuestapoliticamente'/>" +
        "<attribute name='new_cargofuncinjerarquayenteendondetrabaja'/>" +
        "<attribute name='contactid'/> " +
        "<attribute name='statuscode'/>" +
        "<attribute name='address3_stateorprovince'/> " +
        "<attribute name='address1_stateorprovince'/>" +
        "<attribute name='address3_country'/> " +
        "<attribute name='address1_country'/>" +
        "<attribute name='new_nrodedocumento'/>" +
        "<attribute name='firstname'/> " +
        "<attribute name='birthdate'/> " +
        "<attribute name='familystatuscode'/>" +
        "<attribute name='new_cuitcuil'/> " +
        "<attribute name='emailaddress1'/>" +
        "<attribute name='lastname'/> " +
        "<attribute name='address3_line1'/>" +
        "<attribute name='address3_postalcode'/> " +
        "<attribute name='address3_city'/>" +
        "<attribute name='address1_line1'/>" +
        "<attribute name='address1_postalcode'/> " +
        "<attribute name='address1_city'/>" +
        "<attribute name='new_einss'/> " +
        "<attribute name='new_tipodedocumentoconyuge'/> " +
        "<attribute name='new_generodelconyuge'/>" +
        "<attribute name='new_conyugetrabaja'/> " +
        "<attribute name='spousesname'/> " +
        "<attribute name='new_tiposujetoobligado'/> " +
        "<attribute name='new_lugardenacimiento'/> " +
        "<attribute name='new_paisdeorgen'/> " +
        "<attribute name='new_pais'/> " +
        "<attribute name='new_profesionoficioactividad'/> " +
        "<attribute name='telephone1'/> " +
        "<attribute name='new_correoelectrnicopararecibirestadodecuenta'/>" +
        "<attribute name='emailaddress1'/> " +
        "</link-entity>" +
        "<link-entity name='account' from='accountid' to='new_cuentacontactovinculado' link-type='outer' alias='aa'>" +
        "<attribute name='name'/> " +
        "<attribute name='emailaddress1'/> " +
        "<attribute name='new_nmerodedocumento'/> " +
        "<attribute name='emailaddress1'/> " +
        "<attribute name='new_personeria'/> " +
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
                    type: RELACIONES_EXITO,
                    payload: response.data,
                    loadingRelaciones: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (error) {
        dispatch({
            type: ERROR,
            loadingRelaciones: false
        })
    }


    // var fetch = "<fetch mapping='logical'>" +
    //     "<attribute name='new_name'/> " +
    //     "<entity name='new_participacionaccionaria'>" +
    //     "<attribute name='new_participacionaccionariaid'/>" +
    //     "<attribute name='new_cuentacontactovinculado'/> " +
    //     "<attribute name='new_tipoderelacion'/> " +
    //     "<attribute name='statecode'/> " +
    //     "<attribute name='new_porcentajedeparticipacion'/> " +
    //     "<attribute name='new_porcentajebeneficiario'/> " +
    //     "<attribute name='new_cargo' />" +
    //     "<filter type='and'>" +
    //     "<condition attribute='statecode' operator='eq' value='0' />" +
    //     "<condition attribute='new_cuentaid' operator='eq' value='" + accountid + "' />" +
    //     "</filter>" +
    //     "<link-entity name='contact' from='contactid' to='new_cuentacontactovinculado' link-type='outer' alias='ab'>" +
    //     "<attribute name='new_personaexpuestapoliticamente'/>" +
    //     "<attribute name='new_cargofuncinjerarquayenteendondetrabaja'/>" +
    //     "<attribute name='contactid'/> " +
    //     "<attribute name='new_fechaultimavalidacionidentidadrenaper'/>" +
    //     "<attribute name='new_resultadoultimavalidacionidentidadrenaper'/>" +
    //     "<attribute name='new_entedondetrabaja'/> " +
    //     "<attribute name='new_relacinconlapersonaexpuestapolticamente'/>" +
    //     "<attribute name='new_fechadealtabaja'/> " +
    //     "<attribute name='new_fechadebaja'/> " +
    //     "<attribute name='new_tienedomiciliofiscalenelexterior'/>" +
    //     "<attribute name='new_tienedomicilioenusa'/> " +
    //     "<attribute name='statuscode'/>" +
    //     "<attribute name='address3_stateorprovince'/> " +
    //     "<attribute name='address1_stateorprovince'/>" +
    //     "<attribute name='address3_country'/> " +
    //     "<attribute name='address1_country'/>" +
    //     "<attribute name='new_nrodedocumentoconyuge'/> " +
    //     "<attribute name='new_nrodedocumento'/>" +
    //     "<attribute name='firstname'/> " +
    //     "<attribute name='new_nit'/>" +
    //     "<attribute name='birthdate'/> " +
    //     "<attribute name='familystatuscode'/>" +
    //     "<attribute name='new_cuitcuil'/> " +
    //     "<attribute name='emailaddress1'/>" +
    //     "<attribute name='lastname'/> " +
    //     "<attribute name='address3_line1'/>" +
    //     "<attribute name='address3_postalcode'/> " +
    //     "<attribute name='address3_city'/>" +
    //     "<attribute name='address1_line1'/>" +
    //     "<attribute name='address1_postalcode'/> " +
    //     "<attribute name='address1_city'/>" +
    //     "<attribute name='new_einss'/> " +
    //     "<attribute name='new_tipodedocumentoconyuge'/> " +
    //     "<attribute name='new_generodelconyuge'/>" +
    //     "<attribute name='new_conyugetrabaja'/> " +
    //     "<attribute name='spousesname'/> " +
    //     "<attribute name='new_tiposujetoobligado'/> " +
    //     "<attribute name='new_lugardenacimiento'/> " +
    //     "<attribute name='new_paisdeorgen'/> " +
    //     "<attribute name='new_pais'/> " +
    //     "<attribute name='new_profesionoficioactividad'/> " +
    //     "<attribute name='telephone1'/> " +
    //     "<attribute name='new_correoelectrnicopararecibirestadodecuenta'/> " +
    //     "<attribute name='new_paisresidenciafiscalenelexterior'/> " +
    //     "</link-entity>" +
    //     "<link-entity name='account' from='accountid' to='new_cuentacontactovinculado' link-type='outer' alias='aa'>" +
    //     "<attribute name='name'/> " +
    //     "<attribute name='emailaddress1'/> " +
    //     "<attribute name='new_nmerodedocumento'/> " +
    //     "<attribute name='emailaddress1'/> " +
    //     "<attribute name='new_personeria'/> " +
    //     "</link-entity>" +
    //     "</entity>" +
    //     "</fetch>";

    // const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)

    // dispatch({
    //     type: RELACIONES_EXITO,
    //     payload: response.data
    // })
}

export const CrearRelacion = (accountid, tipo, cuitCuil = "", nombre = "", apellido = "", razonSocial = "",
    vinculado = "", tipoRelacion = "", porcentajeParticipacion = "", relacionAccionaria = "", porcentajeBeneficiario = "",
    cargo = "", descripcion = "", dni = "", fechaNacimiento = "", lugarNacimiento = "", correo = "", estadoCivil = "", nombreConyuge = "", dniConyuge = "", domicilioExterior = "", domicilioUSA = "", direccion = "",
    cp = "", ciudad = "", provincia = "", pais = "", ein = "", nit = "", id = "", tipoCarga = "", relacionid = "", estado = "",
    personaPolitica = "", funcion = "", ente = "", relacionPersona = "", fechaAlta = "", fechaBaja = "", tipoDocumentoC = "",
    generoC = "", trabajaC = "", tipoSujeto = "", profesion = "", telefonoLaboral = "", correoCuenta = "") => async (dispatch) => {
        dispatch({
            type: LOADING,
            CreacionDatos: 'LOADING'
        })

        try {
            const enviarCreacionRelacion = async () => {
                let tipoDoc = ""
                let sexo = ""
                let sujeto = ""
                let Pais = ""

                if (tipoDocumentoC !== undefined) {
                    tipoDoc = tipoDocumentoC.value
                }
                if (generoC !== undefined) {
                    sexo = generoC.value
                }
                if (tipoSujeto !== undefined) {
                    sujeto = tipoSujeto.value
                }
                if (pais !== undefined) {
                    Pais = pais.value
                }

                const response = await axios.post(`${UrlApiDynamics}Relacionesvinculacion?accountid=${accountid}&accionistas=${null}&tipo=${tipo}&cuitCuil=${cuitCuil}
                &nombre=${nombre}&apellido=${apellido}&razonSocial=${razonSocial}&vinculado=${vinculado.value}&tipoRelacion=${tipoRelacion}&porcentajeParticipacion=${porcentajeParticipacion}&relacionAccionaria=${relacionAccionaria}
                &porcentajeBeneficiario=${porcentajeBeneficiario}&cargo=${cargo}&descripcion=${descripcion}&dni=${dni}&fechaNacimiento=${fechaNacimiento}&lugarNacimiento=${lugarNacimiento}&correo=${correo}
                &estadoCivil=${estadoCivil}&nombreConyuge=${nombreConyuge}&dniConyuge=${dniConyuge}&domicilioExterior=${domicilioExterior}&domicilioUSA=${domicilioUSA}&direccion=${direccion}&cp=${cp}
                &ciudad=${ciudad}&provincia=${provincia}&pais=${Pais}&ein=${ein}&nit=${nit}&cuentaContactoID=${id}&tipoCarga=${tipoCarga}&relacionid=${relacionid}&estado=${estado}
                &personaPolitica=${personaPolitica}&funcion=${funcion}&ente=${ente}&relacionPersonaExpuesta=${relacionPersona}&fechaAlta=${fechaAlta}&fechaBaja=${fechaBaja}
                &tipoDocumentoC=${tipoDoc}&generoC=${sexo}&trabajaC=${trabajaC}&tipoSujeto=${sujeto}&profesion=${profesion}&telefonoLaboral=${telefonoLaboral}
                &correoCuenta=${correoCuenta}&cuit=${Entidad}`)
                dispatch({
                    type: CREAR_CUENTA,
                    payload: response.data,
                    CreacionDatos: 'EXITO'
                })
            }

            const respuesta = await toast.promise(
                enviarCreacionRelacion,
                {
                    pending: 'Cargando...',
                    success: 'Relación cargada con éxito 🤝',
                    error: {
                        render({ data }) {
                            return `${data}`
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
        } catch (error) {
            dispatch({
                type: ERROR,
                CreacionDatos: 'ERROR'
            })
        }
    }


export const crearRelacionVinculacion = (objeto, accountid, esFirmante, token, toastCustom) => async (dispatch) => {
    dispatch({
        type: LOADING_RELACION,
        loadingRelacion: true,
        CreacionDatos: 'LOADING',
    })
    try {
        debugger
        const { tipo, tipoRelacion, razonSocial, Nombre, Apellido, CUITCUIL, DNI, fecha, lugarNacimiento, correo, correo2,
            cargo, porcentaje, porcentajeParticipacion, Observaciones, relacion } = objeto

        var cuenta = null
        var contacto = null
        var porcentajeParticipacionNumero = porcentajeParticipacion ? parseInt(porcentajeParticipacion) : 0;
        var tipoDeRelacion = tipoRelacion ? parseInt(tipoRelacion) : null
        var cuitCuil = CUITCUIL ? CUITCUIL.toString() : ""
        if (tipo?.value === 'Humana') {
            contacto = {
                "contactid": accountid,
                "firstname": Nombre,
                "lastname": Apellido,
                "new_cuitcuil": CUITCUIL,
                "new_nrodedocumento": DNI ? DNI : 0,
                "emailaddress1": correo,
                "birthdate": fecha ? moment(fecha).format("DD-MM-YYYY") : "",
                "new_lugardenacimiento": lugarNacimiento,
                "new_correoelectrnicopararecibirestadodecuenta": correo2,
            }
        } else {
            cuenta = {
                "accountid": accountid,
                "name": razonSocial,
                "new_nmerodedocumento": cuitCuil,
                "emailaddress1": correo
            }
        }
        await toastCustom.promise(axios.post(`${UrlApi}api/socioparticipe/relaciondevinculacion`,
            {
                "new_participacionaccionariaid": "",
                "accountid": accountid,
                "new_tipoderelacion": tipoDeRelacion,
                "new_porcentajedeparticipacion": porcentajeParticipacionNumero,
                "new_observaciones": Observaciones,
                "new_porcentajebeneficiario": porcentaje,
                "new_cargo": cargo,
                "new_relacion": relacion?.value ? relacion.value.toString() : null,
                "cuenta": cuenta,
                "contacto": contacto,
                "esFirmante": esFirmante?.toString()
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ), {
            loading: "Cargando...",
            success: "Relación creada.",
            error: "Error al cargar la relación.",
            // success: (data) => {
            //     dispatch({
            //         type: CREAR_CUENTA,
            //         CreacionDatos: 'EXITO',
            //         loadingRelacion: false
            //     })
            //     return 'Proceso exitoso.';
            // },
            // error: (error) => {
            //     dispatch({
            //         type: ERROR,
            //         CreacionDatos: 'ERROR'
            //     })
            //     return `Error al crear relación. ${error}`;
            // }
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            CreacionDatos: 'ERROR'
        })
    }
}

export const editarRelacionVinculacion = (objeto, cuentaid, id, esFirmante, token, toastCustom) => async (dispatch) => {
    dispatch({
        type: LOADING_RELACION,
        loadingRelacion: true,
        CreacionDatos: 'LOADING',
    })
    try {
        const { tipo, tipoRelacion, razonSocial, Nombre, Apellido, CUITCUIL, DNI, fecha, lugarNacimiento, correo, correo2,
            ProfesionOficioActividad, telefonoLaboral, cargo, porcentaje, porcentajeParticipacion, Observaciones, contactid, accountid, relacion } = objeto
        debugger
        var cuenta = null
        var contacto = null
        var porcentajeParticipacionNumero = porcentajeParticipacion ? parseInt(porcentajeParticipacion) : 0;
        var fechaNacimiento = moment(fecha).format("YYYY-MM-DD")
        var cuitCuil = CUITCUIL ? CUITCUIL.toString() : ""

        if (tipo === 'Humana') {
            contacto = {
                "contactid": contactid,
                "firstname": Nombre,
                "lastname": Apellido,
                "new_cuitcuil": cuitCuil,
                "new_nrodedocumento": DNI ? DNI : 0,
                "emailaddress1": correo,
                "birthdate": fechaNacimiento,
                "new_lugardenacimiento": lugarNacimiento,
                "new_profesionoficioactividad": ProfesionOficioActividad,
                "new_correoelectrnicopararecibirestadodecuenta": correo2,
                "telephone1": telefonoLaboral
            }
        } else {
            cuenta = {
                "accountid": accountid,
                "name": razonSocial,
                "new_nmerodedocumento": cuitCuil,
                "emailaddress1": correo,
            }
        }
        debugger
        var tipoDeRelacion = tipoRelacion ? parseInt(tipoRelacion) : null
        await toastCustom.promise(axios.put(`${UrlApi}api/socioparticipe/relaciondevinculacion`,
            {
                "new_participacionaccionariaid": id,
                "accountid": cuentaid,
                "new_tipoderelacion": tipoDeRelacion,
                "new_porcentajedeparticipacion": porcentajeParticipacionNumero,
                "new_observaciones": Observaciones,
                "new_porcentajebeneficiario": porcentaje,
                "new_relacion": relacion?.value ? relacion.value.toString() : null,
                "new_cargo": cargo,
                "cuenta": cuenta,
                "contacto": contacto,
                "esFirmante": esFirmante?.toString()
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ), {
            loading: "Cargando...",
            success: "Relación actualizada.",
            error: "Error al actualizar la relación.",
            // success: () => {
            //     dispatch({
            //         type: CREAR_CUENTA,
            //         CreacionDatos: 'EXITO',
            //         loadingRelacion: false
            //     })
            //     return 'Proceso exitoso.';
            // },
            // error: (error) => {
            //     dispatch({
            //         type: ERROR_RELACION,
            //         CreacionDatos: 'ERROR',
            //         loadingRelacion: false
            //     })
            //     return `Error al actualizar relación. ${error}`;
            // }
        });
    } catch (error) {
        dispatch({
            type: ERROR_RELACION,
            CreacionDatos: 'ERROR',
            loadingRelacion: false
        })
    }
}

export const eliminarRelacionVinculacion = (id, token) => async (dispatch) => {
    dispatch({
        type: LOADING_INACTIVACION_RELACION,
        inactivar: "LOADING"
    })
    try {
        await toast.promise(axios.delete(`${UrlApi}api/socioparticipe/relaciondevinculacion?new_participacionaccionariaid=${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        ), {
            loading: "Cargando...",
            success: () => {
                dispatch({
                    type: ELIMINAR_RELACION,
                    inactivar: 'EXITO'
                })
                return 'Proceso exitoso.';
            },
            error: (error) => {
                dispatch({
                    type: ERROR_INACTIVACION,
                    inactivar: 'ERROR'
                })
                return `Error al inactivar relación. ${error}`;
            }
        });
    } catch (error) {
        dispatch({
            type: ERROR_INACTIVACION,
            inactivar: 'ERROR'
        })
    }
}

export const InactivarRelacion = (relacionid = "", estado = "") => async (dispatch) => {
    dispatch({
        type: LOADING,
        InactivacionDatos: 'LOADING'
    })

    try {
        const response = await axios.post(`${UrlApiDynamics}Relacionesvinculacion?relacionid=${relacionid}&estado=${estado}&cuit=${Entidad}`)
        dispatch({
            type: INACTIVAR_CUENTA,
            InactivacionDatos: 'EXITO'
        })
    } catch (error) {
        dispatch({
            type: ERROR,
            InactivacionDatos: 'ERROR'
        })
    }
}

export const obtenerRelacionesFETCH = (accountid, token) => async (dispatch) => {
    dispatch({
        type: LOADING_RELACIONES,
        loadingRelaciones: true,
        retrieveRelaciones: false
    })

    try {
        if (accountid != undefined) {

            var entidad = "new_participacionaccionarias"
            var fetch = "<fetch mapping='logical'>" +
                "<entity name='new_participacionaccionaria'>" +
                "<attribute name='new_participacionaccionariaid'/>" +
                "<attribute name='new_cuentacontactovinculado'/> " +
                "<attribute name='new_tipoderelacion'/> " +
                "<attribute name='new_porcentajedeparticipacion'/> " +
                "<attribute name='statecode'/> " +
                "<attribute name='new_cargo'/> " +
                "<attribute name='new_porcentajebeneficiario'/> " +
                "<attribute name='new_observaciones'/> " +
                "<attribute name='new_firmante'/> " +
                "<attribute name='new_relacion'/> " +
                "<filter type='and'>" +
                "<condition attribute='new_cuentaid' operator='eq' value='" + accountid + "' />" +
                "</filter>" +
                "<link-entity name='contact' from='contactid' to='new_cuentacontactovinculado' link-type='outer' alias='ab'>" +
                "<attribute name='new_personaexpuestapoliticamente'/>" +
                "<attribute name='new_cargofuncinjerarquayenteendondetrabaja'/>" +
                "<attribute name='contactid'/> " +
                "<attribute name='statuscode'/>" +
                "<attribute name='address3_stateorprovince'/> " +
                "<attribute name='address1_stateorprovince'/>" +
                "<attribute name='address3_country'/> " +
                "<attribute name='address1_country'/>" +
                "<attribute name='new_nrodedocumento'/>" +
                "<attribute name='firstname'/> " +
                "<attribute name='birthdate'/> " +
                "<attribute name='familystatuscode'/>" +
                "<attribute name='new_cuitcuil'/> " +
                "<attribute name='emailaddress1'/>" +
                "<attribute name='lastname'/> " +
                "<attribute name='address3_line1'/>" +
                "<attribute name='address3_postalcode'/> " +
                "<attribute name='address3_city'/>" +
                "<attribute name='address1_line1'/>" +
                "<attribute name='address1_postalcode'/> " +
                "<attribute name='address1_city'/>" +
                "<attribute name='new_einss'/> " +
                "<attribute name='new_tipodedocumentoconyuge'/> " +
                "<attribute name='new_generodelconyuge'/>" +
                "<attribute name='new_conyugetrabaja'/> " +
                "<attribute name='spousesname'/> " +
                "<attribute name='new_tiposujetoobligado'/> " +
                "<attribute name='new_lugardenacimiento'/> " +
                "<attribute name='new_paisdeorgen'/> " +
                "<attribute name='new_pais'/> " +
                "<attribute name='new_profesionoficioactividad'/> " +
                "<attribute name='telephone1'/> " +
                "<attribute name='new_correoelectrnicopararecibirestadodecuenta'/>" +
                "<attribute name='emailaddress1'/> " +
                "</link-entity>" +
                "<link-entity name='account' from='accountid' to='new_cuentacontactovinculado' link-type='outer' alias='aa'>" +
                "<attribute name='accountid'/> " +
                "<attribute name='name'/> " +
                "<attribute name='emailaddress1'/> " +
                "<attribute name='new_nmerodedocumento'/> " +
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
            // const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
            // dispatch({
            //     type: RELACIONES_FETCH_EXITO,
            //     payload: response.data,
            //     loading: false
            // })
        }
    } catch (error) {
        dispatch({
            type: ERROR,
            loadingRelaciones: false,
            retrieveRelaciones: false
        })
    }
}

export const LimpiarRelacionesFETCH = () => async (dispatch) => {

    dispatch({
        type: LIMPIAR_RELACIONES
    })
}

// Para validar un CUIT/CUIL según las especificaciones de AFIP, se puede seguir el siguiente procedimiento:

// Obtener el número de CUIT/CUIL a validar.
// Verificar que el número tenga 11 dígitos.
// Verificar que el primer dígito sea 2 (para CUIT) o 3 (para CUIL).
// Multiplicar cada dígito del número por un coeficiente preestablecido según su posición en el número.
// Sumar los resultados de las multiplicaciones.
// Dividir la suma obtenida en el paso anterior por 11.
// Tomar el residuo de la división en el paso anterior.
// Si el residuo es 0, entonces el CUIT/CUIL es válido. De lo contrario, se debe restar el residuo de 11 y comparar el resultado con el último dígito del número. Si son iguales, entonces el CUIT/CUIL es válido.

const validarCUIT = (numero) => {
    // Verificar que el número tenga 11 dígitos
    if (numero.length !== 11) {
        return false;
    }

    // Verificar que el primer dígito sea 2 (para CUIT) o 3 (para CUIL)
    var primerDigito = parseInt(numero.charAt(0));
    if (primerDigito !== 2 && primerDigito !== 3) {
        return false;
    }

    // Multiplicar cada dígito del número por un coeficiente preestablecido según su posición en el número
    var coeficientes = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    var suma = 0;
    for (var i = 0; i < 10; i++) {
        var digito = parseInt(numero.charAt(i));
        suma += digito * coeficientes[i];
    }

    // Dividir la suma obtenida por 11 y tomar el residuo
    var residuo = suma % 11;

    // Verificar si el CUIT/CUIL es válido
    if (residuo === 0) {
        return parseInt(numero.charAt(10)) === 0;
    } else {
        var ultimoDigito = parseInt(numero.charAt(10));
        var resultado = 11 - residuo;
        return resultado === ultimoDigito;
    }
}


//Esta función primero elimina cualquier guion presente en el CUIL. Luego verifica que el CUIL tenga 11 dígitos y que todos los caracteres sean dígitos. Después, verifica que el primer dígito sea 2, 3 o 4. A continuación, calcula el dígito verificador del CUIL mediante una fórmula específica y verifica que sea correcto. Finalmente, si todos los pasos anteriores se completaron sin errores, la función devuelve true para indicar que el CUIL es válido. De lo contrario, devuelve false.
const validarCUIL = (cuil) => {
    // Eliminar los guiones si los hay
    cuil = cuil.replace(/-/g, '');

    // Verificar que el CUIL tenga 11 dígitos
    if (cuil.length !== 11) {
        return false;
    }

    // Verificar que todos los caracteres sean dígitos
    if (!/^\d+$/.test(cuil)) {
        return false;
    }

    // Verificar que el primer dígito sea 2, 3 o 4
    var primerDigito = parseInt(cuil.charAt(0));
    if (primerDigito !== 2 && primerDigito !== 3 && primerDigito !== 4) {
        return false;
    }

    // Calcular el dígito verificador
    var acumulado = 0;
    var multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    for (var i = 0; i < 10; i++) {
        acumulado += parseInt(cuil.charAt(i)) * multiplicadores[i];
    }
    var digitoVerificador = 11 - (acumulado % 11);
    if (digitoVerificador === 11) {
        digitoVerificador = 0;
    }

    // Verificar que el dígito verificador sea correcto
    var ultimoDigito = parseInt(cuil.charAt(10));
    if (digitoVerificador !== ultimoDigito) {
        return false;
    }

    // Si llegamos hasta aquí, el CUIL es válido
    return true;
}