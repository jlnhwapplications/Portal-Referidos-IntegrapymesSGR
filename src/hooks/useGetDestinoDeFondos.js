import { AuthContext } from "@/context/AuthContext";
import { obtenerDestinoDeFondos } from "@/redux/DatosSolicitudAlta";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";

const UseGetDestinoDeFondos = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const [opcionesDestinoDeFondos, setOpcionesDestinoDeFondos] = useState([])

    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch(obtenerDestinoDeFondos(token)) 
                .then(data => {
                if (data?.length > 0) {
                    var opciones = []
                    data.forEach(destino => {
                        var Destino = { value: destino.new_destinodefondosid, label: destino.new_name }
                        opciones.push(Destino);
                    });
                    setOpcionesDestinoDeFondos(opciones)
                } else {
                    setOpcionesDestinoDeFondos([])

                }})
                .catch(() => {
                    setOpcionesDestinoDeFondos([])
                })
        } catch (error) {
            console.log(error)
        }
        };
        if (token != null && token != '') {
            if(opcionesDestinoDeFondos?.length === 0){
                fetchData()
            }
        }
    }, [opcionesDestinoDeFondos, token]);

    const memoData = useMemo(() => opcionesDestinoDeFondos, [opcionesDestinoDeFondos]);

    return { opcionesDestinoDeFondos: memoData };
};

export default UseGetDestinoDeFondos;