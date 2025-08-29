import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cargarECheck, LimpiarGarantiasFetchSelector, obtenerAdjuntosGarantias, obtenerGarantiasFetch } from "@/redux/Garantias";
import moment from "moment";
import { cargarGarantiaPromise } from "@/redux/Operaciones";
const estadosGarantia = ["Afrontada", "Anulada", "En Cartera", "En Gestión", "Honrada", "Vencida", "Vigente"];

const UseGetGarantias = () => {
  const dispatch = useDispatch();
  const { token, referido } = useContext(AuthContext);
  const [garantias, setGarantias] = useState(null);
  const [estadoGarantias, setEstadoGarantias] = useState([]);
  const [adjuntosGarantias, setAdjuntosGarantias] = useState(null);
  const [loadingGarantias, setLoadingGarantias] = useState(false);
  const [cargandoCarantia, setCargandoGarantia] = useState(false)

  useEffect(() => {
    if (referido?.accountid, token) {
      fetchData(referido?.accountid, token);
      fetchDataAdjuntos(referido?.accountid, token);
    }
  }, [referido, token]);

  const memoizedData = useMemo(() => garantias, [garantias]);

  const fetchData = (accountid, token) => {
    try {
      dispatch(obtenerGarantiasFetch(accountid, token))
        .then((data) => {
          if (data?.length > 0) {
            let GarantiasFormat = [];
            data.forEach((element) => {
              let garantiaFormat = {
                id: element["new_garantiaid"],
                new_name: element["new_name"],
                new_ndeordendelagarantiaotorgada: element["new_ndeordendelagarantiaotorgada"],
                new_tipodeoperacion: element["new_tipodeoperacion@OData.Community.Display.V1.FormattedValue"],
                new_tipodeoperacion_value: element["new_tipodeoperacion"],
                new_acreedor: element["_new_acreedor_value@OData.Community.Display.V1.FormattedValue"],
                new_acreedor_value: element["_new_acreedor_value"],
                statuscode_value: element["statuscode@OData.Community.Display.V1.FormattedValue"],
                statuscode: element["statuscode"],
                new_monto: element["new_monto"],
                new_monto_value: element["new_monto@OData.Community.Display.V1.FormattedValue"],
                new_fechadevencimiento: element["new_fechadevencimiento"] ? moment(new Date(element["new_fechadevencimiento"])).format('DD/MM/yyyy') : '',
                new_tipodegarantias: element["new_tipodegarantias@OData.Community.Display.V1.FormattedValue"],
                new_fechadeorigen: element["new_fechadeorigen"] ? moment(new Date(element["new_fechadeorigen"])).format("DD/MM/yyyy") : '',
                new_fechadeorigen_date: element["new_fechadeorigen"],
                createdon: moment(new Date(element["createdon"])).format("DD/MM/yyyy"),
                transactioncurrencyid: element["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"],
                new_sociosprotector: element["_new_sociosprotector_value@OData.Community.Display.V1.FormattedValue"],
                new_fechadecancelada: element["new_fechadecancelada"] ? moment(new Date(element["new_fechadecancelada"])).format('DD/MM/yyyy'): '',
                new_fechadeanulada: element["new_fechadeanulada"] ? moment(new Date(element["new_fechadeanulada"])).format('DD/MM/yyyy'): '',
                new_librador: element["_new_libradorcheque_value@OData.Community.Display.V1.FormattedValue"],
                new_formatodelcheque: element["new_formatodelcheque@OData.Community.Display.V1.FormattedValue"],
                new_numerodecheque: element["new_numerodecheque"],
                new_tipochpd: element["new_tipochpd@OData.Community.Display.V1.FormattedValue"],
                new_tasa: element["new_tasa@OData.Community.Display.V1.FormattedValue"],
                new_plazodias: element["new_plazodias"],
                new_periodogracia: element["new_periodogracia"],
                new_sistemadeamortizacion: element["new_sistemadeamortizacion@OData.Community.Display.V1.FormattedValue"],
                new_periodicidadpagos: element["new_periodicidadpagos@OData.Community.Display.V1.FormattedValue"],
                new_observaciones: element["new_observaciones"]
              };
              GarantiasFormat.push(garantiaFormat);
            });
            GarantiasFormat.sort(function (a, b) {
              return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
            });
            setGarantias(GarantiasFormat);
            setLoadingGarantias(true);
            let estadiosGarantias = [];
            estadosGarantia.forEach((elemento) => {
              var nombre = elemento;
              var cantidad =
                data.filter((pyme) => pyme["statuscode@OData.Community.Display.V1.FormattedValue"] == elemento).length >
                  0
                  ? data.filter((pyme) => pyme["statuscode@OData.Community.Display.V1.FormattedValue"] == elemento)
                    .length
                  : 0;

              var estado = {
                opcion: nombre,
                cantidad: cantidad,
              };
              estadiosGarantias.push(estado);
            });
            setEstadoGarantias(
              estadiosGarantias.sort(function (a, b) {
                if (a.estado < b.estado) {
                  return -1;
                }
                if (a.estado > b.estado) {
                  return 1;
                }
                return 0;
              })
            );
          } else {
            setGarantias([]);
            setEstadoGarantias([]);
            setLoadingGarantias(true);
          }
        })
        .catch((error) => {
          setGarantias([]);
          setEstadoGarantias([]);
        });
      // console.log(err)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataAdjuntos = (accountid, token) => {
    try {
      dispatch(obtenerAdjuntosGarantias(accountid, token))
        .then((data) => {
          if (data?.length > 0) {
            var AdjuntosFormat = [];
            data.forEach((element) => {
              var adjuntoFormat = {
                id: element["new_adjuntosid"],
                new_name: element["new_name"],
                new_tipo: element["new_tipo@OData.Community.Display.V1.FormattedValue"],
                filename: element["nota.filename"],
                statuscode: element["statuscode"],
                new_garantia: element["_new_garantia_value"],
                annotationid: element["nota.annotationid"],
                // nota: {
                //     annotationid: element['nota.annotationid'],
                //     filename: element['nota.filename'],
                //     mimetype: element['nota.mimetype']
                // }
              };
              AdjuntosFormat.push(adjuntoFormat);
            });
            setAdjuntosGarantias(AdjuntosFormat);
          } else {
            setAdjuntosGarantias([]);
          }
        })
        .catch(() => {
          setAdjuntosGarantias([]);
        });
    } catch (error) {
      // setError(error);
      // setLoading(false);
    }
  };

  function createGarantia(datos, id, token, toast) {
    setCargandoGarantia(true);

    return new Promise((resolve, reject) => {
      debugger;
      dispatch(cargarGarantiaPromise(datos, referido?.accountid, token, toast))
        .then(() => {
          return fetchData(id, token);
        })
        .then(() => {
          setCargandoGarantia(false);
          resolve();
        })
        .catch((err) => {
          setCargandoGarantia(false);
          reject(err);
        });
    });
  }

  function createECheck(formData, id, token, toast) {
    setCargandoGarantia(true);
    return new Promise((resolve, reject) => {
      debugger;
      dispatch(cargarECheck(formData, referido?.accountid, token, toast))
        // dispatch(cargarGarantiaPromise(datos, referido?.accountid, token, toast))
        .then(() => {
          return fetchData(id, token);
        })
        .then(() => {
          setCargandoGarantia(false);
          resolve();
        })
        .catch((err) => {
          setCargandoGarantia(false);
          reject(err);
        });
    });
  }



  const LimpiarGarantia = () => {
    setGarantias([]);
    setEstadoGarantias([]);
    setAdjuntosGarantias([]);
    setLoadingGarantias(false);
    dispatch(LimpiarGarantiasFetchSelector());
  };

  return {
    garantias: memoizedData,
    estadoGarantias,
    adjuntosGarantias,
    loadingGarantias,
    cargandoCarantia,
    LimpiarGarantia,
    fetchData,
    createGarantia,
    createECheck
  };
};

export default UseGetGarantias;
