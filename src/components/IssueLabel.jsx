import React from 'react';
import useLabelsData from '../helpers/useLabelData';
import { GoGear } from 'react-icons/go';
import { useMutation, useQueryClient } from 'react-query';

export default function IssueLabel({ labels, issueNumber }) {
   const [menuOpen, setMenuOpen] = React.useState(false);
   const labelsQuery = useLabelsData();
   const queryClient = useQueryClient();

   const setlabels = useMutation(
      (labelId) => {
         const newLabels = labels.includes(labelId)
            ? labels.filter((currentLabel) => currentLabel !== labelId)
            : [...labels, labelId];
         console.log('newLabels--mutationFn-->', newLabels);
         return fetch(`/api/issues/${issueNumber}`, {
            method: 'PUT',
            header: { 'content-type': 'application/json' },
            body: JSON.stringify({ labels: newLabels }),
         }).then((res) => res.json());
      },
      {
         onMutate: (labelId) => {
            const oldLabels = queryClient.getQueryData([
               'issues',
               issueNumber,
            ]).labels;
            console.log('OldLabels--onMutate-->', oldLabels);
            const newLabels = oldLabels.includes(labelId)
               ? oldLabels.filter((label) => label !== labelId)
               : [...oldLabels, labelId];

            console.log('newLabels--onMutate-->', newLabels);

            queryClient.setQueryData(['issues', issueNumber], (data) => ({
               ...data,
               labels: newLabels,
            }));
            return function rollBack() {
               queryClient.setQueryData(['issues', issueNumber], (data) => {
                  const rollbackLabels = oldLabels.includes(labelId)
                     ? [...data.labels, labelId]
                     : data.labels.filter((label) => label != labelId);
                  return { ...data, labels: rollbackLabels };
               });
            };
         },
         onError: (error, variables, rollBack) => {
            rollBack();
         },
         onSettled: () => {
            queryClient.invalidateQueries(['issues', issueNumber], {
               exact: true,
            });
         },
      }
   );

   return (
      <div className='issue-options'>
         <div>
            <span>Labels</span>
            {labelsQuery.isLoading
               ? null
               : labels.map((label) => {
                    const labelObject = labelsQuery.data.find(
                       (queryLabel) => queryLabel.id === label
                    );
                    return (
                       <span
                          key={label}
                          className={`label ${labelObject?.color}`}
                       >
                          {labelObject?.name}
                       </span>
                    );
                 })}
         </div>
         <GoGear
            onClick={() =>
               !labelsQuery.isLoading && setMenuOpen((state) => !state)
            }
         />
         {menuOpen && (
            <div className='picker-menu labels'>
               {labelsQuery.data?.map((label) => {
                  const selected = labels.includes(label.id);
                  return (
                     <div
                        key={label.id}
                        onClick={() => setlabels.mutate(label.id)}
                        className={selected ? 'selected' : ''}
                     >
                        <span
                           className='labels-dot'
                           style={{ backgroundColor: label?.color }}
                        ></span>
                        {label.name}
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
}
