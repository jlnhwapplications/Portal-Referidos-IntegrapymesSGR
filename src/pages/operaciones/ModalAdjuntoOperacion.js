import {
    AppBar, Dialog, DialogTitle, IconButton, Toolbar, Tooltip, Typography, DialogContentText,
    DialogContent, Chip, Box, Button, List
} from '@mui/material';
import React, { useContext, useState, Fragment, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import DropzoneWrapper from "@/styles/libs/react-dropzone";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import { cargarAdjuntoGarantia, obtenerAdjuntosGarantias } from '@/redux/Garantias'
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from "@/context/AuthContext";
import Link from 'next/link';
import ListItem from "@mui/material/ListItem";
import { cargarDocumentacionPorOperacion, limpiarCargaDocumento, obtenerOperaciones } from '@/redux/Operaciones';
import toast from 'react-hot-toast';

const Img = styled("img")(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        // marginRight: theme.spacing(15.75),
    },
    [theme.breakpoints.down("md")]: {
        marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.down("sm")]: {
        width: 160,
    },
}));

const ModalAdjuntoOperacion = ({ open, data, handleClose, id }) => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState("sm");
    const [files, setFiles] = useState([]);
    const { token, referido } = useContext(AuthContext);
    const dispatch = useDispatch();
    const loadingDocumentoOperacion = useSelector(store => store.garantias.loadingDocumentoOperacion)

    // ** Hooks
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles.map((file) => Object.assign(file)));
        },
    });

    const renderFilePreview = (file) => {
        if (file.type.startsWith("image")) {
            return <img width={22} height={22} alt={file.name} src={URL.createObjectURL(file)} />;
        } else {
            return <Icon icon="mdi:file-document-outline" />;
        }
    };

    const handleRemoveFile = (file) => {
        const uploadedFiles = files;
        const filtered = uploadedFiles.filter((i) => i.name !== file.name);
        setFiles([...filtered]);
    };

    const fileList = files.map((file) => (
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

    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    const handleSubmission = () => {
        if (id === '') {
            toast.error('La garantia es requerida!');
            return
        }

        if (files.length === 0) {
            toast.error('El archivo adjunto es requerido!');
            return
        }

        const formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            if (files[index].size >= 15000000) {
                toast.error('El archivo no puede superar los 15 megas');
                setFiles([])
                return
            }
            let element = files[index];
            formData.append(`body${index}`, element);
        }
        dispatch(cargarDocumentacionPorOperacion(formData, id, token))
        .then(() => {
            dispatch(obtenerOperaciones(referido?.accountid, token))
            dispatch(limpiarCargaDocumento())
            handleClose()
        })
    };

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <AppBar sx={{ position: "relative" }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <DialogTitle id="responsive-dialog-title">
                        Cargar documentación
                    </DialogTitle>
                    <Tooltip title={<Typography sx={{ color: "#fff" }}>Cerrar</Typography>}>
                        <IconButton edge="end" color="warning" onClick={handleClose} aria-label="close" sx={{ mr: 2 }}>
                            <Icon color="red" icon="material-symbols:close" />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <DialogContentText>
                    <Chip label={data} sx={{ mt: 2, mb: 2 }} />
                    <Box sx={{ py: 2 }}>
                        {/* <FileUploaderMultiple id={id} onSubmit={subir} /> */}
                        <DropzoneWrapper>
                            <Box component="div" sx={{ minHeight: '180px !important' }} {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Img alt="Upload img" width={150} src="/images/misc/upload.png" />
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        {/* <HeadingTypography variant="h5">Adjuntar Archivo.</HeadingTypography> */}
                                        <Typography color="textSecondary" sx={{ "& a": { color: "primary.main", textDecoration: "none" } }}>
                                            Suelte los archivos aquí &nbsp;
                                            <Link href="/" onClick={(e) => e.preventDefault()}>
                                                o haga clic para seleccionar archivos
                                            </Link>{" "}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            {files.length ? (
                                <Fragment>
                                    <List>{fileList}</List>
                                    {files.length > 1 ?
                                        <Box component="div" className="buttons">
                                            <Button color="error" variant="outlined" onClick={handleRemoveAllFiles}>
                                                Quitar todo
                                            </Button>
                                            {/* <Button variant="contained">Upload Files</Button> */}
                                        </Box> : null}
                                </Fragment>
                            ) : null}
                        </DropzoneWrapper>
                    </Box>
                    <Button
                        sx={{ mt: 1, mb: 1 }}
                        fullWidth
                        variant="contained"
                        onClick={handleSubmission}
                        disabled={loadingDocumentoOperacion}
                    >
                        Subir archivo(s)
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ height: '100%' }} >
                            <Icon color="red" icon="ph:warning-bold" sx={{ mr: 2 }} />
                        </Box>
                        <Box sx={{ height: '100%' }} >
                            <Typography>
                                El tamaño máximo permitido por archivo es de 15 MB
                            </Typography>
                        </Box>
                    </Box>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default ModalAdjuntoOperacion
