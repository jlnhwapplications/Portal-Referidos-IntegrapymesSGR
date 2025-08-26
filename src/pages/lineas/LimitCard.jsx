import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Button,
  Grid,
  Avatar,
  Divider,
  Paper,
  Stack,
  Skeleton,
  Container,
  useTheme,
  CircularProgress,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  CreditCard,
  TrendingDown,
  TrendingUp,
  Security,
  Warning,
  CheckCircle,
  Info,
  Download,
  Visibility,
  CalendarToday,
  Business,
  Schedule,
  Percent,
  AttachMoney,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import ReactApexcharts from "@/@core/components/react-apexcharts";
import { useState } from "react";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const LimitCard = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expanded, setExpanded] = useState(false);
  const utilizationPercentage =
    data?.new_lineatipodeoperacion_value == 100000000
      ? (data.new_montoutilizadogeneral / data.new_topeporlineacomercial) * 100
      : (data.new_montoutilizadoporoperacion / data.new_topeporlineacomercial) *
        100;
  const isHighUtilization = utilizationPercentage > 80;
  const isMediumUtilization = utilizationPercentage > 60;
  const esPantallaChica = useMediaQuery((theme) =>
    theme.breakpoints.down("xl")
  );

  // Función profesional para formatear moneda
  const formatCurrency = (amount, currency = "USD") => {
    if (currency === "Pesos Argentinos" || currency === "ARS") {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount, currency = "USD") => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "COP" ? "COP" : "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  };

  const getStatusIcon = () => {
    if (isHighUtilization) return <Warning color="error" fontSize="small" />;
    if (isMediumUtilization) return <Info color="warning" fontSize="small" />;
    return <CheckCircle color="success" fontSize="small" />;
  };

  const getStatusText = () => {
    if (isHighUtilization) return "Límite Alto";
    if (isMediumUtilization) return "Uso Moderado";
    return "Disponible";
  };

  const getStatusColor = () => {
    if (isHighUtilization) return "error";
    if (isMediumUtilization) return "warning";
    return "success";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper
          elevation={8}
          sx={{
            p: 2,
            maxWidth: 200,
            bgcolor: isDark ? "#2a2a2a" : "background.paper",
            border: isDark ? "1px solid #404040" : "none",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.primary"
          >
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCompactCurrency(
              data.value,
              data._transactioncurrencyid_value
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data.percentage.toFixed(1)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

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
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return formatCurrency(total);
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
        const value = series[seriesIndex];
        const label = w.globals.labels[seriesIndex];
        const percentage = ((value / (series[0] + series[1])) * 100).toFixed(1);

        return `
          <div style="padding: 12px; border-radius: 8px; background: ${
            isDark ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.95)"
          }; border: 1px solid ${
          isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
        }; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
            <div style="font-weight: 600; color: ${
              theme.palette.text.primary
            }; margin-bottom: 4px;">
              ${label}
            </div>
            <div style="font-weight: 700; font-size: 16px; color: ${
              seriesIndex === 0 ? "#10B981" : "#F59E0B"
            };">
              ${formatCurrency(value)}
            </div>
            <div style="font-size: 12px; color: ${
              theme.palette.text.secondary
            }; margin-top: 4px;">
              ${percentage}% del total
            </div>
          </div>
        `;
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
  };

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      elevation={isDark ? 12 : 8}
      sx={{
        height: "100%",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: isDark
          ? "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        border: `1px solid ${
          isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
        }`,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)"
            : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
          zIndex: 0,
        },
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: isDark
            ? "0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1), 0 0 20px rgba(100, 181, 246, 0.2)"
            : "0 12px 40px rgba(0,0,0,0.2), 0 0 20px rgba(25, 118, 210, 0.1)",
          "&::before": {
            opacity: 1,
          },
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      {/* Header con gradiente mejorado para dark mode */}
      <CardHeader
        sx={{
          bgcolor: theme.palette.background,
          border: theme.palette.border.default,
          borderBottom: 1,
          borderColor: "divider",
          pb: 1.5,
          py: { xs: 1, xl: 2 },
          px: { xs: 2, xl: 3 },
        }}
        avatar={
          <Avatar
            sx={{
              width: { xs: 26, xl: 32 },
              height: { xs: 26, xl: 32 },
              bgcolor: "primary.main",
              background: isDark
                ? "linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: isDark
                ? "0 4px 12px rgba(100, 181, 246, 0.3)"
                : "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
          >
            <CreditCard sx={{ fontSize: { xs: 18, xl: 22 } }} />
          </Avatar>
        }
        title={
          <Typography
            sx={{ fontSize: { xs: 16, xl: 22 } }}
            fontWeight="bold"
            color="text.primary"
          >
            {`Límite ${data?.new_lineatipodeoperacion}`}
          </Typography>
        }
        subheader={
          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            {data.new_tipochpd && (
              <Business
                fontSize="small"
                sx={{ color: isDark ? "#b0b0b0" : "action.active" }}
              />
            )}
            <Typography variant="body2" color="text.secondary">
              {data.new_tipochpd || ""}
            </Typography>
          </Box>
        }
        // action={
        //   <Box
        //     display="flex"
        //     flexDirection="column"
        //     alignItems="flex-end"
        //     gap={1}
        //   >
        //     <Chip
        //       icon={getStatusIcon()}
        //       label={getStatusText()}
        //       color={getStatusColor()}
        //       size="small"
        //       variant="filled"
        //       sx={{
        //         backdropFilter: isDark ? "blur(10px)" : "none",
        //         boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
        //       }}
        //     />
        //     <Box display="flex" alignItems="center" gap={0.5}>
        //       <CalendarToday
        //         fontSize="small"
        //         sx={{ color: isDark ? "#b0b0b0" : "action.active" }}
        //       />
        //       <Typography variant="caption" color="text.secondary">
        //         {data.lastUpdate || "15/01/2024"}
        //       </Typography>
        //     </Box>
        //   </Box>
        // }
      />
      {/* <CardHeader
        sx={{
          background: isDark
            ? "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderBottom: 1,
          borderColor: "divider",
        }}
        avatar={
          <Avatar
            sx={{
              bgcolor: "primary.main",
              background: isDark
                ? "linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: isDark
                ? "0 4px 12px rgba(100, 181, 246, 0.3)"
                : "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
          >
            <CreditCard />
          </Avatar>
        }
        title={
          <Typography
            sx={{ fontSize: { xs: "0.75rem", md: "0.80rem", xl: "1.2rem" } }}
            fontWeight="bold"
            color="text.primary"
          >
            {`Límite ${data?.new_lineatipodeoperacion}`}
          </Typography>
        }
      /> */}

      <CardContent sx={{ p: 3, mt: 2 }}>
        <Stack spacing={3}>
          {/* Límite principal - FONDO NEUTRO, SOLO MONTO EN VERDE */}
          {/* Barra de progreso profesional mejorada */}
          <Paper
            elevation={isDark ? 4 : 2}
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: theme.palette.background,
              border: 1,
              borderColor: theme.palette.border.default,
              boxShadow: isDark
                ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
              mb={2}
            >
              <Security sx={{ color: isDark ? "#b0b0b0" : "text.secondary" }} />
              <Typography
                variant="overline"
                fontWeight="bold"
                color="text.secondary"
              >
                Límite Autorizado
              </Typography>
            </Box>
            {/* SOLO EL MONTO EN VERDE */}
            <Typography
              // variant={{  }}
              fontWeight="black"
              gutterBottom
              sx={{
                color: isDark ? "#10B981" : "#2e7d32",
                fontSize: { xs: "1rem", md: "1.5rem", xl: "2rem" },
              }}
            >
              {data._transactioncurrencyid_value === "COP"
                ? formatCompactCurrency(data.new_topeporlineacomercial, "COP")
                : formatCurrency(
                    data.new_topeporlineacomercial,
                    data._transactioncurrencyid_value
                  )}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Box display="flex" alignItems="center" gap={0.5}>
                {data?.statecode === 0 ? (
                  <>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Vence: {data?.new_vigenciahasta || "N/A"}
                    </Typography>
                  </>
                ) : (
                  <>
                    <EventBusyIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Venció: {data?.new_vigenciahasta || "N/A"}
                    </Typography>
                  </>
                )}
              </Box>
            </Stack>
          </Paper>
          {/* Barra de progreso siempre visible */}
          <Paper
            elevation={isDark ? 2 : 1}
            sx={{
              p: 2,
              bgcolor: theme.palette.background,
              border: 1,
              borderColor: theme.palette.border.default,
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1.5}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="text.primary"
              >
                Nivel de Utilización
              </Typography>
              <Chip
                label={`${utilizationPercentage.toFixed(1)}%`}
                variant="filled"
                color="primary"
                size="small"
                sx={{
                  fontWeight: "bold",
                  boxShadow: isDark
                    ? "0 2px 8px rgba(100, 181, 246, 0.3)"
                    : "none",
                }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={
                data.new_topeporlineacomercial > 0
                  ? data?.new_lineatipodeoperacion_value == 100000000
                    ? (data?.new_montoutilizadogeneral /
                        data.new_topeporlineacomercial) *
                      100
                    : (data?.new_montoutilizadoporoperacion /
                        data.new_topeporlineacomercial) *
                      100
                  : 0
              }
              sx={{
                height: 12,
                borderRadius: 6,
                mb: 1,
                bgcolor: isDark ? "#4A4063" : "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 6,
                  backgroundColor: isHighUtilization
                    ? isDark
                      ? "#f44336"
                      : "error.main"
                    : isMediumUtilization
                    ? isDark
                      ? "#ff9800"
                      : "warning.main"
                    : isDark
                    ? "#10B981"
                    : "success.main",
                  boxShadow: isDark ? "0 0 10px rgba(255,255,255,0.2)" : "none",
                },
              }}
            />
          </Paper>
          {/* Botón para expandir/colapsar */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              borderTop: 1,
              borderColor: "divider",
              borderRadius: 3,
              py: 1,
              bgcolor: isDark ? "#3A3356" : "grey.50",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark ? "#4A4063" : "grey.100",
              },
            }}
            onClick={handleToggleExpanded}
          >
            <Typography
              variant="button"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              {expanded ? "Ocultar detalles" : "Ver más detalles"}
              {expanded ? (
                <KeyboardArrowUp fontSize="small" color="primary" />
              ) : (
                <KeyboardArrowDown fontSize="small" color="primary" />
              )}
            </Typography>
          </Box>
          {expanded && (
            <Box
              sx={{
                opacity: 0,
                animation: "fadeInUp 0.5s ease-out forwards",
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
              {/* Gráfico de torta profesional mejorado */}
              <Paper
                elevation={isDark ? 2 : 1}
                sx={{
                  p: 2,
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"
                  }`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AttachMoney
                    sx={{
                      fontSize: { xs: 18, xl: 22 },
                    }}
                    color="primary"
                  />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{
                      fontSize: { xs: 14, xl: 16 },
                    }}
                  >
                    Distribución del Límite
                  </Typography>
                </Box>
                <Box height={esPantallaChica ? 200 : 240}>
                  <ReactApexcharts
                    type="donut"
                    height={esPantallaChica ? 200 : 240}
                    width="100%"
                    series={
                      data?.new_lineatipodeoperacion_value == 100000000
                        ? [
                            data?.new_montodisponiblegeneral
                              ? data.new_montodisponiblegeneral
                              : 0,
                            data?.new_montoutilizadogeneral
                              ? data.new_montoutilizadogeneral
                              : 0,
                          ]
                        : [
                            data?.new_montodisponibleporoperacion
                              ? data.new_montodisponibleporoperacion
                              : 0,
                            data?.new_montoutilizadoporoperacion
                              ? data.new_montoutilizadoporoperacion
                              : 0,
                          ]
                    }
                    options={chartOptions}
                  />
                </Box>
              </Paper>
              {/* Métricas principales mejoradas */}
              <Grid container spacing={2} sx={{ px: 4, mt: 2 }}>
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
                      sx={{
                        fontSize: { xs: 14, xl: 16 },
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        flex: 1,
                      }}
                    >
                      {data?.new_lineatipodeoperacion_value == 100000000
                        ? "Monto disponible general"
                        : "Monto disponible por operación"}
                    </Typography>
                    <TrendingUpIcon
                      sx={{ color: "#10B981", fontSize: 20, ml: 1 }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#10B981",
                      mb: 1,
                      fontSize: { xs: 14, xl: 16 },
                    }}
                  >
                    {data?.new_lineatipodeoperacion_value == 100000000
                      ? formatCurrency(data?.new_montodisponiblegeneral)
                      : formatCurrency(data?.new_montodisponibleporoperacion)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      data.new_topeporlineacomercial > 0
                        ? data?.new_lineatipodeoperacion_value == 100000000
                          ? (data?.new_montodisponiblegeneral /
                              data.new_topeporlineacomercial) *
                            100
                          : (data?.new_montodisponibleporoperacion /
                              data.new_topeporlineacomercial) *
                            100
                        : 0
                    }
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
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
                      sx={{
                        fontSize: { xs: 14, xl: 16 },
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        flex: 1,
                      }}
                    >
                      {data?.new_lineatipodeoperacion_value == 100000000
                        ? "Monto utilizado general"
                        : "Monto utilizado por operación"}
                    </Typography>
                    <TrendingDownIcon
                      sx={{ color: "#F59E0B", fontSize: 20, ml: 1 }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: 14, xl: 16 },
                      fontWeight: 700,
                      color: "#F59E0B",
                      mb: 1,
                    }}
                  >
                    {data?.new_lineatipodeoperacion_value == 100000000
                      ? formatCurrency(data?.new_montoutilizadogeneral)
                      : formatCurrency(data?.new_montoutilizadoporoperacion)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      data.new_topeporlineacomercial > 0
                        ? data?.new_lineatipodeoperacion_value == 100000000
                          ? (data?.new_montoutilizadogeneral /
                              data.new_topeporlineacomercial) *
                            100
                          : (data?.new_montoutilizadoporoperacion /
                              data.new_topeporlineacomercial) *
                            100
                        : 0
                    }
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#F59E0B",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LimitCard;
