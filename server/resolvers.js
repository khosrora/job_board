import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from './db/jobs.js'
import { getCompany } from './db/companies.js'
import { GraphQLError } from 'graphql'

export const resolvers = {
    Query: {
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                return notFoundError('nof job found with id ===>', id);
            }
            return job;
        },
        jobs: async () => getJobs(),
        company: async (__root, { id }) => {
            const company = await getCompany(id)
            if (!company) {
                throw notFoundError('not Compnay found with id ==>', id)
            }
            return company
        }
    },

    Mutation: {
        createJob: async (__root, { input: { title, description } }) => {
            const companyId = "FjcJCHJALA4i" //TODO set based user
            return createJob({ companyId, title, description })
        },
        deleteJob: async (__root, { id }) => {
            const res = await deleteJob(id);
            return res;
        },
        updateJob: async (__root, { input: { id, title, description } }) => {
            const res = await updateJob({ id, title, description });
            return res;
        }
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

function notFoundError(message, id) {
    return new GraphQLError('no Company with id' + id, {
        extensions: {
            code: "NOT_FOUND"
        }
    })
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}