
"use client";

import { useState, useTransition, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { analyzeMriImage } from "@/app/actions";
import { resizeAndEncodeImage } from "@/lib/image-processor";
import { AppHeader } from "@/components/app/header";
import { ImageUploader } from "@/components/app/image-uploader";
import { ResultsDisplay } from "@/components/app/results-display";
import { DisclaimerCard } from "@/components/app/disclaimer-card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download } from "lucide-react";
import { ReportDocument } from "@/components/app/report-document";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type AnalysisResult = {
  probability: number;
  disclaimer: string;
};

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    setResult(null);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    startTransition(async () => {
      try {
        const imageDataUri = await resizeAndEncodeImage(file);
        const response = await analyzeMriImage(imageDataUri);
        if (response.error) {
          throw new Error(response.error);
        }
        setResult({
          probability: response.probability!,
          disclaimer: response.disclaimer!,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
        handleReset();
      }
    });
  };

  const handleReset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setResult(null);
  };

  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) {
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not find the report content to download.',
      });
      return;
    }
  
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });
  
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty. Failed to capture report content.');
      }
  
      const orientation = canvas.width > canvas.height ? 'l' : 'p';
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [canvas.width, canvas.height],
        hotfixes: ['px_scaling'],
      });
  
      const imgData = canvas.toDataURL('image/png');
  
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`BrainScan-AI-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: error instanceof Error ? error.message : 'An error occurred while generating the PDF.',
      });
      console.error('PDF generation error:', error);
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
        }}
      >
        {result && imagePreview && (
          <ReportDocument 
            ref={reportRef} 
            imagePreview={imagePreview} 
            probability={result.probability}
            disclaimer={result.disclaimer}
          />
        )}
      </div>

      <AppHeader />
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
        <div className="w-full bg-card/80 dark:bg-card/50 border rounded-lg shadow-lg backdrop-blur-sm p-6 lg:p-8 transition-all duration-500">
          {!imagePreview ? (
            <ImageUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="flex flex-col items-center gap-6">
              {isPending && (
                <div className="w-full text-center space-y-3">
                  <p className="text-lg font-medium text-primary">Analyzing MRI Scan...</p>
                  <Progress value={undefined} className="w-full h-2 animate-pulse" />
                   <p className="text-sm text-muted-foreground">This may take a moment. Please wait.</p>
                </div>
              )}

              {result && (
                <>
                  <ResultsDisplay
                    imagePreview={imagePreview}
                    probability={result.probability}
                  />
                  <DisclaimerCard
                    message={result.disclaimer}
                    isWarning={result.probability >= 70}
                  />
                </>
              )}
               <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Button onClick={handleReset} variant="outline">
                  <ArrowLeft />
                  Analyze Another Image
                </Button>
                {result && (
                   <Button onClick={handleDownloadPdf}>
                    <Download />
                    Download Report
                   </Button>
                )}
               </div>

            </div>
          )}
        </div>
        <footer className="text-center mt-8 text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} BrainScan AI. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
