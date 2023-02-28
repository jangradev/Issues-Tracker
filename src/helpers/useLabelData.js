import { useQuery } from 'react-query';
import { defaultLabels } from './defaultData';
export default function useLabelsData() {
   const labelsQuery = useQuery(
      ['labels'],
      ({ signal }) =>
         fetch('/api/labels', { signal }).then((res) => res.json()),
      { staleTime: 1000 * 60, placeholderData: defaultLabels }
   );
   return labelsQuery;
}
