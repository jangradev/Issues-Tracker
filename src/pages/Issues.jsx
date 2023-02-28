import * as React from 'react';
import IssuesList from '../components/IssuesList';
import LabelList from '../components/LabelList';
import StatusSelect from '../components/StatusSelect';
import { Link } from 'react-router-dom';

export default function Issues() {
   const [labelsArray, setLabelsArray] = React.useState([]);
   const [status, setStatus] = React.useState('');
   return (
      <div>
         <main>
            <section>
               <h1>Issues</h1>
               <IssuesList labels={labelsArray} status={status} />
            </section>
            <aside>
               <LabelList
                  selected={labelsArray}
                  toggle={(clickedLabel) => {
                     setLabelsArray((currentLabels) =>
                        currentLabels.includes(clickedLabel)
                           ? currentLabels.filter(
                                (currentLabel) => currentLabel !== clickedLabel
                             )
                           : currentLabels.concat(clickedLabel)
                     );
                  }}
               />
               <h3>Status</h3>
               <StatusSelect
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
               />
               <hr />
               <Link className='button' to='/add'>
                  Add Issue
               </Link>
            </aside>
         </main>
      </div>
   );
}
