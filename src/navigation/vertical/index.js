import { AuthContext } from "@/context/AuthContext";
import useGetUnidadDeNegocio from "@/hooks/useGetUnidadDeNegocio"
import { useContext, useEffect, useState } from "react"

const NavigationIndex = () => {
  const { referido } = useContext(AuthContext);
  const { lineasActivas } = useGetUnidadDeNegocio()
  const [menu, setMenu] = useState([])

  useEffect(() => {
    if (referido?.new_estadodelsocio === 100000000 && lineasActivas) {
      setMenu([
        {
          title: 'Resumen de Posición',
          icon: 'mdi:home-outline',
          path: '/inicio'
        },
        {
          title: 'Mi Documentación Digital',
          icon: 'mdi:file-document',
          path: '/carpeta-digital'
        },
        {
          title: 'Mis Garantías',
          icon: 'mdi:handshake-outline',
          path: '/garantias'
        },
        {
          title: 'Mis Líneas',
          icon: 'mdi:equalizer',
          path: '/lineas'
        },
        {
          title: 'Mis Operaciones',
          icon: 'mdi:file-sign',
          path: '/operaciones'
        },
        {
          title: 'Perfil',
          icon: 'mdi:account-circle',
          path: '/perfil'
        },
        {
          title: 'Mis Referidos',
          icon: 'mdi:account-multiple',
          path: '/'
        }
      ])
    } else if (referido?.new_estadodelsocio === 100000000 && !lineasActivas)
      setMenu([
        {
          title: 'Resumen de Posición',
          icon: 'mdi:home-outline',
          path: '/inicio'
        },
        {
          title: 'Mi Documentación Digital',
          icon: 'mdi:file-document',
          path: '/carpeta-digital'
        },
        {
          title: 'Mis Garantías',
          icon: 'mdi:handshake-outline',
          path: '/garantias'
        },
        {
          title: 'Mis Operaciones',
          icon: 'mdi:file-sign',
          path: '/operaciones'
        },
        {
          title: 'Perfil',
          icon: 'mdi:account-circle',
          path: '/perfil'
        },
        {
          title: 'Mis Referidos',
          icon: 'mdi:account-multiple',
          path: '/'
        }
      ])
    else {
      setMenu([
        {
          title: 'Resumen de Posición',
          icon: 'mdi:home-outline',
          path: '/inicio'
        },
        {
          title: 'Mi Documentación Digital',
          icon: 'mdi:file-document',
          path: '/carpeta-digital'
        },
        {
          title: 'Perfil',
          icon: 'mdi:account-circle',
          path: '/perfil'
        },
        {
          title: 'Mis Referidos',
          icon: 'mdi:account-multiple',
          path: '/'
        }
      ])
    }
  }, [lineasActivas])

  return (menu)
}

export default NavigationIndex