import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerCertificadoPyme } from "@/redux/Cuenta";
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

const useGetCertificadosPymes = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const certificadosSelector = useSelector(store => store.cuenta.certificadosPymes)
    const retrieveCertificados = useSelector(store => store.cuenta.retrieveCertificados)
    const [certificados, setCertificados] = useState([])
    const [loadingCertificados, setLoadingCertificados] = useState(true);

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obtenerCertificadoPyme(referido.accountid, token))
        }
    }, [token]);

    useEffect(() => {
        if (certificadosSelector?.length > 0 && retrieveCertificados) {
            let CertificadosFormat = []
            debugger
            certificadosSelector.forEach(element => {
                let certificadoFormat = {
                    id: element["new_certificadopymeid"],
                    new_vigenciahasta: moment(new Date(element["new_vigenciahasta"])).format('DD/MM/yyyy'),
                    new_vigenciadesde: moment(new Date(element["new_vigenciadesde"])).format('DD/MM/yyyy'),
                    statuscode: element["statuscode@OData.Community.Display.V1.FormattedValue"],
                    new_numeroderegistro: element["new_numeroderegistro"],
                    new_fechadeemision: moment(new Date(element["new_fechadeemision"])).format('DD/MM/yyyy'),
                    new_categoria:  element["_new_categoria_value@OData.Community.Display.V1.FormattedValue"],
                    new_sectoreconomico:   element["_new_sectoreconomico_value@OData.Community.Display.V1.FormattedValue"],
                }
                CertificadosFormat.push(certificadoFormat)
            })
            setCertificados(CertificadosFormat)
            setLoadingCertificados(false)
        } else if (certificadosSelector?.length === 0 && retrieveCertificados) {
            setCertificados([])
            setLoadingCertificados(false)
        }
    }, [certificadosSelector, retrieveCertificados])

    return { certificados, loadingCertificados };
};

export default useGetCertificadosPymes;