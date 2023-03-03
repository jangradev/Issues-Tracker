import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import IssueAssignment from './IssueeAssignment';
import { useIssueData, IssueHeader } from './IssueHeader';
import IssueStatus from './IssueStatus';
import { useIssueComment, Comment } from './useIssueComment';

export default function IssueDetails() {
   const dataParam = useParams();
   const { number } = dataParam;
   const issueQuery = useIssueData(number);
   const commentQuery = useIssueComment(number);
   console.log('issue Query', issueQuery);

   return (
      <div className='issue-details'>
         {issueQuery.isLoading ? (
            <p>Loading issues...</p>
         ) : (
            <>
               <IssueHeader {...issueQuery.data} />
               <main>
                  <section>
                     {commentQuery.isLoading ? (
                        <p>Loading ...</p>
                     ) : (
                        commentQuery.data.map((comment) => (
                           <Comment key={comment.id} {...comment} />
                        ))
                     )}
                  </section>
                  <aside>
                     <IssueStatus
                        status={issueQuery.data.status}
                        issueNumber={issueQuery.data.number.toString()}
                     />
                     <IssueAssignment
                        assignee={issueQuery.data.assignee}
                        issueNumber={issueQuery.data.number.toString()}
                     />
                  </aside>
               </main>
            </>
         )}
      </div>
   );
}
