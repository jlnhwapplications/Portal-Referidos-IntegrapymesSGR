import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generarEntidadLUFE, obtenerEntidadLUFE, obtenerTareas } from "@/redux/Cuenta";
import moment from "moment";

const useGetLufe = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const entidadLufe = useSelector(store => store.cuenta.entidadLufe)
    const loadingLufe = useSelector(store => store.cuenta.loadingLufe)
    const retrieveLufe = useSelector(store => store.cuenta.retrieveLufe)
    const [entidad, setEntidad] = useState({})
    const [loading, setLoading] = useState(false)
    const [consultaLufe, setConsultaLufe] = useState(false)

    useEffect(() => {
        try {
            if (Object.keys(entidadLufe)?.length > 0 && retrieveLufe) {
                setEntidad(entidadLufe)
                setLoading(false)
                setConsultaLufe(true)
            } else if (Object.keys(entidadLufe)?.length == 0 && retrieveLufe) {
                setEntidad({})
                setLoading(false)
                setConsultaLufe(true)
            }
        } catch (err) {
            // console.log(err)
        }
    }, [entidadLufe, retrieveLufe]);

    const getLufe = (cuit) => {
        if (token != '' && cuit != undefined) {
            dispatch(obtenerEntidadLUFE(cuit, token))
        }
    }

    const setLufe = (email, razonSocial, cuit, tipoDocumento) => {
        if (token != '' && cuit != undefined) {
            dispatch(generarEntidadLUFE(email, razonSocial, cuit, tipoDocumento, token))
        }
    }

    return { entidad, loading, consultaLufe, getLufe, setLufe };
};

export default useGetLufe;