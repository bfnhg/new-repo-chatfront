import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ChatIcon from '@mui/icons-material/Chat'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { blue, green, grey } from '@mui/material/colors'
import { useTranslation } from 'react-i18next'

const ChatHistory = () => {
  const [conversationsData, setConversationsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  let { t } = useTranslation()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.warn('Aucun token trouvé. Redirection ou autre gestion nécessaire.')
        return
      }

      const response = await axios.get('http://localhost:5000/api/client/conversations', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      setConversationsData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations :', error)
      setLoading(false)
      setError(error.message)
    }
  }

  if (loading) return <Typography>Chargement des conversations...</Typography>
  if (error) return <Typography color='error'>{error}</Typography>

  return (
    <Box sx={{ height: '100vh', overflowY: 'scroll', p: 20 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Centre horizontalement
          alignItems: 'center',
          gap: 1,
          mb: 2,

          p: 2,
          borderRadius: 1,
          color: 'white'
        }}
      >
        <ChatIcon />
        <Typography variant='h6'>
          {t('History of Conversations of ')}
          {conversationsData.client_name}
        </Typography>
      </Box>

      <List>
        {conversationsData.conversations.map(convo => (
          <Card
            key={convo.conversation_id}
            sx={{
              mb: 4,
              transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out', // Ajout de la transformation
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6, // Ombre plus prononcée
                transform: 'translateY(-5px)' // Légère élévation au survol
              }
            }}
          >
            <CardHeader
              sx={{
                bgcolor: blue[400],
                '& .MuiCardHeader-title': { color: blue[700] },
                '& .MuiCardHeader-subheader': { color: grey[700] }
              }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChatIcon sx={{ color: blue[700] }} />
                  <Typography variant='h6'>Conversation #{convo.conversation_id}</Typography>
                </Box>
              }
              subheader={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <AccessTimeIcon color='action' />
                  <Typography>{new Date(convo.last_message_time).toLocaleString()}</Typography>
                </Box>
              }
            />
            <CardContent>
              <List>
                {convo.messages.map(message => (
                  <ListItem key={message.message_id} alignItems='flex-start'>
                    <ListItemText
                      primary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: blue[600] }} />
                            <Typography
                              variant='body1'
                              sx={{
                                fontWeight: 500,
                                p: 1,
                                borderRadius: 1
                              }}
                            >
                              {message.user_message}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <SmartToyIcon sx={{ color: green[600] }} />
                            <Typography
                              variant='body1'
                              sx={{
                                p: 1,
                                borderRadius: 1
                              }}
                            >
                              {message.assistant_message}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <AccessTimeIcon fontSize='small' color='action' />
                          <Typography color='text.secondary'>{new Date(message.timestamp).toLocaleString()}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  )
}

export default ChatHistory
