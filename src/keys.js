const UrlApi = `${process.env.NEXT_PUBLIC_API_URL}`
const authMail = `${process.env.NEXT_PUBLIC_CORREO}`
const authPass = `${process.env.NEXT_PUBLIC_CORREO_CLAVE}$`
const RecaptchaKey = `${process.env.NEXT_PUBLIC_RECAPTCHA}`
const UrlApiDynamics = `${process.env.NEXT_PUBLIC_APIDYNAMICS_URL}`
const UnidadDeNegocio = `${process.env.NEXT_PUBLIC_UNIDADNEGOCIO}`
// const RecaptchaKey = "6LeALiAcAAAAABv5WAeRHUmaf5GfqNSBYn8wTKON"; 
//PARAMETROS
const onboardingHabilitado = true
const readOnlyDatos = false
const referidorOnboarding = true
const lufeHabilitado = true
const DireccionOnbHabilitado = false
const LineaDeCreditoHabilitado = true
const documentacionLufeYParametrizada = true
const cliente = 'Integra Pymes Referidos'

//Sacar times new roman - sacar requerido - achicar onboarding - sacar plazo de gracia en meses

export {
    RecaptchaKey, UrlApiDynamics, UnidadDeNegocio, UrlApi, authMail,
    authPass, onboardingHabilitado, readOnlyDatos, referidorOnboarding, lufeHabilitado, DireccionOnbHabilitado, LineaDeCreditoHabilitado, documentacionLufeYParametrizada,
    cliente
};   
