import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { obtenerOperaciones } from '@/redux/Operaciones'
import moment from 'moment'

const UseGetOperaciones = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const operacionesSelector = useSelector(store => store.operaciones.operaciones)
    const retrieveOperaciones = useSelector(store => store.operaciones.retrieveOperaciones)
    const [operaciones, setOperaciones] = useState(null)
    const [garantiasOP, setGarantiasOP] = useState([])
    const [documentosOP, setDocumentosOP] = useState([])
    const [loadingOperaciones, setLoadingOperaciones] = useState(true)

    useEffect(() => {
        try {
            if (token != null && token != '') {
                if (!operaciones) {
                    fetchData(referido?.accountid, token)
                }
            }
        } catch (error) {
            console.log(`Error retrieve operaciones ${error}`)
        }
    }, [operaciones]);

    const fetchData = (accountid, token) => {
        try {
            dispatch(obtenerOperaciones(referido?.accountid, token))
                .then(data => {
                    debugger
                    if (data?.length > 0) {
                        let OperacionesExport = []
                        let OperacionesFormat = []
                        let GarantiasFormat = []
                        let operacionesUnicas = [...new Map(data.map(item => [item["new_operacionid"], item])).values()]
                        let garantiasUnicas = [...new Map(data.map(item => [item["garantia.new_garantiaid"], item])).values()]
                        let documentacionesUnicas = [...new Map(data.map(item => [item["documentaciones.new_documentacionporoperacionid"], item])).values()]
                        operacionesUnicas.forEach(element => { //aca ?
                            if (element["new_operacionid"] != undefined && element["new_operacionid"] != "") {
                                let operacionFormat = {
                                    id: element["new_operacionid"],
                                    new_nrooperacion: element["new_nrooperacion"],
                                    new_name: element["new_name"],
                                    new_fechadeenvio: element["new_fechadeenvio"] ? new Date(element["new_fechadeenvio"]) : '',
                                    new_destinodefondo: element["_new_destinodefondo_value@OData.Community.Display.V1.FormattedValue"],
                                    new_montototalcomision: element["new_montototalcomision@OData.Community.Display.V1.FormattedValue"],
                                    new_acreedor: element["_new_acreedor_value@OData.Community.Display.V1.FormattedValue"],
                                    new_acreedor_value: element["_new_acreedor_value"],
                                    new_referido: element["_new_referido_value@OData.Community.Display.V1.FormattedValue"],
                                    new_socioprotector: element["_new_socioprotector_value@OData.Community.Display.V1.FormattedValue"],
                                    new_destinodefondo: element["_new_destinodefondo_value@OData.Community.Display.V1.FormattedValue"],
                                    new_tipooperacin: element["new_tipooperacin@OData.Community.Display.V1.FormattedValue"],
                                    new_tipooperacin_value: element["new_tipooperacin"],
                                    new_tipodecheque: element["new_tipodecheque@OData.Community.Display.V1.FormattedValue"],
                                    new_productocomercial: element["_new_productocomercial_value@OData.Community.Display.V1.FormattedValue"],
                                    new_tipogarantia: element["new_tipogarantia@OData.Community.Display.V1.FormattedValue"],
                                    new_montototal: element["new_montototal"],
                                    createdon: element["createdon@OData.Community.Display.V1.FormattedValue"],
                                    fechaCreacion: new Date(element["createdon"]),
                                    fechaCreacion_str: moment(new Date(element["createdon"])).format('DD/MM/yyyy'),
                                    new_fechadeinstrumentacion: element["new_fechadeinstrumentacion"] ? new Date(element["new_fechadeinstrumentacion"]) : '',
                                    new_cantidadgarantias: element["new_cantidadgarantias"],
                                    new_montodelaoperacion: element["new_montodelaoperacion@OData.Community.Display.V1.FormattedValue"],
                                    statuscode: element["statuscode@OData.Community.Display.V1.FormattedValue"]
                                }
                                OperacionesFormat.push(operacionFormat)
                            }
                        })
                        OperacionesFormat.sort(function (a, b) {
                            return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
                        });
                        setOperaciones(OperacionesFormat)
                        garantiasUnicas.forEach(element => {
                            if (element["garantia.new_garantiaid"] != undefined && element["garantia.new_garantiaid"] != "") {
                                let garantiaFormat = {
                                    id: element["garantia.new_garantiaid"],
                                    new_operacionid: element["new_operacionid"],
                                    new_ndeordendelagarantiaotorgada: element["garantia.new_ndeordendelagarantiaotorgada"],
                                    new_tipodeoperacion: element["garantia.new_tipodeoperacion@OData.Community.Display.V1.FormattedValue"],
                                    new_acreedor: element["garantia._new_acreedor_value@OData.Community.Display.V1.FormattedValue"],
                                    statuscode_value: element["garantia.statuscode@OData.Community.Display.V1.FormattedValue"],
                                    new_monto: element["garantia.new_monto"],
                                    new_fechadevencimiento: moment(new Date(element["garantia.new_fechadevencimiento"])).format('DD/MM/yyyy HH:mm'),
                                    new_tipodegarantias: element["garantia.new_tipodegarantias@OData.Community.Display.V1.FormattedValue"],
                                    createdon: moment(new Date(element["createdon"])).format('DD/MM/yyyy HH:mm'),
                                }
                                GarantiasFormat.push(garantiaFormat)
                            }
                        })
                        setGarantiasOP(GarantiasFormat)
                        var documentosOPAUX = []
                        documentacionesUnicas.forEach(element => {
                            if (element["documentaciones.new_documentacionporoperacionid"]) {
                                let documentosFormat = {
                                    id: element["documentaciones.new_documentacionporoperacionid"],
                                    new_documentacionporoperacionid: element["documentaciones.new_documentacionporoperacionid"],
                                    new_documento: element["documentaciones.new_documento@OData.Community.Display.V1.FormattedValue"],
                                    new_operacionid: element["new_operacionid"],
                                    new_name: element["documentaciones.new_name"],
                                    statuscode: element["documentaciones.statuscode@OData.Community.Display.V1.FormattedValue"],
                                    new_fechadevencimiento: element["documentaciones.new_fechadevencimiento"] ? moment(new Date(element["documentaciones.new_fechadevencimiento"])).format('DD/MM/yyyy') : null,
                                    utilidades: {
                                        new_vinculocompartido: element["documentaciones.new_vinculocompartido"],
                                        new_urlplantilla: element["documentos.new_urlplantilla"],
                                        new_descripcion: element["documentos.new_descripcion"],
                                        new_documento: element["documentaciones.new_documento@OData.Community.Display.V1.FormattedValue"],
                                        id: element["documentaciones.new_documentacionporoperacionid"],
                                    }
                                }
                                documentosOPAUX.push(documentosFormat)
                            }
                        })
                        setDocumentosOP(documentosOPAUX)
                        setLoadingOperaciones(false)
                    } else {
                        debugger
                        setOperaciones([])
                        setLoadingOperaciones(false)
                    }
                })
                .catch(() => {
                    debugger
                    setOperaciones([])
                    setLoadingOperaciones(false)
                })
        } catch (error) {
            console.log(error);
            setLoadingOperaciones(false)
        }
    };


    // const memoizedData = useMemo(() => operaciones, [operaciones]);
    return { operaciones, garantiasOP, documentosOP, loadingOperaciones };
};

export default UseGetOperaciones;