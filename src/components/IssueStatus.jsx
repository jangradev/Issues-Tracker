import { useMutation, useQueryClient } from 'react-query';
import StatusSelect from './StatusSelect';

export default function IssueStatus({ status, issueNumber }) {
   const queryClient = useQueryClient();

   const setStatus = useMutation(
      (status) => {
         return fetch(`/api/issues/${issueNumber}`, {
            method: 'PUT',
            header: { 'content-type': 'application/json' },
            body: JSON.stringify({ status }),
         }).then((res) => res.json());
      },

      {
         onMutate: (status) => {
            const oldStatus = queryClient.getQueryData([
               'issues',
               issueNumber,
            ]).status;
            queryClient.setQueryData(['issues', issueNumber], (data) => ({
               ...data,
               status,
            }));
            return function rollBack() {
               queryClient.setQueryData(['issues', issueNumber], (data) => ({
                  ...data,
                  status: oldStatus,
               }));
            };
         },
         onError: (error, variables, rollBack) => {
            rollBack();
         },
         //  onSuccess: (data, variables, rollBack) => {
         //     rollBack();
         //     queryClient.setQueryData(['issues', issueNumber], data);
         //  },
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
            <span>Status</span>
            <StatusSelect
               noEmptyOption
               value={status}
               onChange={(e) => {
                  setStatus.mutate(e.target.value);
               }}
            />
         </div>
      </div>
   );
}
