import axios from "axios";
import { Entidad, UrlApiDynamics, UrlApi } from "../keys";
// import { toast } from 'react-toastify';
import toast from "react-hot-toast";

const dataInicial = {
  loadingDocumentBody: false,
  documentos: [],
  cargaDocumento: "",
  documentoid: "",
  retrieveDocsExito: false,
  notaDescarga: [],
};

const CARGA_DOCUMENTOXCUENTA = "CARGA_DOCUMENTOXCUENTA";
const TODOS_DOCUMENTOXCUENTA_EXITO = "TODOS_DOCUMENTOXCUENTA_EXITO";
const LOADING_DOCUMENTOS = "LOADING_DOCUMENTOS";
const LOADING_TODOS_DOCUMENTOS = "LOADING_TODOS_DOCUMENTOS";
const ERROR = "ERROR";
const ERROR_DOCUMENTOS = "ERROR_DOCUMENTOS";
const LOADING_NOTADESCARGA = "LOADING_NOTADESCARGA";
const NOTADESCARGA_EXITO = "NOTADESCARGA_EXITO";
const NOTADESCARGA_ERROR = "NOTADESCARGA_ERROR";
const LIMPIAR_DOCUMENTACION = "LIMPIAR_DOCUMENTACION";

export default function carpetaDigitalReducers(state = dataInicial, action) {
  switch (action.type) {
    case ERROR:
      return { ...dataInicial, cargaDocumento: action.cargaDocumento };
    case LOADING_DOCUMENTOS:
      return { ...state, cargaDocumento: action.cargaDocumento };
    case LOADING_TODOS_DOCUMENTOS:
      return { ...state };
    case ERROR_DOCUMENTOS:
      return {
        ...dataInicial,
      };
    case TODOS_DOCUMENTOXCUENTA_EXITO:
      return {
        ...state,
      };
    case CARGA_DOCUMENTOXCUENTA:
      return { ...state, cargaDocumento: action.cargaDocumento, documentoid: action.documentoid };
    case LOADING_NOTADESCARGA:
      return { ...state, loadingDocumentBody: true };
    case NOTADESCARGA_EXITO:
      return { ...state, notaDescarga: action.payload, loadingDocumentBody: false };
    case NOTADESCARGA_ERROR:
      return { ...state, notaDescarga: [], loadingDocumentBody: false };
    case LIMPIAR_DOCUMENTACION:
      return { ...state };
    default:
      return { ...state };
  }
}

export const obtenerDocumentosPorCuenta = (accountid, token) => async (dispatch) => {
  dispatch({
    type: LOADING_TODOS_DOCUMENTOS,
  });

  try {
    const entidad = "new_documentacionporcuentas";
    const fetch =
      "<fetch mapping='logical' distinct='false'>" +
      "<entity name='new_documentacionporcuenta'>" +
      "<attribute name='statuscode' />" +
      "<attribute name='createdon' />" +
      "<attribute name='new_cuentaid' />" +
      "<attribute name='new_fechadevencimiento' />" +
      "<attribute name='new_name' />" +
      "<attribute name='new_vinculocompartido' />" +
      "<attribute name='new_documentacionporcuentaid' />" +
      "<attribute name='new_visibleenportal' />" +
      "<attribute name='new_documentoid' />" +
      "<order attribute='new_fechadevencimiento' descending='true' />" +
      "<order attribute='new_cuentaid' descending='false' />" +
      "<filter type='and'>" +
      "<condition attribute='statecode' operator='eq' value='0' />" +
      "<condition attribute='new_cuentaid' operator='eq'  uitype='account' value='" +
      accountid +
      "' />" +
      "</filter>" +
      "<link-entity name='new_documentacion' from='new_documentacionid' to='new_documentoid' link-type='outer' alias='documentos'>" +
      "<attribute name='new_urlplantilla'/> " +
      "<attribute name='new_name'/> " +
      "<attribute name='new_descripcion'/> " +
      "</link-entity>" +
      "</entity>" +
      "</fetch>";

    const response = await axios.post(
      `${UrlApi}api/consultafetch`,
      {
        entidad: entidad,
        fetch: fetch,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch({
      type: TODOS_DOCUMENTOXCUENTA_EXITO,
    });

    return { data: response.data, loadingDocumentos: true };

  } catch (error) {
    dispatch({
      type: ERROR_DOCUMENTOS,
    });

    return { data: [], loadingDocumentos: true };
  }
};

export const LimpiarDocumentosPorCuentaSelector = () => async (dispatch) => {
  dispatch({
    type: LIMPIAR_DOCUMENTACION,
  });
};

export const cargarDocumentacionPorCuenta = (file, token, documentoId, toastCustom) => async (dispatch) => {
  dispatch({
    type: LOADING_DOCUMENTOS,
    cargaDocumento: "LOADING",
  });

  try {
    const configDocumentos = {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    };

    const response = await toastCustom.promise(
      axios.post(
        `${UrlApi}api/socioparticipe/documentacionporcuenta?documentacionporcuenta_id=${documentoId}`,
        file,
        configDocumentos
      ),
      {
        loading: "Cargando...",
        success: "Proceso exitoso.",
        error: "Error al cargar archivo.",
      }
    );

    dispatch({
      type: CARGA_DOCUMENTOXCUENTA,
      cargaDocumento: "EXITO",
      documentoid: response.data,
    });
    
  } catch (error) {
    dispatch({
      type: ERROR,
      cargaDocumento: "ERROR",
    });
    throw error; // Lanzar la excepción para manejarla en createDocuXcuenta
  }
};

export const obtenerNotaADescargar = (notaid, token) => async (dispatch) => {
  dispatch({
    type: LOADING_NOTADESCARGA,
  });

  var entidad = "annotations";
  var fetch =
    "<fetch mapping='logical'>" +
    "<entity name='annotation'>" +
    "<attribute name='annotationid'/> " +
    "<attribute name='filename'/> " +
    "<attribute name='mimetype'/> " +
    "<attribute name='documentbody'/> " +
    "<filter type='and'>" +
    "<condition attribute='annotationid' operator='eq' value='" +
    notaid +
    "' />" +
    "</filter>" +
    "</entity>" +
    "</fetch>";
  try {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${UrlApi}api/consultafetch`,
          {
            entidad: entidad,
            fetch: fetch,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          // ToastError("Error al descargar archivo")
          reject(err);
        });
    });
  } catch (error) {
    // ToastError("Error al descargar archivo")
    dispatch({
      type: NOTADESCARGA_ERROR,
    });
  }
};
