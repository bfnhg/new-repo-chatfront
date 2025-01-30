// // pages/conversations/[id].js
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/router'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import CardHeader from '@mui/material/CardHeader'
// import { createTheme, ThemeProvider } from '@mui/material/styles'

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2'
//     },
//     secondary: {
//       main: '#dc004e'
//     },
//     background: {
//       default: '#f5f5f5',
//       paper: '#ffffff'
//     }
//   }
// })

// const ConversationDetail = () => {
//   const router = useRouter()
//   const { id } = router.query
//   const [conversation, setConversation] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (id) {
//       fetchConversation()
//     }
//   }, [id])

//   const fetchConversation = async () => {
//     try {
//       const token = localStorage.getItem('accessToken')
//       if (!token) {
//         console.warn('Aucun token trouvé. Redirection ou autre gestion nécessaire.')
//         return
//       }

//       const response = await axios.get(`http://localhost:5000/api/client/conversations/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       })

//       setConversation(response.data)
//       setLoading(false)
//     } catch (error) {
//       console.error('Erreur lors de la récupération de la conversation :', error)
//       setLoading(false)
//       setError(error.message)
//     }
//   }

//   if (loading) return <Typography>Chargement de la conversation...</Typography>
//   if (error) return <Typography color='error'>{error}</Typography>

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ height: '100vh', overflowY: 'scroll', p: 4, backgroundColor: 'background.default' }}>
//         <Typography variant='h4' sx={{ mb: 4, color: 'primary.main', textAlign: 'center' }}>
//           Conversation #{conversation?.conversation_id}
//         </Typography>
//         <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
//           <CardHeader
//             title={
//               <Typography variant='h6' sx={{ color: 'primary.main' }}>
//                 Conversation #{conversation?.conversation_id}
//               </Typography>
//             }
//             subheader={
//               <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
//                 Dernier message : {new Date(conversation?.last_message_time).toLocaleString()}
//               </Typography>
//             }
//             sx={{
//               backgroundColor: 'primary.light',
//               borderBottom: '1px solid',
//               borderColor: 'divider'
//             }}
//           />
//           <CardContent>
//             <List>
//               {conversation?.messages.map(message => (
//                 <ListItem key={message.message_id} alignItems='flex-start' sx={{ py: 1 }}>
//                   <ListItemText
//                     primary={
//                       <Box>
//                         <Typography variant='body1' sx={{ fontWeight: 500, color: 'text.primary' }}>
//                           Vous : {message.user_message}
//                         </Typography>
//                         <Typography variant='body1' sx={{ color: 'secondary.main' }}>
//                           Assistant : {message.assistant_message}
//                         </Typography>
//                       </Box>
//                     }
//                     secondary={
//                       <Typography variant='caption' sx={{ color: 'text.secondary' }}>
//                         Envoyé à : {new Date(message.timestamp).toLocaleString()}
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Box>
//     </ThemeProvider>
//   )
// }

// export default ConversationDetail
