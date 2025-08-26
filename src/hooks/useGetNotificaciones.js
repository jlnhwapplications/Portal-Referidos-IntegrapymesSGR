import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inactivarTarea, obtenerTareas } from "@/redux/Cuenta";
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

const UseGetNotificaciones = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const [notificaciones, setNotificaciones] = useState(null)
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0)

    useEffect(() => {
        if (referido?.accountid, token) {
            fetchData(referido?.accountid, token);
        }
    }, [referido, token]);

    const fetchData = (accountid, token) => {
        try {
            dispatch(obtenerTareas(accountid, token))
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
                    } else {
                        setNotificaciones([]);
                        setCantidadNotificaciones(0);
                    }
                })
                .catch((error) => {
                    setNotificaciones([]);
                    setCantidadNotificaciones(0);
                });
            // console.log(err)
        } catch (error) {
            console.log(error);
        }
    };

    const memoData = useMemo(() => notificaciones, [notificaciones])

    function inactivarNotificacion(accountid, id, token) {
        return new Promise((resolve, reject) => {
            dispatch(inactivarTarea(id, token))
                .then(() => {
                    return fetchData(accountid, token);
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    return { notificaciones: memoData, cantidadNotificaciones, inactivarNotificacion };
};

export default UseGetNotificaciones;