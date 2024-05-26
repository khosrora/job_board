import { useQuery } from '@apollo/client';
import { getCompanyById } from './queries';

export function useCompany(id) {
    const { data, loading, error } = useQuery(getCompanyById, {
        variables: {
            id
        }
    })
    return { company: data.company, loading, error: Boolean(error) }
}