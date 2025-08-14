
import { Card, CardContent, Typography, Box, LinearProgress, Chip, Grid } from "@mui/material"
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import {
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
} from "@mui/icons-material"
// ** Util Import

import { useContext, useEffect, useState } from 'react'
import GraficoProgresoApex from '@/@core/components/graficos/GraficoProgresoApex'
import { AuthContext } from '@/context/AuthContext'
import useGetDocumentacionPorCuenta from '@/hooks/useGetDocumentacionPorCuenta'
let COLORSEstados = [];
let ESTADIOONBOARDING = []

const OnboardingOverview = () => {
    const { referido } = useContext(AuthContext);
    const { carpetas } = useGetDocumentacionPorCuenta()
    const [estadosOnb, setEstadosOnb] = useState([])

    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const [progreso, setProgreso] = useState(0)
    const [completedSteps, setCompletedSteps] = useState(0)

    useEffect(() => {
        if (
            referido && Object.keys(referido).length > 0 &&
            carpetas && carpetas.length > 0
        ) {
            debugger
            const estadioOnboarding = [];
            const coloresEstados = [];

            const carpetasVisibles = carpetas.filter(c => c.new_visibleenportal);
            const hayDocumentacionPendiente = carpetasVisibles.some(c => c.statuscodeNOMBRE === "Pendiente");

            const docuPendiente = carpetasVisibles.length > 0 && hayDocumentacionPendiente;
            const datosPendiente = ![100000006, 100000000].includes(referido.new_estadodelsocio);

            // Documentación y datos mi cuenta
            if (docuPendiente && datosPendiente) {
                estadioOnboarding.push({ name: "Documentación", value: 30, texto: "Pendiente" });
                coloresEstados.push("#ffab00");

                estadioOnboarding.push({ name: "Datos mi cuenta", value: 30, texto: "Pendiente" });
                coloresEstados.push("#ffab00");

                setProgreso(66);
            } else if (!docuPendiente && datosPendiente) {
                estadioOnboarding.push({ name: "Documentación", value: 30, texto: "Completada" });
                coloresEstados.push("#43a047");

                estadioOnboarding.push({ name: "Datos mi cuenta", value: 30, texto: "Pendiente" });
                coloresEstados.push("#ffab00");

                setProgreso(66);
            } else if (!docuPendiente && !datosPendiente) {
                estadioOnboarding.push({ name: "Documentación", value: 30, texto: "Completada" });
                coloresEstados.push("#43a047");

                estadioOnboarding.push({ name: "Datos mi cuenta", value: 30, texto: "Completada" });
                coloresEstados.push("#43a047");

                setProgreso(100);
            } else if (docuPendiente && !datosPendiente) {
                estadioOnboarding.push({ name: "Documentación", value: 30, texto: "Pendiente" });
                coloresEstados.push("#ffab00");

                estadioOnboarding.push({ name: "Datos mi cuenta", value: 30, texto: "Completada" });
                coloresEstados.push("#43a047");

                setProgreso(66);
            }

            // Solicitud de Alta (siempre completada)
            estadioOnboarding.push({ name: "Solicitud de Alta", value: 40, texto: "Completada" });
            coloresEstados.push("#43a047");

            setEstadosOnb(estadioOnboarding);
        }
    }, [carpetas, referido]);


    const getStatusConfig = (status) => {
        if (status === "Completada") {
            return {
                icon: CheckCircleIcon,
                color: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.3)",
                label: "Completado",
            }
        }
        return {
            icon: ScheduleIcon,
            color: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderColor: "rgba(245, 158, 11, 0.3)",
            label: "Pendiente",
        }
    }

    return (
        <Card
            sx={{
                borderRadius: 4,
                width: "100%",
                background: isDark
                    ? "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)"
                    : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: isDark ? "0 12px 40px rgba(0, 0, 0, 0.4)" : "0 12px 40px rgba(0, 0, 0, 0.12)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.main + "20",
                                borderRadius: 3,
                                p: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <AssignmentIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: 16, xl: 18 },
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    mb: 0.5,
                                }}
                            >
                                Mi Onboarding
                            </Typography>
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: 12, xl: 14 }, }}>
                                {estadosOnb.filter(x => x?.texto == 'Completada').length} de {estadosOnb?.length} pasos completados
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={<TrendingUpIcon />}
                        label={`${progreso}%`}
                        sx={{
                            backgroundColor: theme.palette.primary.main + "20",
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            height: 36,
                        }}
                    />
                </Box>

                {/* Barra de progreso principal */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography sx={{ color: theme.palette.text.secondary, fontWeight: 500, fontSize: { xs: 16, xl: 18 } }}>
                            Progreso General
                        </Typography>
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 600, fontSize: { xs: 14, xl: 16 } }}>
                            {progreso}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progreso}
                        sx={{
                            height: 6,
                            borderRadius: 4,
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            },
                        }}
                    />
                </Box>

                {/* Lista de pasos */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 16, xl: 18 },
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 3,
                        }}
                    >
                        Pasos del Proceso
                    </Typography>
                    <Grid container sx={{ display: "flex", flexDirection: "row", justifyContent: 'center', gap: 2}}>
                        {estadosOnb.map((item, index) => {
                            const statusConfig = getStatusConfig(item.texto)
                            const StatusIcon = statusConfig.icon
                            return (
                                <Grid
                                    xs={12}
                                    md={3}
                                    xl={12}
                                    key={item.name}
                                    sx={{
                                        mx: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        p: 1.5,
                                        borderRadius: 3,
                                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                                            transform: "translateX(4px)",
                                        },
                                    }}
                                >
                                    {/* Número del paso */}
                                    <Box
                                        sx={{
                                            minWidth: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            backgroundColor: statusConfig.backgroundColor,
                                            border: `2px solid ${statusConfig.borderColor}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: 2,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: { xs: 14, xl: 18 },
                                                fontWeight: 700,
                                                color: statusConfig.color,
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {index + 1}
                                        </Typography>
                                    </Box>

                                    {/* Información del paso */}
                                    <Box sx={{ flex: 1, mr: 2 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                                mb: 0.5,
                                                fontSize: { xs: 14, xl: 16 },
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                fontSize: { xs: 12, xl: 14 },
                                            }}
                                        >
                                            {item.texto === "Completada" ? "Completado exitosamente" : "Pendiente de completar"}
                                        </Typography>
                                    </Box>

                                    {/* Ícono de estado */}
                                    <Box
                                        sx={{
                                            backgroundColor: statusConfig.backgroundColor,
                                            borderRadius: 2,
                                            p: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <StatusIcon sx={{ color: statusConfig.color, fontSize: 20 }} />
                                    </Box>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>

                {/* Resumen final */}
                {progreso === 100 && (
                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            textAlign: "center",
                        }}
                    >
                        <CheckCircleIcon sx={{ color: "#10b981", fontSize: 32, mb: 1 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#10b981",
                                fontWeight: 600,
                                mb: 0.5,
                            }}
                        >
                            ¡Onboarding Completado!
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                            }}
                        >
                            Has completado todos los pasos del proceso de onboarding
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
        // <Card>
        //     <CardHeader
        //         title='Mi Onboarding'
        //         titleTypographyProps={{
        //             sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        //         }}
        //     />
        //     <CardContent>
        //         <GraficoProgresoApex datos={estadosOnb} titulo="Mi Onboarding" />
        //     </CardContent>
        // </Card>
    )
}

export default OnboardingOverview
