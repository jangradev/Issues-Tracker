import { GoGear } from 'react-icons/go';
import React from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { useUserData } from '../helpers/useUserData';

export default function IssueAssignment({ assignee, issueNumber }) {
   const queryClient = useQueryClient();
   const setAssignment = useMutation(
      async (assignee) => {
         const res = await fetch(`/api/issues/${issueNumber}`, {
            method: 'PUT',
            header: { 'content-type': 'application/json' },
            body: JSON.stringify({ assignee }),
         });
         return await res.json();
      },
      {
         onMutate: (assignee) => {
            console.log('onMutate Data--', assignee);
            const oldAssignee = queryClient.getQueryData([
               'issues',
               issueNumber,
            ]).assignee;
            console.log(oldAssignee);
            queryClient.setQueryData(['issues', issueNumber], (data) => ({
               ...data,
               assignee,
            }));
            return function rollBack() {
               queryClient.setQueryData(['issues', issueNumber], (data) => ({
                  ...data,
                  assignee: oldAssignee,
               }));
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

   const [menuOpen, setMenuOpen] = React.useState(false);
   const userQuery = useQuery(['users'], () =>
      fetch('/api/users').then((res) => res.json())
   );
   //console.log('userQuery', userQuery);s
   const user = useUserData(assignee);
   console.log('user--->', user);
   return (
      <div className='issue-options'>
         <div>
            <span>Assignment</span>
            {user.data?.name ? (
               <div>
                  <img src={user.data?.profilePictureUrl} />
                  {user.data?.name}
               </div>
            ) : (
               <p> No user found </p>
            )}
         </div>
         <GoGear
            onClick={() => !userQuery.isLoading && setMenuOpen((open) => !open)}
         />
         {menuOpen && (
            <div className='picker-menu'>
               {userQuery.data?.map((user) => (
                  <div
                     key={user.id}
                     onClick={(e) => {
                        setAssignment.mutate(user.id);
                     }}
                  >
                     <img src={user.profilePictureUrl} />
                     {user.name}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
