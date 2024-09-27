'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Icons } from '@/components/shared/icons';

interface SearchInputProps {
  initialSearch?: string;
}

export function SearchInput({ initialSearch }: SearchInputProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    let value = formData.get('q') as string;
    let params = new URLSearchParams({ q: value });
    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Search..."
        className="w-full rounded-2xl bg-background pl-8 md:w-[200px] lg:w-[400px]"
        defaultValue={initialSearch}
      />
      {isPending && <Icons.spinner />}
    </form>
  );
}