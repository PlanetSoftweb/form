import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateFormWithAI = async (prompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a form generation assistant. Create a form structure based on the user's description. Return only valid JSON."
        },
        {
          role: "user",
          content: `Create a form based on this description: ${prompt}. Return a JSON object with title, description, and an array of form elements. Each element should have: type (text, email, number, textarea, select), label, required (boolean), and for select types, an options array.`
        }
      ],
      temperature: 0.7,
    });

    const formStructure = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure each element has an id
    if (formStructure.elements) {
      formStructure.elements = formStructure.elements.map((element: any) => ({
        ...element,
        id: crypto.randomUUID()
      }));
    }

    // Add default style
    formStructure.style = {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#3b82f6',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    };

    return formStructure;
  } catch (error) {
    console.error('Error generating form with AI:', error);
    throw new Error('Failed to generate form with AI');
  }
};