import { createContext } from "react";
import useGetDocumentacionPorCuenta from "@/hooks/useGetDocumentacionPorCuenta";

const deafultvalues = {
  carpetas: [],
  loadingDocumentacion: false,
  LimpiarDocumentacionPorCuenta: () => { },
  createDocuXcuenta: () => { },
};

export const DocumentacionPorCuenta = createContext(deafultvalues)

export const DocumentacionPorCuentaProvider = ({ children }) => {

  const { carpetas, loadingDocumentacion, LimpiarDocumentacionPorCuenta, createDocuXcuenta } = useGetDocumentacionPorCuenta();

  const values = {
    carpetas,
    loadingDocumentacion,
    LimpiarDocumentacionPorCuenta,
    createDocuXcuenta
  };

  return <DocumentacionPorCuenta.Provider value={values}>{children}</DocumentacionPorCuenta.Provider>;
};