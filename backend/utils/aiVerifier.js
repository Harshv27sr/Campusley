const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

async function verifyIDCardAI(imagePath, expectedName, expectedInstitution, liveSelfiePath) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('🤖 AI ID Check: Skipped (No GEMINI_API_KEY). Mocking success.');
      return { isGenuine: true, reason: 'Mock passed - Add Gemini key for real AI check' };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Read the image files as base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    let selfieBase64 = null;
    if (liveSelfiePath && fs.existsSync(liveSelfiePath)) {
      selfieBase64 = fs.readFileSync(liveSelfiePath, { encoding: 'base64' });
    }
    
    const prompt = `You are a strict security system verifying student identity cards and performing facial recognition. 
The user claims their name is "${expectedName}" and their institution is "${expectedInstitution}".
I have provided 2 images: First is their ID Card, Second is a Live Selfie (if provided).
Analyze:
1. Does the first image look like a genuine student ID card?
2. Does the name on the card match or closely resemble "${expectedName}"?
3. Does the institution name match or closely resemble "${expectedInstitution}"?
4. If a live selfie is provided (the second image), does the face in the live selfie match the face photo on the ID card? If they do not match, or if no selfie is provided, reject it.

Reply in strict JSON format:
{
  "isGenuine": true/false,
  "extractedName": "Name found on card",
  "extractedInstitution": "Institution found on card",
  "reason": "Short explanation of why it is genuine or fake/rejected"
}`;

    const contentsArray = [
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: getMimeType(imagePath)
        }
      }
    ];

    if (selfieBase64) {
      contentsArray.push({
        inlineData: {
          data: selfieBase64,
          mimeType: getMimeType(liveSelfiePath)
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentsArray,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText);
    
    return resultJson;
  } catch (error) {
    console.error('❌ AI Verification Error:', error);
    // Fallback to manual review if AI fails
    return { isGenuine: false, reason: 'AI analysis failed. Requires manual review.' };
  }
}

module.exports = { verifyIDCardAI };
