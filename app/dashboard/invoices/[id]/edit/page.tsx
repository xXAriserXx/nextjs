import Form from '@/app/ui/invoices/edit-form'; //imports the edit form that allows editing of user invoices       
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'; //imports the breadCrumps component which shows the current pah
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data'; //imports the two fetching methods
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }>}) { //content of the page    
    const params = await props.params; //this gets the params from the props, awaits for them
    const id = params.id; //gets the id from the params that are taken from the props  
    const [invoice, customers] = await Promise.all([ //declares two constans that store the values returned by the two fetching methods 
        fetchInvoiceById(id), //accepts one parameter that is the id which is taken from the current url path
        fetchCustomers(),
    ]);

    if (!invoice) {
      notFound();
    }
  return (
    <main >
      <Breadcrumbs
        breadcrumbs={[ //this is the prop of breacrumbs, they are two objects  
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}