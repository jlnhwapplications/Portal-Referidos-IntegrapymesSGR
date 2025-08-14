import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk"; // Importa Redux Thunk
import tokenReducer from "@/redux/token";
import limitesReducers from "@/redux/LimitePorLinea";
import carpetaDigitalReducers from "@/redux/CarpetaDigital"
import relacionesReducers from "@/redux/RelacionDeVinculacion"
import garantiasReducers from "@/redux/Garantias"
import operacionesReducers from "@/redux/Operaciones"
import bancosReducers from "@/redux/Bancos"
import cuentaReducers from "@/redux/Cuenta"
import datosReducers from "@/redux/DatosSolicitudAlta"
import unidadesNegocioReducers from "@/redux/UnidadDeNegocio"

// import usuariosReducer from "@/redux/usuario"

const middleware = [thunk];
const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(
  combineReducers({
    token: tokenReducer,
    limites: limitesReducers,
    carpetaDigital: carpetaDigitalReducers,
    relaciones: relacionesReducers,
    garantias: garantiasReducers,
    operaciones: operacionesReducers,
    bancos: bancosReducers,
    cuenta: cuentaReducers,
    datos: datosReducers,
    unidadesNegocio: unidadesNegocioReducers
    // usuarios: usuariosReducer  
  }),
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
