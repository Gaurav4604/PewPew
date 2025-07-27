// This file declares the 'electronAPI' that is exposed from the preload script.
export {};

declare global {
  interface Window {
    electronAPI: {
      onVoiceCommand: (callback: (command: string) => void) => void;
    };
  }
}
