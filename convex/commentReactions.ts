import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('commentReactions').collect()
  },
})

export const toggle = mutation({
  args: {
    commentId: v.id('comments'),
    userName: v.string(),
    type: v.union(v.literal('like'), v.literal('dislike')),
  },
  handler: async (ctx, { commentId, userName, type }) => {
    const existing = await ctx.db
      .query('commentReactions')
      .withIndex('by_user_comment', (q) =>
        q.eq('userName', userName).eq('commentId', commentId)
      )
      .first()

    if (existing) {
      if (existing.type === type) {
        // Same reaction — remove it (toggle off)
        await ctx.db.delete(existing._id)
      } else {
        // Different reaction — switch it
        await ctx.db.patch(existing._id, { type })
      }
    } else {
      await ctx.db.insert('commentReactions', { commentId, userName, type })
    }
  },
})
