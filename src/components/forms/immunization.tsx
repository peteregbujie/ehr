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
import { createImmunizationAction } from "@/actions/immunization";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";

import { Textarea } from "../ui/textarea";
import { NewImmunizationSchema } from "@/lib/immunization";





export function ImmunizationForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createImmunizationAction, {
    onSuccess() {
        toast.success("Immunization has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Immunization was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof NewImmunizationSchema>>({
    resolver: zodResolver(NewImmunizationSchema),
          defaultValues: {
      vaccine_name: "", site: "", vaccination_date: "", vaccination_time: "",vaccinator: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof NewImmunizationSchema>> = (
    values
  ) => {
    execute({
              vaccine_name: values.vaccine_name, site: values.site, vaccination_date: values.vaccination_date, vaccination_time: values.vaccination_time, vaccinator: values.vaccinator,
        
    });
  };


       form.reset({
   vaccine_name: "", site: "", vaccination_time: "", vaccination_date: "",vaccinator: "",
  },
    
)

  return    (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


      

<FormField
control={form.control}
name="vaccine_name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Vaccine Name</FormLabel>
    <FormControl>
      <Input placeholder="vaccine name" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="vaccinator"
render={({ field }) => (
  <FormItem>
    <FormLabel>Vaccinator</FormLabel>
    <FormControl>
      <Input placeholder="Vaccinator" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>









<FormField
control={form.control}
name="site"
render={({ field }) => (
  <FormItem>
    <FormLabel>Site</FormLabel>
    <FormControl>
    <Textarea rows={7} {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>

<FormField
control={form.control}
name="vaccination_date"
render={({ field }) => (
  <FormItem>
    <FormLabel>vaccination Date</FormLabel>
    <FormControl>
      <Input type="date" placeholder="date" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>
<FormField
control={form.control}
name="vaccination_time"
render={({ field }) => (
  <FormItem>
    <FormLabel>Vaccination Time</FormLabel>
    <FormControl>
      <Input type="time" placeholder="Vaccination Time" {...field} />
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
      <AlertTitle>Error creating immunization</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )}
  <LoaderButton isLoading={isPending}>
  <Send /> Create Immunization
  </LoaderButton>

  </form>
  </Form>
  </>
);
};
