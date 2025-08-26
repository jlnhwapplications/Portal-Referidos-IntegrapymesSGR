import useGetLufe from '@/hooks/useGetLufe'
import { obtenerTipoDeDocumentos } from '@/redux/DatosSolicitudAlta'
import React, { useContext, useEffect, useState } from 'react'
import * as yup from 'yup'
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '@/context/AuthContext';
import Paper from '@/@core/theme/overrides/paper';
import { Box, Button, CardContent, CircularProgress, Collapse, Container, FormHelperText, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import BlankLayout from '@/@core/layouts/BlankLayout';
import CustomSearchSelect from '@/@core/components/customFields/CustomSearchSelect';
import CustomTextField from '@/@core/components/customFields/CustomTextField';
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import { useRouter } from 'next/router'

const IndexLufe = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { entidad, getLufe, setLufe } = useGetLufe()
    const [tiposDocumentos, setTiposDocumentos] = React.useState([])
    const [llamadaDocumentos, setLlamadaDocumentos] = React.useState(false)
    const tipoDocumentoSelector = useSelector(store => store.datos.tiposDocumentos)
    const retrieveTipoDocumentoSelector = useSelector(store => store.datos.retrieveTipoDocumento)
    const loadingLufe = useSelector(store => store.cuenta.loadingLufe)
    const loadingSetLufe = useSelector(store => store.cuenta.loadingGenerarLufe)
    const estadoEntidadLufe = useSelector(store => store.cuenta.estadoEntidadLufe)
    const { token } = useContext(AuthContext);
    const [nombre, setNombre] = useState('')
    const [personeria, setPersoneria] = useState('')
    const [onboardingInexistente, setOnboardingInexistente] = useState(false)
    const [mostrarTextoFinal, setMostrarTextoFinal] = React.useState(false)
    const [mostrarIconoFinal, setMostrarIconoFinal] = React.useState(false)
    const [mostrarFormulario, setMostrarFormulario] = React.useState(true)

    React.useEffect(() => {
        if (tipoDocumentoSelector.length > 0 && llamadaDocumentos === true && token != '') {
            const opcionesDocumentos = [];
            tipoDocumentoSelector.forEach(element => {
                if (element.new_onboarding === true) {
                    var tipo = { value: element.new_tipodedocumentoid, label: element.new_name }
                    opcionesDocumentos.push(tipo);
                }
            });
            setTiposDocumentos(opcionesDocumentos)
        } else if (token != '' && token != null && llamadaDocumentos === false) {
            obtenerTiposDocumentos()
            setLlamadaDocumentos(true)
        }
    }, [tipoDocumentoSelector, token])

    React.useEffect(() => {
        if (estadoEntidadLufe === 'EXITO') {
            setTimeout(() => {
                setMostrarFormulario(false)
            }, 250);
            setTimeout(() => {
                setMostrarIconoFinal(true)
            }, 500);
            setTimeout(() => {
                setMostrarTextoFinal(true)
            }, 700);
        }
    }, [estadoEntidadLufe])

    useEffect(() => {
        if (Object.keys(entidad)?.length > 0) {
            if (entidad?.nombre !== undefined && entidad?.nombre !== null) {
                setNombre(entidad.nombre)
                setValue('nombre', entidad.nombre)
                setPersoneria(entidad.personeria)
                setValue('personeria', entidad.personeria)
            } else {
                setOnboardingInexistente(true)
            }
        }
    }, [entidad])

    const defaultValues = {
        servicio: '100000000',
        tipoDeDocumento: null,
        nombre: '',
        cuitCuil: '',
        usuarioPortal: '',
    }

    const validacionSchema = yup.object().shape({
        tipoDeDocumento: yup.object().required(),
        cuitCuil: yup.number('Sin espacios ni guiones').required().positive().integer(),
        usuarioPortal: yup.string().email().required()
    });

    const methods = useForm({
        shouldUnregister: false,
        defaultValues,
        resolver: yupResolver(validacionSchema),
        mode: "onChange"
    })

    const { handleSubmit, trigger, setValue } = methods;

    const formData = methods.watch();

    const obtenerTiposDocumentos = async () => {
        dispatch(obtenerTipoDeDocumentos(token))
    }

    const ValidateCUITCUIL = (cuit) => {
        let acumulado = 0;
        let respuesta = false;
        let digitos = cuit.split('');
        let digito = parseInt(digitos.pop());

        for (let i = 0; i < digitos.length; i++) {
            acumulado += digitos[9 - i] * (2 + (i % 6));
        }

        let verif = 11 - (acumulado % 11);
        if (verif === 11) {
            verif = 0;
        } else if (verif === 10) {
            verif = 9;
        }
        respuesta = (digito === verif);
        return respuesta;
    }

    const buscarPymeLufe = (datos) => {
        // const validacionCuit = ValidateCUITCUIL(datos.cuitCuil)
        // if (validacionCuit) {
        getLufe(datos.cuitCuil)
        // }
    }

    const generarPymeLufe = (datos) => {
        // const validacionCuit = ValidateCUITCUIL(datos.cuitCuil)
        // if (validacionCuit) {
        setLufe(datos.usuarioPortal, datos.nombre, datos.cuitCuil, datos.tipoDeDocumento)
        // }
    }

    const resetOnb = () => {
        methods.reset()
    }

    const LinkStyled = styled(Link)(({ theme }) => ({
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: theme.palette.primary.main
    }))

    const reinciarOnboarding = () => {
        resetOnb()
        router.replace('/');
    }

    console.log("ref")

    return (
        <Container component="main" sx={{ mb: 4, fontSize: 22 }}>
            {/* <Paper elevation={8} sx={{
                my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 },
                // minHeight: 600 
            }}> */}
            <Grid sx={{ p: 4 }}>
                {
                    mostrarFormulario ? <Grid item xs={12}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <img src={"/images/argentina-presidencia.png"} alt="logo" style={{ width: 'auto' }} />
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 2, textAlign: "center" }}>
                            <Typography variant="h6">
                                Bienvenido, nuesto sistema de Onboarding se encuentra conectado con el Legajo Único Financiero y Económico (Lufe).
                            </Typography>
                        </Box>

                        <FormProvider {...methods}>
                            <form>
                                <Grid container spacing={2}>
                                    {
                                        personeria != '' ?
                                            <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                                                <CustomTextField
                                                    Component={TextField}
                                                    label="Personeria"
                                                    name="personeria"
                                                />
                                            </Grid> : null
                                    }
                                    {
                                        nombre != '' ?
                                            <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                                                <CustomTextField
                                                    Component={TextField}
                                                    label="Razon Social"
                                                    name="nombre"
                                                />
                                            </Grid> : null
                                    }
                                    {
                                        onboardingInexistente ?
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 2, mt: 4 }}>
                                                <Typography variant="h6">
                                                    Lamentablemente, no encontramos tu cuit en nuestra base de datos. Por favor, complete su onboarding <LinkStyled href='/solicitud-alta'>aquí</LinkStyled> o vuelva a intentar con otro cuit.
                                                </Typography>
                                            </Box>
                                            : null
                                    }
                                    {

                                        !onboardingInexistente ?
                                            <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                                                <CustomSearchSelect
                                                    name="tipoDeDocumento"
                                                    lab="Tipo de documento"
                                                    helperText="Por favor, seleccione el tipo de documento"
                                                    options={tiposDocumentos}
                                                    noOptions={retrieveTipoDocumentoSelector && tiposDocumentos.length === 0 ? true : false}
                                                    rules={{ required: "Required!" }}
                                                    req={true}
                                                    sx={{ fontWeight: 400 }}
                                                />
                                            </Grid> : null
                                    }
                                    {
                                        !onboardingInexistente ?
                                            <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                                                <CustomTextField
                                                    Component={TextField}
                                                    label="CUIT/CUIL"
                                                    name="cuitCuil"
                                                    helperText="Por favor escribe tu CUIT/CUIL sin espacios ni guiones"
                                                    rules={{ required: "Required!" }}
                                                    req="true"
                                                />
                                                <FormHelperText sx={{ mx: 1, color: '#f57c00' }} id="outlined-weight-helper-text">
                                                    ! Sin espacios ni guiones !
                                                </FormHelperText>
                                            </Grid> : null
                                    }
                                    {
                                        !onboardingInexistente ?
                                            <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                                                <CustomTextField
                                                    Component={TextField}
                                                    name="usuarioPortal"
                                                    label="Usuario Portal"
                                                    rules={{ required: "Required!" }}
                                                    helperText="Por favor escribe tu email que usaras en el portal"
                                                    req="true"
                                                />
                                                <FormHelperText sx={{ mx: 1, color: '#f57c00' }} id="outlined-weight-helper-text">
                                                    ¡ Este usuario debe ingresarse con formato de correo electrónico y debe ser único.
                                                    Se usara luego para iniciar sesión cuando se habilite el acceso en el portal del socio !
                                                </FormHelperText>
                                            </Grid> : null
                                    }
                                </Grid>
                                <Grid xs={6} sx={{ pt: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {
                                            (!onboardingInexistente && nombre == '') ?
                                                <Box sx={{ mt: 3, mb: 2, position: "relative" }}>
                                                    <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 7 }} disabled={loadingLufe} onClick={handleSubmit(buscarPymeLufe)}>
                                                        Consultar
                                                    </Button>
                                                    {loadingLufe && (
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
                                                </Box> : null
                                        }
                                        {
                                            (!onboardingInexistente && nombre != '') ?
                                                <Box sx={{ mt: 3, mb: 2, position: "relative" }}>
                                                    <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 7 }} disabled={loadingSetLufe} onClick={handleSubmit(generarPymeLufe)}>
                                                        Enviar
                                                    </Button>
                                                    {loadingSetLufe && (
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
                                                </Box> : null
                                        }
                                        {
                                            onboardingInexistente ?
                                                <Grid xs={6} sx={{ pt: 4 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 7 }} disabled={loadingSetLufe} onClick={() => resetOnb()}>
                                                            volver
                                                        </Button>
                                                    </Box>
                                                </Grid> : null
                                        }
                                    </Box>
                                </Grid>
                            </form>
                        </FormProvider>
                    </Grid>
                        : null
                }
            </Grid>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                m: 1,
                borderRadius: 1,
            }}>
                <Collapse in={mostrarIconoFinal} timeout={{ enter: 800 }}>
                    <IconButton fontSize="inherit" color="primary" sx={{ fontSize: '120px' }}>
                        <BeenhereOutlinedIcon sx={{ fontSize: '80px' }} />
                    </IconButton>
                </Collapse>
            </Box>
            <Collapse in={mostrarTextoFinal} timeout={{ appear: 400, enter: 800 }}>
                {/* {
                    UN?.new_textoconfirmacionsolicitudaltasgr != undefined ?
                        <Typography variant="h6" align="center" sx={{ fontFamily: 'Roboto' }}>
                            {UN?.new_textoconfirmacionsolicitudaltasgr}
                        </Typography> : */}
                <Typography variant="h6" align="center" sx={{ fontFamily: 'Roboto' }}>
                    Felicitaciones! has completado el primer paso. En breve nos comunicaremos contigo vía correo electrónico para informarte
                    del estado de tu solicitud. Cualquier duda podés enviar un correo informando nombre completo o razón social y Cuit/Cuil
                    al siguiente correo administracion@integrapymes.com
                </Typography>
                {/* } */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 1,
                    m: 1,
                    mt: 5,
                    borderRadius: 1,
                }}>
                    <Stack direction="row" spacing={2}>
                        <Button size="large" color="primary" variant="outlined" onClick={() => reinciarOnboarding()}>
                            Finalizar
                        </Button>
                    </Stack>
                </Box>
            </Collapse>

            {/* </Paper> */}
        </Container>
    )
}

IndexLufe.getLayout = page => <BlankLayout>{page}</BlankLayout>
export default IndexLufe