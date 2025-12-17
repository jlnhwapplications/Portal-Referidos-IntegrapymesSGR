import { Box, Typography, Chip, IconButton, Tooltip, Avatar, Stack, useTheme, alpha, Menu, MenuItem } from "@mui/material"
import { Visibility, Security, AccountBalance, TrendingUp, CalendarToday, AttachMoney } from "@mui/icons-material"
import Link from "next/link";
import { useDispatch } from "react-redux";
import Icon from 'src/@core/components/icon'
import React, { useContext, useState } from 'react'
import { AuthContext } from "@/context/AuthContext";

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

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
                <Tooltip title={value}>
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
                        {/* {account?.name?.length > 20 ? `${account.name.substr(0, 20)}...` : account.name} {value || "N/A"} */}
                        {value ? (value?.length > 20 ? `${value.substr(0, 20)}...` : value) : "N/A"}
                    </Typography>
                </ Tooltip>
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
function MoneyCell({ amount, currency = "Pesos Argentinos", subtitle = null }) {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"

    const formatCurrency = (amount, currency = "ARS") => {
        if (currency === "Dolares Americanos" || currency === "USD") {
            return new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
                .format(amount)
            // .replace("$", "U$S");
        }
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    };

    const getAmountColor = (amount) => {
        // if (!amount || amount === 0) return "text.secondary"
        // if (amount > 1000000) return isDark ? "#66bb6a" : "#2e7d32" // Verde para montos altos
        // if (amount > 100000) return isDark ? "#64b5f6" : "#1976d2" // Azul para montos medios
        return isDark ? "#66bb6a" : "#2e7d32" // Color normal para montos bajos
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

// Configuración de columnas mejorada
export const columns_lineas = [
    {
        flex: 0.12,
        field: "new_cuenta",
        minWidth: 240,
        maxWidth: 280,
        headerName: "Socio",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda
        renderCell: ({ row }) => (
            <EnhancedTextCell
                value={row?.new_cuenta}
                color="primary.main"
            />
        ),
    },
    {
        flex: 0.12,
        field: "new_lineatipodeoperacion_value",
        minWidth: 140,
        maxWidth: 200,
        headerName: "Tipo de Operación",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda
        renderCell: ({ row }) => (
            <EnhancedTextCell
                value={row?.new_lineatipodeoperacion_value}
                color="primary.main"
            />
        ),
    },
    {
        flex: 0.2,
        minWidth: 120,
        maxWidth: 180,
        field: "new_tipochpd_value",
        headerName: "Producto",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda
        renderCell: ({ row }) => (
            <EnhancedTextCell
                value={row?.new_tipochpd_value}
            />
        ),
    },
    {
        flex: 0.15,
        minWidth: 140,
        field: "new_topeporlineacomercial",
        headerName: "Tope por operación",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda
        valueGetter: ({ row }) => safeParseFloat(row?.new_topeporlineacomercial),
        renderCell: ({ row }) => <MoneyCell amount={row?.new_topeporlineacomercial}
            currency={row?.transactioncurrencyid}
            subtitle={row?.transactioncurrencyid} />,
    },
    {
        flex: 0.15,
        minWidth: 140,
        maxWidth: 180,
        field: ({ row }) => row?.new_lineatipodeoperacion == 100000000 ? "new_montodisponiblegeneralbruto" : "new_montodisponibleporoperacionbruto",
        headerName: "Monto disponible",
        type: "number",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda
        valueGetter: ({ row }) => row?.new_lineatipodeoperacion == 100000000 ? safeParseFloat(row?.new_montodisponiblegeneralbruto) : safeParseFloat(row?.new_montodisponibleporoperacionbruto),
        renderCell: ({ row }) => <MoneyCell amount={row?.new_lineatipodeoperacion == 100000000 ? row?.new_montodisponiblegeneralbruto : row?.new_montodisponibleporoperacionbruto}
            currency={row?.transactioncurrencyid}
            subtitle={row?.transactioncurrencyid} />,
    },
    {
        flex: 0.15,
        minWidth: 140,
        maxWidth: 180,
        field: ({ row }) => row?.new_lineatipodeoperacion == 100000000 ? "new_montoutilizadogeneralbruto" : "new_montoutilizadoporoperacionbruto",
        headerName: "Monto utilizado",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda}
        valueGetter: ({ row }) => row?.new_lineatipodeoperacion == 100000000 ? safeParseFloat(row?.new_montoutilizadogeneralbruto) : safeParseFloat(row?.new_montoutilizadoporoperacionbruto),
        renderCell: ({ row }) => <MoneyCell amount={row?.new_lineatipodeoperacion == 100000000 ? row?.new_montoutilizadogeneralbruto : row?.new_montoutilizadoporoperacionbruto}
            currency={row?.transactioncurrencyid}
            subtitle={row?.transactioncurrencyid} />,
    },
    {
        field: "transactioncurrencyid",
        headerName: "Divisa",
        hide: true, // Ocultamos en UI, pero se exporta gracias a allColumns en el toolbar
        valueGetter: ({ row }) => row?.transactioncurrencyid,
    },
    {
        flex: 0.17,
        minWidth: 160,
        field: "new_vigenciahasta",
        headerName: "Fecha Vencimiento",
        type: "date",
        align: "left",         // 👈 valores alineados a la izquierda
        headerAlign: "left",   // 👈 encabezado alineado a la izquierda
        valueGetter: ({ row }) => safeParseDate(row?.new_vigenciahasta),
        renderCell: ({ row }) => <EnhancedTextCell
            value={row?.new_vigenciahasta}
        />,
    },
]
