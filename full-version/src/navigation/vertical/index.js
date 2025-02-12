import { useTranslation } from 'react-i18next'

const Navigation = () => {
  const userData = localStorage.getItem('userData')
  let { t } = useTranslation()
  let clientId = ''

  if (userData) {
    const parsedUserData = JSON.parse(userData)
    clientId = parsedUserData.id // Supposons que l'ID du client est stocké dans `id`
  }

  return [


    {
      title: t('Dashboards'),
      icon: 'mdi:archive-outline',
      path: '/dashboards/analytics',
      action: 'read',
      subject: 'dashboard'
    },
    {
      title: t('Analysis client'),
      icon: 'mdi:file-document-outline',
      path: '/dashboards/crmclient',
      action: 'read',
      subject: 'dashboardClient'
    },
    {
      title: t('ChatBot Assistant'),
      icon: 'mdi:message-outline',

      path: `/chatbot/${clientId}`,
      action: 'read',
      subject: 'chatbot',
      openInNewTab: false
    },
    {
      title: 'Client',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: t('Add'),
          path: '/apps/clients/add',
          action: 'read',
          subject: 'client'
        },
        {
          title: 'List',
          path: '/apps/clients/list',
          action: 'read',
          subject: 'client'
        },
        {
          title: t('Conversation history'),
          path: '/apps/clients/historic',
          action: 'read',
          subject: 'conversationHistoric'
        },
        {
          title: t('Associated assistance'),
          path: '/apps/assistant/list',
          action: 'read',
          subject: 'Assistanceassocier'
        }
      ]
    },
    {
      title: 'Assistant',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: t('Add'),
          path: '/apps/assistant/add',
          action: 'read',
          subject: 'gestionchatbotassistant'
        }
      ]
    }

  ]
}

export default Navigation
