import { API } from './api.js';
import { ChatUI } from './chatUI.js';

export class MessageHandler {
    constructor() {
        this.chatUI = new ChatUI();
        this.messages = [
            {
                role: "system",
                content: `Keep it Short and Concise: Try not to pack too much information into one message. 
                Aim for 2-3 sentences to keep it simple.Ask Questions: Throw in questions during the conversation to share thoughts and feelings. Something like, "What do you think?" works well.
                Express Emotions: Use emojis or short phrases to express your feelings. For example, "That sounds really fun!"
                Stay on Topic: Maintain an appropriate tone and content based on the conversation topic. Chat casually, like you would with a friend.
                Switch Topics Naturally: If the conversation goes on too long, transition to another topic smoothly. For example, "This is interesting! By the way, what have you been up to lately?"
                Listen Actively: Pay attention to what the other person says and show your reactions. A response like, "I see! I’ve had a similar experience." is great.
                Use Humor: Occasionally mix in humor to make the conversation more enjoyable. Sharing light jokes or funny anecdotes can be fun.
                Use Korean : Talk using Korean only.
                Use Emoji : Please use emoticons.
                Do Not Use Chinese Characters: Do not use Chinese characters in conversation, but use all expressions only in Korean.
                Do Not Use Powerfull talk to me!.
                `
            }
        ];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.chatUI.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatUI.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const userMessage = this.chatUI.getInputValue();
        if (!userMessage) return;

        try {
            this.chatUI.setLoading(true);

            // Add user message
            this.chatUI.addMessage(userMessage, true);
            this.chatUI.clearInput();

            this.messages.push({
                role: "user",
                content: userMessage
            });

            // Get AI response
            const response = await API.sendMessage(this.messages);

            // Add AI message
            this.chatUI.addMessage(response.response, false);

            this.messages.push({
                role: "assistant",
                content: response.response
            });

        } catch (error) {
            this.chatUI.addMessage('죄송합니다. 오류가 발생했습니다.', false);
        } finally {
            this.chatUI.setLoading(false);
        }
    }
}