// pages/chatbot/[chatbotId].js
import React from 'react'
import ChatbotPage from 'src/pages/chatbot/index' // Importez votre composant ChatbotPage

const DynamicChatbotPage = ({ chatbotId }) => {
  return <ChatbotPage chatbotId={chatbotId} />
}

export async function getServerSideProps(context) {
  const { chatbotId } = context.params

  return {
    props: {
      chatbotId
    }
  }
}

DynamicChatbotPage.acl = {
  action: 'read',
  subject: 'chatbot'
}

export default DynamicChatbotPage
