import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types';
import Chart from 'src/@core/components/react-apexcharts'
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Grid,
} from "@mui/material"
import { useTheme } from '@mui/material/styles';
import { PieChart as PieChartIcon, Download as DownloadIcon, Refresh as RefreshIcon } from "@mui/icons-material"

const colors = ["rgb(84, 230, 0)", "rgb(255, 45, 0)", "rgb(255, 163, 25)", "rgb(87, 202, 34)", "rgb(0, 155, 255)",
    "rgb(255, 45, 0)", "rgb(243, 156, 18)", "rgb(87, 124, 96)", "rgb(77, 103, 117)", "rgb(239, 226, 152)"]

const GraficoDonaApex = ({ datos, opciones, titulo, opcionPrincipal, subtitulo = "Distribución de datos", colors = [],
    onRefresh, onExport }) => {
    // const isDark = theme.palette.mode === "dark"
    const [datosGrafico, setDatosGraficos] = React.useState([])
    const [opcion, setOpcion] = React.useState([])
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark"

    useEffect(() => {
        setDatosGraficos(datos)
    }, [datos])

    // Colores mejorados para el tema
    const chartColors = useMemo(() => {
        if (colors?.length > 0) return colors

        if (isDark) {
            return [
                "#10B981",
                "#3B82F6",
                "#8B5CF6",
                "#F59E0B",
                "#EF4444",
                "#06B6D4",
                "#84CC16",
                "#F97316",
                "#EC4899",
                "#6366F1",
            ]
        } else {
            return [
                "#059669",
                "#2563EB",
                "#7C3AED",
                "#D97706",
                "#DC2626",
                "#0891B2",
                "#65A30D",
                "#EA580C",
                "#DB2777",
                "#4F46E5",
            ]
        }
    }, [colors, isDark])

    // Efecto para inicializar datos
    useEffect(() => {
        if (opciones?.length > 0) {
            const primeraOpcion = opciones[0]
            setOpcion(primeraOpcion)
            const datosFiltrados = datos.filter((item) => item.filtro === primeraOpcion)
            setDatosGraficos(datosFiltrados)
        } else {
            setDatosGraficos(datos)
        }
    }, [datos, opciones])

    // Handler para cambio de opción
    const handleChange = (event) => {
        const nuevaOpcion = event.target.value
        setOpcion(nuevaOpcion)
        const datosFiltrados = datos.filter((item) => item.filtro === nuevaOpcion)
        setDatosGraficos(datosFiltrados)
    }

    // Calcular total y porcentajes
    const total = useMemo(() => {
        return datosGrafico.reduce((sum, item) => sum + item.cantidad, 0)
    }, [datosGrafico])

    const datosConPorcentaje = useMemo(() => {
        return datosGrafico.map((item) => ({
            ...item,
            porcentaje: total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0,
        }))
    }, [datosGrafico, total])

    // Configuración del gráfico
    const chartOptions = useMemo(
        () => ({
            chart: {
                type: "donut",
                fontFamily: theme.typography.fontFamily,
                foreColor: theme.palette.text.secondary,
                toolbar: {
                    show: true,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                    },
                    export: {
                        csv: {
                            filename: titulo,
                            columnDelimiter: ",",
                            headerCategory: "Categoría",
                            headerValue: "Cantidad",
                        },
                        png: {
                            filename: titulo,
                        },
                        svg: {
                            filename: titulo,
                        },
                    },
                },
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
                background: "transparent",
            },
            labels: datosGrafico.map((item) => item.opcion),
            colors: chartColors,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: true,
                    startAngle: -90,
                    endAngle: 270,
                    donut: {
                        size: "75%",
                        background: "transparent",
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
                                fontSize: "24px",
                                fontFamily: theme.typography.fontFamily,
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                offsetY: -15,
                                formatter: (val) => val.toLocaleString(),
                            },
                            total: {
                                show: true,
                                showAlways: true,
                                label: "Total",
                                fontSize: "14px",
                                fontFamily: theme.typography.fontFamily,
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                                formatter: (w) => {
                                    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                    return total.toLocaleString()
                                },
                            },
                        },
                    },
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: [isDark ? "#1E253F" : "#ffffff"],
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: "12px",
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: 600,
                    colors: ["#ffffff"],
                },
                formatter: (val, opts) => {
                    return val.toFixed(1) + "%"
                },
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: "#000",
                    opacity: 0.45,
                },
            },
            legend: {
                show: false,
            },
            tooltip: {
                theme: isDark ? "dark" : "light",
                style: {
                    fontSize: "12px",
                    fontFamily: theme.typography.fontFamily,
                },
                y: {
                    formatter: (val) => val.toLocaleString() + " unidades",
                },
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const value = series[seriesIndex]
                    const label = w.globals.labels[seriesIndex]
                    const percentage = ((value / series.reduce((a, b) => a + b, 0)) * 100).toFixed(1)

                    return `
          <div style="padding: 12px; border-radius: 8px; background: ${isDark ? "rgba(30, 37, 63, 0.95)" : "rgba(255, 255, 255, 0.95)"
                        }; border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
                        }; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
            <div style="font-weight: 600; color: ${theme.palette.text.primary}; margin-bottom: 4px;">
              ${label}
            </div>
            <div style="font-weight: 700; font-size: 16px; color: ${chartColors[seriesIndex]};">
              ${value.toLocaleString()} unidades
            </div>
            <div style="font-size: 12px; color: ${theme.palette.text.secondary}; margin-top: 4px;">
              ${percentage}% del total
            </div>
          </div>
        `
                },
            },
            states: {
                hover: {
                    filter: {
                        type: "lighten",
                        value: 0.1,
                    },
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: "darken",
                        value: 0.1,
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            width: 280,
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    size: "70%",
                                    labels: {
                                        name: {
                                            fontSize: "12px",
                                        },
                                        value: {
                                            fontSize: "20px",
                                        },
                                        total: {
                                            fontSize: "12px",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            ],
        }),
        [theme, isDark, chartColors, datosGrafico, titulo],
    )

    // Componente para elementos de leyenda
    const LegendItem = ({ item, index, color }) => (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                    sx={{
                        width: 16,
                        height: 16,
                        bgcolor: color,
                        border: `2px solid ${color}40`,
                    }}
                />
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: "0.85rem",
                    }}
                >
                    {item.opcion}
                </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 700,
                        color: color,
                        fontSize: "0.9rem",
                    }}
                >
                    {item.cantidad.toLocaleString()}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.75rem",
                    }}
                >
                    {item.porcentaje}%
                </Typography>
            </Box>
        </Box>
    )

    return (
        <Card
            sx={{
                borderRadius: 4,
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
            <CardHeader
                sx={{ pb: 2 }}
                title={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                                sx={{
                                    backgroundColor: theme.palette.primary.main + "20",
                                    borderRadius: 2,
                                    p: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <PieChartIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        mb: 0.5,
                                    }}
                                >
                                    {titulo}
                                </Typography>
                                {subtitulo && (
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {subtitulo}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {/* Selector de opciones */}
                            {opciones?.length > 0 && (
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                        value={opcion}
                                        onChange={handleChange}
                                        sx={{
                                            borderRadius: 2,
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        {opciones.map((opt, index) => (
                                            <MenuItem key={index} value={opt}>
                                                {opt}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            {/* Chip con total */}
                            <Chip
                                label={`Total: ${total.toLocaleString()}`}
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.primary.main + "20",
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                }}
                            />

                            {/* Botones de acción */}
                            {onRefresh && (
                                <Tooltip title="Actualizar datos">
                                    <IconButton onClick={onRefresh} size="small">
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {onExport && (
                                <Tooltip title="Exportar datos">
                                    <IconButton onClick={onExport} size="small">
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                }
            />

            <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={3}>
                    {/* Gráfico */}
                    <Grid item xs={12} md={7}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: 320,
                                "& .apexcharts-menu": {
                                    background: isDark ? "rgba(30, 37, 63, 0.95) !important" : "rgba(255, 255, 255, 0.95) !important",
                                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} !important`,
                                    borderRadius: "8px !important",
                                    boxShadow: isDark
                                        ? "0 8px 32px rgba(0, 0, 0, 0.3) !important"
                                        : "0 8px 32px rgba(0, 0, 0, 0.08) !important",
                                },
                                "& .apexcharts-menu-item": {
                                    color: `${theme.palette.text.primary} !important`,
                                    "&:hover": {
                                        backgroundColor: `${theme.palette.primary.main}20 !important`,
                                    },
                                },
                            }}
                        >
                            <Chart
                                options={chartOptions}
                                series={datosGrafico.map((item) => item.cantidad)}
                                type="donut"
                                height={320}
                                width="100%"
                            />
                        </Box>
                    </Grid>

                    {/* Leyenda */}
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                maxHeight: 320,
                                overflowY: "auto",
                                pr: 1,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                }}
                            >
                                Distribución
                            </Typography>
                            {datosConPorcentaje.map((item, index) => (
                                <LegendItem
                                    key={item.opcion}
                                    item={item}
                                    index={index}
                                    color={chartColors[index % chartColors.length]}
                                />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

//     const handleChange = (event) => {
//         setOpcion(event.target.value);
//         setDatosGraficos(datos.filter(item => item.filtro === event.target.value))
//     };

//     function Item(props) {
//         const { sx, ...other } = props;
//         return (
//             <Box
//                 sx={{
//                     p: 1,
//                     m: 1,
//                     bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#223354' : 'grey.100'),
//                     color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
//                     border: '1px solid',
//                     borderColor: (theme) =>
//                         theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
//                     borderRadius: 2,
//                     fontSize: '0.875rem',
//                     fontWeight: '700',
//                     ...sx,
//                 }}
//                 {...other}
//             />
//         );
//     }

//     Item.propTypes = {
//         /**
//          * The system prop that allows defining system overrides as well as additional CSS styles.
//          */
//         sx: PropTypes.oneOfType([
//             PropTypes.arrayOf(
//                 PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
//             ),
//             PropTypes.func,
//             PropTypes.object,
//         ]),
//     };

//     // chart
//     const optionscolumnchart = {
//         chart: {
//             locales: [{
//                 "name": "en",
//                 "options": {
//                     "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
//                     "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//                     "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
//                     "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//                     "toolbar": {
//                         "exportToSVG": "Descargar SVG",
//                         "exportToPNG": "Descargar PNG",
//                         "exportToCSV": "Descargar CSV",
//                         "menu": "Menu",
//                         "selection": "Selection",
//                         "selectionZoom": "Selection Zoom",
//                         "zoomIn": "Zoom In",
//                         "zoomOut": "Zoom Out",
//                         "pan": "Panning",
//                         "reset": "Reset Zoom"
//                     }
//                 }
//             }],
//             defaultLocale: "en",
//             type: 'donut',
//             fontFamily: "'Plus Jakarta Sans', sans-serif;",
//             foreColor: '#adb0bb',
//             toolbar: {
//                 show: true,
//                 export: {
//                     csv: {
//                         filename: titulo,
//                         columnDelimiter: ',',
//                         headerCategory: 'Serie',
//                         headerValue: 'Cantidad',
//                         dateFormatter(timestamp) {
//                             return new Date(timestamp).toDateString()
//                         }
//                     },
//                     png: {
//                         filename: titulo,
//                         columnDelimiter: ',',
//                         headerCategory: 'Serie',
//                         headerValue: 'Cantidad',
//                         dateFormatter(timestamp) {
//                             return new Date(timestamp).toDateString()
//                         }
//                     },
//                     svg: {
//                         filename: titulo,
//                         columnDelimiter: ',',
//                         headerCategory: 'Serie',
//                         headerValue: 'Cantidad',
//                         dateFormatter(timestamp) {
//                             return new Date(timestamp).toDateString()
//                         }
//                     }
//                 }
//             }
//         },
//         labels: datosGrafico.map(item => item.opcion),
//         colors: colors,
//         plotOptions: {
//             pie: {
//                 expandOnClick: true,
//                 startAngle: 0,
//                 endAngle: 360,
//                 donut: {
//                     size: '70%',
//                     background: 'transparent',
//                     labels: {
//                         show: false,
//                         style: {
//                             fontSize: '10px',
//                             fontFamily: 'Helvetica, Arial, sans-serif',
//                             fontWeight: 'bold',
//                             colors: '#000'
//                         },
//                         value: {
//                             show: true,
//                             fontSize: '10px',
//                             fontFamily: 'Helvetica, Arial, sans-serif',
//                             fontWeight: 600,
//                             color: '#fff',
//                             offsetY: 2,
//                             formatter: function (val) {
//                                 return val
//                             }
//                         },
//                         total: {
//                             show: true,
//                             label: 'Total',
//                             color: '#373d3f',
//                             formatter: function (w) {
//                                 return w
//                             }
//                         }
//                     },
//                 },
//             },
//         },
//         tooltip: {
//             theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
//             fillSeriesColor: false,
//             enabled: true,
//             y: {
//                 formatter: function (val) {
//                     return val
//                 }
//             },
//         },
//         stroke: {
//             show: false,
//         },
//         dataLabels: {
//             enabled: true,
//             fformatter: function (val) {
//                 return val + "%"
//             },
//         },
//         legend: {
//             show: false,
//         },
//         responsive: [
//             {
//                 breakpoint: 991,
//                 options: {
//                     chart: {
//                         width: 120,
//                     },
//                 },
//             },
//         ],
//     };

//     return (
//         <Card>
//             <CardContent>
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', my: 2, mx: 2 }}>
//                     {
//                         datosGrafico.map(item => {
//                             let index = datosGrafico.indexOf(item);
//                             return (
//                                 <Item key={item.opcion}>
//                                     <Stack direction="row" sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
//                                         <Avatar
//                                             sx={{ mr: 1, width: 9, height: 9, bgcolor: colors[index], svg: { display: 'none' } }}
//                                         ></Avatar>
//                                         <Typography variant="subtitle2" color="textSecondary">
//                                             {item.opcion}
//                                         </Typography>
//                                     </Stack>
//                                 </Item>
//                             )
//                         })
//                     }
//                 </Box>
//                 <Chart
//                     options={optionscolumnchart}
//                     series={datosGrafico.map(item => item.cantidad)}
//                     type="donut"
//                     height="280px"
//                     width="100%"
//                 />
//             </CardContent>
//             {/* </Box> */}
//         </Card>
//     )
// }

export default GraficoDonaApex