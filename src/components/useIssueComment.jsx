import { useQuery } from 'react-query';
import { relativeDate } from '../helpers/relativeDate';
import { useUserData } from '../helpers/useUserData';

export function useIssueComment(issueNumber) {
   return useQuery(['issues', issueNumber, 'comment'], () => {
      return fetch(`/api/issues/${issueNumber}/comments`).then((res) =>
         res.json()
      );
   },{staleTime:1000*60*1});
}
export function Comment({ comment, createdBy, createdDate }) {
   const userQuery = useUserData(createdBy);
   console.log(userQuery.data);
   if (userQuery.isLoading) return <div className='comment'></div>;

   <div>
      <div> Loading...</div>
   </div>;
   return (
      <div className='comment'>
         <img src={userQuery.data.profilePictureUrl} alt='Commenter Avatar' />
         <div>
            <div className='comment-header'>
               <span>{userQuery.data.name}</span> commented{' '}
               <span>{relativeDate(createdDate)}</span>
            </div>
            <div className='comment-body'>{comment}</div>
         </div>
      </div>
   );
}
