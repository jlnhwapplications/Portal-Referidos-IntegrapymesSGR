import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerTareas } from "@/redux/Cuenta";
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

const UseGetNotificaciones = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const tareasSelector = useSelector(store => store.cuenta.tareas)
    const [notificaciones, setNotificaciones] = useState(null)
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0)

    // useEffect(() => {
    //     if (token != null && token != '') {
    //         dispatch(obtenerTareas(referido?.accountid, token))
    //     }
    // }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(obtenerTareas(referido?.accountid, token))
                    .then(data => {
                    if (data?.length > 0) {
                        var array = []
                        data.forEach(item => {
                            var object = {
                                id: item.activityid,
                                title: item.subject,
                                description: item.description,
                                statuscode: item["statuscode@odata.community.display.v1.formattedvalue"],
                                statecode: item["statecode"],
                                type: item["new_tipodenotificacion@odata.community.display.v1.formattedvalue"],
                                type_value: item["new_tipodenotificacion"],
                                createdon: item.createdon,
                                createdAt: moment(item.createdon).startOf('minute').fromNow()
                            }
                            array.push(object)
                        })
                        array.sort(function (a, b) {
                            return new Date(b.createdon) - new Date(a.createdon);
                        });
                        setNotificaciones(array)
                        setCantidadNotificaciones(array.length)
                        // if (inactivarTareaSelector === "EXITO") {
                        //     setCantidadNotificaciones('1')
                        // }
                    }})
            } catch (error) {
                console.log(error)
            }
        };

        if(token != null && token != ''){
            if(!notificaciones){
                fetchData()
            }
        }

    }, [notificaciones]);

    const memoData = useMemo(() => notificaciones, [notificaciones])

    return { notificaciones: memoData, cantidadNotificaciones };
};

export default UseGetNotificaciones;