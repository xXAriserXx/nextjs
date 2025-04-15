'use client';  //this component will be rendered on the client    

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // These are icons from a react icon library      
import clsx from 'clsx'; //clsx is a small utility library that helps conditionally combine CSS class names
import Link from 'next/link'; //Link is a nexjs component that allows for client side navigation, it prefetches the linked pages in the background  
import { generatePagination } from '@/app/lib/utils'; //function that generates an array of page numbers to display in the pagination component
import { usePathname, useSearchParams } from 'next/navigation'; //they are both next hooks that enable dynamic behaviour based on the current route or query parameters

export default function Pagination({ totalPages }: { totalPages: number }) { //this is a react component that, by creating a pagination UI, allows the user to navigate between multiple pages of content
  const pathName = usePathname(); //this gets the current url's pathname
  const searchParams = useSearchParams(); //this gets the current url's search params
  const currentPage = Number(searchParams.get('page') || 1);  //This gets the currentpage from the searchParams if there is none it defaults to 1

  const createPageURL = (pageNumber: number | string) => { //this just basically creates the url that you will need when you click on the navigation buttons                      
    const params = new URLSearchParams(searchParams);  // this copies the current url 
    params.set('page', pageNumber.toString()); //this sets the page parameter to the value passed to the function
    return `${pathName}?${params.toString()}` //this is what the function returs: the updated url's path name
  }

   const allPages = generatePagination(currentPage, totalPages); //This generates an array of page numbers based on the currentpage the user is in and the total pages prop

  return (  //this is what the pagination component looks like 
    <>  
      { 
        <div className="inline-flex">  
        <PaginationArrow //This is a child component that renders the pagination bar arrows. In this case it renders the left arrow. It is only triggered once
          direction="left" //It tells the child component to render the left arrow
          href={createPageURL(currentPage - 1)} //This gets the url of the url of the page that the arrow redirects too, so the previous one (-1)
          isDisabled={currentPage <= 1} //If the current Page is the first  The left arrow is disabled
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => { //This is iterates over the allPages array
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first'; 
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber //Every time the page iterates a new page number is added to the pagination bar
                key={page}  //This is an idetinfier that identifies each PaginationNumber component
                href={createPageURL(page)} //This gets the url of the page that the PaginationNumber button component leads to   
                page={page} //This gets the current page where the user is on
                position={position} //This determines where the pagination component button is  
                isActive={currentPage === page} //This checks whether or not the current page is the same as the page from the current iteration of allpages
              />
            );
          })}
        </div>

        <PaginationArrow //This will render the right arrow
          direction="right" //The arrow will render a right arrow  
          href={createPageURL(currentPage + 1)} //this will get the next page
          isDisabled={currentPage >= totalPages} //this checks wheter or not the current page is the last page if it is the button is disabled  
        />
      </div> }
    </>
  );
}

function PaginationNumber({ //This child component is used to display each individual page number or dots in the pagination bar with proper behavior and styling
  page,  //this prop  tells what page the user is currently on
  href, //This tells what url the user is currently on
  isActive, //Indicates whether or not the page is currently active, if it is it renders the page button as a non clickable div
  position, //This tells the position of the page number in the pagination bar, rounds corners based on that
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx( //usage of clsx library to apply conditional styling to each page number 
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? ( //If the pagination button is either active or its position is middle then it gets rendered as a non clickable div
    <div className={className}>{page}</div>
  ) : ( //Else it is rendered as a link component that redirects to the relative page
    <Link href={href} className={className}> 
      {page}
    </Link>
  );
}

function PaginationArrow({ //This is a child component that renderes the arrows of the navigaion bar
  href, //this prop is used to know where the arrow component will lead to
  direction, //This prop is used to know wheter the arrow component will be a left or right arrow
  isDisabled, //This props is sued to know whether or not the button is disabled
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx( //conditional styling: The className cosnt will hold these styling values, avoids code duplication
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon = //So this is used to store the arrow Icon
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? ( //The child component will return either a clickable arrow button or a non clickable div 
    <div className={className}>{icon}</div>  //Using the className variable as the className attribute avoids code duplication
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
