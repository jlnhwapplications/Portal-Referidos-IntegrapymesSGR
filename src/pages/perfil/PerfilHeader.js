// // ** React Imports
// import { useState, useEffect, useContext } from 'react'

// // ** MUI Components
// import Box from '@mui/material/Box'
// import Card from '@mui/material/Card'
// import Button from '@mui/material/Button'
// import { styled } from '@mui/material/styles'
// import CardMedia from '@mui/material/CardMedia'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'

// // ** Icon Imports
// import Icon from '@/@core/components/icon'

// import toast from 'react-hot-toast';
// import { Badge, IconButton } from '@mui/material'
// import { useAuth } from '@/hooks/useAuth'
// import { AuthContext } from '@/context/AuthContext'


// const PerfilHeader = () => {
//     const { referido } = useContext(AuthContext);
//     const [data, setData] = useState(null)
//     const [profilePicture, setProfilePicture] = useState(null);
//     const [coverPicture, setCoverPicture] = useState(null);
//     const { actualizarFotoPerfil, actualizarFotoPortada, user } = useAuth()

//     useEffect(() => {
//         if (user && user.photoURL) {
//             setProfilePicture(user?.photoURL)
//             // setCoverPicture(user.photoPORTADA)
//         }
//     }, [user])

//     const designationIcon = data?.designationIcon || 'mdi:briefcase-outline'

//     const ProfilePicture = styled('img')(({ theme }) => ({
//         width: 160,
//         height: 160,
//         borderRadius: theme.shape.borderRadius, // Para hacer un círculo con la imagen de perfil
//         border: `5px solid ${theme.palette.common.white}`,
//         objectFit: 'cover', // Ajustar la imagen para cubrir completamente el contenedor
//         objectPosition: 'center', // Centrar la imagen dentro del contenedor
//         [theme.breakpoints.down('md')]: {
//             marginBottom: theme.spacing(4)
//         }
//     }))

//     const handleProfilePictureChange = (event) => {
//         const file = event.target.files[0];

//         if (file === undefined) {
//             console.log("no se selecciono ninguna imagen");
//             return;
//         }

//         if (
//             file.type !== "image/png" &&
//             file.type !== "image/jpg" &&
//             file.type !== "image/jpeg"
//         ) {
//             toast.error("El formato de la foto debe ser png/jpg/jpeg");
//             return;
//         }

//         const reader = new FileReader();

//         reader.onload = () => {
//             const imageDataUrl = reader.result;
//             const imgBlob = dataURLToBlob(imageDataUrl); // Convertir el data URL a un blob
//             actualizarFotoPerfil(imgBlob).then(() => {
//                 setProfilePicture(imageDataUrl);
//             });
//         };

//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleCoverPictureChange = (event) => {
//         const file = event.target.files[0];

//         if (file === undefined) {
//             console.log("no se selecciono ninguna imagen");
//             return;
//         }

//         if (
//             file.type !== "image/png" &&
//             file.type !== "image/jpg" &&
//             file.type !== "image/jpeg"
//         ) {
//             toast.error("El formato de la foto debe ser png/jpg/jpeg");
//             return;
//         }

//         const reader = new FileReader();

//         reader.onload = () => {
//             const imageDataUrl = reader.result;
//             const imgBlob = dataURLToBlob(imageDataUrl); // Convertir el data URL a un blob
//             actualizarFotoPortada(imgBlob).then(() => {
//                 setCoverPicture(imageDataUrl);
//             });
//         };

//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };


//     // Función auxiliar para convertir un data URL a un blob
//     const dataURLToBlob = (dataURL) => {
//         const arr = dataURL.split(",");
//         const mime = arr[0].match(/:(.*?);/)[1];
//         const bstr = atob(arr[1]);
//         let n = bstr.length;
//         const u8arr = new Uint8Array(n);
//         while (n--) {
//             u8arr[n] = bstr.charCodeAt(n);
//         }
//         return new Blob([u8arr], { type: mime });
//     };


//     return (
//         <Card>
//             <div>
//                 <input
//                     type="file"
//                     accept="image/png, image/jpg, image/jpeg"
//                     style={{ display: 'none' }}
//                     onChange={handleCoverPictureChange}
//                     id="cover-picture-input"
//                 />
//                 {/* Mostrar la foto de portada actual o una imagen por defecto */}
//                 <label htmlFor="cover-picture-input">
//                     <CardMedia
//                         component='img'
//                         alt='profile-header'
//                         image={coverPicture || "/images/cover.jpg"} // Mostrar la foto de portada actual o una imagen por defecto
//                         sx={{
//                             height: { xs: 80, md: 120 },
//                             objectFit: 'cover', // Ajusta y recorta la imagen para llenar el contenedor
//                         }}
//                     />
//                     <div style={{ position: "relative" }}>
//                         <IconButton
//                             color="primary"
//                             component="label"
//                             htmlFor="cover-picture-input"
//                             sx={{
//                                 position: "absolute",
//                                 top: "-50px",
//                                 right: "8px",
//                                 color: "rgba(231, 227, 252, 0.54)",
//                                 backgroundColor: "rgba(9, 8, 8, 0.7)",
//                                 borderRadius: "50%",
//                                 "&:hover": {
//                                     backgroundColor:
//                                         "rgba(102, 95, 95, 0.9)",
//                                 },
//                             }}
//                         >
//                             <Icon icon='mdi:camera-plus' />
//                         </IconButton>
//                     </div>
//                 </label>
//             </div>
//             <CardContent
//                 sx={{
//                     pt: 0,
//                     mt: -8,
//                     display: 'flex',
//                     alignItems: 'flex-end',
//                     flexWrap: { xs: 'wrap', md: 'nowrap' },
//                     justifyContent: { xs: 'center', md: 'flex-start' }
//                 }}
//             >
//                 <div>
//                     {/* Input de tipo file oculto para seleccionar una nueva foto de perfil */}
//                     <input
//                         type="file"
//                         accept="image/png, image/jpg, image/jpeg"
//                         style={{ display: 'none' }}
//                         onChange={handleProfilePictureChange}
//                         id="profile-picture-input"
//                     />
//                     {/* Botón o enlace para abrir el input de tipo file */}
//                     <label htmlFor="profile-picture-input">
//                         <ProfilePicture
//                             src={profilePicture || "/images/profileNull.jpg"} // Mostrar la imagen de perfil actual
//                             alt='profile-picture'
//                         />
//                         <Badge
//                             overlap="circular"
//                             anchorOrigin={{
//                                 vertical: "bottom",
//                                 horizontal: "right",
//                             }}
//                             badgeContent={
//                                 <IconButton
//                                     component="span"
//                                     sx={{
//                                         color: "rgba(231, 227, 252, 0.54)",
//                                         backgroundColor: "rgba(9, 8, 8, 0.7)",
//                                         borderRadius: "50%",
//                                         "&:hover": {
//                                             backgroundColor:
//                                                 "rgba(102, 95, 95, 0.9)",
//                                         },
//                                     }}
//                                 >
//                                     <Icon icon='mdi:camera-plus' sx={{ color: "#1c1e21" }} />
//                                 </IconButton>
//                             }
//                         ></Badge>
//                     </label>
//                 </div>
//                 <Box
//                     sx={{
//                         width: '100%',
//                         display: 'flex',
//                         ml: { xs: 0, md: 6 },
//                         alignItems: 'flex-end',
//                         flexWrap: ['wrap', 'nowrap'],
//                         justifyContent: ['center', 'space-between']
//                     }}
//                 >
//                     <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
//                         <Typography variant='h5' sx={{ mb: 4 }}>
//                             {referido?.name ? referido.name : ''}
//                         </Typography>
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 flexWrap: 'wrap',
//                                 justifyContent: ['center', 'flex-start']
//                             }}
//                         >
//                             <Box sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
//                                 <Icon icon='mdi:card-account-details' />
//                                 <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{referido?.new_nmerodedocumento ? referido.new_nmerodedocumento : ''}</Typography>
//                             </Box>
//                             <Box sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
//                                 <Icon icon='mdi:email-outline' />
//                                 <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{referido?.emailaddress1 ? referido.emailaddress1 : ''}</Typography>
//                             </Box>
//                             {/* <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
//                                 <Icon icon='mdi:calendar-blank' />
//                                 <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>
//                                     Joined 1st october 2021
//                                 </Typography>
//                             </Box> */}
//                         </Box>
//                     </Box>
//                 </Box>
//             </CardContent>
//         </Card>
//     )
// }

// export default PerfilHeader

"use client"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Card,
  styled,
  CardMedia,
  Typography,
  CardContent,
  Badge,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Stack,
  Skeleton,
} from "@mui/material"
import { CameraAlt as CameraAltIcon, CreditCard as CreditCardIcon, Mail as MailIcon } from "@mui/icons-material"
import { useAuth } from "@/hooks/useAuth" // Asegúrate de que esta ruta sea correcta
import { AuthContext } from "@/context/AuthContext" // Asegúrate de que esta ruta sea correcta
// import { useToast } from "./Toast/ToastProvider" // Usar el nuevo ToastProvider
import toast from 'react-hot-toast';

const PerfilHeader = () => {
  const theme = useTheme()
//   const { toast } = useToast()
  const { referido, loadingCuenta } = useContext(AuthContext)
  const { actualizarFotoPerfil, actualizarFotoPortada, user } = useAuth()

  const [profilePicture, setProfilePicture] = useState(null)
  const [coverPicture, setCoverPicture] = useState(null)
  const [isUploadingProfile, setIsUploadingProfile] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  useEffect(() => {
    if (user) {
      setProfilePicture(user?.photoURL || "/images/profileNull.jpg")
      // Asumiendo que user.photoPORTADA existe o se puede simular
      setCoverPicture(user?.photoPORTADA || "/images/cover.jpg")
    }
  }, [user])

  const ProfilePictureStyled = styled("img")(({ theme }) => ({
    width: 160,
    height: 160,
    borderRadius: "50%", // Para hacer un círculo con la imagen de perfil
    border: `5px solid ${theme.palette.background.paper}`,
    objectFit: "cover",
    objectPosition: "center",
    boxShadow: theme.shadows[6],
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: theme.shadows[10],
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(4),
    },
  }))

  const handleFileChange = async (event, type) => {
    const file = event.target.files[0]
    if (!file) {
      console.log("No se seleccionó ninguna imagen")
      return
    }

    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      toast.error("El formato de la foto debe ser PNG, JPG o JPEG.")
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const imageDataUrl = reader.result
      const imgBlob = dataURLToBlob(imageDataUrl)

      try {
        if (type === "profile") {
          setIsUploadingProfile(true)
          await actualizarFotoPerfil(imgBlob)
          setProfilePicture(imageDataUrl)
          toast.success("Foto de perfil actualizada con éxito.")
        } else if (type === "cover") {
          setIsUploadingCover(true)
          await actualizarFotoPortada(imgBlob)
          setCoverPicture(imageDataUrl)
          toast.success("Foto de portada actualizada con éxito.")
        }
      } catch (error) {
        toast.error("Error al actualizar la foto. Inténtalo de nuevo.")
        console.error(`Error updating ${type} picture:`, error)
      } finally {
        if (type === "profile") setIsUploadingProfile(false)
        if (type === "cover") setIsUploadingCover(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(",")
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  if (loadingCuenta) {
    return (
      <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: theme.shadows[6] }}>
        <Skeleton variant="rectangular" height={{ xs: 120, md: 180 }} />
        <CardContent
          sx={{
            pt: 0,
            mt: -10,
            display: "flex",
            alignItems: "flex-end",
            flexWrap: { xs: "wrap", md: "nowrap" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Skeleton
            variant="circular"
            width={160}
            height={160}
            sx={{ border: `5px solid ${theme.palette.background.paper}` }}
          />
          <Box sx={{ width: "100%", ml: { xs: 0, md: 6 }, mt: { xs: 4, md: 0 } }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "center", sm: "flex-start" }}>
              <Skeleton variant="text" width={200} height={24} />
              <Skeleton variant="text" width={250} height={24} />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: theme.shadows[6] }}>
      {/* Cover Picture Section */}
      <Box sx={{ position: "relative" }}>
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, "cover")}
          id="cover-picture-input"
        />
        <label htmlFor="cover-picture-input">
          <CardMedia
            component="img"
            alt="profile-header"
            image={coverPicture}
            sx={{
              height: { xs: 100, md: 120 },
              objectFit: "cover",
              cursor: "pointer",
              transition: "filter 0.3s ease",
              "&:hover": {
                filter: "brightness(0.8)",
              },
            }}
          />
          <IconButton
            color="primary"
            component="span"
            sx={{
              position: "absolute",
              bottom: theme.spacing(2),
              right: theme.spacing(2),
              backgroundColor: alpha(theme.palette.common.black, 0.6),
              color: theme.palette.common.white,
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.black, 0.8),
              },
              transition: "background-color 0.3s ease",
            }}
          >
            {isUploadingCover ? <CircularProgress size={24} color="inherit" /> : <CameraAltIcon />}
          </IconButton>
        </label>
      </Box>

      <CardContent
        sx={{
          pt: 0,
          mt: -14, // Adjust margin to overlap with cover photo
          display: "flex",
          alignItems: "flex-end",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        {/* Profile Picture Section */}
        <Box sx={{ position: "relative" }}>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "profile")}
            id="profile-picture-input"
          />
          <label htmlFor="profile-picture-input">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton
                  component="span"
                  sx={{
                    backgroundColor: alpha(theme.palette.common.black, 0.6),
                    color: theme.palette.common.white,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.common.black, 0.8),
                    },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {isUploadingProfile ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CameraAltIcon fontSize="small" />
                  )}
                </IconButton>
              }
            >
              <ProfilePictureStyled src={profilePicture} alt="profile-picture" />
            </Badge>
          </label>
        </Box>

        {/* User Information */}
        <Box
          sx={{
            width: "100%",
            ml: { xs: 0, md: 6 },
            mt: { xs: 4, md: 0 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: theme.palette.text.primary,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {referido?.name || "Nombre de Usuario"}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 4 }}
            alignItems={{ xs: "center", sm: "flex-start" }}
            flexWrap="wrap"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CreditCardIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                CUIT/CUIL: {referido?.new_nmerodedocumento || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MailIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
              <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                {referido?.emailaddress1 || "N/A"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PerfilHeader
