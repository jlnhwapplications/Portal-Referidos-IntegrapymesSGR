import useGetSociedadesBolsaxSocio from "@/hooks/useGetSociedadesBolsaxSocio";
import { createContext } from "react";

const deafultvalues = {
    sociedadXbolsa: [],
    loadingSociedades: false,
    createSociedad: () => Promise(),
    updateSociedad: () => Promise(),
    deleteSociedad: () => { }
};

export const SociedadesDeBolsa = createContext(deafultvalues);

export const SociedadesDeBolsaProvider = ({ children }) => {
    const { sociedadXbolsa, loadingSociedades, createSociedad, updateSociedad, deleteSociedad } = useGetSociedadesBolsaxSocio();

    const values = {
        sociedadXbolsa,
        loadingSociedades,
        createSociedad,
        updateSociedad,
        deleteSociedad
    };

    return <SociedadesDeBolsa.Provider value={values}>{children}</SociedadesDeBolsa.Provider>;
};
