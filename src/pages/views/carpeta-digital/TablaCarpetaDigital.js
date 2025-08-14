// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import { columns_carperta_digital, columns_carperta_digital_inicio } from '@/columns/columnsCarpetaDigital'
import { Box, CircularProgress, Grid, useTheme } from '@mui/material'
import { useContext, useState } from 'react'
import { DocumentacionPorCuenta } from '@/context/GetDocumentacionPorCuentaContex'
import ModalCarpetaDigital from '@/pages/carpeta-digital/ModalCarpetaDigital'



const TablaCarpetaDigital = () => {
  const { carpetas, loadingDocumentacion } = useContext(DocumentacionPorCuenta)
  const theme = useTheme()
  const [openCarpetaDigital, setOpenCarpetaDigital] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleOpenModal = (utilidad) => {
    setModalData(utilidad);
    setOpenCarpetaDigital(true);
  };

  const handleCloseModal = () => {
    setOpenCarpetaDigital(false);
    setModalData(null);
  };

  return (
    loadingDocumentacion ? (
      <Box>
        <Table
          data={carpetas?.length > 0 ? carpetas : []}
          columns={columns_carperta_digital(theme, handleOpenModal)}
          theme={theme}
          name={"Documentación Digital"}
        />
        <ModalCarpetaDigital
          open={openCarpetaDigital}
          setOpen={setOpenCarpetaDigital}
          data={modalData?.new_name}
          id={modalData?.id}
          handleClose={handleCloseModal}
        />
      </Box>
    ) : (
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Grid>
    )
  )
}

export default TablaCarpetaDigital
