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
import { createProcedureAction } from "@/actions/procedure";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { NewProcedureSchema } from "@/lib/validations/procedure";




export function ProcedureForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createProcedureAction, {
    onSuccess() {
        toast.success("Procedure has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Procedure was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof NewProcedureSchema>>({
    resolver: zodResolver(NewProcedureSchema),
    defaultValues: {
      phone_number: "", name: "", description: "", duration: "", date: "", time: "", note: "", status: "completed",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof NewProcedureSchema>> = (
    values
  ) => {
    execute({
        phone_number: values.phone_number, name: values.name, description: values.description, duration: values.duration, date: values.date, time: values.time, note: values.note, status: values.status
        
    });
  };


  form.reset({
    phone_number: "", name: "", description: "", duration: "", date: "", time: "", note: "", status: "completed",
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
name="name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Name</FormLabel>
    <FormControl>
      <Input placeholder="Name" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="description"
render={({ field }) => (
  <FormItem>
    <FormLabel>Description</FormLabel>
    <FormControl>
      <Textarea placeholder="Description" {...field} />
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
      <Select {...field}>
        <SelectTrigger>
          <Input placeholder="Status"  />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="incomplete">Incomplete</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
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
      <Input placeholder="Date" type="date" {...field} />
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
    <FormLabel>Time</FormLabel>
    <FormControl>
      <Input placeholder="Time" type="time" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="duration"
render={({ field }) => (
  <FormItem>
    <FormLabel>Duration</FormLabel>
    <FormControl>
      <Input placeholder="Duration" type="number" {...field} />
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
      <Textarea placeholder="Note" {...field} />
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
      <AlertTitle>Error creating procedure</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send />Create Procedure
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
