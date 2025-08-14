import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cargarDocumentacionPorCuenta, obtenerDocumentosPorCuenta } from "@/redux/CarpetaDigital";
import moment from "moment";

const useGetDocumentacionPorCuenta = () => {
  const dispatch = useDispatch();
  const { token, referido } = useContext(AuthContext);
  const [loadingDocumentacion, setLoadingDocumentacion] = useState(false);
  const [carpetas, setCarpetas] = useState([]);

  useEffect(() => {
    if (token && referido) llamarFetch(token, referido);
  }, [token, referido]);
  
  const llamarFetch = (token, referido) => {
    dispatch(obtenerDocumentosPorCuenta(referido?.accountid, token)).then(({ data, loadingDocumentos }) => {
      if (data.length > 0 && loadingDocumentos) {
        const array = data?.filter(item => item.new_visibleenportal == null || item.new_visibleenportal == true).map((item) => ({
          createdon: item.createdon,
          id: item.new_documentacionporcuentaid,
          new_documentacionporcuentaid: item.new_documentacionporcuentaid,
          new_fechadevencimiento: item["new_fechadevencimiento"]
            ? moment(new Date(item["new_fechadevencimiento"])).format("DD/MM/yyyy")
            : "",
          new_fechadevencimiento_value: item["new_fechadevencimiento"],
          new_name: item.new_name,
          new_vinculocompartido: item.new_vinculocompartido,
          new_visibleenportal: item.new_visibleenportal,
          statuscode: item.statuscode,
          statuscodeNOMBRE: item["statuscode@OData.Community.Display.V1.FormattedValue"],
          _new_cuentaid_value: item["_new_cuentaid_value@OData.Community.Display.V1.FormattedValue"],
          utilidades: {
            id: item.new_documentacionporcuentaid,
            new_vinculocompartido: item.new_vinculocompartido,
            new_urlplantilla: item["documentos.new_urlplantilla"],
            new_descripcion: item["documentos.new_descripcion"],
            new_name: item.new_name,
          },
        }));

        setCarpetas(array);
        setLoadingDocumentacion(loadingDocumentos);
      } else if (data.length === 0 && loadingDocumentos) {
        setCarpetas([]);
        setLoadingDocumentacion(loadingDocumentos);
      }
    });
  };

  const createDocuXcuenta = async (formData, token, id, toast) => {
    try {
      dispatch(cargarDocumentacionPorCuenta(formData, token, id, toast)).then(() => {
        llamarFetch(token, referido);
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const LimpiarDocumentacionPorCuenta = () => {
    setCarpetas([]);
    setLoadingDocumentacion(false);
  };

  return { carpetas, loadingDocumentacion, LimpiarDocumentacionPorCuenta, createDocuXcuenta };
};

export default useGetDocumentacionPorCuenta;
