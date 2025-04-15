import Form from '@/app/ui/invoices/create-form'; //Imports the form component  
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'; //Imports the breacrumbs component 
import { fetchCustomers } from '@/app/lib/data'; //imports the fetch customers method
 
export default async function Page() {
  const customers = await fetchCustomers(); //stores the fetched customers
    
  return (
    <main>
      <Breadcrumbs //Bread crumb child component: it has one prop which is an array of objects  
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />  {/* This is the form child component it has one prop which is fetched using the fetchCustomers method */}
    </main>
  );
}