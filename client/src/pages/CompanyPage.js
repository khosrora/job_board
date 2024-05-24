import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { companies } from '../lib/fake-data';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {

  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false
  });
  const { companyId } = useParams();

  useEffect(() => {

    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company, loading: false, error: false })
      } catch (error) {
        setState({ company: null, loading: false, error: true })
      }
    })()
  }, [companyId])
  const { company, loading, error } = state;
  if (loading) return <p>please wait ...</p>
  if (error) return <p className='has-text-danger'>we have some error</p>
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
