import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Post, PostContent, Platform } from '@/types';
import { PLATFORMS } from '@/constants';
import { Send, Bot, User, Loader2, CheckCircle, PlusCircle, History, PanelLeftClose } from 'lucide-react';

interface ContentStrategistViewProps {
    onPostCreated: (post: Post) => void;
}

type Message = {
    role: 'user' | 'model' | 'system';
    content: string;
    postData?: any;
};

type ChatThread = {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
};

const ContentStrategistView: React.FC<ContentStrategistViewProps> = ({ onPostCreated }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chatHistory, setChatHistory] = useState<ChatThread[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | 'new'>('new');
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    const platformList = PLATFORMS.map(p => p.id).join(', ');
    const systemInstruction = `You are 'ContentOS AI', an expert social media strategist. Your goal is to have a friendly and helpful conversation with the user to brainstorm and create a social media post.

1.  Start by introducing yourself and asking what the user wants to promote or talk about.
2.  Guide the conversation to gather these key details:
    *   A clear **topic**.
    *   One or more target **platforms** from this list: ${platformList}.
    *   A specific **content type** (e.g., engaging, educational, promotional).
    *   A desired **tone** (e.g., professional, casual, humorous).
3.  Once you have all the information, summarize the plan and ask the user for confirmation to proceed with generating the content. Use markdown for your summary (bolding and bullet points).
4.  **IMPORTANT**: After the user confirms, your VERY NEXT response must be ONLY the generated content as a single JSON object, enclosed in a markdown code block like this:
    \`\`\`json
    {
      "topic": "A brief, descriptive topic summary",
      "twitter": "...",
      "linkedin": "...",
      "imageSuggestion": "...",
      "videoSuggestion": "..."
    }
    \`\`\`
    Only include keys in the JSON for the platforms the user selected. Do not add any text or explanation before or after the JSON block in that final message.`;

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('socialMediaChatHistory');
            if (savedHistory) {
                setChatHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Could not parse chat history from localStorage", e);
        }
        startNewChat(true);
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const saveCurrentChat = () => {
        if (messages.length <= 1) return;

        const firstUserMessage = messages.find(m => m.role === 'user');
        const title = firstUserMessage 
            ? firstUserMessage.content.substring(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '') 
            : 'Untitled Chat';

        const newThread: ChatThread = {
            id: crypto.randomUUID(),
            title,
            timestamp: new Date().toISOString(),
            messages,
        };
        
        setChatHistory(prevHistory => {
            const newHistory = [newThread, ...prevHistory];
            localStorage.setItem('socialMediaChatHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const startNewChat = (isInitialLoad = false) => {
        if (!isInitialLoad && activeThreadId === 'new') {
            saveCurrentChat();
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            setChat(newChat);
            setMessages([
                { role: 'model', content: "Hello! I'm your AI Content Strategist. What brilliant idea or product are we working on today?" }
            ]);
            setActiveThreadId('new');
            setError(null);
        } catch (e) {
            console.error(e);
            setError("Failed to initialize AI strategist. Please check your API key and refresh.");
        }
    };

    const handleSelectThread = (thread: ChatThread) => {
        if (activeThreadId === 'new') {
            saveCurrentChat();
        }
        setMessages(thread.messages);
        setActiveThreadId(thread.id);
        setChat(null); 
        setIsLoading(false);
    };

    const handleCreatePost = (postData: any) => {
        const { topic, imageSuggestion, videoSuggestion, ...platformContent } = postData;
        const platforms = Object.keys(platformContent).filter(key => PLATFORMS.some(p => p.id === key)) as Platform[];

        if (platforms.length === 0) {
            setError("The generated content didn't specify any valid platforms.");
            return;
        }

        const newPost: Post = {
            id: crypto.randomUUID(),
            topic: topic || "AI Generated Content",
            platforms,
            content: { ...platformContent, imageSuggestion, videoSuggestion },
            status: 'draft',
            createdAt: new Date().toISOString(),
            isGeneratingImage: false,
            isGeneratingVideo: false,
            videoGenerationStatus: '',
        };
        onPostCreated(newPost);
        saveCurrentChat();
        startNewChat();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat || activeThreadId !== 'new') return;

        const userMessage: Message = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const result = await chat.sendMessageStream({ message: userInput });
            
            let currentResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of result) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = currentResponse;
                    return newMessages;
                });
            }

            const jsonMatch = currentResponse.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    const parsedJson = JSON.parse(jsonMatch[1]);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = {
                            role: 'system',
                            content: 'Here is the content we came up with. Ready to create this post?',
                            postData: parsedJson,
                        };
                        return newMessages;
                    });
                } catch (parseError) {
                    console.error("JSON parsing error:", parseError);
                    setError("The AI returned a plan, but it wasn't formatted correctly. You can ask it to try again.");
                }
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setMessages(prev => [...prev, { role: 'system', content: 'Sorry, I ran into a problem. Please try again.'}]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        // Fix: Replace `JSX.Element` with `React.ReactElement` to resolve namespace error.
        const elements: React.ReactElement[] = [];
        let listItems: React.ReactElement[] = [];

        const renderLineContent = (line: string) => {
            return line.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };
        
        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">{listItems}</ul>);
                listItems = [];
            }
        };

        lines.forEach((line, i) => {
            if (line.trim().startsWith('* ')) {
                listItems.push(<li key={i} className="pl-2">{renderLineContent(line.trim().substring(2))}</li>);
            } else {
                flushList();
                if (line.trim() !== '') {
                    elements.push(<p key={i}>{renderLineContent(line)}</p>);
                }
            }
        });

        flushList();

        return <div className="space-y-2">{elements}</div>;
    };


    const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
        const isUser = msg.role === 'user';
        const isModel = msg.role === 'model';
        const isSystem = msg.role === 'system';

        if (isSystem && msg.postData) {
            return (
                <div className="bg-gray-700 rounded-lg p-4 my-2 text-sm text-gray-200 border border-indigo-500 shadow-lg">
                    <p className="font-semibold mb-4">{msg.content}</p>
                    <div className="bg-gray-800 p-3 rounded-md mb-4">
                        <h4 className="font-bold text-white mb-2">Topic: <span className="font-normal">{msg.postData.topic}</span></h4>
                        <p className="text-xs text-gray-400 whitespace-pre-wrap">{JSON.stringify(msg.postData, null, 2)}</p>
                    </div>
                    <button
                        onClick={() => handleCreatePost(msg.postData)}
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Accept & Create Post
                    </button>
                </div>
            );
        }

        return (
            <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                    {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`p-3 rounded-lg max-w-lg text-sm ${isUser ? 'bg-indigo-800 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    {isModel ? renderMarkdown(msg.content) : <p className="whitespace-pre-wrap">{msg.content}</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-row gap-6">
            {isHistoryVisible && (
                <div className="w-1/3 lg:w-1/4 bg-gray-800 rounded-lg shadow-xl flex flex-col h-full">
                    <div className="p-4 border-b border-gray-700">
                        <button
                            onClick={() => startNewChat()}
                            className="w-full flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            New Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <h3 className="px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">History</h3>
                        <nav className="space-y-1">
                            {chatHistory.map(thread => (
                                <button
                                    key={thread.id}
                                    onClick={() => handleSelectThread(thread)}
                                    className={`w-full text-left flex flex-col p-2 rounded-md transition-colors ${
                                        activeThreadId === thread.id ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                                    }`}
                                >
                                    <p className="text-sm font-medium text-white truncate">{thread.title}</p>
                                    <p className="text-xs text-gray-400">{new Date(thread.timestamp).toLocaleDateString()}</p>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-white">AI Content Strategist</h2>
                    <button
                        onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        title={isHistoryVisible ? "Hide History" : "Show History"}
                    >
                        {isHistoryVisible ? <PanelLeftClose className="w-5 h-5" /> : <History className="w-5 h-5" />}
                    </button>
                </div>
                <div className="flex-grow bg-gray-800 rounded-lg shadow-xl flex flex-col p-4 min-h-0">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2">
                        {messages.map((msg, index) => <MessageBubble key={index} msg={msg} />)}
                        {isLoading && (
                            <div className="flex items-start gap-3 my-4">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="p-3 rounded-lg bg-gray-700 text-gray-200 flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 border-t border-gray-700 pt-4">
                        {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}
                        <form onSubmit={handleSubmit} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={activeThreadId !== 'new' ? "Viewing history (read-only)" : "Let's brainstorm some content..."}
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-3 px-5"
                                disabled={isLoading || activeThreadId !== 'new'}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim() || activeThreadId !== 'new'}
                                className="p-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentStrategistView;
