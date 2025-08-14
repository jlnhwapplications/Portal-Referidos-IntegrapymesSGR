import ApexChartWrapper from "@/@core/styles/libs/react-apexcharts";
import { Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import PageHeader from "@/@core/components/page-header";
import TablaCarpetaDigital from "../views/carpeta-digital/TablaCarpetaDigital";

const index = () => {
  return (
    <>
      <PageHeader
        title="Mi Documentación Digital"
        subtitle="Administración completa de mi documentación digital"
        variant="compact"
      />
      <Grid container sx={{ m: 0, p: 0 }}>
        <Grid item xs={12} sx={{ mt: 4 }}>
          <TablaCarpetaDigital />
        </Grid>
      </Grid>
    </>
  );
};

export default index;
