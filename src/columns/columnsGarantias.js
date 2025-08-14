import { Box, Typography, Chip, IconButton, Tooltip, Avatar, Stack, useTheme, alpha, Menu, MenuItem } from "@mui/material"
import { Visibility, Security, AccountBalance, TrendingUp, CalendarToday, AttachMoney } from "@mui/icons-material"
import Link from "next/link";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import React, { useContext, useState } from 'react'
import { AuthContext } from "@/context/AuthContext";
import DescargarNota from "@/@core/components/table/DescargarNota";

let dollarUS = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

// Componente para chips de estado mejorados
function StatusChip({ status, variant = "filled" }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || ""

    if (statusLower.includes("activ") || statusLower.includes("vigente") || statusLower.includes("aprobad") || statusLower.includes("gesti")) {
      return {
        color: "success",
        icon: "✓",
        bgcolor: isDark ? alpha("#4caf50", 0.2) : alpha("#4caf50", 0.1),
        textColor: isDark ? "#66bb6a" : "#2e7d32",
      }
    }

    if (statusLower.includes("pendiente") || statusLower.includes("revision") || statusLower.includes("proceso")) {
      return {
        color: "warning",
        icon: "⏳",
        bgcolor: isDark ? alpha("#ff9800", 0.2) : alpha("#ff9800", 0.1),
        textColor: isDark ? "#ffb74d" : "#f57c00",
      }
    }

    if (statusLower.includes("vencid") || statusLower.includes("cancelad") || statusLower.includes("rechazad") || statusLower.includes("anul")) {
      return {
        color: "error",
        icon: "✕",
        bgcolor: isDark ? alpha("#f44336", 0.2) : alpha("#f44336", 0.1),
        textColor: isDark ? "#ef5350" : "#d32f2f",
      }
    }

    if (statusLower.includes("suspendid") || statusLower.includes("pausad")) {
      return {
        color: "info",
        icon: "⏸",
        bgcolor: isDark ? alpha("#2196f3", 0.2) : alpha("#2196f3", 0.1),
        textColor: isDark ? "#64b5f6" : "#1976d2",
      }
    }

    return {
      color: "default",
      icon: "●",
      bgcolor: isDark ? alpha("#9e9e9e", 0.2) : alpha("#9e9e9e", 0.1),
      textColor: isDark ? "#bdbdbd" : "#616161",
    }
  }

  const config = getStatusConfig(status)

  return (
    <Chip
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography component="span" sx={{ fontSize: "0.7rem" }}>
            {config.icon}
          </Typography>
          <Typography component="span" sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
            {status || "Sin Estado"}
          </Typography>
        </Box>
      }
      variant={variant}
      sx={{
        height: 28,
        bgcolor: config.bgcolor,
        color: config.textColor,
        border: `1px solid ${alpha(config.textColor, 0.3)}`,
        fontWeight: 600,
        textTransform: "capitalize",
        boxShadow: `0 2px 8px ${alpha(config.textColor, 0.2)}`,
        "& .MuiChip-label": {
          px: 1.5,
          py: 0.5,
        },
      }}
    />
  )
}

// Componente para mostrar montos formateados
function MoneyCell({ amount, currency = "USD", subtitle = null }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const formatCurrency = (amount, currency) => {
    if (!amount && amount !== 0) return "N/A"

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    return formatter.format(amount)
  }

  const getAmountColor = (amount) => {
    if (!amount || amount === 0) return "text.secondary"
    if (amount > 1000000) return isDark ? "#66bb6a" : "#2e7d32" // Verde para montos altos
    if (amount > 100000) return isDark ? "#64b5f6" : "#1976d2" // Azul para montos medios
    return "text.primary" // Color normal para montos bajos
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: "success.main",
        }}
      >
        <AttachMoney fontSize="small" />
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: getAmountColor(amount),
            lineHeight: 1.4,
            fontSize: "0.875rem",
            fontFamily: "monospace",
          }}
        >
          {formatCurrency(amount, currency)}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

// Componente para fechas mejorado
function DateCell({ date, format = "short" }) {
  const theme = useTheme()

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let formattedDate = "N/A"
      let subtitle = ""

      if (!isNaN(date.getTime())) {
        if (format === "short") {
          formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        } else {
          formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        }

        if (diffDays === 0) {
          subtitle = "Hoy"
        } else if (diffDays === 1) {
          subtitle = "Ayer"
        } else if (diffDays < 30) {
          subtitle = `Hace ${diffDays} días`
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30)
          subtitle = `Hace ${months} ${months === 1 ? "mes" : "meses"}`
        }
      }


      return { formattedDate }
    } catch (error) {
      return { formattedDate: "Fecha inválida", subtitle: "" }
    }
  }

  const { formattedDate, subtitle } = formatDate(date)

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          color: "info.main",
        }}
      >
        <CalendarToday fontSize="small" />
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.4,
            fontSize: "0.875rem",
          }}
        >
          {formattedDate}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

// Componente de acciones mejorado
function ActionsCell({ row }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title="Ver Detalles" arrow placement="top">
        <IconButton
          size="small"
          component={Link}
          href={`/garantias/${row.id}`}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              transform: "scale(1.1)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Más Opciones" arrow placement="top">
        <Box>
          <RowOptions id={row.id} />
        </Box>
      </Tooltip>
    </Stack>
  )
}

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

// Configuración de columnas mejorada
export const columns_garantias_mejoradas = [
  {
    flex: 0.12,
    maxWidth: 140,
    sortable: false,
    field: "actions",
    headerName: "Acciones",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <ActionsCell row={row} />,
  },
  {
    flex: 0.12,
    field: "new_ndeordendelagarantiaotorgada",
    minWidth: 140,
    headerName: "Nro de Orden",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_ndeordendelagarantiaotorgada}
        // subtitle="Número de identificación"
        // icon={<Security fontSize="small" />}
        color="primary.main"
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: "new_tipodeoperacion",
    headerName: "Tipo de Operación",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_tipodeoperacion}
      // subtitle="Categoría de garantía"
      // icon={<TrendingUp fontSize="small" />}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: "new_acreedor",
    headerName: "Acreedor",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_acreedor}
        subtitle="Entidad acreedora"
        icon={<AccountBalance fontSize="small" />}
      />
    ),
  },
  {
    flex: 0.15,
    minWidth: 140,
    field: "statuscode_value",
    headerName: "Estado",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <StatusChip status={row.statuscode_value} />,
  },
  {
    flex: 0.18,
    minWidth: 160,
    field: "new_monto",
    headerName: "Monto",
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => <MoneyCell amount={row.new_monto} currency="USD" subtitle="Valor de la garantía" />,
  },
  {
    flex: 0.17,
    minWidth: 160,
    field: "createdon",
    headerName: "Fecha de Creación",
    renderCell: ({ row }) => <DateCell date={row.createdon} format="short" />,
  },
]

// Configuración de columnas mejorada
export const columns_garantias_mejoradas_estado = [
  {
    flex: 0.12,
    maxWidth: 140,
    sortable: false,
    field: "actions",
    headerName: "Acciones",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <ActionsCell row={row} />,
  },
  {
    flex: 0.12,
    field: "new_ndeordendelagarantiaotorgada",
    minWidth: 140,
    headerName: "Nro de Orden",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_ndeordendelagarantiaotorgada}
        // subtitle="Número de identificación"
        // icon={<Security fontSize="small" />}
        color="primary.main"
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: "new_tipodeoperacion",
    headerName: "Tipo de Operación",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_tipodeoperacion}
      // subtitle="Categoría de garantía"
      // icon={<TrendingUp fontSize="small" />}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: "new_acreedor",
    headerName: "Acreedor",
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_acreedor}
        subtitle="Entidad acreedora"
        icon={<AccountBalance fontSize="small" />}
      />
    ),
  },
  {
    flex: 0.18,
    minWidth: 160,
    field: "new_monto",
    headerName: "Monto",
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => <MoneyCell amount={row.new_monto} currency="USD" subtitle="Valor de la garantía" />,
  },
  {
    flex: 0.17,
    minWidth: 160,
    field: "createdon",
    headerName: "Fecha de Creación",
    renderCell: ({ row }) => <DateCell date={row.createdon} format="short" />,
  },
]

export const columns_garantias = [
  {
    flex: 0.1,
    maxWidth: 120,
    sortable: false,
    field: 'actions',
    headerName: 'Acciones',
    renderCell: ({ row }) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title='Ver'>
          <IconButton size='small' component={Link} href={`/garantias/${row.id}`}>
            <Icon icon='mdi:eye-outline' fontSize={24} />
          </IconButton>
        </Tooltip>
        <RowOptions id={row.id} />
      </Box>
    )
  },
  {
    flex: 0.25,
    field: 'new_ndeordendelagarantiaotorgada',
    maxWidth: 140,
    headerName: 'Nro de Orden',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.new_ndeordendelagarantiaotorgada}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'new_tipodeoperacion',
    headerName: 'Tipo de Operacion',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.new_tipodeoperacion}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'new_acreedor',
    headerName: 'Acreedor',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.new_acreedor}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'statuscode_value',
    headerName: 'Estado',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.statuscode_value}
            </Typography>
          </Box>
        </Box>
      )
    }
    // renderCell: ({ row }) => (
    //   <CustomChip
    //     skin='light'
    //     label={row.statuscode_value}
    //     color={statusObj[row.statuscode_value].color}
    //     sx={{
    //       height: 24,
    //       fontSize: '0.75rem',
    //       textTransform: 'capitalize',
    //       '& .MuiChip-label': { fontWeight: 600, lineHeight: 1.4 }
    //     }}
    //   />
    // )
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'new_monto',
    headerName: 'Monto',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {dollarUS.format(row.new_monto)}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'createdon',
    headerName: 'Fecha de Creacion',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.createdon}
            </Typography>
          </Box>
        </Box>
      )
    }
  }
]

export const columns_adjuntos_garantias = [
  {
    flex: 0.2,
    minWidth: 120,
    field: 'filename',
    headerName: 'Archivo',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                mb: -0.5,
                fontWeight: 600,
                lineHeight: 1.72,
                fontSize: '0.875rem',
                letterSpacing: '0.22px'
              }}
            >
              {row.filename}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Acciones',
    headerName: 'Acciones',
    renderCell: ({ row }) => {
      return (
        <DescargarNota value={row.annotationid} />
      )
    }
  }
]