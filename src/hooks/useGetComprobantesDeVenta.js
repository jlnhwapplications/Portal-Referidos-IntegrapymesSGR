import { AuthContext } from "@/context/AuthContext";
import { obtenerComprobantesDeVenta } from "@/redux/Cuenta";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetComprobantesDeVenta = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const comprobantesDeVentaSelector = useSelector(store => store.cuenta.comprobantesDeVenta)
    const retrieveComprobantes = useSelector(store => store.cuenta.retrieveComprobantes)
    const [comprobantes, setComprobantes] = useState([])
    const [loadingComprobantes, setLoadingComprobantes] = useState(false);

    useEffect(() => {
        if (token != null && token != '') {
            dispatch(obtenerComprobantesDeVenta(referido.accountid, token))
        }
    }, [token]);

    useEffect(() => {
        if (comprobantesDeVentaSelector?.length > 0 && retrieveComprobantes) {
            let comprobantesVenta = []
            comprobantesDeVentaSelector.forEach(item => {
                const idComprobante = item['new_comprobantedeventaid'];
                if (!comprobantesVenta.some(cv => cv.id === idComprobante)) {
                    var comprovanteVenta = {
                        id: item['new_comprobantedeventaid'],
                        new_nrocomprobante: item["new_nrocomprobante"],
                        createdon: item["createdon"] ? moment(new Date(item["createdon"])).format('DD/MM/yyyy') : '',
                        new_TipodeComprobante: item['_new_tipodecomprobante_value@OData.Community.Display.V1.FormattedValue'],
                        new_total: item['new_total'],
                        transactioncurrency: item['_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue'],
                        filename: item['nota.filename'],
                        annotationid: item['nota.annotationid'],
                        nota: {
                            annotationid: item['nota.annotationid'],
                            filename: item['nota.filename'],
                            mimetype: item['nota.mimetype'],
                            // documentbody: item['nota.documentbody'],
                            urlafip: item['new_urlafip']
                        }
                    }
                    comprobantesVenta.push(comprovanteVenta)
                }
            })
            // comprobantesVenta.sort((a, b) => {
            //     const dateA = moment(a.createdon, 'DD/MM/YYYY').toDate();
            //     const dateB = moment(b.createdon, 'DD/MM/YYYY').toDate();
            //     return dateB - dateA;
            // });
            setComprobantes(comprobantesVenta)
            setLoadingComprobantes(retrieveComprobantes)
        } else if (comprobantesDeVentaSelector?.length === 0 && retrieveComprobantes) {
            setComprobantes([])
            setLoadingComprobantes(retrieveComprobantes)
        }
    }, [comprobantesDeVentaSelector, retrieveComprobantes])

    return { comprobantes, loadingComprobantes };
};

export default useGetComprobantesDeVenta;