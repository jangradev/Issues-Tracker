import useLabelsData from '../helpers/useLabelData';

export function Label({ label }) {
   const labelsQuery = useLabelsData();

   if (labelsQuery.isLoading) return null;
   const labelObj = labelsQuery.data.find((item) => item.id === label);
   if (!labelObj) return null;
   return <span className={`label ${labelObj.color}`}>{labelObj.name}</span>;
}
