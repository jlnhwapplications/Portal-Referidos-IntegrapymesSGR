import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { obtenerSociedadeDeBolsa } from "@/redux/Cuenta";

const useGetSociedadesDeBolsa = () => {
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);
    const [opcionesSociedadBolsa, setOpcionesSociedadBolsa] = useState(null)
    const [llamada, setLlamada] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch(obtenerSociedadeDeBolsa(token))
                .then(data => {
                if (data?.length > 0) {
                    let opcionesSociedades = []
                    data.forEach(item => {
                        let sociedad = { label: item.new_name, value: item.new_sociedaddebolsaid }
                        opcionesSociedades.push(sociedad)
                    })
                    setOpcionesSociedadBolsa(opcionesSociedades)
                    setLlamada(true)
                }})
                .catch(() => {
                    setOpcionesSociedadBolsa([])
                })
        } catch (error) {
            console.log(error)
        }
        };

        if (token != null && token != '' && !llamada) {
            if(!opcionesSociedadBolsa){
                fetchData()
            }
        }
    }, [opcionesSociedadBolsa])

    const memoData = useMemo(() => opcionesSociedadBolsa, [opcionesSociedadBolsa])

    return { opcionesSociedadBolsa: memoData};
};

export default useGetSociedadesDeBolsa;