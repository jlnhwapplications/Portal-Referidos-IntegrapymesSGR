import React, { useContext, useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
    Dialog,
    DialogContent,
    Button,
    TextField,
    Typography,
    Box,
    Stack,
    Slide,
    AppBar,
    Toolbar,
    IconButton,
    CircularProgress,
    useTheme,
    Avatar,
    alpha,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import CloseIcon from "@mui/icons-material/Close"
import BusinessIcon from "@mui/icons-material/Business"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import { AuthContext } from "@/context/AuthContext"
import { SociedadesDeBolsa } from "@/context/GetSociedadesDeBolsaContext"
import CustomTextField from "@/@core/components/customFields/CustomTextField"
import CustomSearchSelect from "@/@core/components/customFields/CustomSearchSelect"
import useGetSociedadesDeBolsa from "@/hooks/useGetSociedadesDeBolsa"
import { readOnlyDatos } from "@/keys"
import { useToast } from "@/@core/components/toast/ToastProvider"
import { Close, Security } from "@mui/icons-material"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const ModalSociedadBolsa = ({ open, handleClose, modo, id }) => {
    const { sociedadXbolsa, createSociedad, updateSociedad } = useContext(SociedadesDeBolsa)
    const { opcionesSociedadBolsa } = useGetSociedadesDeBolsa()
    const { token, referido } = useContext(AuthContext)
    const { toast } = useToast()
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"

    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues = {
        sociedades: null,
        cuentaComitente: "",
    }

    const validationSchema = yup.object().shape({
        sociedades: yup.object().required("Seleccione una sociedad de bolsa"),
        cuentaComitente: yup
            .string()
            .required("La cuenta comitente es obligatoria")
            .min(3, "La cuenta debe tener al menos 3 caracteres"),
    })

    const methods = useForm({
        shouldUnregister: false,
        defaultValues,
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    })

    const { handleSubmit, reset } = methods

    useEffect(() => {
        if (sociedadXbolsa?.length > 0 && modo === "editar") {
            const valor = sociedadXbolsa.find((item) => item.id === id)
            if (valor) {
                const defaultValuesEditar = {
                    sociedades: {
                        label: valor.new_sociedaddebolsa_value,
                        value: valor.new_sociedaddebolsaid,
                    },
                    cuentaComitente: valor.new_cuentacomitente || "",
                }
                reset(defaultValuesEditar)
            }
        } else {
            reset(defaultValues)
        }
    }, [sociedadXbolsa, modo, id, reset])

    const ProcesarCreacion = async (datos) => {
        setIsSubmitting(true)
        try {
            await createSociedad(referido?.accountid, datos, token, toast)
            // toast.success("Sociedad de bolsa agregada exitosamente")
            setTimeout(() => {
                reset(defaultValues)
                handleClose()
            }, 1000)
        } catch (error) {
            toast.error("Error al agregar la sociedad de bolsa")
        } finally {
            setIsSubmitting(false)
        }
    }

    const ProcesarEdicion = async (datos) => {
        setIsSubmitting(true)
        try {
            await updateSociedad(id, referido?.accountid, datos, token, toast)
            // toast.success("Sociedad de bolsa actualizada exitosamente")
            setTimeout(() => {
                reset(defaultValues)
                handleClose()
            }, 1000)
        } catch (error) {
            toast.error("Error al actualizar la sociedad de bolsa")
        } finally {
            setIsSubmitting(false)
        }
    }

    const onClose = () => {
        reset(defaultValues)
        handleClose()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: theme.palette.background,
                    border: isDark ? `1px solid ${theme.palette.divider}` : "none",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                },
            }}
        >
            <Box
                sx={{
                    p: 2,
                    bgcolor: theme.palette.background,
                    borderBottom: `1px solid ${isDark ? theme.palette.divider : "#e0e0e0"}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                            boxShadow: isDark ? "0 4px 12px rgba(100, 181, 246, 0.3)" : "0 4px 12px rgba(25, 118, 210, 0.3)",
                        }}
                    >
                        <Security />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                            {modo === "editar" ? "Editar sociedad de bolsa" : "Agregar Sociedad de Bolsa"}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        bgcolor: isDark ? alpha("#f44336", 0.1) : alpha("#f44336", 0.05),
                        color: "error.main",
                        "&:hover": {
                            bgcolor: isDark ? alpha("#f44336", 0.2) : alpha("#f44336", 0.1),
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    <Close />
                </IconButton>
                {/* </Toolbar> */}
            </Box>

            {/* </AppBar> */}

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 4 }}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(modo === "editar" ? ProcesarEdicion : ProcesarCreacion)}>
                            {/* Información de la Sociedad */}
                            <Box sx={{ mb: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <BusinessIcon color="primary" />
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        Información de la Sociedad
                                    </Typography>
                                </Stack>

                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <CustomSearchSelect
                                            name="sociedades"
                                            label="Sociedad de Bolsa"
                                            placeholder="Seleccionar Sociedad"
                                            helperText="Seleccione la sociedad de bolsa"
                                            options={opcionesSociedadBolsa?.length ? opcionesSociedadBolsa : []}
                                            variant="outlined"
                                            disabled={readOnlyDatos}
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
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Información de la Cuenta */}
                            <Box sx={{ mb: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <AccountBalanceIcon color="primary" />
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        Información de la Cuenta
                                    </Typography>
                                </Stack>

                                <Grid container spacing={3}>
                                    <Grid xs={12}>
                                        <CustomTextField
                                            Component={TextField}
                                            label="Cuenta Comitente"
                                            name="cuentaComitente"
                                            helperText="Ingrese el número de cuenta comitente"
                                            variant="outlined"
                                            required
                                            InputProps={{
                                                readOnly: readOnlyDatos,
                                                sx: { borderRadius: 2 },
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
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Botones de Acción */}
                            {!readOnlyDatos && (
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={onClose}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            bgcolor: "#2e7d32",
                                            // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                            // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
                                            "&:hover": {
                                                bgcolor: "#1b5e20",
                                                transform: "translateY(-2px)",
                                                // boxShadow: "0 6px 20px rgba(255, 105, 135, .4)",
                                            },
                                            "&:disabled": {
                                                background: "rgba(255,255,255,0.3)",
                                            },
                                        }}
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        {isSubmitting ? "Procesando..." : modo === "editar" ? "Actualizar" : "Agregar"}
                                    </Button>
                                </Box>
                            )}
                        </form>
                    </FormProvider>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ModalSociedadBolsa
