"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { deleteUserUseCase } from '@/use-cases/user';
import { SelectUser, SelectPatient } from '@/types';
import Link from 'next/link';

export default function PatientsTable({
  users,
  offset,
  totalUsers
}: {
  users: SelectUser[];
  offset: number;
  totalUsers: number;
}) {
  const router = useRouter();
  const patientsPerPage = 5;

  const prevPage = () => router.back();
  const nextPage = () => router.push(`/?offset=${offset + patientsPerPage}`, { scroll: false });

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Patients</CardTitle>
            <CardDescription className="text-blue-100">
              Manage your patients
            </CardDescription>
          </div>
          {/* <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Patient
          </Button> */}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="space-x-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Filter</Button>
          </div>
        </div> */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Gender</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead className="hidden md:table-cell">Next Appointment</TableHead>
              <TableHead className="hidden lg:table-cell">Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                <Badge variant={user.gender === 'male' ? 'default' : 'secondary'}>
                    {user.gender}
                  </Badge>
                </TableCell>
                <TableCell>{user.date_of_birth.toLocaleDateString()}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {(user.patient as SelectPatient).appointments[0]?.scheduled_date.toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                  {(user.patient as SelectPatient).appointments[0]?.reason || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">                     
                                           <DropdownMenuItem asChild>
                        <Link href={`/patients/${user.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="text-red-600" onSelect={() => deleteUserUseCase(user.id)}>
                        Delete Patient
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-gray-600">
            Showing <strong>{Math.min(offset + 1, totalUsers)}-{Math.min(offset + patientsPerPage, totalUsers)}</strong> of <strong>{totalUsers}</strong> patients
          </p>
          <div className="space-x-2">
            <Button
              onClick={prevPage}
              variant="outline"
              size="sm"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={nextPage}
              variant="outline"
              size="sm"
              disabled={offset + patientsPerPage >= totalUsers}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}