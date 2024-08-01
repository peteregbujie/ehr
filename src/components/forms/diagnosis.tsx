import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServerAction } from "zsa-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDiagnosisAction } from "@/actions/diagnosis";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";

import { Textarea } from "../ui/textarea";
import { NewDiagnosisSchema } from "@/lib/validations/diagnosis";




export function DiagnosisForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createDiagnosisAction, {
    onSuccess() {
        toast.success("Diagnosis has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Diagnosis was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof NewDiagnosisSchema>>({
    resolver: zodResolver(NewDiagnosisSchema),
          defaultValues: {
      diagnosis_name:"",diagnosis_code:"", severity: "mild",date: "", note: ""
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof NewDiagnosisSchema>> = (
    values
  ) => {
    execute({
              
        diagnosis_name: values.diagnosis_name, diagnosis_code: values.diagnosis_code, severity: values.severity, date: values.date, note: values.note, 
    });
  };


       form.reset({
    diagnosis_name: "", diagnosis_code:"", date: "", severity: "mild",  note: "",
    },
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      

<FormField
control={form.control}
name="diagnosis_name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Brand Name</FormLabel>
    <FormControl>
      <Input placeholder="name of diagnosis" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="diagnosis_code"
render={({ field }) => (
  <FormItem>
    <FormLabel>Code</FormLabel>
    <FormControl>
      <Input placeholder="diagnosis code" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>



<FormField
control={form.control}
name="severity"
render={({ field }) => (
  <FormItem>
    <FormLabel>Status</FormLabel>
    <FormControl>
    <Select>
              <SelectTrigger asChild>                     
                <SelectValue placeholder='Status' {...field}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild </SelectItem>
                <SelectItem value="moderate"> Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem> 
                                  
              </SelectContent>
            </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="note"
render={({ field }) => (
  <FormItem>
    <FormLabel>Note</FormLabel>
    <FormControl>
    <Textarea rows={7} {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="date"
render={({ field }) => (
  <FormItem>
    <FormLabel>Start Date</FormLabel>
    <FormControl>
      <Input type="date" placeholder="date" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>





<Button disabled={isPending} type="submit" className="w-full">
        {isPending ? "Saving..." : "Save"}
      </Button>
      {error && (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error creating diagnosis</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Create Diagnosis
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
