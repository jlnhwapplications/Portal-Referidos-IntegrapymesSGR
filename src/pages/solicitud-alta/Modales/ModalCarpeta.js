import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Chip,
    Tooltip,
    Button,
    Divider,
    Stack,
    useTheme,
    alpha,
    Skeleton,
    Badge,
} from "@mui/material"
import {
    Close as CloseIcon,
    Delete as DeleteIcon,
    FolderOpen as FolderOpenIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon,
    CloudUpload as CloudUploadIcon,
    Description as DescriptionIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    VideoFile as VideoIcon,
    AudioFile as AudioIcon,
    Archive as ArchiveIcon,
} from "@mui/icons-material"
import { useState } from "react"

const ModalCarpeta = ({ openCarpeta, handleCloseCarpeta, carpeta, nombreDocumento, handleOpen, prepararModalEliminarArchivo }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const [hoveredFile, setHoveredFile] = useState(null)

    const handleOpenSubirArchivo = () => {
        handleOpen()
        setTimeout((handleCloseCarpeta), 200)
    }

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
    const getFileIcon = (fileName) => {
        const extension = fileName.split(".").pop()?.toLowerCase()

        const iconMap = {
            pdf: PdfIcon,
            doc: DescriptionIcon,
            docx: DescriptionIcon,
            txt: DescriptionIcon,
            jpg: ImageIcon,
            jpeg: ImageIcon,
            png: ImageIcon,
            gif: ImageIcon,
            mp4: VideoIcon,
            avi: VideoIcon,
            mov: VideoIcon,
            mp3: AudioIcon,
            wav: AudioIcon,
            zip: ArchiveIcon,
            rar: ArchiveIcon,
            xls: ArchiveIcon,
            xlsx: ArchiveIcon,
            csv: ArchiveIcon,
            xlsb: ArchiveIcon,
            xltx: ArchiveIcon,
            xltm: ArchiveIcon,
        }

        return iconMap[extension] || Description
    }

    const getFileColor = (fileName) => {
        const extension = fileName.split(".").pop()?.toLowerCase()

        const colorMap = {
            pdf: theme.palette.error.main,
            doc: theme.palette.info.main,
            docx: theme.palette.info.main,
            txt: theme.palette.grey[600],
            jpg: theme.palette.success.main,
            jpeg: theme.palette.success.main,
            png: theme.palette.success.main,
            gif: theme.palette.success.main,
            mp4: theme.palette.warning.main,
            avi: theme.palette.warning.main,
            mov: theme.palette.warning.main,
            mp3: theme.palette.secondary.main,
            wav: theme.palette.secondary.main,
            zip: theme.palette.grey[700],
            rar: theme.palette.grey[700],
        }

        return colorMap[extension] || theme.palette.primary.main
    }

    const formatDate = (fileName) => {
        // Simulamos fechas para demo
        const dates = ["Hace 2 días", "Hace 1 semana", "Hace 3 días", "Ayer", "Hace 5 días"]
        return dates[Math.floor(Math.random() * dates.length)]
    }

    return (
        <Dialog
            open={openCarpeta}
            onClose={handleCloseCarpeta}
            aria-labelledby="folder-modal-title"
            aria-describedby="folder-modal-description"
            PaperProps={{ sx: modalStyle }} // Aplicar el estilo al Paper del Dialog
        >
            {/* Header */}
            <DialogTitle sx={{ pb: 0, px: 3, pt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: theme.shadows[3],
                            }}
                        >
                            <FolderOpenIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ maxWidth: 300 }}>
                                <Typography
                                    component="h2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.5,
                                        color: theme.palette.text.primary,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontSize: 18
                                    }}
                                >
                                    {nombreDocumento}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Badge
                                    badgeContent={carpeta[0]?.length}
                                    color="primary"
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            fontSize: "0.75rem",
                                            minWidth: 20,
                                            height: 20,
                                        },
                                    }}
                                >
                                    <DescriptionIcon sx={{ fontSize: 16 }} />
                                </Badge>
                                {(carpeta[0]?.nombreArchivos?.length === 1) ? "1 documento" :
                                    (carpeta[0]?.nombreArchivos?.length > 0) ? `${carpeta[0]?.nombreArchivos?.length} documentos` : '0 documentos'}
                            </Typography>
                        </Box>
                    </Box>

                    <Tooltip title="Cerrar carpeta" arrow>
                        <IconButton
                            onClick={handleCloseCarpeta}
                            sx={{
                                backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.8),
                                    transform: "scale(1.05)",
                                },
                                transition: "all 0.2s ease-in-out",
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Action Bar */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Chip
                        icon={<FolderOpenIcon />}
                        label="Documentos"
                        color="primary"
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            "& .MuiChip-icon": {
                                fontSize: 18,
                            },
                        }}
                    />

                    <Button
                        startIcon={<CloudUploadIcon />}
                        variant="outlined"
                        size="small"
                        onClick={handleOpenSubirArchivo}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: theme.shadows[4],
                            },
                            transition: "all 0.2s ease-in-out",
                        }}
                    >
                        Subir archivo
                    </Button>
                </Box>

                <Divider sx={{ mx: -3 }} />
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ px: 3, py: 0, minHeight: 200 }}>
                {false ? (
                    // Loading State
                    <Box sx={{ py: 2 }}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="40%" height={16} />
                                </Box>
                                <Skeleton variant="rectangular" width={80} height={32} />
                            </Box>
                        ))}
                    </Box>
                ) : (carpeta[0] && carpeta[0].nombreArchivos?.length > 0) ? (
                    // Files List
                    <List sx={{ py: 2 }}>
                        {carpeta[0].nombreArchivos?.map((archivo, index) => {
                            const FileIcon = getFileIcon(archivo)
                            const fileColor = getFileColor(archivo)
                            const isHovered = hoveredFile === archivo

                            return (
                                <ListItem
                                    key={archivo}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        transition: "all 0.2s ease-in-out",
                                        backgroundColor: isHovered ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                                        border: `1px solid ${isHovered ? alpha(theme.palette.primary.main, 0.2) : "transparent"}`,
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            transform: "translateY(-1px)",
                                            boxShadow: theme.shadows[2],
                                        },
                                        animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
                                        "@keyframes slideIn": {
                                            "0%": {
                                                opacity: 0,
                                                transform: "translateY(20px)",
                                            },
                                            "100%": {
                                                opacity: 1,
                                                transform: "translateY(0)",
                                            },
                                        },
                                    }}
                                    onMouseEnter={() => setHoveredFile(archivo)}
                                    onMouseLeave={() => setHoveredFile(null)}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                backgroundColor: alpha(fileColor, 0.1),
                                                color: fileColor,
                                                border: `2px solid ${alpha(fileColor, 0.2)}`,
                                                transition: "all 0.2s ease-in-out",
                                                ...(isHovered && {
                                                    transform: "scale(1.1)",
                                                    boxShadow: `0 4px 12px ${alpha(fileColor, 0.3)}`,
                                                }),
                                            }}
                                        >
                                            <FileIcon />
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: theme.palette.text.primary,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: { xs: 200, sm: 300 },
                                                }}
                                            >
                                                {archivo}
                                            </Typography>
                                        }
                                        secondary={
                                            <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                {/* <Typography variant="caption" color="text.secondary">
                                                                       {formatFileSize(archivo)}
                                                                   </Typography> */}
                                                {/* <Typography variant="caption" color="text.secondary">
                                                                       {formatDate(archivo)}
                                                                   </Typography> */}
                                            </Stack>
                                        }
                                    />

                                    <ListItemSecondaryAction>
                                        <Stack direction="row" spacing={0.5}>
                                            {/* <Tooltip title="Ver archivo" arrow>
                                                                   <IconButton
                                                                       size="small"
                                                                       onClick={() => handleViewFile(archivo)}
                                                                       sx={{
                                                                           color: theme.palette.info.main,
                                                                           "&:hover": {
                                                                               backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                                               transform: "scale(1.1)",
                                                                           },
                                                                           transition: "all 0.2s ease-in-out",
                                                                       }}
                                                                   >
                                                                       <VisibilityIcon fontSize="small" />
                                                                   </IconButton>
                                                               </Tooltip> */}

                                            {/* <Tooltip title="Descargar archivo" arrow>
                                                                   <IconButton
                                                                       size="small"
                                                                       onClick={() => handleDownloadFile(archivo)}
                                                                       sx={{
                                                                           color: theme.palette.success.main,
                                                                           "&:hover": {
                                                                               backgroundColor: alpha(theme.palette.success.main, 0.1),
                                                                               transform: "scale(1.1)",
                                                                           },
                                                                           transition: "all 0.2s ease-in-out",
                                                                       }}
                                                                   >
                                                                       <DownloadIcon fontSize="small" />
                                                                   </IconButton>
                                                               </Tooltip> */}

                                            <Tooltip title="Eliminar archivo" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => prepararModalEliminarArchivo(archivo)}
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        "&:hover": {
                                                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                            transform: "scale(1.1)",
                                                        },
                                                        transition: "all 0.2s ease-in-out",
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                ) : (
                    // Empty State
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 6,
                            textAlign: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                mb: 3,
                                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            <FolderOpenIcon sx={{ fontSize: 40 }} />
                        </Avatar>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                                color: theme.palette.text.primary,
                            }}
                        >
                            Carpeta vacía
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                            No hay documentos en esta carpeta. Puedes subir archivos para comenzar a organizarlos.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={handleOpenSubirArchivo}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                px: 3,
                                py: 1,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                "&:hover": {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    transform: "translateY(-2px)",
                                    boxShadow: theme.shadows[8],
                                },
                                transition: "all 0.3s ease-in-out",
                            }}
                        >
                            Subir primer archivo
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ModalCarpeta