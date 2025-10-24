
export enum View {
  Home,
  ImageEdit,
  ImageAnalyze,
  ImageGenerate,
  VideoGenerate,
}

// FIX: Resolved a TypeScript error from a conflicting global declaration.
// The compiler indicated `window.aistudio` should be of type `AIStudio`,
// so we define the interface here and use it in the Window interface below.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}
