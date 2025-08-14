// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material"
import ReactApexcharts from 'src/@core/components/react-apexcharts'
// ** Util Import
import useGetLimites from '@/hooks/useGetLimites'
import { Avatar, LinearProgress, useMediaQuery } from '@mui/material'

const LimitesOverview = () => {
  // ** Hook
  const theme = useTheme()
  const isDark = theme?.palette?.mode === 'dark'
  // ** States
  const { dataLimite } = useGetLimites();
  // Calcular porcentaje de utilización
  const tope = dataLimite?.tope || 0
  const utilizationPercentage = tope > 0 ? (dataLimite?.utilizado / tope) * 100 : 0
  const esPantallaChica = useMediaQuery(theme => theme.breakpoints.down('xl'))
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Configuración mejorada de ApexCharts
  const chartOptions = {
    chart: {
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ["#10B981", "#F59E0B"], // Verde para disponible, naranja para utilizado
    stroke: {
      width: 0,
      lineCap: "round",
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: ["Disponible", "Utilizado"],
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.1,
        },
      },
      active: {
        filter: {
          type: "darken",
          value: 0.1,
        },
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.95,
        expandOnClick: false,
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: theme.typography.fontFamily,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              offsetY: 25,
              formatter: (val) => val,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: theme.typography.fontFamily,
              fontWeight: 700,
              color: theme.palette.text.primary,
              offsetY: -15,
              formatter: (val) => formatCurrency(val),
            },
            total: {
              show: true,
              showAlways: true,
              label: "Tope Total",
              fontSize: "12px",
              fontFamily: theme.typography.fontFamily,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return formatCurrency(total)
              },
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: isDark ? "dark" : "light",
      style: {
        fontSize: "12px",
        fontFamily: theme.typography.fontFamily,
      },
      y: {
        formatter: (val) => formatCurrency(val),
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex]
        const label = w.globals.labels[seriesIndex]
        const percentage = ((value / (series[0] + series[1])) * 100).toFixed(1)

        return `
          <div style="padding: 12px; border-radius: 8px; background: ${isDark ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.95)"
          }; border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
          }; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
            <div style="font-weight: 600; color: ${theme.palette.text.primary}; margin-bottom: 4px;">
              ${label}
            </div>
            <div style="font-weight: 700; font-size: 16px; color: ${seriesIndex === 0 ? "#10B981" : "#F59E0B"};">
              ${formatCurrency(value)}
            </div>
            <div style="font-size: 12px; color: ${theme.palette.text.secondary}; margin-top: 4px;">
              ${percentage}% del total
            </div>
          </div>
        `
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            pie: {
              customScale: 0.8,
              donut: {
                size: "70%",
                labels: {
                  name: {
                    fontSize: "12px",
                  },
                  value: {
                    fontSize: "14px",
                  },
                  total: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
        },
      },
    ],
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
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
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
            <AccountBalanceIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 18, xl: 22 },
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
                lineHeight: "2rem",
                letterSpacing: "0.15px",
              }}
            >
              Límite Comercial
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: 14, xl: 16 }, }}>
              Gestión de líneas de crédito comercial
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={esPantallaChica ? 2 : 4}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 220,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <ReactApexcharts type='donut' height={esPantallaChica ? 220 : 280} width="100%" series={[dataLimite?.disponible ? dataLimite.disponible : 0, dataLimite?.utilizado ? dataLimite.utilizado : 0]} options={chartOptions} />
              {/* <ReactApexChart type="donut" height={280} width="100%" series={chartSeries} options={chartOptions} /> */}
            </Box>
          </Grid>

          {/* Información detallada - CENTRADA COMPLETAMENTE */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 320,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {/* Tope por línea comercial - CENTRADO */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
                  mb: 3,
                  width: "100%",
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: theme.palette.primary.main + "20",
                    border: `2px solid ${theme.palette.primary.main}30`,
                    mr: 3,
                  }}
                >
                  <MoneyIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 16, xl: 18 },
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Tope por línea comercial
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: 20, xl: 24 },
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(tope)}
                  </Typography>
                </Box>
              </Box>

              <Divider
                sx={{
                  mb: 3,
                  borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                  width: "100%",
                }}
              />

              {/* Monto disponible */}
              <Box sx={{ mb: 3, width: "100%" }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#10B981",
                      mr: 1.5,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    Monto disponible general
                  </Typography>
                  <TrendingUpIcon sx={{ color: "#10B981", fontSize: 20, ml: 1 }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#10B981",
                    fontSize: "1.1rem",
                    mb: 1,
                  }}
                >
                  {formatCurrency(dataLimite?.disponible)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={tope > 0 ? (dataLimite?.disponible / tope) * 100 : 0}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#10B981",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              {/* Monto utilizado */}
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#F59E0B",
                      mr: 1.5,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    Monto utilizado comercial
                  </Typography>
                  <TrendingDownIcon sx={{ color: "#F59E0B", fontSize: 20, ml: 1 }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#F59E0B",
                    fontSize: "1.1rem",
                    mb: 1,
                  }}
                >
                  {formatCurrency(dataLimite?.utilizado)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={utilizationPercentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#F59E0B",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        {/* Resumen inferior con indicador de riesgo */}
        {
          !esPantallaChica ?
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor:
                  utilizationPercentage > 80
                    ? "rgba(239, 68, 68, 0.1)"
                    : utilizationPercentage > 60
                      ? "rgba(249, 115, 22, 0.1)"
                      : "rgba(16, 185, 129, 0.1)",
                border: `1px solid ${utilizationPercentage > 80
                  ? "rgba(239, 68, 68, 0.3)"
                  : utilizationPercentage > 60
                    ? "rgba(249, 115, 22, 0.3)"
                    : "rgba(16, 185, 129, 0.3)"
                  }`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Capacidad de crédito restante
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: utilizationPercentage > 80 ? "#EF4444" : utilizationPercentage > 60 ? "#F97316" : "#10B981",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {formatCurrency(Math.max(0, tope - dataLimite?.utilizado))}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  display: "block",
                  mt: 1,
                }}
              >
                {utilizationPercentage.toFixed(1)}% del límite utilizado
              </Typography>
            </Box> : null
        }
      </CardContent >
    </Card >
  )
}

export default LimitesOverview
