import { ApolloClient, InMemoryCache, gql, createHttpLink, concat, ApolloLink } from '@apollo/client'
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({
    uri: "http://localhost:9000/graphql"
})

const customLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken()
    if (accessToken) {
        operation.setContext({
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
    }
    return forward(operation)
})

export const jobByIdQuery = gql`
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

export const apolloClient = new ApolloClient({
    link: concat(customLink, httpLink),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: "network-only"
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only'
    //     }
    // }
})

export const createJobMutation = gql`
mutation createJob ($input: createJobInput!) {
        job : createJob(input: $input) {
         id
         title
         description 
         company {
           id 
           name
         }
    }
}`;

export async function createJob({ title, description }) {
    const mutation = gql`
         mutation createJob ($input: createJobInput!) {
                 job : createJob(input: $input) {
                  id
                  title
                  description 
                  company {
                    id 
                    name
                  }
             }
         }`;

    const { data } = await apolloClient.mutate({
        mutation,
        variables: {
            input: { title, description },
        },
        update: (cache, { data }) => {
            console.log(data);
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: data.job.id },
                data
            })
        }
    })

    return data.job;
}

export async function getJobs() {
    const query = gql`
        query getJobs {
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
    const { data } = await apolloClient.query({ query })
    return data.jobs;
}

export async function getJob(id) {


    const { data } = await apolloClient.query({
        query: jobByIdQuery,
        fetchPolicy: 'network-only',
        variables: {
            id
        }
    });

    return data.job;
}

export const getCompanyById = gql`
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
    // const { company } = await client.request(query, { id });
    const { data } = await apolloClient.query({
        query,
        variables: {
            id
        }
    })
    return data.company;
}