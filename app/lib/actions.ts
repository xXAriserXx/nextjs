'use server'; //these actions all take place in the server

import { z } from 'zod'; //imports zod which is a validating library before sending data to the db  
import postgres from 'postgres'; //imports the postgres which enables db communication, it is a nodejs library
import { revalidatePath } from 'next/cache'; // revalidatePath which is a nextJS function that refreshes the cache of a specific path after performing like crud actions
import { redirect } from 'next/navigation'; //redirect is a nextJS that is used to redirect the user after performing a certain aciton like a crud one

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' }) //This creates a client istance to communicate with the db

const FormSchema = z.object({ //this is zod, it validates the data that should be sent to the db, this is a schema bdw
  id: z.string(), //the id is a string
  customerId: z.string({ //the customer id is a string, if it empty then a message is sent
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce //the amount is a number if the input is a string then it converst it to a number
    .number() 
    .gt(0, { message: 'Please enter an amount greater than $0.' }), //value must be greater than 0
  status: z.enum(['pending', 'paid'], { //value must be either pending or paid
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});


const CreateInvoice = FormSchema.omit({id: true, date: true}); //So the id and the date are omitted since they are created automatically

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    console.error(error)
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true }); 
 

export async function deleteInvoice(id: string) { 
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error)
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}