import { AuthContext } from "@/context/AuthContext";
import { obtenerSectorEconomico } from "@/redux/DatosSolicitudAlta";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";

const UseGetSectorEconomico = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const [opcionesSectorEconomico, setOpcionesSectorEconomico] = useState([])

    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch(obtenerSectorEconomico(token)) 
                .then(data => {
                if (data?.length > 0) {
                    var opciones = []
                    data.forEach(sector => {
                        var Sector = { value: sector.new_condicionpymeid, label: sector.new_name }
                        opciones.push(Sector);
                    });
                    setOpcionesSectorEconomico(opciones)
                } else {
                    setOpcionesSectorEconomico([])

                }})
                .catch(() => {
                    setOpcionesSectorEconomico([])
                })
        } catch (error) {
            console.log(error)
        }
        };
        if (token != null && token != '') {
            if(opcionesSectorEconomico?.length === 0){
                fetchData()
            }
        }
    }, [opcionesSectorEconomico, token]);

    const memoData = useMemo(() => opcionesSectorEconomico, [opcionesSectorEconomico]);

    return { opcionesSectorEconomico: memoData };
};

export default UseGetSectorEconomico;