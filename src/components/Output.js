import React, { useState, useEffect } from 'react';
import { executeCode } from '../api'; // Adjust the import path as needed

const Output = ({ editorRef, language }) => {
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const runCode = async () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            try {
                const response = await executeCode(language, code);
                console.log(response);
                console.log(response.run);
                if (response && response.run) {
                    setOutput(response.run.output);
                    setError(response.run.stderr);
                } else {
                    setOutput('No output received.');
                }
            } catch (err) {
                setError('An error occurred while running the code.');
                console.error(err);
            }
        } else {
            setError('Editor reference is not available.');
        }
    };

    useEffect(() => {
        runCode(); // Optionally, run code on mount or based on other conditions
    }, [language]);

    return (
        <div>
            <button onClick={runCode}>Run Code</button>
            <div>
                <h3>Output</h3>
                <pre>{output}</pre>
            </div>
            <div>
                <h3>Error</h3>
                <pre>{error}</pre>
            </div>
        </div>
    );
};

export default Output;
