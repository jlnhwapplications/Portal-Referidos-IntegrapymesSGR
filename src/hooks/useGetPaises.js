import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerPaises } from '@/redux/Cuenta'


const UseGetPaises = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const paisesSelector = useSelector(store => store.cuenta.paises)
    const [opcionesPaises, setOpcionesPaises] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch(obtenerPaises(token))
                .then(data => {
                if (data?.length > 0) {
                    var opciones = []
                    data.forEach(pais => {
                        var pais = { value: pais.new_paisid, label: pais.new_name }
                        opciones.push(pais);
                    });
                    //ordeno alfabeticamente
                    opciones.sort(function (a, b) {
                        if (a.label < b.label) { return -1; }
                        if (a.label > b.label) { return 1; }
                        return 0;
                    })
                    setOpcionesPaises(opciones)
                } else {
                    setOpcionesPaises([])
                }})
                .catch(() => {
                    setOpcionesPaises([])
                })

        } catch (error) {
            console.log(error)
        }
        };

        if (token != null && token != '') {
            if(opcionesPaises === null){
                fetchData()
            }
        }
    }, [opcionesPaises]);

    const memoData = useMemo(() => opcionesPaises, [opcionesPaises]);

    return { opcionesPaises: memoData };
};

export default UseGetPaises;