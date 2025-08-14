import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CrearSociedadBolsaSocio, inactivarSociedadBolsa, ModificarSociedadBolsaSocio, obtenerSociedadesXsocio } from "@/redux/Cuenta";

const useGetSociedadesBolsaxSocio = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const [sociedadXbolsa, setSociedadXbolsa] = useState(null)
    const [loadingSociedades, setLoadingSociedades] = useState(false);

    useEffect(() => {
        if (token && referido) fetchData(token, referido);
    }, [token, referido]);

    const fetchData = async (token, referido) => {
        try {
            dispatch(obtenerSociedadesXsocio(referido?.accountid, token))
                .then(data => {
                    if (data?.length > 0) {
                        var socXsoc = []
                        data.filter(item => item.statecode == '0').forEach(item => {
                            var sociedad = {
                                new_cuentacomitente: item.new_cuentacomitente,
                                id: item.new_sociedaddebolsaporsocioid,
                                statuscode: item.statuscode,
                                new_sociedaddebolsa_value: item["_new_sociedaddebolsa_value@OData.Community.Display.V1.FormattedValue"],
                                new_sociedaddebolsaid: item._new_sociedaddebolsa_value,
                                _new_socio_value: item["_new_socio_value@OData.Community.Display.V1.FormattedValue"],
                                _new_socio_value_id: item._new_socio_value,
                                statecode: item.statecode
                            }
                            socXsoc.push(sociedad)
                        })
                        console.log(`Sociedades ${JSON.stringify(socXsoc)}`)
                        setSociedadXbolsa(socXsoc)
                        setLoadingSociedades(true)
                    } else {
                        setSociedadXbolsa([])
                        setLoadingSociedades(true)
                    }
                })
                .catch(() => {
                    setSociedadXbolsa([])
                })
        } catch (error) {
            console.log(error)
        }
    };

    const createSociedad = async (accountid, datos, token, toast) => {
        try {
            return new Promise((resolve, reject) => {
                dispatch(CrearSociedadBolsaSocio(accountid, datos, token, toast)).then(() => {
                    fetchData(token, referido);
                    resolve()
                })
                    .catch(err => {
                        reject(err)
                    })
            })

        } catch (error) {
            console.log("Error", error);
        }
    };

    const updateSociedad = async (id, accountid, datos, token, toast) => {
        try {
            debugger
            return new Promise((resolve, reject) => {
                dispatch(ModificarSociedadBolsaSocio(id, accountid, datos, token, toast)).then(() => {
                    fetchData(token, referido);
                    resolve()
                })
                    .catch(err => {
                        reject(err)
                    })
            })
        } catch (error) {
            console.log("Error", error);
        }
    };

    const deleteSociedad = async (id, token, toast) => {
        try {
            debugger
            dispatch(inactivarSociedadBolsa(id, token, toast)).then(() => {
                fetchData(token, referido);
            });
        }
        catch (error) {
            console.log("Error", error);
        }
    };

    return { sociedadXbolsa, loadingSociedades, createSociedad, updateSociedad, deleteSociedad };
};

export default useGetSociedadesBolsaxSocio;