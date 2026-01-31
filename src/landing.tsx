import React from 'react';

interface LandingPageProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    color: string;
}

export const LandingPage = ({ name, setName, setColor, color }: LandingPageProps) => {
    const [haveName, setHaveName] = React.useState<boolean>(false);
    const nameInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const enteredName = nameInputRef.current?.value ?? name;
        if (enteredName.trim()) {
            setName(enteredName);
            setHaveName(true);
        }
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    return (
        <div className=''>

            <h1>Welcome to the chat!</h1>
            {!haveName ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        ref={nameInputRef}
                    />
                    <div>
                        <p>Choose your Color</p>
                        <input
                            type="color"
                            value={color}
                            onChange={handleColorChange}
                        />

                    </div>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            ) : (
                <div>
                        <h2>Welcome <span style={{ color: color, fontWeight: 'bold' }}>{name}</span>!</h2> 
                </div>
            )}
 

            <br />

        </div>
    );
};