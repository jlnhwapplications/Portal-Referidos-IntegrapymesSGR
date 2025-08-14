// import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import Link from "next/link";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import React, { useContext, useState } from 'react'
import { AuthContext } from "@/context/AuthContext";
import CustomChip from 'src/@core/components/mui/chip'
import DescargarNota from "@/@core/components/table/DescargarNota";
import { Box, Typography, Chip, IconButton, Tooltip, Avatar, Stack, useTheme, alpha, Menu, MenuItem } from "@mui/material"
import {
    Visibility as VisibilityIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    TrendingUp as TrendingUpIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    AccountBalance as AccountBalanceIcon,
    AttachMoney as AttachMoneyIcon,
    Description as DescriptionIcon,
    CalendarToday as CalendarTodayIcon,
    Assignment as AssignmentIcon,
    CreditCard as CreditCardIcon,
    Done as DoneIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Build as BuildIcon,
    MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material"
// import UtilidadesOP from "@/pages/views/operaciones/UtilidadesOP";

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const RowOptions = ({ id }) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const dispatch = useDispatch();
    const { token } = useContext(AuthContext);

    const handleRowOptionsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRowOptionsClose = () => {
        setAnchorEl(null);
    };

    const deleteRow = () => {
        // dispatch(deleteCurso(token, id))
        //   .then((id) => {
        //     dispatch(fetchCursosE(token));
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });
        handleRowOptionsClose();
    };

    return (
        <>
            {/* <Tooltip title='Eliminar'>
            <IconButton size="small" onClick={handleRowOptionsClick}>
              <Icon icon="mdi:trash-can-outline" fontSize={20} style={{ color: "red" }} />
            </IconButton>
          </Tooltip> */}
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={rowOptionsOpen}
                onClose={handleRowOptionsClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                PaperProps={{ style: { minWidth: "8rem" } }}
            >
                <MenuItem onClick={deleteRow} sx={{ "& svg": { mr: 2 } }}>
                    <Icon icon="mingcute:alert-fill" fontSize={20} style={{ color: "red" }} />
                    Desea eliminar este registro ?
                </MenuItem>
            </Menu>
        </>
    );
};

const roleObj = {
    author: {
        color: 'success',
        icon: <Icon icon='mdi:cog' />
    },
    maintainer: {
        color: 'primary',
        icon: <Icon icon='mdi:chart-pie' />
    },
    editor: {
        color: 'info',
        icon: <Icon icon='mdi:pencil' />
    },
    subscriber: {
        color: 'warning',
        icon: <Icon icon='mdi:account-outline' />
    }
}

const statusObj = {
    Enviada: { color: 'success' },
    Pendiente: { color: 'warning' },
    Instrumentada: { color: 'secondary' },
    Monetizada: { color: 'primary' },
}

const statusAdjuntosOP = {
    Recibido: { color: 'success' },
    Pendiente: { color: 'warning' },
    // Instrumentada: { color: 'secondary' },
    Aprobado: { color: 'primary' },
}

// export const COLUMNSGOPERACIONES = [
//     {
//         flex: 0.25,
//         field: 'new_tipodeoperacion',
//         minWidth: 100,
//         headerName: 'Tipo de Operación',
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
//                             {row.new_tipodeoperacion}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'new_acreedor',
//         headerName: 'Acreedor',
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
//                             {row.new_acreedor}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'statuscode_value',
//         headerName: 'Estado',
//         renderCell: ({ row }) => (
//             <CustomChip
//                 skin='light'
//                 label={row.statuscode_value}
//     //             color={statusObj[row.statuscode_value].color}
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
//         field: 'createdon',
//         headerName: 'Destino de Fondo',
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
//                             {row.createdon}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'new_monto',
//         headerName: 'Monto Bruto',
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
//                             {row.new_monto}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     }
// ]


// export const columns_operaciones = [
//     {
//         flex: 0.1,
//         minWidth: 130,
//         sortable: false,
//         field: 'actions',
//         headerName: 'Acciones',
//         renderCell: ({ row }) => (
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Tooltip title='Ver'>
//                     <IconButton size='small' component={Link} href={`/operaciones/${row.id}`}>
//                         <Icon icon='mdi:eye-outline' fontSize={24} />
//                     </IconButton>
//                 </Tooltip>
//                 <RowOptions id={row.id} />
//             </Box>
//         )
//     },
//     {
//         flex: 0.25,
//         field: 'new_nrooperacion',
//         minWidth: 100,
//         headerName: 'Nro. de Orden',
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
//                             {row.new_nrooperacion}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'new_tipooperacin',
//         headerName: 'Tipo de Operación',
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
//                             {row.new_tipooperacin}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'statuscode',
//         headerName: 'Estado',
//         renderCell: ({ row }) => (
//             <CustomChip
//                 skin='light'
//                 label={row.statuscode}
//                 color={statusObj[row.statuscode].color}
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
//         field: 'new_destinodefondo',
//         headerName: 'Destino de Fondo',
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
//                             {row.new_destinodefondo}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'fechaCreacion_str',
//         headerName: 'Fecha de Creación',
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
//                             {row.fechaCreacion_str}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     }
// ]

// export const columns_adjuntos_operaciones = [
//     {
//         flex: 0.25,
//         field: 'Documento',
//         minWidth: 100,
//         headerName: 'Documento',
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
//         field: 'statuscode',
//         headerName: 'Estado',
//         renderCell: ({ row }) => (
//             <CustomChip
//                 skin='light'
//                 label={row.statuscode}
//                 color={statusAdjuntosOP[row.statuscode]?.color}
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
//         field: 'Fecha de Vencimiento',
//         headerName: 'Fecha de Vencimiento',
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
//                             {row.new_fechadevencimiento}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.2,
//         minWidth: 120,
//         field: 'utilidades',
//         headerName: 'Acciones',
//         // header: '',
//         // accessorKey: 'utilidades',
//         minSize: 100, //min size enforced during resizing
//         maxSize: 140, //max size enforced during resizing
//         renderCell: ({ row }) => (
//             row != null ? <UtilidadesOP utilidad={row.utilidades} /> : '-'
//         )
//     }
// ]


const statusConfig = {
    Enviada: {
        color: "#10B981",
        icon: CheckCircleIcon,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        textColor: "#2e7d32",
        label: "Enviada",
    },
    Pendiente: {
        color: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        // color: "warning",
        icon: HourglassEmptyIcon,
        // bgColor: "#fff3e0",
        textColor: "#f57c00",
        label: "Pendiente",
    },
    Instrumentada: {
        color: "#EF4444",
        icon: BuildIcon,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        textColor: "#1976d2",
        label: "Instrumentada",
    },
    Monetizada: {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        icon: MonetizationOnIcon,
        // bgColor: "#f3e5f5",
        textColor: "#7b1fa2",
        label: "Monetizada",
    },
}

const statusAdjuntosConfig = {
    Recibido: {
        color: "success",
        icon: CheckCircleIcon,
        bgColor: "#e8f5e8",
        textColor: "#2e7d32",
        label: "Recibido",
    },
    Pendiente: {
        color: "warning",
        icon: PendingIcon,
        bgColor: "#fff3e0",
        textColor: "#f57c00",
        label: "Pendiente",
    },
    Aprobado: {
        color: "primary",
        icon: DoneIcon,
        bgColor: "#e3f2fd",
        textColor: "#1976d2",
        label: "Aprobado",
    },
}

// Componente reutilizable para celdas de texto
const TextCell = ({ value, subtitle, icon: Icon, fontWeight = 600 }) => {
    const theme = useTheme()

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
            {Icon && (
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                    }}
                >
                    <Icon sx={{ fontSize: 16 }} />
                </Avatar>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        fontWeight,
                        lineHeight: 1.4,
                        fontSize: "0.875rem",
                        letterSpacing: "0.15px",
                        color: theme.palette.text.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value || "-"}
                </Typography>
                {subtitle && (
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            color: theme.palette.text.secondary,
                            lineHeight: 1.2,
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

// Componente para chips de estado mejorados
const StatusChip = ({ status, config }) => {
    const theme = useTheme()
    const statusInfo = config[status] || config.Pendiente
    const StatusIcon = statusInfo.icon

    return (
        <Chip
            icon={<StatusIcon sx={{ fontSize: "16px !important" }} />}
            label={statusInfo.label}
            sx={{
                height: 32,
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: statusInfo.bgColor,
                color: statusInfo.textColor,
                border: `1px solid ${alpha(statusInfo.textColor, 0.2)}`,
                "& .MuiChip-icon": {
                    color: statusInfo.textColor,
                    marginLeft: "8px",
                },
                "& .MuiChip-label": {
                    paddingLeft: "4px",
                    paddingRight: "12px",
                    ml: 2
                },
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 8px ${alpha(statusInfo.textColor, 0.2)}`,
                },
            }}
        />
    )
}

// Componente para mostrar montos
const MoneyCell = ({ amount, currency = "$" }) => {
    const theme = useTheme()
    const formattedAmount = typeof amount === "number" ? amount.toLocaleString() : amount

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
                sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                }}
            >
                <AttachMoneyIcon sx={{ fontSize: 14 }} />
            </Avatar>
            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: theme.palette.success.main,
                    fontFamily: "monospace",
                }}
            >
                {currency}
                {formattedAmount}
            </Typography>
        </Box>
    )
}

// Componente para fechas
const DateCell = ({ dateString, icon: Icon = CalendarTodayIcon }) => {
    const theme = useTheme()
    const date = new Date(dateString)
    let formattedDate = "N/A"

    if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString("es-AR")
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography
                sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                }}
            >
                {formattedDate}
            </Typography>
        </Box>
    )
}

// Componente para acciones mejorado
const ActionCell = ({ row, onView, onEdit, onDelete }) => {
    const theme = useTheme()

    return (
        <Stack direction="row" spacing={0.5}>
            <Tooltip title="Ver detalles" arrow>
                <IconButton
                    size='small' component={Link}
                    href={`/operaciones/${row.id}`}
                    sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.info.main, 0.2),
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}

// Columnas mejoradas para GOPERACIONES
export const COLUMNSGOPERACIONES = [
    {
        flex: 0.25,
        field: "new_tipodeoperacion",
        minWidth: 180,
        headerName: "Tipo de Operación",
        renderCell: ({ row }) => (
            <TextCell value={row.new_tipodeoperacion} icon={BusinessIcon} subtitle="Operación comercial" />
        ),
    },
    {
        flex: 0.2,
        minWidth: 160,
        field: "new_acreedor",
        headerName: "Acreedor",
        renderCell: ({ row }) => <TextCell value={row.new_acreedor} icon={PersonIcon} subtitle="Entidad acreedora" />,
    },
    {
        flex: 0.15,
        minWidth: 140,
        field: "statuscode_value",
        headerName: "Estado",
        renderCell: ({ row }) => <StatusChip status={row.statuscode_value} config={statusConfig} />,
    },
    {
        flex: 0.2,
        minWidth: 160,
        field: "createdon",
        headerName: "Destino de Fondo",
        renderCell: ({ row }) => <TextCell value={row.createdon} icon={AccountBalanceIcon} subtitle="Destino asignado" />,
    },
    {
        flex: 0.2,
        minWidth: 140,
        field: "new_monto",
        headerName: "Monto Bruto",
        renderCell: ({ row }) => <MoneyCell amount={row.new_monto} />,
    },
]

// Columnas mejoradas para operaciones
export const columns_operaciones = [
    {
        flex: 0.1,
        minWidth: 100,
        sortable: false,
        field: "actions",
        headerName: "Acciones",
        renderCell: ({ row }) => <ActionCell row={row} onView={(row) => console.log("Ver:", row)} />,
    },
    {
        flex: 0.2,
        field: "new_nrooperacion",
        minWidth: 150,
        headerName: "Nro. de Orden",
        renderCell: ({ row }) => (
            <TextCell value={row.new_nrooperacion} icon={AssignmentIcon} subtitle="Número único" fontWeight={700} />
        ),
    },
    {
        flex: 0.25,
        minWidth: 180,
        field: "new_tipooperacin",
        headerName: "Tipo de Operación",
        renderCell: ({ row }) => (
            <TextCell value={row.new_tipooperacin} icon={CreditCardIcon} subtitle="Categoría de operación" />
        ),
    },
    {
        flex: 0.15,
        minWidth: 140,
        field: "statuscode",
        headerName: "Estado",
        renderCell: ({ row }) => <StatusChip status={row.statuscode} config={statusConfig} />,
    },
    {
        flex: 0.2,
        minWidth: 160,
        field: "new_destinodefondo",
        headerName: "Destino de Fondo",
        renderCell: ({ row }) => (
            <TextCell value={row.new_destinodefondo} icon={TrendingUpIcon} subtitle="Asignación de recursos" />
        ),
    },
    {
        flex: 0.15,
        minWidth: 140,
        field: "fechaCreacion_str",
        headerName: "Fecha de Creación",
        renderCell: ({ row }) => <DateCell date={row.fechaCreacion_str} />,
    },
]

// Columnas mejoradas para adjuntos de operaciones
export const columns_adjuntos_operaciones = [
    {
        flex: 0.3,
        field: "Documento",
        minWidth: 200,
        headerName: "Documento",
        renderCell: ({ row }) => (
            <TextCell value={row.new_name} icon={DescriptionIcon} subtitle="Archivo adjunto" fontWeight={600} />
        ),
    },
    {
        flex: 0.2,
        minWidth: 140,
        field: "statuscode",
        headerName: "Estado",
        renderCell: ({ row }) => <StatusChip status={row.statuscode} config={statusAdjuntosConfig} />,
    },
    {
        flex: 0.25,
        minWidth: 160,
        field: "new_fechadevencimiento",
        headerName: "Fecha de Vencimiento",
        renderCell: ({ row }) => <DateCell date={row.new_fechadevencimiento} icon={ScheduleIcon} />,
    },
    {
        flex: 0.25,
        minWidth: 140,
        field: "utilidades",
        headerName: "Acciones",
        renderCell: ({ row }) => (row != null ? <UtilidadesOP utilidad={row.utilidades} /> : "-"),
    },
]

// Componente UtilidadesOP mejorado (placeholder)
const UtilidadesOP = ({ utilidad }) => {
    const theme = useTheme()

    return (
        <Stack direction="row" spacing={0.5}>
            <Tooltip title="Descargar" arrow>
                <IconButton
                    size="small"
                    sx={{
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.success.main, 0.2),
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}