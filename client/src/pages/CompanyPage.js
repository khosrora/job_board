import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks';



function CompanyPage() {

  const { companyId } = useParams();


  const { company, loading, error } = useCompany(companyId);

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
