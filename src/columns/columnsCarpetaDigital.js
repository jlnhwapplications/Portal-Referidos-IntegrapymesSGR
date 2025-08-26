import { Avatar, Box, Chip, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import CustomChip from "@/@core/components/mui/chip"
import CustomAvatar from "@/@core/components/mui/avatar"
// ** Utils Import
import { getInitials } from '@/@core/utils/get-initials'
import Icon from "@/@core/components/icon"
import { useState } from "react"
// ** Next Imports
import Link from 'next/link'
import Utilidades from "@/pages/views/carpeta-digital/Utilidades"
import {
    Description as DocumentIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Schedule as ScheduleIcon,
    CalendarToday as CalendarIcon,
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    CloudUpload as UploadIcon,
} from "@mui/icons-material"

function safeParseDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return null;

    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);

    // Validar que sean números y estén en rango
    if (
        isNaN(day) || isNaN(month) || isNaN(year) ||
        day < 1 || day > 31 ||
        month < 1 || month > 12 ||
        year < 1900
    ) {
        return null;
    }

    const date = new Date(year, month - 1, day);

    // Validar que coincida con lo que vino
    if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
    ) {
        return null;
    }

    return date;
}

// Configuración de estados
const statusObj = {
    Recibido: {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        icon: CheckCircleIcon,
        label: "Recibido",
    },
    Pendiente: {
        color: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        icon: ScheduleIcon,
        label: "Pendiente",
    },
    Vencido: {
        color: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        icon: ErrorIcon,
        label: "Vencido",
    },
    Aprobado: {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        icon: CheckCircleIcon,
        label: "Aprobado",
    },
}

// Función para calcular días hasta vencimiento
const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null
    const today = new Date()
    const expDate = new Date(expirationDate)
    const diffTime = expDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

// Función para formatear fecha
const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}


// Función para obtener el tipo de documento
const getDocumentIcon = (documentName) => {
    const name = documentName?.toLowerCase() || ""
    if (name.includes("contrato") || name.includes("acuerdo")) {
        return "📄"
    }
    if (name.includes("certificado") || name.includes("diploma")) {
        return "🏆"
    }
    if (name.includes("licencia") || name.includes("permiso")) {
        return "📋"
    }
    if (name.includes("factura") || name.includes("recibo")) {
        return "🧾"
    }
    if (name.includes("reporte") || name.includes("informe")) {
        return "📊"
    }
    return "📄"
}

const renderUserAvatar = row => {
    if (row.avatarSrc) {
        return <CustomAvatar src={row.avatarSrc} sx={{ mr: 3, width: 30, height: 30 }} />
    } else {
        return (
            <CustomAvatar skin='light' sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem' }}>
                {getInitials(row.name ? row.name : 'John Doe')}
            </CustomAvatar>
        )
    }
}

export const columns_carperta_digital = (theme, handleOpenModal) => [
    {
        flex: 0.4,
        field: "new_name",
        minWidth: 280,
        headerName: "Documento",
        renderCell: ({ row }) => {
            const documentEmoji = getDocumentIcon(row.new_name)
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        py: 2,
                        px: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: { xs: 30, xl: 34 }, height: { xs: 30, xl: 34 },
                            backgroundColor: theme.palette.primary.main + "20",
                            border: `2px solid ${theme.palette.primary.main}30`,
                            mr: 2,
                            fontSize: { xs: 12, xl: 14 },
                            flexShrink: 0,
                        }}
                    >
                        {documentEmoji}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: { xs: 12, xl: 14 },
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {row.new_name}
                        </Typography>
                    </Box>
                </Box>
            )
        },
    },
    {
        flex: 0.25,
        minWidth: 140,
        maxWidth: 160,
        field: "statuscodeNOMBRE",
        headerName: "Estado",
        renderCell: ({ row }) => {
            const status = statusObj[row.statuscodeNOMBRE] || statusObj.Pendiente
            const StatusIcon = status.icon

            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        py: 2,
                    }}
                >
                    <Chip
                        icon={<StatusIcon sx={{ fontSize: "16px !important" }} />}
                        label={status.label}
                        size="small"
                        sx={{
                            backgroundColor: status.backgroundColor,
                            color: status.color,
                            border: `1px solid ${status.borderColor}`,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 32,
                            "& .MuiChip-icon": {
                                color: status.color,
                            },
                            "& .MuiChip-label": {
                                px: 1,
                                ml: 1
                            },
                        }}
                    />
                </Box>
            )
        },
    },
    {
        flex: 0.25,
        maxWidth: 200,
        field: "fechaVencimiento",
        headerName: "Vencimiento",
        valueGetter: ({ row }) => safeParseDate(row.new_fechadevencimiento),
        renderCell: ({ row }) => {
            const daysUntilExpiration = getDaysUntilExpiration(row.new_fechadevencimiento_value)
            const formattedDate = formatDate(row.new_fechadevencimiento_value)

            let urgencyColor = theme.palette.text.secondary
            let urgencyText = ""

            if (daysUntilExpiration !== null && !Number.isNaN(daysUntilExpiration)) {
                if (daysUntilExpiration < 0) {
                    urgencyColor = "#EF4444"
                    // urgencyText = `Vencido hace ${Math.abs(daysUntilExpiration)} días`
                    urgencyText = ''
                } else if (daysUntilExpiration <= 30) {
                    urgencyColor = "#F97316"
                    urgencyText = `Vence en ${daysUntilExpiration} días`
                } else {
                    urgencyColor = "#10B981"
                    urgencyText = `Vence en ${daysUntilExpiration} días`
                }
            }

            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        py: 2,
                        px: 1,
                    }}
                >
                    <CalendarIcon
                        sx={{
                            color: theme.palette.text.secondary,
                            mr: 1.5,
                            fontSize: 20,
                            flexShrink: 0,
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: "0.9rem",
                                lineHeight: 1.3,
                                mb: 0.5,
                            }}
                        >
                            {formattedDate}
                        </Typography>
                        {/* {urgencyText && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: urgencyColor,
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "block",
                                }}
                            >
                                {urgencyText}
                            </Typography>
                        )} */}
                    </Box>
                </Box>
            )
        },
    },
    {
        flex: 0.2,
        minWidth: 120,
        field: 'utilidades',
        headerName: 'Acciones',
        // header: '',
        // accessorKey: 'utilidades',
        minSize: 100, //min size enforced during resizing
        maxSize: 140, //max size enforced during resizing
        renderCell: ({ row }) => (
            row != null ? <Utilidades
                utilidad={row.utilidades}
                onOpenModal={(e) => {
                    e.stopPropagation();
                    handleOpenModal(row.utilidades);
                }}
            /> : '-'
        )
    }
]

// Definición de columnas mejoradas
export const columns_carperta_digital_inicio = (theme) => [
    {
        flex: 0.4,
        field: "new_name",
        minWidth: 280,
        headerName: "Documento",
        renderCell: ({ row }) => {
            const documentEmoji = getDocumentIcon(row.new_name)
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        py: 2,
                        px: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 44,
                            height: 44,
                            backgroundColor: theme.palette.primary.main + "20",
                            border: `2px solid ${theme.palette.primary.main}30`,
                            mr: 2,
                            // fontSize: "1.3rem",
                            flexShrink: 0,
                        }}
                    >
                        {documentEmoji}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: { xs: 12, xl: 14 },
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {row.new_name}
                        </Typography>
                    </Box>
                </Box>
            )
        },
    },
    {
        flex: 0.25,
        minWidth: 140,
        maxWidth: 160,
        field: "statuscodeNOMBRE",
        headerName: "Estado",
        renderCell: ({ row }) => {
            const status = statusObj[row.statuscodeNOMBRE] || statusObj.Pendiente
            const StatusIcon = status.icon

            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        py: 2,
                    }}
                >
                    <Chip
                        icon={<StatusIcon sx={{ fontSize: "16px !important" }} />}
                        label={status.label}
                        size="small"
                        sx={{
                            backgroundColor: status.backgroundColor,
                            color: status.color,
                            border: `1px solid ${status.borderColor}`,
                            fontWeight: 600,
                            fontSize: { xs: 12, xl: 14 },
                            height: 32,
                            "& .MuiChip-icon": {
                                color: status.color,
                            },
                            "& .MuiChip-label": {
                                px: 1,
                                ml: 1
                            },
                        }}
                    />
                </Box>
            )
        },
    },
    {
        flex: 0.25,
        minWidth: 200,
        field: "fechaVencimiento",
        headerName: "Vencimiento",
        valueGetter: ({ row }) => safeParseDate(row.new_fechadevencimiento),
        renderCell: ({ row }) => {
            const daysUntilExpiration = getDaysUntilExpiration(row.new_fechadevencimiento_value)
            const formattedDate = formatDate(row.new_fechadevencimiento_value)

            let urgencyColor = theme.palette.text.secondary
            let urgencyText = ""

            if (daysUntilExpiration !== null && !Number.isNaN(daysUntilExpiration)) {
                if (daysUntilExpiration < 0) {
                    urgencyColor = "#EF4444"
                    // urgencyText = `Vencido hace ${Math.abs(daysUntilExpiration)} días`
                    urgencyText = ''
                } else if (daysUntilExpiration <= 30) {
                    urgencyColor = "#F97316"
                    urgencyText = `Vence en ${daysUntilExpiration} días`
                } else {
                    urgencyColor = "#10B981"
                    urgencyText = `Vence en ${daysUntilExpiration} días`
                }
            }

            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        py: 2,
                        px: 1,
                    }}
                >
                    <CalendarIcon
                        sx={{
                            color: theme.palette.text.secondary,
                            mr: 1.5,
                            fontSize: { xs: 12, xl: 14 },
                            flexShrink: 0,
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                fontSize: { xs: 12, xl: 14 },
                                lineHeight: 1.3,
                                mb: 0.5,
                            }}
                        >
                            {formattedDate}
                        </Typography>
                        {urgencyText && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: urgencyColor,
                                    fontSize: { xs: 12, xl: 14 },
                                    fontWeight: 500,
                                    lineHeight: 1.2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "block",
                                }}
                            >
                                {urgencyText}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )
        },
    },
    // {
    //     flex: 0.15,
    //     minWidth: 140,
    //     field: "actions",
    //     headerName: "Acciones",
    //     sortable: false,
    //     renderCell: ({ row }) => (
    //         <Box
    //             sx={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //                 gap: 0.5,
    //                 height: "100%",
    //                 py: 2,
    //             }}
    //         >
    //             <Tooltip title="Ver documento">
    //                 <IconButton
    //                     size="small"
    //                     sx={{
    //                         color: theme.palette.primary.main,
    //                         width: 36,
    //                         height: 36,
    //                         "&:hover": {
    //                             backgroundColor: theme.palette.primary.main + "20",
    //                         },
    //                     }}
    //                 >
    //                     <ViewIcon fontSize="small" />
    //                 </IconButton>
    //             </Tooltip>
    //             <Tooltip title="Descargar">
    //                 <IconButton
    //                     size="small"
    //                     sx={{
    //                         color: theme.palette.success.main,
    //                         width: 36,
    //                         height: 36,
    //                         "&:hover": {
    //                             backgroundColor: theme.palette.success.main + "20",
    //                         },
    //                     }}
    //                 >
    //                     <DownloadIcon fontSize="small" />
    //                 </IconButton>
    //             </Tooltip>
    //             <Tooltip title="Editar">
    //                 <IconButton
    //                     size="small"
    //                     sx={{
    //                         color: theme.palette.warning.main,
    //                         width: 36,
    //                         height: 36,
    //                         "&:hover": {
    //                             backgroundColor: theme.palette.warning.main + "20",
    //                         },
    //                     }}
    //                 >
    //                     <EditIcon fontSize="small" />
    //                 </IconButton>
    //             </Tooltip>
    //         </Box>
    //     ),
    // },
]

// export const columns_carperta_digital_inicio = [
//     {
//         flex: 0.25,
//         field: 'new_name',
//         minWidth: 200,
//         headerName: 'Documento',
//         renderCell: ({ row }) => {
//             return (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {/* {renderUserAvatar(row)} */}
//                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                         <Typography
//                             sx={{
//                                 mb: -0.5,
//                                 fontWeight: 600,
//                                 lineHeight: 1.72,
//                                 fontSize: '0.875rem',
//                                 letterSpacing: '0.22px'
//                             }}
//                         >
//                             {row.new_name}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'statuscodeNOMBRE',
//         headerName: 'Estado',
//         renderCell: ({ row }) => (
//             <CustomChip
//                 skin='light'
//                 label={row.statuscodeNOMBRE}
//                 color={statusObj[row.statuscodeNOMBRE].color}
//                 sx={{
//                     height: 24,
//                     fontSize: '0.75rem',
//                     textTransform: 'capitalize',
//                     '& .MuiChip-label': { fontWeight: 600, lineHeight: 1.4 }
//                 }}
//             />
//         )
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'fechaVencimiento',
//         headerName: 'Fecha de Vencimiento',
//         renderCell: ({ row }) => {
//             return (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     {/* {renderUserAvatar(row)} */}
//                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                         <Typography
//                             sx={{
//                                 mb: -0.5,
//                                 fontWeight: 600,
//                                 lineHeight: 1.72,
//                                 fontSize: '0.875rem',
//                                 letterSpacing: '0.22px'
//                             }}
//                         >
//                             {row.new_fechadevencimiento}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     }
// ]