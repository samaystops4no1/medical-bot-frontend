export async function getChatList() {
    const response = await fetch('http://localhost:3000/api/chats', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });
    const data = await response.json();
    return data;
}

export async function getChatMessages(chatId) {
    const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });
    const data = await response.json();
    return data;
}

export function getAppointments() {
    return [
        {
            id: 1,
            lastModifiedTime: 1711108800000, // 2025-03-22T12:00:00Z
            title: 'Work in progress',
            createdTime: 1711108800000, // 2025-03-22T12:00:00Z
        }
    ];
}

export async function createChat(chatId,  messages) {
    const newChatObject = {
        id: chatId,
        lastModifiedTime: Date.now(),
        createdTime: Date.now(),
        title: messages[0].content,
        messages: messages
    };
    
    const response = await fetch(`http://localhost:3000/api/chats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newChatObject)
    });
    const data = await response.json();
    return data.newChatObject;
}

export async function submitUserMessage(chatId, messages, setMessages, ) {
    try {
        const response = await fetch(`http://localhost:3000/api/messages/${chatId}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
            message: filterMessages(messages)
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split(/\n\n/);
        lines.forEach(line => {
            if(line){
                // The line starts with "data: " which needs to be removed before parsing
                const jsonString = line.replace(/^data: /, '');
                try {
                    const jsonChunk = JSON.parse(jsonString);
                    if (jsonChunk.content) {
                        result += jsonChunk.content;
                        setMessages([...messages, {role: 'assistant', content: result}]);
                        
                    }
                } catch (error) {
                    console.log('Failed to parse line:', line);
                    console.log('Error:', error.message);
                }
            }
        });
    }
    return { result: result};
    } catch (error) {
        console.log('Failed to submit user message:', error.message);
        return { error: error.message };
    }
}

export async function bookAppointment() {
    try {
        const response = await fetch(`http://localhost:3000/api/book-appointment`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(`Error booking appointment: ${response.status}`);
    }

    return { data };
    } catch (error) {
        console.error('Failed to book appointment:', error.message);
        return { error: error.message };
    }
}

function filterMessages(messages) {
    const filteredMessages = messages.filter(message => message.role !== 'UI');
    return filteredMessages;
}