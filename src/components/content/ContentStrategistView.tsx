'use client'

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
                const parsedHistory = JSON.parse(savedHistory);
                // Filter out temporary threads on load
                const cleanedHistory = parsedHistory.filter((t: ChatThread) => !t.id.startsWith('temp-'));
                setChatHistory(cleanedHistory);
                if (cleanedHistory.length !== parsedHistory.length) {
                    localStorage.setItem('socialMediaChatHistory', JSON.stringify(cleanedHistory));
                }
            }
        } catch (e) {
            console.error("Could not parse chat history from localStorage", e);
        }
        startNewChat(true);
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    // Auto-save chat history after each message exchange
    useEffect(() => {
        if (messages.length > 1 && activeThreadId === 'new') {
            const firstUserMessage = messages.find(m => m.role === 'user');
            const title = firstUserMessage
                ? firstUserMessage.content.substring(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '')
                : 'Untitled Chat';

            const tempThread: ChatThread = {
                id: 'temp-' + Date.now(),
                title,
                timestamp: new Date().toISOString(),
                messages,
            };

            setChatHistory(prevHistory => {
                const filteredHistory = prevHistory.filter(t => !t.id.startsWith('temp-'));
                const newHistory = [tempThread, ...filteredHistory];
                localStorage.setItem('socialMediaChatHistory', JSON.stringify(newHistory));
                return newHistory;
            });
        }
    }, [messages, activeThreadId]);

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
            // Remove temporary threads and add the permanent one
            const filteredHistory = prevHistory.filter(t => !t.id.startsWith('temp-'));
            const newHistory = [newThread, ...filteredHistory];
            localStorage.setItem('socialMediaChatHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const startNewChat = (isInitialLoad = false) => {
        if (!isInitialLoad && activeThreadId === 'new') {
            saveCurrentChat();
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
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
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 my-3 border border-indigo-200 shadow-md">
                    <p className="font-semibold text-gray-900 mb-4 text-base">{msg.content}</p>
                    <div className="bg-white p-5 rounded-lg mb-5 border border-gray-200 min-h-[200px]">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm">Topic: <span className="font-normal">{msg.postData.topic}</span></h4>
                        <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{JSON.stringify(msg.postData, null, 2)}</p>
                    </div>
                    <button
                        onClick={() => handleCreatePost(msg.postData)}
                        className="w-full flex items-center justify-center py-4 px-4 shadow-lg shadow-indigo-500/30 text-base font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Accept & Create Post
                    </button>
                </div>
            );
        }

        return (
            <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-indigo-700' : 'bg-gray-600'}`}>
                    {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`p-4 rounded-lg text-base shadow-sm ${isUser ? 'bg-indigo-700 text-white max-w-4xl' : 'bg-gray-100 text-gray-900 border border-gray-200 w-[70%]'}`}>
                    {isModel ? renderMarkdown(msg.content) : <p className="whitespace-pre-wrap">{msg.content}</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-row gap-4">
            {isHistoryVisible && (
                <div className="w-64 bg-white rounded-xl shadow-md flex flex-col h-full border border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                        <button
                            onClick={() => startNewChat()}
                            className="w-full flex items-center justify-center py-2.5 px-4 shadow-md text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            New Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <h3 className="px-2 pb-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">History</h3>
                        <nav className="space-y-1">
                            {chatHistory.map(thread => (
                                <button
                                    key={thread.id}
                                    onClick={() => handleSelectThread(thread)}
                                    className={`w-full text-left flex flex-col p-2 rounded-lg transition-all ${
                                        activeThreadId === thread.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <p className="text-sm font-medium text-gray-900 truncate">{thread.title}</p>
                                    <p className="text-xs text-gray-600">{new Date(thread.timestamp).toLocaleDateString()}</p>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            AI Content Strategist
                        </h2>
                        <p className="text-gray-600 mt-1 text-sm">Brainstorm and create content with AI assistance</p>
                    </div>
                    <button
                        onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={isHistoryVisible ? "Hide History" : "Show History"}
                    >
                        {isHistoryVisible ? <PanelLeftClose className="w-6 h-6 text-gray-600" /> : <History className="w-6 h-6 text-gray-600" />}
                    </button>
                </div>
                <div className="flex-grow bg-white rounded-xl shadow-md flex flex-col p-4 min-h-0 border border-gray-200">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2">
                        {messages.map((msg, index) => <MessageBubble key={index} msg={msg} />)}
                        {isLoading && (
                            <div className="flex items-start gap-3 my-4">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-100 border border-gray-200 flex items-center shadow-sm">
                                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        {error && <p className="text-red-600 text-sm text-center mb-3 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={activeThreadId !== 'new' ? "Viewing history (read-only)" : "Let's brainstorm some content..."}
                                className="flex-1 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 p-3 px-5"
                                disabled={isLoading || activeThreadId !== 'new'}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim() || activeThreadId !== 'new'}
                                className="p-3 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
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
