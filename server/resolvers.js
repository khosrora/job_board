import { getJobs, getJob, getJobsByCompany } from './db/jobs.js'
import { getCompany } from './db/companies.js'

export const resolvers = {
    Query: {
        job: (_root, { id }) => getJob(id),
        jobs: async () => getJobs(),
        company: (__root, { id }) => getCompany(id)
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    },

    Job: {
        company: (job) => {
            return getCompany(job.companyId);
        },
        date: (job) => toIsoDate(job.createdAt)
    }
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}