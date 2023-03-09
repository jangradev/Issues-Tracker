import React from 'react';
import { useQuery, useQueryClient, useInfiniteQuery } from 'react-query';

const fetchInfiniteIssues = async ({ queryKey, pageParam = 5 }) => {
   const [issues, org, repo] = queryKey;
   const response = await fetch(
      `https://api.github.com/repos/${org}/${repo}/issues?page=${pageParam}`
   );
   const result = await response.json();
   return { issueList: result, pageParam };
};

function useScrollToBottomAction(container, callBack, offset = 0) {
   const callBackRef = React.useRef(callBack);

   React.useEffect(() => {
      callBackRef.current = callBack;
   }, [callBack]);

   React.useEffect(() => {
      const handleScroll = () => {
         let scrollContainer =
            container === document ? document.scrollingElement : container;
         if (
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight - offset
         ) {
            callBackRef.current();
         }
      };
      container.addEventListener('scroll', handleScroll);
      return () => {
         container.removeEventListener('scroll', handleScroll);
      };
   }, [container, offset]);
}

export default function InfinitePagination() {
   const infiniteQuery = useInfiniteQuery(
      ['issues', 'facebook', 'react'],
      fetchInfiniteIssues,
      {
         getNextPageParam: (lastPage, pages) => {
            console.log('lastPage--', lastPage);
            if (lastPage.issueList.length === 0) return undefined;
            return pages.length + 1;
         },
         getPreviousPageParam: (firstPage, pages) => {
            console.log('First PAge--', firstPage);
            if (firstPage.pageParam <= 1) {
               return;
            }
            return firstPage.pageParam - 1;
         },
      }
   );

   useScrollToBottomAction(
      document,
      () => {
         if (infiniteQuery.isFetchingNextPage) return;
         return infiniteQuery.fetchNextPage();
      },
      500
   );

   useScrollToBottomAction(
      document,
      () => {
         if (infiniteQuery.isFetchingNextPage) return;
         return infiniteQuery.fetchPreviousPage();
      },
      500
   );

   if (infiniteQuery.isLoading) return <p>Loading...</p>;
   return (
      <div>
         {infiniteQuery.isFetchingPreviousPage ? <p>Fetching More ...</p> : ''}
         <ul>
            {infiniteQuery.data?.pages?.map((page, index) => (
               <React.Fragment key={index}>
                  {page.issueList?.map((ele) => (
                     <li key={ele.id}>{ele.title}</li>
                  ))}
               </React.Fragment>
            ))}
         </ul>
         {infiniteQuery.isFetchingNextPage ? <p>Fetching More ...</p> : ''}
      </div>
   );
}
