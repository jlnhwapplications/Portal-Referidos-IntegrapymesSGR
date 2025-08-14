import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerLineasXUN } from "@/redux/UnidadDeNegocio";

const useGetUnidadDeNegocio = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const mostrarLineas = useSelector(store => store.unidadesNegocio.mostrarLineas)
    const mostrarLineasPortal = useSelector(store => store.unidadesNegocio.mostrarLineasPortal)
    const retrieveUnidad = useSelector(store => store.unidadesNegocio.retrieveUnidad)
    const [lineasActivas, setLineasActivas] = useState(null)
    const [loadingMostrarLineas, setLoadingMostrarLineas] = useState(false)
    
    useEffect(() => {
        const fetchData = async () => {
            dispatch(obtenerLineasXUN(token))
            .then(data => {
                if (data != undefined && data != null) {
                    setLineasActivas(data)
                    setLoadingMostrarLineas(true)
                } else {
                    setLineasActivas(false)
                    setLoadingMostrarLineas(true)
                }})
        }
        if (token != null && token != '') {
           if(lineasActivas == null){
                fetchData()
           }
        }
    }, [lineasActivas]);

    const memoData = useMemo(() => lineasActivas, [lineasActivas])

    return { lineasActivas: memoData, loadingMostrarLineas };
};

export default useGetUnidadDeNegocio;