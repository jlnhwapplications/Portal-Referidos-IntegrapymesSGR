// Utilidades de validación reutilizables

export const ValidateCUITCUIL = (cuit) => {
  if (!cuit) return false;
  const onlyDigits = String(cuit).replace(/\D/g, "");
  if (onlyDigits.length !== 11) return false;

  let acumulado = 0;
  let respuesta = false;
  const digitos = onlyDigits.split("");
  const digito = parseInt(digitos.pop(), 10);

  for (let i = 0; i < digitos.length; i++) {
    acumulado += digitos[9 - i] * (2 + (i % 6));
  }

  let verif = 11 - (acumulado % 11);
  if (verif === 11) {
    verif = 0;
  } else if (verif === 10) {
    verif = 9;
  }
  respuesta = digito === verif;
  return respuesta;
};

