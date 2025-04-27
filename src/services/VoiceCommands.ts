import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export class VoiceCommands {
  private recognition!: any;
  private isListening: boolean = false;
  private speechRate: number = 1.0;
  
  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    } else {
      console.error('Speech recognition not supported');
    }
    
    // Try to get speech rate from local storage
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.speechRate) {
          this.speechRate = settings.speechRate;
        }
      }
    } catch (e) {
      console.error('Error reading speech rate from settings:', e);
    }
    
    // Listen for changes in accessibility settings
    document.addEventListener('accessibilityChanged', (e: any) => {
      if (e.detail && typeof e.detail.speechRate === 'number') {
        this.speechRate = e.detail.speechRate;
      }
    });
  }

  private setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript;
      this.processCommand(command);
    };

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  private processCommand(command: string) {
    if (command.includes('menu') || command.includes('home')) {
      window.location.href = '/';
    } else if (command.includes('reading test')) {
      window.location.href = '/reading-test';
    } else if (command.includes('dictation')) {
      window.location.href = '/dictation';
    } else if (command.includes('contrast')) {
      window.location.href = '/contrast-test';
    } else if (command.includes('help')) {
      this.speakHelp();
    }
  }

  public startListening() {
    if (!this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }

  public stopListening() {
    if (this.isListening) {
      this.recognition.stop();
    }
  }

  private speakHelp() {
    const speech = new SpeechSynthesisUtterance(`
      Available commands:
      Say 'menu' or 'home' to return to the main menu
      Say 'reading test' to start a reading exercise
      Say 'dictation' to practice writing
      Say 'contrast test' to adjust colors
      Say 'help' to hear these commands again
    `);
    
    speech.rate = this.speechRate;
    window.speechSynthesis.speak(speech);
  }
}