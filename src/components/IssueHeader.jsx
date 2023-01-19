import { useQuery } from 'react-query';
import { GoIssueOpened, GoIssueClosed } from 'react-icons/go';
import { possibleStatus } from '../helpers/defaultData';
import { useUserData } from '../helpers/useUserData';
import { relativeDate } from '../helpers/relativeDate';

export function useIssueData(issueNumber) {
   return useQuery(['issues', issueNumber], () => {
      return fetch(`/api/issues/${issueNumber}`).then((res) => res.json());
   });
}
export const IssueHeader = ({
   title,
   number,
   status,
   createdBy,
   createdDate,
   comments,
}) => {
   const statusObject = possibleStatus.find((pstatus) => pstatus.id == status);
   const createdUser = useUserData(createdBy);
   console.log('created user query', createdUser.data);
   return (
      <header>
         <h2>
            {title}
            <span>#{number}</span>
         </h2>
         <div>
            <span
               className={
                  status === 'done' || status == 'cancelled' ? 'closed' : 'open'
               }
            >
               {status === 'done' || status === 'cancelled' ? (
                  <GoIssueClosed />
               ) : (
                  <GoIssueOpened />
               )}

               {statusObject.label}
            </span>
            <span className='created-by'>
               {createdBy.isLoading ? '...' : createdUser.data?.name}
            </span>{' '}
            opened this issue {relativeDate(createdDate)} / {comments.length}{' '}
         </div>
      </header>
   );
};
