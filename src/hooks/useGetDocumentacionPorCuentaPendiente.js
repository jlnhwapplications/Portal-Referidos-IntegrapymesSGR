import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "@/context/AuthContext";
import { UrlApi } from "@/keys";

const useGetDocumentacionPorCuentaPendiente = () => {
  const { token, user } = useContext(AuthContext);
  const [documentacionPendiente, setDocumentacionPendiente] = useState([]);
  const [loadingDocumentacion, setLoadingDocumentacion] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.accountid || !token) return;
    fetchDocumentacion(user.accountid, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accountid, token]);

  const fetchDocumentacion = async (accountId, tk) => {
    try {
      setLoadingDocumentacion(true);
      setError(null);

      const entidad = "new_documentacionporcuentas";
      const fetch =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "<entity name='new_documentacionporcuenta'>" +
        "<attribute name='new_documentacionporcuentaid'/>" +
        "<attribute name='new_name'/>" +
        "<attribute name='new_documentoid'/>" +
        "<attribute name='new_cuentaid'/>" +
        "<attribute name='new_fechadevencimiento'/>" +
        "<attribute name='createdon'/>" +
        "<attribute name='new_visibleenportal'/>" +
        "<order attribute='new_name' descending='false'/>" +
        "<filter type='and'>" +
        "<condition attribute='new_fechadevencimiento' operator='next-x-days' value='30'/>" +
        "<condition attribute='statuscode' operator='eq' value='1'/>" +
        "</filter>" +
        "<link-entity name='account' from='accountid' to='new_cuentaid' link-type='inner' alias='ab'>" +
        "<attribute name='name' alias='account_name'/>" +
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
      
      const data = Array.isArray(response.data) ? response.data : [];
      const formatted = data.filter(item => item.new_visibleenportal == null || item.new_visibleenportal == true).map((el) => {
        
        const accountName =
          el["account_name"] ??
          el["ab.account_name"] ??
          el["ab.name"] ??
          el["_new_cuentaid_value@OData.Community.Display.V1.FormattedValue"] ??
          null;

        return {
          id: el["new_documentacionporcuentaid"],
          new_documentacionporcuentaid: el["new_documentacionporcuentaid"],
          new_name: el["new_name"],
          socio_nombre: accountName,
          new_cuentaid: el["_new_cuentaid_value"] ?? el["new_cuentaid"],
          statuscode_value: el["statuscode@OData.Community.Display.V1.FormattedValue"] ?? el["statuscode"],
          new_cuentaid_formatted:
            el["_new_cuentaid_value@OData.Community.Display.V1.FormattedValue"] ?? accountName,
          new_documentoid: el["_new_documentoid_value"] ?? el["new_documentoid"],
          new_documentoid_value: el["_new_documentoid_value"] ?? el["new_documentoid"],
          new_documentoid_formatted:
            el["_new_documentoid_value@OData.Community.Display.V1.FormattedValue"] ?? null,
          createdon: el["createdon"]
            ? moment(new Date(el["createdon"]).toISOString()).format("DD/MM/YYYY")
            : "",
          createdon_value: el["createdon"] ?? null,
          new_fechadevencimiento: el["new_fechadevencimiento"]
            ? moment(new Date(el["new_fechadevencimiento"]).toISOString()).format("DD/MM/YYYY")
            : "",
          new_fechadevencimiento_value: el["new_fechadevencimiento"] ?? null,
        };
      });

      setDocumentacionPendiente(formatted);
    } catch (err) {
      setError(err);
      setDocumentacionPendiente([]);
    } finally {
      setLoadingDocumentacion(false);
    }
  };

  const memoData = useMemo(() => documentacionPendiente, [documentacionPendiente]);

  return {
    documentacionPendiente: memoData,
    loadingDocumentacion,
    error,
    refetch: () => user?.accountid && token && fetchDocumentacion(user.accountid, token),
  };
};

export default useGetDocumentacionPorCuentaPendiente;
