import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Fade,
  Slide,
  Grow,
  Zoom,
  Collapse,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
// Icons
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import GoogleIcon from "@mui/icons-material/Google"
import AppleIcon from "@mui/icons-material/Apple"
import SecurityIcon from "@mui/icons-material/Security"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BlankLayout from "@/@core/layouts/BlankLayout"
import { useAuth } from "@/hooks/useAuth"

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

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.spacing(8),
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
    borderRadius: theme.spacing(8),
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

const BrandSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  "& .brand-icon": {
    width: 54,
    height: 54,
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

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  textTransform: "none",
  fontWeight: 500,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    borderColor: theme.palette.primary.main,
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(4),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderWidth: 2,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
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

const FeatureChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(3),
  background: `${theme.palette.success.main}15`,
  color: theme.palette.success.main,
  fontSize: "0.875rem",
  fontWeight: 500,
  margin: theme.spacing(0.5),
  animation: "fadeInUp 0.6s ease-out forwards",
  opacity: 0,
  transform: "translateY(20px)",
  "&:nth-of-type(1)": { animationDelay: "0.1s" },
  "&:nth-of-type(2)": { animationDelay: "0.2s" },
  "&:nth-of-type(3)": { animationDelay: "0.3s" },
  "@keyframes fadeInUp": {
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}))

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Ingresa un correo electrónico válido").required("El correo electrónico es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
})

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const auth = useAuth()
  const theme = useTheme()
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('lg'))

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
    mode: "onChange",
  })

  const watchedFields = watch()

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setShowForm(true), 100)
  }, [])


  const onSubmit = async (data) => {
    setLoading(true)
    setLoginError("")
    const recordar = rememberMe;
    const { email, password } = data
    try {

      await auth.login({ email, password, recordar });
      setShowForm(false)
      setTimeout(() => {
        setLoginSuccess(true)
        setShowSuccess(true)
      }, 300)

      // Redirect after success animation
      setTimeout(() => {
        console.log("Login successful:", data)
        // Here you would typically redirect to dashboard
      }, 2500)
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || 'auth/invalid-login-credentials') {
        setLoginError('email', {
          type: 'manual',
          message: 'El correo electrónico o la contraseña no son válidos',
        });
      } else {
        setLoginError('email', {
          type: 'manual',
          message: 'Hubo un error al iniciar sesion.',
        });
      }
    }
    finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic
  }

  if (!mounted) return null

  return (
    <LoginContainer>
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
        <Fade in={mounted} timeout={200}>
          <div style={{ width: "100%" }}>
            <LoginCard elevation={0}>
              {loginSuccess ? (
                <Zoom in={showSuccess} timeout={100}>
                  <Box textAlign="center" py={4}>
                    <Grow in={showSuccess} timeout={800} style={{ transformOrigin: "center" }}>
                      <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                    </Grow>
                    <Fade  in={showSuccess} timeout={600}>
                      <div>
                        <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                          ¡Bienvenido!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Inicio de sesión exitoso. Redirigiendo...
                        </Typography>
                      </div>
                    </Fade>
                  </Box>
                </Zoom>
              ) : (
                <Fade in={showForm} timeout={100}>
                  <div>
                    {/* Brand Section */}
                    <BrandSection>
                      <div className="brand-icon">
                        <SecurityIcon sx={{ fontSize: { xs: 28, xl: 32 }, color: "white" }} />
                      </div>
                      <Fade in={showForm} timeout={100}>
                        <div>
                          <Typography sx={{ fontSize: { xs: 20, xl: 22 }, mb: { xs: 0, xl: 2 } }} fontWeight={700}>
                            Iniciar Sesión
                          </Typography>
                          <Typography sx={{ fontSize: { xs: 14, xl: 16 }, mb: { xs: 0, xl: 2 } }} color="text.secondary">
                            Accede a tu cuenta de forma segura
                          </Typography>
                        </div>
                      </Fade>

                      {/* Feature Chips */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mb: { sx: 1, xl: 3 } }}>
                        <FeatureChip>
                          <CheckCircleIcon sx={{ fontSize: { xs: 14, xl: 16 } }} />
                          Seguro
                        </FeatureChip>
                        <FeatureChip>
                          <CheckCircleIcon sx={{ fontSize: { xs: 14, xl: 16 } }} />
                          Rápido
                        </FeatureChip>
                        <FeatureChip>
                          <CheckCircleIcon sx={{ fontSize: { xs: 14, xl: 16 } }} />
                          Confiable
                        </FeatureChip>
                      </Box>
                    </BrandSection>
                    {/* Error Alert */}
                    <Collapse in={!!loginError} timeout={100}>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {loginError}
                      </Alert>
                    </Collapse>
                    {/* Login Form */}
                    <Fade in={showForm} timeout={500}>
                      <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ py: 2 }}>
                            <Controller
                              name="email"
                              control={control}
                              render={({ field }) => (
                                <StyledTextField
                                  {...field}
                                  fullWidth
                                  // size={esPantallaChica ? 'small' : 'medium'}
                                  label="Correo Electrónico"
                                  autoFocus
                                  type="email"
                                  error={!!errors.email}
                                  helperText={errors.email?.message}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <EmailIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                  sx={{ mb: 2 }}
                                />
                              )}
                            />
                          </Box>
                          <Box sx={{ py: { sx: 1, xl: 2 } }}>
                            <Controller
                              name="password"
                              control={control}
                              render={({ field }) => (
                                <StyledTextField
                                  {...field}
                                  //  size={esPantallaChica ? 'small' : 'medium'}
                                  fullWidth
                                  label="Contraseña"
                                  type={showPassword ? "text" : "password"}
                                  error={!!errors.password}
                                  helperText={errors.password?.message}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon color={errors.password ? "error" : "action"} />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => setShowPassword(!showPassword)}
                                          edge="end"
                                          size="small"
                                        >
                                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </Box>
                        </Box>
                        {/* Remember Me & Forgot Password */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { sx: 2, xl: 4 } }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                size="small"
                              />
                            }
                            label={
                              <Typography variant="body2" color="text.secondary">
                                Recordarme
                              </Typography>
                            }
                          />
                          <Link href="/olvidaste-contrasena" style={{ textDecoration: 'none' }} passHref>
                            <Typography
                              color="primary"
                              sx={{
                                fontSize: { xs: 13, xl: 14 },
                                textDecoration: "none",
                                fontWeight: 500,
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              ¿Olvidaste tu contraseña?
                            </Typography>
                          </Link>
                        </Box>
                        {/* Submit Button */}
                        <SubmitButton
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={loading || !isValid}
                          sx={{ mb: 3, position: "relative" }}
                        >
                          {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
                        </SubmitButton>

                        {/* Sign Up Link */}
                        <Box textAlign="center">
                          <Typography variant="body2" color="text.secondary">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/registro" style={{ textDecoration: 'none' }} passHref>
                              <Typography
                                component="span"
                                color="primary"
                                fontWeight={600}
                                sx={{
                                  fontSize: { xs: 14, xl: 14 },
                                  textDecoration: "none",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                Regístrate aquí
                              </Typography>
                            </Link>
                          </Typography>
                        </Box>
                      </form>
                    </Fade>
                  </div>
                </Fade>
              )}
            </LoginCard>
          </div>
        </Fade>
      </Box>

      {/* Version Info */}
      <Box position="absolute" bottom={16} left={16} sx={{ opacity: 0.6 }}>
        <Typography variant="caption" color="text.secondary">
          v1.0.10
        </Typography>
      </Box>
    </LoginContainer>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
