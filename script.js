// console.log('ping pong');
const typingForm = document.querySelector(".typing-form");
const chatElement = document.querySelector(".chat");
let userMessage;
const API_KEY = 'AIzaSyCpUhc-_oqX7ndwcU3tb21cwor2n0Y4eOE';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

const createMessageEl = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add('message', ...classes);
    div.innerHTML = content;
    return div;
}

const generateAPIResponse = async (incomingMessageDiv) => {
    const textEl = incomingMessageDiv.querySelector('.text');

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{text: userMessage}]
                }]
        })
        });

        const data = await res.json();

        textEl.innerText = data?.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error(e);
    } finally {
        incomingMessageDiv.classList.remove('loading');
    }
}

const showLoading = () => {
    const html =
        `<div class="message-content">
            <img src="img/google-gemini-ai-icon-.png" alt="gemini image" class="avatar">
            <p class="text"></p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>
        <button onclick="copyMessage(this)" class="icon material-symbols-rounded">
            content_copy
        </button>`;

    const incomingMessageDiv = createMessageEl(html, 'incoming', 'loading');
    chatElement.appendChild(incomingMessageDiv);

    generateAPIResponse(incomingMessageDiv);
}

const copyMessage = (copyIcon) => {
    const textToCopy = copyIcon.parentElement.querySelector('.text').innerText;
    navigator.clipboard.writeText(textToCopy);
    copyIcon.innerText = 'done'

    setTimeout(() => copyIcon.innerText = 'content_copy', 1000);
}

const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();

    if (!userMessage) { // sai da função se não há mensagens
        return;
    }

    const html =
        `<div class="message-content">
            <img src="img/user-avatar.jpg" alt="user image" class="avatar">
            <p class="text">${userMessage}</p>
        </div>`;

    const outgoingMessageDiv = createMessageEl(html, 'outgoing');
    chatElement.appendChild(outgoingMessageDiv);

    typingForm.reset();
    chatElement.scrollTo(0, chatElement.scrollHeight);
    document.body.classList.add('hide-welcome');
    setTimeout(showLoading, 500);
}

typingForm.addEventListener("submit", (e) => {
    e.preventDefault(); // previne reload quando "postado"

    handleOutgoingChat();
})
