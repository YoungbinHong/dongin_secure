let chatIdCounter = 1;
let currentChatId = '1';
let chats = {
    '1': { title: '새 대화', messages: [] }
};

function createNewChat() {
    chatIdCounter++;
    const newId = String(chatIdCounter);
    chats[newId] = { title: '새 대화', messages: [] };
    currentChatId = newId;
    renderChatHistory();
    clearMessages();
    document.getElementById('welcomeScreen').classList.remove('hidden');
    document.getElementById('messageInput').focus();
}

function selectChat(chatId) {
    currentChatId = chatId;
    renderChatHistory();
    renderMessages();
}

function deleteChat(event, chatId) {
    event.stopPropagation();
    delete chats[chatId];
    if (Object.keys(chats).length === 0) {
        createNewChat();
    } else if (currentChatId === chatId) {
        currentChatId = Object.keys(chats)[0];
    }
    renderChatHistory();
    renderMessages();
}

function renderChatHistory() {
    const container = document.getElementById('chatHistory');
    const ids = Object.keys(chats).reverse();
    let html = '<div class="history-section"><div class="history-label">대화 목록</div>';
    ids.forEach(id => {
        const chat = chats[id];
        const activeClass = id === currentChatId ? 'active' : '';
        html += `
            <div class="history-item ${activeClass}" data-id="${id}" onclick="selectChat('${id}')">
                <span class="history-title">${chat.title}</span>
                <button class="history-delete" onclick="deleteChat(event, '${id}')">×</button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function clearMessages() {
    document.getElementById('messagesContainer').innerHTML = '';
}

function renderMessages() {
    const container = document.getElementById('messagesContainer');
    const welcome = document.getElementById('welcomeScreen');
    const messages = chats[currentChatId]?.messages || [];

    if (messages.length === 0) {
        welcome.classList.remove('hidden');
        container.innerHTML = '';
        return;
    }

    welcome.classList.add('hidden');
    let html = '';
    messages.forEach(msg => {
        html += createMessageHTML(msg.role, msg.content);
    });
    container.innerHTML = html;
    scrollToBottom();
}

function createMessageHTML(role, content) {
    const isUser = role === 'user';
    const avatarIcon = isUser
        ? '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>';

    return `
        <div class="message ${role}">
            <div class="message-avatar">${avatarIcon}</div>
            <div class="message-content">${escapeHtml(content)}</div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
}

function addMessage(role, content) {
    chats[currentChatId].messages.push({ role, content });
    if (role === 'user' && chats[currentChatId].messages.length === 1) {
        chats[currentChatId].title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        renderChatHistory();
    }
}

function showTypingIndicator() {
    const container = document.getElementById('messagesContainer');
    const html = `
        <div class="message ai" id="typingIndicator">
            <div class="message-avatar">
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    const container = document.getElementById('chatContainer');
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    if (!content) return;

    document.getElementById('welcomeScreen').classList.add('hidden');

    addMessage('user', content);
    const container = document.getElementById('messagesContainer');
    container.insertAdjacentHTML('beforeend', createMessageHTML('user', content));
    scrollToBottom();

    input.value = '';
    input.style.height = 'auto';

    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(content);
        addMessage('ai', response);
        container.insertAdjacentHTML('beforeend', createMessageHTML('ai', response));
        scrollToBottom();
    }, 1000 + Math.random() * 1000);
}

function generateResponse(userMessage) {
    const responses = [
        '네, 말씀하신 내용을 확인했습니다. 더 자세한 정보가 필요하시면 말씀해 주세요.',
        '좋은 질문이네요! 제가 도와드릴 수 있는 부분이 있다면 알려주세요.',
        '알겠습니다. 요청하신 내용을 처리해 드리겠습니다.',
        '흥미로운 주제네요. 어떤 부분에 대해 더 알고 싶으신가요?',
        '네, 이해했습니다. 추가로 필요한 사항이 있으시면 말씀해 주세요.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function useSuggestion(text) {
    document.getElementById('messageInput').value = text;
    sendMessage();
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

const messageInput = document.getElementById('messageInput');
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

document.addEventListener('DOMContentLoaded', () => {
    renderChatHistory();
    messageInput.focus();
});
