function ChatInput({ onSendMessage, isLoading, onVoiceInput, isListening }) {
    const [message, setMessage] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form 
            data-name="chat-input-form"
            onSubmit={handleSubmit} 
            className="p-4"
        >
            <div className="flex gap-2 items-center">
                <VoiceButton 
                    onVoiceInput={onVoiceInput}
                    isListening={isListening}
                />
                <input
                    data-name="message-input"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white bg-opacity-90"
                    disabled={isLoading}
                />
                <button
                    data-name="send-button"
                    type="submit"
                    className={`px-4 py-2 rounded-lg bg-blue-500 text-white 
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fas fa-paper-plane"></i>
                    )}
                </button>
            </div>
        </form>
    );
}
