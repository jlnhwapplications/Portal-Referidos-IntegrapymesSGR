import UseGetRelaciones from "@/hooks/useGetRelaciones";
import { createContext } from "react";

const deafultvalues = {
    relaciones: [],
    loadingRelaciones: false,
    LimpiarRelaciones: () => { },
    createRelacion: () => Promise(),
    updateRelacion: () => Promise(),
    deleteRelacion: () => { }
};

export const Relaciones = createContext(deafultvalues);

export const RelacionesProvider = ({ children }) => {
    const { relaciones, loadingRelaciones, LimpiarRelaciones, createRelacion, updateRelacion, deleteRelacion } = UseGetRelaciones();

    const values = {
        relaciones,
        loadingRelaciones,
        LimpiarRelaciones,
        createRelacion,
        updateRelacion,
        deleteRelacion
    };

    return <Relaciones.Provider value={values}>{children}</Relaciones.Provider>;
};
