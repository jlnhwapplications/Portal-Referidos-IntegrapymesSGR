import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerTareas } from "@/redux/Cuenta";
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

const useGetNotificacionesReferidor = () => {
    const dispatch = useDispatch();
    const { token, user  } = useContext(AuthContext);
    const [notificacionesReferidor, setNotificacionesReferidor] = useState(null)
    const [cantidadNotificacionesReferidor, setCantidadNotificacionesReferidor] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                debugger
                dispatch(obtenerTareas(user?.accountid, token))
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
                    }})
            } catch (error) {
                console.log(error)
            }
        };

        if(token != null && token != ''){
            if(!notificacionesReferidor){
                fetchData()
            }
        }

    }, [notificacionesReferidor]);

    const memoData = useMemo(() => notificacionesReferidor, [notificacionesReferidor])

    return { notificacionesReferidor: memoData, cantidadNotificacionesReferidor };
};

export default useGetNotificacionesReferidor;