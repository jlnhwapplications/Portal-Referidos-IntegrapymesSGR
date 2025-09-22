import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
// import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Box, Button, Typography, Divider, createTheme, ThemeProvider, FormControlLabel, Switch, Dialog, DialogTitle, ListItemSecondaryAction, ListItemIcon, alpha, CardContent, Card, Fade, Alert, InputAdornment, Badge, FormControl, LinearProgress, Container, formLabelClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import shortid from 'shortid'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import {
    Brightness6Rounded,
    Business,
    CheckCircle, Close, CloudUpload, CorporateFare, DarkMode, Delete, Description, Edit,
    Info, InsertDriveFile, LightMode, Percent, Person, PersonAdd, PictureAsPdf, Save, Warning, FolderOpen as FolderOpenIcon,
    // Description as DescriptionIcon,
    Image as ImageIcon,
    VideoFile as VideoIcon,
    AudioFile as AudioIcon,
    Archive as ArchiveIcon,
    PictureAsPdf as PdfIcon,
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
//Stepper
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Check from '@mui/icons-material/Check';
//formulario y validador yup
import * as yup from 'yup'
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { cargarSolicitudDeAlta, setearRobot, validarUsuarioEnDynamicsPorCuit, obtenerCondicionesDeInscripcionFETCH, validarUsuarioEnDynamicsPorCorreoElectronico } from '@/redux/DatosSolicitudAlta'
import CloseIcon from '@mui/icons-material/Close';
//iconos
//1
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
//2
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
//3
import RequestQuoteSharpIcon from '@mui/icons-material/RequestQuoteSharp';
//4
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
//Formularios
import SolicitudAltaGeneral from './solicitudAltaGeneral';
import SolicitudAltaPersonal from './solicitudAltaPersonal';
import SolicitudAltaCuenta from './solicitudAltaCuenta';
import SolicitudAltaAdicional from './solicitudAltaAdicional';
import SolicitudAltaFinal from './solicitudAltaFinal';
import { agregarDocumentoAcarpeta, obtenerDocumentosOnboardingFETCH } from '@/redux/DatosSolicitudAlta';
import { useDispatch, useSelector } from 'react-redux'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import DescriptionIcon from '@mui/icons-material/Description';
// import { loginToken } from '../Redux/Token'
import FormHelperText from '@mui/material/FormHelperText';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CustomCurrencyField from '../../@core/components/customFields/CustomCurrencyField'
import { AuthContext } from '@/context/AuthContext';
// ** Layout Import
import BlankLayout from '../../@core/layouts/BlankLayout'
const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));
import DropzoneWrapper from "@/styles/libs/react-dropzone";
import { useDropzone } from "react-dropzone";
import Link from 'next/link';
import Icon from 'src/@core/components/icon'
import { lufeHabilitado } from '@/keys'
import useGetLufe from '@/hooks/useGetLufe';
import useGetDocumentosOnboarding from '@/hooks/useGetDocumentosOnboarding';
import useLocalStorage from './useLocalStorage';
import useGetActividadesAFIP from '@/hooks/useGetActividadesAFIP';
import useGetCondicionesAFIPDocumentos from '@/hooks/useGetCondicionesAFIPDocumentos';
import { useRouter } from 'next/router';
import { DireccionOnbHabilitado, LineaDeCreditoHabilitado, documentacionLufeYParametrizada } from '@/keys'
import MultiStepProgressBar from '@/@core/components/multi-step/MultiStepProgressBar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useSettings } from '@/@core/hooks/useSettings';
import ModalCarpeta from './Modales/ModalCarpeta';
import ModalSubirArchivo from './Modales/ModalSubirArchivo';
import ModalAccionistas from './Modales/ModalAccionistas';
import { useToast } from "@/@core/components/toast/ToastProvider"

const SolicitudAlta = (props) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { entidad, getLufe, consultaLufe } = useGetLufe()
    const { documentosOnb } = useGetDocumentosOnboarding()
    const { condicionesAFIP } = useGetCondicionesAFIPDocumentos()
    const { actividadAfipOpciones, actividadAfip } = useGetActividadesAFIP()
    const [activeStep, setActiveStep] = React.useState(0);
    const [documentos, setDocumentos] = React.useState([])
    const [datosDocumento, setDatosDocumento] = React.useState("")
    const [nombreDocumento, setNombreDocumento] = React.useState("")
    const [documentoId, setDocumentoId] = React.useState("")
    const [documentosIds, setDocumentosIds] = React.useState("")
    const [docusCargados, setDocusCargados] = React.useState(0)
    const [documentosDTOs, setDocumentosDTOs] = React.useState([])
    const [selectedFiles, setSelectedFiles] = React.useState([])
    const [pesoArch, setPesoArch] = React.useState(0)
    const [carpeta, setCarpeta] = React.useState([])
    const [carpetas, setCarpetas] = React.useState([])
    const [llamadaDocumentos, setLlamadaDocumentos] = React.useState(false)
    const [llamadaCondiciones, setLlamadaCondiciones] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [archivoSeleccionado, setArchivoSeleccionado] = React.useState('')
    const [loaded, setLoaded] = React.useState(false)
    const documentosSelector = useSelector(store => store.datos.documentos)
    const carpetasSelector = useSelector(store => store.datos.carpetas)
    const estadoOnboardingSelector = useSelector(store => store.datos.estadoOnboarding)
    const robot = useSelector(store => store.datos.robot)
    const condicionesSelector = useSelector(store => store.datos.condicionesAFIP)
    const loadingLufe = useSelector(store => store.cuenta.loadingLufe)
    const [OnboardingCompleto, setOnboardingCompleto] = React.useState(false)
    const [mostrarIconoFinal, setMostrarIconoFinal] = React.useState(false)
    const [mostrarTextoFinal, setMostrarTextoFinal] = React.useState(false)
    const [desabilitadoDocumento, setDesabilitadoDocumento] = React.useState(false)
    const [dense, setDense] = React.useState(false);
    // const token = useSelector(store => store.token)
    const { token, user, RefrescarReferidos } = useContext(AuthContext);
    const [secondary, setSecondary] = React.useState(false);
    const [loadingAccionistas, setLoadingAccionistas] = React.useState()
    // const [condicionesAFIP, setCondicionesAFIP] = React.useState()
    const [documentosFiltradosPorPersoneria, setDocumentosFiltradosPorPersoneria] = React.useState([])
    //estados de los modales
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [openCarpeta, setOpenCarpeta] = React.useState(false);
    const [openReiniciarOnboarding, setOpenReiniciarOnboarding] = React.useState(false);
    const [openEliminarArchivo, setOpenEliminarArchivo] = React.useState(false);
    const [openEliminarAccionista, setOpenEliminarAccionista] = React.useState(false);
    const [documentosLufe, setDocumentosLufe] = React.useState([])
    const [validacionGeneral, setValidacionGeneral] = React.useState(false)
    const [actividadPrincipal, setActividadPrincipal] = React.useState(null)
    const [consultaCuit, setConsultaCuit] = React.useState(false);
    const [consultaCorreo, setConsultaCorreo] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState(false);
    const [uploadProgress, setUploadProgress] = useState({})
    const [accionistaSeleccionado, setAccionistaSeleccionado] = useState({})
    const isAccionistaEdditing = useRef(false)
    const envioConfirmado = useRef(false)
    const { toast } = useToast()

    const handleOpen = () => {
        setOpen(true)
        setDesabilitadoDocumento(false)
    }
    const handleClose = () => {
        setOpen(false);
        setSelectedFiles([])
        setUploadProgress({})
    }
    //accionista
    const handleOpen2 = () => {
        setHabilitarEdicion(false)
        setOpen2(true)
    }
    const handleOpenAccionista = () => {
        isAccionistaEdditing.current = false
        setAccionistaSeleccionado({})
        setHabilitarEdicion(false)
        setOpen2(true)
    }
    const handleClose2 = () => {
        setEsActualizacion(false)
        setOpen2(false)
        setRazonSoc('')
        setPerson('')
        setNombre('')
        setApellido('')
        setcuitCUIL('')
        setRelacionAccionista('')
        setPercentaje(null)
        setPorcentajeAux(null)
        // setEsActualizacion(false)
    }
    const handleOpenCarpeta = () => { setOpenCarpeta(true) }
    const handleCloseCarpeta = () => {
        setOpenCarpeta(false)
        // setTimeout(() => {
        //     setNombreDocumento('')
        // }, 200);
    }
    const handleCloseEliminarArchivo = () => setOpenEliminarArchivo(false)

    const handleOpenEliminarAccionista = (id) => {
        setOpenEliminarAccionista(true)
        setAccionistaID(id)
    }
    const handleCloseReiniciarOnboarding = () => {
        setOpenReiniciarOnboarding(false)
    }
    const handleCloseEliminarAccionista = () => setOpenEliminarAccionista(false)

    const [archivos, setArchivos] = React.useState([]) //archivos que enviaremos


    const defaultValues = {
        servicio: '100000000',
        personeria: '',
        tipoDeDocumento: null,
        nombreRazonSocial: '',
        cuitCuilCdi: '',
        nombre: '',
        apellido: '',
        cuitCuil: '',
        telefono: '',
        usuarioPortal: '',
        emailNotificaciones: '',
        relacionCuenta: '',
        actividad: null,
        tipoSocietario: '',
        condicionImp: null,
        facturacionIngreso: null,
        cuitReferidor: null,
        cantidadMujeresDecision: '',
        cantidadEmujeres: '',
        cantidadPdiscapacidad: '',
        step: 0,
        lufeConsultado: false,
        entidadLufeEncontrada: false,
        calle: '',
        calleNumero: '',
        piso: '',
        depto: '',
        localidad: '',
        codPostal: '',
        munParCom: '',
        provincia: null,
        pais: null,
        destinoLineaDeCredito: null,
        lineaDeCredito: null,
        Observaciones: ''
    }

    const docsValues = {
        docsDTOs: [],
        documentosIds: '',
        documentosDTOs: [],
        docusCargados: [],
        archivos: [],
        accionistas: []
    }

    const [storage, setStorage] = useLocalStorage("formValues", defaultValues);
    const [storageDocs, setStorageDocs] = useLocalStorage("docsValues", docsValues);
    const [accionistaID, setAccionistaID] = React.useState('')
    const [accionistas, setAccionistas] = React.useState([])
    const [person, setPerson] = React.useState('')
    const [razonSoc, setRazonSoc] = React.useState('')
    const [nombre, setNombre] = React.useState('')
    const [apellido, setApellido] = React.useState('')
    const [cuitCUIL, setcuitCUIL] = React.useState('')
    const [percentaje, setPercentaje] = React.useState(0)
    const [porcentajeAux, setPorcentajeAux] = React.useState('')
    const [relacionAccionista, setRelacionAccionista] = React.useState('')
    const [habilitarEdicion, setHabilitarEdicion] = React.useState(false)
    const [esActualizacion, setEsActualizacion] = React.useState(false)
    const [desabilitadoEnvio, setDeshabilitadoEnvio] = React.useState(false)

    const obtenerTodosDocumentos = () => {
        dispatch(obtenerDocumentosOnboardingFETCH(token))
    }

    const eliminarAccionista = (uid) => {
        var accionistasAux = accionistas.filter(item => item.uid === uid)
        if (accionistasAux.length > 0) {
            var i = accionistas.indexOf(accionistasAux[0])
            if (i !== -1) {
                accionistas.splice(i, 1);
            }
        }
        var currentData = localStorage.getItem("docsValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        currentData.accionistas = accionistas
        localStorage.setItem("docsValues", JSON.stringify(currentData))
        setOpenEliminarAccionista(false)
    }

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

    var validarDocumentosCargador = () => {
        var requeridosCargados = true
        var documentosFiltrados = []

        documentosFiltrados = filtrarDocumentosPorCondicionAFIP(condicionesAFIP, documentosDTOs, condicionImpositiva)

        documentosFiltrados.forEach(doc => {
            if (doc.new_requeridoenportal != null && doc.new_requeridoenportal == true) {
                var documentosCargados = documentosIds.split(',')
                if (documentosCargados.filter(item => item.trim() == doc.new_documentacionid).length == 0) {
                    requeridosCargados = false
                }
            }
        })
        return requeridosCargados
    }

    const validarArchivosCargadosConFiltrados = (documentosFiltradosAFIP) => {
        for (let index = 0; index < archivos.length; index++) {
            let documentoID = archivos[index].documentoId
            let nombreDocumento = archivos[index].name
            if (documentosFiltradosAFIP.length > 0 &&
                documentosFiltradosAFIP.filter(item => item.new_documentacionid == documentoID).length == 0) {
                eliminarArchivoFiltrado(nombreDocumento, documentoID)
            }
        }
        setDocumentosDTOs(documentosFiltradosAFIP)
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

        return documentosFiltradosXAFIP
    }

    const validarPorcentajeAccionistas = () => {
        var porcentajeValido = true
        var porcentajeTotal = 0
        accionistas.forEach(accionista => {
            if (accionista.porcentaje != null && accionista.porcentaje != 0) {
                porcentajeTotal += parseFloat(accionista.porcentaje)
            }
        })
        if (porcentajeTotal != 100) {
            porcentajeValido = false
        }
        return porcentajeValido
    }

    //############## ESCUCHA en TIEMPO REAL los DATOS COMPLETADOS en el FORMULARIO ##############

    //esta escucha en tiempo real la utilizo para saber que selecciona la persona que hace el onboarding
    //y depende de lo que seleccione, yo cambio valores de selects o inputs
    //esto lo hago debido a que el objeto "defaultValues" no se completa en tiempo real 
    //pero de esta forma si podemos saber que se esta completando

    const validacionSchema = [
        //NOTA: si no hay validaciones en algun paso, debe pasarse vacio el yup.object({}) para que funcione el nextStep.
        //validacion paso 1
        yup.object({
            servicio: yup.string().required(),
            personeria: (!lufeHabilitado || validacionGeneral) ? yup.string().required() : yup.string().notRequired(),
            tipoDeDocumento: yup.object().required(),
            nombreRazonSocial: (!lufeHabilitado || validacionGeneral) ? yup.string().required("Nombre o Razón Social es requerido") : yup.string().notRequired(),
            cuitCuilCdi: yup.number('Sin espacios ni guiones').required().positive().integer()
        }),
        //validacion paso 2
        yup.object({
            nombre: yup.string().required(),
            apellido: yup.string().required(),
            cuitCuil: yup.number('Sin espacios ni guiones').required().positive().integer(),
            telefono: yup.number().required().positive().integer(),
            usuarioPortal: yup.string().email().required(),
            emailNotificaciones: yup.string().email().required(),
            relacionCuenta: yup.string().required(),
            calle: (DireccionOnbHabilitado) ? yup.string().required() : yup.string().notRequired(),
            calleNumero: (DireccionOnbHabilitado) ? yup.string().required() : yup.string().notRequired(),
            localidad: (DireccionOnbHabilitado) ? yup.string().required() : yup.string().notRequired(),
            codPostal: (DireccionOnbHabilitado) ? yup.string().required() : yup.string().notRequired(),
            provincia: (DireccionOnbHabilitado) ? yup.object().required() : yup.object().notRequired(),
            pais: (DireccionOnbHabilitado) ? yup.object().required() : yup.object().notRequired(),
        }),
        //validacion paso 3
        yup.object({
            actividad: yup.object().required(),
            tipoSocietario: yup.string().when('personeria', (personeria) => {
                return personeria == '100000000' ? yup.string().required() : yup.string().notRequired()
            }),
            condicionImp: yup.object().required(),
            // facturacionIngreso: yup.string().required("Ingresa tu facturacion/ingresos del último año"),
            lineaDeCredito: (LineaDeCreditoHabilitado) ? yup.string().required("Ingresa tu línea de crédito") : yup.string().notRequired(),
            destinoLineaDeCredito: (LineaDeCreditoHabilitado) ? yup.object().required() : yup.object().notRequired(),
        }),
        //validacion paso 4
        yup.object({
            // cantidadMujeresDecision: yup.string().required(),
        }),
        //validacion paso 5
        yup.object({}),
    ];

    //valida segun el step en el que estoy parado
    const validacionActualSchema = validacionSchema[activeStep]

    //   const {
    //     control,
    //     handleSubmit,
    //     formState: { errors, isValid },
    //     watch,
    //   } = useForm({
    //     defaultValues: { email: "", password: "" },
    //     resolver: yupResolver(schema),
    //     mode: "onChange",
    //   })


    const methods = useForm({
        shouldUnregister: false,
        defaultValues,
        resolver: yupResolver(validacionActualSchema),
        mode: "onChange"
    })

    const { handleSubmit, trigger, setValue, error } = methods;

    const servicio = methods.watch('servicio')
    const personeria = methods.watch('personeria')
    const condicionImpositiva = methods.watch('condicionImp')
    const relacionCuentaForm = methods.watch('relacionCuenta')
    const tipoDeDocumento = methods.watch('tipoDeDocumento')
    const documentosDtos = methods.watch('documentosDTOs')
    const nombreForm = methods.watch('nombre')
    const apellidoForm = methods.watch('apellido')
    const cuitCuilForm = methods.watch('cuitCuil')
    const cuitCuilCdi = methods.watch('cuitCuilCdi')
    const actividad = methods.watch('actividad')
    const tipoSocietario = methods.watch('tipoSocietario')
    const referidor = methods.watch('cuitReferidor')
    const lufeConsultado = methods.watch('lufeConsultado')
    const nombreRazonSocial = methods.watch('nombreRazonSocial')
    const entidadLufeEncontrada = methods.watch('entidadLufeEncontrada')
    const usuarioPortal = methods.watch('usuarioPortal')

    const formData = methods.watch();

    const resetOnb = () => {
        methods.reset({
            servicio: '100000000',
            personeria: '',
            tipoDeDocumento: null,
            nombreRazonSocial: '',
            cuitCuilCdi: '',
            nombre: '',
            apellido: '',
            cuitCuil: '',
            telefono: '',
            usuarioPortal: '',
            emailNotificaciones: '',
            relacionCuenta: '',
            actividad: null,
            tipoSocietario: '',
            condicionImp: null,
            facturacionIngreso: null,
            cuitReferidor: null,
            cantidadMujeresDecision: '',
            cantidadEmujeres: '',
            cantidadPdiscapacidad: '',
            step: 0,
            lufeConsultado: false,
            entidadLufeEncontrada: false,
            calle: '',
            calleNumero: '',
            piso: '',
            depto: '',
            localidad: '',
            codPostal: '',
            munParCom: '',
            provincia: null,
            pais: null,
            destinoLineaDeCredito: null,
            lineaDeCredito: null,
            Observaciones: ''
        })
        localStorage.removeItem("docsValues");
        localStorage.removeItem("formValues");
        localStorage.removeItem("documentosLufe");
        localStorage.removeItem("accionistasLufe");
        RefrescarReferidos()
    }

    React.useEffect(() => {
        setValidacionGeneral(lufeConsultado)
    }, [lufeConsultado])
    //############### PASOS DEL MULTISTEP ###############

    const handleNext = async () => {
        //el trigger valida que se complete el campo requerido
        const esPasoValido = await trigger();
        if (activeStep == 0) {
            if (esPasoValido) {
                var cuitValido = true
                let cuitExiste = false
                cuitValido = ValidateCUITCUIL(cuitCuilCdi)
                if (!cuitValido) {
                    toast.error('El CUIT/CUIL debe ser válido!');
                    return
                }
                try {
                    setConsultaCuit(true);
                    cuitExiste = await validarUsuarioEnDynamicsPorCuit(cuitCuilCdi, token);
                    setConsultaCuit(false);
                } catch (error) {
                    setConsultaCuit(false);
                }
                if (cuitExiste) {
                    toast.error("El socio que desea registrar ya existe en el sistema.");
                    return;
                }
                var cuitValido = true
                cuitValido = ValidateCUITCUIL(cuitCuilCdi)
                if (!cuitValido) {
                    toast.error('El CUIT/CUIL debe ser válido!');
                    return
                }
            }
        }
        if (activeStep == 1) {
            if (esPasoValido) {
                let correoExiste = false
                var cuitValido = true
                cuitValido = ValidateCUITCUIL(cuitCuilForm)
                if (!cuitValido) {
                    toast.error('El CUIT/CUIL debe ser válido!');
                    return
                }
                try {
                    setConsultaCorreo(true);
                    correoExiste = await validarUsuarioEnDynamicsPorCorreoElectronico(usuarioPortal, token);
                    setConsultaCorreo(false);
                } catch (error) {
                    setConsultaCorreo(false);
                }
                if (correoExiste) {
                    toast.error("El correo electrónico para el usuario portal ya existe en el sistema.");
                    return;
                }
            }
            if (accionistas.length > 0 && accionistas.filter(item => item.relacionDirecta == true).length > 0) {
                var accionistasDirectos = accionistas.filter(item => item.relacionDirecta == true)
                if (accionistasDirectos != undefined && accionistasDirectos.length > 0) {
                    actualizarAccionistaDirecto(accionistasDirectos[0].uid)
                }
            }
        }
        if (activeStep == 2) {
            setDocumentosDTOs(documentosFiltradosPorPersoneria)
        }
        if (activeStep == 3) {
            // setDeshabilitadoEnvio(true)
            let documentacionCargada = true
            let porcentajeValido = true
            if (!entidadLufeEncontrada || documentacionLufeYParametrizada) {
                documentacionCargada = validarDocumentosCargador()
            }
            if (!documentacionCargada) {
                toast.error('Por favor, adjunte la documentación requerida');
                // setDeshabilitadoEnvio(false)
                return
            }
            if (personeria == "100000000" && !entidadLufeEncontrada) { //Juridica
                porcentajeValido = validarPorcentajeAccionistas()
                if (!porcentajeValido) {
                    toast.error('El porcentaje de tenencia accionaria debe conformar el 100%');
                    // setDeshabilitadoEnvio(false)
                    return
                }
            }
        }
        if (activeStep == 4) {
            // if (esPasoValido) {
            //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
            // }
        } else {
            if (esPasoValido) setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //############### BOTON SUBMIT ###############
    const submitDatos = (datos) => {
        try {
            envioConfirmado.current = true
            setDeshabilitadoEnvio(true)
            let documentacionCargada = true
            let porcentajeValido = true
            if (!entidadLufeEncontrada || documentacionLufeYParametrizada) {
                documentacionCargada = validarDocumentosCargador()
            }
            if (!documentacionCargada) {
                toast.error('Por favor, adjunte la documentación requerida');
                envioConfirmado.current = false
                setDeshabilitadoEnvio(false)
                return
            }
            if (personeria == "100000000" && !entidadLufeEncontrada) { //Juridica
                porcentajeValido = validarPorcentajeAccionistas()
                if (!porcentajeValido) {
                    toast.error('El porcentaje de tenencia accionaria debe conformar el 100%');
                    envioConfirmado.current = false
                    setDeshabilitadoEnvio(false)
                    return
                }
            }

            if (robot == false) {
                toast.error('Debes confirmar que no eres un robot');
                envioConfirmado.current = false
                setDeshabilitadoEnvio(false)
                return
            }

            var datosFinales = {
                ...datos, //copia del defaultvalues + los documentos y demas que deberia mandar a la api
                ["documentosDTOs"]: documentosDTOs,
                ["documentos"]: documentos,
                ["documentosIds"]: documentosIds,
                ["documentosCargados"]: docusCargados,
                ["pesoArchivos"]: pesoArch,
                ["accionistas"]: accionistas,
                ["condicionesAFIP"]: condicionesAFIP
            }

            dispatch(cargarSolicitudDeAlta(datosFinales, archivos, token, user?.accountid))
            // setActiveStep((prevActiveStep) => prevActiveStep + 1);   
        } catch (error) {
            debugger
            envioConfirmado.current = false
        }
    }

    const enviarOnboarding = () => {
        try {
            handleSubmit(submitDatos)();
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    //##### los label de steps #####
    const steps = ['Datos de la Cuenta', 'Datos del Contacto', 'Datos Adicionales', 'Documentación', 'Confirmación'];
    //podemos cambiarlos o dejarlos vacios

    //##### formularios que muestra segun el step #####
    const mostrarFormularios = (step, theme) => {
        switch (step) {
            case 0:
                // return <SolicitudAltaFinal OnboardingCompleto={OnboardingCompleto} />;
                return <SolicitudAltaGeneral personeria={personeria} token={token} lufeConsultado={lufeConsultado} theme={theme} setValue={setValue} error={methods} />;
            case 1:
                return <SolicitudAltaPersonal personeria={personeria} theme={theme} />;
            case 2:
                return <SolicitudAltaCuenta personeria={personeria} token={token} actividadPrincipal={actividadPrincipal} actividadAfip={actividadAfipOpciones} />;
            case 3:
                return <SolicitudAltaAdicional
                    personeria={personeria}
                    condicionImpositiva={condicionImpositiva}
                    documentosFiltrados={documentosDTOs}
                    condicionesAFIP={condicionesAFIP}
                    docsDTOs={documentosDtos}
                    handleOpen={handleOpen}
                    setDatosDocumento={setDatosDocumento}
                    handleOpen2={handleOpenAccionista}
                    handleOpenCarpeta={handleOpenCarpeta}
                    accionistas={accionistas}
                    editarAccionista={editarAccionistaForm}
                    handleOpenEliminarAccionista={handleOpenEliminarAccionista}
                    storage={storageDocs}
                    // agregarDocumentos={setDocumentosDTOs}
                    agregarDocumentos={validarArchivosCargadosConFiltrados}
                    documentosLufe={documentosLufe}
                    entidadLufeEncontrada={entidadLufeEncontrada}
                />;
            case 4:
                // return <SolicitudAltaGeneral personeria={personeria} />;
                return <SolicitudAltaFinal
                    OnboardingCompleto={OnboardingCompleto}
                    ResetOnboarding={resetOnb}
                    nuevaCuenta={methods.watch}
                    envioConfirmado={envioConfirmado}
                    enviarOnboarding={enviarOnboarding}
                />;
            default:
                throw new Error('Unknown step');
        }
    }

    const HeadingTypography = styled(Typography)(({ theme }) => ({
        marginBottom: theme.spacing(5),
        [theme.breakpoints.down("sm")]: {
            marginBottom: theme.spacing(4),
        },
    }));

    const renderFilePreview = (file) => {
        if (file.type.startsWith("image")) {
            return <img width={22} height={22} alt={file.name} src={URL.createObjectURL(file)} />;
        } else {
            return <Icon icon="mdi:file-document-outline" />;
        }
    };

    const handleRemoveAllFiles = () => {
        debugger
        setSelectedFiles([]);
        setUploadProgress({})
    };

    const handleRemoveFile = (file) => {
        const uploadedFiles = selectedFiles;
        const filtered = uploadedFiles.filter((i) => i.name !== file.name);
        setSelectedFiles([...filtered]);
        setUploadProgress({})
        // setUploadProgress((prev) => {
        //     const newProgress = { ...prev }
        //     delete newProgress[index]
        //     return newProgress
        // })
    };

    const fileList = selectedFiles.map((file) => (
        <ListItem key={file.name}>
            <div className="file-details">
                <div className="file-preview">{renderFilePreview(file)}</div>
                <div>
                    <Typography className="file-name">{file.name}</Typography>
                    <Typography className="file-size" variant="body2">
                        {Math.round(file.size / 100) / 10 > 1000
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </Typography>
                </div>
            </div>
            <IconButton onClick={() => handleRemoveFile(file)}>
                <Icon icon="mdi:close" fontSize={20} />
            </IconButton>
        </ListItem>
    ));

    React.useEffect(() => {

        if (documentosOnb?.length > 0) {
            setDocumentos(documentosSelector)
        }
    }, [documentosOnb])

    React.useEffect(() => {
        if (condicionesAFIP?.length > 0) {
            var currentData = localStorage.getItem("docsValues")
            currentData = currentData ? JSON.parse(currentData) : {};
            currentData.condicionesAFIP = condicionesSelector
            localStorage.setItem("docsValues", JSON.stringify(currentData))
        }
    }, [condicionesAFIP])

    React.useEffect(() => {
        if (personeria !== '') {
            if (documentos.length > 0) {
                var filtrados = filtrarDocumentosPorPersoneria(documentos.filter(documento => documento.new_solicituddealta == true), personeria)
                setDocumentosDTOs(filtrados)
                setDocumentosFiltradosPorPersoneria(filtrados)
                var currentData = localStorage.getItem("docsValues")
                currentData = currentData ? JSON.parse(currentData) : {};
                currentData.docsDTOs = filtrados
                localStorage.setItem("docsValues", JSON.stringify(currentData))
            }
        }
    }, [personeria, documentos])

    React.useEffect(() => {
        if (archivos.length > 0 && activeStep == 0) {
            setArchivos([])
        }
        if (personeria == "100000001") { //Humana
            if (relacionCuentaForm == '100000001' || relacionCuentaForm == '100000002' ||
                relacionCuentaForm == '100000003' || relacionCuentaForm == '100000002') {
                setValue('relacionCuenta', '')
            }
            if (tipoSocietario != null && tipoSocietario != '') {
                setValue('tipoSocietario', '')
            }
        } else if (personeria == "100000000") { //Juridica
            if (relacionCuentaForm == '100000000') {
                setValue('relacionCuenta', '')
            }
        }
        debugger
        if ((personeria == "100000001") && accionistas.length > 0) {

            setAccionistas([])
            var currentData = localStorage.getItem("docsValues")
            currentData = currentData ? JSON.parse(currentData) : {};
            currentData.accionistas = []
            localStorage.setItem("docsValues", JSON.stringify(currentData))
        }
    }, [personeria])

    React.useEffect(() => {
        if (carpetasSelector != undefined && carpetasSelector.length > 0) {
            setCarpetas(carpetasSelector)
        }
    }, [carpetasSelector])

    React.useEffect(() => {
        if (datosDocumento !== '') {
            var docu = datosDocumento.split(':')
            setNombreDocumento(docu[0])
            setDocumentoId(docu[1])
            setCarpeta(carpetas.filter(item => item.documentoid == docu[1]))
        }
    }, [datosDocumento])

    React.useEffect(() => {
        if (datosDocumento !== '') {
            var docu = datosDocumento.split(':')
            setNombreDocumento(docu[0])
            setDocumentoId(docu[1])
            setCarpeta(carpetas.filter(item => item.documentoid == docu[1]))
        }
    }, [datosDocumento])

    React.useEffect(() => {
        debugger
        if (storageDocs.accionistas != undefined && storageDocs.accionistas.length > 0 && relacionCuentaForm === '100000001') {
            if (storageDocs.accionistas.filter(item => item.relacionDirecta == true).length > 0) {
                setAccionistas(storageDocs.accionistas)
            } else {
                agregarAccionista()
            }
        } else if (storageDocs.accionistas != undefined && storageDocs.accionistas.length > 0
            && relacionCuentaForm != "" && relacionCuentaForm !== '100000001') { //ACA VER SI VINO POR LUFE O NO
            var accionistasDirectos = storageDocs.accionistas
            if (accionistasDirectos != undefined && accionistasDirectos.length > 0) {
                accionistasDirectos.forEach(item => {
                    if (item.relacionDirecta == true) {
                        var indice = accionistasDirectos.indexOf(item)
                        accionistasDirectos.splice(indice, 1)
                    }
                })
                setAccionistas(accionistasDirectos)
                var currentData = localStorage.getItem("docsValues")
                currentData = currentData ? JSON.parse(currentData) : {};
                currentData.accionistas = accionistasDirectos
                localStorage.setItem("docsValues", JSON.stringify(currentData))
            }
        } else {
            if (relacionCuentaForm === '100000001') {
                if (accionistaID === '') { //Comprobar si ya se agrego el accionista para determinar si es creacion o actualizacion
                    agregarAccionista()
                } else if (accionistas.length > 0) {
                    if (entidadLufeEncontrada) {
                        const accionistaEditado = accionistas.map(item => item.cuit === cuitCuilForm ?
                            {
                                relacionDirecta: true
                            }
                            : item)
                        setAccionistas(accionistaEditado)
                    }
                    actualizarAccionista(accionistaID)
                } else {
                    agregarAccionista()
                }
            } else {
                var accionistasDirectos = accionistas
                if (accionistasDirectos != undefined && accionistasDirectos.length > 0) {
                    accionistasDirectos.forEach(item => {
                        if (item.relacionDirecta == true) {
                            var indice = accionistasDirectos.indexOf(item)
                            accionistasDirectos.splice(indice, 1)
                        }
                    })
                    if (entidadLufeEncontrada) {
                        let accionistasLufe = localStorage.getItem("accionistasLufe")
                        accionistasLufe = accionistasLufe ? JSON.parse(accionistasLufe) : {};
                        if (accionistasLufe?.accionistas?.length > 0) {
                            accionistasLufe.accionistas.forEach(accionistaLufe => {
                                if (accionistasDirectos.filter(item => item.cuitcuil === accionistaLufe.cuitcuil).length == 0) {
                                    accionistasDirectos.push(accionistaLufe)
                                }
                            })
                        }
                    }
                    setAccionistas(accionistasDirectos)
                    var currentData = localStorage.getItem("docsValues")
                    currentData = currentData ? JSON.parse(currentData) : {};
                    currentData.accionistas = accionistasDirectos
                    localStorage.setItem("docsValues", JSON.stringify(currentData))
                }
            }
        }
    }, [relacionCuentaForm])

    React.useEffect(() => { //CARGA EL ONBOARDING CON EL LOCALSTORAGE
        if (!loaded) {
            methods.reset(storage);
            setActiveStep(0)
            setLoaded(true);
        }
    }, [storage, methods.reset, loaded]);

    React.useEffect(() => {
        if (activeStep == 4) {
            setMostrarIconoFinal(true)
            setTimeout(() => { setMostrarTextoFinal(true) }, 800)
        }
        methods.setValue("step", activeStep)
        var currentData = localStorage.getItem("formValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        currentData.step = activeStep
        localStorage.setItem("formValues", JSON.stringify(currentData))
    }, [activeStep]);

    React.useEffect(() => {
        var currentData = localStorage.getItem("formValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        currentData.servicio = servicio
        currentData.personeria = personeria
        currentData.condicionImp = condicionImpositiva
        currentData.tipoDeDocumento = tipoDeDocumento
        currentData.tipoSocietario = tipoSocietario
        currentData.actividad = actividad
        currentData.relacionCuenta = relacionCuentaForm
        currentData.cuitReferidor = referidor
        currentData.lufeConsultado = lufeConsultado
        currentData.entidadLufeEncontrada = entidadLufeEncontrada
        currentData.nombreRazonSocial = nombreRazonSocial
        currentData.cuitCuilCdi = cuitCuilCdi?.toString()
        localStorage.setItem("formValues", JSON.stringify(currentData))
    }, [servicio, personeria, condicionImpositiva, relacionCuentaForm, tipoDeDocumento, actividad,
        tipoSocietario, referidor, lufeConsultado, entidadLufeEncontrada, nombreRazonSocial, cuitCuilCdi]);

    React.useEffect(() => {
        if (estadoOnboardingSelector === "EXITO") {
            localStorage.clear();
            handleNext()
            dispatch(setearRobot(false))
            setDeshabilitadoEnvio(false)
        } else if (estadoOnboardingSelector === "ERROR") {
            debugger
            envioConfirmado.current = false
            setDeshabilitadoEnvio(false)
            dispatch(setearRobot(false))
            // setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }, [estadoOnboardingSelector]);


    const prepararModalEliminarArchivo = (archivo) => {
        setOpenEliminarArchivo(true)
        setArchivoSeleccionado(archivo)
    }

    const filtrarDocumentosPorPersoneria = (docs, personeria) => {
        var documentosFiltrados = []
        docs.forEach(doc => {
            if (doc.new_personeria != null) {
                if (doc.new_personeria == personeria) {
                    documentosFiltrados.push(doc)
                }
            } else {
                documentosFiltrados.push(doc)
            }
        })
        return documentosFiltrados
    }

    const changeHandler = (event) => {
        try {
            setSelectedFiles(event)
        } catch (error) {
            console.log(error)
        }
    };

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

    const validarPorcentaje = (accionis, porcen) => {
        let porcentaje = 0.00
        if (accionis.length > 0) {
            accionis.forEach(element => {
                // if (element.uid !== accionistaID) {
                porcentaje = porcentaje + parseFloat(element.porcentaje)
                // }
            });
            porcentaje = porcentaje + parseFloat(porcen)
            if (porcentaje > 100) {
                toast.error('El porcentaje total de los accionistas no puede ser mayor a 100%');
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    }

    const agregarAccionista = () => {
        var existe = false
        if (accionistas.length > 0) {
            if (accionistas.filter(item => item.cuitcuil == cuitCuilForm).length > 0) {
                existe = true
            }
        }
        if (existe == false) {
            const accionistaArray = []
            const accionista = {
                uid: '',
                personeria: '',
                cuitcuil: '',
                razonSocial: '',
                nombre: '',
                apellido: '',
                porcentaje: '',
                descripcion: '',
                tipoRelacion: '100000001',  //Accionista
                tipoRelacionAccionista: '',
                relacionDirecta: false
            }
            accionista.uid = shortid.generate()
            setAccionistaID(accionista.uid)
            accionista.personeria = "100000001" //FISICA
            accionista.cuitcuil = cuitCuilForm?.toString()
            accionista.nombre = nombreForm
            accionista.apellido = apellidoForm
            accionista.relacionDirecta = true
            accionista.tipoRelacionAccionista = relacionAccionista
            accionistaArray.push(accionista)
            var todosAccionistas = [
                ...accionistas,
                { ...accionista }
            ]
            setAccionistas(todosAccionistas)
            var currentData = localStorage.getItem("docsValues")
            currentData = currentData ? JSON.parse(currentData) : {};
            currentData.accionistas = todosAccionistas
            localStorage.setItem("docsValues", JSON.stringify(currentData))
            setTimeout(() => {
                setRazonSoc('')
                setAccionistaID('')
                setNombre('')
                setApellido('')
                setcuitCUIL('')
                setPerson('')
                setRelacionAccionista('')
                setPercentaje(null)
                setPorcentajeAux(null)
            }, 1500);
        }
    }

    //####Crea Accionista
    // const crearAccionista = (e) => {
    //     e.preventDefault()
    //     if (person === '') {
    //         toast.error('La personeria es requerida!');
    //         return
    //     }
    //     if (person === "100000000") { //Juridica
    //         if (razonSoc === '') {
    //             toast.error('La Razón Social es requerida!');
    //             return
    //         }
    //     } else {
    //         if (nombre === '') {
    //             toast.error('El Nombre es requerido!');
    //             return
    //         }
    //         if (apellido === '') {
    //             toast.error('El apellido es requerido!');
    //             return
    //         }
    //     }
    //     if (cuitCUIL === '') {
    //         toast.error('El CUIT/CUIL es requerido!');
    //         return
    //     } else if (cuitCUIL.length > 11 || cuitCUIL.length < 11) {
    //         toast.error('El CUIT/CUIL es incorrecto, debe tener 11 caracteres!');
    //         return
    //     }
    //     let validarCuitAccionista = ValidateCUITCUIL(cuitCUIL)
    //     if (!validarCuitAccionista) {
    //         toast.error('El CUIT/CUIL debe ser válido!');
    //         return
    //     }
    //     if (percentaje === null || percentaje === '') {
    //         toast.error('El porcentaje de participación es requerido!');
    //         return
    //     }
    //     // if (relacionAccionista === '') {
    //     //     toast.error('La relación es requerida!');
    //     //     return
    //     // }
    //     try {
    //         setLoadingAccionistas(true)
    //         let tipoRelacion = "100000001" //Accionista
    //         var accionista = {
    //             uid: '',
    //             personeria: '',
    //             cuitcuil: '',
    //             razonSocial: '',
    //             nombre: '',
    //             apellido: '',
    //             porcentaje: 0,
    //             descripcion: '',
    //             tipoRelacion: '',
    //             tipoRelacionAccionista: '',
    //             relacionDirecta: false
    //         }
    //         var validacion = validarPorcentaje(accionistas, percentaje)
    //         if (validacion) {
    //             accionista.uid = shortid.generate()
    //             accionista.cuitcuil = cuitCUIL.toString()
    //             accionista.personeria = person
    //             if (person === "100000000") {
    //                 accionista.razonSocial = razonSoc
    //             }
    //             else if (person === "100000001") {
    //                 accionista.nombre = nombre
    //                 accionista.apellido = apellido
    //             }
    //             accionista.porcentaje = Number(percentaje).toFixed(2)
    //             // accionista.descripcion = descripcion
    //             accionista.tipoRelacion = tipoRelacion
    //             accionista.tipoRelacionAccionista = relacionAccionista
    //             accionista.relacionDirecta = false
    //             var todosAccionistas = [
    //                 ...accionistas,
    //                 { ...accionista }
    //             ]
    //             setAccionistas(todosAccionistas)
    //             var currentData = localStorage.getItem("docsValues")
    //             currentData = currentData ? JSON.parse(currentData) : {};
    //             currentData.accionistas = todosAccionistas
    //             localStorage.setItem("docsValues", JSON.stringify(currentData))
    //             toast.success('Accionista cargado con exito');
    //             setTimeout(() => {
    //                 handleClose2()
    //                 setLoadingAccionistas(false)
    //             }, 2500);
    //         } else {
    //             setLoadingAccionistas(false)
    //         }
    //     } catch {
    //         setLoadingAccionistas(false)
    //     }
    // }

    const modificarAccionistaForm = async (data) => {
        setLoadingAccionistas(true);

        try {
            const porcentajeActual = Number(data.porcentaje);

            const accionistasSinActual = accionistas.filter(a => a.uid !== accionistaID);
            const sumaPorcentajes = accionistasSinActual.reduce(
                (acc, cur) => acc + Number(cur.porcentaje ?? 0),
                0
            );

            const nuevoTotal = sumaPorcentajes + porcentajeActual;

            if (nuevoTotal > 100) {
                toast.error('La suma de los porcentajes no puede superar el 100%');
                setLoadingAccionistas(false);
                return;
            }

            const accionistaEditado = accionistas.map((item) =>
                item.uid === accionistaID
                    ? {
                        ...item,
                        uid: accionistaID,
                        personeria: data.person,
                        cuitcuil: data.cuitCuil,
                        razonSocial: data.razonSocial || '',
                        nombre: data.nombre || '',
                        apellido: data.apellido || '',
                        porcentaje: porcentajeActual > 0 ? porcentajeActual.toFixed(2).toString() : 0,
                        tipoRelacionAccionista: data.relacionAccionista || '',
                        tipoRelacion: '100000001',
                        relacionDirecta: habilitarEdicion,
                    }
                    : item
            );

            setAccionistas(accionistaEditado);

            const currentData = JSON.parse(localStorage.getItem("docsValues") || '{}');
            currentData.accionistas = accionistaEditado;
            localStorage.setItem("docsValues", JSON.stringify(currentData));

            toast.success('Accionista modificado con éxito');

            setAccionistaID('');
            setTimeout(() => {
                handleClose2();
                setLoadingAccionistas(false);
            }, 800);
        } catch (error) {
            console.error('Error al modificar accionista:', error);
            toast.error('Ocurrió un error al modificar el accionista');
            setLoadingAccionistas(false);
        }
    };

    const crearAccionistaForm = (data) => {
        try {
            setLoadingAccionistas(true);

            const validacion = validarPorcentaje(accionistas, data.porcentaje);
            if (!validacion) {
                setLoadingAccionistas(false);
                return;
            }

            const nuevoAccionista = {
                uid: shortid.generate(),
                personeria: data.person,
                cuitcuil: data.cuitCuil.toString(),
                razonSocial: data.person === "100000000" ? data.razonSocial : '',
                nombre: data.person === "100000001" ? data.nombre : '',
                apellido: data.person === "100000001" ? data.apellido : '',
                porcentaje: Number(item.porcentaje) > 0 ? Number(item.porcentaje).toFixed(2).toString() : 0,
                tipoRelacion: "100000001", // Accionista
                tipoRelacionAccionista: data.relacionAccionista || '',
                relacionDirecta: false,
                descripcion: '', // podés sumarlo si lo usás luego
            };

            const todosAccionistas = [...accionistas, nuevoAccionista];

            setAccionistas(todosAccionistas);

            // Guardar en localStorage
            const currentData = JSON.parse(localStorage.getItem("docsValues") || "{}");
            currentData.accionistas = todosAccionistas;
            localStorage.setItem("docsValues", JSON.stringify(currentData));

            toast.success("Accionista cargado con éxito");
            setTimeout(() => {
                handleClose2(); // Cerrás modal u overlay
                setLoadingAccionistas(false);
            }, 2500);
        } catch (err) {
            console.error(err);
            setLoadingAccionistas(false);
        }
    };

    //####Llama al modal del accionista y le pasa los datos
    // const editarAccionista = (id) => {
    //     handleOpen2()
    //     setAccionistaID(id)
    //     setEsActualizacion(true)
    //     accionistas.filter(accionista => accionista.uid == id).map(item => {
    //         setRazonSoc(item.razonSocial)
    //         setNombre(item.nombre)
    //         setApellido(item.apellido)
    //         setcuitCUIL(item.cuitcuil)
    //         setPercentaje(item.porcentaje)
    //         setPorcentajeAux(item.porcentaje)
    //         // setDescripcion(item.descripcion)
    //         setPerson(item.personeria)
    //         setRelacionAccionista(item.tipoRelacionAccionista)
    //         setHabilitarEdicion(item.relacionDirecta)
    //     })
    //     setAccionistas(accionistas)
    //     var currentData = localStorage.getItem("docsValues")
    //     currentData = currentData ? JSON.parse(currentData) : {};
    //     currentData.accionistas = accionistas
    //     localStorage.setItem("docsValues", JSON.stringify(currentData))
    // }

    const editarAccionistaForm = (id) => {
        if (!isAccionistaEdditing.current) {
            isAccionistaEdditing.current = true
        }
        handleOpen2();
        setAccionistaID(id);
        setEsActualizacion(true);

        const accionistaAEditar = accionistas.find((a) => a.uid === id);
        if (!accionistaAEditar) return;

        // Cargar datos al formulario
        setAccionistaSeleccionado({
            nombre: accionistaAEditar.nombre || '',
            apellido: accionistaAEditar.apellido || '',
            razonSocial: accionistaAEditar.razonSocial || '',
            cuitCuil: accionistaAEditar.cuitcuil || '',
            porcentaje: accionistaAEditar.porcentaje || '',
            person: accionistaAEditar.personeria || '',
            relacionAccionista: accionistaAEditar.tipoRelacionAccionista || '',
        })

        setPorcentajeAux(accionistaAEditar.porcentaje); // por si necesitás validar cambios
        setHabilitarEdicion(accionistaAEditar.relacionDirecta || false);

        // Actualizar storage
        const currentData = JSON.parse(localStorage.getItem("docsValues") || "{}");
        currentData.accionistas = accionistas;
        localStorage.setItem("docsValues", JSON.stringify(currentData));
    };

    const actualizarAccionista = (id) => {
        var razonSocial = ""
        var nombre = ""
        var apellido = ""
        if (personeria == "100000000") {
            razonSocial = nombreForm + " " + apellidoForm
        } else {
            nombre = nombreForm
            apellido = apellidoForm
        }
        const accionistaEditado = accionistas.map(item => item.uid === id ?
            {
                uid: id,
                personeria: personeria,
                cuitcuil: cuitCuilForm,
                razonSocial: razonSocial,
                nombre: nombre,
                apellido: apellido,
                porcentaje: Number(item.porcentaje) > 0 ? Number(item.porcentaje).toFixed(2).toString() : 0,
                // descripcion: item.descripcion,
                tipoRelacion: '100000001',
                tipoRelacionAccionista: item.tipoRelacionAccionista,
                relacionDirecta: true
            }
            : item)
        setAccionistas(accionistaEditado)
        var currentData = localStorage.getItem("docsValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        currentData.accionistas = accionistaEditado
        localStorage.setItem("docsValues", JSON.stringify(currentData))
    }

    const actualizarAccionistaDirecto = (id) => {
        var razonSocial = ""
        var nombre = ""
        var apellido = ""
        // if (personeria == "100000000") {
        //     razonSocial = nombreForm + " " + apellidoForm
        // } else {
        //     nombre = nombreForm
        //     apellido = apellidoForm
        // }
        nombre = nombreForm
        apellido = apellidoForm
        const accionistaEditado = accionistas.map(item => item.uid === id ?
            {
                uid: id,
                personeria: "100000001",
                cuitcuil: cuitCuilForm,
                razonSocial: razonSocial,
                nombre: nombre,
                apellido: apellido,
                porcentaje: Number(item.porcentaje) > 0 ? Number(item.porcentaje).toFixed(2).toString() : 0,
                tipoRelacionAccionista: item.tipoRelacionAccionista,
                // descripcion: item.descripcion,
                tipoRelacion: '100000001',
                relacionDirecta: true
            }
            : item)
        setAccionistas(accionistaEditado)
        var currentData = localStorage.getItem("docsValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        currentData.accionistas = accionistaEditado
        localStorage.setItem("docsValues", JSON.stringify(currentData))
    }

    //####Modifica al accionista y lo actualiza con los nuevos valores
    const modificarAccionista = (e) => {

        e.preventDefault()
        debugger
        var porcentajeAccionista = percentaje != null ? Number(percentaje).toFixed(2) : porcentajeAux
        if (person === '') {
            toast.error('La personeria es requerida!');
            return
        }
        if (person === "100000000") { //Juridica
            if (razonSoc === '') {
                toast.error('La Razón Social es requerida!');
                return
            }
        } else {
            if (nombre === '') {
                toast.error('El Nombre es requerido!');
                return
            }
            if (apellido === '') {
                toast.error('El apellido es requerido!');
                return
            }
        }
        if (cuitCUIL === '') {
            toast.error('El CUIT/CUIL es requerido!');
            return
        } else if (cuitCUIL.length > 11 || cuitCUIL.length < 11) {
            toast.error('El CUIT/CUIL es incorrecto, debe tener 11 caracteres!');
            return
        }
        let validarCuitAccionista = ValidateCUITCUIL(cuitCUIL)
        if (!validarCuitAccionista) {
            toast.error('El CUIT/CUIL debe ser válido!');
            return
        }
        if (percentaje === null || percentaje === '') {
            toast.error('El porcentaje de participación es requerido!');
            return
        }
        // if (relacionAccionista === '') {
        //     toast.error('La relación es requerida!');
        //     return
        // }
        try {
            var validacion = validarPorcentaje(accionistas, porcentajeAccionista)
            if (validacion) {
                const accionista = {
                    uid: '',
                    personeria: '',
                    cuitcuil: '',
                    razonSocial: '',
                    nombre: '',
                    apellido: '',
                    porcentaje: 0,
                    descripcion: '',
                    tipoRelacion: '',
                    tipoRelacionAccionista: '',
                    relacionDirecta: false
                }
                const accionistaEditado = accionistas.map(item => item.uid === accionistaID ?
                    {
                        uid: accionistaID,
                        personeria: person,
                        cuitcuil: cuitCUIL,
                        razonSocial: razonSoc,
                        nombre: nombre,
                        apellido: apellido,
                        porcentaje: porcentajeAccionista > 0 ? porcentajeAccionista : 0,
                        tipoRelacionAccionista: relacionAccionista,
                        // descripcion: descripcion,
                        tipoRelacion: '100000001',
                        relacionDirecta: habilitarEdicion
                    }
                    : item)
                setAccionistas(accionistaEditado)
                var currentData = localStorage.getItem("docsValues")
                currentData = currentData ? JSON.parse(currentData) : {};
                currentData.accionistas = accionistaEditado
                localStorage.setItem("docsValues", JSON.stringify(currentData))
                setAccionistaID('')
                toast.success('Accionista modificado con exito');
                setTimeout(() => {
                    handleClose2()
                    setLoadingAccionistas(false)
                }, 800);
            } else {
                setLoadingAccionistas(false)
            }
        } catch (error) {
            setLoadingAccionistas(false)
        }
    }

    //####Agregar un documento
    const agregarDocumento = () => {
        setDesabilitadoDocumento(true)
        if (selectedFiles.length > 0) {
            var peso = 0
            try {
                for (let index = 0; index < selectedFiles.length; index++) {
                    // for (let progress = 0; progress <= 100; progress += 10) {
                    //     setUploadProgress((prev) => ({ ...prev, [index]: progress }))
                    //     new Promise((resolve) => setTimeout(resolve, 100))
                    // }
                    if (selectedFiles[index].size >= 15000000) {
                        toast.error('El archivo no puede superar los 15 megas');
                        setDesabilitadoDocumento(false)
                        setSelectedFiles([])
                        return
                    }
                    if (selectedFiles[index].name.includes('#') || selectedFiles[index].name.includes('?')
                        || selectedFiles[index].name.includes('*') || selectedFiles[index].name.includes('/')
                        || selectedFiles[index].name.includes('|') || selectedFiles[index].name.includes('"')
                        || selectedFiles[index].name.includes('<') || selectedFiles[index].name.includes('>')) {
                        toast.error('El nombre del archivo no debe contener caracteres especiales');
                        setDesabilitadoDocumento(false)
                        setSelectedFiles([])
                        return
                    }
                    if (archivos.filter(item => item.name == selectedFiles[index].name).length > 0) {
                        toast.error('Ya existe un documento cargado con el mismo nombre');
                        setDesabilitadoDocumento(false)
                        setSelectedFiles([])
                        return
                    }
                    peso += selectedFiles[index].size
                }
                peso += pesoArch
                if (peso >= 20000000) {
                    toast.error('El peso de los archivos adjuntos supera los 20 megas');
                    setDesabilitadoDocumento(false)
                    setSelectedFiles([])
                    return
                }
                var existeDocumento = false
                var adjuntos = []
                var currentData = localStorage.getItem("docsValues")  //localStorage
                currentData = currentData ? JSON.parse(currentData) : {};  //localStorage
                if (archivos.length > 0) {
                    for (let index = 0; index < archivos.length; index++) {
                        adjuntos.push(archivos[index]);
                    }
                }
                if (selectedFiles.length > 0) {
                    for (let index = 0; index < selectedFiles.length; index++) {
                        selectedFiles[index].documentoId = documentoId
                        adjuntos.push(selectedFiles[index]);
                        if (carpetas.filter(item => item.documentoid == documentoId).length > 0) {
                            existeDocumento = true
                        }
                    }
                }
                if (!existeDocumento && docusCargados > 0) {
                    if (documentosIds !== '') {
                        var docsIds = documentosIds
                        docsIds = docsIds + ', ' + documentoId
                        setDocumentosIds(docsIds)
                        currentData.documentosIds = docsIds  //localStorage
                    } else {
                        setDocumentosIds(documentoId)
                        currentData.documentosIds = documentoId  //localStorage
                    }
                    setDocusCargados(docusCargados + 1)
                    currentData.docusCargados = docusCargados + 1 //localStorage
                    var documentoActualizado = []
                    if (documentosDTOs.length > 0) {
                        documentoActualizado = documentosDTOs.filter(item => item.new_documentacionid === documentoId)
                    }
                    documentoActualizado.map(item => item.documentoCargado = true)
                    documentoActualizado.map(item => item.pesoArchivo = peso)
                    var documentosActualizados = documentosDTOs.map(item => item.new_documentacionid == documentoActualizado[0].new_documentacionid ? documentoActualizado[0] : item)
                    setDocumentosDTOs(documentosActualizados)
                    currentData.documentosDTOs = documentosActualizados //localStorage
                } else if (docusCargados === 0) {
                    setDocumentosIds(documentoId)
                    currentData.documentosIds = documentoId  //localStorage
                    setDocusCargados(docusCargados + 1)
                    currentData.docusCargados = docusCargados + 1 //localStorage
                    var documentoActualizado = []
                    if (documentosDTOs.length > 0) {
                        documentoActualizado = documentosDTOs.filter(item => item.new_documentacionid === documentoId)
                    }
                    documentoActualizado.map(item => item.documentoCargado = true)
                    documentoActualizado.map(item => item.pesoArchivo = peso)
                    var documentosActualizados = documentosDTOs.map(item => item.new_documentacionid == documentoActualizado[0].new_documentacionid ? documentoActualizado[0] : item)
                    setDocumentosDTOs(documentosActualizados)
                    currentData.documentosDTOs = documentosActualizados //localStorage
                }

                if (carpetas.length > 0) {
                    var docsEnCarpeta = carpetas.filter(item => item.documentoid == documentoId)
                    if (docsEnCarpeta.length > 0) {
                        for (let index = 0; index < selectedFiles.length; index++) {
                            var archivo = selectedFiles[index];
                            var cantidadNombres = docsEnCarpeta[0].nombreArchivos.filter(item => item == archivo.name).length
                            if (cantidadNombres == 0) {
                                docsEnCarpeta[0].nombreArchivos.push(archivo.name)
                                let peso = pesoArch > 0 ? pesoArch : 0
                                if (archivo.size > 0) {
                                    peso += archivo.size
                                }
                                setPesoArch(peso)
                            }
                        }
                    } else {
                        var array = carpetas;
                        let pesoArchs = 0
                        for (let index = 0; index < selectedFiles.length; index++) {
                            if (array.filter(item => item.documentoid == documentoId).length == 0) {
                                var carpeta = {
                                    documentoid: documentoId,
                                    nombreArchivos: [selectedFiles[index].name]
                                }
                                array.push(carpeta)
                                pesoArchs = pesoArch
                                if (selectedFiles[index] != null && selectedFiles[index].size != null)
                                    pesoArchs += selectedFiles[index].size
                                setPesoArch(pesoArchs)
                            } else {
                                array.filter(item => item.documentoid == documentoId).map(arc => {
                                    var archivo = selectedFiles[index];
                                    var cantidadNombres = arc.nombreArchivos.filter(item => item == archivo.name).length
                                    if (cantidadNombres == 0) {
                                        arc.nombreArchivos.push(archivo.name)
                                        pesoArchs = pesoArch + selectedFiles[index].size
                                        setPesoArch(pesoArchs)
                                    }
                                })
                            }
                        }
                        dispatch(agregarDocumentoAcarpeta(array))
                    }
                }
                else {
                    var array = [];
                    var pesoArchs = 0;
                    for (let index = 0; index < selectedFiles.length; index++) {
                        if (array.length == 0) {
                            var carpeta = {
                                documentoid: documentoId,
                                nombreArchivos: [selectedFiles[index].name]
                            }
                            array.push(carpeta)
                            pesoArchs += selectedFiles[index].size

                        } else {
                            array.filter(item => item.documentoid == documentoId).map(item => {
                                item.nombreArchivos.push(selectedFiles[index].name)
                                pesoArchs += selectedFiles[index].size
                            })
                        }
                    }
                    setPesoArch(pesoArchs)
                    dispatch(agregarDocumentoAcarpeta(array))
                }
                setArchivos(adjuntos)
                currentData.archivos = adjuntos //localStorage
                localStorage.setItem("docsValues", JSON.stringify(currentData))//localStorage
                setTimeout(() => {
                    toast.success('Documento cargado con exito')
                }, 1000);
                setTimeout(() => {
                    setDesabilitadoDocumento(false)
                    handleClose()
                    setDatosDocumento("")
                    setSelectedFiles([])
                }, 2000);
            }
            catch (error) {
                toast.error('Hubo un error al subir el archivo.');
                setDesabilitadoDocumento(false)
                setSelectedFiles([])
            }
        } else {
            toast.error('Debes elegir un archivo para agregar!');
            setDesabilitadoDocumento(false)
        }
    }

    const eliminarArchivo = (nombre) => {
        if (archivos.length > 0) {
            var peso = pesoArch
            var archivo = archivos.filter(item => item.name == nombre)
            var i = archivos.indexOf(archivo[0])
            if (i !== -1) {
                peso -= archivo[0].size
                setPesoArch(peso)
                archivos.splice(i, 1);
            }
            setArchivos(archivos)
        }

        if (carpetas.length > 0) {
            var carpeta = carpetas.filter(item => item.documentoid == documentoId)
            if (carpeta.length > 0) {
                var i = carpeta[0].nombreArchivos.indexOf(nombre)
                if (i !== -1) {
                    carpeta[0].nombreArchivos.splice(i, 1);
                    if (carpeta[0].nombreArchivos.length == 0) {
                        var posicion = carpetas.indexOf(carpeta[0]);
                        if (posicion !== -1) {
                            carpetas.splice(posicion, 1);
                            setDocusCargados(docusCargados - 1)  //################
                            var documentoActualizado = []
                            documentoActualizado = documentosDTOs.filter(item => item.new_documentacionid === documentoId)
                            documentoActualizado.map(item => item.documentoCargado = false)
                            documentoActualizado.map(item => item.pesoArchivo = 0)
                            var documentosActualizados = documentosDTOs.map(item => item.new_documentacionid == documentoActualizado.new_documentacionid ? documentoActualizado : item)
                            setDocumentosDTOs(documentosActualizados)
                            var docsIds = ''
                            var documentosCargados = documentosIds.split(',')
                            documentosCargados.forEach(element => {
                                if (element.trim() != documentoId) {
                                    if (docsIds !== '') {
                                        docsIds = docsIds + ', ' + element.trim()
                                    } else {
                                        docsIds = element.trim()
                                    }
                                }
                            })
                            setDocumentosIds(docsIds)
                        }
                    }
                }
                setCarpeta(carpetas.filter(item => item.documentoid == documentoId))
                dispatch(agregarDocumentoAcarpeta(carpetas))
            }
        }
        setOpenEliminarArchivo(false)
    }

    const eliminarArchivoFiltrado = (nombre, documentoID) => {
        if (archivos.length > 0) {
            var peso = pesoArch
            var archivo = archivos.filter(item => item.name == nombre)
            var i = archivos.indexOf(archivo[0])
            if (i !== -1) {
                peso -= archivo[0].size
                setPesoArch(peso)
                archivos.splice(i, 1);
            }
            setArchivos(archivos)
        }

        if (carpetas.length > 0) {
            var carpeta = carpetas.filter(item => item.documentoid == documentoID)
            if (carpeta.length > 0) {
                var i = carpeta[0].nombreArchivos.indexOf(nombre)
                if (i !== -1) {
                    carpeta[0].nombreArchivos.splice(i, 1);
                    if (carpeta[0].nombreArchivos.length == 0) {
                        var posicion = carpetas.indexOf(carpeta[0]);
                        if (posicion !== -1) {
                            carpetas.splice(posicion, 1);
                            setDocusCargados(docusCargados - 1)  //################
                            var documentoActualizado = []
                            documentoActualizado = documentosDTOs.filter(item => item.new_documentacionid === documentoID)
                            documentoActualizado.map(item => item.documentoCargado = false)
                            documentoActualizado.map(item => item.pesoArchivo = 0)
                            var documentosActualizados = documentosDTOs.map(item => item.new_documentacionid == documentoActualizado.new_documentacionid ? documentoActualizado : item)
                            setDocumentosDTOs(documentosActualizados)
                            var docsIds = ''
                            var documentosCargados = documentosIds.split(',')
                            documentosCargados.forEach(element => {
                                if (element.trim() != documentoID) {
                                    if (docsIds !== '') {
                                        docsIds = docsIds + ', ' + element.trim()
                                    } else {
                                        docsIds = element.trim()
                                    }
                                }
                            })
                            setDocumentosIds(docsIds)
                        }
                    }
                }
                setCarpeta(carpetas.filter(item => item.documentoid == documentoId))
                dispatch(agregarDocumentoAcarpeta(carpetas))
            }
        }
        setOpenEliminarArchivo(false)
    }

    const reinciarOnboarding = () => {
        localStorage.clear();
        localStorage.removeItem("docsValues");
        localStorage.removeItem("formValues");
        localStorage.removeItem("documentosLufe");
        localStorage.removeItem("accionistasLufe");
        setOpenReiniciarOnboarding(false)
        window.location.reload()
    }

    const volver = () => {
        router.replace('/')
    }

    //aca se definen los steps con los iconos a mostrar
    const stepConIcono = (props) => {
        const { active, completed, className } = props;

        const icons = {
            1: <AssignmentIndSharpIcon />,
            2: <AccountCircleSharpIcon />,
            3: <RequestQuoteSharpIcon />,
            4: <DescriptionSharpIcon />,
            5: <ThumbUpAltIcon />,
        };

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    //style del modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 400,
        bgcolor: 'background.default',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

    const personeriaOnChange = (event) => {
        // setPerson(event.target.value)
        setPerson(event)
    }

    const relacionAccionistaOnChange = (event) => {
        setRelacionAccionista(event.target.value)
    }

    // Opciones de configuración
    const personeriaOpciones = [
        { value: "100000000", label: "Persona Jurídica", icon: Business, color: "#1976d2" },
        { value: "100000001", label: "Persona Física", icon: Person, color: "#2e7d32" },
    ]
    // new_relacion
    const tipoRelacionAccionista = [
        { value: '0', label: 'Ascendente' },
        { value: '1', label: 'Descendente' }
    ]

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(136,212,76) 0%,rgb(34,174,15)50%,rgb(136,212,76) 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(136,212,76) 0%,rgb(34,174,15)50%,rgb(136,212,76) 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[600],
            borderRadius: 1,
        },
    }));

    const ColorlibStepIconRoot2 = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[600],
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient( 95deg,rgb(136,212,76) 0%,rgb(34,174,15)50%,rgb(136,212,76) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient( 95deg,rgb(136,212,76) 0%,rgb(34,174,15)50%,rgb(136,212,76) 100%)',
        }),
    }));

    function ColorlibStepIcon(props) {
        const { active, completed, className } = props;

        const icons = {
            1: <ManageAccountsIcon />,
            2: <AssignmentIndIcon />,
            3: <RequestQuoteIcon />,
            4: <DescriptionIcon />,
            5: <ThumbUpAltIcon />
        };

        return (
            <ColorlibStepIconRoot2 ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot2>
        );
    }

    ColorlibStepIcon.propTypes = {
        /**
         * Whether this step is active.
         * @default false
         */
        active: PropTypes.bool,
        className: PropTypes.string,
        /**
         * Mark the step as completed. Is passed to child components.
         * @default false
         */
        completed: PropTypes.bool,
        /**
         * The label displayed in the step icon.
         */
        icon: PropTypes.node,
    };

    const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[900],
        display: 'flex',
        height: 24,
        alignItems: 'center',
        ...(ownerState.active && {
            color: '#00c853',
        }),
        '& .QontoStepIcon-completedIcon': {
            color: '#00c853',
            zIndex: 1,
            fontSize: 30,
        },
        '& .QontoStepIcon-circle': {
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
    }));

    function QontoStepIcon(props) {
        const { active, completed, className } = props;

        return (
            <QontoStepIconRoot ownerState={{ active }} className={className}>
                {completed ? (
                    <Check className="QontoStepIcon-completedIcon" />
                ) : (
                    <div className="QontoStepIcon-circle" />
                )}
            </QontoStepIconRoot>
        );
    }

    QontoStepIcon.propTypes = {
        /**
         * Whether this step is active.
         * @default false
         */
        active: PropTypes.bool,
        className: PropTypes.string,
        /**
         * Mark the step as completed. Is passed to child components.
         * @default false
         */
        completed: PropTypes.bool,
    };

    const onChange = () => {
        setStorage(formData);
    };

    const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[600],
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient( 95deg,rgb(21,113,9) 0%,rgb(21,113,9)50%,rgb(9,121,97) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient( 95deg,rgb(21,113,9) 0%,rgb(21,113,9)50%,rgb(9,121,97) 100%)',
        }),
    }));

    ColorlibStepIcon.propTypes = {
        /**
         * Whether this step is active.
         * @default false
         */
        active: PropTypes.bool,
        className: PropTypes.string,
        /**
         * Mark the step as completed. Is passed to child components.
         * @default false
         */
        completed: PropTypes.bool,
        /**
         * The label displayed in the step icon.
         */
        icon: PropTypes.node,
    };

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark"

    const porcentajeF = (value) => {
        setPercentaje(value)
    }

    const buscarPymeLufe = (datos) => {
        const validacionCuit = ValidateCUITCUIL(cuitCuilCdi)
        if (validacionCuit) {
            getLufe(datos.cuitCuilCdi)
        } else {
            toast.error('El CUIT/CUIL debe ser válido!');
        }
    }

    React.useEffect(() => {
        if (Object.keys(entidad)?.length > 0 && consultaLufe) {
            if (entidad?.nombre !== undefined && entidad?.nombre !== null) {
                setActividadPrincipal(entidad.actividad_principal)
                if (entidad.actividad_principal != null && entidad.actividad_principal != undefined) {
                    var actividadAux = ''
                    if (actividadAfip.filter(item => item.new_codigo === entidad.actividad_principal).length > 0) {
                        actividadAfip.filter(item => item.new_codigo === entidad.actividad_principal).map(ite => {
                            actividadAux = { value: ite.new_actividadafipid, label: ite.new_codigo + ' - ' + ite.new_name }
                        })
                        setValue("actividad", actividadAux)
                    }
                }
                setValue('lufeConsultado', true)
                setValue('nombreRazonSocial', entidad.nombre)
                if (entidad.personeria == "Jurídica") {
                    setValue('personeria', '100000000')
                } else {
                    setValue('personeria', '100000001')
                }
                let autoridades = entidad?.autoridad
                if (autoridades?.length > 0) {
                    let autoridadesAccionistas = autoridades.filter(item => item?.es_accionista === 1)
                    agregarAccionistaLufe(autoridadesAccionistas)
                }
                if (entidad?.documentos) {
                    let docucsUnix = [...new Map(entidad.documentos.map(item => [item["nombre"], item])).values()]
                    setDocumentosLufe(docucsUnix)
                    localStorage.setItem("documentosLufe", JSON.stringify(docucsUnix))
                }
                setValue('entidadLufeEncontrada', true)
            } else {
                setValue('lufeConsultado', true)
                setValue('entidadLufeEncontrada', false)
            }
        } else if (Object.keys(entidad)?.length === 0 && consultaLufe) {
            setValue('lufeConsultado', true)
            setValue('entidadLufeEncontrada', false)
        }
    }, [entidad, consultaLufe])

    const agregarAccionistaLufe = (autoridades) => {
        if (accionistas.length > 0) {
            setAccionistas([])
        }
        var accionistasAux = []
        autoridades.forEach(item => {
            const autoridadAccionista = {
                uid: '',
                personeria: '',
                cuitcuil: '',
                razonSocial: '',
                nombre: '',
                apellido: '',
                porcentaje: 0,
                descripcion: '',
                tipoRelacion: '100000001',  //Accionista
                relacionDirecta: false
            }
            autoridadAccionista.uid = shortid.generate()
            autoridadAccionista.personeria = "100000000" //JURIDICA
            autoridadAccionista.cuitcuil = item.cuit.toString()
            autoridadAccionista.razonSocial = item.denominacion
            autoridadAccionista.porcentaje = item.porc_accionista.toString()
            autoridadAccionista.relacionDirecta = false
            accionistasAux.push(autoridadAccionista)
        })
        setAccionistas(accionistasAux)
        var currentData = localStorage.getItem("docsValues")
        currentData = currentData ? JSON.parse(currentData) : {};
        currentData.accionistas = accionistasAux
        localStorage.setItem("docsValues", JSON.stringify(currentData))
        localStorage.setItem("accionistasLufe", JSON.stringify(currentData))
    }

    const LinkStyled = styled(Link)(({ theme }) => ({
        display: 'flex',
        fontSize: '0.875rem',
        alignItems: 'center',
        textDecoration: 'none',
        justifyContent: 'center',
        color: theme.palette.primary.main
    }))

    // Estilo para el Box del modal (ahora se aplicará al Paper del Dialog)
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 500 }, // Responsive width
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 0, // Padding se manejará con DialogContent
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh", // Limitar altura para evitar desbordamiento en pantallas pequeñas
        overflowY: "auto", // Permitir scroll si el contenido es largo
    }

    const { settings, saveSettings } = useSettings()

    const handleModeChange = mode => {
        saveSettings({ ...settings, mode: mode })
    }

    const handleModeToggle = () => {
        if (settings.mode === 'light') {
            handleModeChange('dark')
        } else {
            handleModeChange('light')
        }
    }


    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 0,
                    my: 0,
                    backgroundColor: theme.palette.background.default
                }}>
                    <Container component="main" sx={{ fontSize: 22 }}>
                        <Paper
                            elevation={isDark ? 4 : 2}
                            sx={{
                                my: { xs: 2, xl: 4 }, p: { xs: 1, xl: 3 },
                                bgcolor: isDark ? alpha("#000", 0.2) : "#ffffff",
                                border: isDark ? alpha("#000", 0.5) : "none",
                                borderRadius: 3,
                            }}>
                            <Grid alignItems="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                <MultiStepProgressBar
                                    currentStep={activeStep}
                                    theme={theme}
                                    showProgress={false}
                                    showEstimatedTime={false}
                                />
                            </Grid>
                        </Paper>
                        <Paper
                            elevation={isDark ? 4 : 2}
                            sx={{
                                my: { xs: 1, xl: 4 }, p: { xs: 2, xl: 3 },
                                bgcolor: isDark ? alpha("#000", 0.2) : "#ffffff",
                                border: isDark ? alpha("#000", 0.5) : "none",
                                borderRadius: 3,
                            }}
                        >
                            <React.Fragment>
                                {activeStep === steps.length ?
                                    <div>
                                        {mostrarFormularios(activeStep, theme)}
                                    </div>
                                    : (

                                        <React.Fragment>
                                            <FormProvider {...methods}>
                                                <form onChange={onChange}>
                                                    <Box>{mostrarFormularios(activeStep, theme)}</Box>
                                                    <Grid container>
                                                        <Grid xs={6}>
                                                            {
                                                                activeStep != 5 ?
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                                        {
                                                                            !desabilitadoEnvio ?
                                                                                <Tooltip title={<Typography sx={{ color: '#fff' }}>Volver</Typography>} sx={{ mt: 3 }}>
                                                                                    <LinkStyled disabled={desabilitadoEnvio} href='/'>
                                                                                        <IconButton disabled={desabilitadoEnvio}>
                                                                                            <ArrowBackIcon disabled={desabilitadoEnvio} />
                                                                                        </IconButton>
                                                                                    </LinkStyled>
                                                                                </Tooltip> : null
                                                                        }
                                                                        <Tooltip title={<Typography sx={{ color: '#fff' }}>Reiniciar Onboarding</Typography>} sx={{ mt: 3 }} >
                                                                            <IconButton disabled={desabilitadoEnvio}>
                                                                                <ReplayIcon onClick={() => setOpenReiniciarOnboarding(true)} disabled={desabilitadoEnvio} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title={<Typography sx={{ color: '#fff' }}>Nuestro onbarding digital se guarda en el almacenamiento del navegador,
                                                                            por lo que los datos se irán guardando conforme vayas completando los formularios.</Typography>} sx={{ mt: 3 }} >
                                                                            <IconButton disabled={desabilitadoEnvio}>
                                                                                <InfoIcon disabled={desabilitadoEnvio} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        {darkMode ? (
                                                                            <Tooltip title={<Typography sx={{ color: '#fff' }}>Modo Claro</Typography>} sx={{ mt: 3 }} >
                                                                                <IconButton disabled={desabilitadoEnvio}>
                                                                                    <LightMode onClick={() => setDarkMode(false)} disabled={desabilitadoEnvio} />
                                                                                </IconButton>
                                                                            </Tooltip>) : (
                                                                            <Tooltip title={<Typography sx={{ color: "#fff" }}>Modo Oscuro</Typography>} sx={{ mt: 3 }}>
                                                                                <IconButton disabled={desabilitadoEnvio}>
                                                                                    <DarkMode onClick={handleModeToggle} color="primary" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )}
                                                                    </Box>
                                                                    : null
                                                            }
                                                        </Grid>
                                                        <Grid xs={6}>
                                                            {
                                                                activeStep != 5 ?
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        {(activeStep !== 0 && envioConfirmado.current === false) && (
                                                                            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }} disabled={desabilitadoEnvio}>
                                                                                Atras
                                                                            </Button>
                                                                        )}

                                                                        {activeStep === steps.length - 1 ? (
                                                                            null
                                                                            // <Button
                                                                            //     variant="contained"
                                                                            //     onClick={handleSubmit(submitDatos)}
                                                                            //     disabled={desabilitadoEnvio}
                                                                            //     sx={{ mt: 3, ml: 1, color: '#24292e', }}
                                                                            // >Enviar</Button>
                                                                        ) : activeStep === 0 && lufeHabilitado && !lufeConsultado ? (
                                                                            <Box sx={{ mt: 3, ml: 1, position: "relative" }}>
                                                                                <Button fullWidth size="large" type="submit" variant="contained" disabled={loadingLufe} onClick={handleSubmit(buscarPymeLufe)}>
                                                                                    Consultar
                                                                                </Button>
                                                                                {loadingLufe && (
                                                                                    <CircularProgress
                                                                                        size={30}
                                                                                        sx={{
                                                                                            color: 'green',
                                                                                            position: "absolute",
                                                                                            top: "30%",
                                                                                            left: "50%",
                                                                                            marginTop: "-12px",
                                                                                            marginLeft: "-12px",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                        ) : activeStep === 0 ? (
                                                                            <Box sx={{ mt: 3, ml: 1, position: "relative" }}>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    disabled={consultaCuit}
                                                                                    onClick={handleNext}
                                                                                    Consultar
                                                                                >
                                                                                    Siguiente
                                                                                </Button>
                                                                                {consultaCuit && (
                                                                                    <CircularProgress
                                                                                        size={30}
                                                                                        sx={{
                                                                                            color: "green",
                                                                                            position: "absolute",
                                                                                            top: "30%",
                                                                                            left: "50%",
                                                                                            marginTop: "-12px",
                                                                                            marginLeft: "-12px",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                        ) : activeStep === 1 ? (
                                                                            <Box sx={{ mt: 3, ml: 1, position: "relative" }}>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    disabled={consultaCorreo}
                                                                                    onClick={handleNext}
                                                                                    Consultar
                                                                                >
                                                                                    Siguiente
                                                                                </Button>
                                                                                {consultaCorreo && (
                                                                                    <CircularProgress
                                                                                        size={30}
                                                                                        sx={{
                                                                                            color: "green",
                                                                                            position: "absolute",
                                                                                            top: "30%",
                                                                                            left: "50%",
                                                                                            marginTop: "-12px",
                                                                                            marginLeft: "-12px",
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                        ) : (
                                                                            <Button
                                                                                variant="contained"
                                                                                onClick={handleNext}
                                                                                sx={{ mt: 3, ml: 1, color: '#24292e', }}
                                                                            >
                                                                                Siguiente</Button>
                                                                        )}
                                                                        {/* {
                                                            lufeHabilitado ?
                                                                 : null
                                                        } */}
                                                                    </Box>
                                                                    : null
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                                {/* </Paper> */}
                                            </FormProvider>
                                        </React.Fragment>
                                    )}
                            </React.Fragment>
                        </Paper>
                        {/* Modal Carpeta de Documentos */}
                        <ModalCarpeta
                            openCarpeta={openCarpeta}
                            handleCloseCarpeta={handleCloseCarpeta}
                            carpeta={carpeta}
                            nombreDocumento={nombreDocumento}
                            handleOpen={handleOpen}
                            prepararModalEliminarArchivo={prepararModalEliminarArchivo}
                        />
                        <ModalSubirArchivo
                            open={open}
                            handleClose={handleClose}
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            nombreDocumento={nombreDocumento}
                            agregarDocumento={agregarDocumento}
                            desabilitadoDocumento={desabilitadoDocumento}
                            uploadProgress={uploadProgress}
                            handleRemoveFile={handleRemoveFile}
                            handleRemoveAllFile={handleRemoveAllFiles}
                        />
                        <ModalAccionistas
                            open2={open2}
                            handleClose2={handleClose2}
                            esActualizacion={esActualizacion}
                            personeriaOpciones={personeriaOpciones}
                            person={person}
                            nombre={nombre}
                            setNombre={setNombre}
                            apellido={apellido}
                            setApellido={setApellido}
                            razonSoc={razonSoc}
                            setRazonSoc={setRazonSoc}
                            cuitCUIL={cuitCUIL}
                            setcuitCUIL={setcuitCUIL}
                            percentaje={percentaje}
                            setPercentaje={setPercentaje}
                            relacionAccionista={relacionAccionista}
                            relacionAccionistaOnChange={relacionAccionistaOnChange}
                            crearAccionista={crearAccionistaForm}
                            modificarAccionista={modificarAccionistaForm}
                            loadingAccionistas={loadingAccionistas}
                            loading={loading}
                            habilitarEdicion={habilitarEdicion}
                            tipoRelacionAccionista={tipoRelacionAccionista}
                            personeriaOnChange={personeriaOnChange}
                            isAccionistaEdditing={isAccionistaEdditing}
                            accionistaSeleccionado={accionistaSeleccionado}
                        />
                        {/*Modal eliminar Archivo*/}
                        <Dialog
                            open={openEliminarArchivo}
                            onClose={handleCloseEliminarArchivo}
                            aria-labelledby="delete-file-confirmation-title"
                            aria-describedby="delete-file-confirmation-description"
                            PaperProps={{ sx: modalStyle }}
                        >
                            <DialogTitle id="delete-file-confirmation-title" sx={{ pb: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <WarningAmberIcon color="warning" />
                                    <Typography variant="h6" component="span">
                                        Confirmar Eliminación de Archivo
                                    </Typography>
                                </Box>
                            </DialogTitle>
                            <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
                                <Typography id="delete-file-confirmation-description" variant="body1" color="text.secondary">
                                    ¿Está seguro que desea eliminar {nombreDocumento}? Esta acción no se puede deshacer.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, justifyContent: "space-around", mt: 2 }}>
                                <Button variant="outlined" color="inherit" onClick={() => setOpenEliminarArchivo(false)}>
                                    Cancelar
                                </Button>
                                <Box sx={{ position: "relative" }}>
                                    <Button variant="contained" color="success" onClick={() => eliminarArchivo(archivoSeleccionado)}>
                                        {loading ? "" : "Eliminar"}
                                    </Button>
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: theme.palette.error.main,
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                marginTop: "-12px",
                                                marginLeft: "-12px",
                                            }}
                                        />
                                    )}
                                </Box>
                            </DialogActions>
                        </Dialog>
                        {/*Modal eliminar Accionista*/}
                        <Dialog
                            open={openEliminarAccionista}
                            onClose={handleCloseEliminarAccionista}
                            aria-labelledby="delete-confirmation-title"
                            aria-describedby="delete-confirmation-description"
                            PaperProps={{ sx: modalStyle }}
                        >
                            <DialogTitle id="delete-confirmation-title" sx={{ pb: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <WarningAmberIcon color="warning" />
                                    <Typography variant="h6" component="span">
                                        Confirmar Eliminación
                                    </Typography>
                                </Box>
                            </DialogTitle>
                            <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
                                <Typography id="delete-confirmation-description" variant="body1" color="text.secondary">
                                    ¿Está seguro que desea eliminar el accionista? Esta acción no se puede deshacer.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, justifyContent: "space-around", mt: 2 }}>
                                <Button variant="outlined" color="inherit" onClick={() => setOpenEliminarAccionista(false)} disabled={loading}>
                                    Cancelar
                                </Button>
                                <Box sx={{ position: "relative" }}>
                                    <Button variant="contained" color="success" onClick={() => eliminarAccionista(accionistaID)} disabled={loading}>
                                        {loading ? "" : "Eliminar"}
                                    </Button>
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: theme.palette.error.main, // Color del spinner acorde al botón de error
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                marginTop: "-12px",
                                                marginLeft: "-12px",
                                            }}
                                        />
                                    )}
                                </Box>
                            </DialogActions>
                        </Dialog>
                        {/*Modal eliminar Archivo*/}
                        <Dialog
                            open={openReiniciarOnboarding}
                            onClose={handleCloseReiniciarOnboarding}
                            aria-labelledby="restart-onboarding-confirmation-title"
                            aria-describedby="restart-onboarding-confirmation-description"
                            PaperProps={{ sx: modalStyle }}
                        >
                            <DialogTitle id="restart-onboarding-confirmation-title" sx={{ pb: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <WarningAmberIcon color="warning" />
                                    <Typography variant="h6" component="span">
                                        Confirmar Reinicio de Onboarding
                                    </Typography>
                                </Box>
                            </DialogTitle>
                            <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
                                <Typography id="restart-onboarding-confirmation-description" variant="body1" color="text.secondary">
                                    ¿Está seguro que desea reiniciar el proceso de onboarding? Esta acción no se puede deshacer.
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, mt: 2, justifyContent: "space-around" }}>
                                <Button variant="outlined" color="inherit" onClick={() => setOpenReiniciarOnboarding(false)}>
                                    Cancelar
                                </Button>
                                <Box sx={{ position: "relative" }}>
                                    <Button variant="contained" color="success" onClick={() => reinciarOnboarding()}>
                                        {loading ? "" : "Confirmar"}
                                    </Button>
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: theme.palette.success.main, // Color del spinner acorde al botón de éxito
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                marginTop: "-12px",
                                                marginLeft: "-12px",
                                            }}
                                        />
                                    )}
                                </Box>
                            </DialogActions>
                        </Dialog>
                        {/* Modal accionista */}

                    </Container>
                </Box>
            </ThemeProvider>
        </>

    )
}
// SolicitudAlta.getLayout = page => <BlankLayout>{page}</BlankLayout>
SolicitudAlta.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
export default SolicitudAlta