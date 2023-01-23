export default async function fetchWithError(url, option) {
   const response = await fetch(url, option);

   if (response.status === 200) {
      const result = await response.json();
      if (result.error) {
         throw new Error(result.error);
      }
      return result;
   }

   throw new Error(`Response Error ${response.status} : ${response.statusText}`);
}
