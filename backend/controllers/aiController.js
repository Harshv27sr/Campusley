const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

exports.summarizeNotes = async (req, res) => {
  try {
    const { topic, type } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.log('🤖 Gemini API Key missing. Using mock summarizer.');
      return res.status(200).json({ 
        summary: `[MOCK SUMMARY - Add GEMINI_API_KEY for real AI]\nThis is a generated summary of your notes. The main concepts discussed involve foundational principles and their practical applications.`,
        provider: 'Mock API'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Summarize the following notes in a clear, concise manner using the "${type}" format:\n\n${topic.substring(0, 5000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ text: response.text(), provider: 'Gemini 2.5 Flash' });
  } catch (error) {
    console.error('Summarize Error:', error);
    res.status(500).json({ message: 'AI Summarization failed.' });
  }
};

exports.chatWithTutor = async (req, res) => {
  try {
    const { message, persona } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.log('🤖 OpenAI API Key missing. Using mock tutor.');
      return res.status(200).json({ 
        text: `[MOCK TUTOR - Add OPENAI_API_KEY for real AI]\nI understand you asked: "${message}". Can you explain what you think the first step to solve this would be?`,
        provider: 'Mock API'
      });
    }

    const openai = new OpenAI({ apiKey });
    
    // Inject system prompt
    const systemMessage = { role: 'system', content: `You are the Campusley Academic Tutor. Your persona is: ${persona}. Do not give direct answers immediately. Instead, guide the student to the answer.` };
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, { role: 'user', content: message }],
      max_tokens: 300
    });

    res.status(200).json({ text: completion.choices[0].message.content, provider: 'GPT-4o-mini' });
  } catch (error) {
    console.error('Chat Tutor Error:', error);
    res.status(500).json({ message: 'Tutor chat failed.' });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { topic, questionsCount } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.log('🤖 Anthropic API Key missing. Using mock quiz.');
      return res.status(200).json({ 
        quiz: [
          {
            question: `[MOCK QUIZ - Add ANTHROPIC_API_KEY] What is the primary concept of ${topic}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            answer: 'Option A',
            explanation: `Mock explanation for ${topic} question.`
          }
        ],
        provider: 'Mock API'
      });
    }

    const anthropic = new Anthropic({ apiKey });
    const prompt = `Generate a ${questionsCount}-question multiple choice quiz on the topic "${topic}". Return ONLY a raw JSON array of objects. Each object must have exactly these keys: "question" (string), "options" (array of 4 strings), "answer" (string, must exactly match one option), and "explanation" (string).`;

    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    let jsonString = msg.content[0].text;
    // Attempt to clean if Claude adds markdown formatting
    if (jsonString.includes('```json')) {
      jsonString = jsonString.split('```json')[1].split('```')[0].trim();
    }
    
    const quizData = JSON.parse(jsonString);
    res.status(200).json({ quiz: quizData, provider: 'Claude 3.5 Sonnet' });
  } catch (error) {
    console.error('Quiz Gen Error:', error);
    res.status(500).json({ message: 'Quiz generation failed.' });
  }
};
