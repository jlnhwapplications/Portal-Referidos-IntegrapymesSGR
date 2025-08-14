// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from '../acl/Can'

const CanViewNavLink = props => {
  // ** Props
  const { children, navLink } = props;

  // ** Hook
  const ability = useContext(AbilityContext);

  // Si el navLink existe y su propiedad "auth" es falsa
  if (navLink && navLink.auth === false) {
    // Renderiza el contenido dentro del componente sin ninguna restricción
    return <>{children}</>;
  } else {
    // Si hay una habilidad (ability) y esa habilidad permite la acción y el sujeto definidos en el navLink
    // return ability && ability.can(navLink?.action, navLink?.subject) ? <>{children}</> : null;
    return <>{children}</>
  }
};

export default CanViewNavLink;
