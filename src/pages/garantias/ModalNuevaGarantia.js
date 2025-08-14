import { useState, useEffect, useCallback, useMemo, useContext } from "react"
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Paper,
  Fade,
  Slide,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Container,
  StepConnector,
  styled,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  useMediaQuery,
  DialogActions,
  LinearProgress,
  Collapse,
  Zoom,
  Grow,
  Stack,
  StepContent,
  Tooltip,
  Skeleton,
} from "@mui/material"
import {
  Close,
  Security,
  Description,
  CheckCircle,
  CreditCard,
  Business,
  Assignment,
  CloudUpload,
  Info,
  Calculate,
  Person,
  Receipt,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Done,
} from "@mui/icons-material"
import { FormProvider, useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import * as yup from "yup"
import "moment/locale/es"
import { useToast } from "@/@core/components/toast/ToastProvider"
import { AuthContext } from "@/context/AuthContext"
import { Garantias } from "@/context/GetGarantiasContex"
import useGetAcreedores from "@/hooks/useGetAcreedores"
import CustomCurrencyField from "@/@core/components/customFields/CustomCurrencyField"
import { cargarECheck } from '@/redux/Garantias';
import { useDropzone } from "react-dropzone"
import { useDispatch } from "react-redux"
// Esquemas de validación optimizados

// const createValidationSchemas = (tipoCarga) => {
//   if (tipoCarga == '' || tipoCarga == '100000000') {
//     return [
//       yup.object({}), // Paso 0: Tipo de carga
//       yup.object({
//         tipoDeOperacion: yup.string().required("El tipo de operación es requerido"),
//         acreedor: yup.object({
//           value: yup.string().required("El acreedor es requerido"),
//         }),
//         montoBruto: yup.number().min(1, "El monto debe ser mayor a 0").required("El monto es requerido"),
//         fechaVencimiento: yup.mixed().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion != "11"
//             ? yup.date().min(new Date(), "La fecha no puede ser menor a hoy").required("La fecha es requerida").nullable()
//             : yup.mixed().notRequired()
//         }),
//       }),
//       yup.object({
//         formatoDelCheque: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion == "4" || tipoDeOperacion == "13"
//             ? yup.string().required("El formato del cheque es requerido")
//             : yup.string().notRequired()
//         }),
//         tasa: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion == "11" ? yup.string().required("La tasa es requerida") : yup.string().notRequired()
//         }),
//         sistemaAmortizacion: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion == "11"
//             ? yup.string().required("El sistema de amortización es requerido")
//             : yup.string().notRequired()
//         }),
//         periocidadDePago: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion == "11"
//             ? yup.string().required("La periodicidad de pago es requerida")
//             : yup.string().notRequired()
//         }),
//         plazoDias: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion == "11"
//             ? yup.string().required("El plazo en meses es requerido")
//             : yup.string().notRequired()
//         }),
//         tipoCHPD: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
//           return tipoDeOperacion != "11" ? yup.string().required("El tipo CHPD es requerido") : yup.string().notRequired()
//         }),
//         razonSocialLibrador: yup.string().when("tipoCHPD", (tipoCHPD) => {
//           return tipoCHPD == "100000001"
//             ? yup.string().required("La razón social del librador es requerida")
//             : yup.string().notRequired()
//         }),
//         cuitLibrador: yup.string().when("tipoCHPD", (tipoCHPD) => {
//           return tipoCHPD == "100000001"
//             ? yup.string().required("El CUIT del librador es requerido")
//             : yup.string().notRequired()
//         }),
//       }),
//       yup.object({}), // Paso 3: Confirmación
//     ]
//   } else {
//     [
//       yup.object({}), // Paso 0: Tipo de carga
//       yup.object({}),
//       yup.object({}),
//       yup.object({}), // Paso 3: Confirmación
//     ]
//   }
// }

// Opciones para los selects
const OPTIONS = {
  tipoDeOperacion: [
    { value: "4", label: "Cheque de Pago Diferido" },
    { value: "17", label: "Cheque de Pago Diferido Acreedor Bancario" },
    { value: "13", label: "Valores de Corto Plazo" },
    { value: "10", label: "Pagare Bursátil" },
    { value: "11", label: "Préstamo" },
  ],
  tipoCHPD: [
    { value: "100000000", label: "Propio" },
    { value: "100000001", label: "Tercero" },
  ],
  tipoTasa: [
    { value: "100000000", label: "FIJA" },
    { value: "100000001", label: "LIBOR" },
    { value: "100000002", label: "BADLAR" },
    { value: "100000003", label: "BADLARPU" },
    { value: "100000004", label: "BADLARPR" },
    { value: "100000005", label: "TEC" },
    { value: "100000006", label: "TEBP" },
    { value: "100000007", label: "TECBP" },
  ],
  sistemaAmortizacion: [
    { value: "100000000", label: "FRANCES" },
    { value: "100000001", label: "AMERICANO" },
    { value: "100000002", label: "ALEMAN" },
    { value: "100000003", label: "OTRO" },
    { value: "100000004", label: "PAGO UNICO" },
  ],
  periocidadDePago: [
    { value: "100000001", label: "MENSUAL" },
    { value: "100000002", label: "BIMESTRAL" },
    { value: "100000003", label: "TRIMESTRAL" },
    { value: "100000004", label: "CUATRIMESTRAL" },
    { value: "100000005", label: "SEMESTRAL" },
    { value: "100000006", label: "ANUAL" },
    { value: "100000007", label: "OTRO" },
    { value: "100000008", label: "PAGO UNICO" },
  ],
  formatoCheque: [
    { value: "100000000", label: "Físico" },
    { value: "100000001", label: "Echeck" },
    { value: "100000002", label: "E-Pagaré" },
  ],
}

const formatoDelChequeValue = (value) => {
  switch (value) {
    case "100000000":
      return "Físico"
    case "100000001":
      return "Echeck"
    case "100000002":
      return "E-Pagaré"
    default:
      return "Físico"
  }
}

const sistemaAmortizacionValue = (value) => {
  switch (value) {
    case "100000000":
      return "FRANCES"
    case "100000001":
      return "AMERICANO"
    case "100000002":
      return "ALEMAN"
    case "100000003":
      return "OTRO"
    case "100000004":
      return "PAGO UNICO"
    default:
      return "FRANCES"
  }
}


const tasaValue = (value) => {
  switch (value) {
    case "100000000":
      return "FIJA"
    case "100000001":
      return "LIBOR"
    case "100000002":
      return "BADLAR"
    case "100000003":
      return "BADLARPU"
    case "100000004":
      return "BADLARPR"
    case "100000005":
      return "TEC"
    case "100000006":
      return "TEBP"
    case "100000007":
      return "TECBP"
    default:
      return "FIJA"
  }
}

const periocidadDePagoValue = (value) => {
  switch (value) {
    case "100000000":
      return "MENSUAL"
    case "100000001":
      return "BIMESTRAL"
    case "100000002":
      return "TRIMESTRAL"
    case "100000003":
      return "CUATRIMESTRAL"
    case "100000004":
      return "SEMESTRAL"
    case "100000005":
      return "ANUAL"
    case "100000006":
      return "OTRO"
    case "100000007":
      return "PAGO UNICO"
    default:
      return "FIJA"
  }
}

// Utilidades
const formatCurrency = (amount, currency = "USD") => {
  if (!amount && amount !== 0) return "N/A"
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

const getOptionLabel = (options, value) => {
  return options.find((option) => option.value === value)?.label || value
}

// Componente de Stepper Responsivo
const ResponsiveStepper = ({ activeStep, steps, isMobile, isTablet }) => {
  const theme = useTheme()

  if (isMobile) {
    return (
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={(activeStep / (steps.length - 1)) * 100}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main,
              transition: "transform 0.4s ease-in-out",
            },
          }}
        />
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography sx={{ fontSize: { xs: 16, xl: 18 }, mb: 0.5 }} color="text.secondary">
            Paso {activeStep + 1} de {steps.length}
          </Typography>
          <Typography sx={{ fontSize: { xs: 16, xl: 18 }, mb: 0.5 }} fontWeight="bold" color="text.primary">
            {steps[activeStep]?.label}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Stepper
      activeStep={activeStep}
      connector={<CustomStepConnector />}
      sx={{ mb: { xs: 2, xl: 4 } }}
      alternativeLabel={!isTablet}
      orientation={isTablet ? "vertical" : "horizontal"}
    >
      {steps.map((step, index) => (
        <Step key={step.label}>
          <CustomStepLabel StepIconComponent={(props) => <CustomStepIcon {...props} icon={step.icon} />}>
            <Typography variant="subtitle2" fontWeight="bold">
              {step.label}
            </Typography>
            {/* <Typography variant="caption" color="text.secondary">
              {step.description}
            </Typography> */}
          </CustomStepLabel>
          {isTablet && (
            <StepContent>
              <Box sx={{ py: 1 }} />
            </StepContent>
          )}
        </Step>
      ))}
    </Stepper>
  )
}

// Componente de Step Icon personalizado
const CustomStepIcon = ({ active, completed, icon, className }) => {
  const theme = useTheme()

  return (
    // <Zoom in timeout={300}>
    <Box
      className={className}
      sx={{
        width: { xs: 38, xl: 48 },
        height: { xs: 38, xl: 48 },
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: completed
          ? theme.palette.success.main
          : active
            ? theme.palette.primary.main
            : alpha(theme.palette.action.disabled, 0.3),
        color: completed || active ? theme.palette.common.white : theme.palette.text.disabled,
        border: `2px solid ${completed
          ? theme.palette.success.main
          : active
            ? theme.palette.primary.main
            : alpha(theme.palette.action.disabled, 0.3)
          }`,
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: active ? "scale(1.1)" : "scale(1)",
        boxShadow: active
          ? `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`
          : completed
            ? `0 0 20px ${alpha(theme.palette.success.main, 0.4)}`
            : "none",
      }}
    >
      {completed ? <Done /> : icon}
    </Box>
    // </Zoom>
  )
}

// Componente de Stepper Connector personalizado
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: alpha(theme.palette.primary.main, 0.3),
    borderTopWidth: 2,
    borderRadius: 1,
    transition: "all 0.3s ease",
  },
  "&.Mui-active .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  "&.Mui-completed .MuiStepConnector-line": {
    borderColor: theme.palette.success.main,
  },
}))

// Componente de Step Label personalizado
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    fontSize: "0.875rem",
    fontWeight: 600,
    marginTop: { xs: 2, xl: 8 },
    color: theme.palette.text.primary,
    "&.Mui-active": {
      color: theme.palette.primary.main,
      fontWeight: "bold",
    },
    "&.Mui-completed": {
      color: theme.palette.success.main,
    },
  },
}))

// Componente de tarjeta de selección mejorado
const SelectionCard = ({ title, description, icon: IconComponent, selected, onClick, disabled = false }) => {
  const theme = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Grow in timeout={600}>
      <Card
        elevation={selected ? 8 : 2}
        onClick={!disabled ? onClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          backgroundColor: theme.palette.background.paper,
          border: selected
            ? `2px solid ${theme.palette.primary.main}`
            : `2px solid ${alpha(theme.palette.divider, 0.3)}`,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          opacity: disabled ? 0.5 : 1,
          transform: isHovered && !disabled ? "translateY(-4px) scale(1.02)" : "none",
          boxShadow: isHovered && !disabled ? theme.shadows[12] : selected ? theme.shadows[8] : theme.shadows[2],
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: selected
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`
              : isHovered
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`
                : "transparent",
            transition: "all 0.3s ease",
            zIndex: 0,
          },
          "& > *": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: selected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
              color: selected ? theme.palette.primary.contrastText : theme.palette.primary.main,
              mx: "auto",
              mb: 2,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              boxShadow: selected ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}` : "none",
            }}
          >
            <IconComponent fontSize="large" />
          </Avatar>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: selected ? theme.palette.primary.main : theme.palette.text.primary,
              transition: "color 0.3s ease",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
              mb: selected ? 2 : 0,
            }}
          >
            {description}
          </Typography>

          {selected && (
            <Zoom in timeout={300}>
              <Chip
                icon={<CheckCircle fontSize="small" />}
                label="Seleccionado"
                color="primary"
                size="small"
                sx={{
                  fontWeight: "bold",
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              />
            </Zoom>
          )}
        </CardContent>
      </Card>
    </Grow>
  )
}

// Componente para secciones del formulario mejorado
const FormSection = ({ title, icon: IconComponent, children, alert = null }) => {
  const theme = useTheme()

  return (
    <Fade in timeout={600}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: { xs: 30, xl: 40 },
              height: { xs: 30, xl: 40 },
            }}
          >
            <IconComponent fontSize="small" />
          </Avatar>
          <Typography sx={{ fontSize: { xs: 14, xl: 18 } }} fontWeight="bold" color="text.primary">
            {title}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.divider, 0.1) }} />
        <Grid container spacing={3}>
          {children}
        </Grid>
      </Box>
    </Fade>
  )
}

// Componente de campo personalizado mejorado
const CustomFormField = ({ name, label, required = false, helperText, children, error }) => {
  const theme = useTheme()

  return (
    <Box>
      <Typography
        fontWeight="medium"
        color="text.primary"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mb: 1,
          fontSize: { xs: 12, xl: 14 }
        }}
      >
        {label}
        {required && (
          <Typography component="span" color="error.main" sx={{ fontSize: "1rem" }}>
            *
          </Typography>
        )}
      </Typography>
      {children}
      {(error || helperText) && (
        <Typography
          variant="caption"
          color={error ? "error.main" : "text.secondary"}
          sx={{ mt: 0.5, display: "block" }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  )
}

// Componente de Dropzone simulado mejorado
const EnhancedDropzone = ({ files, setFiles }) => {
  const theme = useTheme()
  const [isDragOver, setIsDragOver] = useState(false)

  const multiple = true
  const maxSize = 15000000 // 15MB
  const acceptedTypes = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"], // Excel 97-2003
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], // Excel moderno
    "text/csv": [".csv"]
  }

  const totalSize = useMemo(() => {
    return files.reduce((acc, file) => acc + file.size, 0)
  }, [files])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          const newErrors = rejectedFiles.map(({ file, errors }) => ({
            file: file.name,
            errors: errors.map((e) => e.message),
          }))
          setErrors(newErrors)
        }

        if (acceptedFiles.length > 0) {
          setFiles((prev) => (multiple ? [...prev, ...acceptedFiles] : acceptedFiles))
        }
      },
      [multiple],
    ),
    accept: acceptedTypes,
    maxSize,
    multiple,
  })

  // const handleFileSelect = useCallback(() => {
  //   // Simular selección de archivo
  //   const mockFile = {
  //     name: "cheques_electronicos.xlsx",
  //     size: 2048000, // 2MB
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   }
  //   setFiles([mockFile])
  // }, [setFiles])

  return (
    <Paper
      {...getRootProps()}
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      sx={{
        p: 4,
        textAlign: "center",
        border: `2px dashed ${isDragOver ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)}`,
        borderRadius: 2,
        backgroundColor: isDragOver ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          transform: "translateY(-2px)",
        },
      }}
    >
      <CloudUpload
        sx={{
          fontSize: 48,
          color: "primary.main",
          mb: 2,
          transition: "transform 0.3s ease",
          transform: isDragOver ? "scale(1.1)" : "scale(1)",
        }}
      />
      <Typography variant="h6" gutterBottom>
        Arrastra tu archivo aquí o haz clic para seleccionar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Formatos soportados: .xlsx, .xls (Máximo 15MB)
      </Typography>
      {files.length > 0 && (
        <Zoom in timeout={300}>
          <Chip
            label={`${files[0].name} (${(files[0].size / 1024 / 1024).toFixed(2)} MB)`}
            color="primary"
            onDelete={() => setFiles([])}
            sx={{ mt: 2 }}
          />
        </Zoom>
      )}
    </Paper>
  )
}

// Componente de Loading con skeleton
const FormSkeleton = () => {
  return (
    <Box>
      {[...Array(3)].map((_, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  )
}

// Componente principal del modal
export default function ModalNuevaGarantiaComplete({ open, handleClose, montoDisponible = 1000000, onSubmit }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const isDark = theme.palette.mode === "dark"
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
  const { acreedores } = useGetAcreedores();
  const [activeStep, setActiveStep] = useState(0)
  const [tipoCarga, setTipoCarga] = useState("")
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [acreedoresFiltrado, setAcreedoresFiltrados] = useState([])
  const [autoSaving, setAutoSaving] = useState(false)
  const [formDataPersistence, setFormDataPersistence] = useState({})
  const { referido, token } = useContext(AuthContext);
  const { createGarantia, cargandoCarantia } = useContext(Garantias)
  const { toast } = useToast()
  const [acreedoresCargados, setAcreedoresCargados] = useState(false);

  // Configuración de pasos
  const steps = useMemo(
    () => [
      {
        label: "Tipo de Carga",
        icon: <Assignment />,
        description: "Selecciona el método de carga",
      },
      {
        label: "Datos Generales",
        icon: <Description />,
        description: "Información básica de la garantía",
      },
      {
        label: "Detalles Específicos",
        icon: <Security />,
        description: "Datos específicos según el tipo",
      },
      {
        label: "Confirmación",
        icon: <CheckCircle />,
        description: "Revisar y confirmar",
      },
    ],
    [],
  )

  // Opciones de tipo de carga
  const tiposCarga = useMemo(
    () => [
      {
        value: "100000000",
        title: "Carga Manual",
        description: "Ingreso individual de garantías con formulario detallado",
        icon: CreditCard,
      },
      {
        value: "100000001",
        title: "Carga Masiva",
        description: "Importación masiva de cheques electrónicos desde archivo Excel",
        icon: CloudUpload,
      },
    ],
    [],
  )

  // Form configuration
  const defaultValues = useMemo(
    () => ({
      acreedor: null,
      tipoCHPD: "",
      razonSocialLibrador: "",
      cuitLibrador: "",
      montoBruto: 0,
      tipoDeOperacion: "",
      formatoDelCheque: "",
      fechaVencimiento: null,
      numeroCheque: "",
      tasa: "",
      sistemaAmortizacion: "",
      periocidadDePago: "",
      plazoDias: "",
      plazoGracia: "",
      observaciones: "",
    }),
    [],
  )

  //   const createValidationSchemas = (tipoCarga) => {
  //   if (tipoCarga == '' || tipoCarga == '100000000') {
  //     return [
  //       yup.object({}), // Paso 0: Tipo de carga
  //       yup.object({
  //         tipoDeOperacion: yup.string().required("El tipo de operación es requerido"),
  //         acreedor: yup.object({
  //           value: yup.string().required("El acreedor es requerido"),
  //         }),
  //         montoBruto: yup.number().min(1, "El monto debe ser mayor a 0").required("El monto es requerido"),
  //         fechaVencimiento: yup.mixed().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion != "11"
  //             ? yup.date().min(new Date(), "La fecha no puede ser menor a hoy").required("La fecha es requerida").nullable()
  //             : yup.mixed().notRequired()
  //         }),
  //       }),
  //       yup.object({
  //         formatoDelCheque: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion == "4" || tipoDeOperacion == "13"
  //             ? yup.string().required("El formato del cheque es requerido")
  //             : yup.string().notRequired()
  //         }),
  //         tasa: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion == "11" ? yup.string().required("La tasa es requerida") : yup.string().notRequired()
  //         }),
  //         sistemaAmortizacion: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion == "11"
  //             ? yup.string().required("El sistema de amortización es requerido")
  //             : yup.string().notRequired()
  //         }),
  //         periocidadDePago: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion == "11"
  //             ? yup.string().required("La periodicidad de pago es requerida")
  //             : yup.string().notRequired()
  //         }),
  //         plazoDias: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion == "11"
  //             ? yup.string().required("El plazo en meses es requerido")
  //             : yup.string().notRequired()
  //         }),
  //         tipoCHPD: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
  //           return tipoDeOperacion != "11" ? yup.string().required("El tipo CHPD es requerido") : yup.string().notRequired()
  //         }),
  //         razonSocialLibrador: yup.string().when("tipoCHPD", (tipoCHPD) => {
  //           return tipoCHPD == "100000001"
  //             ? yup.string().required("La razón social del librador es requerida")
  //             : yup.string().notRequired()
  //         }),
  //         cuitLibrador: yup.string().when("tipoCHPD", (tipoCHPD) => {
  //           return tipoCHPD == "100000001"
  //             ? yup.string().required("El CUIT del librador es requerido")
  //             : yup.string().notRequired()
  //         }),
  //       }),
  //       yup.object({}), // Paso 3: Confirmación
  //     ]
  //   } else {
  //     [
  //       yup.object({}), // Paso 0: Tipo de carga
  //       yup.object({}),
  //       yup.object({}),
  //       yup.object({}), // Paso 3: Confirmación
  //     ]
  //   }
  // }

  //   const validationSchemas = useMemo(() => createValidationSchemas(tipoCarga), [])

  //   const methods = useForm({
  //     shouldUnregister: false,
  //     defaultValues,
  //     resolver: yupResolver(validationSchemas[activeStep]),
  //     mode: "onChange",
  //   })

  const createValidationSchemas = (tipoCarga) => {
    if (tipoCarga === '' || tipoCarga === '100000000') {
      return [
        yup.object({}), // Paso 0: Tipo de carga
        yup.object({
          tipoDeOperacion: yup.string().required("El tipo de operación es requerido"),
          acreedor: yup.object({
            value: yup.string().required("El acreedor es requerido"),
          }),
          montoBruto: yup.number().min(1, "El monto debe ser mayor a 0").required("El monto es requerido"),
          fechaVencimiento: yup.mixed().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion != "11"
              ? yup.date().min(new Date(), "La fecha no puede ser menor a hoy").required("La fecha es requerida").nullable()
              : yup.mixed().notRequired();
          }),
        }),
        yup.object({
          formatoDelCheque: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion == "4" || tipoDeOperacion == "13"
              ? yup.string().required("El formato del cheque es requerido")
              : yup.string().notRequired();
          }),
          tasa: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion == "11"
              ? yup.string().required("La tasa es requerida")
              : yup.string().notRequired();
          }),
          sistemaAmortizacion: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion == "11"
              ? yup.string().required("El sistema de amortización es requerido")
              : yup.string().notRequired();
          }),
          periocidadDePago: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion == "11"
              ? yup.string().required("La periodicidad de pago es requerida")
              : yup.string().notRequired();
          }),
          plazoDias: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion == "11"
              ? yup.string().required("El plazo en meses es requerido")
              : yup.string().notRequired();
          }),
          tipoCHPD: yup.string().when("tipoDeOperacion", (tipoDeOperacion) => {
            return tipoDeOperacion != "11"
              ? yup.string().required("El tipo CHPD es requerido")
              : yup.string().notRequired();
          }),
          razonSocialLibrador: yup.string().when("tipoCHPD", (tipoCHPD) => {
            return tipoCHPD == "100000001"
              ? yup.string().required("La razón social del librador es requerida")
              : yup.string().notRequired();
          }),
          cuitLibrador: yup.string().when("tipoCHPD", (tipoCHPD) => {
            return tipoCHPD == "100000001"
              ? yup.string().required("El CUIT del librador es requerido")
              : yup.string().notRequired();
          }),
        }),
        yup.object({}), // Paso 3: Confirmación
      ];
    } else {
      return [
        yup.object({}), // Paso 0
        yup.object({}), // Paso 1
        yup.object({}), // Paso 2
        yup.object({}), // Paso 3
      ];
    }
  };

  const validationSchemas = useMemo(
    () => createValidationSchemas(tipoCarga),
    [tipoCarga] // 🔹 se recalcula cuando cambia tipoCarga
  );

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(validationSchemas[activeStep]),
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = methods

  // Watch form values
  const tipoDeOperacion = watch("tipoDeOperacion")
  const tipoCHPD = watch("tipoCHPD")
  const plazoDias = watch("plazoDias")

  // Effect para calcular fecha de vencimiento automáticamente para préstamos
  useEffect(() => {
    if (tipoDeOperacion === "11" && plazoDias > 0) {
      const fechaSuma = moment().add(plazoDias, "months")
      setValue("fechaVencimiento", fechaSuma.toDate())
    } else if (tipoDeOperacion === "11" && plazoDias === "") {
      setValue("fechaVencimiento", null)
    }
  }, [plazoDias, tipoDeOperacion, setValue])

  useEffect(() => {
    if (acreedores?.length > 0) {
      if (tipoDeOperacion === "11") {
        let acreedoresAux = acreedores.filter((item) => item.tipo === 100000000 || item.tipo === 100000001);
        setAcreedoresFiltrados(acreedoresAux?.filter((item) => item.montoCalificado > 0));
        setAcreedoresCargados(true);
      } else {
        setAcreedoresFiltrados(acreedores);
        setAcreedoresCargados(true);
      }
    }
  }, [acreedores, tipoDeOperacion]);

  // useEffect(() => {
  //   if (tipoDeOperacion) {
  //     // Only reset fields that are not relevant to the new operation type
  //     const fieldsToReset = []

  //     // Reset format and number fields only if changing from/to loan type
  //     if (tipoDeOperacion === "11") {
  //       fieldsToReset.push("formatoDelCheque", "numeroCheque")
  //     } else {
  //       fieldsToReset.push("tasa", "sistemaAmortizacion", "periocidadDePago", "plazoDias", "plazoGracia")
  //     }

  //     // Only reset CHPD related fields if they were not manually filled
  //     const currentTipoCHPD = watch("tipoCHPD")
  //     if (!currentTipoCHPD || currentTipoCHPD === "") {
  //       fieldsToReset.push("tipoCHPD", "razonSocialLibrador", "cuitLibrador")
  //     }

  //     // Reset only the specific fields, preserve others
  //     fieldsToReset.forEach((field) => {
  //       if (!formDataPersistence[field]) {
  //         setValue(field, "")
  //       }
  //     })

  //     if (tipoDeOperacion !== "11" && !formDataPersistence.fechaVencimiento) {
  //       setValue("fechaVencimiento", null)
  //     }
  //   }
  // }, [tipoDeOperacion, setValue, watch, formDataPersistence])

  const handleNext = useCallback(async () => {
    debugger
    if (activeStep === 0 && !tipoCarga) return

    const esPasoValido = await trigger()
    if (!esPasoValido) return

    // Save current step data before moving to next
    const currentData = watch()
    setFormDataPersistence((prev) => ({ ...prev, ...currentData }))

    setActiveStep((prev) => prev + 1)
  }, [activeStep, tipoCarga, trigger, watch])

  const handleBack = useCallback(() => {
    const currentData = watch()
    setFormDataPersistence((prev) => ({ ...prev, ...currentData }))

    setActiveStep((prev) => prev - 1)
  }, [watch])

  useEffect(() => {
    if (Object.keys(formDataPersistence).length > 0) {
      Object.entries(formDataPersistence).forEach(([key, value]) => {
        if (value !== null && value !== "" && value !== 0) {
          setValue(key, value)
        }
      })
    }
  }, [activeStep, formDataPersistence, setValue])

  const handleReset = useCallback(() => {
    setActiveStep(0)
    setTipoCarga("")
    setFiles([])
    setFormDataPersistence({})
    reset()
  }, [reset])

  const cerrarModal = useCallback(() => {
    handleReset()
    handleClose()
  }, [handleReset, handleClose])

  const submitDatos = async (datos) => {
    try {
      // Validación adicional para CUIT si es necesario
      if (tipoCHPD === "100000001" && datos.cuitLibrador) {
        const cuitValido = ValidateCUITCUIL(datos.cuitLibrador)
        if (!cuitValido) {
          toast.error("El CUIT del librador debe ser válido!")
          return
        }
      }

      // Limpiar campos según tipo de operación
      if (tipoDeOperacion !== "11") {
        if (tipoCHPD === "100000000") {
          datos.razonSocialLibrador = ""
          datos.cuitLibrador = ""
        }
      }

      if (tipoDeOperacion === "13" || tipoDeOperacion === "17") {
        datos.formatoDelCheque = ""
      }
      createGarantia(datos, referido?.accountid, token, toast)
        .then(() => {
          setTimeout(() => {
            handleClose()
            handleReset()
          }, 1000);
        })
    } catch (error) {
      toast.error("Error al crear garantia.")
    }
    finally {
      setLoading(false)

    }
  }

  const submitArchivo = useCallback(async () => {
    debugger
    if (files.length === 0) return

    try {
      setLoading(true)
      console.log("Archivo enviado:", files)
      // Simular envío

      // setDisabled(true)
      if (files.length === 0) {
        toast.error('El archivo adjunto es requerido!');
        setLoading(false)
        return
      }
      const formData = new FormData();
      for (let index = 0; index < files.length; index++) {
        if (files[index].size >= 15000000) {
          toast.error('El archivo no puede superar los 15 megas');
          setFiles([])
          setLoading(false)
          return
        }
        let element = files[index];
        formData.append(`body${index}`, element);
      }

      dispatch(cargarECheck(formData, referido?.accountid, token))
        .then(() => {
          toast.success("Carga de cheque finalizada con exito. En la pestaña de carga masiva puede visualizar el detalle.", {
            duration: 5000,
          })
          setLoading(false)
          setFiles([])
          dispatch(obtenerDetalle(referido?.accountid, token))
          setTimeout(() => {
            handleClose()
          }, 1500)
        })
        .catch(() => {
          toast.error("Error en la carga, comuníquese con su oficial.")
          setLoading(false)
          setFiles([])
          setTimeout(() => {
            handleClose()
          }, 1500)
        })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }, [files, cerrarModal])

  // Render step content
  const renderStepContent = useCallback(
    (step) => {
      switch (step) {
        case 0:
          return (
            <Fade in timeout={600}>
              <Box>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography sx={{ fontSize: { xs: 16, xl: 18 } }} fontWeight="bold" gutterBottom color="text.primary">
                    Selecciona el Tipo de Carga
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 12, xl: 14 }, maxWidth: 600, mx: "auto" }} color="text.secondary">
                    Elige el método más conveniente para cargar tu garantía
                  </Typography>
                </Box>

                <Grid container spacing={3} justifyContent="center">
                  {tiposCarga.map((tipo, index) => (
                    <Grid item xs={12} sm={6} md={5} key={tipo.value}>
                      <Box sx={{ animationDelay: `${index * 200}ms` }}>
                        <SelectionCard
                          title={tipo.title}
                          description={tipo.description}
                          icon={tipo.icon}
                          selected={tipoCarga === tipo.value}
                          onClick={() => setTipoCarga(tipo.value)}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Collapse in={!!tipoCarga}>
                  <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{
                      mt: 3,
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {tipoCarga === "100000000"
                        ? "Procederás a completar un formulario detallado para la carga individual de la garantía."
                        : "Podrás subir un archivo Excel con múltiples cheques electrónicos para procesamiento masivo."}
                    </Typography>
                  </Alert>
                </Collapse>
              </Box>
            </Fade>
          )

        case 1:
          return (
            <Fade direction="left" in timeout={600}>
              <Box>
                {!esPantallaChica && (
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography sx={{ fontSize: { xs: 16, xl: 18 } }} fontWeight="bold" gutterBottom color="text.primary">
                      {tipoCarga === "100000000" ? "Datos Generales" : "Carga de Archivo"}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 12, xl: 14 } }} color="text.secondary">
                      {tipoCarga === "100000000"
                        ? "Completa la información básica de la garantía"
                        : "Sube tu archivo Excel con los datos de los cheques"}
                    </Typography>
                  </Box>
                )}

                {tipoCarga === "100000000" ? (
                  <FormProvider {...methods}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: { xs: 2, md: 4 },
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 3,
                      }}
                    >
                      <FormSection
                        title="Información de la Operación"
                        icon={Business}
                        alert={{
                          severity: "info",
                        }}
                      >
                        <Grid item xs={12} sm={6}>
                          <CustomFormField
                            name="tipoDeOperacion"
                            label="Tipo de Operación"
                            required
                            error={errors.tipoDeOperacion?.message}
                          >
                            <Controller
                              name="tipoDeOperacion"
                              control={methods.control}
                              render={({ field }) => (
                                <FormControl fullWidth error={!!errors.tipoDeOperacion}>
                                  <Select
                                    {...field}
                                    displayEmpty
                                    sx={{
                                      borderRadius: 2,
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: alpha(theme.palette.divider, 0.3),
                                      },
                                    }}
                                  >
                                    <MenuItem value="" disabled>
                                      Selecciona una opción
                                    </MenuItem>
                                    {OPTIONS.tipoDeOperacion.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </CustomFormField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <CustomFormField name="acreedor" label="Acreedor" required error={errors.acreedor?.message}>
                            <Controller
                              name="acreedor"
                              control={methods.control}
                              render={({ field }) => (
                                <Autocomplete
                                  {...field}
                                  options={acreedoresFiltrado}
                                  getOptionLabel={(option) => option.label || ""}
                                  onChange={(_, value) => field.onChange(value)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Buscar acreedor..."
                                      error={!!errors.acreedor}
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 2,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </CustomFormField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <CustomCurrencyField
                            name="montoBruto"
                            label="Monto Bruto"
                            rules={{ required: "Required!" }}
                            req="true"
                          />
                          {/* <CustomFormField
                            name="montoBruto"
                            label="Monto Bruto"
                            required
                            error={errors.montoBruto?.message}
                          >
                            <Controller
                              name="montoBruto"
                              control={methods.control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  type="number"
                                  placeholder="0.00"
                                  error={!!errors.montoBruto}
                                  InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              )}
                            />
                          </CustomFormField> */}
                        </Grid>

                        {tipoDeOperacion !== "11" && (
                          <Grid item xs={12} sm={6}>
                            <CustomFormField
                              name="fechaVencimiento"
                              label="Fecha de Vencimiento"
                              required
                              error={errors.fechaVencimiento?.message}
                            >
                              <Controller
                                name="fechaVencimiento"
                                control={methods.control}
                                render={({ field }) => (
                                  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
                                    <DesktopDatePicker
                                      {...field}
                                      views={["day", "month", "year"]}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          fullWidth
                                          error={!!errors.fechaVencimiento}
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 2,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                            </CustomFormField>
                          </Grid>
                        )}
                      </FormSection>
                    </Paper>
                  </FormProvider>
                ) : (
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 2, md: 4 },
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 3,
                    }}
                  >
                    <EnhancedDropzone files={files} setFiles={setFiles} />
                  </Paper>
                )}
              </Box>
            </Fade>
          )

        case 2:
          return (
            <Fade direction="left" in timeout={600}>
              <Box>
                {!esPantallaChica && (
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography sx={{ fontSize: { xs: 16, xl: 18 } }} fontWeight="bold" gutterBottom color="text.primary">
                      Detalles Específicos
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 12, xl: 14 } }} color="text.secondary">
                      Información adicional según el tipo de operación
                    </Typography>
                  </Box>
                )}

                {tipoCarga === "100000000" ? (
                  <FormProvider {...methods}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: { xs: 2, md: 4 },
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 3,
                      }}
                    >
                      {tipoDeOperacion !== "" && tipoDeOperacion !== "11" && (
                        <FormSection title="Datos del Cheque" icon={CreditCard}>
                          <Grid item xs={12} sm={4}>
                            <CustomFormField
                              name="tipoCHPD"
                              label="Tipo CHPD"
                              required
                              error={errors.tipoCHPD?.message}
                            >
                              <Controller
                                name="tipoCHPD"
                                control={methods.control}
                                render={({ field }) => (
                                  <FormControl fullWidth error={!!errors.tipoCHPD}>
                                    <Select {...field} displayEmpty sx={{ borderRadius: 2 }}>
                                      <MenuItem value="" disabled>
                                        Selecciona una opción
                                      </MenuItem>
                                      {OPTIONS.tipoCHPD.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                              />
                            </CustomFormField>
                          </Grid>

                          {(tipoDeOperacion === "4" || tipoDeOperacion === "13") && (
                            <Grid item xs={12} sm={4}>
                              <CustomFormField
                                name="formatoDelCheque"
                                label="Formato del Cheque"
                                required
                                error={errors.formatoDelCheque?.message}
                              >
                                <Controller
                                  name="formatoDelCheque"
                                  control={methods.control}
                                  render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.formatoDelCheque}>
                                      <Select {...field} displayEmpty sx={{ borderRadius: 2 }}>
                                        <MenuItem value="" disabled>
                                          Selecciona una opción
                                        </MenuItem>
                                        {OPTIONS.formatoCheque.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
                                />
                              </CustomFormField>
                            </Grid>
                          )}


                          <Grid item xs={12} sm={4}>
                            <CustomFormField
                              name="numeroCheque"
                              label="Nro. Cheque"
                              error={errors.numeroCheque?.message}
                            >
                              <Controller
                                name="numeroCheque"
                                control={methods.control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    placeholder="Ingresa el número"
                                    error={!!errors.numeroCheque}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </CustomFormField>
                          </Grid>
                        </FormSection>
                      )}

                      {tipoDeOperacion === "11" && (
                        <FormSection title="Datos del Aval" icon={Calculate}>
                          <Grid item xs={12} sm={4}>
                            <CustomFormField name="tasa" label="Tasa" required error={errors.tasa?.message}>
                              <Controller
                                name="tasa"
                                control={methods.control}
                                render={({ field }) => (
                                  <FormControl fullWidth error={!!errors.tasa}>
                                    <Select {...field} displayEmpty sx={{ borderRadius: 2 }}>
                                      <MenuItem value="" disabled>
                                        Selecciona una opción
                                      </MenuItem>
                                      {OPTIONS.tipoTasa.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                              />
                            </CustomFormField>
                          </Grid>

                          <Grid item xs={12} sm={3}>
                            <CustomFormField
                              name="plazoDias"
                              label="Plazo en Meses"
                              required
                              error={errors.plazoDias?.message}
                            >
                              <Controller
                                name="plazoDias"
                                control={methods.control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    type="number"
                                    placeholder="0"
                                    error={!!errors.plazoDias}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </CustomFormField>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <CustomFormField name="periocidadDePago" label="Periocidad de Pago" required error={errors.periocidadDePago?.message}>
                              <Controller
                                name="periocidadDePago"
                                control={methods.control}
                                render={({ field }) => (
                                  <FormControl fullWidth error={!!errors.tasa}>
                                    <Select {...field} displayEmpty sx={{ borderRadius: 2 }}>
                                      <MenuItem value="" disabled>
                                        Selecciona una opción
                                      </MenuItem>
                                      {OPTIONS.periocidadDePago.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                              />
                            </CustomFormField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <CustomFormField
                              name="sistemaAmortizacion"
                              label="Sistema de Amortización"
                              required
                              error={errors.sistemaAmortizacion?.message}
                            >
                              <Controller
                                name="sistemaAmortizacion"
                                control={methods.control}
                                render={({ field }) => (
                                  <FormControl fullWidth error={!!errors.sistemaAmortizacion}>
                                    <Select {...field} displayEmpty sx={{ borderRadius: 2 }}>
                                      <MenuItem value="" disabled>
                                        Selecciona una opción
                                      </MenuItem>
                                      {OPTIONS.sistemaAmortizacion.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                )}
                              />
                            </CustomFormField>
                          </Grid>
                        </FormSection>
                      )}

                      {tipoDeOperacion !== "" && tipoCHPD === "100000001" && tipoDeOperacion !== "11" && (
                        <FormSection title="Datos del Librador" icon={Person}>
                          <Grid item xs={12} sm={6}>
                            <CustomFormField
                              name="razonSocialLibrador"
                              label="Razón Social Librador"
                              required
                              error={errors.razonSocialLibrador?.message}
                            >
                              <Controller
                                name="razonSocialLibrador"
                                control={methods.control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    placeholder="Ingresa la razón social"
                                    error={!!errors.razonSocialLibrador}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </CustomFormField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <CustomFormField
                              name="cuitLibrador"
                              label="CUIT Librador"
                              required
                              error={errors.cuitLibrador?.message}
                            >
                              <Controller
                                name="cuitLibrador"
                                control={methods.control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    placeholder="XX-XXXXXXXX-X"
                                    error={!!errors.cuitLibrador}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </CustomFormField>
                          </Grid>
                        </FormSection>
                      )}

                      <FormSection title="Observaciones" icon={Description}>
                        <Grid item xs={12}>
                          <CustomFormField
                            name="observaciones"
                            // label="Observaciones"
                            error={errors.observaciones?.message}
                          // helperText="Agrega cualquier comentario adicional"
                          >
                            <Controller
                              name="observaciones"
                              control={methods.control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  multiline
                                  rows={2}
                                  fullWidth
                                  placeholder="Escribe tus observaciones aquí..."
                                  error={!!errors.observaciones}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              )}
                            />
                          </CustomFormField>
                        </Grid>
                      </FormSection>
                    </Paper>
                  </FormProvider>
                ) : (
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 2, md: 4 },
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 3,
                      textAlign: "center",
                    }}
                  >
                    <Receipt sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Archivo Listo para Procesar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      El archivo será procesado en el siguiente paso
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Fade>
          )

        case 3:
          return (
            <Fade direction="left" in timeout={600}>
              <Box>
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 2, md: 4 },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 3,
                  }}
                >
                  <Box textAlign="center">
                    <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      ¿Confirmas el envío de la garantía?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Una vez enviada, la garantía será procesada por el sistema
                    </Typography>

                    {tipoCarga === "100000000" && (
                      // <Alert
                      //   severity="info"
                      //   sx={{
                      //     textAlign: "left",
                      //     backgroundColor: alpha(theme.palette.info.main, 0.1),
                      //     border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      //     borderRadius: 2,
                      //   }}
                      // >
                      //   <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      //     Resumen de la garantía:
                      //   </Typography>
                      //   <Typography variant="body2">
                      //     Tipo: {getOptionLabel(OPTIONS.tipoDeOperacion, tipoDeOperacion)}
                      //   </Typography>
                      //   <Typography variant="body2">Acreedor: {watch("acreedor")?.label}</Typography>
                      //   <Typography variant="body2">Monto: {formatCurrency(watch("montoBruto"))}</Typography>
                      //   {watch("observaciones") && (
                      //     <Typography variant="body2">Observaciones: {watch("observaciones")}</Typography>
                      //   )}
                      // </Alert>
                      <Alert
                        severity="info"
                        sx={{
                          textAlign: "left",
                          bgcolor: isDark ? alpha("#2196f3", 0.1) : alpha("#2196f3", 0.05),
                          border: `1px solid ${isDark ? alpha("#2196f3", 0.3) : alpha("#2196f3", 0.2)}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          Tipo de Operación: {OPTIONS.tipoDeOperacion.find((op) => op.value === tipoDeOperacion)?.label}
                        </Typography>
                        <Typography variant="body2">Acreedor: {watch("acreedor")?.label}</Typography>
                        <Typography variant="body2">Monto: {formatCurrency(watch("montoBruto")?.toLocaleString(), 'USD')}</Typography>
                        {tipoDeOperacion === "11" &&
                          (
                            <>
                              <Typography variant="body2">tasa: {tasaValue(watch("tasa"))}</Typography>
                              <Typography variant="body2">Plazo en meses: {(watch("plazoDias")?.toLocaleString())}</Typography>
                              <Typography variant="body2">Sistema de Amortizacion: {sistemaAmortizacionValue(watch("sistemaAmortizacion")?.toLocaleString())}</Typography>
                              <Typography variant="body2">Periocidad de Pago: {periocidadDePagoValue(watch("periocidadDePago")?.toLocaleString())}</Typography>
                            </>
                          )
                        }
                        {tipoDeOperacion !== "11" &&
                          (
                            <>
                              <Typography variant="body2">Tipo CHPD: {watch("tipoCHPD")?.toLocaleString()}</Typography>
                              {watch("razonSocialLibrador") ? (<Typography variant="body2">Razon Social Librador: {watch("razonSocialLibrador")?.toLocaleString()}</Typography>) : null}
                              {watch("cuitLibrador") ? (<Typography variant="body2">Cuit Librador: {watch("cuitLibrador")?.toLocaleString()}</Typography>) : null}
                              <Typography variant="body2">Formato del cheque: {formatoDelChequeValue(watch("formatoDelCheque")?.toLocaleString())}</Typography>
                              {watch("fechaVencimiento") ? (<Typography variant="body2">Fecha de Vencimiento:{watch("fechaVencimiento")?.toLocaleString()}</Typography>) : null}
                            </>
                          )
                        }
                        {
                          watch("observaciones")?.toLocaleString() &&
                          <Typography variant="body2">Observaciones: {watch("observaciones")?.toLocaleString()}</Typography>
                        }
                      </Alert>
                    )}

                    {tipoCarga === "100000001" && files.length > 0 && (
                      <Alert
                        severity="info"
                        sx={{
                          textAlign: "left",
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          Archivo: {files[0]?.name}
                        </Typography>
                        <Typography variant="body2">Tamaño: {(files[0]?.size / 1024 / 1024).toFixed(2)} MB</Typography>
                      </Alert>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Fade>
          )

        default:
          return null
      }
    },
    [
      tipoCarga,
      tiposCarga,
      files,
      methods,
      errors,
      tipoDeOperacion,
      tipoCHPD,
      watch,
      acreedoresFiltrado,
      theme,
      isMobile,
      montoDisponible,
      formDataPersistence,
    ],
  )

  return (
    <Dialog
      open={open}
      onClose={cerrarModal}
      maxWidth="lg"
      fullScreen={esPantallaChica}
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          minHeight: isMobile ? "100vh" : "80vh",
          borderRadius: isMobile ? 0 : 3,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1, xl: 3 },
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                backgroundColor: theme.palette.primary.main,
                width: 40,
                height: 40,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Security sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: { xs: 16, xl: 18 } }} fontWeight="bold" color="text.primary">
                Nueva Garantía
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sistema de Gestión Financiera
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            {/* {autoSaving && (
              <Tooltip title="Guardando automáticamente" arrow>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    Guardando...
                  </Typography>
                </Box>
              </Tooltip>
            )} */}
            <IconButton
              onClick={cerrarModal}
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                  transform: "scale(1.1)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Stack>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ px: { xs: 2, md: 3 } }}>
          <LinearProgress
            variant="determinate"
            value={(activeStep / (steps.length - 1)) * 100}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                transition: "transform 0.4s ease-in-out",
              },
            }}
          />
        </Box>

        {/* Stepper */}
        <Box sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
          <ResponsiveStepper activeStep={activeStep} steps={steps} isMobile={isMobile} isTablet={isTablet} />
        </Box>

        {/* Content */}
        <Container
          maxWidth="md"
          sx={{
            px: { xs: 2, md: 3 },
            pb: 3,
            minHeight: isMobile ? "auto" : "60vh",
          }}
        >
          {renderStepContent(activeStep)}
        </Container>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          // p: { xs: 2, md: 3 },
          p: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          justifyContent: "space-between",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ pt: 2 }}>
          <Button
            onClick={cerrarModal}
            variant="text"
            color="inherit"
            sx={{
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
        </Box>
        <Box sx={{ pt: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              startIcon={<KeyboardArrowLeft />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                minWidth: { xs: 100, md: 120 },
              }}
            >
              Anterior
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={tipoCarga === "100000000" ? handleSubmit(submitDatos) : submitArchivo}
                variant="contained"
                disabled={cargandoCarantia}
                startIcon={cargandoCarantia ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  minWidth: { xs: 100, md: 120 },
                  position: "relative",
                }}
              >
                {cargandoCarantia ? "Procesando..." : "Confirmar"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={
                  (activeStep === 0 && !tipoCarga) ||
                  (activeStep === 1 && tipoCarga === "100000001" && files.length === 0)
                }
                endIcon={<KeyboardArrowRight />}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  minWidth: { xs: 100, md: 120 },
                }}
              >
                Siguiente
              </Button>
            )}
          </Stack>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
