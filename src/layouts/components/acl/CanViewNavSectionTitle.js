// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from '../acl/Can'

const CanViewNavSectionTitle = props => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const ability = useContext(AbilityContext)
  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    return <>{children}</>
  }
}

export default CanViewNavSectionTitle
