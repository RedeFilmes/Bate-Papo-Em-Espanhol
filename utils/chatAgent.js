function createSpanishChatAgent() {
    const systemPrompt = `You are a friendly Spanish-speaking avatar assistant. Your task is to:
1. Always respond in Spanish
2. Keep responses concise and friendly
3. Help users practice Spanish conversation
4. If the user writes in another language, understand it but always respond in Spanish
5. Include a simple Portuguese translation in parentheses after your Spanish response`;

    async function chat(message, chatHistory) {
        try {
            const historyContext = JSON.stringify(chatHistory);
            const response = await invokeAIAgent(systemPrompt + "\n\nChat history:\n" + historyContext, message);
            return response;
        } catch (error) {
            reportError(error);
            return "Lo siento, hubo un error. (Desculpe, ocorreu um erro.)";
        }
    }

    return { chat };
}
