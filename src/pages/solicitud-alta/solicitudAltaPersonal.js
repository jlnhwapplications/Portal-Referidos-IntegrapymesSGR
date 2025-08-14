import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import CustomTextField from '../../@core/components/customFields/CustomTextField';
import CustomSelect from '../../@core/components/customFields/CustomSelect';
import { alpha, Avatar, Box, Container, Divider, Fade, Slide, Typography } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import UseGetProvincias from '@/hooks/useGetProvincias';
import UseGetPaises from '@/hooks/useGetPaises';
import CustomSearchSelect from '@/@core/components/customFields/CustomSearchSelect';
import { DireccionOnbHabilitado } from '@/keys'
import { AccountBalance, Badge, Email } from '@mui/icons-material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

const SolicitudAltaPersonal = ({ personeria, theme }) => {
    const { opcionesProvincias } = UseGetProvincias()
    const { opcionesPaises } = UseGetPaises()
    const [relacionConLaCuentaOpciones, setRelacionConLaCuentaOpciones] = React.useState([])
    const isDark = theme.palette.mode === "dark"

    React.useEffect(() => {
        if (personeria === "100000000") { //Juridica
            setRelacionConLaCuentaOpciones([
                { value: '100000001', label: 'Accionista' },
                { value: '100000002', label: 'Beneficiario' },
                { value: '100000003', label: 'Miembro del Directorio' },
                { value: '100000004', label: 'Representante Legal/Apoderado' },
                { value: '100000007', label: 'Asesor/Estructurador del proyecto' },
                { value: '100000005', label: 'Otro' }
            ])
        } else if (personeria === "100000001") { //Humana
            setRelacionConLaCuentaOpciones([
                { value: '100000000', label: 'Titular' },
                { value: '100000007', label: 'Asesor/Estructurador del proyecto' },
                { value: '100000005', label: 'Otro' }
            ])
        }
    }, [])

    return (
        <Fade in timeout={600}>
            <Container maxWidth="lg" >
                <Box display="flex" alignItems="center" gap={2} mb={2} mt={2}>
                    <Avatar
                        sx={{
                            bgcolor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1),
                            color: isDark ? "#64b5f6" : "#1976d2",
                            width: 40,
                            height: 40,
                        }}
                    >
                        <Badge fontSize="small" />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: { xs: 18, xl: 22 } }} fontWeight="bold" color="text.primary">
                            Datos del Responsable
                        </Typography>
                        <Typography sx={{ fontSize: { xs: 13, xl: 16 } }} color="text.secondary">
                            Información del representante de la cuenta
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3, borderColor: isDark ? "#4A4063" : "#e0e0e0" }} />
                <Grid container spacing={1}>
                    <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="nombre"
                            label="Nombre"
                            rules={{ required: "Required!" }}
                            helperText="Ingresa tu nombre"
                            req="true"
                            placeholder="Nombre"
                        />
                    </Grid>
                    <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="apellido"
                            label="Apellido"
                            rules={{ required: "Required!" }}
                            helperText="Ingresa tu apellido"
                            req="true"
                            placeholder="Apellido"
                        />

                    </Grid>
                    <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="cuitCuil"
                            label="CUIT/CUIL"
                            rules={{ required: "Required!" }}
                            helperText="Ingresa tu CUIT/CUIL"
                            req="true"
                            placeholder="XX-XXXXXXXX-X"
                        />
                        <FormHelperText sx={{ fontSize: { xs: 11, xl: 12 }, mx: 1, color: isDark ? theme.palette.warning.main : theme.palette.warning.dark }} id="outlined-weight-helper-text">
                            ¡ Sin espacios ni guiones !
                        </FormHelperText>
                    </Grid>
                    <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="usuarioPortal"
                            label="Usuario Portal"
                            rules={{ required: "Required!" }}
                            helperText="Ingresa tu email que usaras en el portal"
                            req="true"
                            startAdornment={<Email sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />}
                        />
                        <FormHelperText sx={{ fontSize: { xs: 11, xl: 12 }, mx: 1, color: isDark ? theme.palette.warning.main : theme.palette.warning.dark }} id="outlined-weight-helper-text">
                            ¡Este usuario debe ingresarse con formato de correo electrónico y debe ser único.
                            Se usara luego para iniciar sesión cuando se habilite el acceso en el portal del socio!
                        </FormHelperText>
                    </Grid>
                    <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="emailNotificaciones"
                            label="Email para Notificaciones"
                            rules={{ required: "Required!" }}
                            helperText="Ingresa tu email para notificaciones"
                            req="true"
                            startAdornment={<Email sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />}
                        />
                        <FormHelperText sx={{ fontSize: { xs: 11, xl: 12 }, mx: 1, color: isDark ? theme.palette.warning.main : theme.palette.warning.dark }} id="outlined-weight-helper-text">
                            ¡Correo electrónico del contacto donde el sistema enviará las notificaciones y novedades!
                        </FormHelperText>
                    </Grid>
                    <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                        <CustomSelect
                            name="relacionCuenta"
                            label="Relación con la cuenta"
                            helperText="Por favor seleccione un valor"
                            options={relacionConLaCuentaOpciones}
                            rules={{ required: "Required!" }}
                            placeholder="Relacion de la cuenta"
                        />
                    </Grid>
                    <Grid xs={12} sm={6} item sx={{ pt: 0, pb: 0 }}>
                        <CustomTextField
                            Component={TextField}
                            name="telefono"
                            label="Teléfono"
                            rules={{ required: "Required!" }}
                            helperText="Ingresa tu Teléfono"
                            req="true"
                            startAdornment={
                                <PhoneIphoneIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />}
                        />
                    </Grid>
                    {
                        DireccionOnbHabilitado ?
                            <>
                                <Grid xs={12} item sx={{ pt: 0, pb: 0 }} >
                                    <Typography variant='body1'>
                                        Dirección
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }} >
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        name="calle"
                                        label="Calle"
                                        rules={{ required: "Required!" }}
                                        helperText="Ingresa tu calle"
                                        req="true"
                                    />
                                </Grid>
                                <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }} >
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        type="number"
                                        name="calleNumero"
                                        label="N° de calle"
                                        rules={{ required: "Required!" }}
                                        helperText="Ingresa tu número de calle"
                                        req="true"
                                    />
                                </Grid>
                                <Grid xs={12} sm={2} item sx={{ pt: 0, pb: 0 }} >
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        name="piso"
                                        label="Piso"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2} sx={{ pt: 0, pb: 0 }}>
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        name="depto"
                                        label="Departamento"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ pt: 0, pb: 0 }}>
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        name="codPostal"
                                        label="Código Postal"
                                        rules={{ required: "Required!" }}
                                        helperText="Ingresa tu código postal"
                                        req="true"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ pt: 0, pb: 0 }}>
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        name="munParCom"
                                        label="Municipio / Partido / Comuna"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ pt: 0, pb: 0 }}>
                                    <CustomTextField
                                        Component={TextField}
                                        fullWidth
                                        name="localidad"
                                        label="Localidad"
                                        rules={{ required: "Required!" }}
                                        helperText="Ingresa tu localidad"
                                        req="true"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} sx={{ pt: 0, pb: 0 }}>
                                    <CustomSearchSelect
                                        name="provincia"
                                        lab="Provincia"
                                        helperText="Por favor seleccione un valor"
                                        options={opcionesProvincias}
                                        noOptions={opcionesProvincias?.length === 0 ? true : false}
                                        rules={{ required: "Required!" }}
                                        req="true"
                                    />
                                </Grid><Grid item xs={12} sm={6} md={6} sx={{ pt: 0, pb: 0 }}>
                                    <CustomSearchSelect
                                        name="pais"
                                        lab="País"
                                        helperText="Por favor seleccione un valor"
                                        options={opcionesPaises}
                                        noOptions={opcionesPaises?.length === 0 ? true : false}
                                        rules={{ required: "Required!" }}
                                        req="true"
                                    />
                                </Grid>
                            </> : null
                    }
                </Grid>
                {/* </Paper> */}
                {/* <Paper elevation={4}> */}
                {/* <CardContent> */}
                {/* <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 40, height: 40 }}>
                        <Badge />
                    </Avatar>
                    <Box>
                        <Typography variant="h5">
                            Datos del Responsable
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "0.75rem", md: "0.80rem", xl: "0.85rem" } }} color="text.secondary">
                            Información del representante de la cuenta
                        </Typography>
                    </Box>
                </Box> */}
                {/* </CardContent>
            <CardContent> */}

                {/* </CardContent> */}
                {/* </Paper> */}

            </Container>
        </Fade>
    )
}

export default SolicitudAltaPersonal