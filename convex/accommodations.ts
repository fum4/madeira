import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('accommodations').collect()
  },
})

export const add = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('accommodations', args)
  },
})

export const remove = mutation({
  args: { id: v.id('accommodations') },
  handler: async (ctx, { id }) => {
    // Delete associated votes and comments
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_accommodation', (q) => q.eq('accommodationId', id))
      .collect()
    for (const vote of votes) {
      await ctx.db.delete(vote._id)
    }

    const comments = await ctx.db
      .query('comments')
      .withIndex('by_accommodation', (q) => q.eq('accommodationId', id))
      .collect()
    for (const comment of comments) {
      await ctx.db.delete(comment._id)
    }

    await ctx.db.delete(id)
  },
})
