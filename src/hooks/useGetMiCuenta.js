import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LimiparCuentaSelector, obtenerCuenta, obtenerMiCuenta } from '@/redux/Cuenta'

const UseGetMiCuenta = () => {
    const dispatch = useDispatch();
    const { token, referido } = useContext(AuthContext);
    const cuentaSelector = useSelector(store => store.cuenta.cuenta)
    const retrieveCuenta = useSelector(store => store.cuenta.retrieveCuenta)
    const [loadingCuenta, setLoadingCuenta] = useState(false)
    const [cuenta, setCuenta] = useState(null)

    // useEffect(() => {
    //     if (token != null && token != '') {
    //         // dispatch(obtenerCuenta(referido?.accountid, token))
    //         dispatch(obtenerMiCuenta(referido?.accountid, token))
    //         .then(data => {
    //             if (data?.length > 0) {
    //                 setCuenta(data)
    //                 setLoadingCuenta(false)
    //             } else {
    //                 setCuenta([])
    //                 setLoadingCuenta(false)
    //             }
    //         })
    //         .catch(() => {
    //             setCuenta([])
    //             setLoadingCuenta(false)
    //         })
    //     }
    // }, []);

    // useEffect(() => {
    //     try {
    //         if (Object.keys(cuentaSelector)?.length > 0 && retrieveCuenta) {
    //             setCuenta(cuentaSelector)
    //             setLoadingCuenta(false)
    //         }else if(retrieveCuenta){
    //             setLoadingCuenta(false)
    //         }
    //     } catch (err) {
    //         // console.log(err)
    //     }
    // }, [retrieveCuenta]);


    const LimpiarCuenta = () => {
        // dispatch(LimiparCuentaSelector())
        setLoadingCuenta(false)
        setCuenta(null)
     };

    return { cuenta, loadingCuenta, LimpiarCuenta };
};

export default UseGetMiCuenta;