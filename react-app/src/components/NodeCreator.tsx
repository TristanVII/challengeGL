import { Button } from "@/components/ui/button";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

interface FloatingQuestionIconProps {
  onClick: () => void;
  hidden: boolean;
  title: string;
}

export function NodeCreator({
  onClick,
  hidden,
  title
}: FloatingQuestionIconProps) {
  if (hidden) {
    return null;
  }
  return (
    <Button
      className="rounded-full p-2 bg-primary text-primary-foreground shadow-lg"
      onClick={onClick}
    >
      <h1>{title}</h1>
      <QuestionMarkCircledIcon className="h-6 w-6" />
    </Button>
  );
}
