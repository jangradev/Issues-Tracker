import { useQuery } from 'react-query';
export function useUserData(userId) {
   const userData = useQuery(
      ['users', userId],
      ({ signal }) =>
         fetch(`/api/users/${userId}`, { signal }).then((res) => res.json()),
      { staleTime: 1000 * 60 * 5 }
   );
   // console.log(' data from useUSerData --', userData);
   return userData;
}
// passing iserid as an arguments, we can use find method on userData.data
// userData.data.find(user=>user.id===userId)
// for all the user ,we are passing userId in Fetch Api
