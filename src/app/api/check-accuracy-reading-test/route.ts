import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: Request) {
  try {
    // Log raw request
    console.log("Received request:", request);

    const { userSpeech, expectedText } = await request.json();
    
    // Log received data
    console.log("Received data:", { userSpeech, expectedText });

    if (!userSpeech || !expectedText) {
      return NextResponse.json({
        message: "Missing required fields",
        similarity: 0,
        errors: ["Please provide both speech and text"]
      });
    }

    // Process the received data
    const normalize = (text: string) => text.toLowerCase().trim().split(/\s+/);
    const userWords = normalize(userSpeech);
    const expectedWords = normalize(expectedText);

    let correctWords = 0;
    const errors: string[] = [];

    const maxLength = Math.max(userWords.length, expectedWords.length);
    for (let i = 0; i < maxLength; i++) {
      if (!userWords[i] && expectedWords[i]) {
        errors.push(`Missing word: "${expectedWords[i]}"`);
      } else if (userWords[i] && !expectedWords[i]) {
        errors.push(`Extra word: "${userWords[i]}"`);
      } else if (userWords[i] !== expectedWords[i]) {
        errors.push(`Misread "${expectedWords[i]}" as "${userWords[i]}"`);
      } else {
        correctWords++;
      }
    }

    const similarity = (correctWords / expectedWords.length) * 100;

    // Generate feedback
    let message = "";
    if (similarity >= 90) message = "Excellent reading!";
    else if (similarity >= 75) message = "Good job!";
    else if (similarity >= 50) message = "Keep practicing!";
    else message = "Let's try again!";

    const response = {
      message,
      similarity,
      errors: errors.slice(0, 3)
    };

    // Log response being sent back
    console.log("Sending response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      message: "Error analyzing speech",
      similarity: 0,
      errors: ["An error occurred during analysis"]
    });
  }
}