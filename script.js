const time1 = document.getElementById('time1');
time1.innerHTML = new Date().toLocaleString();
const time2 = document.getElementById('time2');
time2.innerHTML = new Date().toLocaleString();


function updateClock() {
    const clock = document.getElementById("clock");
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const timeString = new Date().toLocaleString('en-US', options);
    clock.textContent = timeString;
}

// 更新时钟
setInterval(updateClock, 1000);


// Selectors
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');
const chatBox = document.getElementById('chatbox');
const exportButton = document.getElementById('export-button');

// Event listeners
inputForm.addEventListener('submit', submitForm);
exportButton.addEventListener('click', exportChat);


function sendMessage() {
    // 获取当前时间戳
    const timestamp = new Date().getTime();
    const inputField = document.getElementById("input-field");
    const message = inputField.value;
    if (message === '')
        return;
    inputField.value = "";
    // 将时间戳传递给 appendMessage() 函数
    appendMessage("user", message, timestamp);
    getResponse(message, timestamp)
        .catch((error) => {
            console.log(error);
            appendMessage('chatbot', 'Oops, something went wrong. Please try again later.', new Date().getTime());
        });
}



// Submit form
function submitForm(e) {
    e.preventDefault();
    sendMessage();
}

// 追加消息
function appendMessage(sender, message, timestamp) {
    const isUser = sender === 'user'
    const chatContainer = document.getElementById('chatbox');

    // 创建包含头像和对话内容的元素
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    if (isUser) {
        messageContainer.classList.add('user-message');
        messageContainer.innerHTML = '<div class="avatar user-avatar"></div>';
    } else {
        messageContainer.classList.add('bot-message');
        messageContainer.innerHTML = '<div class="avatar bot-avatar"></div>';
    }

    // 添加对话内容和发送时间
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message');
    chatMessage.classList.add(isUser ? 'user' : 'chatbot');
    chatMessage.innerText = message.trim();

    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    messageTime.innerHTML = formatTimestamp(timestamp);

    // 将对话内容和发送时间添加到messageContainer中
    messageContainer.appendChild(chatMessage);
    messageContainer.appendChild(messageTime);

    // 将messageContainer添加到chatContainer中
    chatContainer.appendChild(messageContainer);

    // 滚动到最新的消息
    chatContainer.scrollTop = chatContainer.scrollHeight;
}



function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).substr(-2);
    const day = ("0" + date.getDate()).substr(-2);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
}


async function getResponse(query) {
    try {
        const response = await fetch('http://10.134.49.15:18000/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip' // 添加这个请求头以接收压缩的响应
            },
            body: JSON.stringify({
                "messages": [{
                    "role": "user",
                    "content": query
                }],
                "stream": true
            }),
            compress: true // 添加这个参数以启用压缩
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader(); // 获取一个读取器
        let chunks = [];
        const chatContainer = document.getElementById('chatbox');
        // 创建包含头像和对话内容的元素
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        messageContainer.classList.add('bot-message');
        messageContainer.innerHTML = '<div class="avatar bot-avatar"></div>';
        chatContainer.append(messageContainer);

        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat-message');
        chatMessage.classList.add('chatbot');


        const messageTime = document.createElement('div');
        messageTime.classList.add('message-time');
        messageTime.innerHTML = formatTimestamp(new Date().getTime());

        // 将对话内容和发送时间添加到messageContainer中
        messageContainer.appendChild(chatMessage);
        messageContainer.appendChild(messageTime);
        // 滚动到最新的消息
        while (true) {
            const {
                done,
                value
            } = await reader.read(); // 读取响应数据
            if (done) break; // 如果响应数据已经读取完毕，则退出循环

            chunks.push(value); // 将读取的数据保存到数组中
            const decodedData = new TextDecoder().decode(value); // 将数据解码为字符串
            renderData(decodedData, chatMessage); // 将数据实时渲染到UI中
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function renderData(data, dialog) {
    // 将数据实时渲染到UI中
    const textNode = document.createTextNode(data);
    dialog.appendChild(textNode);
   
}


// 导出聊天记录
function exportChat() {
    const chatbox = document.getElementById("chatbox");
    let chatLogs = "";
    for (let i = 0; i < chatbox.children.length; i++) {
        const chatMessage = chatbox.children[i].querySelector(".chat-message");
        const messageTime = chatbox.children[i].querySelector(".message-time");
        if (chatMessage) {
            const messageText = chatMessage.innerText.replace(/[\n\r]+|[\s]{2,}/g, " ").trim();
            const timeText = messageTime.innerText.trim();
            const sender = chatMessage.classList.contains('user') ? 'Q' : 'A';
            chatLogs += "~" + timeText + "~ " + sender + ": " + messageText + "\n";
        }
    }
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(chatLogs));
    downloadLink.setAttribute("download", "chat_logs.txt");
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}