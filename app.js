function App() {
    const [messages, setMessages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSpeaking, setIsSpeaking] = React.useState(false);
    const [isListening, setIsListening] = React.useState(false);
    const [error, setError] = React.useState('');
    const messageEndRef = React.useRef(null);
    const chatAgent = React.useMemo(() => createSpanishChatAgent(), []);
    const speechUtils = React.useMemo(() => createSpeechUtils(), []);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    React.useEffect(() => {
        if (!speechUtils.isSupported) {
            setMessages([{
                text: "Aviso: Seu navegador não suporta recursos de voz. Recomendamos usar o Google Chrome para melhor experiência.",
                isUser: false
            }]);
        }
    }, []);

    const handleSendMessage = async (message) => {
        try {
            setIsLoading(true);
            setError('');
            const newMessages = [...messages, { text: message, isUser: true }];
            setMessages(newMessages);

            const response = await chatAgent.chat(message, messages);
            setIsSpeaking(true);
            setMessages([...newMessages, { text: response, isUser: false }]);
            
            if (speechUtils.isSupported) {
                const spanishText = response.split('(')[0].trim();
                speechUtils.speak(spanishText);
            }

            setTimeout(() => setIsSpeaking(false), 2000);
        } catch (error) {
            reportError(error);
            setMessages(prev => [...prev, {
                text: "Desculpe, ocorreu um erro ao processar sua mensagem.",
                isUser: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!speechUtils.isSupported) {
            setError("Seu navegador não suporta recursos de voz. Por favor, use o Google Chrome.");
            return;
        }

        if (isListening) {
            speechUtils.stopListening();
            setIsListening(false);
            return;
        }

        setError('');
        setIsListening(true);
        speechUtils.startListening(
            (transcript) => {
                if (transcript.trim()) {
                    handleSendMessage(transcript);
                }
            },
            () => setIsListening(false),
            (errorMessage) => {
                setError(errorMessage);
                setIsListening(false);
            }
        );
    };

    return (
        <div data-name="chat-container" className="chat-container">
            <div data-name="chat-content" className="chat-content">
                <div data-name="header" className="header p-4 shadow">
                    <h1 className="text-xl font-bold text-center text-gray-800">
                        Chat em Espanhol
                    </h1>
                </div>
                
                <div data-name="avatar-section" className="avatar-section p-4">
                    <Avatar isSpeaking={isSpeaking} />
                    {error && (
                        <div className="mt-2 text-center text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div data-name="messages-container" className="message-container p-4">
                    {messages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            message={message.text}
                            isUser={message.isUser}
                        />
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div data-name="input-section" className="input-section">
                    <ChatInput 
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        onVoiceInput={handleVoiceInput}
                        isListening={isListening}
                    />
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
