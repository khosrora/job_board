import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.js';
import { ApolloServer } from '@apollo/server';
import { readFile } from 'fs/promises'
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { resolvers } from './resolvers.js'
import { getUser } from './db/users.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphql', 'utf-8');

async function geContext({ req }) {
  if (req.auth) {
    const user = await getUser(req.auth.sub);
    return { user }
  }
  return {}
}

const apolloService = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloService.start();
app.use('/graphql', apolloMiddleware(apolloService, { context: geContext }))

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL running on http://localhost:${PORT}/graphql`);
});
