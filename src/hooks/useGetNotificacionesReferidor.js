import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { inactivarTarea, obtenerTareas, obtenerTareasCuentasReferidas } from "@/redux/Cuenta";
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

const useGetNotificacionesReferidor = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const [notificacionesReferidor, setNotificacionesReferidor] = useState(null)
    const [notificacionesCuentasReferidas, setNotificacionesCuentasReferidas] = useState(null)
    const [cantidadNotificacionesReferidor, setCantidadNotificacionesReferidor] = useState(0)
    const [cantidadNotificacionesCuentasReferidas, setCantidadNotificacionesCuentasReferidas] = useState(0)
    const [loadingInactivacion, setLoadingInactivacion] = useState(null)

    useEffect(() => {
        if (user?.accountid, token) {
            fetchData(user?.accountid, token);
        }
    }, [user, token]);

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
                        setNotificacionesReferidor(array)
                        setCantidadNotificacionesReferidor(array.length)
                    } else {
                        setNotificacionesReferidor([]);
                        setCantidadNotificacionesReferidor(0);
                    }
                })
                .catch((error) => {
                    setNotificacionesReferidor([]);
                    setCantidadNotificacionesReferidor(0);
                });

            dispatch(obtenerTareasCuentasReferidas(accountid, token))
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
                                regardingobjectid: item["_regardingobjectid_value@OData.Community.Display.V1.FormattedValue"],
                                createdAt: moment(item.createdon).startOf('minute').fromNow()
                            }
                            array.push(object)
                        })
                        array.sort(function (a, b) {
                            return new Date(b.createdon) - new Date(a.createdon);
                        });
                        setNotificacionesCuentasReferidas(array)
                        setCantidadNotificacionesCuentasReferidas(array.length)
                    } else {
                        setNotificacionesCuentasReferidas([]);
                        setCantidadNotificacionesCuentasReferidas(0);
                    }
                })
                .catch((error) => {
                    setNotificacionesCuentasReferidas([]);
                    setCantidadNotificacionesCuentasReferidas(0);
                });
        } catch (error) {
            console.log(error);
        }
    };




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

    const memoData = useMemo(() => notificacionesReferidor, [notificacionesReferidor])

    return { notificacionesReferidor: memoData, cantidadNotificacionesReferidor, notificacionesCuentasReferidas, cantidadNotificacionesCuentasReferidas, inactivarNotificacion };
};

export default useGetNotificacionesReferidor;