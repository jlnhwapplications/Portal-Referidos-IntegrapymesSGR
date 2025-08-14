import { obtenerNotaADescargar } from '@/redux/CarpetaDigital';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Icon from 'src/@core/components/icon'

const DescargarNota = (notaid) => {
    const dispatch = useDispatch()
    const token = useSelector(store => store.token.token)
    const [loading, setLoading] = React.useState(false)

    function downloadBase64File(event) {
        event.preventDefault()
        if (notaid?.value != null && notaid?.value != undefined) {
            if(event?.currentTarget?.id === notaid.value){
                setLoading(true)
                dispatch(obtenerNotaADescargar(notaid.value, token.token))
                .then(data => {
                    if (data?.length > 0) {
                        let documentBody = data[0]['documentbody']
                        let filename = data[0]['filename']
                        let mimetype = data[0]['mimetype']
                        if (documentBody != null && filename != null && mimetype != null) {
                            const linkSource = `data:${mimetype};base64,${documentBody}`;
                            const downloadLink = document.createElement("a");
                            downloadLink.href = linkSource;
                            downloadLink.download = filename;
                            downloadLink.click();
                            setLoading(false)
                        }
                    }
                })
                .catch(error => {
                    setLoading(false)
                })
            }
        }
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
                notaid?.value != null ?
                    <LoadingButton
                        id={notaid?.value}
                        sx={{ borderRadius: 5 }}
                        size="small"
                        onClick={(e) => downloadBase64File(e)}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Icon icon="mdi:cloud-download-outline" style={{ fontSize: 30, color: "#fff" }} />}
                        variant="contained"
                    >
                        <span>Descargar</span>
                    </LoadingButton> : '-'
            }
        </Box>
    )
}

export default DescargarNota
