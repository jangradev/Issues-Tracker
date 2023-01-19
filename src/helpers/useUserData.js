import { useQuery } from 'react-query';
export function useUserData(userId) {
   const userData = useQuery(['users', userId], () =>
      fetch(`/api/users/${userId}`).then((res) => res.json())
   );
   return userData;
}
// passing iserid as an arguments, we can use find method on userData.data
// userData.data.find(user=>user.id===userId)
// for all the user ,we are passing userId in Fetch Api
