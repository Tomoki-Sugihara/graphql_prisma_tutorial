import { objectType, queryType, mutationType, makeSchema } from '@nexus/schema'
import { nexusPrisma } from 'nexus-plugin-prisma'
import path from 'path'

const Query = queryType({
  definition(t) {
    t.string('hello', { resolve: () => 'hello world'})
  }
})

export const schema = makeSchema({
  types: [Query],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    typegen: path.join(process.cwd(), 'generated', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'schema.graphql', 'schema.graphql')
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        sources: '@prisma/client',
        alias: 'prisma'
      },
      {
        source: path.join(process.cwd(), 'graphql', 'context.ts'),
        alias: 'Context'
      }
    ]
  }
})