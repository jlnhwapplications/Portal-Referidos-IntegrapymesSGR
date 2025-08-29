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
import UtilidadesOP from "@/pages/views/operaciones/UtilidadesOP";

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
        handleRowOptionsClose();
    };

    return (
        <>
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

function safeParseInt(value, defaultValue = null) {
    if (value === null || value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

function safeParseFloat(value, defaultValue = null) {
    if (value === null || value === undefined) return defaultValue;

    // Convertir
    const parsed = parseFloat(value);

    // Si no es un número válido → devolver defaultValue
    return isNaN(parsed) ? defaultValue : parsed;
}

// Componente para celdas de texto mejoradas
function EnhancedTextCell({ value, subtitle = null, icon = null, color = "text.primary" }) {
  const theme = useTheme()

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
    // {
    //     flex: 0.2,
    //     minWidth: 160,
    //     field: "new_destinodefondo",
    //     headerName: "Destino de Fondo",
    //     renderCell: ({ row }) => (
    //         <TextCell value={row.new_destinodefondo} icon={TrendingUpIcon} subtitle="Asignación de recursos" />
    //     ),
    // },
    {
        flex: 0.15,
        minWidth: 140,
        field: "fechaCreacion_str",
        headerName: "Fecha de Creación",
        type: "date",
        valueGetter: ({ row }) => safeParseDate(row.fechaCreacion_str),
        renderCell: ({ row }) => <EnhancedTextCell
            value={row.fechaCreacion_str}
        />,
        // renderCell: ({ row }) => <DateCell date={row.fechaCreacion_str} />,
    },
]

// Columnas mejoradas para adjuntos de operaciones
export const columns_adjuntos_operaciones = [
    {
        flex: 0.3,
        field: "Documento",
        minWidth: 240,
        headerName: "Documento",
        renderCell: ({ row }) => (
            <TextCell value={row.new_name} icon={DescriptionIcon} subtitle="Archivo adjunto" fontWeight={600} />
        ),
    },
    {
        flex: 0.2,
        minWidth: 120,
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