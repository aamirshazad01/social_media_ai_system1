
import { GoogleGenAI, Type, Modality } from "@google/genai";
// Fix: Add PostContent, Tone, and ContentType to imports for the new function.
import { Platform, Tone, ContentType, PostContent } from '../types';
import { PLATFORMS } from '../constants';

const getPlatformDetails = (platforms: Platform[]) => {
    return platforms.map(p => {
        const platformInfo = PLATFORMS.find(plat => plat.id === p);
        return `- ${platformInfo?.name}: Be mindful of its audience and character limit of ${platformInfo?.characterLimit}.`;
    }).join('\n');
};

// Fix: Implement the missing generateSocialMediaContent function.
export const generateSocialMediaContent = async (
    topic: string,
    platforms: Platform[],
    contentType: ContentType,
    tone: Tone
): Promise<PostContent> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const platformDetails = getPlatformDetails(platforms);

    const prompt = `
        You are an expert social media strategist. Your task is to generate content for a social media post based on the provided topic.
        
        **Topic:** ${topic}
        **Content Type:** ${contentType}
        **Tone:** ${tone}
        
        **Target Platforms:**
        ${platformDetails}
        
        Please generate the following:
        1. Content tailored for each selected platform.
        2. A creative suggestion for a compelling image to accompany the post.
        3. A creative suggestion for a short, engaging video (e.g., Reel, Short, TikTok) related to the post.
        
        Return the response as a single JSON object. Do not include the original topic. Do not include any markdown formatting or explanatory text outside of the JSON object.
        The JSON object must have the following keys: "imageSuggestion", "videoSuggestion", and a key for each platform: ${platforms.join(', ')}.
    `;

    const platformProperties = platforms.reduce((acc, platform) => {
        acc[platform] = { type: Type.STRING, description: `Content for ${platform}` };
        return acc;
    }, {} as Record<string, { type: Type; description: string }>);

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            imageSuggestion: { type: Type.STRING, description: 'A creative suggestion for a compelling image.' },
            videoSuggestion: { type: Type.STRING, description: 'A creative suggestion for an engaging video.' },
            ...platformProperties
        },
        required: ['imageSuggestion', 'videoSuggestion', ...platforms]
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating social media content:", error);
        throw new Error("Failed to generate content. Please try again.");
    }
};

export const improvePrompt = async (prompt: string, type: 'image' | 'video'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const improvePromptText = `
        You are a creative prompt engineer for an advanced generative AI.
        Your task is to take a user's idea and expand it into a rich, detailed, and evocative prompt that will produce a stunning visual.
        For an ${type}, focus on cinematic quality, lighting, composition, and mood.
        Do NOT add any explanatory text, markdown, or preamble. Return ONLY the improved prompt text.

        Original idea: "${prompt}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: improvePromptText,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error improving prompt:", error);
        throw new Error("Failed to improve prompt.");
    }
};

export const generateImageForPost = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in response.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image.");
    }
};


export const generateVideoForPost = async (prompt: string) => {
     try {
        const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let operation = await aiWithKey.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
        
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
            throw new Error('API_KEY_INVALID');
        }
        throw error;
    }
};

export const checkVideoOperationStatus = async (operation: any) => {
    try {
        const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const updatedOperation = await aiWithKey.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error checking video status:", error);
        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
            throw new Error('API_KEY_INVALID');
        }
        throw error;
    }
};

export const fetchVideo = async (uri: string): Promise<string> => {
    try {
        const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error fetching video data:", error);
        throw error;
    }
};
