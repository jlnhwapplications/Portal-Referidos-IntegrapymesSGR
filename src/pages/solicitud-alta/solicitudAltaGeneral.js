import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import CustomSearchSelect from '../../@core/components/customFields/CustomSearchSelect';
import CustomTextField from '../../@core/components/customFields/CustomTextField';
import CustomSelect from '../../@core/components/customFields/CustomSelect';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import useGetTipoDocumentos from '@/hooks/useGetTipoDocumentos';
import useGetLufe from '@/hooks/useGetLufe';
import { lufeHabilitado } from '@/keys';
import { Alert, alpha, Avatar, Box, Card, Chip, Container, Divider, Fade, Typography, useTheme } from '@mui/material';
import { AccountBalance, Business, CheckCircle, CorporateFare, Info, Person, Warning } from '@mui/icons-material';
import { Controller } from 'react-hook-form';

const SolicitudAltaGeneral = ({ token, lufeConsultado, theme, control, setValue, error }) => {
    const { tiposDocumentos } = useGetTipoDocumentos()
    const isDark = theme.palette.mode === "dark"
    const [person, setPerson] = useState('')
    const [personeriaSeleccionada, setPersoneriaSeleccionada] = useState(false)
    // const { consultaLufe } = useGetLufe()
    const personeriaOnChange = (event) => {
        setPersoneriaSeleccionada(true)
        setPerson(event)
        setValue('personeria', event)
    }

    const personeriaOpciones = [
        { value: "100000001", label: "Persona Física", icon: Person, color: "#2e7d32" },
        { value: "100000000", label: "Persona Jurídica", icon: Business, color: "#1976d2" },
    ]

    useEffect(() => {
        var currentData = localStorage.getItem("formValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        setPerson(currentData.personeria)
        if (currentData?.personeria === '100000001' || currentData?.personeria === '100000000') {
            personeriaOnChange(currentData?.personeria)
        }
    }, [])

    // Componente para secciones del formulario
    function FormSection({ title, icon: IconComponent, children, alert = null, theme, isDark }) {

        return (
            <Box sx={{ mb: { xs: 2, xl: 4 } }}>
                {alert && (
                    <Alert
                        severity={alert.severity}
                        icon={alert.severity === "warning" ? <Warning /> : <Info />}
                        sx={{
                            mb: { xs: 2, xl: 3 },
                            bgcolor: isDark
                                ? alpha(alert.severity === "warning" ? "#ff9800" : "#2196f3", 0.1)
                                : alpha(alert.severity === "warning" ? "#ff9800" : "#2196f3", 0.05),
                            border: `1px solid ${isDark
                                ? alpha(alert.severity === "warning" ? "#ff9800" : "#2196f3", 0.3)
                                : alpha(alert.severity === "warning" ? "#ff9800" : "#2196f3", 0.2)
                                }`,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" fontWeight="medium">
                            {alert.message}
                        </Typography>
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {children}
                </Grid>
            </Box>
        )
    }

    const PersoneriaCard = ({ option, selected, onClick, disabled = false }) => {
        const theme = useTheme()
        const isDark = theme.palette.mode === "dark"
        const IconComponent = option?.icon

        return (
            <Card
                elevation={selected ? 8 : 2}
                onClick={!disabled ? onClick : undefined}
                sx={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    bgcolor: isDark ? "#332C4E" : "#ffffff",
                    border: selected ? `2px solid ${option?.color}` : `2px solid ${isDark ? "#4A4063" : "#e0e0e0"}`,
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    opacity: disabled ? 0.5 : 1,
                    maxWidth: 600,
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: selected ? alpha(option?.color, 0.1) : "transparent",
                        transition: "all 0.3s ease",
                    },
                    "&:hover": !disabled && {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: `0 8px 30px ${alpha(option?.color, 0.3)}`,
                        "&::before": {
                            background: alpha(option?.color, 0.15),
                        },
                    },
                    "& > *": {
                        position: "relative",
                        zIndex: 1,
                    },
                }}
            >
                <CardContent sx={{ p: 3, textAlign: "center" }} >
                    <Avatar
                        sx={{
                            width: { xs: 44, xl: 64 },
                            height: { xs: 44, xl: 64 },
                            bgcolor: selected ? option?.color : alpha(option?.color, 0.1),
                            color: selected ? "#ffffff" : option?.color,
                            mx: "auto",
                            mb: { xs: 1, xl: 2 },
                            transition: "all 0.3s ease",
                            boxShadow: selected ? `0 8px 25px ${alpha(option?.color, 0.4)}` : "none",
                        }}
                    >
                        <IconComponent fontSize={'40'} />
                    </Avatar>
                    <Typography
                        // variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            fontSize: { xs: 16, xl: 22 },
                            color: selected ? option.color : "text.primary",
                            transition: "color 0.3s ease",
                        }}
                    >
                        {option.label}
                    </Typography>
                    {selected && (
                        <Chip
                            icon={<CheckCircle fontSize="small" />}
                            label="Seleccionado"
                            sx={{
                                mt: { xs: 1, xl: 2 },
                                fontSize: { xs: 12, xl: 14 },
                                fontWeight: "bold",
                                bgcolor: option.color,
                                color: "#ffffff",
                                boxShadow: `0 4px 12px ${alpha(option.color, 0.3)}`,
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <>
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
                            <AccountBalance fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: { xs: 18, xl: 22 } }} fontWeight="bold" color="text.primary">
                                Información de la Entidad
                            </Typography>
                            <Typography sx={{ fontSize: { xs: 13, xl: 16 } }} color="text.secondary">
                                Complete los datos básicos de su organización
                            </Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ mb: { xs: 1, xl: 3 }, borderColor: isDark ? "#4A4063" : "#e0e0e0" }} />
                    {/* <Grid container spacing={2}> */}
                    <FormSection
                        title="Tipo de Personería"
                        icon={CorporateFare}
                        alert={{
                            severity: "info",
                            message: "Selecciona si se trata de una persona física o jurídica",
                        }}
                    >
                        {personeriaOpciones.map((option) => (
                            <Grid item xs={6} key={option.value} >
                                <PersoneriaCard
                                    option={option}
                                    selected={person === option.value}
                                    onClick={() => personeriaOnChange(option.value)}
                                />
                            </Grid>
                        ))}
                        {
                            (error?.formState?.errors?.personeria?.message && !personeriaSeleccionada) ?
                                <Typography sx={{ ml: 2, fontSize: { xs: 11, xl: 12 }, color: theme.palette.error.dark }}>
                                    La personeria es requerida
                                </Typography> : null

                        }
                    </FormSection>
                    <Fade in={personeriaSeleccionada} timeout={600}>
                        <Grid container spacing={1}>
                            {
                                (lufeConsultado === true || !lufeHabilitado) ?
                                    <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                                        <CustomTextField
                                            Component={TextField}
                                            name="nombreRazonSocial"
                                            label={person == 100000001 ? "Nombre completo" : "Razón Social"}
                                            helperText="Ingresa tu nombre o razón social"
                                            rules={{ required: "Required!" }}
                                            req="true"
                                        />
                                    </Grid> : null
                            }
                            <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                                <CustomSearchSelect
                                    name="tipoDeDocumento"
                                    lab="Tipo de documento"
                                    helperText="Por favor seleccione un valor"
                                    options={tiposDocumentos}
                                    // noOptions={tiposDocumentos.length === 0 ? true : false}
                                    rules={{ required: "Required!" }}
                                    req={true}
                                    sx={{ fontWeight: 400 }}
                                />
                            </Grid>
                            <Grid xs={12} sm={4} item sx={{ pt: 0, pb: 0 }}>
                                <CustomTextField
                                    Component={TextField}
                                    label="CUIT/CUIL"
                                    name="cuitCuilCdi"
                                    helperText="Ingresa tu CUIT/CUIL sin espacios ni guiones"
                                    rules={{ required: "Required!" }}
                                    req="true"
                                    placeholder="XX-XXXXXXXX-X"
                                />
                                <FormHelperText sx={{ fontSize: { xs: 11, xl: 12 }, mx: 1, color: isDark ? theme.palette.warning.main : theme.palette.warning.dark }} id="outlined-weight-helper-text">
                                    ! Sin espacios ni guiones !
                                </FormHelperText>
                            </Grid>
                        </Grid>
                    </Fade>
                </Container>
            </Fade>
        </>
    )
}

export default SolicitudAltaGeneral