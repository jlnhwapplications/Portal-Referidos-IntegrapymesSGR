import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerCondicionImpositiva } from '@/redux/DatosSolicitudAlta'

const useGetCondicionesAFIP = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const condicionAfipSelector = useSelector(store => store.datos.condiciones)
    const [condiciones, setCondiciones] = useState([])

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obtenerCondicionImpositiva(token))
        }
    }, [token]);

    useEffect(() => {
        try {
            if (condicionAfipSelector?.length > 0) {
                const condicionesAfip = [];
                condicionAfipSelector.forEach(element => {
                    var condicion = { value: element.new_condiciondeinscipcionanteafipid, label: element.new_name }
                    condicionesAfip.push(condicion);
                });
                setCondiciones(condicionesAfip)
            }
        } catch (err) {
            // console.log(err)
        }
    }, [condicionAfipSelector]);

    return { condiciones };
};

export default useGetCondicionesAFIP;