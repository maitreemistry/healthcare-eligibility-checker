// File: app/api/ask-gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { profile, followup } = await req.json();

  const basePrompt = `You are a government healthcare scheme assistant. Given the following user profile, suggest eligible schemes (central and state-specific in India), and explain why.
                     Also, just give answer, no informal talk. Make sure you give all answer in plain text, no bold, no italics, no formats.
User Profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Income: ${profile.income}
- Location Type: ${profile.location_type}
- State: ${profile.state}
- Caste: ${profile.caste}
- Disability: ${profile.disability_status}
- Existing Conditions: ${profile.existing_conditions}

`;

  const chatPrompt = followup
    ? `${basePrompt}\nFollow-up question: ${followup}. Just answer the follow up.`
    : basePrompt;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(chatPrompt);
  const reply = result.response.text();

  return NextResponse.json({ reply });
}