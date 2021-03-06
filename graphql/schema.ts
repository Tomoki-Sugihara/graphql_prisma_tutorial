import { objectType, queryType, mutationType, makeSchema } from '@nexus/schema'
import { nexusPrisma } from 'nexus-plugin-prisma'
import path from 'path'

const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
  }
})

const Query = queryType({
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      resolve(_parent, _arg, ctx) {
        return ctx.prisma.user.findMany({})
      }
    })

    t.crud.user()
    t.crud.users()
  }
})

const Mutation = mutationType({
  definition(t) {
    t.field('bigRedButton', {
      type: 'String',
      async resolve(_parent, _arg, ctx) {
        const { count } = await ctx.prisma.user.deleteMany({})
        return `${count} user(s) destroyed.`
      }
    })

    t.crud.createOneUser()
    t.crud.deleteOneUser()
    t.crud.deleteMany()
    t.crud.updateOneUser()
    t.crud.updateManyUser()
  }
})

export const schema = makeSchema({
  types: [User, Query, Mutation],
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