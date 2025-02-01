function createSpeechUtils() {
    let recognition = null;
    let synthesis = null;

    try {
        if (window.webkitSpeechRecognition) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';
            recognition.maxAlternatives = 1;
        } else if (window.SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';
            recognition.maxAlternatives = 1;
        }

        if (window.speechSynthesis) {
            synthesis = window.speechSynthesis;
        }
    } catch (error) {
        reportError(error);
        console.error('Speech recognition initialization error:', error);
    }

    async function checkMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone permission error:', error);
            return false;
        }
    }

    async function requestMicrophonePermission() {
        try {
            const result = await checkMicrophonePermission();
            if (!result) {
                throw new Error('Microphone permission denied');
            }
            return true;
        } catch (error) {
            reportError(error);
            return false;
        }
    }

    async function startListening(onResult, onEnd, onError) {
        try {
            if (!recognition) {
                throw new Error('Speech recognition not supported in this browser');
            }

            const hasPermission = await requestMicrophonePermission();
            if (!hasPermission) {
                onError('Por favor, permita o acesso ao microfone nas configurações do seu navegador.');
                onEnd();
                return;
            }

            let finalTranscript = '';

            recognition.onstart = () => {
                console.log('Speech recognition started');
                finalTranscript = '';
            };

            recognition.onresult = (event) => {
                try {
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                            console.log('Final transcript:', finalTranscript);
                            onResult(finalTranscript.trim());
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    console.log('Interim transcript:', interimTranscript);
                } catch (error) {
                    reportError(error);
                    console.error('Speech recognition result error:', error);
                    onError('Erro ao processar o áudio. Por favor, tente novamente.');
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let errorMessage = 'Erro ao acessar o microfone.';
                
                switch (event.error) {
                    case 'not-allowed':
                        errorMessage = 'Acesso ao microfone negado. Por favor, permita o acesso nas configurações do navegador.';
                        break;
                    case 'network':
                        errorMessage = 'Erro de conexão. Verifique sua internet.';
                        break;
                    case 'no-speech':
                        errorMessage = 'Nenhuma fala detectada. Por favor, tente novamente.';
                        break;
                    case 'aborted':
                        errorMessage = 'Gravação interrompida.';
                        break;
                }
                
                onError(errorMessage);
                onEnd();
            };

            recognition.onend = () => {
                console.log('Speech recognition ended');
                if (finalTranscript.trim()) {
                    onResult(finalTranscript.trim());
                }
                onEnd();
            };

            recognition.start();
        } catch (error) {
            reportError(error);
            console.error('Speech recognition start error:', error);
            onError('Erro ao iniciar o reconhecimento de voz. Por favor, tente novamente.');
            onEnd();
        }
    }

    function stopListening() {
        try {
            if (recognition) {
                recognition.stop();
            }
        } catch (error) {
            reportError(error);
            console.error('Speech recognition stop error:', error);
        }
    }

    function speak(text) {
        try {
            if (!synthesis) {
                throw new Error('Speech synthesis not supported in this browser');
            }

            synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onerror = (event) => {
                reportError(new Error(`Speech synthesis error: ${event.error}`));
                console.error('Speech synthesis error:', event.error);
            };

            synthesis.speak(utterance);
        } catch (error) {
            reportError(error);
            console.error('Speech synthesis error:', error);
        }
    }

    return {
        startListening,
        stopListening,
        speak,
        isSupported: !!recognition && !!synthesis
    };
}
