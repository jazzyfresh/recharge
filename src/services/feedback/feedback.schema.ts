// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { FeedbackService } from './feedback.class'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const feedbackSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    chargerId: Type.Number(),
    rating: Type.Number(),
    text: Type.String(),
    createdAt: Type.Number(),
    userId: Type.String({ objectid: true }),
		user: Type.Ref(userSchema)
  },
  { $id: 'Feedback', additionalProperties: false }
)
export type Feedback = Static<typeof feedbackSchema>
export const feedbackValidator = getValidator(feedbackSchema, dataValidator)
export const feedbackResolver = resolve<Feedback, HookContext<FeedbackService>>({
  user: virtual(async (feedback, context) => {
    return context.app.service('users').get(feedback.userId)
  })
})

export const feedbackExternalResolver = resolve<Feedback, HookContext<FeedbackService>>({})

// Schema for creating new entries
export const feedbackDataSchema = Type.Pick(feedbackSchema, ['chargerId', 'rating', 'text'], {
  $id: 'FeedbackData'
})
export type FeedbackData = Static<typeof feedbackDataSchema>
export const feedbackDataValidator = getValidator(feedbackDataSchema, dataValidator)
export const feedbackDataResolver = resolve<Feedback, HookContext>({
  userId: async (_value, _feedback, context) => {
    return context.params.user._id
  },
  createdAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const feedbackPatchSchema = Type.Partial(feedbackSchema, {
  $id: 'FeedbackPatch'
})
export type FeedbackPatch = Static<typeof feedbackPatchSchema>
export const feedbackPatchValidator = getValidator(feedbackPatchSchema, dataValidator)
export const feedbackPatchResolver = resolve<Feedback, HookContext<FeedbackService>>({})

// Schema for allowed query properties
export const feedbackQueryProperties = Type.Pick(feedbackSchema, ['_id', 'chargerId', 'rating', 'text', 'createdAt', 'userId'])
export const feedbackQuerySchema = Type.Intersect(
  [
    querySyntax(feedbackQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type FeedbackQuery = Static<typeof feedbackQuerySchema>
export const feedbackQueryValidator = getValidator(feedbackQuerySchema, queryValidator)
export const feedbackQueryResolver = resolve<FeedbackQuery, HookContext>({
  userId: async (value, user, context) => {
    // Allow seeing all feedback but can only modify their own feedback
    if (context.params.user && context.method !== 'find') {
      return context.params.user._id
    }
    return value
  }
})
