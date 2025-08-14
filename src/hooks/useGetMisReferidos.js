import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { obtenerMisReferidos } from "@/redux/Cuenta";


const useGetMisReferidos = () => {
    const dispatch = useDispatch();
    const { token, user } = useContext(AuthContext);
    const cuentasReferido = useSelector((store) => store.cuenta.cuentas);
    const retrieveCuenta = useSelector(store => store.cuenta.retrieveCuenta)
    const [loadingCuenta, setLoadingCuenta] = useState(false)
    const [cuentas, setCuentas] = useState([]);

    // useEffect(() => {
    //     if (user?.accountid && token) {
    //         setLoadingCuenta(true)
    //         dispatch(obtenerMisReferidos(user?.accountid, token))
    //         .then(data => {
    //             debugger
    //             if (data?.length > 0) {
    //                 setCuentas(data)
    //                 setLoadingCuenta(false)
    //             } else {
    //                 // setCuentas([])
    //                 setLoadingCuenta(false)
    //             }
    //         })
    //         .catch(() => {
    //             // setCuentas([])
    //             setLoadingCuenta(false)
    //         })
    //     }
    // }, []);

    // useEffect(() => {
    //     if (cuentasReferido?.length > 0) {
    //         setCuentas(cuentasReferido);
    //     }
    // }, [cuentasReferido, retrieveCuenta]);

    return {cuentas, loadingCuenta};
}
export default useGetMisReferidos;