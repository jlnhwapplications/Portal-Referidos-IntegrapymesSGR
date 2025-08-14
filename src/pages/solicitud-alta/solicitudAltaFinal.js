import React, { useContext, useState } from 'react'
import { Box, Button, Typography, Container, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemIcon, Alert, AlertTitle, useTheme, alpha, Slide, Paper, Divider, Card, Chip, Grid, Tooltip, useMediaQuery } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux'
// import { redirect } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import CardContent from '@mui/material/CardContent';
import { obtenerUN } from '@/redux/UnidadDeNegocio'
import FilePresentIcon from '@mui/icons-material/FilePresent';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import { CorreoAdministracion } from '@/keys'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext';
// import { CheckCircle, CheckCircleOutline } from '@mui/icons-material';
import {
    CheckCircle,
    CheckCircleOutline,
    Business as BusinessIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    AccountBalance as AccountBalanceIcon,
    TrendingUp as TrendingUpIcon,
    CreditCard as CreditCardIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Security as SecurityIcon,
    Assignment as AssignmentIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from "@mui/icons-material"
import ReCAPTCHA from 'react-google-recaptcha';
import { RecaptchaKey } from '@/keys';
import { setearRobot } from '@/redux/DatosSolicitudAlta';

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const SolicitudAltaFinal = ({ ResetOnboarding, nuevaCuenta, envioConfirmado, enviarOnboarding }) => {
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const [mostrarIconoFinal, setMostrarIconoFinal] = React.useState(false)
    const [mostrarTextoFinal, setMostrarTextoFinal] = React.useState(false)
    const [progress, setProgress] = React.useState(0);
    const [UN, setUN] = React.useState({})
    const router = useRouter()
    const estadoOnboardingSelector = useSelector(store => store.datos.estadoOnboarding)
    const loadingOnboarding = useSelector(store => store.datos.loadingOnboarding)
    const porcentaje = useSelector(store => store.datos.porcentajeOnboarding)
    const { token } = useContext(AuthContext);
    // const token = useSelector(store => store.token.token)
    const unidadDeNegocio = useSelector(store => store.unidadesNegocio.unidadDeNegocio)
    const documentosNoCargados = useSelector(store => store.datos.documentosNoCargados)
    const razonSocial = useSelector(store => store.datos.razonSocial)
    const theme = useTheme()
    const isDark = theme?.palette?.mode === "dark"
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))

    const robotOnChange = (value) => {
        var valor = ""
        if (value) {
            valor = "True"
            // setRobot(true)
            dispatch(setearRobot(true))
        } else {
            valor = "False"
            // setRobot(false)
            dispatch(setearRobot(false))
        }
    }
    const [expandedCards, setExpandedCards] = useState({
        principal: esPantallaChica ? false : true,
        contacto: esPantallaChica ? false : true,
        fiscal: esPantallaChica ? false : true,
    })

    const toggleCard = (cardId) => {
        setExpandedCards((prev) => ({
            ...prev,
            [cardId]: !prev[cardId],
        }))
    }

    React.useEffect(() => {
        setProgress(porcentaje);
    }, [porcentaje]);

    React.useEffect(() => {
        if (token != undefined && token != '') {
            dispatch(obtenerUN(token))
        }
    }, [token])

    React.useEffect(() => {
        setProgress(porcentaje);
    }, []);

    React.useEffect(() => {
        if (unidadDeNegocio?.length > 0) {
            setUN(unidadDeNegocio[0])
        }
    }, [unidadDeNegocio]);


    const reinciarOnboarding = () => {
        ResetOnboarding()
        localStorage.removeItem("docsValues");
        localStorage.removeItem("formValues");
        localStorage.removeItem("documentosLufe");
        localStorage.removeItem("accionistasLufe");
        localStorage.clear();
        router.push('/')
        // window.location.reload()
    }

    React.useEffect(() => {
        if (estadoOnboardingSelector === 'EXITO') {
            setTimeout(() => {
                setMostrarIconoFinal(true)
            }, 500);
            setTimeout(() => {
                setMostrarTextoFinal(true)
            }, 700);
        }
    }, [estadoOnboardingSelector])

    const Mailto = ({ email, subject = '', body = '', children }) => {
        let params = subject || body ? '?' : '';
        if (subject) params += `subject=${encodeURIComponent(subject)}`;
        if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;

        return <a href={`mailto:${email}${params}`}>{children}</a>;
    };

    function onEmailClick() {
        window.open(`mailto:juan.nasif@hotmail.com`);
    }

    const InfoCard = ({ icon: Icon, title, children, color = "primary", onEdit, cardId, isExpanded }) => (
        <Card
            sx={{
                p: 0, m: 0,
                borderRadius: 3,
                background: isDark
                    ? `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)}, ${alpha(theme.palette[color].main, 0.02)})`
                    : `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.02)}, ${alpha(theme.palette[color].main, 0.01)})`,
                border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                },
            }}
        >
            <CardContent sx={{ py: { xs: 1, xl: 3 }, px: { xs: 2, xl: 3 } }}>
                {/* Header con botón de toggle */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: isExpanded ? 2 : 0,
                        cursor: "pointer",
                        p: 0,
                        m: 0
                    }}
                    onClick={() => toggleCard(cardId)}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                            sx={{
                                backgroundColor: alpha(theme.palette[color].main, 0.1),
                                color: theme.palette[color].main,
                                width: { xs: 28, xl: 34 },
                                height: { xs: 28, xl: 34 }
                            }}
                        >
                            <Icon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                        </Avatar>
                        <Typography
                            // variant="h6"
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: 18, xl: 22 },
                                color: theme.palette.text.primary,
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {onEdit && isExpanded && (
                            <Tooltip title="Editar información" arrow>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEdit()
                                    }}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette[color].main, 0.1),
                                            color: theme.palette[color].main,
                                        },
                                    }}
                                >
                                    <EditIcon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title={isExpanded ? "Ocultar información" : "Mostrar información"} arrow>
                            <IconButton
                                size="small"
                                sx={{
                                    color: theme.palette[color].main,
                                    backgroundColor: alpha(theme.palette[color].main, 0.1),
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette[color].main, 0.2),
                                    },
                                    transition: "transform 0.3s ease-in-out",
                                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                }}
                            >
                                <ExpandMoreIcon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Contenido colapsable */}
                <Box
                    sx={{
                        overflow: "hidden",
                        transition: "all 0.3s ease-in-out",
                        maxHeight: isExpanded ? "1000px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                    }}
                >
                    <Stack spacing={2} sx={{ pt: isExpanded ? 2 : 0 }}>
                        {children}
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    )

    const InfoCard2 = ({ icon: Icon, title, children, color = "primary", onEdit }) => (
        <Card
            sx={{
                borderRadius: 3,
                background: isDark
                    ? `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)}, ${alpha(theme.palette[color].main, 0.02)})`
                    : `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.02)}, ${alpha(theme.palette[color].main, 0.01)})`,
                border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                            sx={{
                                backgroundColor: alpha(theme.palette[color].main, 0.1),
                                color: theme.palette[color].main,
                                width: 48,
                                height: 48,
                            }}
                        >
                            <Icon />
                        </Avatar>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    {onEdit && (
                        <Tooltip title="Editar información" arrow>
                            <IconButton
                                size="small"
                                onClick={onEdit}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette[color].main, 0.1),
                                        color: theme.palette[color].main,
                                    },
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Stack spacing={2}>{children}</Stack>
            </CardContent>
        </Card>
    )

    const InfoRow = ({ label, value, icon: Icon }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* {Icon && (
                <Icon
                    sx={{
                        fontSize: 18,
                        color: theme.palette.text.secondary,
                    }}
                />
            )} */}
            <Box sx={{ flex: 1 }}>
                <Typography
                    // variant="body2"
                    sx={{
                        fontSize: { xs: 13, xl: 13 },
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                    }}
                >
                    {label}
                </Typography>
                <Tooltip
                    title={
                        <Box>
                            <Typography variant="caption" sx={{ color: "#fff", opacity: 0.9 }}>
                                {value || "No especificado"}
                            </Typography>
                        </Box>
                    }
                    arrow
                    placement="top"
                >
                    <Typography
                        // variant="body1"
                        sx={{
                            fontSize: { xs: 12, xl: 13 },
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            wordBreak: "break-word",
                        }}
                    >
                        {value.length > 16 ? value.substring(0, 16) + "..." : value || "No especificado"}
                    </Typography>
                </Tooltip>
            </Box>
        </Box>
    )

    const InfoRow2 = ({ label, value, icon: Icon }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {Icon && (
                <Icon
                    sx={{
                        fontSize: 18,
                        color: theme.palette.text.secondary,
                    }}
                />
            )}
            <Box sx={{ flex: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        mb: 0.5,
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        wordBreak: "break-word",
                    }}
                >
                    {value || "No especificado"}
                </Typography>
            </Box>
        </Box>
    )

    const MoneyChip = ({ amount, label }) => (
        <Chip
            label={`${label}: $${amount?.toLocaleString() || "0"}`}
            sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                "& .MuiChip-label": {
                    fontSize: "0.875rem",
                },
            }}
        />
    )

    const MoneyChip2 = ({ amount, label }) => (
        <Chip
            label={`${label}: $${amount?.toLocaleString() || "0"}`}
            sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                "& .MuiChip-label": {
                    fontSize: "0.875rem",
                },
            }}
        />
    )

    const obtenerRelacion = (relacion) => {
        switch (relacion) {
            case '100000000':
                return 'Titular'
            case '100000001':
                return 'Accionista'
            case '100000002':
                return 'Beneficiario'
            case '100000003':
                return 'Miembro del Directorio'
            case '100000004':
                return 'Representante Legal/Apoderado'
            case '100000005':
                return 'Otro'
            case '100000007':
                return 'Asesor/Estructurador del proyecto'
            default:
                return 'Titular'
        }
    }

    const obtenerTipoSocietario = (tipo) => {
        switch (tipo) {
            case '100000000':
                return 'S.A.'
            case '100000001':
                return 'S.R.L.'
            case '100000002':
                return 'Cooperativa'
            case '100000003':
                return 'Mutual'
            case '100000004':
                return 'Gobierno'
            case '100000005':
                return 'S.A.S.'
            case '100000006':
                return 'Asociación Civil sin Fines de Lucro'
            case '100000007':
                return 'ONG'
            case '100000008':
                return 'Fundación'
            case '100000009':
                return 'LLC'
            default:
                return 'S.A.'
        }
    }

    return (
        <CardContent sx={{ m: 0, p: 0, }}>
            {(loadingOnboarding && envioConfirmado.current) ?
                <Container component="main" maxWidth="md">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            py: 6,
                            px: 2,
                        }}
                    >
                        <LinearProgress sx={{
                            height: 12,
                            borderRadius: 6,
                        }} variant="determinate" value={progress} />
                        {/* <Box
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Typography align="center" variant="h6" sx={{ mt: 5 }}>
                                    Aguarde por favor, no cierre la ventana ya que se está procesando la información. Esta tarea puede demorar unos minutos....
                                </Typography>
                            </Box> */}
                        {/* Loading Message */}
                        <Box
                            sx={{
                                textAlign: "center",
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            }}
                        >
                            <Typography
                                variant="h6"
                                color="text.primary"
                                sx={{
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                    mb: 1,
                                }}
                            >
                                Procesando tu solicitud
                            </Typography>
                            <Box sx={{ my: 4 }}>
                                <LinearProgress sx={{
                                    height: 12,
                                    borderRadius: 6,
                                }} variant="determinate" value={progress} />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                Por favor, mantén esta ventana abierta mientras procesamos tu información. Este proceso puede tomar unos minutos...
                            </Typography>
                        </Box>
                        {/* Animated dots */}
                        {/* <Box sx={{ display: "flex", gap: 1 }}>
                                {[0, 1, 2].map((index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: theme.palette.primary.main,
                                            animation: `pulse 1.5s ease-in-out ${index * 0.2}s infinite`,
                                            "@keyframes pulse": {
                                                "0%, 80%, 100%": {
                                                    opacity: 0.3,
                                                    transform: "scale(0.8)",
                                                },
                                                "40%": {
                                                    opacity: 1,
                                                    transform: "scale(1)",
                                                },
                                            },
                                        }}
                                    />
                                ))}
                            </Box> */}
                    </Box>
                </Container>
                :
                null
                // </Slide >
            }
            {
                !envioConfirmado.current ?
                    // <Slide direction="left" in timeout={600}>
                    // <Box>
                    //     <Box sx={{ textAlign: "center", mb: 4 }}>
                    //         <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">
                    //             Confirmación
                    //         </Typography>
                    //         <Typography variant="body1" color="text.secondary">
                    //             Revisa los datos antes de enviar
                    //         </Typography>
                    //     </Box>
                    //     <Paper
                    //         elevation={isDark ? 4 : 2}
                    //         sx={{
                    //             p: 4,
                    //             bgcolor: isDark ? "#332C4E" : "#ffffff",
                    //             border: isDark ? "1px solid #4A4063" : "none",
                    //             borderRadius: 3,
                    //         }}
                    //     >
                    //         <Box textAlign="center">
                    //             <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                    //             <Typography variant="h6" gutterBottom>
                    //                 ¿Confirmas el envío de la garantía?
                    //             </Typography>
                    //             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    //                 Una vez enviada, la garantía será procesada por el sistema
                    //             </Typography>


                    //             <Alert
                    //                 severity="info"
                    //                 sx={{
                    //                     textAlign: "left",
                    //                     bgcolor: isDark ? alpha("#2196f3", 0.1) : alpha("#2196f3", 0.05),
                    //                     border: `1px solid ${isDark ? alpha("#2196f3", 0.3) : alpha("#2196f3", 0.2)}`,
                    //                 }}
                    //             >
                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Personeria: </Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('personeria') == "100000000" ? 'Jurídica' : 'Física'}
                    //                     </Typography>
                    //                 </Box>
                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{nuevaCuenta('personeria') == "100000000" ? 'Razón Social:' : 'Nombre Completo'}</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('nombreRazonSocial')}
                    //                     </Typography>
                    //                 </Box>
                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Cuit/Cuil</Typography> <Typography sx={{ ml: 2 }} variant="body2"> {nuevaCuenta('cuitCuilCdi')}</Typography>
                    //                 </Box>
                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Relación con la cuenta: </Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('relacionCuenta')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Tipo Societario:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('tipoSocietario')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Actividad AFIP:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('actividad')?.label}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Divider />
                    //                 <Typography variant='h6'>Contacto relacionado</Typography>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Nombre:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('nombre')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Apellido:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('apellido')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Cuit/Cuil:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('cuitCuil:')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Correo para usuario del portal:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('usuarioPortal')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Correo para notificaciones:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('emailNotificaciones')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Teléfono: </Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('telefono')}
                    //                     </Typography>
                    //                 </Box>

                    //                 <Divider />
                    //                 <Typography variant='h6'>Información Fiscal</Typography>

                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Facturación último año: $</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('facturacionIngreso')?.toLocaleString()}
                    //                     </Typography>
                    //                 </Box>


                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Destino Línea de Crédito:</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('destinoLineaDeCredito')?.label}
                    //                     </Typography>
                    //                 </Box>


                    //                 <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    //                     <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Línea de Crédito: $</Typography>
                    //                     <Typography sx={{ ml: 2 }} variant="body2">
                    //                         {nuevaCuenta('lineaDeCredito')?.toLocaleString()}
                    //                     </Typography>
                    //                 </Box>


                    //                 {/* <Typography variant="body2">Monto: ${watch("montoBruto")?.toLocaleString()}</Typography> */}
                    //             </Alert>
                    //         </Box>
                    //     </Paper>
                    // </Box > : null
                    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
                        {/* Header */}
                        <Box
                            sx={{
                                textAlign: "center",
                                mb: 1,
                                opacity: 0,
                                animation: "fadeInUp 0.3s ease-out forwards",
                                "@keyframes fadeInUp": {
                                    "0%": { opacity: 0, transform: "translateY(30px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mx: "auto",
                                    mb: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                    boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.3)}`,
                                }}
                            >
                                <CheckCircle sx={{ fontSize: 30 }} />
                            </Avatar>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Confirmación de Datos
                            </Typography>

                            {/* <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}>
                                Revisa cuidadosamente toda la información antes de enviar tu solicitud
                            </Typography> */}
                        </Box>

                        {/* Main Content */}
                        <Grid container spacing={2}>
                            {/* Información de la Empresa/Persona */}
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        opacity: 0,
                                        animation: "fadeInUp 0.3s ease-out 0.2s forwards",
                                        "@keyframes fadeInUp": {
                                            "0%": { opacity: 0, transform: "translateY(30px)" },
                                            "100%": { opacity: 1, transform: "translateY(0)" },
                                        },
                                    }}
                                >
                                    <InfoCard
                                        icon={nuevaCuenta("personeria") === "100000000" ? BusinessIcon : PersonIcon}
                                        title="Información de la Entidad"
                                        color="primary" cardId="principal"
                                        isExpanded={expandedCards.principal}
                                    // onEdit={() => onEdit("principal")}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow
                                                    label="Tipo de Personería"
                                                    value={
                                                        <Chip
                                                            label={nuevaCuenta("personeria") === "100000000" ? "Jurídica" : "Física"}
                                                            size="small"
                                                            color={nuevaCuenta("personeria") === "100000000" ? "primary" : "secondary"}
                                                            variant="outlined"
                                                        />
                                                    }
                                                />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow
                                                    label={nuevaCuenta("personeria") === "100000000" ? "Razón Social" : "Nombre Completo"}
                                                    value={nuevaCuenta("nombreRazonSocial")}
                                                    icon={nuevaCuenta("personeria") === "100000000" ? BusinessIcon : PersonIcon}
                                                />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="CUIT/CUIL" value={nuevaCuenta("cuitCuilCdi")} icon={AssignmentIcon} />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box sx={{ width: '32%' }}>
                                                {nuevaCuenta("tipoSocietario") && (
                                                    <InfoRow label="Tipo Societario" value={obtenerTipoSocietario(nuevaCuenta("tipoSocietario"))} />
                                                )}
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="Actividad AFIP" value={nuevaCuenta("actividad")?.label} icon={AssignmentIcon} />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="Condición AFIP" value={nuevaCuenta("condicionImp")?.label} icon={AssignmentIcon} />
                                            </Box>
                                        </Box>
                                    </InfoCard>
                                </Box>
                            </Grid>

                            {/* Información de Contacto */}
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        opacity: 0,
                                        animation: "fadeInUp 0.3s ease-out 0.4s forwards",
                                        "@keyframes fadeInUp": {
                                            "0%": { opacity: 0, transform: "translateY(30px)" },
                                            "100%": { opacity: 1, transform: "translateY(0)" },
                                        },
                                    }}
                                >
                                    <InfoCard icon={PersonIcon} title="Datos del Responsable" color="info" cardId="contacto"
                                        isExpanded={expandedCards.contacto}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow
                                                    label="Nombre Completo"
                                                    value={`${nuevaCuenta("nombre")} ${nuevaCuenta("apellido")}`}
                                                    icon={PersonIcon}
                                                />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="CUIT/CUIL" value={nuevaCuenta("cuitCuil")} icon={AssignmentIcon} />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="Usuario Portal" value={nuevaCuenta("usuarioPortal")} icon={AssignmentIcon} />
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="Tipo de Relación" value={obtenerRelacion(nuevaCuenta("relacionCuenta"))} />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="Correo Notificaciones" value={nuevaCuenta("emailNotificaciones")} icon={EmailIcon} />
                                            </Box>
                                            <Box sx={{ width: '32%' }}>
                                                <InfoRow label="Teléfono" value={nuevaCuenta("telefono")} icon={PhoneIcon} />
                                            </Box>

                                        </Box>
                                    </InfoCard>
                                </Box>
                            </Grid>
                            {/* Información Fiscal */}
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        opacity: 0,
                                        animation: "fadeInUp 0.3s ease-out 0.6s forwards",
                                        "@keyframes fadeInUp": {
                                            "0%": { opacity: 0, transform: "translateY(30px)" },
                                            "100%": { opacity: 1, transform: "translateY(0)" },
                                        },
                                    }}
                                >
                                    <InfoCard
                                        icon={TrendingUpIcon}
                                        title="Información Fiscal y Crediticia"
                                        color="success"
                                        cardId="fiscal"
                                        isExpanded={expandedCards.fiscal}
                                    // onEdit={() => onEdit("fiscal")}
                                    >
                                        <Grid container spacing={3} sx={{ m: 0, p: 0 }}>
                                            <Grid item xs={12} sm={4} >
                                                <Box sx={{ textAlign: "center" }}>
                                                    <Avatar
                                                        sx={{
                                                            width: { xs: 38, xl: 44 },
                                                            height: { xs: 38, xl: 44 },
                                                            mx: "auto",
                                                            mb: { xs: 1, xl: 2 },
                                                            // ml: { xs: 1, xl: 0 },
                                                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                                                            color: theme.palette.success.main,
                                                        }}
                                                    >
                                                        <TrendingUpIcon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                                                    </Avatar>
                                                    <Typography color="text.secondary" sx={{ mb: 1, fontSize: { xs: 13, xl: 14 } }}>
                                                        Facturación Último Año
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 700, color: theme.palette.success.main, fontSize: { xs: 12, xl: 13 } }}>
                                                        {dollarUS.format(nuevaCuenta("facturacionIngreso")?.toLocaleString()) || "0"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <Box sx={{ textAlign: "center" }}>
                                                    <Avatar
                                                        sx={{
                                                            width: { xs: 38, xl: 44 },
                                                            height: { xs: 38, xl: 44 },
                                                            mx: "auto",
                                                            mb: { xs: 1, xl: 2 },
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main,
                                                        }}
                                                    >
                                                        <CreditCardIcon />
                                                    </Avatar>
                                                    <Typography color="text.secondary" sx={{ mb: 1, fontSize: { xs: 13, xl: 14 } }}>
                                                        Línea de Crédito Solicitada
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 700, color: theme.palette.primary.main, fontSize: { xs: 12, xl: 13 } }}>
                                                        {dollarUS.format(nuevaCuenta("lineaDeCredito")?.toLocaleString()) || "0"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={4} sx={{ p: 0, m: 0 }}>
                                                <Box sx={{ textAlign: "center", p: 0, m: 0 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: { xs: 38, xl: 44 },
                                                            height: { xs: 38, xl: 44 },
                                                            mx: "auto",
                                                            mb: { xs: 1, xl: 2 },
                                                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                            color: theme.palette.info.main,
                                                        }}
                                                    >
                                                        <AccountBalanceIcon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                                                    </Avatar>
                                                    <Typography color="text.secondary" sx={{ mb: 1, fontSize: { xs: 13, xl: 14 } }}>
                                                        Destino del Crédito
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 600, textAlign: "center", fontSize: { xs: 12, xl: 13 } }}>
                                                        {nuevaCuenta("destinoLineaDeCredito")?.label || "No especificado"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </InfoCard>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Confirmation Alert */}
                        <Box
                            sx={{
                                mt: 2,
                                opacity: 0,
                                animation: "fadeInUp 0.3s ease-out 0.8s forwards",
                                "@keyframes fadeInUp": {
                                    "0%": { opacity: 0, transform: "translateY(30px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Alert
                                severity="warning"
                                sx={{
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                    "& .MuiAlert-icon": {
                                        fontSize: 28,
                                    },
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, mb: 1, fontSize: { xs: 14, xl: 15 } }}>
                                    ¿Confirmas el envío de la solicitud?
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 2, fontSize: { xs: 13, xl: 14 } }}>
                                    Una vez enviada, la solicitud será procesada por nuestro equipo. Asegúrate de que todos los datos sean
                                    correctos antes de continuar.
                                </Typography>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ display: 'flex', alignContent: 'end', mt: 3 }}>
                                    {/* <Button
                                        variant="outlined"
                                        startIcon={<VisibilityIcon />}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Revisar nuevamente
                                    </Button> */}
                                    <Box>
                                        <ReCAPTCHA
                                            size={6}
                                            className=""
                                            render="explicit"
                                            sitekey={RecaptchaKey}
                                            onChange={e => robotOnChange(e)}
                                        />
                                    </Box>
                                    <Box sx={{ alignContent: 'end' }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SecurityIcon />}
                                            onClick={enviarOnboarding}
                                            // onClick={onSubmit}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontWeight: 600,
                                                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                                "&:hover": {
                                                    background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                                                    transform: "translateY(-2px)",
                                                    boxShadow: theme.shadows[8],
                                                },
                                                transition: "all 0.3s ease-in-out",
                                            }}
                                        >
                                            Confirmar y Enviar
                                        </Button>
                                    </Box>

                                </Stack>
                            </Alert>
                        </Box>
                    </Box> : null
            }
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                m: 1,
                borderRadius: 1,
            }}>
                <Collapse in={mostrarIconoFinal} timeout={{ enter: 800 }}>
                    {/* <IconButton fontSize="inherit" color="primary" sx={{ fontSize: '120px' }}>
                        <BeenhereOutlinedIcon sx={{ fontSize: '80px' }} />
                    </IconButton> */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.2)})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CheckCircleOutline
                            sx={{
                                fontSize: 64,
                                color: theme.palette.success.main,
                            }}
                        />
                    </Box>
                </Collapse>
            </Box>
            <Collapse in={mostrarTextoFinal} timeout={{ appear: 400, enter: 800 }}>
                <Box
                    sx={{
                        textAlign: "center",
                        // maxWidth: 600,
                        my: 2,
                        opacity: mostrarTextoFinal ? 1 : 0,
                        transform: mostrarTextoFinal ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.8s ease-out 0.3s",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        ¡Felicitaciones!
                    </Typography>
                </Box>
                {
                    UN?.new_textoconfirmacionsolicitudaltasgr != undefined ?
                        <Typography variant="h6" align="center">
                            {UN?.new_textoconfirmacionsolicitudaltasgr}
                        </Typography> :
                        <Typography variant="h6" align="center">
                            Felicitaciones! has completado el primer paso. En breve nos comunicaremos contigo vía correo electrónico para informarte
                            del estado de tu solicitud. Cualquier duda podés enviar un correo informando nombre completo o razón social y Cuit/Cuil
                            al siguiente correo administracion@sgroneclick.com
                        </Typography>
                }
                {
                    documentosNoCargados?.length > 0 ?
                        <Box sx={{ mt: 3 }}>
                            <Alert severity="warning" variant="outlined">
                                <AlertTitle><Typography variant="h6">Advertencia</Typography></AlertTitle>
                                <Typography variant="h6" >
                                    Lamentablemente, no pudimos procesar algunos de los archivos adjuntos que intentaste enviar.
                                    Por favor, envie por <Mailto
                                        // email={CorreoAdministracion}
                                        subject={`Documentación faltante onboarding digital ${razonSocial}`}
                                        body="">
                                        correo
                                    </Mailto> los siguientes documentos:
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <List sx={{ width: '100%' }}>
                                        {
                                            documentosNoCargados.map(item => {
                                                return (
                                                    <ListItem key={item}>
                                                        <ListItemIcon>
                                                            <InsertDriveFileIcon color="warning" sx={{ fontSize: '24px' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="h6">{item}</Typography>} />
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                </Box>
                            </Alert>
                        </Box> : null
                }
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
                        {/* <Button
                            size="large"
                            variant="contained"
                            onClick={reinciarOnboarding}
                            sx={{
                                minWidth: 160,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1.5,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                "&:hover": {
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    transform: "translateY(-2px)",
                                    boxShadow: theme.shadows[8],
                                },
                                transition: "all 0.3s ease",
                            }}
                        >
                            Finalizar proceso
                        </Button> */}
                        <Button
                            sx={{
                                minWidth: 160,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1.5,
                                // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                "&:hover": {
                                    // background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    transform: "translateY(-2px)",
                                    boxShadow: theme.shadows[8],
                                },
                                transition: "all 0.3s ease",
                            }}

                            size="large" color="primary" variant="outlined" onClick={() => reinciarOnboarding()}>
                            Finalizar Proceso
                        </Button>
                    </Stack>
                </Box>
            </Collapse>
        </CardContent>
    )
}

export default SolicitudAltaFinal