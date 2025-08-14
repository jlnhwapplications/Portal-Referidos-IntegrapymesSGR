import ApexChartWrapper from '@/@core/styles/libs/react-apexcharts'
import { Box, Chip, CircularProgress, Grid, LinearProgress, useTheme } from '@mui/material'
import React, { useContext, useRef, useState } from 'react'
import EcommerceCongratulations from '../views/dashboards/ecommerce/EcommerceCongratulations'
import TablaDocumentacion from '../views/dashboards/inicio/TablaDocumentacion'
import LimitesOverview from '../views/dashboards/inicio/LimitesOverview'
import LineasOverview from '../views/dashboards/inicio/LineasOverview'
import GarantiasOverview from '../views/dashboards/inicio/GarantiasOverview'
import RelacionesOverview from '../views/dashboards/inicio/RelacionesOverview'
import { useEffect } from 'react'
import { getAnalytics, setUserId } from "firebase/analytics";
import { AuthContext } from '@/context/AuthContext'
import OnboardingOverview from '../views/dashboards/inicio/OnboardingOverview'
import useGetUnidadDeNegocio from '@/hooks/useGetUnidadDeNegocio'
import UseGetLimites from '@/hooks/useGetLimites'
import { object } from 'yup'
import { useTheme as useMuiTheme } from "@mui/material/styles"
import PageHeader from '@/@core/components/page-header'
import {
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as InvestmentIcon,
  Receipt as TransactionIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  AccountBalanceWallet as WalletIcon,
  Assignment as DocumentIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material"


const Index = () => {
    const { referido } = useContext(AuthContext);
    const { lineasActivas, loadingMostrarLineas } = useGetUnidadDeNegocio()
    const [mostrarLineas, setMostrarLineas] = useState(false)
    const [socioActivo, setSocioActivo] = useState(false)
    const [resumenCargado, setResumenCargado] = useState(false)
    const { loadingLimites } = UseGetLimites()
    const { theme } = useTheme()
    const isDark = theme?.palette?.mode === 'dark'
    const [isVisible, setIsVisible] = useState(false)
    const bloquearResumen = useRef(false);

    useEffect(() => {
        if (loadingMostrarLineas && loadingLimites && referido != undefined && bloquearResumen.current === false) {
            setResumenCargado(true)
            bloquearResumen.current = true
        }
        if (referido?.new_estadodelsocio === 100000000) {
            setSocioActivo(true)
        }
        setMostrarLineas(lineasActivas)
    }, [loadingMostrarLineas, loadingLimites, referido, lineasActivas])

    // Componente para animar la entrada de cada elemento del grid
    function AnimatedGridItem({ children, delay = 0, animationType = "fadeUp", duration = 600, ...gridProps }) {
        const [isVisible, setIsVisible] = useState(false)

        useEffect(() => {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, delay)

            return () => clearTimeout(timer)
        }, [delay])

        const getAnimationStyles = () => {
            switch (animationType) {
                case "fadeUp":
                    return {
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(40px)",
                        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }
                case "fadeLeft":
                    return {
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(-40px)",
                        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }
                case "fadeRight":
                    return {
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(40px)",
                        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }
                case "scale":
                    return {
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "scale(1)" : "scale(0.9)",
                        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }
                case "bounce":
                    return {
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(40px)",
                        transition: `all ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
                    }
                default:
                    return {
                        opacity: isVisible ? 1 : 0,
                        transition: `opacity ${duration}ms ease-out`,
                    }
            }
        }

        return (
            <Grid item {...gridProps}>
                <Box sx={getAnimationStyles()}>{children}</Box>
            </Grid>
        )
    }

    // Componente de loading mejorado con animaciones
    function AnimatedLoading() {
        const theme = useTheme()
        const isDark = theme.palette.mode === "dark"

        return (
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 3,
                        py: 8,
                    }}
                >
                    {/* Loading spinner con animación personalizada */}
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress
                            size={60}
                            thickness={4}
                            sx={{
                                color: isDark ? "#64b5f6" : "#1976d2",
                                animation: "pulse 2s ease-in-out infinite",
                                "@keyframes pulse": {
                                    "0%": {
                                        transform: "scale(1)",
                                        opacity: 1,
                                    },
                                    "50%": {
                                        transform: "scale(1.1)",
                                        opacity: 0.7,
                                    },
                                    "100%": {
                                        transform: "scale(1)",
                                        opacity: 1,
                                    },
                                },
                            }}
                        />

                        {/* Círculo de fondo animado */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                border: `2px solid ${isDark ? "rgba(100, 181, 246, 0.1)" : "rgba(25, 118, 210, 0.1)"}`,
                                animation: "ripple 2s ease-out infinite",
                                "@keyframes ripple": {
                                    "0%": {
                                        transform: "scale(0.8)",
                                        opacity: 1,
                                    },
                                    "100%": {
                                        transform: "scale(2)",
                                        opacity: 0,
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Puntos de carga animados */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {[0, 1, 2].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: isDark ? "#64b5f6" : "#1976d2",
                                    animation: `bounce 1.4s ease-in-out ${index * 0.16}s infinite both`,
                                    "@keyframes bounce": {
                                        "0%, 80%, 100%": {
                                            transform: "scale(0)",
                                        },
                                        "40%": {
                                            transform: "scale(1)",
                                        },
                                    },
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Grid>
        )
    }

    return (
        <ApexChartWrapper>
            <Grid container spacing={4}>
                {
                    (!resumenCargado) ?
                        <AnimatedLoading />
                        :
                        <>

                            <Grid item xs={12} md={12} sx={{ order: 0, alignSelf: 'flex-end' }}>
                                <PageHeader
                                    title="Inicio"
                                    subtitle={
                                        !socioActivo ? "Su proceso de onboarding se encuentra en estado pendiente." :
                                            "Aquí tienes tu resumen de posición."
                                    }
                                    variant="compact"
                                    action={
                                        referido?.new_estadodelsocio == 100000000 ? (
                                            <Chip
                                                label="Activo"
                                                size="small"
                                                icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} color='#10B981' />}
                                                sx={{
                                                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                                                    color: "#10B981",
                                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                                    fontWeight: 600,
                                                    fontSize: "0.7rem",
                                                    transition: "opacity 0.2s ease-in-out",
                                                    // opacity: (!navCollapsed || navHover) ? 1 : 0,
                                                }}
                                            />) : (
                                            <Chip
                                                label="En Proceso de Onboarding"
                                                size="small"
                                                icon={<ScheduleIcon sx={{ fontSize: "16px !important" }} color='#f59e0b' />}
                                                sx={{
                                                    backgroundColor: "rgba( 245, 158, 1, 0.1)",
                                                    color: "#f59e0b",
                                                    border: "1px solid rgba(245, 158, 1, 0.3))",
                                                    fontWeight: 600,
                                                    fontSize: "0.7rem",
                                                    transition: "opacity 0.2s ease-in-out",
                                                    // opacity: (!navCollapsed || navHover) ? 1 : 0,
                                                }}
                                            />
                                        )
                                    }
                                />
                                {/* <EcommerceCongratulations
                                    nombre={referido?.name}
                                    descripcion={
                                        !socioActivo ? "Su proceso de onboarding se encuentra en estado pendiente." :
                                            "Aquí tienes tu resumen de posición."
                                    }
                                    theme={theme}
                                    isDark={isDark}
                                /> */}
                            </Grid>
                            {
                                (socioActivo && mostrarLineas == true) ?
                                    <Grid item xs={12} md={12}>
                                        <LimitesOverview />
                                    </Grid> : null
                            }
                            {
                                !socioActivo ?
                                    (
                                        <Grid item xs={12} md={12}>
                                            <OnboardingOverview />
                                        </Grid>
                                    ) : null
                            }
                            <Grid item xs={12} md={12} lg={8} sx={{ order: 0 }}>
                                <TablaDocumentacion />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <RelacionesOverview />
                            </Grid>
                            {
                                !socioActivo ?
                                    null
                                    : (
                                        <Grid item xs={12} md={6}>
                                            <GarantiasOverview />
                                        </Grid>
                                    )
                            }
                            {
                                !socioActivo ?
                                    null
                                    : (
                                        <Grid item xs={12} md={6}>
                                            <LineasOverview />
                                        </Grid>
                                    )
                            }
                        </>
                }
            </Grid>
        </ApexChartWrapper>
    )
}

export default Index