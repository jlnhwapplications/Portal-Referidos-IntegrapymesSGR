import React, { useEffect, useMemo } from 'react'
import Chart from 'src/@core/components/react-apexcharts'
import { Box, Card, CardContent, CardHeader, Chip, FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart as BarChartIcon, Download as DownloadIcon, Refresh as RefreshIcon } from "@mui/icons-material"


let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const GraficoBarraApex = ({ datos, opciones, titulo, subtitulo = "Análisis de datos", onRefresh,
  onExport}) => {                                                         
    const [datosGrafico, setDatosGraficos] = React.useState([])
    const [series, setSeries] = React.useState([])
    const [opcion, setOpcion] = React.useState([])
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark"

    // React.useEffect(() => {
    //     if (opciones?.length > 0) {
    //         let opcion = opciones[0]
    //         setOpcion(opcion)
    //         setDatosGraficos(datos.filter(item => item.filtro === opcion))
    //         let resultado = [
    //             {
    //                 name: 'Cantidad',
    //                 data: datos.filter(item => item.filtro === opcion).map(item => item.cantidad),
    //             }
    //         ]
    //         setSeries(resultado)
    //     } else {
    //         setDatosGraficos(datos)
    //         let resultado = [
    //             {
    //                 name: 'Cantidad',
    //                 data: datos.map(item => item.cantidad),
    //             }
    //         ]
    //         setSeries(resultado)
    //     }
    // }, [datos])

    // Efecto mejorado para inicializar datos
    useEffect(() => {
        if (opciones?.length > 0) {
            const primeraOpcion = opciones[0]
            setOpcion(primeraOpcion)
            const datosFiltrados = datos.filter((item) => item.filtro === primeraOpcion)
            setDatosGraficos(datosFiltrados)
            setSeries([
                {
                    name: "Cantidad",
                    data: datosFiltrados.map((item) => item.cantidad),
                },
            ])
        } else {
            setDatosGraficos(datos)
            setSeries([
                {
                    name: "Cantidad",
                    data: datos.map((item) => item.cantidad),
                },
            ])
        }
    }, [datos, opciones])


    // Handler mejorado para cambio de opción
    const handleChange = (event) => {
        const nuevaOpcion = event.target.value
        setOpcion(nuevaOpcion)

        const datosFiltrados = datos.filter((item) => item.filtro === nuevaOpcion)
        setDatosGraficos(datosFiltrados)
        setSeries([
            {
                name: "Cantidad",
                data: datosFiltrados.map((item) => item.cantidad),
            },
        ])
    }

    // Colores mejorados para el tema
    const chartColors = useMemo(() => {
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
    }, [isDark])


    // Configuración mejorada del gráfico
    const chartOptions = useMemo(
        () => ({
            chart: {
                type: "bar",
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
            colors: chartColors,
            plotOptions: {
                bar: {
                    distributed: true,
                    horizontal: false,
                    columnWidth: "60%",
                    borderRadius: 8,
                    borderRadiusApplication: "end",
                    borderRadiusWhenStacked: "all",
                    dataLabels: {
                        position: "top",
                    },
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            dataLabels: {
                enabled: true,
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    fontFamily: theme.typography.fontFamily,
                    fontWeight: 600,
                    colors: [theme.palette.text.primary],
                },
                formatter: (val) => val.toLocaleString(),
            },
            legend: {
                show: false,
            },
            grid: {
                show: true,
                borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                strokeDashArray: 3,
                position: "back",
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 0,
                    left: 10,
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: theme.palette.text.secondary,
                        fontSize: "12px",
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 500,
                    },
                    formatter: (value) => value.toLocaleString(),
                },
                tickAmount: 5,
            },
            xaxis: {
                categories: datosGrafico.map((item) => item.opcion),
                labels: {
                    style: {
                        colors: theme.palette.text.secondary,
                        fontSize: "12px",
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 500,
                    },
                    rotate: -45,
                    rotateAlways: datosGrafico.length > 6,
                    maxHeight: 120,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
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
                marker: {
                    show: true,
                },
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                    const value = series[seriesIndex][dataPointIndex]
                    const category = w.globals.labels[dataPointIndex]

                    return `
          <div style="padding: 12px; border-radius: 8px; background: ${isDark ? "rgba(30, 37, 63, 0.95)" : "rgba(255, 255, 255, 0.95)"
                        }; border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
                        }; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
            <div style="font-weight: 600; color: ${theme.palette.text.primary}; margin-bottom: 4px;">
              ${category}
            </div>
            <div style="font-weight: 700; font-size: 16px; color: ${chartColors[dataPointIndex % chartColors.length]};">
              ${value.toLocaleString()} unidades
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
                        plotOptions: {
                            bar: {
                                columnWidth: "80%",
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        xaxis: {
                            labels: {
                                rotate: -90,
                            },
                        },
                    },
                },
            ],
        }),
        [theme, isDark, chartColors, datosGrafico, titulo],
    )


    // const handleChange = (event) => {
    //     setOpcion(event.target.value);
    //     setDatosGraficos(datos.filter(item => item.filtro === event.target.value))
    //     let resultado = [
    //         {
    //             name: 'Cantidad',
    //             data: datos.filter(item => item.filtro === event.target.value).map(item => item.cantidad),
    //         }
    //     ]
    //     setSeries(resultado)
    // };




    const optionscolumnchart = {
        chart: {
            locales: [{
                "name": "en",
                "options": {
                    "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    "toolbar": {
                        "exportToSVG": "Descargar SVG",
                        "exportToPNG": "Descargar PNG",
                        "exportToCSV": "Descargar CSV",
                        "menu": "Menu",
                        "selection": "Selection",
                        "selectionZoom": "Selection Zoom",
                        "zoomIn": "Zoom In",
                        "zoomOut": "Zoom Out",
                        "pan": "Panning",
                        "reset": "Reset Zoom"
                    }
                }
            }],
            defaultLocale: "en",
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
                export: {
                    csv: {
                        filename: titulo,
                        columnDelimiter: ',',
                        headerCategory: 'Serie',
                        headerValue: 'Cantidad',
                        dateFormatter(timestamp) {
                            return new Date(timestamp).toDateString()
                        }
                    },
                    png: {
                        filename: titulo,
                        columnDelimiter: ',',
                        headerCategory: 'Serie',
                        headerValue: 'Cantidad',
                        dateFormatter(timestamp) {
                            return new Date(timestamp).toDateString()
                        }
                    },
                    svg: {
                        filename: titulo,
                        columnDelimiter: ',',
                        headerCategory: 'Serie',
                        headerValue: 'Cantidad',
                        dateFormatter(timestamp) {
                            return new Date(timestamp).toDateString()
                        }
                    }
                }
            },
        },
        colors: ["rgb(84, 230, 0)", "rgb(255, 45, 0)", "rgb(255, 163, 25)", "rgb(87, 202, 34)", "rgb(0, 155, 255)",
            "rgb(255, 45, 0)", "rgb(243, 156, 18)", "rgb(87, 124, 96)", "rgb(77, 103, 117)", "rgb(239, 226, 152)"],
        plotOptions: {
            bar: {
                distributed: true, // this line is mandatory
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            show: true,
            borderColor: '#90A4AE',
            strokeDashArray: 2,
            position: 'back',
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            row: {
                colors: undefined,
                opacity: 0.5
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        },

        yaxis: {
            labels: {
                formatter: function (value) {
                    return value;
                }
            },
            style: {
                colors: ['#82ca9d'],
                fontWeight: 'bold',
            },
            tickAmount: 4,
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#8884d8',
                    fontWeight: 'bold',
                },
            },
            categories: datosGrafico.map(item => item.opcion),
            colors: ["rgb(84, 230, 0)", "rgb(255, 45, 0)", "rgb(255, 163, 25)", "rgb(93, 173, 226)", "rgb(187, 143, 206)",
                "rgb(46, 204, 113)", "rgb(243, 156, 18)", "rgb(87, 124, 96)", "rgb(77, 103, 117)", "rgb(239, 226, 152)"],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

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
                                <BarChartIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
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

                            {/* Chip con total de datos */}
                            <Chip
                                label={`${datosGrafico.length} elementos`}
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
                <Box
                    sx={{
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
                    <Chart options={chartOptions} series={series} type="bar" height={320} />
                </Box>
            </CardContent>
        </Card>
        // <Card>
        //     {/* <Box sx={{
        //         "& .apexcharts-menu": {
        //             background: '#223354!important',
        //             fontSize: '12px',
        //             fontFamily: 'Helvetica, Arial, sans-serif',
        //             fontWeight: 'normal',
        //             color: "rgba(255, 255, 255, 0.8)"
        //         },
        //         "& .apexcharts-menu:hover": {
        //             color: "#223354!important"
        //         },
        //     }}> */}
        //     <CardContent>
        //         <Chart
        //             options={optionscolumnchart}
        //             series={series}
        //             type="bar"
        //             height="280px"
        //         />
        //     </CardContent>
        //     {/* </Box> */}
        // </Card>
    )
}

export default GraficoBarraApex