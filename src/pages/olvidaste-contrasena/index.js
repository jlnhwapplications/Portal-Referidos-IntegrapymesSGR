import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Fade,
  Slide,
  Grow,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Icon from "../../@core/components/icon"
import ReCAPTCHA from "react-google-recaptcha"
import toast from "react-hot-toast"
import BlankLayout from "@/@core/layouts/BlankLayout"
import EmailIcon from "@mui/icons-material/Email"
import { useToast } from "@/@core/components/toast/ToastProvider"
import { RecaptchaKey } from "@/keys"
import { useAuth } from '@/hooks/useAuth'
import Link from "next/link"
// Styled Components
const BackgroundContainer = styled(Box)(({ theme, darkMode }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  // backgroundImage: darkMode ? "url(/images/dark-login-bg.png)" : "url(/images/light-login-bg.png)",
  background: `
    linear-gradient(135deg, ${theme.palette.primary.main}35 0%, ${theme.palette.secondary.main}25 100%),
    url("/images/fondo2.jpg") center/cover no-repeat
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle, ${theme.palette.primary.main}15, transparent 50%)`,
    zIndex: 1,
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

const ThemeToggle = styled(IconButton)(({ theme, darkMode }) => ({
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 3,
  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
  backdropFilter: "blur(10px)",
  border: darkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.1)",
  color: darkMode ? "#fff" : "#000",
  "&:hover": {
    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
    transform: "scale(1.05)",
  },
  transition: "all 0.3s ease",
}))

const StyledTextField = styled(TextField)(({ theme, darkMode }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
    },
    "&.Mui-focused": {
      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
    },
  },
  // "& .MuiInputLabel-root": {
  //   color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
  // },
  // "& .MuiOutlinedInput-input": {
  //   color: darkMode ? "#fff" : "#000",
  // },
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

const FeatureChip = styled(Chip)(({ theme, darkMode }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
  // color: darkMode ? "#fff" : "#000",
  border: darkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.08)",
  },
}))

const ForgotPassword = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [darkMode, setDarkMode] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [robot, setRobot] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()
  const steps = ["Correo", "Verificación", "Confirmación"]
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
  const auth = useAuth()

  const handleThemeToggle = () => {
    setDarkMode(!darkMode)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const robotOnChange = (value) => {
    setRobot(!!value)
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (!email) {
        toast.error("El correo es requerido")
        return
      }
      if (!validateEmail(email)) {
        toast.error("Por favor ingresa un email válido")
        return
      }
    }

    if (activeStep === 1) {
      if (!robot) {
        toast.error("Debes confirmar que no eres un robot")
        return
      }
      debugger
      handleForgotPasswordSubmit()
      return
    }

    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleForgotPasswordSubmit = async () => {
    debugger
    setLoading(true)

    try {
      if (!email) {
        toast.error('El correo es requerido!', {
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
        return
      }
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
        return
      }
      // Llama a la función `forgotPassword` del contexto de autenticación con el correo electrónico
      await auth.forgotPassword(email);
      // Puedes mostrar un mensaje al usuario indicando que se ha enviado un correo electrónico de recuperación de contraseña
      setEmailSent(true)
      setActiveStep(2)
      setLoading(false)
      toast.success('Se ha enviado un correo electrónico de recuperación de contraseña.', {
        theme: "dark",
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      setLoading(false)
      switch (error.code) {
        case 'auth/invalid-email':
          toast.error('El correo electrónico proporcionado no es válido.', {
            theme: "dark",
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          break;
        case 'auth/user-not-found':
          toast.error('No se encontró ningún usuario con el correo electrónico proporcionado.', {
            theme: "dark",
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          break;
        case 'auth/too-many-requests':
          toast.error('Demasiadas solicitudes. Por favor, inténtelo de nuevo más tarde.', {
            theme: "dark",
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          break;
        default:
          toast.error('Se produjo un error al solicitar el restablecimiento de contraseña.', {
            theme: "dark",
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={400}>
            <Box>
              <Box sx={{ textAlign: "center", mb: { sx: 3, xl: 4 } }} >
                <Icon
                  icon="mdi:lock-reset"
                  style={{
                    fontSize: 64,
                    color: darkMode ? "#667eea" : "#2196F3",
                    marginBottom: 16,
                  }}
                />
                <Typography
                  variant={esPantallaChica ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    // color: darkMode ? "#fff" : "#000",
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
                <Typography
                  variant={esPantallaChica ? "body2" : "body1"}
                  sx={{
                    // color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                    mb: 3,
                  }}
                >
                  No te preocupes, te ayudamos a recuperarla
                </Typography>
              </Box>

              <StyledTextField
                fullWidth
                type="email"
                label="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
                darkMode={darkMode}
                sx={{ my: 3 }}
                autoFocus
                error={email && !validateEmail(email)}
                helperText={email && !validateEmail(email) ? "Ingresa un email válido" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

            </Box>
          </Fade >
        )

      case 1:
        return (
          <Fade in timeout={600}>
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Icon
                  icon="mdi:robot"
                  style={{
                    fontSize: 64,
                    color: darkMode ? "#667eea" : "#2196F3",
                    marginBottom: 16,
                  }}
                />
                <Typography
                  variant={esPantallaChica ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Verificación de seguridad
                </Typography>
                <Typography
                  variant={esPantallaChica ? "body2" : "body1"}
                  sx={{
                    mb: 3,
                  }}
                >
                  Confirma que no eres un robot
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <ReCAPTCHA
                  size={6}
                  className=""
                  render="explicit"
                  sitekey={RecaptchaKey}
                  onChange={e => robotOnChange(e)}
                  theme={"dark"}
                />
              </Box>
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  backgroundColor: darkMode ? "rgba(33, 150, 243, 0.1)" : "rgba(33, 150, 243, 0.05)",
                }}
              >
                Enviaremos las instrucciones a: <strong>{email}</strong>
              </Alert>
            </Box>
          </Fade>
        )
      case 2:
        return (
          <Grow in timeout={600}>
            <Box sx={{ textAlign: "center" }}>
              <Icon
                icon="mdi:email-check"
                style={{
                  fontSize: 80,
                  color: "#4caf50",
                  marginBottom: 24,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  // color: darkMode ? "#fff" : "#000",
                }}
              >
                ¡Correo enviado!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  // color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                  mb: 3,
                }}
              >
                Hemos enviado las instrucciones de recuperación a tu correo electrónico.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  // color: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
                  mb: 4,
                }}
              >
                Revisa tu bandeja de entrada y spam
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 3 }}>
                <FeatureChip icon={<Icon color={theme.palette.primary.main} icon="mdi:email" />} label="Revisa tu email" darkMode={darkMode} />
                <FeatureChip icon={<Icon color={theme.palette.primary.main} icon="mdi:folder-alert" />} label="Verifica spam" darkMode={darkMode} />
              </Box>
            </Box>
          </Grow>
        )

      default:
        return null
    }
  }

  return (
    <BackgroundContainer darkMode={darkMode}>
      <ThemeToggle darkMode={darkMode} onClick={handleThemeToggle}>
        <Icon icon={darkMode ? "mdi:weather-sunny" : "mdi:weather-night"} />
      </ThemeToggle>

      <GlassCard darkMode={darkMode}>
        <Box sx={{ mb: 4 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            // orientation={isMobile ? "vertical" : "horizontal"}
            orientation={"horizontal"}
            sx={{
              "& .MuiStepLabel-label": {
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

        <Box sx={{ minHeight: 250 }}>{renderStepContent(activeStep)}</Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={activeStep === 0 || activeStep === 2}
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
            <GradientButton onClick={handleNext} disabled={loading} darkMode={darkMode} sx={{ position: "relative" }}>
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : activeStep === 1 ? (
                "Enviar instrucciones"
              ) : (
                "Continuar"
              )}
            </GradientButton>
          )}

          {activeStep === 2 && (
            <GradientButton onClick={() => (window.location.href = "/login")} darkMode={darkMode}>
              Volver al login
            </GradientButton>
          )}
        </Box>

        {activeStep === 0 && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                // color: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
              }}
            >
              ¿Recordaste tu contraseña?{" "}
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
                  Iniciar sesión
                </Typography>
              </Link>
            </Typography>
          </Box>
        )}
      </GlassCard>
    </BackgroundContainer>
  )
}

ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
