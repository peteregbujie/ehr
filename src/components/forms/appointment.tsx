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
import { AppointmentSchema } from "@/lib/validations/appointment";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointmentAction } from "@/actions/appointment";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderButton } from "@/components/loader-button";
import { Send, Terminal } from "lucide-react";





export function AppointmentForm  ()  {

    
  const { isPending, execute,  error } = useServerAction(createAppointmentAction, {
    onSuccess() {
        toast.success("Appointment has been created.");      
    },
    onError() {
        toast.error("Something went wrong.", {
            description: "Your Appointment was not created. Please try again.",
          })
    },
  })

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
        reason: "", patient_id: "",provider_id: "", type: "new_patient", status: "scheduled", notes: "",scheduled_date: "",scheduled_time: "",location: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof AppointmentSchema>> = (
    values
  ) => {
    execute({
        reason: values.reason, provider_id: values.provider_id, patient_id: values.patient_id, type: values.type, status: values.status, notes: values.notes, scheduled_date: values.scheduled_date, scheduled_time: values.scheduled_time, location: values.location,
       
    });
  };

    form.reset({       
        reason: "", patient_id: "",provider_id: "", type: "new_patient", status: "scheduled", notes: "",scheduled_date: "",scheduled_time: "",location: "",
      })

  return (
    <>
    <Form {...form}>


    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

    <FormField
      control={form.control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input placeholder="Reason" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="patient_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Patient ID</FormLabel>
          <FormControl>
            <Input placeholder="Patient ID" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="provider_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Provider ID</FormLabel>
          <FormControl>
            <Input placeholder="Provider ID" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          <FormControl>
          <Select>
                    <SelectTrigger asChild>                     
                      <SelectValue placeholder='Type' {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_patient">New Patient </SelectItem>
                      <SelectItem value="follow_up"> "follow_up",</SelectItem>
                      <SelectItem value="annual_physical">Annual_Physical</SelectItem>
                     
                    </SelectContent>
                  </Select>
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
                      <SelectValue placeholder='Type' {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="cancelled"> Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>                     
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
            <Input placeholder="Notes" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="scheduled_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Scheduled Date</FormLabel>
          <FormControl>
            <Input type="date" placeholder="Scheduled date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    <FormField
      control={form.control}
      name="scheduled_time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Scheduled Time</FormLabel>
          <FormControl>
            <Input type="time" placeholder="Scheduled time" {...field} />
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
