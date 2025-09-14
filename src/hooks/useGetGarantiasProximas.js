import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "@/context/AuthContext";
import { UrlApi } from "@/keys";

// Hook para obtener garantías próximas a vencer (próximos 7 días) del referidor
const useGetGarantiasProximas = () => {
  const { token, user } = useContext(AuthContext);
  const [garantiasProximas, setGarantiasProximas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.accountid || !token) return;
    fetchGarantiasProximas(user.accountid, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accountid, token]);

  const fetchGarantiasProximas = async (accountId, tk) => {
    try {
      setLoading(true);
      setError(null);

      const entidad = "new_garantias";
      const fetch =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "<entity name='new_garantia'>" +
        "<attribute name='new_name'/>" +
        "<attribute name='new_tipodeoperacion'/>" +
        "<attribute name='new_socioparticipe'/>" +
        "<attribute name='new_saldovigente'/>" +
        "<attribute name='new_ndeordendelagarantiaotorgada'/>" +
        "<attribute name='new_monto'/>" +
        "<attribute name='new_fechadevencimiento'/>" +
        "<attribute name='new_fechadeorigen'/>" +
        "<attribute name='new_fechadenegociacion'/>" +
        "<attribute name='new_name'/>" +
        "<attribute name='statuscode'/>" +
        "<attribute name='transactioncurrencyid'/>" +
        "<attribute name='new_codigocvba'/>" +
        "<attribute name='new_acreedor'/>" +
        "<attribute name='new_garantiaid'/>" +
        "<order attribute='statuscode' descending='false'/>" +
        "<filter type='and'>" +
        "<condition attribute='new_fechadevencimiento' operator='next-seven-days'/>" +
        "<condition attribute='statuscode' operator='eq' value='100000001'/>" +
        "</filter>" +
        "<link-entity name='account' from='accountid' to='new_socioparticipe' link-type='inner' alias='ad'>" +
        "<filter type='and'>" +
        "<condition attribute='new_referido' operator='eq' value='1'/>" +
        "<condition attribute='new_comercial' operator='eq' value='" + accountId + "'/>" +
        "</filter>" +
        "</link-entity>" +
        "</entity>" +
        "</fetch>";

      const response = await axios.post(
        `${UrlApi}api/consultafetch`,
        { entidad, fetch },
        { headers: { Authorization: `Bearer ${tk}` } }
      );
      debugger
      const data = Array.isArray(response.data) ? response.data : [];
      const formatted = data.map((element) => ({
        id: element["new_garantiaid"],
        new_name: element["new_name"],
        new_ndeordendelagarantiaotorgada: element["new_ndeordendelagarantiaotorgada"],
        new_socioparticipe: element["new_socioparticipe@OData.Community.Display.V1.FormattedValue"] ?? element["new_socioparticipe"],
        new_tipodeoperacion:
          element["new_tipodeoperacion@OData.Community.Display.V1.FormattedValue"] ?? element["new_tipodeoperacion"],
        new_tipodeoperacion_value: element["new_tipodeoperacion"],
        new_acreedor:
          element["_new_acreedor_value@OData.Community.Display.V1.FormattedValue"] ?? element["new_acreedor"],
        new_acreedor_value: element["_new_acreedor_value"] ?? element["new_acreedor"],
        statuscode: element["statuscode"],
        statuscode_value: element["statuscode@OData.Community.Display.V1.FormattedValue"] ?? element["statuscode"],
        new_monto: element["new_monto"],
        new_monto_value: element["new_monto@OData.Community.Display.V1.FormattedValue"],
        new_fechadevencimiento: element["new_fechadevencimiento"]
          ? moment(new Date(element["new_fechadevencimiento"]).toISOString()).format("DD/MM/YYYY")
          : "",
        new_fechadeorigen: element["new_fechadeorigen"]
          ? moment(new Date(element["new_fechadeorigen"]).toISOString()).format("DD/MM/YYYY")
          : "",
        new_fechadenegociacion: element["new_fechadenegociacion"]
          ? moment(new Date(element["new_fechadenegociacion"]).toISOString()).format("DD/MM/YYYY")
          : "",
        transactioncurrencyid:
          element["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"] ??
          element["transactioncurrencyid"],
        new_codigocvba: element["new_codigocvba"],
      }));

      setGarantiasProximas(formatted);
    } catch (err) {
      setError(err);
      setGarantiasProximas([]);
    } finally {
      setLoading(false);
    }
  };

  const memoData = useMemo(() => garantiasProximas, [garantiasProximas]);

  return { garantiasProximas: memoData, loading, error, refetch: () => referido?.accountid && token && fetchGarantiasProximas(referido.accountid, token) };
};

export default useGetGarantiasProximas;
