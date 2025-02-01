function ChatMessage({ message, isUser }) {
    return (
        <div 
            data-name="chat-message"
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div 
                className={`max-w-[70%] rounded-lg p-3 message-bubble ${
                    isUser 
                        ? 'bg-blue-500 bg-opacity-90 text-white' 
                        : 'bg-white bg-opacity-90 text-gray-800'
                }`}
            >
                <p data-name="message-text" className="text-sm">
                    {message}
                </p>
            </div>
        </div>
    );
}
