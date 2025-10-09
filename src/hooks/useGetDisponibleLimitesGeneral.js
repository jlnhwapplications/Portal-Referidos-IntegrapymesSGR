import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "@/context/AuthContext";
import { UrlApi } from "@/keys";

// Hook para obtener el disponible general de los límites (línea general)
// Filtra productos con línea de operación 100000000 y statecode activo (=0)
// Sólo de cuentas referidas (=1) y asignadas al comercial (user.accountid)
const useGetDisponibleLimitesGeneral = () => {
  const { token, user } = useContext(AuthContext);
  const [disponibles, setDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.accountid || !token) return;
    fetchDisponible(user.accountid, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accountid, token]);

  const fetchDisponible = async (accountId, tk) => {
    try {
      setLoading(true);
      setError(null);

      const entidad = "new_productoses";
      const fetch =
        "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
        "<entity name='new_productos'>" +
        "<attribute name='new_productosid'/>" +
        "<attribute name='new_name'/>" +
        "<attribute name='createdon'/>" +
        "<attribute name='new_vigenciahasta'/>" +
        "<attribute name='new_montodisponiblegeneral'/>" +
        "<attribute name='new_cuenta'/>" +
        "<attribute name='transactioncurrencyid'/>" +
        "<order attribute='new_name' descending='false'/>" +
        "<filter type='and'>" +
        "<condition attribute='new_lineatipodeoperacion' operator='eq' value='100000000'/>" +
        "<condition attribute='statecode' operator='eq' value='0'/>" +
        "<condition attribute='statuscode' operator='eq' value='100000001'/>" +
        "<condition attribute='new_mostrarenportalsocio' operator='eq' value='1'/>" +
        "</filter>" +
        "<link-entity name='account' from='accountid' to='new_cuenta' link-type='inner' alias='ad'>" +
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
      const formatted = data.map((el) => ({
        id: el["new_productosid"],
        new_productosid: el["new_productosid"],
        new_name: el["new_name"],
        createdon: el["createdon"]
          ? moment(new Date(el["createdon"]).toISOString()).format("DD/MM/YYYY")
          : "",
        new_vigenciahasta: el["new_vigenciahasta"]
          ? moment(new Date(el["new_vigenciahasta"]).toISOString()).format("DD/MM/YYYY")
          : "",
        new_montodisponiblegeneral: el["new_montodisponiblegeneral"] ?? 0,
        new_montodisponiblegeneral_value:
          el["new_montodisponiblegeneral@OData.Community.Display.V1.FormattedValue"] ?? null,
        new_cuenta: el["_new_cuenta_value@OData.Community.Display.V1.FormattedValue"] ?? el["new_cuenta"],
        new_cuenta_value: el["_new_cuenta_value"] ?? el["new_cuenta"],
        transactioncurrencyid: el["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"]
      }));

      setDisponibles(formatted);
    } catch (err) {
      setError(err);
      setDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  const memoData = useMemo(() => disponibles, [disponibles]);

  return {
    disponibles: memoData,
    loading,
    error,
    refetch: () => user?.accountid && token && fetchDisponible(user.accountid, token),
  };
};

export default useGetDisponibleLimitesGeneral;
