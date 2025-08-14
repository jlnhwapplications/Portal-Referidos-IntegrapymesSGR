// import { memo } from "react";
// import { Step, Stepper, StepLabel, Box, Typography } from "@mui/material";
// import Icon from "src/@core/components/icon";
// import { styled } from "@mui/material/styles";
// import StepConnector, {
//     stepConnectorClasses,
// } from "@mui/material/StepConnector";
// import { cloneElement, useEffect, useState } from "react";
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
// import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
// import DescriptionIcon from '@mui/icons-material/Description';
// import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

// const MultiStepProgressBar = memo(({ currentStep, theme }) => {
//     useEffect(() => {
//         razonEstadoStep(currentStep);
//     }, [currentStep]);

//     const [step, setStep] = useState(0);

//     const QontoConnector = styled(StepConnector)(({ theme }) => ({
//         [`&.${stepConnectorClasses.alternativeLabel}`]: {
//             top: 10,
//             left: "calc(-50% + 16px)",
//             right: "calc(50% + 16px)",
//         },
//         [`&.${stepConnectorClasses.active}`]: {
//             [`& .${stepConnectorClasses.line}`]: {
//                 borderColor: "#4caf50",
//             },
//         },
//         [`&.${stepConnectorClasses.completed}`]: {
//             [`& .${stepConnectorClasses.line}`]: {
//                 borderColor: "#4caf50",
//             },
//         },
//         [`& .${stepConnectorClasses.line}`]: {
//             borderColor:
//                 theme.palette.mode === "dark" ? theme.palette.action : theme.palette.action.active,
//             borderTopWidth: 3,
//             borderRadius: 1,
//         },
//     }));

//     const razonEstadoStep = (value) => {
//         switch (value) {
//             case 0:
//                 return setStep(1);
//             case 1:
//                 return setStep(2);
//             case 2:
//                 return setStep(3);
//             case 3:
//                 return setStep(4);
//             case 4:
//                 return setStep(5);
//         }
//     };

//     const steps = ['Datos de la Cuenta', 'Datos del Contacto', 'Datos Adicionales', 'Documentación', 'Confirmación'];

//     const stepIcons = {
//         'Datos de la Cuenta': <ManageAccountsIcon sx={{ fontSize: { xs: "1rem", sm: "1.7rem" }, color: theme.palette.action }} />,
//         "Datos del Contacto": (
//             <AssignmentIndIcon sx={{ fontSize: { xs: "1rem", sm: "1.7rem" }, color: "#2e2e2e"  }} />
//         ),
//         "Datos Adicionales": <RequestQuoteIcon sx={{ fontSize: { xs: "1rem", sm: "1.7rem" } }} />,
//         "Documentación": (
//             <DescriptionIcon sx={{ fontSize: { xs: "1rem", sm: "1.7rem" } }} />
//         ),
//         'Confirmación': <ThumbUpAltIcon sx={{ fontSize: { xs: "1rem", sm: "1.7rem" } }} />,
//     };

//     const getStepIcon = (label, accomplished) => {
//         const icon = stepIcons[label];
//         if (!icon) return null; // Evitar pasar undefined a cloneElement
//         return cloneElement(icon, {
//             style: { color: accomplished ? "#4caf50" : theme.palette.action.active  },
//         });
//     };

//     return (
//         <Box
//             sx={{
//                 // overflowX: "auto",
//                 minWidth: { sm: "100vw", md: "75vw", xl: "65vw" },
//                 px: { sm: 0, md: 2, xl: 8 }
//             }}
//         >
//             <Stepper icon={null} alternativeLabel connector={<QontoConnector />}>
//                 {steps.map((label, index) => {
//                     return (
//                         <Step
//                             key={index}
//                             completed={index < step}
//                             active={index === step - 1}
//                         >
//                             <StepLabel
//                                 StepIconComponent={() => getStepIcon(label, index < step)}
//                             >
//                                 <Typography
//                                     variant="caption"
//                                     color="inherit"
//                                     sx={{
//                                         color: index < step ? "#4caf50" : "inherit",
//                                         fontSize: { xs: ".75rem", sm: "0.95rem" },
//                                         fontWeight: 500,
//                                     }}
//                                 >
//                                     {label}
//                                 </Typography>
//                             </StepLabel>
//                         </Step>
//                     );
//                 })}
//             </Stepper>
//         </Box>
//     );
// });

// MultiStepProgressBar.displayName = 'MultiStepProgressBar';

// export default MultiStepProgressBar;

import { memo, useEffect, useState, useMemo } from "react"
import {
  Step,
  Stepper,
  StepLabel,
  Box,
  Typography,
  useTheme,
  alpha,
  Fade,
  Slide,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector"
import {
  ManageAccounts,
  AssignmentInd,
  RequestQuote,
  Description,
  ThumbUpAlt,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
  Error,
  Warning,
} from "@mui/icons-material"

// Configuración de pasos mejorada
const STEP_CONFIG = [
  {
    id: "account",
    label: "Datos de la Cuenta",
    shortLabel: "Cuenta",
    description: "Información básica de la cuenta",
    icon: ManageAccounts,
    estimatedTime: "1-3 min",
    color: "#1976d2",
  },
  {
    id: "contact",
    label: "Datos del Contacto",
    shortLabel: "Contacto",
    description: "Información de contacto principal",
    icon: AssignmentInd,
    estimatedTime: "2-3 min",
    color: "#7b1fa2",
  },
  {
    id: "additional",
    label: "Datos Adicionales",
    shortLabel: "Adicionales",
    description: "Información complementaria",
    icon: RequestQuote,
    estimatedTime: "2-3 min",
    color: "#f57c00",
  },
  {
    id: "documentation",
    label: "Documentación",
    shortLabel: "Docs",
    description: "Carga de documentos requeridos",
    icon: Description,
    estimatedTime: "2-5 min",
    color: "#d32f2f",
  },
  {
    id: "confirmation",
    label: "Confirmación",
    shortLabel: "Confirmar",
    description: "Revisión final y confirmación",
    icon: ThumbUpAlt,
    estimatedTime: "1 min",
    color: "#2e7d32",
  },
]

// Conector personalizado con animaciones
const EnhancedStepConnector = styled(StepConnector)(({ theme }) => {
  const isDark = theme.palette.mode === "dark"

  return {
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 24,
      left: "calc(-50% + 20px)",
      right: "calc(50% + 20px)",
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 4,
      border: 0,
      backgroundColor: isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.2),
      borderRadius: 2,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "0%",
        backgroundColor: isDark ? "#64b5f6" : "#1976d2",
        borderRadius: 2,
        transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: isDark ? alpha("#64b5f6", 0.3) : alpha("#1976d2", 0.3),
        "&::before": {
          width: "50%",
          backgroundColor: isDark ? "#64b5f6" : "#1976d2",
          boxShadow: isDark ? "0 0 8px rgba(100, 181, 246, 0.6)" : "0 0 8px rgba(25, 118, 210, 0.6)",
        },
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: isDark ? "#66bb6a" : "#2e7d32",
        "&::before": {
          width: "100%",
          backgroundColor: isDark ? "#66bb6a" : "#2e7d32",
          boxShadow: isDark ? "0 0 8px rgba(102, 187, 106, 0.6)" : "0 0 8px rgba(46, 125, 50, 0.6)",
        },
      },
    },
  }
})

// Icono de paso personalizado
const CustomStepIcon = memo(({ stepConfig, active, completed, error, warning, index, theme }) => {
  const isDark = theme.palette.mode === "dark"
  const IconComponent = stepConfig.icon

  const getIconColor = () => {
    if (error) return "#f44336"
    if (warning) return "#ff9800"
    if (completed) return isDark ? "#66bb6a" : "#2e7d32"
    if (active) return isDark ? "#64b5f6" : "#1976d2"
    return isDark ? alpha("#ffffff", 0.4) : alpha("#000000", 0.4)
  }

  const getBackgroundColor = () => {
    if (error) return alpha("#f44336", 0.1)
    if (warning) return alpha("#ff9800", 0.1)
    if (completed) return isDark ? alpha("#66bb6a", 0.2) : alpha("#2e7d32", 0.1)
    if (active) return isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.1)
    return isDark ? alpha("#ffffff", 0.05) : alpha("#000000", 0.05)
  }

  const getBorderColor = () => {
    if (error) return "#f44336"
    if (warning) return "#ff9800"
    if (completed) return isDark ? "#66bb6a" : "#2e7d32"
    if (active) return isDark ? "#64b5f6" : "#1976d2"
    return isDark ? alpha("#ffffff", 0.2) : alpha("#000000", 0.2)
  }

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {stepConfig.label}
          </Typography>
          <Typography variant="caption" color="inherit">
            {stepConfig.description}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            ⏱️ {stepConfig.estimatedTime}
          </Typography>
        </Box>
      }
      placement="top"
      arrow
    >
      <Avatar
        sx={{
          width: { xs: 34, xl: 48 },
          height: { xs: 34, xl: 48 },
          bgcolor: getBackgroundColor(),
          border: `2px solid ${getBorderColor()}`,
          color: getIconColor(),
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "visible",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: `0 8px 25px ${alpha(getIconColor(), 0.3)}`,
          },
          "&::before": completed && {
            content: '""',
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: "50%",
            background: `conic-gradient(${getIconColor()} 0deg, ${getIconColor()} 360deg)`,
            zIndex: -1,
            animation: "rotate 2s linear infinite",
          },
        }}
      >
        {error ? (
          <Error fontSize="medium" />
        ) : warning ? (
          <Warning fontSize="medium" />
        ) : completed ? (
          <CheckCircle fontSize="medium" />
        ) : active ? (
          <IconComponent fontSize="medium" />
        ) : (
          <RadioButtonUnchecked fontSize="medium" />
        )}

        {/* Número del paso */}
        <Chip
          label={index + 1}
          size="small"
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            minWidth: 20,
            height: 20,
            fontSize: "0.75rem",
            fontWeight: "bold",
            bgcolor: getIconColor(),
            color: "#ffffff",
            "& .MuiChip-label": {
              px: 0.5,
            },
          }}
        />
      </Avatar>
    </Tooltip>
  )
})

CustomStepIcon.displayName = "CustomStepIcon"

// Etiqueta de paso personalizada
const CustomStepLabel = memo(({ stepConfig, active, completed, error, warning, isMobile, theme }) => {
  const isDark = theme.palette.mode === "dark"

  const getTextColor = () => {
    if (error) return "#f44336"
    if (warning) return "#ff9800"
    if (completed) return isDark ? "#66bb6a" : "#2e7d32"
    if (active) return isDark ? "#64b5f6" : "#1976d2"
    return "text.secondary"
  }

  return (
    <Box sx={{ textAlign: "center", mt: 1 }}>
      <Typography
        // variant={isMobile ? "caption" : "body3"}
        fontWeight={active || completed ? "bold" : "medium"}
        color={getTextColor()}
        sx={{
          fontSize: { xs: 12, xl: 14 },
          transition: "all 0.3s ease",
          lineHeight: 1.2,
        }}
      >
        {isMobile ? stepConfig.shortLabel : stepConfig.label}
      </Typography>

      {/* {!isMobile && (active || completed) && (
        <Fade in timeout={600}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.5,
              fontStyle: "italic",
            }}
          >
            {stepConfig.description}
          </Typography>
        </Fade>
      )} */}

      {/* Indicador de estado */}
      {(error || warning) && (
        <Slide direction="up" in timeout={400}>
          <Chip
            label={error ? "Error" : "Atención"}
            size="small"
            color={error ? "error" : "warning"}
            variant="outlined"
            sx={{
              mt: 0.5,
              fontSize: "0.7rem",
              height: 20,
            }}
          />
        </Slide>
      )}
    </Box>
  )
})

CustomStepLabel.displayName = "CustomStepLabel"

// Barra de progreso general
const ProgressHeader = memo(({ currentStep, totalSteps, theme }) => {
  const isDark = theme.palette.mode === "dark"
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Progreso del Formulario
        </Typography>
        <Chip
          label={`${currentStep + 1} de ${totalSteps}`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: isDark ? alpha("#64b5f6", 0.1) : alpha("#1976d2", 0.1),
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            background: isDark
              ? "linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%)"
              : "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
            boxShadow: isDark ? "0 0 10px rgba(100, 181, 246, 0.4)" : "0 0 10px rgba(25, 118, 210, 0.4)",
          },
        }}
      />

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography variant="caption" color="text.secondary">
          {progress.toFixed(0)}% completado
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Tiempo estimado restante:{" "}
          {STEP_CONFIG.slice(currentStep + 1).reduce((acc, step) => acc + Number.parseInt(step.estimatedTime), 0)} min
        </Typography>
      </Box>
    </Box>
  )
})

ProgressHeader.displayName = "ProgressHeader"

// Componente principal mejorado
const MultiStepProgressBarEnhanced = memo(
  ({
    currentStep = 0,
    stepErrors = {},
    stepWarnings = {},
    showProgress = true,
    showEstimatedTime = true,
    onStepClick = null,
    variant = "default", // "default", "compact", "minimal"
    ...props
  }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"
    const [activeStep, setActiveStep] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    // Detectar dispositivo móvil
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Actualizar paso activo
    useEffect(() => {
      setActiveStep(Math.max(0, Math.min(currentStep, STEP_CONFIG.length - 1)))
    }, [currentStep])

    // Memoizar configuración de pasos
    const stepsConfig = useMemo(() => STEP_CONFIG, [])

    // Handler para click en paso
    const handleStepClick = (stepIndex) => {
      if (onStepClick && stepIndex <= currentStep) {
        onStepClick(stepIndex)
      }
    }

    // Renderizado compacto para móviles
    if (variant === "compact" || (isMobile && variant !== "minimal")) {
      return (
        <Box sx={{ mb: 3 }}>
          {showProgress && <ProgressHeader currentStep={activeStep} totalSteps={stepsConfig.length} theme={theme} />}

          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            {stepsConfig.map((stepConfig, index) => (
              <Box
                key={stepConfig.id}
                onClick={() => handleStepClick(index)}
                sx={{
                  cursor: onStepClick && index <= currentStep ? "pointer" : "default",
                  opacity: index > currentStep ? 0.5 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <CustomStepIcon
                  stepConfig={stepConfig}
                  active={index === activeStep}
                  completed={index < activeStep}
                  error={stepErrors[stepConfig.id]}
                  warning={stepWarnings[stepConfig.id]}
                  index={index}
                  theme={theme}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )
    }

    // Renderizado minimal
    if (variant === "minimal") {
      return (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={((activeStep + 1) / stepsConfig.length) * 100}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: isDark ? alpha("#64b5f6", 0.1) : alpha("#1976d2", 0.1),
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Paso {activeStep + 1} de {stepsConfig.length}: {stepsConfig[activeStep]?.label}
          </Typography>
        </Box>
      )
    }

    // Renderizado completo por defecto
    return (
      <Box
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2, md: 4 },
          py: 3,
          ...props.sx,
        }}
      >
        {showProgress && <ProgressHeader currentStep={activeStep} totalSteps={stepsConfig.length} theme={theme} />}

        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<EnhancedStepConnector />}
          sx={{
            "& .MuiStep-root": {
              cursor: onStepClick ? "pointer" : "default",
            },
          }}
        >
          {stepsConfig.map((stepConfig, index) => (
            <Step
              key={stepConfig.id}
              completed={index < activeStep}
              active={index === activeStep}
              onClick={() => handleStepClick(index)}
              sx={{
                "& .MuiStepLabel-root": {
                  cursor: onStepClick && index <= currentStep ? "pointer" : "default",
                },
              }}
            >
              <StepLabel
                StepIconComponent={() => (
                  <CustomStepIcon
                    stepConfig={stepConfig}
                    active={index === activeStep}
                    completed={index < activeStep}
                    error={stepErrors[stepConfig.id]}
                    warning={stepWarnings[stepConfig.id]}
                    index={index}
                    theme={theme}
                  />
                )}
              >
                <CustomStepLabel
                  stepConfig={stepConfig}
                  active={index === activeStep}
                  completed={index < activeStep}
                  error={stepErrors[stepConfig.id]}
                  warning={stepWarnings[stepConfig.id]}
                  isMobile={isMobile}
                  theme={theme}
                />
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Información adicional del paso actual */}
        {showEstimatedTime && (
          <Fade in timeout={600}>
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: isDark ? alpha("#64b5f6", 0.05) : alpha("#1976d2", 0.05),
                borderRadius: 2,
                border: `1px solid ${isDark ? alpha("#64b5f6", 0.2) : alpha("#1976d2", 0.2)}`,
                textAlign: "center",
              }}
            >
              <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
                <Schedule fontSize="small" color="primary" />
                <Typography variant="body2" color="primary" fontWeight="medium">
                  Paso Actual: {stepsConfig[activeStep]?.label}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stepsConfig[activeStep]?.description} • Tiempo estimado: {stepsConfig[activeStep]?.estimatedTime}
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Estilos para animaciones */}
        <style jsx global>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      </Box>
    )
  },
)

MultiStepProgressBarEnhanced.displayName = "MultiStepProgressBarEnhanced"

export default MultiStepProgressBarEnhanced

