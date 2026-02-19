import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageTitle = ({ title, className, children }: PageTitleProps) => {
  return (
    <div className={cn("container mx-auto px-4 pt-12 pb-8", className)}>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-primary mb-6 animate-fade-in">
        {title}
      </h1>
      {children && (
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
      )}
      <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-8 animate-fade-in" />
    </div>
  );
};
