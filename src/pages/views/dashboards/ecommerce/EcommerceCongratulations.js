// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { Avatar, Chip, useTheme } from '@mui/material'
import { Celebration as CelebrationIcon, Person as PersonIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material"
// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 185,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))

const EcommerceCongratulations = ({ nombre, descripcion }) => {
  const theme = useTheme()
  const isDark = theme?.palette?.mode === 'dark'


  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        width: "100%",
        background: isDark
          ? "linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: isDark ? "0 20px 40px rgba(30, 37, 63, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
            : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
          borderRadius: 4,
          zIndex: 1,
        },
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark ? "0 25px 50px rgba(30, 37, 63, 0.5)" : "0 25px 50px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          zIndex: 2,
          p: 4,
          "&:last-child": {
            pb: 4,
          },
        }}
      >
        {/* Contenido principal */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                <PersonIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  background: isDark
                    ? "linear-gradient(45deg, #ffffff, #e2e8f0)"
                    : "linear-gradient(45deg, #1a1a1a, #333333)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: isDark ? "0 2px 4px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                ¡Bienvenido de vuelta! {nombre}
              </Typography>
            </Box>
            {/* Chip de estado movido aquí */}
            <Chip
              icon={<TrendingUpIcon sx={{ fontSize: "16px !important" }} />}
              label="Activo"
              size="small"
              sx={{
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "#10b981",
                },
              }}
            />
          </Box>
          {/* <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              opacity: 0.95,
            }}
          >
            {nombre}
            <Box component="span" sx={{ fontSize: "1.2em" }}>
              🎉
            </Box>
          </Typography> */}
        </Box>

        {/* Descripción */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            p: 2.5,
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              lineHeight: 1.6,
              fontSize: "1rem",
            }}
          >
            {descripcion}
          </Typography>
        </Box>

        {/* Indicadores de progreso decorativos */}
        {/* <Box sx={{ display: "flex", gap: 1, mt: 3, justifyContent: "center" }}>
          {[1, 2, 3, 4].map((dot, index) => (
            <Box
              key={dot}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  index < 3 ? theme.palette.primary.main : isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box> */}
      </CardContent>
    </Card >
    // <Card
    //   sx={{
    //     position: "relative",
    //     overflow: "hidden",
    //     borderRadius: 4,
    //     width: "100%",
    //     background: "linear-gradient(135deg, #1E253F 0%, #2A3B5C 50%, #1A2138 100%)",
    //     boxShadow: "0 20px 40px rgba(30, 37, 63, 0.4)",
    //     border: "1px solid rgba(255, 255, 255, 0.1)",
    //     "&::before": {
    //       content: '""',
    //       position: "absolute",
    //       top: 0,
    //       left: 0,
    //       right: 0,
    //       bottom: 0,
    //       background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
    //       borderRadius: 4,
    //       zIndex: 1,
    //     },
    //     "&:hover": {
    //       transform: "translateY(-4px)",
    //       boxShadow: "0 25px 50px rgba(30, 37, 63, 0.5)",
    //       transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    //     },
    //   }}
    // >
    //   {/* Elementos decorativos */}
    //   <Box
    //     sx={{
    //       position: "absolute",
    //       top: -10,
    //       right: -10,
    //       width: 80,
    //       height: 80,
    //       background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    //       borderRadius: "50%",
    //       opacity: 0.1,
    //       zIndex: 0,
    //     }}
    //   />
    //   <Box
    //     sx={{
    //       position: "absolute",
    //       bottom: -15,
    //       left: -15,
    //       width: 60,
    //       height: 60,
    //       background: "linear-gradient(45deg, #48cae4, #023e8a)",
    //       borderRadius: "50%",
    //       opacity: 0.1,
    //       zIndex: 0,
    //     }}
    //   />

    //   <CardContent
    //     sx={{
    //       position: "relative",
    //       zIndex: 2,
    //       p: 4,
    //       "&:last-child": {
    //         pb: 4,
    //       },
    //     }}
    //   >
    //     <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
    //       {/* Avatar y chip de estado */}
    //       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    //         <Avatar
    //           sx={{
    //             width: 56,
    //             height: 56,
    //             background: "linear-gradient(45deg, #ffffff20, #ffffff10)",
    //             border: "2px solid rgba(255, 255, 255, 0.3)",
    //             backdropFilter: "blur(10px)",
    //           }}
    //         >
    //           <PersonIcon sx={{ color: "white", fontSize: 28 }} />
    //         </Avatar>
    //         <Chip
    //           icon={<TrendingUpIcon sx={{ fontSize: "16px !important" }} />}
    //           label="Activo"
    //           size="small"
    //           sx={{
    //             backgroundColor: "rgba(16, 185, 129, 0.2)",
    //             color: "#10b981",
    //             border: "1px solid rgba(16, 185, 129, 0.3)",
    //             fontWeight: 600,
    //             "& .MuiChip-icon": {
    //               color: "#10b981",
    //             },
    //           }}
    //         />
    //       </Box>

    //       {/* Ícono decorativo */}
    //       <Box
    //         sx={{
    //           backgroundColor: "rgba(255, 255, 255, 0.15)",
    //           borderRadius: 3,
    //           p: 1.5,
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <CelebrationIcon sx={{ color: "#feca57", fontSize: 32 }} />
    //       </Box>
    //     </Box>

    //     {/* Contenido principal */}
    //     <Box sx={{ mb: 3 }}>
    //       <Typography
    //         variant="h4"
    //         sx={{
    //           color: "white",
    //           fontWeight: 700,
    //           mb: 1,
    //           background: "linear-gradient(45deg, #ffffff, #f8f9fa)",
    //           backgroundClip: "text",
    //           WebkitBackgroundClip: "text",
    //           WebkitTextFillColor: "transparent",
    //           textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    //         }}
    //       >
    //         ¡Bienvenido de vuelta! {nombre}.
    //       </Typography>

    //       {/* <Typography
    //         variant="h5"
    //         sx={{
    //           color: "rgba(255, 255, 255, 0.9)",
    //           fontWeight: 600,
    //           mb: 2,
    //           display: "flex",
    //           alignItems: "center",
    //           gap: 1,
    //         }}
    //       >

    //         <Box component="span" sx={{ fontSize: "1.2em" }}>
    //           🎉
    //         </Box>
    //       </Typography> */}
    //     </Box>

    //     {/* Descripción */}
    //     <Box
    //       sx={{
    //         backgroundColor: "rgba(255, 255, 255, 0.1)",
    //         borderRadius: 2,
    //         p: 2.5,
    //         border: "1px solid rgba(255, 255, 255, 0.15)",
    //         backdropFilter: "blur(10px)",
    //       }}
    //     >
    //       <Typography
    //         variant="body1"
    //         sx={{
    //           color: "rgba(255, 255, 255, 0.9)",
    //           fontWeight: 500,
    //           lineHeight: 1.6,
    //           fontSize: "1rem",
    //         }}
    //       >
    //         {descripcion}
    //       </Typography>
    //     </Box>

    //     {/* Indicadores de progreso decorativos */}
    //     <Box sx={{ display: "flex", gap: 1, mt: 3, justifyContent: "center" }}>
    //       {[1, 2, 3, 4].map((dot, index) => (
    //         <Box
    //           key={dot}
    //           sx={{
    //             width: 8,
    //             height: 8,
    //             borderRadius: "50%",
    //             backgroundColor: index < 3 ? "#10b981" : "rgba(255, 255, 255, 0.3)",
    //             transition: "all 0.3s ease",
    //           }}
    //         />
    //       ))}
    //     </Box>
    //   </CardContent>
    // </Card>
    // <Card sx={{ position: 'relative', overflow: 'visible' }}>
    //   <CardContent sx={{ pt: 0, p: theme => `${theme.spacing(8.25, 7.5, 6.25, 7.5)} !important` }}>
    //     <Grid container spacing={2} px={{ pt: 0 }}>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant='h5' sx={{ mb: 6.5 }}>
    //           Bienvenido{' '}
    //           <Box component='span' sx={{ fontWeight: 'bold' }}>
    //             {nombre} ! 🎉
    //           </Box>
    //         </Typography>
    //         <Typography variant='body1' sx={{ fontWeight: '500' }}>{descripcion}</Typography>
    //       </Grid>
    //     </Grid>
    //   </CardContent>
    // </Card>
  )
}

export default EcommerceCongratulations
