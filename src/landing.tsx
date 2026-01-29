import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LandingPageProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>
}

export const LandingPage = ({ name, setName }: LandingPageProps) => {
    const nameInputRef = React.useRef<HTMLInputElement>(null);
    const [haveName, setHaveName] = React.useState<boolean>(false);
/*    const [name, setName] = React.useState<string>('');
*/
    const handleSubmit = () => {
        if (nameInputRef.current) {
            const enteredName = nameInputRef.current.value;
            if (enteredName.trim()) {
                setName(enteredName);
                setHaveName(true);
            }
        }
    };

    const [color, setColor] = React.useState<string>('#ff0000');

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    return (
        <div className=''>

            <h1>Welcome to the game!</h1>
            {!haveName ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        ref={nameInputRef}
                    />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            ) : (
                <div>
                    <h5>Welcome {name}!</h5>
                </div>
            )}
            <div>
                <p>Choose your Color</p>
                <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                />

            </div>

            <br />

        </div>
    );
};