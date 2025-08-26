// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import { useContext, useEffect, useState } from 'react'
import { obtenerDetalle } from '@/redux/Garantias'
import { AuthContext } from '@/context/AuthContext'
import { useDispatch } from 'react-redux'
import { columns_cheques } from '@/columns/columnsImportaciones'
import moment from 'moment'
import { Box, Button, CircularProgress, Grid, Skeleton } from '@mui/material'
import { registrarError } from '@/redux/Error'

const TablaCargaMasiva = () => {
    const dispatch = useDispatch()
    const [importaciones, setImportaciones] = useState([])
    const { token, referido } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [actualizar, setActualizar] = useState(false)
    const [cargaCheques, setCargaCheques] = useState(false)
    const [loadingActualizar, setLoadingActualizar] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // dispatch(obtenerDetalle(referido.accountid, token))
                //     .then(data => {
                //         var opciones = []
                //         data.forEach(item => {
                //             var importador = {
                //                 id: item.new_importacionesid,
                //                 new_name: item["nota.filename"] ? item["nota.filename"] : "",
                //                 createdon: moment(new Date(item["createdon"])).format('DD/MM/yyyy HH:mm'),
                //                 new_detalledeejecucion: item?.new_detalledeejecucion
                //             }
                //             opciones.push(importador);
                //         });
                //         if (opciones?.length > 0) {
                //             setImportaciones(opciones)
                //             setLoading(false)
                //         } else {
                //             setImportaciones([])
                //             setLoading(false)
                //         }
                //     })
                //     .catch(error => {
                //         setImportaciones([])
                //         setLoading(false)
                //         dispatch(registrarError("Error al cargar del detalle de cheques", error?.data, "SGROneClick", token))
                //     })

                setTimeout(() => {
                    setImportaciones([])
                    setLoading(false)
                }, 2000);
            } catch (error) {
                registrarError("Error al cargar del detalle de cheques", error, "SGROneClick", token)
                setLoading(false)
            }
        };

        if (token != null && token != '') {
            if (importaciones?.length === 0 && cargaCheques == false) {
                setCargaCheques(true)
                fetchData()
            }
        }
    }, [importaciones, token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setLoadingActualizar(true)
                dispatch(obtenerDetalle(referido.accountid, token))
                    .then(data => {
                        var opciones = []
                        data.forEach(item => {
                            var importador = {
                                id: item.new_importacionesid,
                                new_name: item["nota.filename"] ? item["nota.filename"] : "",
                                createdon: moment(new Date(item["createdon"])).format('DD/MM/yyyy HH:mm'),
                                new_detalledeejecucion: item?.new_detalledeejecucion
                            }
                            opciones.push(importador);
                        });
                        if (opciones?.length > 0) {
                            setImportaciones(opciones)
                            setLoading(false)
                            setLoadingActualizar(false)
                        } else {
                            setImportaciones([])
                            setLoading(false)
                            setLoadingActualizar(false)
                        }
                    })
                    .catch(error => {
                        setImportaciones([])
                        setLoadingActualizar(false)
                        setLoading(false)
                        dispatch(registrarError("Error al cargar del detalle de cheques", error?.data, "SGROneClick", token))
                    })
            } catch (error) {
                registrarError("Error al cargar del detalle de cheques", error, "SGROneClick", token)
                setLoadingActualizar(false)
                setLoading(false)
            }
        };

        if (token != null && token != '') {
            if (actualizar) {
                setActualizar(false)
                fetchData()
            }
        }
    }, [actualizar]);

    return (
        <>
            {
                loading ?
                    <Grid item xs={12} sx={{ mt: 4 }}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            {/* <CircularProgress /> */}
                            <Skeleton variant="rounded" animation="wave" width="100%" height={180} />
                        </Box>
                    </Grid> :
                    <Box>
                        <Table
                            addRow={false}
                            data={importaciones?.length > 0 ? importaciones : []}
                            columns={columns_cheques}
                            canExport={false}
                        />
                    </Box>
            }
            {
                importaciones?.length > 0 ?
                    <Grid>
                        <Grid item xs={4}>
                            <Box sx={{ mt: 3, mb: 2, position: "relative" }}>
                                <Button fullWidth size="large" onClick={() => setActualizar(true)} variant="contained" sx={{ mb: 7 }} disabled={loadingActualizar}>
                                    Actualizar Tabla
                                </Button>
                                {loadingActualizar && (
                                    <CircularProgress
                                        size={30}
                                        sx={{
                                            color: 'green',
                                            position: "absolute",
                                            top: "30%",
                                            left: "50%",
                                            marginTop: "-12px",
                                            marginLeft: "-12px",
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    : null
            }
        </>
    )
}

export default TablaCargaMasiva
