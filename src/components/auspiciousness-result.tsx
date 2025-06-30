"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Zap, Terminal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/contexts/locale-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssessAuspiciousnessOutput } from "@/ai/schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";

type AuspiciousnessResultProps = {
  result: AssessAuspiciousnessOutput | null;
  isLoading: boolean;
  error: string | null;
};

function ScoreCircle({ score }: { score: number }) {
  const [offset, setOffset] = useState(0);
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    const scoreOffset = circumference - (score / 10) * circumference;
    // Set a timeout to trigger the animation after the component mounts
    const timer = setTimeout(() => setOffset(scoreOffset), 100);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-muted/50"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className="stroke-current text-primary"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1s ease-out' 
          }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-primary">{score}</span>
        <span className="text-sm text-muted-foreground mt-1">/10</span>
      </div>
    </div>
  );
}


export function AuspiciousnessResult({ result, isLoading, error }: AuspiciousnessResultProps) {
  const { t } = useLocale();
  const { toast } = useToast();

  const handleFeedback = () => {
    toast({
      title: "Thank you!",
      description: "Your feedback helps us improve.",
    });
  }

  if (isLoading) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline text-center">{t('fetchingResult')}</h2>
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex justify-center">
                        <Skeleton className="h-32 w-32 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-1/3 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (error) {
    return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('errorOccurred')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (!result) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-lg">
        <Zap className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium font-headline">{t('resultTitle')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('noResult')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-500">
        <h2 className="text-3xl font-bold font-headline text-center">{t('resultTitle')}</h2>
        <Card className="shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                        <ScoreCircle score={result.auspiciousnessScore} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold font-headline">{t('resultScore')}</h3>
                            <p className="text-muted-foreground">An auspiciousness score of {result.auspiciousnessScore} out of 10.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold font-headline">{t('resultReasoning')}</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{result.reasoning}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t text-center space-y-2">
                    <p className="text-sm text-muted-foreground">{t('feedbackPrompt')}</p>
                    <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={handleFeedback} aria-label="Like">
                            <ThumbsUp className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleFeedback} aria-label="Dislike">
                            <ThumbsDown className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
