// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import { useContext, useState } from 'react'
import ModalNuevaGarantia from '@/pages/garantias/ModalNuevaGarantia'
import { Box, Grid, Skeleton } from '@mui/material'
import { AuthContext } from '@/context/AuthContext'


const TablaGarantia = ({ garantias, columnas, loadingGarantias }) => {
  const [openNew, setOpenNew] = useState(false)
  const [montoDisponible, setMontoDisponible] = useState(0)
  const [acreedores, setAcreedores] = useState([])
  const [destinoDeFondos, setDestinoDeFondos] = useState([])
  const { referido } = useContext(AuthContext);
  const handleOpenNew = () => {
    setOpenNew(true)
  }

  const handleCloseNew = () => setOpenNew(false);

  return (
    <>
      {
        !loadingGarantias ?
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {/* <CircularProgress /> */}
              <Skeleton variant="rounded" animation="wave" width="100%" height={180} />
            </Box>
          </Grid> : <Table
            addRow={true}
            toggle={handleOpenNew}
            data={garantias?.length > 0 ? garantias : []}
            columns={columnas}
            canExport={true}
            exportFileName={`Garantias ${referido?.name}`}
          />
      }

      <ModalNuevaGarantia open={openNew} handleClose={handleCloseNew} acreedores={acreedores} destinoDeFondos={destinoDeFondos} montoDisponible={montoDisponible} />
    </>
  )
}

export default TablaGarantia
