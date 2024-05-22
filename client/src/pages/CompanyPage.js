import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { companies } from '../lib/fake-data';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {
  const [company, setCompany] = useState();
  const { companyId } = useParams();

  useEffect(() => {
    getCompany(companyId).then(setCompany);
  }, [companyId])

  if (!company) return <p>please wait ...</p>
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
