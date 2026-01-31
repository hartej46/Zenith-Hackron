import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react'
import { api } from '../services/api'

function AIChat() {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am Zenith AI. I have access to your inventory and order data. How can I help you today?' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const data = await api.chatAI(input)
            setMessages(prev => [...prev, { role: 'ai', content: data.response }])
        } catch (error) {
            console.error('AI Chat Error:', error)
            const errorDetail = error.response?.data?.detail || ''
            const errorMessage = errorDetail.includes('insufficient_quota')
                ? 'OpenAI Quota Exceeded: Please check your billing/credits on the OpenAI dashboard.'
                : `AI Error: ${errorDetail || 'I encountered an error connecting to my brain. Please make sure the AI server is running.'}`

            setMessages(prev => [...prev, { role: 'ai', content: errorMessage }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container p-xl animate-fadeIn h-full flex flex-col max-w-4xl mx-auto">
            <header className="page-header mb-xl">
                <h1 className="flex items-center gap-md text-2xl font-black">
                    <MessageSquare size={28} className="text-black" />
                    AI Operations Hub
                </h1>
                <p className="text-tertiary">Real-time inventory intelligence and operational assistance.</p>
            </header>

            <div className="flex-1 bg-white rounded-xl shadow-sm border border-border-subtle flex flex-col overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-xl flex flex-col gap-lg">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-lg ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : 'bg-tertiary/10 text-primary'}`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`max-w-[80%] p-md rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-black text-white rounded-tr-none'
                                : 'bg-tertiary/5 text-primary border border-border-subtle rounded-tl-none font-medium'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-lg">
                            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-tertiary/5 p-md rounded-2xl rounded-tl-none border border-border-subtle">
                                <Loader2 size={18} className="animate-spin text-tertiary" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-xl border-t border-border-subtle bg-white/50 backdrop-blur-sm">
                    <div className="flex gap-md bg-white p-sm rounded-xl border-2 border-border-subtle focus-within:border-black transition-all shadow-inner">
                        <input
                            type="text"
                            placeholder="Ask about stock levels, expiring items, or order priorities..."
                            className="bg-transparent border-none focus:ring-0 p-sm flex-1 text-sm font-medium outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="bg-black text-white p-md rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                            disabled={loading || !input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-tertiary mt-sm text-center font-bold uppercase tracking-widest">
                        Zenith AI • Context-Aware RAG Engine Active
                    </p>
                </form>
            </div>
        </div>
    )
}

export default AIChat
