import { time } from 'console';
import React, { useState, useEffect, useRef } from 'react';
import { LandingPage } from './landing';

const WebSocketClient: React.FC = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [chatHistory, setChatHistory] = React.useState<ChatEntry[]>([]);

    /*const nameInputRef = useRef<HTMLInputElement>(null);*/
    const [name, setName] = useState<string>('');
    const messageInputRef = useRef<HTMLInputElement>(null);

    interface ChatEntry {
        name: string;
        color: string;
        message: string;
        timestamp: string;
    }


    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket('ws://localhost:3003');
        setWs(socket);

        // Connection opened
        socket.onopen = () => {
            console.log('Connected to the WebSocket server.');
        };

        // Listen for messages
        socket.onmessage = (event: MessageEvent) => {
            console.log(`Received message from server: ${event.data}`);

            const parsedData = JSON.parse(event.data);

            switch (parsedData.type) {
                case 'server': {
                    console.log('SERVER:', parsedData.message);
                    setResponse(parsedData.message);
                    break;
                }
                case 'chat': {

                    const newChatEntry: ChatEntry = parsedData.payload;
                    newChatEntry.color = '#ff0000'; // TODO change to color in landing.tsx

                    /*                    
                    const newChatEntry: ChatEntry = {
                                            name: parsedData.name,
                                            message: parsedData.message,
                                            timestamp: parsedData.timestamp,
                                            color: '#ff0000',
                                        }*/
                    console.log('newChatEntry', newChatEntry);
                    setChatHistory(prev => [...prev, newChatEntry]);
                    break;
                }
                default:
                    console.warn('Unknown message type:', parsedData);
            }

   
            // TODO: structure nicely for FE with color
        };

        socket.onclose = (event) => {
            console.log("Socket closed", event);
            console.log(`${name} has left the chat.`);
            // TODO: add to response to show on page
        };

  /*      socket.onerror = (error) => {
            console.error("Socket error:", error);
        };
*/

        // Function to send disconnect message
        const handleBeforeUnload = () => {
            if (socket.readyState === WebSocket.OPEN) {
 /*               const name = nameInputRef.current?.value || 'Anonymous';*/
                const disconnectMessage = `${name} has left the chat.`;
/*                socket.send(disconnectMessage);*/
            }
            // Not needed: socket.close(); – browser will do this automatically
        };

        // Attach beforeunload event
        window.addEventListener('beforeunload', handleBeforeUnload);


        // Cleanup on unmount
        return () => {
       /*     if (socket.readyState === WebSocket.OPEN) {
                const name = nameInputRef.current?.value || 'Anonymous';
                const disconnectMessage = `${name} has left the chat.`;
                socket.send(disconnectMessage);
            }*/
            window.removeEventListener('beforeunload', handleBeforeUnload);

            socket.close();
        };
    }, []);

    useEffect(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (!name) return;

        ws.send(JSON.stringify({
            type: 'join',
            name
        }));
    }, [name, ws]);

    const handleSendMessage = () => {
/*        const name = nameInputRef.current?.value || 'Anonymous';
        const msg = messageInputRef.current?.value || '';
        const fullMessage = `${name}: ${msg}`;*/
        if (ws && ws.readyState === WebSocket.OPEN) {
            /*   ws.send(fullMessage);*/

            ws.send(JSON.stringify({
                type: 'message',
                text: message,
                name: name,
            }));
        }
    };

    const formatChat = (chatEntry: ChatEntry) => {
        if (!chatEntry) {
            return;
        }

        const dateTime = new Date(chatEntry.timestamp).toLocaleTimeString();
        const dateTimeString = `{${dateTime}}`;
        console.log('color', chatEntry.color);
        if (chatEntry) {
            return (
                <div style={{ textAlign: 'left'}}>
                    
                    {dateTimeString} [<span style={{ color: chatEntry.color, fontWeight: 'bold' }}>{chatEntry.name}</span>]: {chatEntry.message}
                   
                   <br/>

                </div>
            )
        }
    }

    return (
        <div>
            <LandingPage name={name} setName={setName} />

            {name ?  
                <>
                    <input
                        type="text"
                        placeholder="Type a message"
                        ref={messageInputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage}>Send Message</button>
                    <p>{response}</p>
                    {chatHistory.map(chat => formatChat(chat))}
                </>

            : <p>Please give your name to start sending messages!</p>
            }

        </div>
    );

};

export default WebSocketClient;
