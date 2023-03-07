import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

export default function AddIssue() {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const addIssue = useMutation(
      (issueBody) => {
         // console.log(issueBody);
         return fetch('/api/issues', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(issueBody),
         }).then((res) => res.json());
      },
      {
         onSuccess: (data) => {
            // console.log(data);
            queryClient.invalidateQueries(['issues'], { exact: true });
            queryClient.setQueryData(['issues', data.number.toString()], data);
            navigate(`/issue/${data.number}`);
         },
      },
      {
         onSettled: (data) => {
            // console.log(data);
         },
      }
   );
   return (
      <div className='add-issue'>
         <h2>Add Issue</h2>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               if (addIssue.isLoading) return;
               addIssue.mutate({
                  comment: e.target.comment.value,
                  title: e.target.title.value,
               });
            }}
         >
            <label htmlFor='title'>Title</label>
            <input type='text' id='title' placeholder='Title' name='title' />
            <label htmlFor='comment'>Comment</label>
            <textarea id='comment' name='comment' placeholder='Comment' />
            <button type='submit' disabled={false}>
               {addIssue.isLoading ? 'Adding Issue...' : 'Add Isuee'}
            </button>
         </form>
      </div>
   );
}
