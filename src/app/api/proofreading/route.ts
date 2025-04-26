import { vision } from '@google-cloud/vision';
import { Groq } from "groq-sdk";

// Initialize the client using the environment variable
const client = new vision.ImageAnnotatorClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    const base64Data = imageUrl.split(',')[1];

    // 🧠 Step 1: Google Vision OCR
    const [visionResponse] = await client.textDetection({
      image: { content: Buffer.from(base64Data, 'base64') },
    });

    const textAnnotations = visionResponse.textAnnotations;
    const extractedText = textAnnotations?.[0]?.description?.trim() || '';

    if (!extractedText) {
      throw new Error('No text extracted from the image');
    }

    console.log('Extracted text:', extractedText);

    // 🧠 Step 2: Groq grammar correction
    const grammarFix = await groq.chat.completions.create({
      model: "meta-llama/llama-4-maverick-32k",
      messages: [
        {
          role: "user",
          content: "Please proofread and correct the following text for grammar, spelling, and clarity:\n\n${extractedText}"
        }
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    return Response.json({
      extractedText,
      accuracyAnalysis: grammarFix?.choices?.[0]?.message?.content?.trim()
    });

  } catch (error) {
    const err = error as Error;
    console.error('Proofreading API error:', err.message);
    return Response.json({ error: `Failed to extract text: ${err.message}` }, { status: 500 });
}

}
