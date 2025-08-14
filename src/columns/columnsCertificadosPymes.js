// import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
// import Link from "next/link";
// import { useDispatch } from "react-redux";
// import Icon from 'src/@core/components/icon'
// import React, { useContext, useState } from 'react'
// import { AuthContext } from "@/context/AuthContext";
// import DescargarNota from "@/@core/components/table/DescargarNota";
// let dollarUS = Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
// });

// export const columns_certificados_pymes = [
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'Número de Registro',
//         headerName: 'Número de Registro',
//         renderCell: ({ row }) => {
//             return (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
//                             {row.new_numeroderegistro}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'Vigencia Desde',
//         headerName: 'Vigencia Desde',
//         renderCell: ({ row }) => {
//             return (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
//                             {row.new_vigenciadesde}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'Vigencia Hasta',
//         headerName: 'Vigencia Hasta',
//         renderCell: ({ row }) => {
//             return (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
//                             {row.new_vigenciahasta}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'Razón para el estado',
//         headerName: 'Razón para el estado',
//         renderCell: ({ row }) => {
//             return (
//                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
//                             {row.statuscode}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     }
// ]

import { Typography, IconButton, Tooltip, Stack, Chip, Box, Avatar } from "@mui/material"
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

// Componente para celdas de texto mejoradas
function EnhancedTextCell({ value, subtitle = null, icon = null, color = "text.primary", theme }) {

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
            {icon && (
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                    }}
                >
                    {icon}
                </Avatar>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: color,
                        lineHeight: 1.4,
                        fontSize: "0.875rem",
                        letterSpacing: "0.1px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value || "N/A"}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            lineHeight: 1.2,
                            fontSize: "0.75rem",
                            mt: 0.25,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

// Configuración de estados
const statusObj = {
    Aprobado: {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        icon: CheckCircleIcon,
        label: "Aprobado",
    },
    Pendiente: {
        color: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        icon: ScheduleIcon,
        label: "Pendiente",
    },
    Inactivo: {
        color: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        icon: ErrorIcon,
        label: "Vencido",
    },
}

// Componente para las opciones de fila (acciones)
const CertificateActions = ({ id, onView, onDownload }) => {
    return (
        <Stack direction="row" spacing={0.5}>
            <Tooltip title="Ver detalles" arrow>
                <IconButton
                    size="small"
                    onClick={() => onView?.(id)}
                    sx={{
                        color: "info.main",
                        "&:hover": {
                            backgroundColor: "rgba(0, 188, 212, 0.1)",
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    {/* <EyeIcon size={16} /> */}
                </IconButton>
            </Tooltip>
            <Tooltip title="Descargar" arrow>
                <IconButton
                    size="small"
                    onClick={() => onDownload?.(id)}
                    sx={{
                        color: "primary.main",
                        "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                    aria-label="Descargar certificado"
                >
                    {/* <DownloadIcon size={16} /> */}
                </IconButton>
            </Tooltip>
        </Stack>
    )
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

// Helper to get status chip color
const getStatusChipColor = (status) => {
    switch (status) {
        case "Activo":
            return "success"
        case "Vencido":
            return "error"
        case "Pendiente":
            return "warning"
        default:
            return "default"
    }
}

// Columnas para la tabla de certificados PYMES
export const columns_certificados_pymes = (theme) => [
    // {
    //     flex: 0.1,
    //     minWidth: 100,
    //     sortable: false,
    //     field: "actions",
    //     headerName: "Acciones",
    //     renderCell: ({ row }) => (
    //         <CertificateActions
    //             id={row.id}
    //             onView={(id) => console.log("Ver certificado:", id)}
    //             onDownload={(id) => console.log("Descargar certificado:", id)}
    //         />
    //     ),
    // },
    {
        flex: 0.2,
        minWidth: 150,
        field: "new_numeroderegistro",
        headerName: "Número de Registro",
        renderCell: ({ row }) => (
            <EnhancedTextCell
                value={row.new_numeroderegistro}
                // subtitle="Número de identificación"
                // icon={<Security fontSize="small" />}
                color="primary.main"
                theme={theme}
            />
            // <Typography
            //     sx={{
            //         fontWeight: 600,
            //         color: theme.palette.text.primary,
            //         fontSize: { xs: 12, xl: 14 },
            //         lineHeight: 1.4,
            //         overflow: "hidden",
            //         textOverflow: "ellipsis",
            //         whiteSpace: "nowrap",
            //     }}
            // >
            //     {row.new_numeroderegistro}
            // </Typography>
        ),
    },
    {
        flex: 0.2,
        minWidth: 150,
        field: "new_vigenciadesde",
        headerName: "Vigencia Desde",
        renderCell: ({ row }) => {
            // const daysUntilExpiration = getDaysUntilExpiration(row.new_fechadevencimiento_value)
            const formattedDate = formatDate(row.new_vigenciadesde)

            // let urgencyColor = theme.palette.text.secondary
            // let urgencyText = ""

            // if (daysUntilExpiration !== null) {
            //     if (daysUntilExpiration < 0) {
            //         urgencyColor = "#EF4444"
            //         urgencyText = `Vencido hace ${Math.abs(daysUntilExpiration)} días`
            //     } else if (daysUntilExpiration <= 30) {
            //         urgencyColor = "#F97316"
            //         urgencyText = `Vence en ${daysUntilExpiration} días`
            //     } else {
            //         urgencyColor = "#10B981"
            //         urgencyText = `Vence en ${daysUntilExpiration} días`
            //     }
            // }

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
                        {row.new_vigenciadesde ? row.new_vigenciadesde : "N/A"}
                    </Typography>
                    {/* <CalendarIcon
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
                            {urgencyText && (
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
                            )}
                        </Box> */}
                </Box>
            )
        },
    },
    {
        flex: 0.2,
        minWidth: 150,
        field: "new_vigenciahasta",
        headerName: "Vigencia Hasta",
        renderCell: ({ row }) => {
            // const daysUntilExpiration = getDaysUntilExpiration(row.new_fechadevencimiento_value)
            const formattedDate = formatDate(row.new_vigenciahasta)

            // let urgencyColor = theme.palette.text.secondary
            // let urgencyText = ""

            // if (daysUntilExpiration !== null) {
            //     if (daysUntilExpiration < 0) {
            //         urgencyColor = "#EF4444"
            //         urgencyText = `Vencido hace ${Math.abs(daysUntilExpiration)} días`
            //     } else if (daysUntilExpiration <= 30) {
            //         urgencyColor = "#F97316"
            //         urgencyText = `Vence en ${daysUntilExpiration} días`
            //     } else {
            //         urgencyColor = "#10B981"
            //         urgencyText = `Vence en ${daysUntilExpiration} días`
            //     }
            // }

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
                        {row.new_vigenciahasta ? row.new_vigenciahasta : "N/A"}
                    </Typography>
                    {/* <CalendarIcon
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
                            {urgencyText && (
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
                            )}
                        </Box> */}
                </Box>
            )
        },
    },
    {
        flex: 0.2,
        minWidth: 150,
        field: "statuscode",
        headerName: "Razón para el estado",
        renderCell: ({ row }) => {
            const status = statusObj[row.statuscode] || statusObj.Inactivo
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
        // renderCell: ({ row }) => (
        //     // const status = statusObj[row.statuscodeNOMBRE] || statusObj.Pendiente

        //     <Chip label={row.statuscode} color={getStatusChipColor(row.statuscode)} size="small" sx={{ fontWeight: 600 }} />
        // ),
    },
]
