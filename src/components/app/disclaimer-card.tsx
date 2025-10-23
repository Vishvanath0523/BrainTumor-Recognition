import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle } from "lucide-react";

interface DisclaimerCardProps {
  message: string;
  isWarning?: boolean;
}

export function DisclaimerCard({ message, isWarning = false }: DisclaimerCardProps) {
  return (
    <Alert
      variant={isWarning ? "destructive" : "default"}
      className="w-full max-w-3xl mt-4"
    >
      {isWarning ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Info className="h-4 w-4" />
      )}
      <AlertTitle className="font-semibold">Important Disclaimer</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
