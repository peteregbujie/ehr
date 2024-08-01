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
import { createEncounterAction } from "@/actions/encounter";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";
import { newEncounterSchema } from "@/lib/validations/encounter";
import { Textarea } from "../ui/textarea";





export function EncounterForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createEncounterAction, {
    onSuccess() {
        toast.success("Encounter has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Encounter was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof newEncounterSchema>>({
    resolver: zodResolver(newEncounterSchema),
          defaultValues: {
      date: "", time: "", encounter_type: "inpatient", location: "", assessment_and_plan: "", chief_complaint: "", notes: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof newEncounterSchema>> = (
    values
  ) => {
    execute({
              
        date: values.date,
        time: values.time,
        encounter_type: values.encounter_type,
        location: values.location,
        assessment_and_plan: values.assessment_and_plan,
        chief_complaint: values.chief_complaint,
        notes: values.notes,       
    });
  };


       form.reset({
    
    date: "", 
    time: "", 
    encounter_type: "inpatient", 
    location: "", 
    assessment_and_plan: "", 
    chief_complaint: "", 
    notes: "",
})

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      

<FormField
control={form.control}
name="assessment_and_plan"
render={({ field }) => (
  <FormItem>
    <FormLabel>Assessment and Plan</FormLabel>
    <FormControl>
      <Input placeholder="Assessment and Plan" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="chief_complaint"
render={({ field }) => (
  <FormItem>
    <FormLabel>Chief Complaint</FormLabel>
    <FormControl>
      <Input placeholder="chief complaint" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="encounter_type"
render={({ field }) => (
  <FormItem>
    <FormLabel>Encounter Type</FormLabel>
    <FormControl>
    <Select>
              <SelectTrigger asChild>                     
                <SelectValue placeholder='Encounter Type' {...field}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inpatient">Inpatient </SelectItem>
                <SelectItem value="outpatient"> Outpatient</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>                     
              </SelectContent>
            </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>



<FormField
control={form.control}
name="notes"
render={({ field }) => (
  <FormItem>
    <FormLabel>Notes</FormLabel>
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
    <FormLabel>Date</FormLabel>
    <FormControl>
      <Input type="date" placeholder="date" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="time"
render={({ field }) => (
  <FormItem>
    <FormLabel>Scheduled Time</FormLabel>
    <FormControl>
      <Input type="time" placeholder="Time" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="location"
render={({ field }) => (
  <FormItem>
    <FormLabel>Location</FormLabel>
    <FormControl>
      <Input placeholder="Location" {...field} />
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
      <AlertTitle>Error creating encounter</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Create Encounter
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
