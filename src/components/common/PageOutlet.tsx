import { Suspense, type ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import FullPageSpinner from './FullPageSpinner';

export function PageOutlet(): ReactElement {
   return (
      <Suspense fallback={<FullPageSpinner />}>
         <Outlet />
      </Suspense>
   );
}

export default PageOutlet;
