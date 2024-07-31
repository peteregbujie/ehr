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
import { createLabAction } from "@/actions/lab";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { NewLabSchema } from "@/lib/validations/lab";




export function LabForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createLabAction, {
    onSuccess() {
        toast.success("Lab has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Lab was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof NewLabSchema>>({
    resolver: zodResolver(NewLabSchema),
    defaultValues: {
      phone_number: "", lab_name: "", date_ordered: "", lab_code: "", result: "", status: "completed", result_date: "", unit: "", note: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof NewLabSchema>> = (
    values
  ) => {
    execute({
        phone_number: values.phone_number, lab_name: values.lab_name, date_ordered: values.date_ordered, lab_code: values.lab_code, result: values.result, status: values.status, result_date: values.result_date, unit:values.unit , note :values.note
        
    });
  };


  form.reset({
    phone_number: "", lab_name: "", date_ordered: "", lab_code: "", result: "", status: "completed", result_date: "", unit: "", note: "",
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
name="lab_name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Lab Name</FormLabel>
    <FormControl>
      <Input placeholder="Lab Name" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="lab_code"
render={({ field }) => (
  <FormItem>
    <FormLabel>lab_code</FormLabel>
    <FormControl>
      <Input placeholder="Lab Code" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="result"
render={({ field }) => (
  <FormItem>
    <FormLabel>Result</FormLabel>
    <FormControl>
      <Input placeholder="Result" {...field} />
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
                <SelectItem value="pending">Pending </SelectItem>
                <SelectItem value="completed"> Completed</SelectItem>
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
name="date_ordered"
render={({ field }) => (
  <FormItem>
    <FormLabel>Date Ordered</FormLabel>
    <FormControl>
      <Input type="date" placeholder="Date Ordered" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>
<FormField
control={form.control}
name="result_date"
render={({ field }) => (
  <FormItem>
    <FormLabel>Result Date</FormLabel>
    <FormControl>
      <Input type="date" placeholder="Result Date" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>


<FormField
control={form.control}
name="unit"
render={({ field }) => (
  <FormItem>
    <FormLabel>Unit</FormLabel>
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
      <AlertTitle>Error creating order</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Order Lab
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
