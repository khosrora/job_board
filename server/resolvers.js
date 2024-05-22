import { getJobs } from './db/jobs.js'
import { getCompany } from './db/companies.js'

export const resolvers = {
    Query: {
        jobs: async () => getJobs(),
    },
    Job: {
        compnay: (job) => {
            return getCompany(job.companyId);
        },
        date: (job) => toIsoDate(job.createdAt)
    }
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}