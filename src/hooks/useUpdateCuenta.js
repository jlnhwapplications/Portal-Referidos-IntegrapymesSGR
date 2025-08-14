import { AuthContext } from "@/context/AuthContext";
import {
    actualizarDatosCuenta,
} from '@/redux/Cuenta';
import { useContext } from "react";
import { useDispatch } from "react-redux";

const useUpdateCuenta = () => {
  const { token, referido, actualizarPerfil } = useContext(AuthContext);
  const dispatch = useDispatch();

  const updateCuenta = (calle, nroDireccion, piso, depto, provincia_id, localidad,
     municipio, codigoPostal, inscripcion_id, pais_id, toast) => {
      debugger
    return dispatch(actualizarDatosCuenta(referido?.accountid, token, "", calle, nroDireccion, piso, depto, provincia_id, localidad,
        municipio, codigoPostal, inscripcion_id, pais_id, "", toast))
      .then(() => {
        debugger
        actualizarPerfil()
      })
      .catch((error) => {
        debugger
        console.error("Error:", error);
      });
  };

  return updateCuenta;
};

export default useUpdateCuenta;