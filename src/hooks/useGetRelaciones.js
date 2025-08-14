import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { crearRelacionVinculacion, editarRelacionVinculacion, eliminarRelacionVinculacion, LimpiarRelacionesFETCH, obtenerRelacionesFETCH } from '@/redux/RelacionDeVinculacion'

const UseGetRelaciones = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const [loadingRelaciones, setLoadingRelaciones] = useState(false)
    const [relaciones, setRelaciones] = useState(null)

    useEffect(() => {
        if (token && referido) fetchData(token, referido);
    }, [token, referido]);

    const fetchData = async (token, referido) => {
        dispatch(obtenerRelacionesFETCH(referido?.accountid, token))
            .then(data => {
                if (data?.length > 0) {
                    var relacionesArray = []
                    data.forEach(item => {
                        var relacion = {
                            id: item.new_participacionaccionariaid,
                            new_participacionaccionariaid: item.new_participacionaccionariaid,
                            new_porcentajebeneficiario: item.new_porcentajebeneficiario,
                            contactid: item["ab.contactid"],
                            firstname: item["ab.firstname"],
                            lastname: item["ab.lastname"],
                            statuscode: item["ab.statuscode"],
                            new_cuitcuil: item["ab.new_cuitcuil"],
                            emailaddress1: item["ab.emailaddress1"],
                            new_correoelectrnicopararecibirestadodecuenta: item["ab.new_correoelectrnicopararecibirestadodecuenta"],
                            lastname: item["ab.lastname"],
                            birthdate: item["ab.birthdate"],
                            familystatuscode: item["ab.familystatuscode"],
                            familystatuscode_value: item["ab.familystatuscode@OData.Community.Display.V1.FormattedValue"],
                            new_nrodedocumento: item["ab.new_nrodedocumento"],
                            address3_line1: item["ab.address3_line1"],
                            address3_postalcode: item["ab.address3_postalcode"],
                            address3_city: item["ab.address3_city"],
                            address3_stateorprovince: item["ab.address3_stateorprovince"],
                            address3_country: item["ab.address3_country"],
                            address1_line1: item["ab.address1_line1"],
                            address1_postalcode: item["ab.address1_postalcode"],
                            address1_city: item["ab.address1_city"],
                            address1_stateorprovince: item["ab.address1_stateorprovince"],
                            address1_country: item["ab.address1_country"],
                            new_cuentacontactovinculado: item._new_cuentacontactovinculado_value,
                            tipo: item["_new_cuentacontactovinculado_value@Microsoft.Dynamics.CRM.lookuplogicalname"],
                            new_tipoderelacion_value: item["new_tipoderelacion@OData.Community.Display.V1.FormattedValue"],
                            new_tipoderelacion: item["new_tipoderelacion"],
                            _new_cuentacontactovinculado_value: item["_new_cuentacontactovinculado_value@OData.Community.Display.V1.FormattedValue"],
                            statecode: item.statecode,
                            accountid: item["aa.accountid"],
                            cuenta_new_nmerodedocumento: item["aa.new_nmerodedocumento"],
                            cuenta_razon_social: item["aa.name"],
                            cuenta_email: item["aa.emailaddress1"],
                            new_porcentajedeparticipacion: item.new_porcentajedeparticipacion,
                            new_personaexpuestapoliticamente: item["ab.new_personaexpuestapoliticamente"],
                            new_cargofuncinjerarquayenteendondetrabaja: item["ab.new_cargofuncinjerarquayenteendondetrabaja"],
                            new_relacinconlapersonaexpuestapolticamente: item["ab.new_relacinconlapersonaexpuestapolticamente"],
                            new_fechadealtabaja: item["ab.new_fechadealtabaja"],
                            new_fechadebaja: item["ab.new_fechadebaja"],
                            new_entedondetrabaja: item["ab.new_entedondetrabaja"],
                            new_lugardenacimiento: item["ab.new_lugardenacimiento"],
                            new_profesionoficioactividad: item["ab.new_profesionoficioactividad"],
                            telephone1: item["ab.telephone1"],
                            new_observaciones: item.new_observaciones,
                            new_cargo: item.new_cargo,
                            new_relacion: item["new_relacion"],
                            new_relacion_value: item["new_relacion@OData.Community.Display.V1.FormattedValue"],
                            new_firmante: item["new_firmante"],
                            new_firmante_value: item["new_firmante@OData.Community.Display.V1.FormattedValue"],
                        }
                        relacionesArray.push(relacion)
                    })
                    setRelaciones(relacionesArray)
                    setLoadingRelaciones(true)
                } else {
                    setRelaciones([])
                    setLoadingRelaciones(true)
                }
            })
            .catch(() => {
                setRelaciones([])
            })
    };

    const createRelacion = async (datos, accountid, esFirmante, token, toast) => {
        try {
            return new Promise((resolve, reject) => {
                debugger
                dispatch(crearRelacionVinculacion(datos, accountid, esFirmante, token, toast)).then(() => {
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

    const updateRelacion = async (datos, accountid, id, esFirmante, token, toast) => {
        try {
            return new Promise((resolve, reject) => {
                debugger
                dispatch(editarRelacionVinculacion(datos, accountid, id, esFirmante, token, toast)).then(() => {
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

    const deleteRelacion = async (id, token) => {
        try {
            dispatch(eliminarRelacionVinculacion(id, token)).then(() => {
                fetchData(token, referido);
            });
        }
        catch (error) {
            console.log("Error", error);
        }
    };

    const LimpiarRelaciones = () => {
        setRelaciones([])
        setLoadingRelaciones(false)
        dispatch(LimpiarRelacionesFETCH())
    };

    return { relaciones, loadingRelaciones, LimpiarRelaciones, createRelacion, updateRelacion, deleteRelacion };
};

export default UseGetRelaciones;