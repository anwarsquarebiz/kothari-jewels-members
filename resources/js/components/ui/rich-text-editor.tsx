import { $generateHtmlFromNodes } from '@lexical/html';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
    disabled?: boolean;
    className?: string;
}

function MyOnChangePlugin({ onChange }: { onChange: (value: string) => void }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                onChange(htmlString);
            });
        });
    }, [editor, onChange]);
    return null;
}

function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the component mounts
        editor.focus();
    }, [editor]);

    return null;
}

const theme = {
    // Theme styling goes here
    paragraph: 'mb-2',
    heading: {
        h1: 'text-2xl font-bold mb-4',
        h2: 'text-xl font-bold mb-3',
        h3: 'text-lg font-bold mb-2',
        h4: 'text-base font-bold mb-2',
        h5: 'text-sm font-bold mb-1',
        h6: 'text-xs font-bold mb-1',
    },
    list: {
        nested: {
            listitem: 'list-none',
        },
        ol: 'list-decimal ml-4',
        ul: 'list-disc ml-4',
        listitem: 'mb-1',
    },
    link: 'text-blue-600 hover:text-blue-800 underline',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        strikethrough: 'line-through',
        underline: 'underline',
    },
    quote: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
    code: 'bg-gray-100 px-1 py-0.5 text-sm font-mono',
    codeHighlight: {
        atrule: 'text-purple-600',
        attr: 'text-blue-600',
        boolean: 'text-red-600',
        builtin: 'text-blue-600',
        cdata: 'text-gray-600',
        char: 'text-green-600',
        class: 'text-blue-600',
        'class-name': 'text-blue-600',
        comment: 'text-gray-600',
        constant: 'text-red-600',
        deleted: 'text-red-600',
        doctype: 'text-gray-600',
        entity: 'text-orange-600',
        function: 'text-blue-600',
        important: 'text-red-600',
        inserted: 'text-green-600',
        keyword: 'text-purple-600',
        namespace: 'text-blue-600',
        number: 'text-red-600',
        operator: 'text-gray-600',
        prolog: 'text-gray-600',
        property: 'text-blue-600',
        punctuation: 'text-gray-600',
        regex: 'text-green-600',
        selector: 'text-purple-600',
        string: 'text-green-600',
        symbol: 'text-red-600',
        tag: 'text-red-600',
        url: 'text-blue-600',
        variable: 'text-orange-600',
    },
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error);
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Enter content...',
    height = 300,
    disabled = false,
    className = '',
}: RichTextEditorProps) {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [
            HeadingNode,
            QuoteNode,
        ],
        editable: !disabled,
    };

    return (
        <div className={cn('border border-input ', className)}>
            <LexicalComposer initialConfig={initialConfig}>
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className={cn(
                                    'min-h-[150px] p-3 focus:outline-none',
                                    disabled && 'cursor-not-allowed opacity-50'
                                )}
                                style={{ minHeight: `${height}px` }}
                                placeholder={
                                    <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
                                        {placeholder}
                                    </div>
                                }
                            />
                        }
                        placeholder={null}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <MyOnChangePlugin onChange={onChange} />
                    {!disabled && <MyCustomAutoFocusPlugin />}
                </div>
            </LexicalComposer>
        </div>
    );
}