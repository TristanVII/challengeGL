import { Button } from "@/components/ui/button";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

interface FloatingQuestionIconProps {
  onClick: () => void;
  hidden: boolean;
}

export function FloatingQuestionIcon({
  onClick,
  hidden,
}: FloatingQuestionIconProps) {
  if (hidden) {
    return null;
  }
  return (
    <Button
      className="fixed top-4 right-4 rounded-full p-2 bg-primary text-primary-foreground shadow-lg"
      onClick={onClick}
    >
      <QuestionMarkCircledIcon className="h-6 w-6" />
    </Button>
  );
}
