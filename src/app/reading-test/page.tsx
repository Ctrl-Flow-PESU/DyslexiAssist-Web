"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReadingTest() {
  const [textToRead, setTextToRead] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [capturedSpeech, setCapturedSpeech] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [level, setLevel] = useState("easy");
  const [recognition, setRecognition] = useState<any>(null);

  // Fetch text based on the selected level
  const fetchText = async (selectedLevel: string) => {
    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level: selectedLevel, type: "reading" }),
      });
      const data = await response.json();
      if (response.ok) {
        setTextToRead(data.text);
      } else {
        throw new Error(data.error || "Failed to fetch reading text.");
      }
    } catch (error) {
      console.error("Error fetching reading text:", error);
      setTextToRead("Failed to load text. Please try again later.");
    }
  };

  useEffect(() => {
    fetchText(level);
  }, [level]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          setCapturedSpeech((prev) => `${prev} ${transcript}`.trim());
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          stopListening();
          setFeedback("Speech recognition error. Please try again.");
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setCapturedSpeech("");
      setFeedback(null);
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      if (capturedSpeech.trim()) {
        analyzeSpeech(capturedSpeech);
      }
    }
  };

  const analyzeSpeech = async (speech: string) => {
    try {
      if (!speech?.trim() || !textToRead?.trim()) {
        setFeedback("Error: Missing speech or text to read");
        return;
      }

      // Log data being sent to API
      console.log("Sending data:", {
        userSpeech: speech.trim(),
        expectedText: textToRead.trim()
      });

      const response = await fetch("/api/check-accuracy-reading-test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          userSpeech: speech.trim(),
          expectedText: textToRead.trim()
        })
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze speech");
      }

      const feedbackMessage = `
${data.message}

Accuracy: ${data.similarity.toFixed(1)}%

${data.errors.length > 0 ? 'Areas to improve:\n' + data.errors.join('\n') : 'No specific errors found.'}
      `.trim();

      setFeedback(feedbackMessage);
    } catch (error) {
      console.error("Analysis error:", error);
      setFeedback("Failed to analyze speech. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 font-['OpenDyslexic']">
      <div className="max-w-6xl mx-auto p-8">
        <header className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 hover:bg-muted/50" size="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Reading Test</h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Select a level and read the text below aloud. Click "Done Reading" when finished.
            </p>
          </div>
        </header>

        <main className="space-y-8">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Text to Read</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-medium">Select Level:</label>
                <Select value={level} onValueChange={(value: string) => setLevel(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[180px]" position="popper">
                    <SelectItem value="easy" className="cursor-pointer">
                      Easy
                    </SelectItem>
                    <SelectItem value="moderate" className="cursor-pointer">
                      Moderate
                    </SelectItem>
                    <SelectItem value="hard" className="cursor-pointer">
                      Hard
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[200px] rounded-md border p-6">
                <div className="text-xl leading-relaxed">{textToRead || "Loading..."}</div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              onClick={startListening}
              className="w-full"
              disabled={isListening || !textToRead}
              variant="default"
              size="lg"
            >
              {isListening ? "Listening..." : "Start Reading"}
            </Button>
            <Button
              onClick={stopListening}
              className="w-full"
              disabled={!isListening}
              variant="outline"
              size="lg"
            >
              Done Reading
            </Button>

            {capturedSpeech && (
              <div className="p-4 bg-muted rounded-lg">
                <h2 className="text-lg font-semibold">Your Speech:</h2>
                <p className="text-muted-foreground">{capturedSpeech}</p>
              </div>
            )}

            {feedback && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h2 className="text-lg font-semibold">Feedback:</h2>
                <pre className="text-muted-foreground whitespace-pre-line font-sans">
                  {feedback}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}