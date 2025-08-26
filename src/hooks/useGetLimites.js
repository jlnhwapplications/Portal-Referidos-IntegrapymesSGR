import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerTodosLimitesPorLineas } from '@/redux/LimitePorLinea'
import moment from "moment";

const UseGetLimites = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const [dataLimite, setDataLimite] = useState({})
    const [limites, setLimites] = useState(null)
    const [loadingLimites, setLoadingLimites] = useState(false);
    const [limiteGral, setLimiteGral] = useState([])
    const [limitesInicio, setLimitesInicio] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(obtenerTodosLimitesPorLineas(referido?.accountid, token))
                    .then(data => {
                        if (data?.length > 0) {
                            var limiteGeneral = data.filter(item => item.new_lineatipodeoperacion == 100000000)
                            if (limiteGeneral.length > 0) {
                                let utilizado = 0
                                let disponible = 0
                                let datos = {
                                    tope: 0,
                                    utilizado: 0,
                                    disponible: 0
                                }
                                let datosLimites = []
                                var tope = parseInt(limiteGeneral[0].new_topeporlineacomercial)
                                if (tope > 0) {
                                    datos.tope = tope
                                }
                                utilizado = parseInt(limiteGeneral[0].new_montoutilizadogeneral)
                                if (utilizado > 0) {
                                    datos.utilizado = utilizado
                                }
                                disponible = tope - utilizado
                                if (disponible > 0) {
                                    datos.disponible = disponible
                                }
                                setDataLimite(datos)
                            }
                            let arrayLimites = []
                            data.forEach(item => {
                                var limite = {
                                    id: item.new_productosid,
                                    new_lineatipodeoperacion: item["new_lineatipodeoperacion@OData.Community.Display.V1.FormattedValue"],
                                    new_lineatipodeoperacion_value: item["new_lineatipodeoperacion"],
                                    new_montodisponibleporoperacion_value: item.new_montodisponibleporoperacion > 0 ? item["new_montodisponibleporoperacion@OData.Community.Display.V1.FormattedValue"] : 0,
                                    new_montodisponibleporoperacion: item.new_montodisponibleporoperacion > 0 ? item.new_montodisponibleporoperacion : 0,
                                    new_montoutilizadogeneral: item.new_montoutilizadogeneral > 0 ? item.new_montoutilizadogeneral : 0,
                                    new_montodisponiblegeneral: item.new_montodisponiblegeneral > 0 ? item.new_montodisponiblegeneral : 0,
                                    new_montodisponiblegeneral_value: item.new_montodisponiblegeneral > 0 ? item["new_montodisponiblegeneral@OData.Community.Display.V1.FormattedValue"] : 0,
                                    new_montoutilizadoporoperacion: item.new_montoutilizadoporoperacion > 0 ? item.new_montoutilizadoporoperacion : 0,
                                    new_mostrarenportalsocio: item.new_mostrarenportalsocio,
                                    new_productosid: item.new_productosid,
                                    new_tipochpd: item["new_tipochpd@OData.Community.Display.V1.FormattedValue"],
                                    new_tipochpd_value: item["new_tipochpd"],
                                    new_topeporlineacomercial: item.new_topeporlineacomercial > 0 ? item.new_topeporlineacomercial : 0,
                                    new_topeporlineacomercialusd: item.new_topeporlineacomercialusd > 0 ? item.new_topeporlineacomercialusd : 0,
                                    new_vigenciahasta: item.new_vigenciahasta ? moment(new Date(item.new_vigenciahasta)).format('DD/MM/yyyy') : '',
                                    statuscode: item["statuscode@OData.Community.Display.V1.FormattedValue"],
                                    statuscode_value: item?.statuscode,
                                    statecode: item?.statecode,
                                    _transactioncurrencyid_value: item["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"]
                                }
                                arrayLimites.push(limite)
                            })
                            setLimites(arrayLimites.filter(lin => lin.new_lineatipodeoperacion_value != 100000000))
                            setLimitesInicio(arrayLimites.filter(lin => lin.new_lineatipodeoperacion_value != 100000000 && lin?.statecode === 0 && lin?.statuscode_value === 100000001)?.slice(0, 5))
                            setLimiteGral(arrayLimites.filter(lin => lin.new_lineatipodeoperacion_value == 100000000))
                            setLoadingLimites(true)
                        } else {
                            setLimites([])
                            setLimiteGral([])
                            setDataLimite([])
                            setLimitesInicio([])
                            setLoadingLimites(true)
                        }
                    })

                    .catch(() => {
                        setLimites([])
                        setLimiteGral([])
                        setLimitesInicio([])
                    })
            } catch (error) {
                console.log(error)
            }
        };

        if (token != null && token != '') {
            if (!limites) {
                fetchData()
            }
        }
    }, [limites]);

    const memoData = useMemo(() => limites, [limites])

    const LimpiarLimites = () => {
        setLoadingLimites(true)
        setLimites([])
        setLimiteGral([])
        setDataLimite([])
    };

    return { dataLimite, limites: memoData, limiteGral, loadingLimites, LimpiarLimites, limitesInicio };
};

export default UseGetLimites;