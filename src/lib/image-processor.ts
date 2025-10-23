"use client";

const MAX_WIDTH = 512;
const MAX_HEIGHT = 512;

export const resizeAndEncodeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Get the data URL and check for size.
        // The AI model has input size limits.
        const dataUrl = canvas.toDataURL(file.type, 0.9); // Use JPEG compression
        if (dataUrl.length > 3 * 1024 * 1024) { // Heuristic check for ~3MB
            return reject(new Error('Image size is too large after processing. Please use a smaller file.'));
        }

        resolve(dataUrl);
      };
      img.onerror = (err) => reject(new Error("Failed to load image. The file might be corrupt or in an unsupported format."));

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};
