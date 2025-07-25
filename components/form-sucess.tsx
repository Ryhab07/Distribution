import { CheckCircle } from "lucide-react";

interface FormSucessProps {
  message?: string;
}

export const FormSucess = ({ message }: FormSucessProps) => {
  if (!message) return null;

  // Split the message into lines and join with <br /> for line breaks
  const formattedMessage = message.split('\n').join('<br />');

  return (
    <div className="bg-green-200 p-3 rounded-md text-sm text-green-600">
      <div className="flex items-start gap-x-2">
        <CheckCircle className="h-4 w-4" />
        <p className="flex-1" dangerouslySetInnerHTML={{ __html: formattedMessage }} />
      </div>
    </div>
  );
};
