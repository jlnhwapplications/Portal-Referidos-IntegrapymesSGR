import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerActividadesAFIP } from "@/redux/DatosSolicitudAlta";

const useGetActividadesAFIP = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const actividadAfipSelector = useSelector(store => store.datos.actividades)
    const [actividadAfipOpciones, setActividadAfipOpciones] = useState([])
    const [actividadAfip, setActividadAfip] = useState([])
    const retrieveActividadAFIP = useSelector(store => store.datos.retrieveActividadAFIP)

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obtenerActividadesAFIP(token))
        }
    }, [token]);

    useEffect(() => {
        try {
            if (actividadAfipSelector?.length > 0 && retrieveActividadAFIP) {
                setActividadAfip(actividadAfipSelector)
                const opcionesAfip = [];
                actividadAfipSelector.forEach(element => {
                    if (element.new_codigo !== null) {
                        var actividad = { value: element.new_actividadafipid, label: element.new_codigo + ' - ' + element.new_name }
                    } else {
                        var actividad = { value: element.new_actividadafipid, label: element.new_name }
                    }
                    opcionesAfip.push(actividad);
                });
                setActividadAfipOpciones(opcionesAfip)
            } else if (actividadAfipSelector?.length === 0 && retrieveActividadAFIP) {
                setActividadAfipOpciones([])
                setActividadAfip([])
            }
        } catch (err) {
            // console.log(err)
        }
    }, [actividadAfipSelector]);

    return { actividadAfipOpciones, actividadAfip };
};

export default useGetActividadesAFIP;