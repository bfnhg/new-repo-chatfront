import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const ChatbotPage = ({ chatbotId, sidebarWidth, mdAbove }) => {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [ipAddress, setIpAddress] = useState('')
  const [userData, setUserData] = useState(null)
  let { t } = useTranslation()

  const suggestions = [
    'Quels sont les services offerts par ALIDANTEK ?',
    'Quels sont les partenaires ALIDANTEK ?',
    'Qu est-ce que ALIDANTEK ?'
  ]

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }

    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error('Error fetching IP:', error))
  }, [])

  const handleMessageSend = () => {
    const text = inputValue.trim()
    if (!text) return

    const userMessage = { sender: 'User', message: text }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('accessToken')
    console.log('token', token)
    if (!token) {
      console.error('No token found')

      const errorMessage = {
        sender: 'Bot',
        message: "Vous n'êtes pas authentifié. Veuillez vous connecter."
      }
      setMessages(prev => [...prev, errorMessage])

      return
    }

    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: JSON.stringify({
        message: text,
        ip_address: ipAddress,
        chatbot_id: chatbotId // Ajoutez l'ID du chatbot dans la requête
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expirée. Veuillez vous reconnecter.')
          }
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        const botResponse = data.assistant_response
        const botMessage = { sender: 'Bot', message: botResponse }
        setMessages(prev => [...prev, botMessage])
      })
      .catch(error => {
        console.error('Error:', error)

        const errorMessage = {
          sender: 'Bot',
          message: error.message || "Je n'ai pas pu traiter votre demande. Réessayez plus tard."
        }
        setMessages(prev => [...prev, errorMessage])
      })
  }

  return (
    <Box
      sx={{
        width: `calc(100% - ${mdAbove ? sidebarWidth : 0}px)`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderLeft: theme => `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          backgroundColor: 'background.default',
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant='h6'>
          <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 15 15'>
            <path
              fill='#322abb'
              d='M9 2.5V2zm-3 0V3zm6.856 9.422l-.35-.356l-.205.2l.07.277zM13.5 14.5l-.121.485a.5.5 0 0 0 .606-.606zm-4-1l-.354-.354l-.624.625l.857.214zm.025-.025l.353.354a.5.5 0 0 0-.4-.852zM.5 8H0zM7 0v2.5h1V0zm2 2H6v1h3zm6 6a6 6 0 0 0-6-6v1a5 5 0 0 1 5 5zm-1.794 4.279A5.98 5.98 0 0 0 15 7.999h-1a4.98 4.98 0 0 1-1.495 3.567zm.78 2.1L13.34 11.8l-.97.242l.644 2.578zm-4.607-.394l4 1l.242-.97l-4-1zm-.208-.863l-.025.024l.708.707l.024-.024zM9 14q.29 0 .572-.027l-.094-.996A5 5 0 0 1 9 13zm-3 0h3v-1H6zM0 8a6 6 0 0 0 6 6v-1a5 5 0 0 1-5-5zm6-6a6 6 0 0 0-6 6h1a5 5 0 0 1 5-5zm1.5 6A1.5 1.5 0 0 1 6 6.5H5A2.5 2.5 0 0 0 7.5 9zM9 6.5A1.5 1.5 0 0 1 7.5 8v1A2.5 2.5 0 0 0 10 6.5zM7.5 5A1.5 1.5 0 0 1 9 6.5h1A2.5 2.5 0 0 0 7.5 4zm0-1A2.5 2.5 0 0 0 5 6.5h1A1.5 1.5 0 0 1 7.5 5zm0 8c1.064 0 2.042-.37 2.813-.987l-.626-.78c-.6.48-1.359.767-2.187.767zm-2.813-.987c.77.617 1.75.987 2.813.987v-1a3.48 3.48 0 0 1-2.187-.767z'
            />
          </svg>
        </Typography>

        <Typography variant='h6' sx={{ textAlign: 'center', flexGrow: 1 }}>
          {userData ? t(`Assistance chat, ${userData.name}`) : 'Assistant chat Alidantek'}
        </Typography>

        <Typography variant='h6'>
          <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 15 15'>
            <path
              fill='#322abb'
              d='M9 2.5V2zm-3 0V3zm6.856 9.422l-.35-.356l-.205.2l.07.277zM13.5 14.5l-.121.485a.5.5 0 0 0 .606-.606zm-4-1l-.354-.354l-.624.625l.857.214zm.025-.025l.353.354a.5.5 0 0 0-.4-.852zM.5 8H0zM7 0v2.5h1V0zm2 2H6v1h3zm6 6a6 6 0 0 0-6-6v1a5 5 0 0 1 5 5zm-1.794 4.279A5.98 5.98 0 0 0 15 7.999h-1a4.98 4.98 0 0 1-1.495 3.567zm.78 2.1L13.34 11.8l-.97.242l.644 2.578zm-4.607-.394l4 1l.242-.97l-4-1zm-.208-.863l-.025.024l.708.707l.024-.024zM9 14q.29 0 .572-.027l-.094-.996A5 5 0 0 1 9 13zm-3 0h3v-1H6zM0 8a6 6 0 0 0 6 6v-1a5 5 0 0 1-5-5zm6-6a6 6 0 0 0-6 6h1a5 5 0 0 1 5-5zm1.5 6A1.5 1.5 0 0 1 6 6.5H5A2.5 2.5 0 0 0 7.5 9zM9 6.5A1.5 1.5 0 0 1 7.5 8v1A2.5 2.5 0 0 0 10 6.5zM7.5 5A1.5 1.5 0 0 1 9 6.5h1A2.5 2.5 0 0 0 7.5 4zm0-1A2.5 2.5 0 0 0 5 6.5h1A1.5 1.5 0 0 1 7.5 5zm0 8c1.064 0 2.042-.37 2.813-.987l-.626-.78c-.6.48-1.359.767-2.187.767zm-2.813-.987c.77.617 1.75.987 2.813.987v-1a3.48 3.48 0 0 1-2.187-.767z'
            />
          </svg>
        </Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === 'User' ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
              p: 2,
              borderRadius: 4,
              backgroundColor: msg.sender === 'User' ? 'primary.main' : 'grey.200',
              '& .MuiTypography-root': {
                fontSize: '1rem',
                fontWeight: 'normal',
                lineHeight: '1.5',
                color: msg.sender === 'User' ? 'white' : 'black'
              }
            }}
          >
            <Typography className='MuiTypography-root'>{msg.message}</Typography>
          </Box>
        ))}
      </Box>

      {/* Suggestions */}
      <Box
        sx={{
          p: 2,
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant='contained'
            size='small'
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: 'primary.dark'
              },
              transition: 'background-color 0.3s ease',
              boxShadow: 2,
              margin: '5px'
            }}
            onClick={() => setInputValue(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          gap: 2
        }}
      >
        <TextField
          fullWidth
          size='small'
          placeholder='Écrivez un message...'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') handleMessageSend()
          }}
        />
        <Button variant='contained' color='primary' onClick={handleMessageSend}>
          Envoyer
        </Button>
      </Box>
    </Box>
  )
}

ChatbotPage.acl = {
  action: 'read',
  subject: 'chatbot'
}

export default ChatbotPage
