// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@/@core/components/table/Table'
import { Grid, LinearProgress, useTheme } from '@mui/material'
import { columns_sociedad_bolsa } from '@/columns/columnsSociedadBolsa'
import { useContext, useState } from 'react'
import ModalSociedadBolsa from './ModalSociedadBolsa'
import { readOnlyDatos } from '@/keys'
import { SociedadesDeBolsa } from '@/context/GetSociedadesDeBolsaContext'

const TablaSociedadBolsa = () => {
  const { sociedadXbolsa, loadingSociedades } = useContext(SociedadesDeBolsa);
  const [openNew, setOpenNew] = useState(false)
  const theme = useTheme()
  const handleOpenNew = () => {
    setOpenNew(true)
  }

  const handleCloseNew = () => setOpenNew(false);

  return (
    <>
      {
        loadingSociedades ?
          <Box>
            <Table
              addRow={!readOnlyDatos}
              toggle={handleOpenNew}
              data={sociedadXbolsa?.length > 0 ? sociedadXbolsa : []}
              columns={columns_sociedad_bolsa(theme)} />
          </Box> :
          <Grid item xs={12} >
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          </Grid>
      }
      <ModalSociedadBolsa open={openNew} handleClose={handleCloseNew} modo={"crear"} />
    </>
  )
}

export default TablaSociedadBolsa
