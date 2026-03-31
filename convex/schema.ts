import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  accommodations: defineTable({
    url: v.string(),
    title: v.string(),
    imageUrl: v.optional(v.string()),
    addedBy: v.optional(v.string()),
    tag: v.optional(v.string()),
  }),

  votes: defineTable({
    accommodationId: v.id('accommodations'),
    userName: v.string(),
    stars: v.union(v.literal(1), v.literal(2), v.literal(3)),
  })
    .index('by_user', ['userName'])
    .index('by_accommodation', ['accommodationId'])
    .index('by_user_stars', ['userName', 'stars'])
    .index('by_user_accommodation', ['userName', 'accommodationId']),

  comments: defineTable({
    accommodationId: v.id('accommodations'),
    userName: v.string(),
    type: v.union(v.literal('pro'), v.literal('con')),
    text: v.string(),
  }).index('by_accommodation', ['accommodationId']),
})
