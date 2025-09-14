import React, { useEffect, useMemo } from 'react'
import Chart from 'src/@core/components/react-apexcharts'
import { Box, Card, CardContent, CardHeader, Chip, FormControl, IconButton, MenuItem, Select, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BarChart as BarChartIcon, Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material'

const GraficoBarraApexDetalle = ({
  datos,
  opciones,
  titulo,
  subtitulo = 'Análisis de datos',
  onRefresh,
  onExport,
  detalles = {},
  mostrarValoresEnBarra = true,
  cortarEtiquetasCada = 0, // 0 = no cortar; >0 = cortar cada N caracteres con salto de línea
  usarTooltipNativo = false, // controla si se usa tooltip nativo de Apex o el overlay custom
  tooltipValueFormatter = null // function(value, ctx) => string
}) => {
  const [datosGrafico, setDatosGraficos] = React.useState([])
  const [series, setSeries] = React.useState([])
  const [opcion, setOpcion] = React.useState([])
  const [hoverInfo, setHoverInfo] = React.useState(null)
  const hideTimer = React.useRef(null)
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    if (opciones?.length > 0) {
      const primeraOpcion = opciones[0]
      setOpcion(primeraOpcion)
      const datosFiltrados = datos.filter(item => item.filtro === primeraOpcion)
      setDatosGraficos(datosFiltrados)
      setSeries([{ name: primeraOpcion, data: datosFiltrados.map(item => item.cantidad) }])
    } else {
      setDatosGraficos(datos)
      setSeries([{ name: 'Cantidad', data: datos.map(item => item.cantidad) }])
    }
  }, [datos, opciones])

  const handleChange = event => {
    const nuevaOpcion = event.target.value
    setOpcion(nuevaOpcion)
    const datosFiltrados = datos.filter(item => item.filtro === nuevaOpcion)
    setDatosGraficos(datosFiltrados)
    setSeries([{ name: 'Cantidad', data: datosFiltrados.map(item => item.cantidad) }])
  }

  const chartColors = useMemo(
    () =>
      isDark
        ? ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1']
        : ['#059669', '#2563EB', '#7C3AED', '#D97706', '#DC2626', '#0891B2', '#65A30D', '#EA580C', '#DB2777', '#4F46E5'],
    [isDark]
  )

  const currencyFmt = useMemo(() => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }), [])

  // Etiquetas en diagonal como antes (sin multilínea)

  const usarTooltipNativoLocal = !!usarTooltipNativo

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: theme.typography.fontFamily,
        foreColor: theme.palette.text.secondary,
        toolbar: { show: false },
        background: 'transparent',
        events: usarTooltipNativoLocal
          ? {}
          : {
              dataPointMouseEnter: (event, chartContext, config) => {
                const category = chartContext?.w?.globals?.labels?.[config.dataPointIndex]
                const value = chartContext?.w?.config?.series?.[config.seriesIndex]?.data?.[config.dataPointIndex]
                if (hideTimer.current) clearTimeout(hideTimer.current)
                setHoverInfo({ category, value: Number(value) || 0 })
              },
              dataPointMouseLeave: () => {
                if (hideTimer.current) clearTimeout(hideTimer.current)
                hideTimer.current = setTimeout(() => setHoverInfo(null), 500)
              }
            }
      },
      colors: chartColors,
      plotOptions: { bar: { distributed: true, columnWidth: '60%', borderRadius: 8, dataLabels: { position: 'top' } } },
      dataLabels: {
        enabled: mostrarValoresEnBarra && datosGrafico.length <= 8,
        offsetY: -18,
        style: { fontSize: '12px', fontWeight: 600, colors: [theme.palette.text.primary] },
        formatter: v => (opcion === 'Monto' ? currencyFmt.format(v) : v.toLocaleString())
      },
      legend: { show: false },
      grid: { show: true, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeDashArray: 3 },
      yaxis: {
        labels: {
          style: { colors: theme.palette.text.secondary, fontSize: '12px', fontWeight: 500 },
          formatter: v => (opcion === 'Monto' ? currencyFmt.format(v) : v.toLocaleString())
        },
        tickAmount: 5
      },
      xaxis: {
        categories: datosGrafico.map(i => i.opcion),
        labels: {
          style: { colors: theme.palette.text.secondary, fontSize: '12px', fontWeight: 500 },
          rotate: -45,
          rotateAlways: datosGrafico.length > 6,
          formatter: val => String(val ?? ''),
          trim: false,
          hideOverlappingLabels: true
        }
      },
      tooltip: {
        enabled: usarTooltipNativoLocal,
        theme: isDark ? 'dark' : 'light',
        followCursor: usarTooltipNativoLocal,
        fixed: { enabled: !usarTooltipNativoLocal, position: 'topRight', offsetX: 0, offsetY: 0 },
        y: {
          formatter: (v, opts) => {
            try {
              if (typeof tooltipValueFormatter === 'function') {
                const ctx = {
                  opcion,
                  category: opts?.w?.globals?.labels?.[opts?.dataPointIndex],
                  seriesIndex: opts?.seriesIndex,
                  dataPointIndex: opts?.dataPointIndex,
                  w: opts?.w
                }
                return tooltipValueFormatter(v, ctx)
              }
            } catch (_) {}
            return opcion === 'Monto' ? currencyFmt.format(v) : `${Number(v).toLocaleString()} unidades`
          }
        }
      }
    }),
    [chartColors, datosGrafico, isDark, theme, opcion, currencyFmt, mostrarValoresEnBarra, usarTooltipNativoLocal, tooltipValueFormatter]
  )

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          '& .MuiCardHeader-content': { flex: '1 1 auto', minWidth: 0 },
          '& .MuiCardHeader-action': { width: { xs: '100%', sm: 'auto' }, marginTop: { xs: 1, sm: 0 } }
        }}
        avatar={
          <Box sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${theme.palette.primary.main}20` }}>
            <BarChartIcon color='primary' fontSize={isXs ? 'small' : 'medium'} />
          </Box>
        }
        title={
          <Typography
            variant='h6'
            sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: { xs: 16, sm: 18 } }}
          >
            {titulo}
          </Typography>
        }
        subheader={
          subtitulo && (
            <Typography variant='body2' sx={{ color: theme.palette.text.secondary, fontSize: { xs: 12, sm: 13 } }}>
              {subtitulo}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            {opciones?.length > 0 && (
              <FormControl size='small' sx={{ minWidth: { xs: 140, sm: 160 } }} fullWidth={isXs}>
                <Select value={opcion} onChange={handleChange} sx={{ borderRadius: 2 }}>
                  {opciones.map((opt, idx) => (
                    <MenuItem key={idx} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Chip
              label={isXs ? `${datosGrafico.length}` : `${datosGrafico.length} elementos`}
              size='small'
              sx={{ backgroundColor: `${theme.palette.primary.main}20`, color: theme.palette.primary.main, fontWeight: 600 }}
            />
            {onRefresh && (
              <Tooltip title='Actualizar datos'>
                <IconButton onClick={onRefresh} size='small' aria-label='Actualizar datos'>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            {onExport && (
              <Tooltip title='Exportar datos'>
                <IconButton onClick={onExport} size='small' aria-label='Exportar datos'>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
      />
      <CardContent sx={{ pt: 0, position: 'relative' }}>
        <Chart options={chartOptions} series={series} type='bar' height={320} />
        {!usarTooltipNativoLocal && hoverInfo && (
          <Box
            onMouseEnter={() => {
              if (hideTimer.current) clearTimeout(hideTimer.current)
            }}
            onMouseLeave={() => {
              if (hideTimer.current) clearTimeout(hideTimer.current)
              hideTimer.current = setTimeout(() => setHoverInfo(null), 400)
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              p: 2,
              borderRadius: 1.5,
              maxWidth: 460,
              backgroundColor: isDark ? 'rgba(30,37,63,0.95)' : 'rgba(255,255,255,0.95)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Typography variant='subtitle2' sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
              {hoverInfo.category}
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
              {(() => {
                try {
                  if (typeof tooltipValueFormatter === 'function') {
                    return tooltipValueFormatter(hoverInfo.value, { opcion, category: hoverInfo.category })
                  }
                } catch (_) {}
                return opcion === 'Monto' ? currencyFmt.format(hoverInfo.value) : `${Number(hoverInfo.value).toLocaleString()} unidades`
              })()}
            </Typography>
            {Array.isArray(detalles?.[hoverInfo.category]) && detalles[hoverInfo.category].length > 0 && (
              <Box sx={{ maxWidth: 460, maxHeight: 220, overflow: 'auto', pr: 1 }}>
                {detalles[hoverInfo.category].slice(0, 20).map((n, idx) => (
                  <Typography key={idx} variant='caption' sx={{ display: 'block', color: theme.palette.text.secondary, mb: 0.25, wordBreak: 'break-word' }}>
                    • {String(n).length > 80 ? String(n).slice(0, 79) + '.' : String(n)}
                  </Typography>
                ))}
                {detalles[hoverInfo.category].length > 20 && (
                  <Typography variant='caption' color='text.secondary'>
                    +{detalles[hoverInfo.category].length - 20} más
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default GraficoBarraApexDetalle
