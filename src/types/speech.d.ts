declare interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onstart: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

declare interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

declare interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

declare interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}