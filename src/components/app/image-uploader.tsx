
"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File | undefined) => {
    if (file) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: `Please upload a valid image file (${ALLOWED_MIME_TYPES.join(', ')}).`,
        });
        return;
      }
      onFileSelect(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div
        className={cn(
          'w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="presentation"
        aria-label="Image upload zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_MIME_TYPES.join(',')}
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center gap-4">
          <UploadCloud className={cn('w-12 h-12', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          <h3 className="text-xl font-semibold">Drag & Drop MRI Scan</h3>
          <p className="text-muted-foreground">or</p>
           <Button onClick={handleBrowseClick} variant="outline">Browse Files</Button>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPG, PNG, WEBP
          </p>
        </div>
      </div>
    </div>
  );
}
