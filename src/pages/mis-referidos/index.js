import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import useGetMisReferidos from '@/hooks/useGetMisReferidos'
 import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import BlankLayout from "@/@core/layouts/BlankLayout";


const MisReferidos = () => {
  // const { cuentas, loadingCuenta } = useGetMisReferidos();
  const { actualizarReferido } = useContext(AuthContext);
 
  const seleccionarCuenta = (accountId) => {
    actualizarReferido({ accountid: accountId });
  };

  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // backgroundImage: `url(${fondo})`, el otro 202.453x216.391
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          minHeight: "100vh",
        }}
      >
        {/* <Typography
          variant="h1"
          color="white"
          sx={{
            fontSize: { xs: "1.5rem", md: "2.2rem" },
            fontWeight: 600,
          }}
        >
          Mis Cuentas
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent:"flex-start",
            flexDirection:"column",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
            mt: 2,
            mx: "9vw",
          }}
        >
          <Typography
            variant="subtitle1"
            color="white"
            sx={{
              fontSize: { xs: ".9rem", md: "1.2rem" },
              fontWeight: 600,
              textAlign: "center",
              mt: 3,
              mx: 2,
            }}
          >
            Seleccione la cuenta desde la cual desea operar
          </Typography>
          <Box>
          {loadingCuenta ? ( 
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : cuentas.length > 0 && !loadingCuenta ? (
            cuentas?.map((item) => {
              return ( 
                <Paper
                  key={item.accountid}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: "#064269",
                    py: 2,
                    px: 4,
                    my:2,
                    border: "1px solid #fff",
                    "&:hover": { background: "#4D637A", color: "#2D2E82" },
                  }}
                >
                  <Box
                    component="div"
                    onClick={() => seleccionarCuenta(item.accountid)} 
                    sx={{ cursor: "pointer" }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: ".9rem", md: "1.2rem" },
                        fontWeight: 600,
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Paper>
              );
          })
          ) : (
            <Paper
              sx={{
                backgroundColor: "#064269",
                py: 2,
                px: 4,
                border: "1px solid #fff",
                "&:hover": { background: "#4D637A", color: "#2D2E82" },
              }}
            >
              <Box
                component="div"
                  // onClick={CerrarSesion}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: ".9rem", md: "1.2rem" },
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Sin cuentas referidas
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: ".9rem", md: "1.2rem" },
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Cerrar sesión
                </Typography>
              </Box>
            </Paper>
          )}
          </Box>
        </Box> */}
      </Box>
  );
};
MisReferidos.getLayout = page => <BlankLayout>{page}</BlankLayout>;
export default MisReferidos;