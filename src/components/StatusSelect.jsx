import * as React from 'react';

const possibelStatus = [
   { id: 'backlog', label: 'BackLog' },
   { id: 'todo', label: 'Label' },
   { id: 'inProgress', label: 'In Progress' },
   { id: 'done', label: 'Done' },
   { id: 'cancelled', label: 'Cancelled' },
];
export default function StatusSelect({ value, onChange }) {
   return (
      <select value={value} onChange={onChange} className='status-select'>
         <option value=''>Select a Status to filter</option>
         {possibelStatus.map((status) => (
            <option key={status.id} value={status.id}>
               {status.label}
            </option>
         ))}
      </select>
   );
}
