import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerProvincias } from '@/redux/Cuenta'

const UseGetProvincias = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const provinciasSelector = useSelector(store => store.cuenta.provincias)
    const [opcionesProvincias, setOpcionesProvincias] = useState(null)
    console.log(opcionesProvincias, 'opcionesProvincias')
    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch(obtenerProvincias(token)) 
                .then(data => {
                if (data?.length > 0) {
                    var opciones = []
                    data.forEach(prov => {
                        var provincia = { value: prov.new_provinciaid, label: prov.new_name }
                        opciones.push(provincia);
                    });
                    //ordeno alfabeticamente
                    opciones.sort(function (a, b) {
                        if (a.label < b.label) { return -1; }
                        if (a.label > b.label) { return 1; }
                        return 0;
                    })
                    setOpcionesProvincias(opciones)
                    console.log(opciones, 'opciones')
                    // if (cuentaSelector != undefined) {
                    //     provinciasSelector.filter(prov => prov.new_provinciaid === cuentaSelector._new_provincia_value).map(itemProv => {
                    //         setProvincia({ label: itemProv.new_name, value: itemProv.new_provinciaid })
                    //     })
                    // }
                } else {
                    setOpcionesProvincias([])

                }})
                .catch(() => {
                    setOpcionesProvincias([])
                })
        } catch (error) {
            console.log(error)
        }
        };

        if (token != null && token != '') {
            if(opcionesProvincias === null){
                fetchData()
            }
        }
    }, [opcionesProvincias]);

    const memoData = useMemo(() => opcionesProvincias, [opcionesProvincias]);

    return { opcionesProvincias: memoData };
};

export default UseGetProvincias;