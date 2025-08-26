import { yupResolver } from '@hookform/resolvers/yup'
import { Business, CheckCircle, Close, CorporateFare, Edit, Info, Percent, Person, PersonAdd, Save, Warning } from '@mui/icons-material'
import { Alert, alpha, Avatar, Badge, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogContent, Fade, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'

const ModalAccionistas = ({
    open2,
    handleClose2,
    esActualizacion,
    personeriaOpciones = [],
    person,
    crearAccionista,
    modificarAccionista,
    loadingAccionistas,
    loading,
    habilitarEdicion,
    tipoRelacionAccionista,
    personeriaOnChange,
    accionistaSeleccionado,
    isAccionistaEdditing
}) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    // Componente de sección del formulario

    const ValidateCUITCUIL = (cuit) => {
        let acumulado = 0;
        let respuesta = false;
        let digitos = cuit.split('');
        let digito = parseInt(digitos.pop());

        for (let i = 0; i < digitos.length; i++) {
            acumulado += digitos[9 - i] * (2 + (i % 6));
        }

        let verif = 11 - (acumulado % 11);
        if (verif === 11) {
            verif = 0;
        } else if (verif === 10) {
            verif = 9;
        }
        respuesta = (digito === verif);
        return respuesta;
    }

    const schema = Yup.object().shape({
        person: Yup.string().required('La personería es requerida'),
        razonSocial: Yup.string().when('person', (personeria) => {
            return personeria == '100000000' ? Yup.string().required() : Yup.string().notRequired()
        }),
        nombre: Yup.string().when('person', (personeria) => {
            return personeria == '100000001' ? Yup.string().required() : Yup.string().notRequired()
        }),
        apellido: Yup.string().when('person', (personeria) => {
            return personeria == '100000001' ? Yup.string().required() : Yup.string().notRequired()
        }),
        // razonSocial: Yup.string()
        //     .when('person', {
        //         is: '100000000',
        //         then: Yup.string().required('La razón social es requerida'),
        //         otherwise: Yup.string().nullable(),
        //     }),
        // nombre: Yup.string()
        //     .when('person', {
        //         is: '100000001',
        //         then: Yup.string().required('El nombre es requerido'),
        //         otherwise: Yup.string().nullable(),
        //     }),
        // apellido: Yup.string()
        //     .when('person', {
        //         is: '100000001',
        //         then: Yup.string().required('El apellido es requerido'),
        //         otherwise: Yup.string().nullable(),
        //     }),
        cuitCuil: Yup.string()
            .required('El CUIT/CUIL es requerido')
            .length(11, 'El CUIT/CUIL debe tener 11 caracteres')
            .test('valid-cuit', 'El CUIT/CUIL debe ser válido', (value) => ValidateCUITCUIL(value)),
        porcentaje: Yup.number()
            .typeError('El porcentaje debe ser un número')
            .required('El porcentaje de participación es requerido')
    })

    const defaultValuesObj = {
        nombre: '',
        apellido: '',
        razonSocial: '',
        cuitCuil: '',
        porcentaje: '',
        person: '',
        relacionAccionista: '',
    }

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nombre: '',
            apellido: '',
            razonSocial: '',
            cuitCuil: '',
            porcentaje: '',
            person: '',
            relacionAccionista: '',
        }
    })

    useEffect(() => {
        if (!isAccionistaEdditing.current) {
            reset(defaultValuesObj)
            return
        }
        if (accionistaSeleccionado) {
            reset(accionistaSeleccionado)
        } else {
            reset(defaultValuesObj)
        }
    }, [isAccionistaEdditing, accionistaSeleccionado])

    const personeriaSeleccionada = watch('person')

    // Acciones al enviar
    const onSubmit = (data) => {
        if (esActualizacion) {
            modificarAccionista(data)
        } else {
            crearAccionista(data)
        }
    }

    const FormSection = ({ title, icon: IconComponent, children, alert = null }) => {
        const theme = useTheme()
        const isDark = theme.palette.mode === "dark"

        return (
            <Box sx={{ mb: 2 }}>
                {alert && (
                    <Alert
                        severity={alert.severity}
                        icon={alert.severity === "warning" ? <Warning sx={{ width: { xs: 16, xl: 22 }, height: { xs: 20, xl: 22 } }} /> : <Info sx={{ width: { xs: 16, xl: 22 }, height: { xs: 16, xl: 22 } }} />}
                        sx={{
                            mb: 3,
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
                        <Typography sx={{ fontSize: { xs: 12, xl: 14 } }} fontWeight="medium">
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

    // Componente de tarjeta de selección para personería
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
        <Dialog
            open={open2}
            onClose={handleClose2}
            maxWidth="md"
            fullWidth
            PaperProps={{
                elevation: isDark ? 12 : 8,
                sx: {
                    bgcolor: isDark ? "#28243D" : "#ffffff",
                    borderRadius: 4,
                    border: isDark ? "1px solid #4A4063" : "none",
                    minHeight: "auto",
                    backdropFilter: "blur(10px)",
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                {/* Header */}
                <Box
                    sx={{
                        p: 3,
                        background: isDark
                            ? "linear-gradient(135deg, #332C4E 0%, #3A3356 100%)"
                            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        borderBottom: `1px solid ${isDark ? "#4A4063" : "#e0e0e0"}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                bgcolor: esActualizacion ? "#ff9800" : "#2e7d32",
                                width: { xs: 38, xl: 48 },
                                height: { xs: 38, xl: 48 },
                                boxShadow: `0 4px 12px ${alpha(esActualizacion ? "#ff9800" : "#2e7d32", 0.3)}`,
                            }}
                        >
                            {esActualizacion ? <Edit /> : <PersonAdd />}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: { xs: 16, xl: 20 } }} fontWeight="bold" color="text.primary">
                                {esActualizacion ? "Modificar Accionista" : "Agregar Accionista"}
                            </Typography>
                            <Typography sx={{ fontSize: { xs: 12, xl: 16 } }} color="text.secondary">
                                {esActualizacion ? "Actualizar información del accionista" : "Registrar nuevo accionista"}
                            </Typography>
                        </Box>
                    </Box>

                    <Tooltip title="Cerrar">
                        <IconButton
                            onClick={handleClose2}
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
                    </Tooltip>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Content */}
                    <Box maxWidth="md" sx={{ px: 4, py: 2 }}>
                        {/* <form> */}
                        {/* ...inputs... */}
                        {/* <Button type="submit">Enviar</Button> */}

                        {/* Selección de Personería */}
                        <FormSection
                            title="Tipo de Personería"
                            icon={CorporateFare}
                            alert={{
                                severity: "info",
                                message: "Selecciona si se trata de una persona física o jurídica",
                            }}
                        >
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Controller
                                        name="person"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                {personeriaOpciones.map((option) => (
                                                    <Grid item xs={6} key={option.value} >
                                                        <PersoneriaCard
                                                            key={option.value}
                                                            option={option}
                                                            selected={field.value === option.value}
                                                            onClick={() => field.onChange(option.value)}
                                                        />
                                                    </Grid>
                                                ))}
                                            </>
                                        )}
                                    />
                                    {/* {personeriaOpciones.map((option) => (
                                        <Grid item xs={6} key={option.value}>
                                            <PersoneriaCard
                                                option={option}
                                                selected={person === option.value}
                                                onClick={() => personeriaOnChange(option.value)}
                                            />
                                        </Grid>
                                    ))} */}
                                </Grid>
                            </Grid>
                        </FormSection>
                        {/* Datos Personales */}
                        {personeriaSeleccionada && (
                            <Fade in timeout={600}>
                                <Box>
                                    <Grid container spacing={3}>
                                        {personeriaSeleccionada === "100000001" ? (
                                            // Persona Física
                                            <>
                                                <Grid item xs={4} xl={6}>
                                                    <Controller
                                                        name="nombre"
                                                        control={control}
                                                        rules={{ required: personeriaSeleccionada === "100000001" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Nombre"
                                                                margin="dense"
                                                                fullWidth
                                                                required
                                                                disabled={habilitarEdicion}
                                                                error={Boolean(errors.nombre)}
                                                                helperText={errors.nombre && "Este campo es obligatorio"}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Person color="action" />
                                                                        </InputAdornment>
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
                                                    />
                                                    {/* <TextField
                                                        value={nombre}
                                                        margin="dense"
                                                        id="nombre"
                                                        label="Nombre"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        required={person === "100000001" ? true : false}
                                                        onChange={(e) => setNombre(e.target.value)}
                                                        disabled={habilitarEdicion}
                                                        sx={{ mt: 2 }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Person color="action" />
                                                                </InputAdornment>
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
                                                    /> */}
                                                </Grid>
                                                <Grid item xs={4} xl={6}>
                                                    {/* <TextField
                                                        value={apellido}
                                                        margin="dense"
                                                        id="apellido"
                                                        label="Apellido"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        required={person === "100000001" ? true : false}
                                                        onChange={(e) => setApellido(e.target.value)}
                                                        disabled={habilitarEdicion}
                                                        sx={{ mt: 2 }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Person color="action" />
                                                                </InputAdornment>
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
                                                    /> */}
                                                    <Controller
                                                        name="apellido"
                                                        control={control}
                                                        rules={{ required: personeriaSeleccionada === "100000001" }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Apellido"
                                                                margin="dense"
                                                                fullWidth
                                                                required
                                                                disabled={habilitarEdicion}
                                                                error={Boolean(errors.nombre)}
                                                                helperText={errors.nombre && "Este campo es obligatorio"}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Person color="action" />
                                                                        </InputAdornment>
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
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            // Persona Jurídica
                                            <Grid item xs={4} xl={6}>
                                                <Controller
                                                    name="razonSocial"
                                                    control={control}
                                                    rules={{ required: personeriaSeleccionada === "100000000" }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Razón Social"
                                                            margin="dense"
                                                            fullWidth
                                                            required
                                                            disabled={habilitarEdicion}
                                                            error={Boolean(errors.nombre)}
                                                            helperText={errors.nombre && "Este campo es obligatorio"}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Business color="action" />
                                                                    </InputAdornment>
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
                                                />
                                                {/* <TextField
                                                    value={razonSoc}
                                                    margin="dense"
                                                    id="razonSocial"
                                                    label="Razón Social"
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    required={person === "100000000" ? true : false}
                                                    onChange={(e) => setRazonSoc(e.target.value)}
                                                    disabled={habilitarEdicion}
                                                    sx={{ mt: 2 }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Business color="action" />
                                                            </InputAdornment>
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
                                                /> */}
                                            </Grid>
                                        )}
                                        {/* CUIT/CUIL */}
                                        <Grid item xs={4} xl={6}>
                                            <Controller
                                                name="cuitCuil"
                                                control={control}
                                                rules={{ required: person === "100000000" }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Cuit/Cuil"
                                                        margin="dense"
                                                        fullWidth
                                                        required={true}
                                                        disabled={habilitarEdicion}
                                                        error={Boolean(errors.nombre)}
                                                        placeholder='! Sin espacios ni guiones !'
                                                        helperText={errors.nombre && "Este campo es obligatorio"}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Badge color="action" />
                                                                </InputAdornment>
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
                                            />
                                            {/* <TextField
                                                value={cuitCUIL}
                                                margin="dense"
                                                id="cuitCuil"
                                                label="Cuit/Cuil"
                                                type="number"
                                                fullWidth
                                                variant="outlined"
                                                required={true}
                                                onChange={(e) => setcuitCUIL(e.target.value)}
                                                disabled={habilitarEdicion}
                                                placeholder='! Sin espacios ni guiones !'
                                                sx={{ mt: 2 }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Badge color="action" />
                                                        </InputAdornment>
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
                                            /> */}
                                        </Grid>
                                        {/* Porcentaje */}
                                        <Grid item xs={4} xl={6}>
                                            <Controller
                                                name="porcentaje"
                                                control={control}
                                                // rules={{ required: person === "100000000" }} 
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="% de participación"
                                                        margin="dense"
                                                        fullWidth
                                                        required={true}
                                                        error={Boolean(errors.nombre)}
                                                        inputProps={{ min: 0, max: 100 }}
                                                        helperText={errors.nombre && "Este campo es obligatorio"}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Percent color="action" />
                                                                </InputAdornment>
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
                                            />
                                            {/* <TextField
                                                value={percentaje}
                                                margin="dense"
                                                id="porcentaje"
                                                label="% de participación"
                                                type="number"
                                                inputProps={{ min: 0, max: 100 }}
                                                fullWidth
                                                variant="outlined"
                                                required={true}
                                                onChange={(e) => setPercentaje(e.target.value)}
                                                sx={{ mt: 2 }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Percent color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                    sx: {
                                                        color: theme.palette.text.primary,
                                                        "& .MuiFormLabel-asterisk": {
                                                            color: theme.palette.error.dark,
                                                        },
                                                    },
                                                }}
                                            /> */}
                                        </Grid>

                                        {/* Relación */}
                                        <Grid item xs={4} xl={6}>
                                            <Controller
                                                name="relacionAccionista"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                                        <InputLabel>Relación</InputLabel>
                                                        <Select {...field} label="Relación">
                                                            {tipoRelacionAccionista.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                            {/* <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel id="demo-simple-select-label">Relación</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={relacionAccionista}
                                                    label="Relación"
                                                    onChange={relacionAccionistaOnChange}
                                                // sx={{ mt: 2 }}
                                                >
                                                    {tipoRelacionAccionista.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl> */}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Fade>
                        )}
                        {/* <Button type="submit">Enviar</Button> */}
                    </Box>
                    <Box
                        sx={{
                            p: 3,
                            borderTop: `1px solid ${isDark ? "#4A4063" : "#e0e0e0"}`,
                            bgcolor: isDark ? alpha("#000", 0.2) : alpha("#000", 0.02),
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Button onClick={handleClose2} variant="outlined" color="inherit">
                            Cancelar
                        </Button>
                        {
                            esActualizacion ? (<Box sx={{ my: 1, position: 'relative' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    // onClick={modificarAccionista}
                                    disabled={loadingAccionistas}
                                    startIcon={<Edit />}
                                    sx={{
                                        fontWeight: "bold",
                                        minWidth: 160,
                                        bgcolor: esActualizacion ? "#ff9800" : "#2e7d32",
                                        "&:hover": {
                                            bgcolor: esActualizacion ? "#f57c00" : "#1b5e20",
                                        },
                                    }}
                                >
                                    Modificar
                                </Button>
                                {loading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: '#379634',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>) :
                                (
                                    <Box sx={{ my: 1, position: 'relative' }}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            // onClick={crearAccionista}
                                            disabled={loadingAccionistas}
                                            startIcon={<Save />}
                                            sx={{
                                                fontWeight: "bold",
                                                minWidth: 160,
                                                bgcolor: esActualizacion ? "#ff9800" : "#2e7d32",
                                                "&:hover": {
                                                    bgcolor: esActualizacion ? "#f57c00" : "#1b5e20",
                                                },
                                            }}
                                        >
                                            Agregar
                                        </Button>
                                        {loading && (
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    color: '#379634',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    marginTop: '-12px',
                                                    marginLeft: '-12px',
                                                }}
                                            />
                                        )}
                                    </Box>
                                )
                        }
                    </Box>
                </form>
                {/* Actions */}
            </DialogContent>
        </Dialog>
    )
}

export default ModalAccionistas