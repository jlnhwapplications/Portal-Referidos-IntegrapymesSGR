"use client"

import { useState, useEffect } from "react"
import { Tab, Paper, Box, Typography, Badge, useTheme, alpha } from "@mui/material"
import {
    Security,
    CheckCircle,
    AccountBalance,
    Build,
    Warning,
    Shield,
    CloudUpload,
    Assignment,
} from "@mui/icons-material"
import { TabList, TabContext } from "@mui/lab";
import { useMediaQuery } from '@mui/material';
// Componente de Tab Panel con animaciones
function TabPanel({ children, value, index, ...other }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (value === index) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 100)
            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [value, index])

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`garantias-tabpanel-${index}`}
            aria-labelledby={`garantias-tab-${index}`}
            sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </Box>
    )
}

// Componente principal de tabs mejorados
export default function GarantiasTabs({ activeTab, handleChangeTabs, garantiasCounts = {}, children }) {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const ishightScreen = useMediaQuery('(min-width:1280px) and (max-width:1920px)');
    // Configuración de tabs con iconos y contadores
    const tabsConfig = [
        {
            value: 0,
            label: "Todas Garantías",
            icon: <Security fontSize="small" />,
            count: garantiasCounts.total || 0,
            description: "Vista completa",
        },
        {
            value: 3,
            label: "Vigentes",
            icon: <CheckCircle fontSize="small" />,
            count: garantiasCounts.vigentes || 0,
            description: "Activas y válidas",
        },
        {
            value: 1,
            label: "En Cartera",
            icon: <AccountBalance fontSize="small" />,
            count: garantiasCounts.cartera || 0,
            description: "En portafolio",
        },
        {
            value: 2,
            label: "En Gestión",
            icon: <Build fontSize="small" />,
            count: garantiasCounts.gestion || 0,
            description: "En proceso",
        },
        {
            value: 4,
            label: "Vencidas",
            icon: <Warning fontSize="small" />,
            count: garantiasCounts.vencidas || 0,
            description: "Fuera de vigencia",
        },
        {
            value: 5,
            label: "Afrontadas",
            icon: <Shield fontSize="small" />,
            count: garantiasCounts.afrontadas || 0,
            description: "Ejecutadas",
        },
        {
            value: 6,
            label: "Carga Masiva",
            icon: <CloudUpload fontSize="small" />,
            count: garantiasCounts.cargaMasiva || 0,
            description: "Cheques masivos",
        },
    ]

    return (
        <>
            {/* Contenedor de tabs mejorado */}
            <Paper
                elevation={isDark ? 6 : 4}
                sx={{
                    bgcolor: theme.palette.background,
                    border: isDark ? `1px solid ${theme.palette.border}` : "none",
                    borderRadius: 3,
                    overflow: "hidden",
                    mb: 2,
                }}
            >
                <TabContext value={activeTab}>
                    <TabList
                        value={activeTab}
                        onChange={handleChangeTabs}
                        scrollButtons="auto"
                        variant={ishightScreen ? 'scrollable' : 'fullWidth'}
                        centered={ishightScreen ? false : true}
                        allowScrollButtonsMobile
                        aria-label="Garantías Tabs"
                        sx={{
                            minHeight: { xs: 56, sm: 64, md: 72 },
                            "& .MuiTabs-flexContainer": {
                                height: "100%",
                            },
                            "& .MuiTab-root": {
                                fontWeight: "bold",
                                textTransform: "none",
                                fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
                                minHeight: { xs: 56, sm: 64, md: 72 },
                                px: { xs: 2, sm: 3, md: 4 },
                                py: { xs: 1.5, sm: 2, md: 2.5 },
                                color: isDark ? "#b0b0b0" : "text.secondary",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                overflow: "hidden",
                                minWidth: { xs: 120, sm: 140, md: 160 },
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: isDark
                                        ? "linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)"
                                        : "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                },
                                "&:hover": {
                                    color: isDark ? "#90caf9" : "primary.main",
                                    transform: "translateY(-2px)",
                                    "&::before": {
                                        opacity: 1,
                                    },
                                },
                                "&.Mui-selected": {
                                    color: isDark ? "#64b5f6" : "primary.main",
                                    fontWeight: "black",
                                    background: isDark
                                        ? "linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(66, 165, 245, 0.1) 100%)"
                                        : "linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)",
                                    boxShadow: isDark
                                        ? "inset 0 2px 8px rgba(100, 181, 246, 0.2)"
                                        : "inset 0 2px 8px rgba(25, 118, 210, 0.1)",
                                    "&::before": {
                                        opacity: 1,
                                    },
                                },
                            },
                            "& .MuiTabs-indicator": {
                                backgroundColor: isDark ? "#64b5f6" : "primary.main",
                                height: 4,
                                borderRadius: "2px 2px 0 0",
                                background: isDark
                                    ? "linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%)"
                                    : "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
                                boxShadow: isDark ? "0 0 12px rgba(100, 181, 246, 0.6)" : "0 0 12px rgba(25, 118, 210, 0.4)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            },
                            "& .MuiTabs-scrollButtons": {
                                color: isDark ? "#b0b0b0" : "text.secondary",
                                "&:hover": {
                                    color: isDark ? "#90caf9" : "primary.main",
                                    bgcolor: isDark ? "rgba(100, 181, 246, 0.1)" : "rgba(25, 118, 210, 0.05)",
                                },
                                "&.Mui-disabled": {
                                    opacity: 0.3,
                                },
                            },
                        }}
                    >
                        {tabsConfig.map((tab) => (
                            <Tab
                                key={tab.value}
                                value={tab.value}
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {tab.icon}
                                        <Box textAlign="left">
                                            <Typography variant="inherit" fontWeight="inherit">
                                                {tab.label}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: 0.7,
                                                    display: { xs: "none", sm: "block" },
                                                    fontSize: "0.7rem",
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {tab.description}
                                            </Typography>
                                        </Box>
                                        {/* {tab.count > 0 && (
                                            <Badge
                                                badgeContent={tab.count}
                                                color="primary"
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        fontSize: "0.7rem",
                                                        fontWeight: "bold",
                                                        minWidth: 18,
                                                        height: 18,
                                                        bgcolor: isDark ? "#64b5f6" : "primary.main",
                                                        color: isDark ? "#1a1a1a" : "primary.contrastText",
                                                        boxShadow: isDark ? "0 2px 8px rgba(100, 181, 246, 0.3)" : "none",
                                                    },
                                                }}
                                            />
                                        )} */}
                                    </Box>
                                }
                            />
                        ))}
                    </TabList>
                </TabContext>
            </Paper>

            {/* Contenido de los tabs */}
            {children}
        </>
    )
}

// Componente de estadísticas rápidas (opcional)
export function GarantiasStatsBar({ stats = {} }) {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"

    const statsConfig = [
        {
            label: "Total Garantías",
            value: stats.total || 0,
            icon: <Assignment fontSize="small" />,
            color: isDark ? "#64b5f6" : "#1976d2",
        },
        {
            label: "Monto Total",
            value: stats.montoTotal ? `$${(stats.montoTotal / 1000000).toFixed(1)}M` : "$0",
            icon: <AccountBalance fontSize="small" />,
            color: isDark ? "#66bb6a" : "#2e7d32",
        },
        {
            label: "Vigentes",
            value: stats.vigentes || 0,
            icon: <CheckCircle fontSize="small" />,
            color: isDark ? "#4caf50" : "#388e3c",
        },
        {
            label: "Vencidas",
            value: stats.vencidas || 0,
            icon: <Warning fontSize="small" />,
            color: isDark ? "#ff9800" : "#f57c00",
        },
    ]

    return (
        <Paper
            elevation={isDark ? 4 : 2}
            sx={{
                p: 2,
                mb: 3,
                bgcolor: isDark ? "#332C4E" : "background.paper",
                border: isDark ? "1px solid #4A4063" : "none",
                borderRadius: 3,
            }}
        >
            <Box display="flex" justifyContent="space-around" alignItems="center" flexWrap="wrap" gap={2}>
                {statsConfig.map((stat, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                            opacity: 0,
                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                            "@keyframes fadeInUp": {
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
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: alpha(stat.color, 0.1),
                                color: stat.color,
                            }}
                        >
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                {stat.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {stat.label}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    )
}

// Exportar también el TabPanel para uso externo
export { TabPanel }
