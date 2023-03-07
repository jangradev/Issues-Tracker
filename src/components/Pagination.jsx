import React from 'react';
import { useQuery, useQueryClient } from 'react-query';

const fetchIssues = async ({ queryKey }) => {
   const [issues, { page, per_page }] = queryKey;
   await new Promise((res) => setTimeout(res, 1000));
   return fetch(
      `https://api.github.com/repos/facebook/react/issues?page=${page}&per_page=${per_page}`
   ).then((res) => res.json());
};

export default function Pagination() {
   const [page, setPage] = React.useState(1);
   const per_page = 10;
   const queryClient = useQueryClient();
   React.useEffect(() => {
      queryClient.prefetchQuery(['issues', { page: page + 1, per_page }]),
         fetchIssues;
   }, [page, per_page, queryClient]);
   const issuesQuery = useQuery(['issues', { page, per_page }], fetchIssues, {
      keepPreviousData: true,
   });
   if (issuesQuery.isLoading) return <p>Loading...</p>;
   if (issuesQuery.isError) return <p>Error!</p>;

   return (
      <div>
         <ul>
            {issuesQuery.data.map((ele) => (
               <li key={ele.id}>{ele.title}</li>
            ))}
         </ul>

         <button
            disabled={page === 1}
            onClick={() => setPage((page) => page - 1)}
         >
            Previous
         </button>
         {
            <p>
               {page}
               {issuesQuery.isFetching ? ' ...' : ''}
            </p>
         }
         <button
            disabled={
               issuesQuery.data.length < 10 || issuesQuery.isPreviousData
            }
            onClick={() => setPage((page) => page + 1)}
         >
            Next
         </button>
      </div>
   );
}
