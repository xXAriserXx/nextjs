//This is the invoices component, it used to manage some things like:
/*
  1-Search and pagination
  2-Dynamic Data Fetching
  3-UI Rendering: it renders three things: search bar, invoices table and pagination bar
  4-Loading state through "shell" loader
*/ 

import Pagination from '@/app/ui/invoices/pagination'; //imports the pagination component
import Search from '@/app/ui/search'; //imports the search Component
import Table from '@/app/ui/invoices/table'; //imports the table component
import { CreateInvoice } from '@/app/ui/invoices/buttons'; // Imports the create Invoice component
import { lusitana } from '@/app/ui/fonts'; //Imports the lusitana font
import { Suspense } from 'react'; //Imports the Suspense component
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'; //Imports the skeleton or "shell" of the invoices table component
import { fetchInvoicesPages } from '@/app/lib/data'; // Imports function that is likely used to calculate the pagination for invoices table
 
export default async function Page(props: { //This is the component, in this case it is an asynchronous React Server Component
  searchParams?: Promise<{ //It has two optional props
    query?: string; //If there is a query it is a string
    page?: string; //If there is a page it is a string
  }>;
}) {
  const searchParams = await props.searchParams; //awaiting for props.searchParams to resolve
  const query = searchParams?.query || ''; //gets the query property from the searchParams property of the props object
  const currentPage = Number(searchParams?.page) || 1; //gets the page property from the searchParams property of the prop object
  const totalPages = await fetchInvoicesPages(query) //awaits for the return value of fetchInvoices using query as the parameter, basically gets the number of total pages based on the query
 
  return ( //what the component returns
    <div className="w-full"> 
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">   
        <Search placeholder="Search invoices..." />  {/* This is the search component, it accepts a placeholder prop */}
        <CreateInvoice /> {/* This the createinvoice component */}
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}> {/* This is the suspense component, it has two props, the key prop is used to tell whether the prop should remount itself and its children */}
        <Table query={query} currentPage={currentPage} /> {/* This is the table component it has two props: these props are most likely used as the parameters of a fetching functions that gets the invoices to show */}
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />  { /*This is the pagination component it accepts one prop, the total number of pages */ }
      </div>
    </div>
  );
}