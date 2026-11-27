import type { ReactElement, ReactNode } from 'react';

export interface CatalogColumn<Item> {
   header: string;
   align?: 'left';
   render: (item: Item) => ReactNode;
}

interface CatalogTableProps<Item> {
   items: Item[];
   catalogColumns: CatalogColumn<Item>[];
   renderActions: (item: Item) => ReactNode;
}

export function CatalogTable<Item extends { id: number }>({
   items,
   catalogColumns,
   renderActions,
}: CatalogTableProps<Item>): ReactElement {
   return (
      <div>
         <ul className="space-y-3 md:hidden">
            {items.map((item) => (
               <li
                  key={item.id}
                  className="space-y-2 rounded-xl bg-white p-3 text-sm shadow-card ring-1 ring-ink-200/80"
               >
                  {catalogColumns.map((catalogColumn) => (
                     <div key={catalogColumn.header}>{catalogColumn.render(item)}</div>
                  ))}
                  <div className="flex justify-end border-t border-ink-100 pt-2">{renderActions(item)}</div>
               </li>
            ))}
         </ul>

         <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-card ring-1 ring-ink-200/80 md:block">
            <table className="w-full text-left text-sm">
               <thead className="border-b border-ink-100 bg-ink-50/80 text-xs text-ink-500">
                  <tr>
                     {catalogColumns.map((catalogColumn) => (
                        <th
                           key={catalogColumn.header}
                           data-align={catalogColumn.align}
                           className="whitespace-nowrap px-3 py-2.5 font-semibold xl:px-4"
                        >
                           {catalogColumn.header}
                        </th>
                     ))}
                     <th className="whitespace-nowrap px-3 py-2.5 font-semibold xl:px-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-ink-100">
                  {items.map((item) => (
                     <tr key={item.id} className="hover:bg-ink-50/60">
                        {catalogColumns.map((catalogColumn) => (
                           <td
                              key={catalogColumn.header}
                              data-align={catalogColumn.align}
                              className="px-3 py-3 xl:px-4"
                           >
                              {catalogColumn.render(item)}
                           </td>
                        ))}
                        <td className="px-3 py-3 xl:px-4">{renderActions(item)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}

export default CatalogTable;
