import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obteneAcreedores } from '@/redux/Operaciones';

const useGetAcreedores = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const acreedoresSelector = useSelector(store => store.operaciones.acreedores)
    const [acreedores, setAcreedores] = useState([])

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obteneAcreedores(token))
        }
    }, [token]);

    useEffect(() => {
        try {
            if (acreedoresSelector?.length > 0) {
                const acreedoresArray = [];
                acreedoresSelector.forEach(element => {
                    var opcion = {
                        value: element.new_acreedorid,
                        label: element.new_name,
                        tipo: element.new_tipodeacreedor,
                        montoCalificado: element?.new_montocalificado > 0 ? element.new_montocalificado : 0
                    }
                    acreedoresArray.push(opcion);
                });
                setAcreedores(acreedoresArray)
            }
        } catch (err) {
            // console.log(err)
        }
    }, [acreedoresSelector]);

    return { acreedores };
};

export default useGetAcreedores;