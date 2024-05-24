import { gql, GraphQLClient } from 'graphql-request'

const endpoint = 'http://localhost:9000/graphql'
const client = new GraphQLClient(endpoint)

export async function createJob({ title, description }) {
    const mutation = `
    mutation createJob ($input: createJobInput) {
        job : createJob(input: $input) {
          id
          title
          description
        }
    }
    `;
    const job = await client.request(mutation, {
        input: { title, description }
    });
    return job;
}

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }          
    `
    const { jobs } = await client.request(query);
    return jobs;
}

export async function getJob(id) {
    const query = gql`
        query jobById($id : ID!) {
            job(id: $id) {
                    id
                    date
                    title
                    company {
                       id
                       name
                    }
                    description
            }
        }       
    `
    const { job } = await client.request(query, { id });
    return job;
}

export async function getCompany(id) {
    const query = gql`
        query getCompany($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                    description
                    date
            }
        }
    }      
    `;
    const { company } = await client.request(query, { id });
    return company;
}