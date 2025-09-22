import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Unstable_Grid2';
import CardContent from '@mui/material/CardContent';
import CustomSelect from '../../@core/components/customFields/CustomSelect';
import { obtenerCondicionImpositiva, obtenerReferidor } from '@/redux/DatosSolicitudAlta';
import Paper from '@mui/material/Paper';
import CustomCurrencyField from '../../@core/components/customFields/CustomCurrencyField';
import CustomSearchSelect from '../../@core/components/customFields/CustomSearchSelect';
import { referidorOnboarding, LineaDeCreditoHabilitado } from '@/keys'
import useGetCondicionesAFIP from '@/hooks/useGetCondicionesAFIP';
import UseGetDestinoDeFondos from '@/hooks/useGetDestinoDeFondos';
import UseGetSectorEconomico from '@/hooks/useGetSectorEconomico';
import { Info } from '@mui/icons-material';
import { alpha, Avatar, Box, Container, Divider, Fade, TextField, Typography, useTheme } from '@mui/material';
import CustomTextField from '@/@core/components/customFields/CustomTextField';

const SolicitudAltaCuenta = ({ personeria, token, actividadPrincipal, actividadAfip }) => {
    const dispatch = useDispatch()
    const { condiciones } = useGetCondicionesAFIP()
    const { opcionesDestinoDeFondos } = UseGetDestinoDeFondos()
    const { opcionesSectorEconomico } = UseGetSectorEconomico()
    const [referidores, setReferidores] = React.useState([])
    const [llamadaReferidores, setLlamadaReferidores] = React.useState(false)
    const referidoresSelector = useSelector(store => store.datos.referidores)
    const retrieveActividadAFIPSelector = useSelector(store => store.datos.retrieveActividadAFIP)
    const retrieveCondicionAFIPSelector = useSelector(store => store.datos.retrieveCondicionAFIP)
    const retrieveReferidorSelector = useSelector(store => store.datos.retrieveReferidor)
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"

    React.useEffect(() => {
        if (personeria !== '') {
            if (personeria === '100000000') {
                var societario = document.getElementById('societario')
                societario.style.display = 'block';
            }
        }
    }, [])

    React.useEffect(() => {
        if (referidoresSelector.length > 0 && llamadaReferidores === true) {
            const referidoresAux = [];
            referidoresSelector.forEach(element => {
                var lbl = ''
                lbl += element.name ? element.name : '-'
                lbl += ' - '
                lbl += element.new_nmerodedocumento ? element.new_nmerodedocumento : '-'
                var referidor = { value: element.accountid, label: lbl }
                referidoresAux.push(referidor);
            });
            setReferidores(referidoresAux)
        } else if (token != '' && llamadaReferidores === false) {
            dispatch(obtenerReferidor(token))
            setLlamadaReferidores(true)
        }
    }, [referidoresSelector, token])

    const tiposSocietariosOpciones = [
        { value: '100000000', label: 'S.A.' },
        { value: '100000001', label: 'S.R.L.' },
        { value: '100000002', label: 'Cooperativa' },
        { value: '100000003', label: 'Mutual' },
        { value: '100000004', label: 'Gobierno' },
        { value: '100000005', label: 'S.A.S.' },
        { value: '100000006', label: 'Asociación Civil sin Fines de Lucro' },
        { value: '100000007', label: 'ONG' },
        { value: '100000008', label: 'Fundación' },
        { value: '100000009', label: 'LLC' }
    ]

    return (
        <Fade in timeout={600}>
            <Container maxWidth="lg" mt={2}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                        sx={{
                            bgcolor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1),
                            color: isDark ? "#64b5f6" : "#1976d2",
                            width: 40,
                            height: 40,
                        }}
                    >
                        <Info fontSize="small" />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: { xs: 18, xl: 22 } }} fontWeight="bold" color="text.primary">
                            Datos Adicionales
                        </Typography>
                        <Typography sx={{ fontSize: { xs: 13, xl: 16 } }} color="text.secondary">
                            Información fiscal y otros detalles
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3, borderColor: isDark ? "#4A4063" : "#e0e0e0" }} />
                <Grid container spacing={1}>
                    <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                        <CustomSearchSelect
                            name="actividad"
                            lab="Actividad AFIP"
                            helperText="Por favor seleccione un valor"
                            options={actividadAfip}
                            noOptions={retrieveActividadAFIPSelector && actividadAfip.length === 0 ? true : false}
                            rules={{ required: "Required!" }}
                            req="true"
                        />
                    </Grid>
                    <Grid xs={12} sm={6} item id="societario" sx={{ pt: 0, pb: 0 }} style={{ display: 'none' }}>
                        <CustomSelect
                            name="tipoSocietario"
                            label="Tipo de Societario"
                            helperText="Por favor seleccione un valor"
                            options={tiposSocietariosOpciones}
                            rules={{ required: "Required!" }}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ pt: 0, pb: 0 }} item id="condicion">
                        <CustomSearchSelect
                            name="condicionImp"
                            lab="Condición de Inscripción ante AFIP"
                            helperText="Por favor seleccione un valor"
                            options={condiciones}
                            noOptions={retrieveCondicionAFIPSelector && condiciones.length === 0 ? true : false}
                            rules={{ required: "Required!" }}
                            req="true"
                        />
                    </Grid>
                    <Grid xs={12} sm={6} sx={{ pt: 0, pb: 0 }} item>
                        <CustomCurrencyField
                            name="facturacionIngreso"
                            label="Facturación/Ingresos Último Año"
                            rules={{ required: "Required!" }}
                            // helperText="Ingresa tu facturacion/ingresos del último año"
                            req="false"
                        />
                    </Grid>
                    {
                        LineaDeCreditoHabilitado ?
                            <Grid xs={12} item sx={{ pt: 0, pb: 0 }}>
                                <Box
                                    sx={{
                                        my: 1,
                                        p: { xs: 2, xl: 3 },
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.4 : 0.2)}`,
                                        backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.light, 0.12)
                                    }}
                                >
                                    <Typography fontWeight="600" sx={{ fontSize: { xs: 16, xl: 18 }, mb: 1 }} color="text.primary">
                                        Destino de Fondos
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Indica el destino y el monto estimado de la linea solicitada.
                                    </Typography> */}
                                    <Grid container spacing={2}>
                                        <Grid xs={12} sm={6} item>
                                            <CustomSearchSelect
                                                name="destinoLineaDeCredito"
                                                lab="Destino Linea de Credito"
                                                helperText="Por favor seleccione un valor"
                                                options={opcionesDestinoDeFondos}
                                                noOptions={opcionesDestinoDeFondos?.length === 0 ? true : false}
                                                rules={{ required: "Required!" }}
                                                req="true"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={6} item>
                                            <CustomCurrencyField
                                                name="lineaDeCredito"
                                                label="Linea de Credito"
                                                rules={{ required: "Required!" }}
                                                // helperText="Ingresa tu linea de credito"
                                                req="true"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid> : null
                    }
                    <Grid xs={12} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="observaciones"
                            label="Observaciones"
                            helperText="Ingresa una descripción"
                            placeholder="Descripción de la actividad, reseña, referencias"
                            multiline={true}
                            minRows={2}
                            maxRows={3}
                            maxLength={2000}
                        />
                    </Grid>
                    {/* <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                        {
                            referidorOnboarding ?
                                <Grid xs={12} sm={6} item>
                                    <CustomSearchSelect
                                        name="cuitReferidor"
                                        lab="Referidor"
                                        noOptions={retrieveReferidorSelector && referidores.length === 0 ? true : false}
                                        options={referidores}
                                    />
                                </Grid>
                                : null
                        }
                    </Grid> */}
                </Grid>
                {/* </Paper> */}
            </Container>
        </Fade>
    )
}

export default SolicitudAltaCuenta
