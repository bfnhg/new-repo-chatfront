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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

const EnhancedChatHistory = () => {
  const [conversationsData, setConversationsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation()

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

  const filteredConversations =
    conversationsData?.conversations.filter(convo =>
      convo.messages[0]?.user_message.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  if (loading) return <Typography>Chargement des conversations...</Typography>
  if (error) return <Typography color='error'>{error}</Typography>

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Section Gauche - Liste des Conversations */}
      <Box
        sx={{
          width: selectedConversation ? '40%' : '100%',
          borderRight: `1px solid ${grey[300]}`,
          p: 2,
          overflowY: 'auto',
          transition: 'width 0.3s ease'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 2,
            borderRadius: 1,
            color: 'white',
            bgcolor: blue[500]
          }}
        >
          <ChatIcon />
          <Typography variant='h6'>
            {t('History of Conversations of ')} {conversationsData.client_name}
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search conversations'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <List>
          {filteredConversations.map(convo => (
            <Card
              key={convo.conversation_id}
              onClick={() => setSelectedConversation(convo)}
              sx={{
                mb: 2,
                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-5px)'
                },
                ...(selectedConversation?.conversation_id === convo.conversation_id && {
                  bgcolor: blue[50],
                  border: `1px solid ${blue[200]}`
                })
              }}
            >
              <CardHeader
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
                <Typography>{convo.messages[0]?.user_message || 'Aucun message'}</Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      </Box>

      {/* Section Droite - Détails de la Conversation */}
      {selectedConversation && (
        <Box
          sx={{
            width: '60%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: `1px solid ${grey[300]}`,
            bgcolor: grey[50]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: `1px solid ${grey[300]}`,
              bgcolor: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChatIcon sx={{ color: blue[700] }} />
              <Typography variant='h6'>Conversation #{selectedConversation.conversation_id}</Typography>
            </Box>
            <Typography color='text.secondary'>
              {new Date(selectedConversation.last_message_time).toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {selectedConversation.messages.map(message => (
              <Box
                key={message.message_id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.user_message ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {message.user_message && (
                  <Box
                    sx={{
                      bgcolor: blue[100],
                      color: 'black',
                      p: 2,
                      borderRadius: 2,
                      maxWidth: '70%',
                      mb: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PersonIcon sx={{ color: blue[600] }} />
                      <Typography variant='body2' fontWeight='bold'>
                        You
                      </Typography>
                    </Box>
                    <Typography>{message.user_message}</Typography>
                  </Box>
                )}

                {message.assistant_message && (
                  <Box
                    sx={{
                      bgcolor: green[100],
                      color: 'black',
                      p: 2,
                      borderRadius: 2,
                      maxWidth: '70%',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SmartToyIcon sx={{ color: green[600] }} />
                      <Typography variant='body2' fontWeight='bold'>
                        Assistant
                      </Typography>
                    </Box>
                    <Typography>{message.assistant_message}</Typography>
                  </Box>
                )}

                <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5 }}>
                  {new Date(message.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Optional: Close Conversation Button */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${grey[300]}`,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Typography
              color='primary'
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => setSelectedConversation(null)}
            >
              Close Conversation
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EnhancedChatHistory
