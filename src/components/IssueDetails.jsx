import { useQueries } from 'react-query';
import { useParams } from 'react-router-dom';
import { useIssueData, IssueHeader } from './IssueHeader';
import { useIssueComment, Comment } from './useIssueComment';

export default function IssueDetails() {
   const dataParam = useParams();
   const { number } = dataParam;
   const issueQuery = useIssueData(number);
   const commentQuery = useIssueComment(number);
   console.log('Comments Query Data', commentQuery.data);
   console.log('Issue Query Data', issueQuery.data);

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
                  <aside></aside>
               </main>
            </>
         )}
      </div>
   );
}
