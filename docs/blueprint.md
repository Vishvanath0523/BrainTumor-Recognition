# **App Name**: BrainScan AI

## Core Features:

- Image Upload: Allow users to upload MRI images via a simple drag-and-drop interface.
- Tumor Detection: Employ a pre-trained CNN model (uploaded along with the app, no database) to analyze uploaded MRI images and detect the presence of brain tumors.
- Probability Output: Provide a probability score indicating the likelihood of a tumor being present.
- Detailed Result Display: Present the analysis results (tumor presence, probability score) in a clear, user-friendly format.
- Disclaimer Tool: Display a clear disclaimer stating that the analysis is for informational purposes only and not a substitute for professional medical advice. The tool will adapt its message based on the tumor-detection score.
- Basic Image Preprocessing: Resize and normalize uploaded images to match the input requirements of the tumor detection model. Do this locally using browser-based tools.

## Style Guidelines:

- Primary color: A calming, trustworthy blue (#4A8FE7), reflecting reliability and technological precision.
- Background color: A soft, desaturated blue (#E8F0FE), creating a clean and professional feel.
- Accent color: A vibrant, contrasting orange (#FF9933) to highlight important information and action items.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look, suitable for both headlines and body text.
- Use clear and simple icons, mainly monochrome, with the orange accent color used sparingly for emphasis.
- A clean, modern layout with plenty of whitespace to ensure clarity and focus on the image analysis results.
- Subtle animations, such as a progress bar during image processing, to enhance the user experience without being distracting.