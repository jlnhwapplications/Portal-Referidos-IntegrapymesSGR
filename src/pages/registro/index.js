import { useState, useEffect } from "react"
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Divider,
    Chip,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Card,
    CardContent,
    Fade,
    Slide,
    Grow,
    Zoom,
    Collapse,
    useTheme,
    useMediaQuery,
    CircularProgress,
    styled,
    Alert,
    FormControlLabel,
    Checkbox,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Icon from "../../@core/components/icon"
import BlankLayout from "@/@core/layouts/BlankLayout"
import SecurityIcon from "@mui/icons-material/Security"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import Link from 'next/link'
import ReCAPTCHA from "react-google-recaptcha"
import { RecaptchaKey } from "@/keys"
import { useToast } from "@/@core/components/toast/ToastProvider"
import { useAuth } from "@/hooks/useAuth"
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// Styled Components

const LoginContainer = styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    background: `
    linear-gradient(135deg, ${theme.palette.primary.main}35 0%, ${theme.palette.secondary.main}25 100%),
    url("/images/fondo2.jpg") center/cover no-repeat
  `,
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("/subtle-geometric-overlay.png") repeat',
        opacity: 0.08,
        zIndex: 0,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        top: "-50%",
        right: "-50%",
        width: "200%",
        height: "200%",
        background: `radial-gradient(circle, ${theme.palette.primary.main}15, transparent 50%)`,
        animation: "float 20s ease-in-out infinite",
        zIndex: 0,
    },
    "@keyframes float": {
        "0%, 100%": {
            transform: "translate(0, 0) rotate(0deg)",
        },
        "33%": {
            transform: "translate(-30px, -30px) rotate(120deg)",
        },
        "66%": {
            transform: "translate(30px, -20px) rotate(240deg)",
        },
    },
}))

const GlassCard = styled(Paper)(({ theme, darkMode }) => ({
    padding: theme.spacing(4),
    borderRadius: 24,
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 480,
    margin: theme.spacing(2),
    // background: darkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
    background: `${theme.palette.background.paper}95`,
    backdropFilter: "blur(20px)",
    border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: darkMode ? "0 20px 40px rgba(0, 0, 0, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: darkMode ? "0 25px 50px rgba(0, 0, 0, 0.5)" : "0 25px 50px rgba(0, 0, 0, 0.15)",
    },
}))

const GradientButton = styled(Button)(({ theme, darkMode }) => ({
    borderRadius: 12,
    padding: theme.spacing(1.5, 4),
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
    //   ? "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
    //   : "linear-gradient(45deg, #2196F3 0%, #1976D2 100%)",
    boxShadow: darkMode ? "0 8px 32px rgba(102, 126, 234, 0.3)" : "0 8px 32px rgba(33, 150, 243, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: darkMode ? "0 12px 40px rgba(102, 126, 234, 0.4)" : "0 12px 40px rgba(33, 150, 243, 0.4)",
    },
    "&:disabled": {
        background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        boxShadow: "none",
    },
}))

const LoginCard = styled(Paper)(({ theme, esPantallaChica }) => ({
    padding: theme.spacing(esPantallaChica ? 4 : 6),
    borderRadius: theme.spacing(3),
    boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
    backdropFilter: "blur(20px)",
    background: `${theme.palette.background.paper}95`,
    border: `1px solid ${theme.palette.divider}40`,
    position: "relative",
    zIndex: 1,
    maxWidth: 480,
    width: "100%",
    transition: "all 0.3s ease-in-out",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: theme.spacing(3),
        background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}05)`,
        zIndex: -1,
    },
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(4),
        margin: theme.spacing(0),
        borderRadius: theme.spacing(2),
        background: `${theme.palette.background.paper}98`,
    },
}))

const BrandSection = styled(Box)(({ theme, esPantallaChica }) => ({
    textAlign: "center",
    marginBottom: theme.spacing(4),
    "& .brand-icon": {
        width: esPantallaChica ? 38 : 54,
        height: esPantallaChica ? 38 : 54,
        borderRadius: theme.spacing(2),
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        marginBottom: theme.spacing(2),
        boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
        "&:hover": {
            transform: "scale(1.05)",
        },
        "&:active": {
            transform: "scale(0.95)",
        },
    },
}))

const SubmitButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 12px 40px ${theme.palette.primary.main}50`,
    },
    "&:disabled": {
        transform: "none",
        boxShadow: "none",
    },
}))

const Register = ({ onSwitchToLogin }) => {
    const theme = useTheme()
    const [registerSuccess, setRegiterSuccess] = useState(false)
    const [registerError, setRegisterError] = useState("")
    const [darkMode, setDarkMode] = useState(false)
    const [robot, setRobot] = useState(false)
    const { toast } = useToast()
    // States
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [passwordStrength, setPasswordStrength] = useState(0)
    // Animation states
    const [showForm, setShowForm] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const auth = useAuth()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
    const steps = ["Correo", "Credenciales", "Confirmación"]

    const onSubmit = async (data) => {
        const { email, password, usuario } = data;
        try {
            if (!robot) {
                toast.error('Debes confirmar que no eres un robot!', {
                    theme: "dark",
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            }
            setLoading(true)
            const result = await auth.register({ email, password, nombreUsuario: usuario });
            if (result.success) {
                setRegiterSuccess(true)
                setShowSuccess(true)
                handleNext()
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            setRegiterSuccess(false)
            let errorMessage = 'Error desconocido';
            // Maneja errores de Firebase Auth aquí
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error('El correo electrónico ya está en uso por otra cuenta.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'El correo electrónico ya está en uso por otra cuenta.';
                    break;
                case 'auth/invalid-email':
                    toast.error('La dirección de correo electrónico proporcionada no es válida.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'La dirección de correo electrónico proporcionada no es válida.';
                    break;
                case 'auth/operation-not-allowed':
                    toast.error('La operación de registro no está permitida.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'La operación de registro no está permitida.';
                    break;
                case 'auth/weak-password':
                    toast.error('La contraseña proporcionada es demasiado débil.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'La contraseña proporcionada es demasiado débil.';
                    break;
                case 'auth/network-request-failed':
                    toast.error('Hubo un problema de red al registrar la cuenta.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'Hubo un problema de red al registrar la cuenta.';
                    break;
                case 'auth/app-deleted':
                    toast.error('La instancia de la aplicación Firebase ha sido eliminada.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'La instancia de la aplicación Firebase ha sido eliminada.';
                    break;
                case 'auth/app-not-authorized':
                    toast.error('La aplicación no está autorizada para acceder a Firebase.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'La aplicación no está autorizada para acceder a Firebase.';
                    break;
                case 'auth/argument-error':
                    toast.error('Error de argumento al registrar la cuenta.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'Error de argumento al registrar la cuenta.';
                    break;
                case 'auth/internal-error':
                    toast.error('Error interno al registrar la cuenta.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'Error interno al registrar la cuenta.';
                    break;
                case 'auth/missing-iframe-start':
                    toast.error('Falta el iframe de inicio al registrar la cuenta.', {
                        theme: "dark",
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    errorMessage = 'Falta el iframe de inicio al registrar la cuenta.';
                    break;
                default:
                    // Puedes agregar más casos según sea necesario para otros códigos de error
                    break;
            }
            setError('email', {
                type: 'manual',
                message: errorMessage,
            });
        }
    };

    const robotOnChange = (value) => {
        if (value) {
            setRobot(true)
        } else {
            setRobot(false)
        }
    }

    const stepSchemas = [
        yup
            .object()
            .shape({
                email: yup.string().email("Email inválido").required("El email es requerido"),
            }),
        yup
            .object()
            .shape({
                password: yup
                    .string()
                    .min(8, "Mínimo 8 caracteres")
                    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Debe contener mayúscula, minúscula y número")
                    .required("La contraseña es requerida"),
                confirmPassword: yup
                    .string()
                    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
                    .required("Confirma tu contraseña"),
            })
    ]

    const defaultValues = {
        email: "",
        password: "",
        confirmPassword: "",
    }

    const {
        control,
        setError,
        handleSubmit,
        watch,
        trigger,
        formState: { errors, isValid }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(stepSchemas[activeStep])
    })

    const watchedPassword = watch("password")

    // Password strength calculation
    useEffect(() => {
        if (watchedPassword) {
            let strength = 0
            if (watchedPassword.length >= 8) strength += 25
            if (/[A-Z]/.test(watchedPassword)) strength += 25
            if (/[a-z]/.test(watchedPassword)) strength += 25
            if (/\d/.test(watchedPassword)) strength += 25
            setPasswordStrength(strength)
        } else {
            setPasswordStrength(0)
        }
    }, [watchedPassword])

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 50) return "error"
        if (passwordStrength < 75) return "warning"
        return "success"
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength < 25) return "Muy débil"
        if (passwordStrength < 50) return "Débil"
        if (passwordStrength < 75) return "Buena"
        return "Excelente"
    }

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Fade in timeout={400}>
                        <Box>
                            <Box sx={{ textAlign: "center", mb: { sx: 3, xl: 4 } }} >
                                <PersonAddAltIcon sx={{
                                    fontSize: 44,
                                    color: darkMode ? "#667eea" : "#2196F3",
                                }} />
                                <Typography
                                    variant={esPantallaChica ? "h5" : "h4"}
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    Regístrate
                                </Typography>
                                <Typography
                                    variant={esPantallaChica ? "body2" : "body2"}
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    Forma parte de nuestra comunidad en solo unos pasos!
                                </Typography>
                            </Box>
                            <Grid item xs={12} sx={{ pt: 2 }}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Correo Electrónico"
                                            type="email"
                                            error={!!errors.email}
                                            // autoFocus
                                            helperText={errors.email?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Icon icon="mdi:email-outline" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                                                    },
                                                    "&.Mui-focused": {
                                                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Box>
                    </Fade >
                )
            case 1:
                return (
                    <Fade in timeout={600}>
                        <Box>
                            <Box sx={{ textAlign: "center", mb: 4 }}>
                                <Typography
                                    variant={esPantallaChica ? "h6" : "h5"}
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    Credenciales de Acceso
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <FormControl fullWidth error={!!errors.password}>
                                                <InputLabel>Contraseña</InputLabel>
                                                <OutlinedInput
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    label="Contraseña"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <Icon icon="mdi:lock-outline" />
                                                        </InputAdornment>
                                                    }
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                <Icon icon={showPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"} />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    InputLabelProps={{
                                                        sx: {
                                                            color: theme.palette.text.primary,
                                                            "& .MuiFormLabel-asterisk": {
                                                                color: theme.palette.error.dark,
                                                            },
                                                        },
                                                    }}
                                                />
                                                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                    {watchedPassword && (
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <Typography variant="body2" sx={{ mr: 2 }}>
                                                    Fortaleza:
                                                </Typography>
                                                <Typography variant="body2" color={`${getPasswordStrengthColor()}.main`}>
                                                    {getPasswordStrengthText()}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={passwordStrength}
                                                color={getPasswordStrengthColor()}
                                                sx={{ height: 6, borderRadius: 3 }}
                                            />
                                        </Box>
                                    )}
                                    <Grid item xs={12} sx={{ mt: 4 }}>
                                        <Controller
                                            name="confirmPassword"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth error={!!errors.confirmPassword}>
                                                    <InputLabel>Confirmar Contraseña</InputLabel>
                                                    <OutlinedInput
                                                        {...field}
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        label="Confirmar Contraseña"
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Icon icon="mdi:lock-check-outline" />
                                                            </InputAdornment>
                                                        }
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                                    <Icon icon={showConfirmPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"} />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 4 }}>
                                    <ReCAPTCHA
                                        size={12}
                                        className=""
                                        render="explicit"
                                        sitekey={RecaptchaKey}
                                        onChange={e => robotOnChange(e)} />
                                </Grid>
                            </Box>
                        </Box>
                    </Fade>
                )
            case 2:
                return (
                    <Grow in timeout={600}>
                        <Box sx={{ textAlign: "center" }}>
                            <Zoom in={showSuccess} timeout={300}>
                                <Box textAlign="center" py={4}>
                                    <Grow in={showSuccess} timeout={800} style={{ transformOrigin: "center" }}>
                                        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                                    </Grow>
                                    <Slide direction="up" in={showSuccess} timeout={300}>
                                        <div>
                                            <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                                                ¡Bienvenido!
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                Registro exitoso. Redirigiendo...
                                            </Typography>
                                        </div>
                                    </Slide>
                                </Box>
                            </Zoom>
                        </Box>
                    </Grow>
                )

            default:
                return null
        }
    }

    const handleNext = async () => {
        const isStepValid = await trigger()
        if (isStepValid) {
            if (activeStep !== steps.length - 1) {
                setActiveStep((prevStep) => prevStep + 1)
            }
        }
    }

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1)
    }

    return (
        <LoginContainer>
            <GlassCard>
                <Fade in={true} timeout={400}>
                    <div style={{ width: "100%" }}>
                        <Fade in={showForm} timeout={400}>
                            <div>
                                <Box sx={{ mb: 4 }}>
                                    <Stepper
                                        activeStep={activeStep}
                                        alternativeLabel={!isMobile}
                                        // orientation={isMobile ? "vertical" : "horizontal"}
                                        orientation={"horizontal"}
                                        sx={{
                                            "& .MuiStepLabel-label": {
                                                fontSize: 12,
                                                color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                                                "&.Mui-active": {
                                                    color: darkMode ? "#667eea" : "#2196F3",
                                                },
                                                "&.Mui-completed": {
                                                    color: "#4caf50",
                                                },
                                            },
                                            "& .MuiStepIcon-root": {
                                                color: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                                                "&.Mui-active": {
                                                    color: darkMode ? "#667eea" : "#2196F3",
                                                },
                                                "&.Mui-completed": {
                                                    color: "#4caf50",
                                                },
                                            },
                                        }}
                                    >
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>
                                <Slide direction="up" in={showForm} timeout={400}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Box sx={{ minHeight: 250 }}>{renderStepContent(activeStep)}</Box>
                                        {
                                            (!registerSuccess || loading) && (
                                                <Box textAlign="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Ya tienes una cuenta?{" "}
                                                        <Link href="/login" style={{ textDecoration: 'none' }} passHref>
                                                            <Typography
                                                                component="span"
                                                                color="primary"
                                                                fontWeight={600}
                                                                sx={{
                                                                    fontSize: { xs: 14, xl: 16 },
                                                                    textDecoration: "none",
                                                                    "&:hover": { textDecoration: "underline" },
                                                                }}
                                                            >
                                                                Inicia Sesión
                                                            </Typography>
                                                        </Link>
                                                    </Typography>
                                                </Box>
                                            )
                                        }
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                                            <Button
                                                disabled={activeStep === 0 || activeStep === 2 || loading}
                                                onClick={handleBack}
                                                sx={{
                                                    color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                                                    "&:hover": {
                                                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                                                    },
                                                }}
                                            >
                                                Atrás
                                            </Button>
                                            {activeStep < 2 && (
                                                activeStep === 1 ? (
                                                    <SubmitButton
                                                        type="submit"
                                                        variant="contained"
                                                        size="large"
                                                        disabled={loading || !isValid}
                                                        sx={{ mb: 3, position: "relative" }}
                                                    >
                                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
                                                    </SubmitButton>
                                                ) : (
                                                    <GradientButton onClick={handleNext} disabled={loading} darkMode={darkMode} sx={{ position: "relative" }}>
                                                        Continuar
                                                    </GradientButton>
                                                )
                                            )}
                                            {(activeStep === 2 && !registerSuccess) && (
                                                <GradientButton onClick={() => (window.location.href = "/login")} darkMode={darkMode}>
                                                    Volver al login
                                                </GradientButton>
                                            )}
                                        </Box>
                                    </form>
                                </Slide>
                            </div>
                        </Fade>
                    </div>
                </Fade>
            </GlassCard >
            <Box position="absolute" bottom={16} left={16} sx={{ opacity: 0.6 }}>
                <Typography variant="caption" color="text.secondary">
                    v1.0.10
                </Typography>
            </Box>
        </LoginContainer >
    )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Register
