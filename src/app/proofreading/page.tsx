"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";

export default function ProofreadingPage() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<{
    extractedText: string;
    accuracyAnalysis: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      
      // Automatically start extraction when image is loaded
      await handleExtractText(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleExtractText = async (imgUrl: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/proofreading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: imgUrl 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract text');
      }

      const data = await response.json();
      setResult(data);
      setText(data.extractedText);
    } catch (error) {
      console.error('Text extraction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6 font-['OpenDyslexic']">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Notes Proofreading</h1>
        
        <Card className="">
          <CardHeader className="">
            <CardTitle className="">Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              disabled={isLoading}
              className="cursor-pointer"
            >
              <label htmlFor="imageInput" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isLoading ? 'Processing...' : 'Choose Image'}
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </Button>

              
              {imageUrl && (
                <div className="w-full">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded image" 
                    className="max-h-[300px] w-auto mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting text from image...
              </div>
            )}

            <Textarea
              placeholder="Extracted text will appear here..."
              className="min-h-[200px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              readOnly={isLoading}
            />
          </CardContent>
        </Card>

        {result?.accuracyAnalysis && (
          <Card className="">
            <CardHeader className="">
              <CardTitle className="">Accuracy Analysis</CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                {result.accuracyAnalysis}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
