import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { auth } from '@/lib/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const user = await auth();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are NelsonBot AI, an expert pediatric care assistant based on Nelson\'s Textbook of Pediatrics. Provide accurate, professional medical information while maintaining ethical standards and acknowledging the importance of direct medical consultation.',
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}