const navigation = () => {
  return [
    {
      icon: 'mdi:home-outline',
      title: 'Dashboards',
      children: [
        {
          icon: 'mdi:chart-timeline-variant',
          title: 'Analytics',
          path: '/dashboards/analytics',
          subject: 'dashboard'
        },
        {
          title: 'ChatBot Assistant',
          icon: 'mdi:message-outline',

          path: '/chatbot',

          subject: 'chatbot',
          openInNewTab: false
        },

        {
          title: 'Clients',
          icon: 'mdi:file-document-outline',
          children: [
            {
              title: 'Conversation History',
              path: '/apps/clients/list',

              subject: 'conversationHistoric'
            },

            {
              title: 'Add',
              path: '/apps/clients/add',
              subject: 'client'
            }
          ]
        }
      ]
    },

    {
      title: 'Others',
      icon: 'mdi:dots-horizontal',
      children: [
        {
          path: '/acl',
          action: 'read',
          subject: 'acl-page',
          icon: 'mdi:shield-outline',
          title: 'Access Control'
        },
        {
          title: 'Menu Levels',
          icon: 'mdi:menu',
          children: [
            {
              title: 'Menu Level 2.1'
            },
            {
              title: 'Menu Level 2.2',
              children: [
                {
                  title: 'Menu Level 3.1'
                },
                {
                  title: 'Menu Level 3.2'
                }
              ]
            }
          ]
        },
        {
          title: 'Disabled Menu',
          icon: 'mdi:eye-off-outline',
          disabled: true
        },
        {
          title: 'Raise Support',
          icon: 'mdi:lifebuoy',
          externalLink: true,
          openInNewTab: true,
          path: 'https://themeselection.com/support'
        },
        {
          title: 'Documentation',
          icon: 'mdi:file-document-outline',
          externalLink: true,
          openInNewTab: true,
          path: 'https://demos.themeselection.com/materio-mui-react-nextjs-admin-template/documentation'
        }
      ]
    }
  ]
}

export default navigation
