import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import useScrollToBottomAction from '../helpers/useScrollToBottomAction';
import IssueAssignment from './IssueeAssignment';
import { useIssueData, IssueHeader } from './IssueHeader';
import IssueLabel from './IssueLabel';
import IssueStatus from './IssueStatus';
import Loader from './Loader';
import { useIssueComment, Comment } from './useIssueComment';

export default function IssueDetails() {
   const dataParam = useParams();
   const { number } = dataParam;
   const issueQuery = useIssueData(number);

   const commentQuery = useIssueComment(number);
   console.log('infinite Query--', commentQuery);
   useScrollToBottomAction(document, () => commentQuery.fetchNextPage(), 100);
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
                        commentQuery.data?.pages?.map((commentPage) =>
                           commentPage.map((comment) => (
                              <Comment key={comment.id} {...comment} />
                           ))
                        )
                     )}
                     {commentQuery.isFetchingNextPage && <Loader />}
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
                     <IssueLabel
                        labels={issueQuery.data.labels}
                        issueNumber={issueQuery.data.number.toString()}
                     />
                  </aside>
               </main>
            </>
         )}
      </div>
   );
}
