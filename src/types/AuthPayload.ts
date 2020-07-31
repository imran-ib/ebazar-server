import { objectType } from '@nexus/schema'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User', nullable: true })
    t.field('seller', { type: 'Seller', nullable: true })
  },
})
