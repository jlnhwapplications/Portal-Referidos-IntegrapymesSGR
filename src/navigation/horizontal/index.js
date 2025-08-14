const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          title: 'CRM',
          path: '/dashboards/crm'
        },
        {
          title: 'Analytics',
          path: '/dashboards/analytics'
        },
        {
          title: 'eCommerce',
          path: '/dashboards/ecommerce'
        }
      ]
    },
    {
      sectionTitle: 'Apps & Páginas'
    },
    {
      title: 'Perfil',
      icon: 'mdi:account-circle',
      path: '/perfil'
    },
    {
      title: 'Calendario',
      icon: 'mdi:calendar-blank-outline',
      path: '/apps/calendario'
    },      
    {
      title: 'Tablas',
      icon: 'mdi:grid',
      path: '/tablas'
    },
    {
      title: 'Formularios',
      icon: 'mdi:transit-connection-horizontal',
      path: '/formularios'
    },
    {
      title: 'Cards',
      icon: 'mdi:cards',
      children: [
        {
          title: 'Basicas',
          path: '/cards/basicas'
        },
        {
          title: 'Indicadores',
          path: '/cards/indicadores'
        },
      ]
    },
    
  ]
}

export default navigation