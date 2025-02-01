function VoiceButton({ onVoiceInput, isListening }) {
    const buttonTitle = isListening 
        ? "Clique para parar a gravação" 
        : "Clique para começar a falar";

    return (
        <button
            data-name="voice-button"
            onClick={(e) => {
                e.preventDefault();
                onVoiceInput();
            }}
            className={`voice-button p-3 rounded-full ${
                isListening 
                    ? 'recording bg-red-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
            }`}
            title={buttonTitle}
            type="button"
        >
            <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
        </button>
    );
}
