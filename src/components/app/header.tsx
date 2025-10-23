import { BrainCircuit } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="flex items-center justify-center gap-3 mb-2">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          BrainScan AI
        </h1>
      </div>
      <p className="max-w-2xl mx-auto text-muted-foreground sm:text-lg">
        Upload an MRI scan to get an AI-powered analysis for potential brain tumors.
      </p>
    </header>
  );
}
