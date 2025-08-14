import { AuthContext } from "@/context/AuthContext";
import { obtenerCondicionesDeInscripcionFETCH } from "@/redux/DatosSolicitudAlta";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetCondicionesAFIPDocumentos = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const condicionesSelector = useSelector(store => store.datos.condicionesAFIP)
    const [condicionesAFIP, setCondicionesAFIP] = useState([])

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obtenerCondicionesDeInscripcionFETCH(token))
        }
    }, [token]);

    useEffect(() => {
        try {
            if (condicionesSelector?.length > 0) {
                setCondicionesAFIP(condicionesSelector)
            }
        } catch (err) {
            // console.log(err)
        }
    }, [condicionesSelector]);

    return { condicionesAFIP };
};

export default useGetCondicionesAFIPDocumentos;