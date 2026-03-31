import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const rename = mutation({
  args: {
    oldName: v.string(),
    newName: v.string(),
  },
  handler: async (ctx, { oldName, newName }) => {
    // Check if someone else already uses this name
    const existingVote = await ctx.db
      .query('votes')
      .withIndex('by_user', (q) => q.eq('userName', newName))
      .first()
    if (existingVote) {
      throw new Error(`Numele "${newName}" e deja luat, bossule`)
    }

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_user', (q) => q.eq('userName', oldName))
      .collect()
    for (const vote of votes) {
      await ctx.db.patch(vote._id, { userName: newName })
    }

    const comments = await ctx.db.query('comments').collect()
    for (const comment of comments) {
      if (comment.userName === oldName) {
        await ctx.db.patch(comment._id, { userName: newName })
      }
    }

    const accommodations = await ctx.db.query('accommodations').collect()
    for (const acc of accommodations) {
      if (acc.addedBy === oldName) {
        await ctx.db.patch(acc._id, { addedBy: newName })
      }
    }
  },
})
