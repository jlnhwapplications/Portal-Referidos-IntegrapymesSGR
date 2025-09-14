import { alpha, Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from "@mui/material"
import Link from "next/link";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import React, { useContext, useState } from 'react'
import { AuthContext } from "@/context/AuthContext";
import DescargarNota from "@/@core/components/table/DescargarNota";
import { AttachMoney } from "@mui/icons-material";

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
    if (!amount || amount === 0) return isDark ? "#66bb6a" : "#2e7d32"
    if (amount > 1000000) return isDark ? "#66bb6a" : "#2e7d32" // Verde para montos altos
    if (amount > 100000) return isDark ? "#66bb6a" : "#2e7d32" // Azul para montos medios
    return isDark ? "#66bb6a" : "#2e7d32"// Color normal para montos bajos
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

// Componente para celdas de texto mejoradas
function EnhancedTextCell({ value, subtitle = null, icon = null, color = "text.primary" }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
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

export const columns_comprobante_venta = [
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Nro. de Comprobante',
    headerName: 'Nro. de Comprobante',
    type: "number",
    align: "left",         // 👈 valores alineados a la izquierda
    headerAlign: "left",   // 👈 encabezado alineado a la izquierda
    valueGetter: ({ row }) => safeParseInt(row.new_nrocomprobante),
    renderCell: ({ row }) => (
      <EnhancedTextCell
        value={row.new_nrocomprobante}
        color="primary.main"
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Fecha',
    headerName: 'Fecha',
    type: "date",
    valueGetter: ({ row }) => safeParseDate(row.createdon),
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
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Tipo',
    headerName: 'Tipo',
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
              {row.new_TipodeComprobante}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Importe Total',
    headerName: 'Importe Total',
    type: "number",
    align: "left",         // 👈 valores alineados a la izquierda
    headerAlign: "left",   // 👈 encabezado alineado a la izquierda
    valueGetter: ({ row }) => safeParseFloat(row.new_total),
    renderCell: ({ row }) => <MoneyCell amount={row.new_total} currency="USD" subtitle="Valor de la factura" />,
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: 'Divisa',
    headerName: 'Divisa',
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
              {row.transactioncurrency}
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
