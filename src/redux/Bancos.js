import axios from 'axios'
import { Entidad, UrlApiDynamics } from '../keys'
import { toast } from 'react-toastify';

const dataInicial = {
    loading: false,
    Bancos: [],
    BancosPorSocios: [],
    crearCuenta: '',
    modificarCuenta: '',
    inactivarCuenta: ''
}

const BANCOS_EXITO = 'BANCOS_EXITO'
const BANCOSXSOCIO_EXITO = 'BANCOSXSOCIO_EXITO'
const CREAR_CUENTA_EXITO = 'CREAR_CUENTA_EXITO'
const MODIFICAR_CUENTA_EXITO = 'MODIFICAR_CUENTA_EXITO'
const LOADING_CUENTA = "LOADING"
const LOADING_MODIFICAR_CUENTA = 'LOADING'
const INACTIVAR_CUENTA_EXITO = 'INACTIVAR_CUENTA_EXITO'
const ERROR = 'ERROR'
const LOADING = 'LOADING'

export default function bancosReducers(state = dataInicial, action) {
    switch (action.type) {
        case BANCOS_EXITO:
            return { ...state, Bancos: action.payload }
        case BANCOSXSOCIO_EXITO:
            return { ...state, BancosPorSocios: action.payload, crearCuenta: action.crearCuenta, modificarCuenta: action.modificarCuenta, inactivarCuentaMensaje: action.inactivarCuentaMensaje }
        case CREAR_CUENTA_EXITO:
            return { ...state, crearCuenta: action.crearCuenta }
        case MODIFICAR_CUENTA_EXITO:
            return { ...state, modificarCuenta: action.modificarCuenta }
        case LOADING_CUENTA:
            return { ...state, crearCuenta: action.crearCuenta }
        case LOADING_MODIFICAR_CUENTA:
            return { ...state, modificarCuenta: action.modificarCuenta }
        case INACTIVAR_CUENTA_EXITO:
            return { ...state, inactivarCuentaMensaje: action.inactivarCuentaMensaje }
        default:
            return { ...state }
    }
}

//Actions
export const obtenerBancos = () => async (dispatch) => {
    // dispatch({
    //     type: LOADING
    // })

    try {
        const response = await axios.get(`${UrlApiDynamics}Bancos?filter=&cuit=${Entidad}`)
        dispatch({
            type: BANCOS_EXITO,
            payload: response.data
        })
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const obtenerBancosXsocio = (accountid) => async (dispatch) => {
    dispatch({
        type: LOADING
    })

    try {
        var entidad = "new_bancosporsocios"
        var fetch = "<fetch mapping='logical' distinct='false'>" +
            "<entity name='new_bancosporsocio'>" +
            "<attribute name='new_bancosporsocioid' />" +
            "<attribute name='new_name' />" +
            "<attribute name='createdon' />" +
            "<attribute name='new_socio' />" +
            "<attribute name='new_cbu' />" +
            "<attribute name='new_banco' />" +
            "<attribute name='new_numerodecuenta' />" +
            "<order attribute='new_name' descending='false' />" +
            "<filter type='and'>" +
            "<condition attribute='statecode' operator='eq' value='0' />" +
            "<condition attribute='new_socio' operator='eq' uitype='account' value='" + accountid + "' />" +
            "</filter>" +
            "</entity>" +
            "</fetch>";


        const response = await axios.get(`${UrlApiDynamics}ConsultaFetch?Entidad=${entidad}&fetch=${fetch}&cuit=${Entidad}`)
        dispatch({
            type: BANCOSXSOCIO_EXITO,
            payload: response.data,
            crearCuenta: 'LOADING'
        })
    }
    catch (error) {
        dispatch({
            type: ERROR
        })
    }
}

export const CrearCuentaXsocio = (accountid, banco, cbu, nroCuenta = "") => async (dispatch) => {
    dispatch({
        type: LOADING_CUENTA,
        crearCuenta: 'LOADING'
    })
    try {
        const response = await axios.post(`${UrlApiDynamics}Bancosporsocio?socio=${accountid}&banco=${banco}&cbu=${cbu}&nroCuenta=${nroCuenta}&cuit=${Entidad}`)
        dispatch({
            type: CREAR_CUENTA_EXITO,
            crearCuenta: 'EXITO'
        })
        toast.success('Cuenta bancaria agregada con exito!', {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            crearCuenta: 'ERROR'
        })
        toast.error('La cuenta bancaria no se pudo agregar!', {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}


export const modificarCuentaxSocio = (accountid, bancoID, newCbu, numCuen, cuentaid) => async (dispatch) => {
    dispatch({
        type: LOADING_MODIFICAR_CUENTA,
        modificarCuenta: 'LOADING'
    })

    try {
        const response = await axios.post(`${UrlApiDynamics}Bancosporsocio?socio=${accountid}&banco=${bancoID}&cbu=${newCbu}&nroCuenta=${numCuen}&cuentaid=${cuentaid}&cuit=${Entidad}`)
        dispatch({
            type: MODIFICAR_CUENTA_EXITO,
            modificarCuenta: 'EXITO'
        })
    } catch (error) {
        dispatch({
            type: ERROR,
            modificarCuenta: 'ERROR'
        })
    }
}


export const inactivarCuenta = (accountid, bancoid, cbu, nroCuenta, cuentaid, estado) => async (dispatch) => {

    try {
        const response = await axios.post(`${UrlApiDynamics}Bancosporsocio?socio=${accountid}&banco=${bancoid}&cbu=${cbu}&nroCuenta=${nroCuenta}&cuentaid=${cuentaid}&estado=${estado}&cuit=${Entidad}`)
        dispatch({
            type: INACTIVAR_CUENTA_EXITO,
            inactivarCuentaMensaje: 'EXITO'
        })
        toast.success('Cuenta bancaria eliminada con exito!', {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } catch (error) {
        dispatch({
            type: ERROR,
            inactivarCuentaMensaje: 'ERROR'
        })
        toast.error('Ocurrio un error', {
            theme: "dark",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}