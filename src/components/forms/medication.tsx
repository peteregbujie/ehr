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
import { createMedicationAction } from "@/actions/medication";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";

import { Textarea } from "../ui/textarea";
import { extendedMedicationSchema } from "@/lib/validations/medication";




export function MedicationForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createMedicationAction, {
    onSuccess() {
        toast.success("Medication has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Medication was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof extendedMedicationSchema>>({
    resolver: zodResolver(extendedMedicationSchema),
    defaultValues: {
      phone_number: "",medication_name: "", code: "", dosage: "", frequency: "", route: "oral", status: "completed", start_date: "", end_date: "", note: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof extendedMedicationSchema>> = (
    values
  ) => {
    execute({
        phone_number: values.phone_number, 
        medication_name: values.medication_name, code: values.code, dosage: values.dosage, frequency: values.frequency, route: values.route, status: values.status, note: values.note, start_date: values.start_date, end_date: values.end_date
    });
  };


  form.reset({
    phone_number: "",medication_name: "", code: "", dosage: "", frequency: "", route: "oral", status: "completed", start_date: "", end_date: "", note: "",
    },
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


<FormField
control={form.control}
name="phone_number"
render={({ field }) => (
  <FormItem>
    <FormLabel>Phone Number</FormLabel>
    <FormControl>
      <Input placeholder="Phone Number" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="medication_name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Brand Name</FormLabel>
    <FormControl>
      <Input placeholder="Band name of medication" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="frequency"
render={({ field }) => (
  <FormItem>
    <FormLabel>Frequency</FormLabel>
    <FormControl>
      <Input placeholder="Frequency" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>



<FormField
control={form.control}
name="status"
render={({ field }) => (
  <FormItem>
    <FormLabel>Status</FormLabel>
    <FormControl>
    <Select>
              <SelectTrigger asChild>                     
                <SelectValue placeholder='Status' {...field}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active </SelectItem>
                <SelectItem value="inactive"> Inactive</SelectItem>
                <SelectItem value="complete">Complete</SelectItem> 
                <SelectItem value="suspended">Suspended</SelectItem>                    
              </SelectContent>
            </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="route"
render={({ field }) => (
  <FormItem>
    <FormLabel>Route</FormLabel>
    <FormControl>
    <Select>
              <SelectTrigger asChild>                     
                <SelectValue placeholder='Route' {...field}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Oral </SelectItem>
                <SelectItem value="inactive"> IV</SelectItem>                
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
name="start_date"
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
<FormField
control={form.control}
name="end_date"
render={({ field }) => (
  <FormItem>
    <FormLabel>End Date</FormLabel>
    <FormControl>
      <Input type="date" placeholder="end_date" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>


<FormField
control={form.control}
name="dosage"
render={({ field }) => (
  <FormItem>
    <FormLabel>Dosage</FormLabel>
    <FormControl>
      <Input  {...field} />
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
      <AlertTitle>Error creating post</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Create Patient
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
