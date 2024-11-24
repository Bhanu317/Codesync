import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/xml/xml'; // For HTML/XML
import 'codemirror/mode/clike/clike'; // For C++ and Java
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { debounce } from 'lodash'; // Ensure lodash is installed

const Editor = ({ socketRef, roomId, onCodeChange, language, editorRef }) => {
    const debouncedCodeChange = useRef(
        debounce((code) => {
            onCodeChange(code);
            if (socketRef.current) {
                socketRef.current.emit('code_change', {
                    roomId,
                    code,
                });
            }
        }, 500) // Adjust debounce delay as needed
    ).current;

    useEffect(() => {
        if (!socketRef.current) return; // Ensure socketRef is initialized

        const editor = Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: languageMode(language),
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );

        editorRef.current = editor;

        editor.on('change', (instance, changes) => {
            const code = instance.getValue();
            debouncedCodeChange(code);
        });

        socketRef.current.on('code_change', ({ code }) => {
            if (code !== null && editor) {
                // Update editor only if the incoming code is different
                if (editor.getValue() !== code) {
                    editor.setValue(code);
                }
            }
        });

        return () => {
            editor.toTextArea();
            if (socketRef.current) {
                socketRef.current.off('code_change');
            }
        };
    }, [language, socketRef, onCodeChange, editorRef]);

    const languageMode = (language) => {
        switch (language) {
            case 'javascript':
                return 'javascript';
            case 'python':
                return 'python';
            case 'html':
                return 'xml'; // HTML mode is included in XML mode
            case 'cpp':
                return 'text/x-c++src'; // C++ mode
            case 'java':
                return 'text/x-java'; // Java mode
            default:
                return 'javascript';
        }
    };

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
