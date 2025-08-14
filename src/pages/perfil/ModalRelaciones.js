import React, { useContext, useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  useTheme,
  FormControlLabel,
  Checkbox,
  FormControl,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
  Box,
  Slide,
  alpha,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useMediaQuery,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import * as Yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

// Icons
import {
  Close as CloseIcon,
  Business,
  Person,
  CheckCircle,
  NavigateNext,
  NavigateBefore,
  AccountBox,
  Assignment,
  Description,
  PersonAdd,
  CorporateFare,
  Badge,
} from "@mui/icons-material"
import toast from 'react-hot-toast'
import { Relaciones } from "@/context/GetRelacionesContext"
import { AuthContext } from "@/context/AuthContext"
import { useToast } from "@/@core/components/toast/ToastProvider"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Validation function for CUIT/CUIL
const validarCuitCuil = (cuit) => {
  let numero = ''
  if (Number.isInteger(cuit)) {
    numero = cuit?.toString()
  } else {
    numero = cuit
  }
  if (!numero || numero.length !== 11) return false
  const primerDigito = Number.parseInt(numero.charAt(0))
  if (primerDigito !== 2 && primerDigito !== 3) return false

  const coeficientes = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  let suma = 0
  for (let i = 0; i < 10; i++) {
    const digito = Number.parseInt(numero.charAt(i))
    suma += digito * coeficientes[i]
  }
  const residuo = suma % 11
  if (residuo === 0) {
    return Number.parseInt(numero.charAt(10)) === 0
  } else {
    const ultimoDigito = Number.parseInt(numero.charAt(10))
    const resultado = 11 - residuo
    return resultado === ultimoDigito
  }
}

// Step configuration
const getSteps = () => [
  {
    label: 'Tipo de Relación',
    description: 'Selecciona la personería y tipo de vinculación',
    icon: AccountBox,
  },
  {
    label: 'Datos Personales',
    description: 'Completa la información de la persona o empresa',
    icon: PersonAdd,
  },
  {
    label: 'Detalles de Relación',
    description: 'Especifica los detalles según el tipo de relación',
    icon: Assignment,
  },
]

// Personeria Card Component
const PersoneriaCard = ({ option, selected, onClick, disabled = false }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const IconComponent = option?.icon
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
        height: isMobile ? 120 : 140,
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
      <CardContent sx={{ p: 2, textAlign: "center", height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Avatar
          sx={{
            width: isMobile ? 40 : 56,
            height: isMobile ? 40 : 56,
            bgcolor: selected ? option?.color : alpha(option?.color, 0.1),
            color: selected ? "#ffffff" : option?.color,
            mx: "auto",
            mb: 1,
            transition: "all 0.3s ease",
            boxShadow: selected ? `0 8px 25px ${alpha(option?.color, 0.4)}` : "none",
          }}
        >
          <IconComponent fontSize={isMobile ? 'medium' : 'large'} />
        </Avatar>
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: isMobile ? 14 : 16,
            color: selected ? option.color : "text.primary",
            transition: "color 0.3s ease",
            mb: selected ? 1 : 0,
          }}
        >
          {option.label}
        </Typography>
        {selected && (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="Seleccionado"
            size="small"
            sx={{
              fontSize: 11,
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

// Step 1: Tipo de Relación
const StepTipoRelacion = ({ control, watch, errors, readOnlyDatos, esFirmante, setEsFirmante }) => {
  const theme = useTheme()

  const personeriaOptions = [
    { value: "Juridica", label: "Persona Jurídica", icon: Business, color: "#1976d2" },
    { value: "Humana", label: "Persona Física", icon: Person, color: "#2e7d32" },
  ]

  const tipoRelacionesVinculacionJuridica = [
    { value: "100000001", label: "Accionista" },
    { value: "100000002", label: "Beneficiario" },
    { value: "100000003", label: "Miembro del Directorio" },
    { value: "100000004", label: "Representante Legal/Apoderado" },
    { value: "100000007", label: "Asesor/Estructurador del proyecto" },
    { value: "100000005", label: "Otro" },
  ]

  const tipoRelacionesVinculacionHumana = [
    { value: "100000001", label: "Accionista" },
    { value: "100000000", label: "Titular" },
    { value: "100000004", label: "Representante Legal/Apoderado" },
    { value: "100000007", label: "Asesor/Estructurador del proyecto" },
    { value: "100000005", label: "Otro" },
  ]

  const tipoWatch = watch("tipo")

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge color="primary" />
          Selecciona el tipo de personería
        </Typography>

        <Controller
          name="tipo"
          control={control}
          rules={{ required: "La personería es requerida" }}
          render={({ field }) => (
            <Grid container spacing={2}>
              {personeriaOptions.map((option) => (
                <Grid xs={12} sm={6} key={option.value}>
                  <PersoneriaCard
                    option={option}
                    selected={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                    disabled={readOnlyDatos}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        />
        {errors.tipo && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
            {errors.tipo.message}
          </Typography>
        )}
      </Box>

      {tipoWatch && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assignment color="primary" />
            Tipo de vinculación
          </Typography>

          <Grid container spacing={3}>
            <Grid xs={12} sm={8}>
              <FormControl fullWidth error={!!errors.tipoRelacion}>
                <InputLabel>Relación de vinculación *</InputLabel>
                <Controller
                  name="tipoRelacion"
                  control={control}
                  rules={{ required: "El tipo de relación es requerido" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Relación de vinculación *"
                      disabled={readOnlyDatos}
                      sx={{ borderRadius: 2 }}
                    >
                      {(tipoWatch === "Juridica" ? tipoRelacionesVinculacionJuridica : tipoRelacionesVinculacionHumana).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.tipoRelacion && (
                  <FormHelperText>{errors.tipoRelacion.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {tipoWatch === "Humana" && (
              <Grid xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={esFirmante}
                        onChange={(e) => setEsFirmante(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Persona firmante
                      </Typography>
                    }
                    disabled={readOnlyDatos}
                  />
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Stack>
  )
}

// Step 2: Datos Personales
const StepDatosPersonales = ({ control, watch, errors, readOnlyDatos }) => {
  const theme = useTheme()
  const tipoWatch = watch("tipo")
  const relacionWatch = watch("tipoRelacion")

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
          {tipoWatch === "Juridica" ? <CorporateFare color="primary" /> : <Person color="primary" />}
          Datos de la {tipoWatch === "Juridica" ? "Empresa" : "Persona"}
        </Typography>

        <Grid container spacing={3}>
          {tipoWatch === "Juridica" ? (
            <>
              <Grid xs={12} sm={4}>
                <Controller
                  name="razonSocial"
                  control={control}
                  rules={{ required: "La razón social es requerida" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Razón Social *"
                      helperText={errors.razonSocial?.message || "Escribe la razón social"}
                      error={!!errors.razonSocial}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <Controller
                  name="correo"
                  control={control}
                  rules={{
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Correo Electrónico *"
                      type="email"
                      helperText={errors.correo?.message || "Escribe el Correo Electrónico"}
                      error={!!errors.correo}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <Controller
                  name="CUITCUIL"
                  control={control}
                  rules={{
                    required: "El CUIT/CUIL es requerido",
                    validate: (value) => validarCuitCuil(value) || "CUIT/CUIL inválido"
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="CUIT/CUIL *"
                      helperText={errors.CUITCUIL?.message || "Escribe un CUIT/CUIL válido"}
                      error={!!errors.CUITCUIL}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid xs={12} sm={6}>
                <Controller
                  name="Nombre"
                  control={control}
                  rules={{ required: "El nombre es requerido" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre *"
                      helperText={errors.Nombre?.message || "Escribe el nombre"}
                      error={!!errors.Nombre}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <Controller
                  name="Apellido"
                  control={control}
                  rules={{ required: "El apellido es requerido" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Apellido *"
                      helperText={errors.Apellido?.message || "Escribe el apellido"}
                      error={!!errors.Apellido}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <Controller
                  name="CUITCUIL"
                  control={control}
                  rules={{
                    required: "El CUIT/CUIL es requerido",
                    validate: (value) => validarCuitCuil(value) || "CUIT/CUIL inválido"
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="CUIT/CUIL *"
                      helperText={errors.CUITCUIL?.message || "Escribe un CUIT/CUIL válido"}
                      error={!!errors.CUITCUIL}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <Controller
                  name="DNI"
                  control={control}
                  rules={{
                    required: tipoWatch === "Humana" && relacionWatch !== "100000001" ? "El DNI es requerido" : false
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={tipoWatch === "Humana" && relacionWatch !== "100000001" ? "DNI *" : "DNI"}
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      helperText={errors.DNI?.message || "Escribe el DNI"}
                      error={!!errors.DNI}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <Controller
                  name="correo"
                  control={control}
                  rules={{
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Correo Electrónico *"
                      type="email"
                      helperText={errors.correo?.message || "Escribe el Correo Electrónico"}
                      error={!!errors.correo}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <Controller
                  name="telefonoLaboral"
                  control={control}
                  rules={{
                    required: tipoWatch === "Humana" && relacionWatch !== "100000001" ? "El teléfono es requerido" : false
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={tipoWatch === "Humana" && relacionWatch !== "100000001" ? "Teléfono Laboral *" : "Teléfono Laboral"}
                      helperText={errors.telefonoLaboral?.message || "Escribe el Teléfono"}
                      error={!!errors.telefonoLaboral}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Stack>
  )
}

// Step 3: Detalles de Relación
const StepDetallesRelacion = ({ control, watch, errors, readOnlyDatos }) => {
  const theme = useTheme()
  const relacionWatch = watch("tipoRelacion")

  const tipoRelacionAccionistaOptions = [
    { value: "false", label: "Ascendente" },
    { value: "true", label: "Descendente" },
  ]

  const shouldShowDetails = relacionWatch === "100000003" ||
    relacionWatch === "100000002" ||
    relacionWatch === "100000001"

  return (
    <Stack spacing={4}>
      {shouldShowDetails ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Description color="primary" />
            Detalles específicos de la relación
          </Typography>

          <Grid container spacing={3}>
            {relacionWatch === "100000003" && (
              <Grid xs={12} sm={6}>
                <Controller
                  name="cargo"
                  control={control}
                  rules={{ required: "El cargo es requerido" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cargo *"
                      helperText={errors.cargo?.message || "Escribe el cargo"}
                      error={!!errors.cargo}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
            )}

            {relacionWatch === "100000002" && (
              <Grid xs={12} sm={6}>
                <Controller
                  name="porcentaje"
                  control={control}
                  rules={{ required: "El porcentaje es requerido" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Porcentaje *"
                      helperText={errors.porcentaje?.message || "Escribe el porcentaje"}
                      error={!!errors.porcentaje}
                      disabled={readOnlyDatos}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
            )}

            {relacionWatch === "100000001" && (
              <>
                <Grid xs={12} sm={6}>
                  <Controller
                    name="porcentajeParticipacion"
                    control={control}
                    rules={{
                      required: "El porcentaje de participación es requerido",
                      min: { value: 0, message: "El porcentaje no puede ser negativo" },
                      max: { value: 100, message: "El porcentaje no puede ser mayor a 100" }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="% de Participación *"
                        helperText={errors.porcentajeParticipacion?.message || "Escribe el porcentaje"}
                        error={!!errors.porcentajeParticipacion}
                        disabled={readOnlyDatos}
                        InputProps={{
                          endAdornment: '%'
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.relacion}>
                    <InputLabel>Relación *</InputLabel>
                    <Controller
                      name="relacion"
                      control={control}
                      rules={{ required: "La relación es requerida" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Relación *"
                          disabled={readOnlyDatos}
                          sx={{ borderRadius: 2 }}
                        >
                          {tipoRelacionAccionistaOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.relacion && (
                      <FormHelperText>{errors.relacion.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      ) : (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No se requieren detalles adicionales para este tipo de relación.
          </Typography>
        </Paper>
      )}

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
          Observaciones
        </Typography>
        <Controller
          name="Observaciones"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Observaciones"
              helperText="Escribe alguna observación (opcional)"
              disabled={readOnlyDatos}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          )}
        />
      </Box>
    </Stack>
  )
}

const DEFAULT_VALUES_RELACION = {
  tipo: "",
  tipoRelacion: "",
  relacion: "",
  razonSocial: "",
  Nombre: "",
  Apellido: "",
  CUITCUIL: "",
  DNI: "",
  fecha: null,
  lugarNacimiento: "",
  correo: "",
  correo2: "",
  ProfesionOficioActividad: "",
  telefonoLaboral: "",
  cargo: "",
  porcentaje: 0,
  porcentajeParticipacion: null,
  Observaciones: "",
}

const ModalRelaciones = ({
  open = false,
  close = () => { },
  modo = "crear",
  id = null,
  porcentaje = 0
}) => {
  // Simulamos los contextos para evitar errores
  const readOnlyDatos = false
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeStep, setActiveStep] = useState(0)
  const [esFirmante, setEsFirmante] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token, referido } = useContext(AuthContext)
  const { relaciones, createRelacion, updateRelacion } = useContext(Relaciones)
  const { toast } = useToast()
  const steps = getSteps()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: DEFAULT_VALUES_RELACION,
    mode: "onChange",
  })

  // Función optimizada con useCallback
  const cargarDatos = useCallback(() => {
    if (modo === "editar" && id) {
      const relacionSeleccionada = relaciones?.find((item) => item.id === id)
      if (relacionSeleccionada) {
        reset({
          accountid: relacionSeleccionada.accountid,
          contactid: relacionSeleccionada.contactid,
          tipo: relacionSeleccionada.tipo === "contact" ? "Humana" : "Juridica",
          tipoRelacion: relacionSeleccionada?.new_tipoderelacion?.toString(),
          razonSocial: relacionSeleccionada.cuenta_razon_social,
          Nombre: relacionSeleccionada.firstname,
          Apellido: relacionSeleccionada.lastname,
          CUITCUIL: relacionSeleccionada.new_cuitcuil
            ? relacionSeleccionada.new_cuitcuil
            : relacionSeleccionada.cuenta_new_nmerodedocumento,
          DNI: relacionSeleccionada.new_nrodedocumento,
          fecha: relacionSeleccionada.birthdate
            ? new Date(relacionSeleccionada.birthdate)
            : null,
          lugarNacimiento: relacionSeleccionada.new_lugardenacimiento,
          correo: relacionSeleccionada.emailaddress1
            ? relacionSeleccionada.emailaddress1
            : relacionSeleccionada.cuenta_email,
          correo2: relacionSeleccionada.new_correoelectrnicopararecibirestadodecuenta,
          ProfesionOficioActividad: relacionSeleccionada.new_profesionoficioactividad,
          telefonoLaboral: relacionSeleccionada.telephone1,
          estadoCivil: relacionSeleccionada.familystatuscode,
          porcentajeParticipacion: relacionSeleccionada.new_porcentajedeparticipacion,
          porcentaje: relacionSeleccionada.new_porcentajebeneficiario,
          cargo: relacionSeleccionada.new_cargo,
          Observaciones: relacionSeleccionada.new_observaciones,
          relacion: relacionSeleccionada.new_relacion_value
            ? relacionSeleccionada.new_relacion.toString()
            : "",
        })
        setEsFirmante(relacionSeleccionada.new_firmante === true)
      }
    } else {
      reset(DEFAULT_VALUES_RELACION)
      setEsFirmante(false)
    }
  }, [modo, id, relaciones, reset])

  useEffect(() => {
    if (open) {
      cargarDatos()
    }
  }, [open, cargarDatos])

  const tipoWatch = watch("tipo")
  const relacionWatch = watch("tipoRelacion")

  // Validation for each step
  const validateStep = useCallback(async (step) => {
    const fieldsToValidate = {
      0: ['tipo', 'tipoRelacion'],
      1: tipoWatch === "Juridica"
        ? ['razonSocial', 'correo', 'CUITCUIL']
        : ['Nombre', 'Apellido', 'CUITCUIL', 'correo'],
      2: relacionWatch === "100000003"
        ? ['cargo']
        : relacionWatch === "100000002"
          ? ['porcentaje']
          : relacionWatch === "100000001"
            ? ['porcentajeParticipacion', 'relacion']
            : []
    }

    const fields = fieldsToValidate[step] || []
    const result = await trigger(fields)
    return result
  }, [trigger, tipoWatch, relacionWatch])

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(activeStep)
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }, [activeStep, validateStep])

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }, [])

  const handleReset = useCallback(() => {
    setActiveStep(0)
    reset(DEFAULT_VALUES_RELACION)
    setEsFirmante(false)
  }, [reset])

  const handleCloseModal = useCallback(() => {
    handleReset()
    close()
  }, [handleReset, close])

  const onSubmit = async (data) => {
    debugger
    setIsSubmitting(true)
    try {
      if (modo === "editar") {
        await updateRelacion(data, referido?.accountid, id, esFirmante, token, toast)
      } else {
        await createRelacion(data, referido?.accountid, esFirmante, token, toast)
      }
    } catch (error) {
      toast.error("Error al procesar la relación.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        handleCloseModal()
      }, 1000);
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <StepTipoRelacion
            control={control}
            watch={watch}
            errors={errors}
            readOnlyDatos={readOnlyDatos}
            esFirmante={esFirmante}
            setEsFirmante={setEsFirmante}
          />
        )
      case 1:
        return (
          <StepDatosPersonales
            control={control}
            watch={watch}
            errors={errors}
            readOnlyDatos={readOnlyDatos}
          />
        )
      case 2:
        return (
          <StepDetallesRelacion
            control={control}
            watch={watch}
            errors={errors}
            readOnlyDatos={readOnlyDatos}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      TransitionComponent={Transition}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        elevation: 12,
        sx: {
          bgcolor: theme.palette.mode === "dark" ? "#28243D" : "#ffffff",
          borderRadius: isMobile ? 0 : 4,
          border: theme.palette.mode === "dark" ? "1px solid #4A4063" : "none",
          minHeight: isMobile ? "80vh" : "60vh",
        },
      }}
    >
      <AppBar sx={{ position: "relative", background: theme.palette.background.paper, boxShadow: theme.shadows[1] }}>
        <Toolbar>
          <Tooltip title="Cerrar" arrow>
            <IconButton edge="start" color="inherit" onClick={handleCloseModal} aria-label="close">
              <CloseIcon sx={{ color: theme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>
          <Typography sx={{ ml: 2, flex: 1, color: theme.palette.text.primary }} variant="h6" component="div">
            {modo === "editar" && !readOnlyDatos ? "Editar Relación" : null}
            {modo !== "editar" && !readOnlyDatos ? "Agregar Relación" : null}
            {readOnlyDatos ? "Detalles de Relación" : null}
          </Typography>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 4 }}>
            <Stepper
              activeStep={activeStep}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{ mb: 4 }}
            >
              {steps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: index <= activeStep ? theme.palette.primary.main : theme.palette.grey[300],
                            color: index <= activeStep ? 'white' : theme.palette.grey[600],
                          }}
                        >
                          <StepIcon fontSize="small" />
                        </Avatar>
                      )}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {step.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepLabel>
                    {isMobile && (
                      <StepContent>
                        <Box sx={{ py: 2 }}>
                          {getStepContent(index)}
                        </Box>
                      </StepContent>
                    )}
                  </Step>
                )
              })}
            </Stepper>

            {!isMobile && (
              <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
                {getStepContent(activeStep)}
              </Paper>
            )}

            {!isMobile && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<NavigateBefore />}
                  sx={{ borderRadius: 2 }}
                >
                  Anterior
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Procesando...
                        </>
                      ) : (
                        modo === "editar" ? "Guardar Cambios" : "Crear Relación"
                      )}
                    </Button>) : null}
                  {activeStep !== steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                      sx={{ borderRadius: 2 }}
                    >
                      Siguiente
                    </Button>) : null}
                  {/* {activeStep === steps.length - 1 ? (
                    !readOnlyDatos && (
                      <Button
                        // type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Procesando...
                          </>
                        ) : (
                          modo === "editar" ? "Guardar Cambios" : "Crear Relación"
                        )}
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                      sx={{ borderRadius: 2 }}
                    >
                      Siguiente
                    </Button>
                  )} */}
                </Box>
              </Box>
            )}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalRelaciones
