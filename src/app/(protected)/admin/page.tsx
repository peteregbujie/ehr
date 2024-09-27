
import { User, ArrowRight, Calendar, Users, Activity, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getPatientWithName } from '@/data-access/patient';
import { getCurrentUser } from '@/lib/session';

import { SelectAppointment, SelectPatient, SelectProvider, SelectUser } from '@/types';
import { Icons } from '@/components/shared/icons';
import {useAllUsersData} from '../hooks/useAllUsersData';




export default async function AdminDashboard () {
  const user = await  getCurrentUser(); 

  /* if (!user || user.role !== "admin") {
    throw new Error('Not logged in');
  } */

  const { data, error, isLoading } = useAllUsersData();
  
  if (isLoading) {
    return <div><Icons.spinner className="h-8 w-8 animate-spin" /></div>;
  }

  if (error)  return <div>{error.message}</div>;
 
  
    const {  users, patients,   providers, appointments } = data as { users: SelectUser[]; patients: SelectPatient[]; providers: SelectProvider[]; appointments: SelectAppointment[]; };
    // rest of your code
  

/*   const patientId = patients.map((patient) => patient.id)[0]; */



 

  // Helper function to get the most recent patients
  const getRecentPatients = async () => {
    return patients.slice(0, 5).map(async p => ({
      patientData:  await getPatientWithName(p.id),
      appointmentDate: p.appointments[0]?.scheduled_date
    }));
  };

  // Helper function to get upcoming appointments
  const getUpcomingAppointments = async () =>  {
    return appointments.filter(apt => new Date(apt.scheduled_date) > new Date())
      .slice(0, 5)
      .map(async apt => ({
        patientData: await getPatientWithName(apt.patient_id), 
        date: apt.scheduled_date,
        type: apt.type
      }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Admin Bio Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name || ''} />
            <AvatarFallback>{user?.name && user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(await getUpcomingAppointments()).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
          </CardContent>
        </Card>
        
      </div>

      {/* Recent Patients Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>Newly registered or recently active patients</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
          {await getRecentPatients().then(patients => patients.map(async (patientPromise, index) => {
  const patient = await patientPromise;
  return (
    <li key={index} className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{patient.patientData[0].name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{patient.patientData[0].name}</p>
          <p className="text-sm text-gray-500">Last appointment: {new Date(patient.appointmentDate).toLocaleDateString()}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        View <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </li>
  );
}))}
          </ul>
        </CardContent>
      </Card>

      {/* Upcoming Appointments Section */}
      <Card className="mb-8">
  <CardHeader>
    <CardTitle>Upcoming Appointments</CardTitle>
    <CardDescription>Next 5 scheduled appointments</CardDescription>
  </CardHeader>
  <CardContent>
    {await getUpcomingAppointments().then(async appointments => {
      const resolvedAppointments = await Promise.all(appointments);
      return (
        <ul className="space-y-4">
          {resolvedAppointments.map((apt, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{apt.patientData[0].name}</p>
                <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleString()} - {apt.type}</p>
              </div>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </li>
          ))}
        </ul>
      );
    })}
  </CardContent>
</Card>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>
            <User className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Schedule Appointment
          </Button>
          <Button>
            <Activity className="mr-2 h-4 w-4" /> View Reports
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" /> Manage Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};



