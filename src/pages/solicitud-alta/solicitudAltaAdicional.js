import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ListItemIcon, Typography, Divider, ListItemSecondaryAction, Fade, alpha, Container, Stack, LinearProgress, Chip, useMediaQuery } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { styled } from '@mui/material/styles';
import CustomTextField from '../../@core/components/customFields/CustomTextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';
import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import ReCAPTCHA from 'react-google-recaptcha'
import { RecaptchaKey, documentacionLufeYParametrizada } from '@/keys'
import { setearRobot } from '@/redux/DatosSolicitudAlta'
import DownloadIcon from '@mui/icons-material/Download';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { AttachFile, CheckCircle, CloudUpload, Description, FolderOpen, GetApp, HelpOutline, Warning, Error, Person, Business } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import MoreIcon from '@mui/icons-material/More';
const verde = green[500]; // #f44336

const SolicitudAltaAdicional = (
    { personeria,
        condicionImpositiva,
        documentosFiltrados,
        condicionesAFIP,
        docsDTOs, handleOpen,
        setDatosDocumento,
        handleOpen2,
        handleOpenCarpeta,
        accionistas,
        editarAccionista,
        handleOpenEliminarAccionista,
        storage,
        agregarDocumentos,
        documentosLufe,
        entidadLufeEncontrada
    }) => {

    const dispatch = useDispatch()
    const [dense, setDense] = useState(false);
    const [documentos, setDocumentos] = useState([])
    const [cargoStorage, setCargoStorage] = useState(false)
    const [robot, setRobot] = useState(false)
    const robotS = useSelector(store => store.datos.robot)
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))

    
    React.useEffect(() => {
        if (!entidadLufeEncontrada || documentacionLufeYParametrizada) {
            if ((documentosFiltrados == undefined || documentosFiltrados.length == 0) && storage != null && storage?.docsDTOs?.length > 0) {
                if (condicionesAFIP != undefined) {
                    setDocumentos(filtrarDocumentosPorCondicionAFIP(condicionesAFIP, storage.docsDTOs, condicionImpositiva))
                }
                setCargoStorage(true)
            } else { //No entra aca cuando carga primero del localstorage
                if (documentosFiltrados !== undefined && documentosFiltrados.length !== 0 && documentosFiltrados !== null) {
                    setDocumentos(filtrarDocumentosPorCondicionAFIP(condicionesAFIP, documentosFiltrados, condicionImpositiva))
                } else if (docsDTOs != undefined && docsDTOs.length !== undefined && docsDTOs.length > 0) {
                    var docs = docsDTOs
                    var docsFiltrados = filtrarDocumentosPorCondicionAFIP(condicionesAFIP, docs, condicionImpositiva)
                    setDocumentos(docsFiltrados)
                }
            }
        } else {
            if (documentosLufe?.length > 0) {
                setDocumentos(documentosLufe)
            } else {
                var currentData = localStorage.getItem("documentosLufe")
                currentData = currentData ? JSON.parse(currentData) : {};
                setDocumentos(currentData)
            }
        }
        if (personeria !== '') {
            if (personeria === '100000000') {
                var juridica = document.getElementById('juridica')
                juridica.style.display = 'block';
            }
        }
    }, [personeria, condicionImpositiva, accionistas, condicionesAFIP, entidadLufeEncontrada])

    const filtrarDocumentos = (docs, condicionImpositiva) => {
        var documentosFiltrados = []
        docs.forEach(doc => {
            if (doc.new_condicionimpositiva != null) {
                var condiciones = doc.new_condicionimpositiva.split(',')
                condiciones.forEach(item => {
                    if (item === condicionImpositiva) {
                        documentosFiltrados.push(doc)
                    }
                })
            } else {
                documentosFiltrados.push(doc)
            }
        })
        return documentosFiltrados
    }

    const filtrarDocumentosPorCondicionAFIP = (condiciones, docs, condicionImpositiva) => {
        var documentosFiltrados = []
        var documentosFiltradosXAFIP = []
        if (condiciones != undefined) {
            condiciones.filter(item => item.new_condiciondeinscipcionanteafipid == condicionImpositiva.value).forEach(condicion => {
                if (documentosFiltrados.length > 0 && condicion.new_documentacionid != null && condicion.new_documentacionid != "") {
                    if (documentosFiltrados.filter(item => item == condicion.new_documentacionid).length == 0) {
                        documentosFiltrados.push(condicion.new_documentacionid)
                    }
                } else {
                    if (condicion.new_documentacionid != null && condicion.new_documentacionid != "") {
                        documentosFiltrados.push(condicion.new_documentacionid)
                    }
                }
            })
        }

        if (docs != undefined && docs.length > 0) {
            docs.forEach(documento => {
                if (documentosFiltrados.length > 0 &&
                    documentosFiltrados.filter(item => item == documento.new_documentacionid).length > 0) {
                    documentosFiltradosXAFIP.push(documento)
                } else if (condiciones != undefined && condiciones.length > 0) {
                    if (condiciones.filter(item => item.new_documentacionid == documento.new_documentacionid).length == 0) {
                        documentosFiltradosXAFIP.push(documento)
                    }
                } else {
                    documentosFiltradosXAFIP.push(documento)
                }
            })
        }
        if (documentosFiltradosXAFIP.length > 0) {
            agregarDocumentos(documentosFiltradosXAFIP)
        }

        return documentosFiltradosXAFIP
    }

    //obtener el nombre del doc a cargar
    const obtenerDocumento = async (e) => {
        let nombreDocumento = ""
        documentos.filter(elemento => elemento.new_documentacionid === e).map(item => {
            nombreDocumento = item.new_name
        })
        setDatosDocumento(nombreDocumento + ':' + e)
        handleOpen();
    }

    const obtenerCarpeta = async (e) => {
        let nombreDocumento = ""
        documentos.filter(elemento => elemento.new_documentacionid === e).map(item => {
            nombreDocumento = item.new_name
        })
        setDatosDocumento(nombreDocumento + ':' + e)
        handleOpenCarpeta();
    }

    const calcularMegabytes = (bytes) => {
        var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 MB';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    const obtenerPeso = (docs = []) => {
        var peso = 0
        if (docs.length > 0) {
            docs?.forEach(element => {
                if (element.pesoArchivo != undefined && element.pesoArchivo != null
                    && element.pesoArchivo != 0 && element.pesoArchivo > 0) {
                    peso += element.pesoArchivo
                }
            })
        }
        return peso
    }

    // const robotOnChange = (value) => {
    //     var valor = ""
    //     if (value) {
    //         valor = "True"
    //         setRobot(true)
    //         dispatch(setearRobot(true))
    //     } else {
    //         valor = "False"
    //         setRobot(false)
    //         dispatch(setearRobot(false))
    //     }
    // }

    const actionButtonStyle = {
        width: 40,
        height: 40,
        borderRadius: 2,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "inherit",
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 0,
        },
        "& > *": {
            position: "relative",
            zIndex: 1,
        },
        "&:hover": {
            transform: "translateY(-2px) scale(1.05)",
            "&::before": {
                opacity: 1,
            },
        },
    }



    return (
        <Fade in timeout={600}>
            <Container maxWidth="lg" >
                <Grid container spacing={4}>
                    <Grid xs={12} sm={6} item>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar
                                sx={{
                                    bgcolor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1),
                                    color: isDark ? "#64b5f6" : "#1976d2",
                                    width: { xs: 30, xl: 40 },
                                    height: { xs: 30, xl: 40 },
                                }}
                            >
                                <AttachFile sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: { xs: 18, xl: 22 } }} fontWeight="bold" color="text.primary">
                                    Documentación requerida
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 3, borderColor: isDark ? "#4A4063" : "#e0e0e0" }} />
                        <List dense={dense} sx={{ py: 0 }}>
                            {documentos?.map((item, index) =>
                                <Paper
                                    key={(!entidadLufeEncontrada || documentacionLufeYParametrizada) ? item.new_name : item.nombre}
                                    elevation={isDark ? 2 : 1}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 3,
                                        bgcolor: isDark ? alpha("#000", 0.2) : "#ffffff",
                                        border: isDark ? alpha("#000", 0.5) : "1px solid #e0e0e0",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": {
                                            transform: "translateY(-1px)",
                                            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
                                        },
                                    }}
                                >
                                    <ListItem
                                        sx={{
                                            py: dense ? 1 : 1.5,
                                            px: 2,
                                        }}
                                    >
                                        {/* Checkbox y estado */}
                                        <ListItemIcon sx={{ minWidth: 48 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {(!entidadLufeEncontrada || documentacionLufeYParametrizada) &&
                                                    (
                                                        <Tooltip
                                                            title={
                                                                <Typography variant="body2" sx={{ color: "#fff", fontWeight: "medium" }}>
                                                                    Estado: {item.documentoCargado ? "Completado" : (
                                                                        item.new_requeridoenporta ? "Requerido" : "Pendiente")}
                                                                </Typography>
                                                            }
                                                            arrow
                                                        >
                                                            {item.documentoCargado ?
                                                                <Avatar
                                                                    sx={{
                                                                        width: { xs: 28, xl: 32 },
                                                                        height: { xs: 28, xl: 32 },
                                                                        bgcolor: alpha("#4caf50", 0.1),
                                                                        border: `2px solid ${alpha("#4caf50", 0.3)}`,
                                                                    }}
                                                                >
                                                                    <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
                                                                    {/* <IconComponent sx={{ fontSize: 18, color: config.color }} /> */}
                                                                </Avatar> : (
                                                                    item.new_requeridoenportal ?
                                                                        <Avatar
                                                                            sx={{
                                                                                width: { xs: 28, xl: 32 },
                                                                                height: { xs: 28, xl: 32 },
                                                                                bgcolor: alpha("#f44336", 0.1),
                                                                                border: `2px solid ${alpha("#f44336", 0.3)}`,
                                                                            }}
                                                                        >
                                                                            <Error sx={{ fontSize: 18, color: '#f44336' }} />
                                                                            {/* <IconComponent sx={{ fontSize: 18, color: config.color }} /> */}
                                                                        </Avatar>
                                                                        :
                                                                        <Avatar
                                                                            sx={{
                                                                                width: { xs: 28, xl: 32 },
                                                                                height: { xs: 28, xl: 32 },
                                                                                bgcolor: alpha("#ff9800", 0.1),
                                                                                border: `2px solid ${alpha("#ff9800", 0.3)}`,
                                                                            }}
                                                                        >
                                                                            <Warning sx={{ fontSize: 18, color: '#ff9800' }} />
                                                                            {/* <IconComponent sx={{ fontSize: 18, color: config.color }} /> */}
                                                                        </Avatar>)}
                                                        </Tooltip>
                                                    )}
                                            </Stack>
                                        </ListItemIcon>
                                        {/* Contenido del documento */}
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: 12, xl: 14 },
                                                            fontWeight: "bold",
                                                            // color: item.new_requeridoenportal ? "#f44336" : "text.primary",
                                                        }}
                                                    >
                                                        {(!entidadLufeEncontrada || documentacionLufeYParametrizada) ? item.new_name : item.nombre}
                                                        {item.new_requeridoenportal && (
                                                            <Chip
                                                                label="Requerido"
                                                                size="small"
                                                                color="error"
                                                                sx={{
                                                                    ml: 1,
                                                                    height: 20,
                                                                    fontSize: "0.7rem",
                                                                    fontWeight: "bold",
                                                                }}
                                                            />
                                                        )}
                                                    </Typography>
                                                </Box>
                                            }

                                            secondary={
                                                (!entidadLufeEncontrada || documentacionLufeYParametrizada) &&
                                                item.new_descripcion && (
                                                    !esPantallaChica ? (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            {item.new_descripcion}
                                                        </Typography>
                                                    ) : null
                                                )
                                            }
                                        />

                                        {/* Acciones */}
                                        {(!entidadLufeEncontrada || documentacionLufeYParametrizada) && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {/* Botón de ayuda */}
                                                {item.new_descripcion && (
                                                    <Tooltip
                                                        title={
                                                            <Box>
                                                                <Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>
                                                                    Información del Documento
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: "#fff", opacity: 0.9 }}>
                                                                    {item.new_descripcion}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                        arrow
                                                        placement="top"
                                                    >
                                                        <IconButton
                                                            sx={{
                                                                ...actionButtonStyle,
                                                                bgcolor: isDark ? alpha("#9c27b0", 0.1) : alpha("#9c27b0", 0.08),
                                                                border: `1px solid ${isDark ? alpha("#9c27b0", 0.3) : alpha("#9c27b0", 0.2)}`,
                                                                color: isDark ? "#ba68c8" : "#7b1fa2",
                                                                "&::before": {
                                                                    background: isDark
                                                                        ? "linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(186, 104, 200, 0.1) 100%)"
                                                                        : "linear-gradient(135deg, rgba(123, 31, 162, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)",
                                                                },
                                                                "&:hover": {
                                                                    ...actionButtonStyle["&:hover"],
                                                                    boxShadow: isDark ? "0 8px 25px rgba(156, 39, 176, 0.3)" : "0 8px 25px rgba(123, 31, 162, 0.2)",
                                                                },
                                                            }}
                                                        >
                                                            <HelpOutline fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {/* Botón de descarga de plantilla */}
                                                {item.new_urlplantilla && (
                                                    <Tooltip
                                                        title={
                                                            <Typography variant="body2" sx={{ color: "#fff", fontWeight: "medium" }}>
                                                                Descargar Plantilla
                                                            </Typography>
                                                        }
                                                        arrow
                                                    >
                                                        <IconButton
                                                            onClick={() => window.open(item.new_urlplantilla, "_blank")}
                                                            // disabled={loadingStates.download}
                                                            sx={{
                                                                ...actionButtonStyle,
                                                                bgcolor: isDark ? alpha("#2196f3", 0.1) : alpha("#2196f3", 0.08),
                                                                border: `1px solid ${isDark ? alpha("#2196f3", 0.3) : alpha("#2196f3", 0.2)}`,
                                                                color: isDark ? "#64b5f6" : "#1976d2",
                                                                "&::before": {
                                                                    background: isDark
                                                                        ? "linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(100, 181, 246, 0.1) 100%)"
                                                                        : "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)",
                                                                },
                                                                "&:hover": {
                                                                    ...actionButtonStyle["&:hover"],
                                                                    boxShadow: isDark ? "0 8px 25px rgba(33, 150, 243, 0.3)" : "0 8px 25px rgba(25, 118, 210, 0.2)",
                                                                },
                                                            }}
                                                        >
                                                            <GetApp fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {/* Botón de abrir carpeta */}
                                                <Tooltip
                                                    title={
                                                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: "medium" }}>
                                                            Abrir Carpeta Digital
                                                        </Typography>
                                                    }
                                                    arrow
                                                >
                                                    <IconButton
                                                        onClick={() => obtenerCarpeta(item.new_documentacionid)}
                                                        // disabled={loadingStates.folder}
                                                        sx={{
                                                            ...actionButtonStyle,
                                                            bgcolor: isDark ? alpha("#ff9800", 0.1) : alpha("#ff9800", 0.08),
                                                            border: `1px solid ${isDark ? alpha("#ff9800", 0.3) : alpha("#ff9800", 0.2)}`,
                                                            color: isDark ? "#ffb74d" : "#f57c00",
                                                            "&::before": {
                                                                background: isDark
                                                                    ? "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 183, 77, 0.1) 100%)"
                                                                    : "linear-gradient(135deg, rgba(245, 124, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)",
                                                            },
                                                            "&:hover": {
                                                                ...actionButtonStyle["&:hover"],
                                                                boxShadow: isDark ? "0 8px 25px rgba(255, 152, 0, 0.3)" : "0 8px 25px rgba(245, 124, 0, 0.2)",
                                                            },
                                                        }}
                                                    >
                                                        <FolderOpen fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Botón de subir archivo */}
                                                <Tooltip
                                                    title={
                                                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: "medium" }}>
                                                            Subir Archivo
                                                        </Typography>
                                                    }
                                                    arrow
                                                >
                                                    <IconButton
                                                        onClick={() => obtenerDocumento(item.new_documentacionid)}
                                                        // disabled={loadingStates.upload}
                                                        sx={{
                                                            ...actionButtonStyle,
                                                            bgcolor: isDark ? alpha("#4caf50", 0.1) : alpha("#4caf50", 0.08),
                                                            border: `1px solid ${isDark ? alpha("#4caf50", 0.3) : alpha("#4caf50", 0.2)}`,
                                                            color: isDark ? "#66bb6a" : "#2e7d32",
                                                            "&::before": {
                                                                background: isDark
                                                                    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(102, 187, 106, 0.1) 100%)"
                                                                    : "linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                                                            },
                                                            "&:hover": {
                                                                ...actionButtonStyle["&:hover"],
                                                                boxShadow: isDark ? "0 8px 25px rgba(76, 175, 80, 0.3)" : "0 8px 25px rgba(46, 125, 50, 0.2)",
                                                            },
                                                        }}
                                                    >
                                                        <CloudUpload fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        )}
                                    </ListItem>
                                </Paper>
                            )}
                        </List>
                    </Grid>
                    <Grid xs={12} sm={6} item>
                        <Grid xs={12} id="juridica" sx={{ mb: 2, p: 0, pb: 1 }} style={{ display: 'none' }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1),
                                        color: isDark ? "#64b5f6" : "#1976d2",
                                        width: { xs: 30, xl: 40 },
                                        height: { xs: 30, xl: 40 },
                                    }}
                                >
                                    <GroupIcon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 } }} />
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: { xs: 18, xl: 22 } }} fontWeight="bold" color="text.primary">
                                        Participación Accionaria
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton edge="end" aria-label="delete" onClick={handleOpen2} sx={{ width: { xs: 30, xl: 40 }, height: { xs: 30, xl: 40 } }}>
                                        <Tooltip title={<Typography sx={{ fontSize: { xs: 12, xl: 14 }, color: '#fff' }}>Agregar Accionista</Typography>}>
                                            <AddBoxIcon sx={{ width: { xs: 20, xl: 24 }, height: { xs: 20, xl: 24 }, color: theme.palette.primary.main }} />
                                        </Tooltip>
                                    </IconButton>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 3, borderColor: isDark ? "#4A4063" : "#e0e0e0" }} />
                            <List dense={dense} sx={{ py: 0 }}>
                                {accionistas?.map((item, index) =>
                                    <Paper
                                        key={item.uid}
                                        elevation={isDark ? 2 : 1}
                                        sx={{
                                            mb: 1,
                                            borderRadius: 3,
                                            bgcolor: isDark ? alpha("#000", 0.2) : "#ffffff",
                                            border: isDark ? alpha("#000", 0.5) : "1px solid #e0e0e0",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&:hover": {
                                                transform: "translateY(-1px)",
                                                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)",
                                            },
                                        }}
                                    >
                                        <ListItem
                                            sx={{
                                                py: dense ? 1 : 1.5,
                                                px: 2,
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: { xs: 18, xl: 22 } }} >
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1),
                                                            color: isDark ? "#64b5f6" : "#1976d2",
                                                            width: { xs: 32, xl: 40 },
                                                            height: { xs: 32, xl: 40 },
                                                        }}
                                                    >
                                                        {item.razonSocial ? <Business fontSize="small" /> : <Person fontSize="small" />}
                                                    </Avatar>
                                                </Stack>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Typography

                                                            sx={{
                                                                fontSize: 14,
                                                                fontWeight: "bold",
                                                                // color: item.new_requeridoenportal ? "#f44336" : "text.primary",
                                                            }}
                                                        >
                                                            {item.razonSocial ?
                                                                `${item.razonSocial} - ${item.cuitcuil}` :
                                                                `${item.nombre} - ${item.cuitcuil}`}
                                                            {item.porcentaje && (
                                                                <Chip
                                                                    label={`${item.porcentaje}%`}
                                                                    size="small"
                                                                    color={item.porcentaje > 0 ? "success" : "error"}
                                                                    sx={{
                                                                        ml: 1,
                                                                        height: 20,
                                                                        fontSize: "0.7rem",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                />
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Tooltip
                                                    title={
                                                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: "medium" }}>
                                                            Editar Accionista
                                                        </Typography>
                                                    }
                                                >
                                                    <IconButton
                                                        onClick={() => editarAccionista(item.uid)}
                                                        sx={{
                                                            ...actionButtonStyle,
                                                            bgcolor: isDark ? alpha("#ff9800", 0.1) : alpha("#ff9800", 0.08),
                                                            border: `1px solid ${isDark ? alpha("#ff9800", 0.3) : alpha("#ff9800", 0.2)}`,
                                                            color: isDark ? "#ffb74d" : "#f57c00",
                                                            "&::before": {
                                                                background: isDark
                                                                    ? "linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 183, 77, 0.1) 100%)"
                                                                    : "linear-gradient(135deg, rgba(245, 124, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)",
                                                            },
                                                            "&:hover": {
                                                                ...actionButtonStyle["&:hover"],
                                                                boxShadow: isDark ? "0 8px 25px rgba(255, 152, 0, 0.3)" : "0 8px 25px rgba(245, 124, 0, 0.2)",
                                                            },
                                                        }}
                                                    >
                                                        <DriveFileRenameOutlineIcon fontSize="small" />
                                                        {/* )} */}
                                                    </IconButton>
                                                </Tooltip>
                                                {!item.relacionDirecta && (
                                                    <Tooltip
                                                        title={
                                                            <Typography variant="body2" sx={{ color: "#fff", fontWeight: "medium" }}>
                                                                Eliminar Accionista
                                                            </Typography>
                                                        }
                                                        arrow
                                                    >
                                                        <IconButton
                                                            onClick={() => handleOpenEliminarAccionista(item.uid)}
                                                            // disabled={loadingStates.upload}
                                                            sx={{
                                                                ...actionButtonStyle,
                                                                bgcolor: isDark ? alpha("#4caf50", 0.1) : alpha("#4caf50", 0.08),
                                                                border: `1px solid ${isDark ? alpha("#4caf50", 0.3) : alpha("#4caf50", 0.2)}`,
                                                                color: isDark ? "#66bb6a" : "#2e7d32",
                                                                "&::before": {
                                                                    background: isDark
                                                                        ? "linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(102, 187, 106, 0.1) 100%)"
                                                                        : "linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                                                                },
                                                                "&:hover": {
                                                                    ...actionButtonStyle["&:hover"],
                                                                    boxShadow: isDark ? "0 8px 25px rgba(76, 175, 80, 0.3)" : "0 8px 25px rgba(46, 125, 50, 0.2)",
                                                                },
                                                            }}
                                                        >
                                                            {/* {loadingStates.upload ? ( */}
                                                            <DeleteIcon fontSize="small" />
                                                            {/* )} */}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </ListItem>
                                    </Paper>
                                )}
                            </List>
                        </Grid>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar
                                sx={{
                                    bgcolor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1),
                                    color: isDark ? "#64b5f6" : "#1976d2",
                                    width: { xs: 30, xl: 40 },
                                    height: { xs: 30, xl: 40 },
                                }}
                            >
                                <MoreIcon sx={{ width: { xs: 18, xl: 24 }, height: { xs: 18, xl: 24 }, mr: 0.5 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: { xs: 18, xl: 22 } }} fontWeight="bold" color="text.primary">
                                    Información Adicional
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2, borderColor: isDark ? "#4A4063" : "#e0e0e0" }} />
                        <Grid sx={{ mt: 2, pt: 2, px: 2 }} xs={12}>
                            <CustomTextField sx={{ m: 0, p: 0 }}
                                Component={TextField}
                                name="cantidadMujeresDecision"
                                label="Cant. Mujeres en Puestos de Toma de Decisión"
                                helperText="Escribe la cantidad"
                                rules={{ required: "Required!" }}
                                req="true"
                                type="number"
                                variant="outlined"
                            />
                        </Grid>
                        {/* <Grid container sx={{m: 0, p: 0}}> */}
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Grid sx={{ mt: 3 }} xs={6} xl={12} item>
                                <CustomTextField sx={{ m: 0, p: 0 }}
                                    Component={TextField}
                                    name="cantidadEmujeres"
                                    label="Cant. Empleados Mujeres"
                                    // helperText="Escribe la cantidad" 
                                    rules={{ required: "Required!" }}
                                    type="number"
                                    variant="outlined" />
                            </Grid>
                            <Grid sx={{ mt: 3 }} xs={6} xl={12} item>
                                <CustomTextField sx={{ width: '100%', m: 0, p: 0 }}
                                    Component={TextField}
                                    name="cantidadPdiscapacidad"
                                    label="Cant. Personas con Discapacidad"
                                    // helperText="Escribe la cantidad" 
                                    rules={{ required: "Required!" }}
                                    type="number"
                                    variant="outlined" />
                            </Grid>
                        </Box>

                        {/* </Grid> */}
                        {/* <Grid sx={{ mt: 2, pl: 2 }} item xs={12}>
                            <ReCAPTCHA
                                size={6}
                                className=""
                                render="explicit"
                                sitekey={RecaptchaKey}
                                onChange={e => robotOnChange(e)}
                            />
                        </Grid> */}

                        {/* </Paper> */}
                    </Grid>
                    {/* <Grid xs={12} sm={6} item id="espacio-blanco" style={{ display: 'none' }}></Grid> */}
                </Grid>
                {/* </Paper> */}
            </Container>
        </Fade>
    )
}

export default SolicitudAltaAdicional