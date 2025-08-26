import React, { useState, useEffect, useContext } from "react"
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
  LinearProgress,
  useTheme,
  alpha,
  Stack,
  Skeleton,
} from "@mui/material"
import {
  AccountCircle,
  LocationOn,
  AttachMoney,
  Save,
  Business,
  Public,
  Map,
  Apartment,
  Home,
  Mail,
} from "@mui/icons-material" // Importar iconos de Material-UI
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormProvider, useForm } from "react-hook-form"
import CustomTextField from "@/@core/components/customFields/CustomTextField" // Asegúrate de que esta ruta sea correcta
import { readOnlyDatos } from "../../keys" // Asegúrate de que esta ruta sea correcta
import useGetProvincias from "@/hooks/useGetProvincias" // Asegúrate de que esta ruta sea correcta
import useGetPaises from "@/hooks/useGetPaises" // Asegúrate de que esta ruta sea correcta
import useGetCondicionesAFIP from "@/hooks/useGetCondicionesAFIP" // Asegúrate de que esta ruta sea correcta
import { useToast } from "@/@core/components/toast/ToastProvider"
import useUpdateCuenta from "@/hooks/useUpdateCuenta" // Asegúrate de que esta ruta sea correcta
import useGetMiCuenta from "@/hooks/useGetMiCuenta" // Asegúrate de que esta ruta sea correcta

const PerfilInfo = ({ data }) => {
  const theme = useTheme()
  const { toast } = useToast()
  const { loadingCuenta } = useGetMiCuenta()
  const { opcionesProvincias } = useGetProvincias()
  const { opcionesPaises } = useGetPaises()
  const { condiciones } = useGetCondicionesAFIP()
  const updateCuenta = useUpdateCuenta()
  const [calle, setCalle] = useState("")
  const [numero, setNumero] = useState("")
  const [piso, setPiso] = useState("")
  const [depto, setDepto] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [municipio, setMunicipio] = useState("")
  const [localidad, setLocalidad] = useState("")
  const [provincia, setProvincia] = useState(null)
  const [pais, setPais] = useState(null)
  const [inscripcionGanancias, setInscripcionGanancias] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false) // Estado para el botón de actualizar

  const validacionSchema = yup.object().shape({}) // Esquema de validación vacío, se mantiene la validación manual por ahora

  const { handleSubmit, setValue, ...methods } = useForm({
    shouldUnregister: false,
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(validacionSchema),
  })

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key])
      })
      setCalle(data?.address1_line1 || "")
      setNumero(data?.new_direccion1numero || "")
      setPiso(data?.address1_name || "")
      setDepto(data?.new_direccion1depto || "")
      setCodigoPostal(data?.address1_postalcode || "")
      setMunicipio(data?.address1_county || "")
      setLocalidad(data?.new_localidad || "")
      setPais(
        data?._new_pais_value
          ? {
            label: data["_new_pais_value@OData.Community.Display.V1.FormattedValue"],
            value: data._new_pais_value,
          }
          : null,
      )
      setProvincia(
        data?._new_provincia_value
          ? {
            label: data["_new_provincia_value@OData.Community.Display.V1.FormattedValue"],
            value: data._new_provincia_value,
          }
          : null,
      )
      setInscripcionGanancias(
        data?._new_condiciondeinscripcionanteafip_value
          ? {
            label: data["_new_condiciondeinscripcionanteafip_value@OData.Community.Display.V1.FormattedValue"],
            value: data._new_condiciondeinscripcionanteafip_value,
          }
          : null,
      )
    }
  }, [data, setValue])

  const handleUpdateCuenta = async (e) => {
    debugger
    e.preventDefault()
    setIsUpdating(true) // Iniciar estado de carga del botón

    let provincia_id = ""
    let pais_id = ""
    let inscripcion_id = ""

    // Validaciones manuales
    if (!calle || calle.trim() === "") {
      toast.error("La calle es requerida!")
      setIsUpdating(false)
      return
    }
    if (!numero || numero.toString().trim() === "") {
      toast.error("El número de la calle es requerido!")
      setIsUpdating(false)
      return
    }
    if (!codigoPostal || codigoPostal.trim() === "") {
      toast.error("El código postal es requerido!")
      setIsUpdating(false)
      return
    }
    if (!localidad || localidad.trim() === "") {
      toast.error("La localidad es requerida!")
      setIsUpdating(false)
      return
    }
    if (!provincia) {
      toast.error("La provincia es requerida!")
      setIsUpdating(false)
      return
    }
    if (!pais) {
      toast.error("El país es requerido!")
      setIsUpdating(false)
      return
    }

    if (provincia) {
      provincia_id = provincia.value
    }
    if (pais) {
      pais_id = pais.value
    }
    if (inscripcionGanancias) {
      inscripcion_id = inscripcionGanancias.value
    }

    try {
      await updateCuenta(calle, numero, piso, depto, provincia_id, localidad, municipio, codigoPostal, inscripcion_id, pais_id, toast)
      toast.success("¡Información actualizada con éxito!")
    } catch (error) {
      toast.error("Error al actualizar la información. Inténtalo de nuevo.")
      console.error("Error updating account:", error)
    } finally {
      setIsUpdating(false) // Finalizar estado de carga del botón
    }
  }

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
        <Grid container spacing={2}>
          {Array.from({ length: 2 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: 2 }} />
      </Grid>
    </Grid>
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loadingCuenta ? (
          renderSkeleton()
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleUpdateCuenta)}>
              <Stack spacing={2}>
                {/* Sección de Información Personal */}
                <Card
                  sx={{
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.02)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                      <AccountCircle sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        Información Personal
                      </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: { xs: 1, xl: 2 } }}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          name="name"
                          label="Razón Social / Nombre Completo"
                          fullWidth
                          InputProps={{ readOnly: true }}
                          defaultValue={data?.name || ""}
                        />
                      </Grid>

                      <Grid item xs={12} sm={3} sx={{ mt: { xs: 2, md: 0 } }}>
                        <TextField
                          name="new_nmerodedocumento"
                          label="CUIT / CUIL"
                          fullWidth
                          InputProps={{ readOnly: true }}
                          defaultValue={data?.new_nmerodedocumento || ""}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} sx={{ mt: { xs: 2, md: 0 } }}>
                        <TextField
                          name="emailaddress1"
                          label="Email Principal"
                          fullWidth
                          InputProps={{ readOnly: true }}
                          defaultValue={data?.emailaddress1 || ""}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3} sx={{ mt: { xs: 2, md: 0 } }}>
                        <TextField
                          name="telephone1"
                          label="Teléfono Principal"
                          fullWidth
                          InputProps={{ readOnly: true }}
                          defaultValue={data?.telephone1 || ""}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Sección de Dirección */}
                <Card
                  sx={{
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.main, 0.02)})`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                      <LocationOn sx={{ fontSize: 32, color: theme.palette.info.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        Dirección
                      </Typography>
                    </Box>
                    <Grid container spacing={3} sx={{ mt: { xs: 1, xl: 2 } }}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Calle"
                          fullWidth
                          value={calle}
                          onChange={(e) => setCalle(e.target.value)}
                          required
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          InputLabelProps={{
                            sx: {
                              color: theme.palette.text.primary,
                              "& .MuiFormLabel-asterisk": {
                                color: theme.palette.error.dark,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Número"
                          fullWidth
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          required
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          InputLabelProps={{
                            sx: {
                              color: theme.palette.text.primary,
                              "& .MuiFormLabel-asterisk": {
                                color: theme.palette.error.dark,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Piso"
                          fullWidth
                          value={piso}
                          onChange={(e) => setPiso(e.target.value)}
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Departamento"
                          fullWidth
                          value={depto}
                          onChange={(e) => setDepto(e.target.value)}
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Código Postal"
                          fullWidth
                          value={codigoPostal}
                          onChange={(e) => setCodigoPostal(e.target.value)}
                          required
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          InputLabelProps={{
                            sx: {
                              color: theme.palette.text.primary,
                              "& .MuiFormLabel-asterisk": {
                                color: theme.palette.error.dark,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Municipio / Partido / Comuna"
                          fullWidth
                          value={municipio}
                          onChange={(e) => setMunicipio(e.target.value)}
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Localidad"
                          fullWidth
                          value={localidad}
                          onChange={(e) => setLocalidad(e.target.value)}
                          required
                          InputProps={{ readOnly: readOnlyDatos }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          InputLabelProps={{
                            sx: {
                              color: theme.palette.text.primary,
                              "& .MuiFormLabel-asterisk": {
                                color: theme.palette.error.dark,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          options={opcionesProvincias || []}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          value={provincia}
                          onChange={(_, newValue) => setProvincia(newValue)}
                          loading={opcionesProvincias?.length === 0}
                          loadingText="Cargando provincias..."
                          readOnly={readOnlyDatos}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Provincia"
                              required
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {opcionesProvincias?.length === 0 ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  "& .MuiFormLabel-asterisk": {
                                    color: theme.palette.error.dark,
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Autocomplete
                          options={opcionesPaises || []}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          value={pais}
                          onChange={(_, newValue) => setPais(newValue)}
                          loading={opcionesPaises?.length === 0}
                          loadingText="Cargando países..."
                          readOnly={readOnlyDatos}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="País"
                              required
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {opcionesPaises?.length === 0 ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  "& .MuiFormLabel-asterisk": {
                                    color: theme.palette.error.dark,
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Sección de Información Fiscal */}
                <Card
                  sx={{
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.success.main, 0.02)})`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                      <AttachMoney sx={{ fontSize: 32, color: theme.palette.success.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        Información Fiscal
                      </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: { xs: 1, xl: 2 } }}>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          id="inscripcion-ganancias"
                          options={condiciones || []}
                          getOptionLabel={(option) => option.label || ""}
                          isOptionEqualToValue={(option, value) => option.label === value.label}
                          value={inscripcionGanancias}
                          onChange={(event, newValue) => setInscripcionGanancias(newValue)}
                          readOnly={readOnlyDatos}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Condición de Inscripción ante AFIP"
                              required
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                              InputLabelProps={{
                                sx: {
                                  color: theme.palette.text.primary,
                                  "& .MuiFormLabel-asterisk": {
                                    color: theme.palette.error.dark,
                                  },
                                },
                              }}
                            />
                          )}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Botón de Actualizar */}
                {!readOnlyDatos && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={handleUpdateCuenta}
                      disabled={isUpdating}
                      startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          transform: "translateY(-2px)",
                          boxShadow: theme.shadows[8],
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isUpdating ? "Actualizando..." : "Actualizar Información"}
                    </Button>
                  </Box>
                )}
              </Stack>
            </form>
          </FormProvider>
        )}
      </Grid>
    </Grid>
  )
}

export default PerfilInfo
