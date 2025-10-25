import OpenAI from "openai";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

let apiKeyPromise: Promise<string | null> | null = null;

const getApiKeyFromFirebase = async (): Promise<string | null> => {
  try {
    const docRef = doc(db, 'admin', 'config');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().openrouterApiKey) {
      const key = docSnap.data().openrouterApiKey;
      if (key && key.trim()) {
        return key.trim();
      }
    }
  } catch (error: any) {
    console.error('Error fetching API key from Firebase:', error);
    
    // Provide helpful error messages
    if (error?.code === 'permission-denied') {
      console.error('Permission denied: Make sure Firestore rules allow authenticated users to read admin/config');
    }
  }
  
  // Fallback to environment variable
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  return envKey || null;
};

const getAI = async () => {
  // Use promise to prevent race conditions
  if (!apiKeyPromise) {
    apiKeyPromise = getApiKeyFromFirebase();
  }
  
  const apiKey = await apiKeyPromise;
  
  if (!apiKey) {
    return null;
  }
  
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "HTTP-Referer": window.location.origin,
      "X-Title": "FormBuilder App"
    }
  });
};

// Function to refresh API key cache (call after updating in admin panel)
export const refreshApiKeyCache = () => {
  apiKeyPromise = null;
};

const extractJSON = (text: string): string => {
  try {
    text = text.trim();
    
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      return jsonBlockMatch[1].trim();
    }
    
    const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting JSON:', error);
    return text;
  }
};

interface FormElement {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: any;
  style?: any;
}

interface GeneratedForm {
  title: string;
  description: string;
  elements: FormElement[];
  style: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    borderRadius: string;
    fontFamily: string;
  };
}

export const isGeminiConfigured = async (): Promise<boolean> => {
  const apiKey = await getApiKeyFromFirebase();
  return !!apiKey;
};

export const generateFormWithGemini = async (prompt: string): Promise<GeneratedForm> => {
  const ai = await getAI();
  
  if (!ai) {
    throw new Error('OpenRouter API key is not configured. Please contact your administrator to set up the API key.');
  }

  try {
    const systemPrompt = `Generate form JSON. Available types: text, textarea, email, phone, number, date, time, radio, checkbox, select, rating, file, heading, paragraph, divider.

Format: {"title":"","description":"","elements":[{"type":"","label":"","required":true/false,"placeholder":"","options":[]}]}

Return ONLY JSON, no markdown.`;

    // Single API request - no retries to prevent rate limiting
    const response = await ai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nForm: ${prompt}\n\nJSON only:`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    let rawJson = response.choices[0]?.message?.content;
    
    if (!rawJson || typeof rawJson !== 'string') {
      throw new Error("Invalid or empty response from AI");
    }

    rawJson = extractJSON(rawJson);

    let formStructure;
    try {
      formStructure = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', rawJson);
      throw new Error("AI returned invalid JSON. Please try again with a clearer description.");
    }
    
    if (!formStructure.elements || !Array.isArray(formStructure.elements)) {
      throw new Error("Invalid form structure returned");
    }

    formStructure.elements = formStructure.elements.map((element: any) => ({
      ...element,
      id: crypto.randomUUID()
    }));

    formStructure.style = {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#3b82f6',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    };

    return formStructure;
  } catch (error: any) {
    console.error('Error generating form with OpenRouter:', error);
    
    if (error.message?.includes('API key')) {
      throw new Error('OpenRouter API key is required. Please configure VITE_OPENROUTER_API_KEY in your environment.');
    }
    
    // Handle rate limit errors (429)
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('rate limit')) {
      throw new Error('Too Many Requests (429). Please wait 30-60 seconds before trying again.');
    }
    
    throw new Error(`Failed to generate form: ${error.message || 'Unknown error'}`);
  }
};

export const enhanceFormWithAI = async (
  currentElements: FormElement[],
  enhancementRequest: string
): Promise<FormElement[]> => {
  const ai = await getAI();
  
  if (!ai) {
    throw new Error('OpenRouter API key is not configured.');
  }

  try {
    const currentElementsDescription = currentElements.length > 0 
      ? currentElements.map(el => `${el.type}: ${el.label}`).join(', ')
      : 'None';

    const systemPrompt = `Current fields: ${currentElementsDescription}. Types: text, textarea, email, phone, number, date, time, radio, checkbox, select, rating, file. Return JSON array only: [{"type":"","label":"","required":true/false,"placeholder":"","options":[]}]`;

    const response = await ai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nAdd: ${enhancementRequest}\n\nJSON:`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    let rawJson = response.choices[0]?.message?.content;
    
    if (!rawJson || typeof rawJson !== 'string') {
      throw new Error("Invalid or empty response from AI");
    }

    rawJson = extractJSON(rawJson);

    let result;
    try {
      result = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error("AI returned invalid JSON format.");
    }
    
    const suggestions = Array.isArray(result) ? result : (result.fields || result.elements || []);
    
    if (!Array.isArray(suggestions)) {
      throw new Error("Invalid suggestions format");
    }

    return suggestions.map((element: any) => ({
      ...element,
      id: crypto.randomUUID()
    }));
  } catch (error: any) {
    console.error('Error enhancing form with OpenRouter:', error);
    throw new Error(`Failed to enhance form: ${error.message || 'Unknown error'}`);
  }
};

export const suggestStyleWithAI = async (
  currentStyle: any,
  styleRequest: string
): Promise<any> => {
  const ai = await getAI();
  
  if (!ai) {
    throw new Error('OpenRouter API key is not configured.');
  }

  try {
    const systemPrompt = `Current style: ${JSON.stringify(currentStyle)}. Style JSON format: {"backgroundColor":"#hex","textColor":"#hex","buttonColor":"#hex","borderRadius":"0.5rem","fontFamily":"Inter"}. Return JSON only with requested changes.`;

    const response = await ai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nStyle request: ${styleRequest}\n\nJSON:`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    let rawJson = response.choices[0]?.message?.content;
    
    if (!rawJson || typeof rawJson !== 'string') {
      throw new Error("Invalid response from AI");
    }

    rawJson = extractJSON(rawJson);

    return JSON.parse(rawJson);
  } catch (error: any) {
    console.error('Error getting style suggestions:', error);
    throw new Error(`Failed to suggest styles: ${error.message || 'Unknown error'}`);
  }
};
