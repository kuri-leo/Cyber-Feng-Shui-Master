"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getAuspiciousness } from "@/app/actions";
import { useLocale } from "@/contexts/locale-context";
import type { AssessAuspiciousnessOutput } from "@/ai/schemas";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  event: z.string().min(3, { message: "Event must be at least 3 characters." }),
  date: z.date({ required_error: "A date is required." }),
});

type AuspiciousnessFormProps = {
  setResult: (result: AssessAuspiciousnessOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isFormSubmitting: boolean;
}

export function AuspiciousnessForm({ setResult, setIsLoading, setError, isFormSubmitting }: AuspiciousnessFormProps) {
  const { t } = useLocale();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      event: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // The key fix: Read settings directly from localStorage at the time of submission
    // to ensure the latest values are used, preventing a race condition with state updates.
    const storedSettingsJSON = typeof window !== 'undefined' ? localStorage.getItem('CyberFengShuiMasterSettings') : null;
    const settings = storedSettingsJSON ? JSON.parse(storedSettingsJSON) : {};
    
    if (!settings.apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your API key in the settings dialog before proceeding.",
        variant: "destructive",
      });
      setError("API key is not set. Please add it in the settings dialog.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await getAuspiciousness(data, settings);
    
    if (response.error) {
      setError(response.error);
    }
    if (response.result) {
      setResult(response.result as AssessAuspiciousnessOutput);
    }
    
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="event"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t('eventPlaceholder')} {...field} className="py-6 text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal py-6 text-base",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t('selectDate')}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full py-6 text-lg" disabled={isFormSubmitting}>
          {isFormSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('checkAuspiciousness')}
        </Button>
      </form>
    </Form>
  );
}
