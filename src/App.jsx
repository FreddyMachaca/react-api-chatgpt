import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim()) return
    
    const userMessage = { type: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setInput('')
    
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003", 
          prompt: userMessage.content, 
          max_tokens: 2048, 
          temperature: 0.5,
        }),
      })
      
      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: data.choices[0].text.trim()
        }])
      } else {
        setMessages(prev => [...prev, {
          type: 'error',
          content: "Lo siento, no pude generar una respuesta."
        }])
      }
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        type: 'error',
        content: "Error de conexión. Por favor, intenta nuevamente."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Assistant</h1>
        <p>Hazme cualquier pregunta</p>
      </div>
      
      <div className="chat-content">
        {messages.length === 0 && (
          <div className="empty-chat">
            <p>Envía un mensaje para comenzar la conversación</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className={`message-bubble ${message.type}-bubble`}>
              {message.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message assistant">
            <div className="message-bubble assistant-bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            disabled={loading}
            id="campo-pregunta"
          />
          <button 
            type="submit" 
            disabled={loading}
            id="btn-pregunta-chat"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
