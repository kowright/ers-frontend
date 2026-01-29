import React, { useState, useEffect, useRef } from 'react';
import { LandingPage } from './landing';

const WebSocketClient: React.FC = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    /*const nameInputRef = useRef<HTMLInputElement>(null);*/
    const [name, setName] = useState<string>('');
    const messageInputRef = useRef<HTMLInputElement>(null);

    const fullMessage = `${name || 'Anonymous'}: ${message}`;


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
            setResponse(event.data);
        };

        socket.onclose = (event) => {
            console.log("Socket closed", event);
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
                socket.send(disconnectMessage);
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
    }, [name]);

    const handleSendMessage = () => {
/*        const name = nameInputRef.current?.value || 'Anonymous';
        const msg = messageInputRef.current?.value || '';
        const fullMessage = `${name}: ${msg}`;*/
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(fullMessage);
        }
    };
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
                </>
            : <p>Please give your name to start sending messages!</p>
            }

        </div>
    );

};

export default WebSocketClient;
