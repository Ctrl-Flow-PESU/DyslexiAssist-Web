import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return Response.json({ error: 'No image data provided' }, { status: 400 });
    }

    const visionResponse = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all the text from this image."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageUrl}`
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    const extractedText = visionResponse.choices[0]?.message?.content?.trim() || '';

    if (!extractedText) {
      throw new Error('No text extracted from the image');
    }

    console.log('Extracted text:', extractedText);

    // 🧠 Step 2: Groq grammar correction
    const grammarFix = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Please proofread and correct the following text for grammar, spelling, and clarity:\n\n${extractedText}`
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
    console.error('Proofreading API error:', err);
    return Response.json(
      { error: `Failed to extract text: ${err.message}` }, 
      { status: 500 }
    );
  }
}
