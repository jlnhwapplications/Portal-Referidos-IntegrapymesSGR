import { CheckCircle, Close, CloudUpload, Delete, Description, Image, PictureAsPdf, Warning } from '@mui/icons-material'
import { Alert, alpha, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, IconButton, LinearProgress, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const ModalSubirArchivo = ({ open, handleClose, selectedFiles = [], setSelectedFiles, nombreDocumento = '', agregarDocumento, desabilitadoDocumento, uploadProgress, handleRemoveFile, handleRemoveAllFiles }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    //DOCUMENTOS

    const multiple = true
    const maxSize = 15728640 // 15MB
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
        return selectedFiles.reduce((acc, file) => acc + file.size, 0)
    }, [selectedFiles])

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const handleRemoveAllFilesModal = () => {
        setSelectedFiles([]);
    };

    const handleRemoveFileModal = (index) => {
        const filtered = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(filtered);
    };


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
                    setSelectedFiles((prev) => (multiple ? [...prev, ...acceptedFiles] : acceptedFiles))
                }
            },
            [multiple],
        ),
        accept: acceptedTypes,
        maxSize,
        multiple,
    })



    // Componente para el header del modal
    function ModalHeader({ title, onClose, theme }) {
        const isDark = theme.palette.mode === "dark"

        return (
            <DialogTitle sx={{ p: 0 }}>
                <Paper
                    elevation={0}
                    sx={{
                        background: isDark
                            ? theme.palette.background
                            : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                        borderBottom: 1,
                        borderBottomColor: theme.palette.divider,
                        color: "white",
                        p: 3,
                        borderRadius: "16px 16px 0 0",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            // background: isDark
                            //     ? "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)"
                            //     : "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
                            pointerEvents: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: alpha("#ffffff", 0.2),
                                    border: "2px solid rgba(255, 255, 255, 0.3)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <CloudUpload />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }}>
                                    {title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.8) }}>
                                    Sube tus documentos de forma segura
                                </Typography>
                            </Box>
                        </Box>

                        <Tooltip title="Cerrar" arrow>
                            <IconButton
                                onClick={onClose}
                                disabled={desabilitadoDocumento}
                                sx={{
                                    color: "white",
                                    bgcolor: alpha("#ffffff", 0.1),
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    "&:hover": {
                                        bgcolor: alpha("#ffffff", 0.2),
                                        transform: "scale(1.05)",
                                    },
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>
            </DialogTitle>
        )
    }

    // Componente para mostrar información del archivo
    function FileIcon({ file, size = 40 }) {
        const getFileIcon = () => {
            const type = file.type.toLowerCase()

            if (type.includes("pdf")) {
                return { icon: PictureAsPdf, color: "#f44336" }
            }
            if (type.includes("image")) {
                return { icon: Image, color: "#4caf50" }
            }
            if (type.includes("word") || type.includes("document")) {
                return { icon: Description, color: "#2196f3" }
            }
            return { icon: Description, color: "#757575" }
        }

        const { icon: IconComponent, color } = getFileIcon()

        return (
            <Avatar
                sx={{
                    width: size,
                    height: size,
                    bgcolor: alpha(color, 0.1),
                    border: `2px solid ${alpha(color, 0.3)}`,
                }}
            >
                <IconComponent sx={{ fontSize: size * 0.6, color }} />
            </Avatar>
        )
    }


    // Componente para mostrar archivos seleccionados
    function FileList({ files, onRemove, uploadProgress, theme }) {
        const isDark = theme.palette.mode === "dark"

        const formatFileSize = (bytes) => {
            if (bytes === 0) return "0 Bytes"
            const k = 1024
            const sizes = ["Bytes", "KB", "MB", "GB"]
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
        }

        return (
            // <Fade in timeout={500}>
            <Paper
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
                // elevation={isDark ? 2 : 1}
                // sx={{
                //     mt: 3,
                //     borderRadius: 3,
                //     bgcolor: theme.palette.background,
                //     border: isDark ? "1px solid #4A4063" : "1px solid #e0e0e0",
                //     overflow: "hidden",
                // }}
            >
                <Box sx={{ p: 2, bgcolor: isDark ? alpha("#64b5f6", 0.1) : alpha("#1976d2", 0.05) }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        Archivos Seleccionados ({files.length})
                    </Typography>
                </Box>

                <List disablePadding>
                    {files.map((file, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                py: 2,
                                borderBottom: index < files.length - 1 ? `1px solid ${isDark ? "#4A4063" : "#e0e0e0"}` : "none",
                                "&:hover": {
                                    bgcolor: isDark ? alpha("#64b5f6", 0.05) : alpha("#1976d2", 0.02),
                                },
                                transition: "background-color 0.3s ease",
                            }}
                        >
                            <ListItemIcon>
                                <FileIcon file={file} />
                            </ListItemIcon>

                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body2" fontWeight="medium" noWrap>
                                        {file.name}
                                    </Typography>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatFileSize(file.size)}
                                        </Typography>
                                        {uploadProgress[index] !== undefined && (
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={uploadProgress[index]}
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                        bgcolor: isDark ? "#4A4063" : "#e0e0e0",
                                                        "& .MuiLinearProgress-bar": {
                                                            bgcolor: uploadProgress[index] === 100 ? "#4caf50" : "#1976d2",
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                                    {uploadProgress[index] === 100 ? "Completado" : `${uploadProgress[index]}%`}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                }
                            />

                            <ListItemSecondaryAction>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {uploadProgress[index] === 100 && <CheckCircle sx={{ color: "#4caf50", fontSize: 20 }} />}

                                    <Tooltip title="Eliminar archivo" arrow>
                                        <IconButton
                                            edge="end"
                                            onClick={() => onRemove(index)}
                                            disabled={uploadProgress[index] !== undefined && uploadProgress[index] < 100}
                                            sx={{
                                                color: "error.main",
                                                "&:hover": {
                                                    bgcolor: alpha("#f44336", 0.1),
                                                    transform: "scale(1.1)",
                                                },
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
            // </Fade>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            // sx={{ bgcolor: isDark ? theme.palette.background : "#ffffff" }}
            PaperProps={{
                elevation: isDark ? 12 : 8,
                sx: {
                    borderRadius: 4,
                    bgcolor: isDark ? theme.palette.background : "#ffffff",
                    backdropFilter: "blur(10px)",
                    border: theme.palette.divider,
                    overflow: "hidden",
                },
            }}
        >
            <ModalHeader title="Cargar Documentación" onClose={handleClose} theme={theme} />

            <DialogContent sx={{ p: 3, bgcolor: isDark ? theme.palette.background : "#ffffff" }}>
                {/* Chip del documento */}
                <Fade in timeout={300}>
                    <Box sx={{ my: 3 }}>
                        <Chip
                            label={nombreDocumento}
                            color="primary"
                            variant="outlined"
                            sx={{
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                height: 36,
                                borderWidth: 2,
                                "& .MuiChip-label": {
                                    px: 2,
                                },
                            }}
                        />
                    </Box>
                </Fade>

                {/* Zona de arrastrar y soltar */}
                <Paper
                    {...getRootProps()}
                    elevation={isDark ? 4 : 2}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        cursor: "pointer",
                        border: isDragActive
                            ? `3px dashed ${isDark ? "#64b5f6" : "#1976d2"}`
                            : isDragReject
                                ? `3px dashed #f44336`
                                : `2px dashed ${isDark ? theme.palette.divider : "#e0e0e0"}`,
                        borderRadius: 3,
                        bgcolor: isDragActive
                            ? isDark
                                ? alpha("#64b5f6", 0.1)
                                : alpha("#1976d2", 0.05)
                            : isDragReject
                                ? alpha("#f44336", 0.05)
                                : isDark
                                    ? theme.palette.background
                                    : "#ffffff",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            borderColor: isDragReject ? "#f44336" : isDark ? "#64b5f6" : "#1976d2",
                            bgcolor: isDragReject ? alpha("#f44336", 0.08) : isDark ? alpha("#64b5f6", 0.05) : alpha("#1976d2", 0.02),
                            transform: "translateY(-2px)",
                            boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.4)" : "0 8px 30px rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    <input {...getInputProps()} />

                    <CloudUpload
                        sx={{
                            fontSize: 80,
                            color: isDragActive ? (isDark ? "#64b5f6" : "#1976d2") : isDragReject ? "#f44336" : "text.secondary",
                            mb: 2,
                            transition: "all 0.3s ease",
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            color: isDragActive ? (isDark ? "#64b5f6" : "#1976d2") : isDragReject ? "#f44336" : "text.primary",
                            transition: "color 0.3s ease",
                        }}
                    >
                        {isDragActive
                            ? "Suelta los archivos aquí"
                            : isDragReject
                                ? "Tipo de archivo no válido"
                                : "Arrastra tus archivos aquí"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        o haz clic para seleccionar archivos
                    </Typography>

                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                        <Chip label="PDF" size="small" variant="outlined" />
                        <Chip label="Imágenes" size="small" variant="outlined" />
                        <Chip label="Word" size="small" variant="outlined" />
                        <Chip label="Excel" size="small" variant="outlined" />
                    </Stack>
                </Paper>

                {/* Lista de archivos */}
                {selectedFiles.length > 0 && (
                    <FileList files={selectedFiles} onRemove={handleRemoveFileModal} uploadProgress={uploadProgress} theme={theme} />
                )}

                {/* Botón para quitar todos los archivos */}
                {selectedFiles.length > 1 && (
                    <Fade in timeout={500}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={handleRemoveAllFilesModal}
                                disabled={desabilitadoDocumento}
                                startIcon={<Delete />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: "medium",
                                }}
                            >
                                Quitar todos
                            </Button>
                        </Box>
                    </Fade>
                )}

                {/* Errores */}
                {/* <Collapse in={errors.length > 0}>
                                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }} onClose={() => setErrors([])}>
                                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                                                Errores encontrados:
                                            </Typography>
                                            {errors.map((error, index) => (
                                                <Typography key={index} variant="caption" display="block">
                                                    • {error.file}: {error.errors.join(", ")}
                                                </Typography>
                                            ))}
                                        </Alert>
                                    </Collapse> */}

                {/* Información de límites */}
                <Alert
                    severity="info"
                    icon={<Warning />}
                    sx={{
                        mt: 3,
                        borderRadius: 2,
                        bgcolor: isDark ? alpha("#2196f3", 0.1) : alpha("#2196f3", 0.05),
                        border: `1px solid ${isDark ? alpha("#2196f3", 0.3) : alpha("#2196f3", 0.2)}`,
                    }}
                >
                    <Typography variant="body2" fontWeight="medium">
                        Límites de archivo:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        • Tamaño máximo por archivo: {formatFileSize(maxSize)}
                        {selectedFiles.length > 0 && (
                            <>
                                <br />• Tamaño total seleccionado: {formatFileSize(totalSize)}
                            </>
                        )}
                    </Typography>
                </Alert>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: isDark ? alpha("#332C4E", 0.5) : alpha("#f8f9fa", 0.8) }}>
                <Box sx={{ position: "relative", width: "100%" }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={agregarDocumento}
                        disabled={desabilitadoDocumento}
                        startIcon={desabilitadoDocumento ? null : <CloudUpload />}
                        sx={{
                            mt: 2,
                            height: 48,
                            borderRadius: 3,
                            fontSize: "1rem",
                            fontWeight: "bold",
                            textTransform: "none",
                            background: isDark
                                ? "linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)"
                                : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                            "&:hover": {
                                background: isDark
                                    ? "linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)"
                                    : "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                            },
                            "&:disabled": {
                                background: isDark ? "#4A4063" : "#e0e0e0",
                                color: isDark ? "#666" : "#999",
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        {desabilitadoDocumento ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        border: "2px solid currentColor",
                                        borderTop: "2px solid transparent",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                        "@keyframes spin": {
                                            "0%": { transform: "rotate(0deg)" },
                                            "100%": { transform: "rotate(360deg)" },
                                        },
                                    }}
                                />
                                Subiendo archivos...
                            </Box>
                        ) : (
                            `Subir ${selectedFiles.length > 0 ? `${selectedFiles.length} archivo${selectedFiles.length > 1 ? "s" : ""}` : "archivos"}`
                        )}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default ModalSubirArchivo