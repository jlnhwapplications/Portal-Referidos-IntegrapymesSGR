"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, Box, Typography, Avatar, Grid, useTheme, alpha, Skeleton } from "@mui/material"
import {
  Assignment,
  AccountBalance,
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
  Security,
  Schedule,
} from "@mui/icons-material"

// Componente de card individual animado
function StatsCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  color,
  trend = null,
  trendDirection = "up",
  delay = 0,
  loading = false,
  onClick = null,
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (loading) {
    return (
      <Card
        elevation={isDark ? 8 : 4}
        sx={{
          height: 140,
          bgcolor: isDark ? "#332C4E" : "background.paper",
          border: isDark ? "1px solid #4A4063" : "none",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={56} height={56} />
            <Box flex={1}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = () => {
    if (!trend) return null
    return trendDirection === "up" ? (
      <TrendingUp fontSize="small" sx={{ color: isDark ? "#66bb6a" : "#2e7d32" }} />
    ) : (
      <TrendingDown fontSize="small" sx={{ color: isDark ? "#f44336" : "#d32f2f" }} />
    )
  }

  const getTrendColor = () => {
    if (!trend) return "text.secondary"
    return trendDirection === "up" ? (isDark ? "#66bb6a" : "#2e7d32") : isDark ? "#f44336" : "#d32f2f"
  }

  return (
    <Card
      elevation={isDark ? 12 : 8}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      sx={{
        height: {xs: 80, xl: 140},
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: isDark ? "#332C4E" : "background.paper",
        border: isDark ? "1px solid #4A4063" : "none",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          zIndex: 0,
        },
        "&:hover": {
          transform: isVisible ? "translateY(-8px) scale(1.02)" : "translateY(30px)",
          boxShadow: isDark
            ? `0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px ${alpha(color, 0.2)}, 0 0 20px ${alpha(color, 0.3)}`
            : `0 12px 40px rgba(0,0,0,0.15), 0 0 20px ${alpha(color, 0.2)}`,
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Box display="flex" alignItems="center" gap={2} height="100%">
          {/* Avatar con icono */}
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: alpha(color, isDark ? 0.2 : 0.1),
              color: color,
              transition: "all 0.3s ease",
              transform: isHovered ? "scale(1.1) rotate(5deg)" : "scale(1)",
              boxShadow: isDark ? `0 4px 20px ${alpha(color, 0.3)}` : `0 4px 20px ${alpha(color, 0.2)}`,
            }}
          >
            <IconComponent fontSize="large" />
          </Avatar>

          {/* Contenido */}
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center" sx={{mt:2}}>
            {/* Título */}
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              {title}
            </Typography>

            {/* Valor principal */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: "black",
                color: color,
                lineHeight: 1.2,
                mb: 0.5,
                fontSize: { xs: "1.75rem", sm: "2rem" },
                fontFamily: "monospace",
                transition: "all 0.3s ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              {value}
            </Typography>

            {/* Subtítulo y trend */}
            {/* <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </Typography>

              {trend && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getTrendIcon()}
                  <Typography
                    variant="caption"
                    sx={{
                      color: getTrendColor(),
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  >
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box> */}
          </Box>
        </Box>

        {/* Indicador de progreso opcional */}
        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              bgcolor: alpha(color, 0.3),
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                bgcolor: color,
                transform: "scaleX(0)",
                transformOrigin: "left",
                animation: "progressBar 0.8s ease-out forwards",
                "@keyframes progressBar": {
                  "0%": {
                    transform: "scaleX(0)",
                  },
                  "100%": {
                    transform: "scaleX(1)",
                  },
                },
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Componente principal de las 4 cards de estadísticas
export default function GarantiasStatsCards({ stats = {}, loading = false, onCardClick = null }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  // Configuración de las 4 cards
  const cardsConfig = [
    {
      id: "total",
      title: "Total Garantías",
      value: stats.total || 0,
      subtitle: "Todas las garantías registradas",
      icon: Assignment,
      color: isDark ? "#64b5f6" : "#1976d2",
      trend: stats.totalTrend || "+12%",
      trendDirection: "up",
    },
    {
      id: "monto",
      title: "Monto Total",
      value: stats.montoTotal ? `$${(stats.montoTotal / 1000000).toFixed(1)}M` : "$0",
      subtitle: "Valor total en garantías",
      icon: AccountBalance,
      color: isDark ? "#66bb6a" : "#2e7d32",
      trend: stats.montoTrend || "+8.5%",
      trendDirection: "up",
    },
    {
      id: "vigentes",
      title: "Vigentes",
      value: stats.vigentes || 0,
      subtitle: "Garantías activas y válidas",
      icon: CheckCircle,
      color: isDark ? "#4caf50" : "#388e3c",
      trend: stats.vigentesTrend || "+5%",
      trendDirection: "up",
    },
    {
      id: "vencidas",
      title: "Vencidas",
      value: stats.vencidas || 0,
      subtitle: "Garantías fuera de vigencia",
      icon: Warning,
      color: isDark ? "#ff9800" : "#f57c00",
      trend: stats.vencidasTrend || "-2%",
      trendDirection: "down",
    },
  ]

  const handleCardClick = (cardId) => {
    if (onCardClick) {
      onCardClick(cardId)
    }
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardsConfig.map((card, index) => (
        <Grid item xs={12} sm={6} lg={3} key={card.id}>
          <StatsCard
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            trendDirection={card.trendDirection}
            delay={index * 150}
            loading={loading}
            onClick={() => handleCardClick(card.id)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

// Componente de cards compactas para espacios reducidos
export function GarantiasStatsCardsCompact({ stats = {}, loading = false }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const compactConfig = [
    {
      title: "Total",
      value: stats.total || 0,
      icon: Security,
      color: isDark ? "#64b5f6" : "#1976d2",
    },
    {
      title: "Monto",
      value: stats.montoTotal ? `$${(stats.montoTotal / 1000000).toFixed(1)}M` : "$0",
      icon: AccountBalance,
      color: isDark ? "#66bb6a" : "#2e7d32",
    },
    {
      title: "Vigentes",
      value: stats.vigentes || 0,
      icon: CheckCircle,
      color: isDark ? "#4caf50" : "#388e3c",
    },
    {
      title: "Vencidas",
      value: stats.vencidas || 0,
      icon: Schedule,
      color: isDark ? "#ff9800" : "#f57c00",
    },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {compactConfig.map((card, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Card
            elevation={isDark ? 4 : 2}
            sx={{
              bgcolor: isDark ? "#332C4E" : "background.paper",
              border: isDark ? "1px solid #4A4063" : "none",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: isDark ? "0 8px 25px rgba(0,0,0,0.4)" : "0 8px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 2, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: alpha(card.color, 0.1),
                  color: card.color,
                  mx: "auto",
                  mb: 1,
                }}
              >
                <card.icon fontSize="small" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color={card.color} gutterBottom>
                {loading ? <Skeleton width={40} /> : card.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
