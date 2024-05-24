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
        createJob: async (__root, { input: { title, description } }, { user }) => {
            if (!user) return unAuthorizeError();
            const companyId = user.companyId
            return createJob({ companyId, title, description })
        },
        deleteJob: async (__root, { id }, { user }) => {
            if (!user) return unAuthorizeError();
            const companyId = user.companyId
            const job = await deleteJob(id, companyId);
            return job;
        },
        updateJob: async (__root, { input: { id, title, description } }, { user }) => {
            if (!user) return unAuthorizeError();
            const companyId = user.companyId
            const res = await updateJob({ id, title, description , companyId });
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

function unAuthorizeError() {
    return new GraphQLError('un authorize', {
        extensions: {
            code: "UN_AUTHORIZE"
        }
    })
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}