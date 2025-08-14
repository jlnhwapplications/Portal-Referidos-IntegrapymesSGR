import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerDocumentosOnboardingFETCH } from "@/redux/DatosSolicitudAlta";

const useGetDocumentosOnboarding = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const documentosSelector = useSelector(store => store.datos.documentos)
    const [documentosOnb, setDocumentosOnb] = useState([])
    const retrieveTipoDocumentoSelector = useSelector(store => store.datos.retrieveTipoDocumento)

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obtenerDocumentosOnboardingFETCH(token))
        }
    }, [token]);

    useEffect(() => {
        try {
            if (documentosSelector?.length > 0) {
                setDocumentosOnb(documentosSelector)
                // setTiposDocumentos(opcionesDocumentos)
            }
            // else if (tipoDocumentoSelector?.length === 0 && retrieveTipoDocumentoSelector) {
            //     setTiposDocumentos([])
            // }
        } catch (err) {
            // console.log(err)
        }
    }, [documentosSelector]);

    return { documentosOnb };
};

export default useGetDocumentosOnboarding;