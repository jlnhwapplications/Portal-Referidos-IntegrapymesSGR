const dataInicial = {
    seleccionarReferido: false
}

const SELECCIONAR_REFERIDO = 'SELECCIONAR_REFERIDO'

export default function referidosReducer(state = dataInicial, action) {
    switch (action.type) {
        case SELECCIONAR_REFERIDO:
            return { ...state, seleccionarReferido: action.seleccionarReferido}
        default:
            return { ...state }
    }
}

export const setSeleccionarReferido = (seleccionar) => async (dispatch) => {
    dispatch({
        type: SELECCIONAR_REFERIDO,
        seleccionarReferido: seleccionar
    })
}