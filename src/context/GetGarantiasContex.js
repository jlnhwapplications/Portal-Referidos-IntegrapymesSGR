import UseGetGarantias from "@/hooks/useGetGarantias";
import { createContext } from "react";

const deafultvalues = {
  garantias: [],
  estadoGarantias: null,
  loadingGarantias: false,
  adjuntosGarantias: null,
  cargandoCarantia: false,
  LimpiarGarantia: () => { },
  fetchData: () => { },
  createGarantia: () => { },
  createECheck: () => { }
};

export const Garantias = createContext(deafultvalues);

export const GarantiasProvider = ({ children }) => {
  const { garantias, estadoGarantias, loadingGarantias, adjuntosGarantias, cargandoCarantia, LimpiarGarantia, fetchData, createGarantia, createECheck } = UseGetGarantias();

  const values = {
    garantias,
    estadoGarantias,
    loadingGarantias,
    adjuntosGarantias,
    cargandoCarantia,
    LimpiarGarantia,
    fetchData,
    createGarantia,
    createECheck
  };

  return <Garantias.Provider value={values}>{children}</Garantias.Provider>;
};
