import React from 'react'
import PropTypes from 'prop-types';
import Chart from 'src/@core/components/react-apexcharts'
import { Select, MenuItem, Box, List, ListItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';

const pendiente = "rgb(255, 163, 25)"
const completada = "rgb(87, 202, 34)"

const GraficoProgresoApex = ({ datos, opciones, titulo, opcionPrincipal }) => {
    const theme = useTheme();
    const [progreso, setProgreso] = React.useState(0)

    React.useEffect(() => {
        let progres = 0
        datos.forEach(item => {
            if (item.name === "Solicitud de Alta") {
                progres += 50
            } else if (item.texto === "Completada") {
                progres += 25
            }
        })
        setProgreso(progres)
    }, [datos])

    function Item(props) {
        const { sx, ...other } = props;
        return (
            <Box
                sx={{
                    p: 1,
                    m: 1,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#223354' : 'grey.100'),
                    color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                    border: '1px solid',
                    borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    ...sx,
                }}
                {...other}
            />
        );
    }

    Item.propTypes = {
        /**
         * The system prop that allows defining system overrides as well as additional CSS styles.
         */
        sx: PropTypes.oneOfType([
            PropTypes.arrayOf(
                PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
            ),
            PropTypes.func,
            PropTypes.object,
        ]),
    };

    // chart
    const optionscolumnchart = {
        chart: {
            height: 280,
            type: "radialBar",
        },
        colors: ["rgb(255, 163, 25)"],
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: "70%",
                    background: "#293450"
                },
                track: {
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        blur: 4,
                        opacity: 0.15
                    }
                },
                dataLabels: {
                    name: {
                        offsetY: -10,
                        color: "#fff",
                        fontSize: "13px"
                    },
                    value: {
                        color: "#fff",
                        fontSize: "30px",
                        show: true
                    }
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "vertical",
                gradientToColors: ["rgb(87, 202, 34)"],
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: "round"
        },
        labels: ["Progreso"]
    };

    return (
        <Box sx={{
            "& .apexcharts-menu": {
                background: '#223354!important',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'normal',
                color: "rgba(255, 255, 255, 0.8)"
            },
            "& .apexcharts-menu:hover": {
                color: "#223354!important"
            },
        }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', mt: 2, mx: 2 }}>
                {
                    datos.map(item => {
                        return (
                            <Item key={item.name}>
                                <Stack direction="row" sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        item.texto === "Completada" ?
                                            <Avatar
                                                sx={{ mr: 1, width: 9, height: 9, bgcolor: completada, svg: { display: 'none' } }}
                                            /> : <Avatar
                                                sx={{ mr: 1, width: 9, height: 9, bgcolor: pendiente, svg: { display: 'none' } }}
                                            />
                                    }
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {item.name}
                                    </Typography>
                                </Stack>
                            </Item>
                        )
                    })
                }
            </Box>
            <Chart
                options={optionscolumnchart}
                series={[progreso]}
                type="radialBar"
                height="280px"
            />
        </Box>
    )
}

export default GraficoProgresoApex