import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('comments').collect()
  },
})

export const add = mutation({
  args: {
    accommodationId: v.id('accommodations'),
    userName: v.string(),
    type: v.union(v.literal('pro'), v.literal('con')),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('comments', args)
  },
})

export const update = mutation({
  args: {
    id: v.id('comments'),
    text: v.string(),
  },
  handler: async (ctx, { id, text }) => {
    await ctx.db.patch(id, { text })
  },
})

export const remove = mutation({
  args: { id: v.id('comments') },
  handler: async (ctx, { id }) => {
    const reactions = await ctx.db
      .query('commentReactions')
      .withIndex('by_comment', (q) => q.eq('commentId', id))
      .collect()
    for (const r of reactions) {
      await ctx.db.delete(r._id)
    }
    await ctx.db.delete(id)
  },
})
