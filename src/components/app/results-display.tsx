"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsDisplayProps {
  imagePreview: string;
  probability: number;
}

const CircleGauge = ({ probability }: { probability: number }) => {
  const percentage = Math.round(probability);
  const radius = 55;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-primary'; // Blue for low probability
  if (percentage >= 50) colorClass = 'text-accent'; // Orange for medium
  if (percentage >= 75) colorClass = 'text-destructive'; // Red for high

  let statusText = 'Low Probability';
  if (percentage < 1) {
    statusText = 'No Tumor Detected';
  } else if (percentage >= 75) {
    statusText = 'High Probability';
  } else if (percentage >= 50) {
    statusText = 'Moderate Probability';
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="hsl(var(--secondary))"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`transition-all duration-1000 ease-in-out ${colorClass}`}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{`${percentage}%`}</span>
        <span className="text-sm font-medium text-muted-foreground">Probability</span>
      </div>
      <p className={`font-semibold text-lg ${colorClass}`}>{statusText}</p>
    </div>
  );
};

export function ResultsDisplay({ imagePreview, probability }: ResultsDisplayProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Uploaded MRI Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square relative w-full rounded-md overflow-hidden border">
            <Image
              src={imagePreview}
              alt="Uploaded MRI scan"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <CircleGauge probability={probability} />
        </CardContent>
      </Card>
    </div>
  );
}
