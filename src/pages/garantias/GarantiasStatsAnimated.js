"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, Box, Typography, Avatar, Grid, useTheme, alpha } from "@mui/material"
import { Assignment, AccountBalance, CheckCircle, Warning } from "@mui/icons-material"

// Componente con animaciones de contador
export function AnimatedStatsCard({ title, targetValue, icon: IconComponent, color, delay = 0, suffix = "" }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"
  const [currentValue, setCurrentValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 segundos
    const steps = 60
    const increment = targetValue / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(targetValue, Math.floor(increment * step))
      setCurrentValue(current)

      if (step >= steps) {
        clearInterval(timer)
        setCurrentValue(targetValue)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [targetValue, isVisible])

  return (
    <Card
      elevation={isDark ? 12 : 8} 
      sx={{
        height: 140,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        bgcolor: isDark ? "#332C4E" : "background.paper",
        border: isDark ? "1px solid #4A4063" : "none",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: isDark
            ? `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${alpha(color, 0.3)}`
            : `0 12px 40px rgba(0,0,0,0.15), 0 0 20px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Box display="flex" alignItems="center" gap={2} height="100%">
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: alpha(color, isDark ? 0.2 : 0.1),
              color: color,
              boxShadow: `0 4px 20px ${alpha(color, 0.3)}`,
            }}
          >
            <IconComponent fontSize="large" />
          </Avatar>

          <Box flex={1}>
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

            <Typography
              variant="h4"
              sx={{
                fontWeight: "black",
                color: color,
                lineHeight: 1.2,
                fontSize: { xs: "1.75rem", sm: "2rem" },
                fontFamily: "monospace",
              }}
            >
              {currentValue}
              {suffix}
            </Typography>
          </Box>
        </Box>

        {/* Barra de progreso animada */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            bgcolor: alpha(color, 0.2),
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: isVisible ? "100%" : "0%",
              bgcolor: color,
              transition: "width 2s ease-out",
              transitionDelay: `${delay}ms`,
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

// Componente principal con animaciones de contador
export default function GarantiasStatsAnimated({ stats = {} }) {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const cardsConfig = [
    {
      title: "Total Garantías",
      targetValue: stats.total || 0,
      icon: Assignment,
      color: isDark ? "#64b5f6" : "#1976d2",
      delay: 0,
    },
    {
      title: "Monto Total",
      targetValue: stats.montoTotal ? Math.floor(stats.montoTotal / 1000000) : 0,
      suffix: "M",
      icon: AccountBalance,
      color: isDark ? "#66bb6a" : "#2e7d32",
      delay: 200,
    },
    {
      title: "Vigentes",
      targetValue: stats.vigentes || 0,
      icon: CheckCircle,
      color: isDark ? "#4caf50" : "#388e3c",
      delay: 400,
    },
    {
      title: "Vencidas",
      targetValue: stats.vencidas || 0,
      icon: Warning,
      color: isDark ? "#ff9800" : "#f57c00",
      delay: 600,
    },
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardsConfig.map((card, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <AnimatedStatsCard
            title={card.title}
            targetValue={card.targetValue}
            suffix={card.suffix || ""}
            icon={card.icon}
            color={card.color}
            delay={card.delay}
          />
        </Grid>
      ))}
    </Grid>
  )
}
