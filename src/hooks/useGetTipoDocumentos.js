import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerTipoDeDocumentos } from "@/redux/DatosSolicitudAlta";

const useGetTipoDocumentos = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const [tiposDocumentos, setTiposDocumentos] = useState([])
    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch(obtenerTipoDeDocumentos(token))
                .then(data => {
                if (data?.length > 0) {
                    const opcionesDocumentos = [];
                    data.forEach(tipoDocumento => {
                        var tipo = { value: tipoDocumento.new_tipodedocumentoid, label: tipoDocumento.new_name }
                        opcionesDocumentos.push(tipo);
                    });
                    setTiposDocumentos(opcionesDocumentos)
                } else {
                    setTiposDocumentos([])

                }})
                .catch(() => {
                    setTiposDocumentos([])
                })
        } catch (error) {
            console.log(error)
        }
        };
        if (token != null && token != '') {
            if(tiposDocumentos?.length === 0){
                fetchData()
            }
        }
    }, [tiposDocumentos, token]);

    return { tiposDocumentos };
};

export default useGetTipoDocumentos;