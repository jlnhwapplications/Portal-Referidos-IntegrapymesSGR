import { useContext, useRef, useState } from "react"
import { Box, Card, Grid, Typography, Button, Stack, useTheme, alpha, Skeleton, Avatar, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Add as AddIcon, Group as GroupIcon } from "@mui/icons-material"
import ModalRelaciones from "./ModalRelaciones" // Asegúrate de que esta ruta sea correcta
import { Relaciones } from "@/context/GetRelacionesContext" // Asegúrate de que esta ruta sea correcta
import RelationshipCard from "./RelationshipCard" // Nuevo componente de tarjeta
import { AuthContext } from "@/context/AuthContext"
import EditIcon from '@mui/icons-material/Edit';

const TablaRelaciones = () => {
  const theme = useTheme()
  const { token } = useContext(AuthContext);
  const { relaciones, loadingRelaciones, deleteRelacion } = useContext(Relaciones)
  const [openNew, setOpenNew] = useState(false)
  const idRelacion = useRef('')
  const modo = useRef('')
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

  const handleDeleteClick = () => {
    setOpenDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    deleteRelacion(idRelacion.current, token)
    setOpenDeleteConfirm(false)
  }

  const handleDeleteCancel = () => {
    setOpenDeleteConfirm(false)
  }

  const handleOpenNew = () => {
    debugger
    modo.current = 'crear'
    idRelacion.current = ''
    setOpenNew(true)
  }

  const handleCloseNew = () => setOpenNew(false)

  const handleViewRelationship = (relationship) => {
    console.log("Ver relación:", relationship)
    // Implement navigation or open a detailed 
  }

  const handleEditRelationship = (relationship) => {
    modo.current = 'editar'
    idRelacion.current = relationship.id
    setOpenNew(true)
  }

  const handleDeleteRelationship = (relationship) => {
    idRelacion.current = relationship.id
    setOpenDeleteConfirm(true)
    // deleteRelacion(relationship.id, token)
    // console.log("Eliminar relación:", relationship)
  }

  const RelationshipCardSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              height: 280,
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="70%" height={28} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </Box>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const EmptyState = () => (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderRadius: 3,
        border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
        boxShadow: theme.shadows[2],
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mx: "auto",
          mb: 3,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        }}
      >
        <GroupIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        No hay relaciones registradas
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
        Parece que aún no has añadido ninguna relación de vinculación. Haz clic en el botón de abajo para empezar.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenNew}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          "&:hover": {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            transform: "translateY(-2px)",
            boxShadow: theme.shadows[8],
          },
          transition: "all 0.3s ease-in-out",
        }}
      >
        Añadir Nueva Relación
      </Button>
    </Box>
  )

  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Mis Vinculaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNew}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              transform: "translateY(-2px)",
              boxShadow: theme.shadows[8],
            },
            transition: "all 0.3s ease",
          }}
        >
          Añadir Relación
        </Button>
      </Box>

      {!loadingRelaciones ? (
        <RelationshipCardSkeleton />
      ) : relaciones?.length > 0 ? (
        <Grid container spacing={3}>
          {relaciones.map((relationship, index) => (
            <Grid item xs={12} sm={6} md={4} key={relationship.id}>
              <RelationshipCard
                relationship={relationship}
                onView={handleViewRelationship}
                onEdit={handleEditRelationship}
                onDelete={handleDeleteRelationship}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState />
      )}
      <ModalRelaciones open={openNew} close={handleCloseNew} modo={modo?.current} id={idRelacion.current} />
      <Dialog
        open={openDeleteConfirm}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditIcon color="red" />
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            ¿Desea eliminar este registro de Sociedad de Bolsa? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TablaRelaciones
