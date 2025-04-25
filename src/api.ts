import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface ContrastResult {
  status: 'success' | 'complete' | 'error';
  current_contrast?: number[][];
  next_contrast?: number[][];
  results?: {
    best_combination: string;
    contrast_ratio: number;
    comfort_rating: number;
    recommendations: string[];
  };
}

export const api = {
  textToSpeech: async (text: string, speed: number = 150) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/text-to-speech`, {
        text,
        speed
      });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Text-to-speech failed: ${errorMessage}`);
    }
  },

  checkAccuracy: async (userInput: string, expectedText: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/check-accuracy`, {
        user_input: userInput,
        expected_text: expectedText
      });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Accuracy check failed: ${errorMessage}`);
    }
  },

  processImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/process-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Image processing failed: ${errorMessage}`);
    }
  },

  contrastTest: {
    start: async (): Promise<ContrastResult> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/contrast-test/start`);
        return response.data as ContrastResult;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Contrast test start failed: ${errorMessage}`);
      }
    },

    submitFeedback: async (rating: number): Promise<ContrastResult> => {
      try {
        const response = await axios.post(`${API_BASE_URL}/contrast-test/feedback`, {
          rating
        });
        return response.data as ContrastResult;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Contrast test feedback failed: ${errorMessage}`);
      }
    },
  }
};