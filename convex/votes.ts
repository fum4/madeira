import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('votes').collect()
  },
})

export const cast = mutation({
  args: {
    accommodationId: v.id('accommodations'),
    userName: v.string(),
    stars: v.union(v.literal(1), v.literal(2), v.literal(3)),
  },
  handler: async (ctx, { accommodationId, userName, stars }) => {
    // Remove any existing vote by this user at this star level
    const existingAtStars = await ctx.db
      .query('votes')
      .withIndex('by_user_stars', (q) =>
        q.eq('userName', userName).eq('stars', stars)
      )
      .first()
    if (existingAtStars) {
      await ctx.db.delete(existingAtStars._id)
    }

    // Remove any existing vote by this user on this accommodation
    const existingOnAcc = await ctx.db
      .query('votes')
      .withIndex('by_user_accommodation', (q) =>
        q.eq('userName', userName).eq('accommodationId', accommodationId)
      )
      .first()
    if (existingOnAcc) {
      await ctx.db.delete(existingOnAcc._id)
    }

    // Insert the new vote
    await ctx.db.insert('votes', { accommodationId, userName, stars })
  },
})

export const remove = mutation({
  args: {
    accommodationId: v.id('accommodations'),
    userName: v.string(),
  },
  handler: async (ctx, { accommodationId, userName }) => {
    const vote = await ctx.db
      .query('votes')
      .withIndex('by_user_accommodation', (q) =>
        q.eq('userName', userName).eq('accommodationId', accommodationId)
      )
      .first()
    if (vote) {
      await ctx.db.delete(vote._id)
    }
  },
})
