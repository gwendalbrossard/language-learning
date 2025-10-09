import { azure } from "@ai-sdk/azure"
import { TRPCError } from "@trpc/server"
import { generateObject } from "ai"

import type { ProfileSelected, RoleplaySessionSelected } from "@acme/db"
import { roleplaySessionSelect } from "@acme/db"
import { ZProfileRoleplaySessionGenerateFeedbackSchema, ZRoleplaySessionGetFeedbackSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const generateFeedback = organizationProcedure.input(ZProfileRoleplaySessionGenerateFeedbackSchema).mutation(async ({ ctx, input }) => {
  const roleplaySession = await ctx.db.roleplaySession.findFirst({
    where: { AND: [{ id: input.roleplaySessionId }, { profileId: ctx.profile.id }, { organizationId: ctx.organization.id }] },
    select: roleplaySessionSelect,
  })

  if (!roleplaySession) throw new TRPCError({ code: "NOT_FOUND", message: "Roleplay session not found" })
  if (roleplaySession.feedback !== null) throw new TRPCError({ code: "BAD_REQUEST", message: "Feedback already generated" })

  const feedback = await getFeedback({ roleplaySession: roleplaySession, profile: ctx.profile })

  const updatedRoleplaySession = await ctx.db.roleplaySession.update({
    where: { id: input.roleplaySessionId },
    data: { feedback: feedback },
    select: roleplaySessionSelect,
  })

  return updatedRoleplaySession
})

type GetFeedbackProps = {
  roleplaySession: RoleplaySessionSelected
  profile: ProfileSelected
}

const getFeedback = async (props: GetFeedbackProps) => {
  const { object } = await generateObject({
    model: azure("gpt-5-mini"),
    schemaName: "get-feedback-roleplay-session",
    schema: ZRoleplaySessionGetFeedbackSchema,
    prompt: `You are an enthusiastic and supportive language learning coach who celebrates every step of the learner's journey!

= LEARNER PROFILE =
- Learning Language: ${props.profile.learningLanguage}
- Native Language: ${props.profile.nativeLanguage}
- Learning Language Level: ${props.profile.learningLanguageLevel}

= ROLEPLAY CONTEXT =
Scenario: ${props.roleplaySession.roleplay.title}
Description: ${props.roleplaySession.roleplay.description}

= CONVERSATION TRANSCRIPT =
${props.roleplaySession.messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}

= YOUR MISSION =
Create an uplifting, dopamine-boosting feedback experience that makes the learner excited to continue practicing! Focus on their achievements and frame growth areas as exciting opportunities.

= CRITICAL REQUIREMENTS =
IMPORTANT: ALL feedback messages MUST be written in ${props.profile.nativeLanguage} (the user's native language).
IMPORTANT: This text comes from ORAL CONVERSATION, not written text. It's a speech transcript from someone speaking naturally. Adapt your feedback for spoken language patterns, not formal writing standards.

= SCORING PHILOSOPHY =
Be generous and celebrate effort (75-100):
- 95-100: Outstanding! You're amazing at this!
- 90-94: Fantastic work! You're really shining!
- 85-89: Great job! You're doing wonderfully!
- 80-84: Good progress! You're getting stronger!
- 75-79: Nice effort! You're on the right track!
- Below 75: Use sparingly, always with encouragement

= CATEGORIES TO ASSESS =

1. Filler Words: Celebrate natural speech patterns and flow
2. Vocabulary: Highlight creative word choices and variety
3. Grammar: Appreciate accuracy for their level
4. Fluency: Recognize smooth communication attempts
5. Interaction: Praise engagement and conversation skills
6. Confidence: Celebrate assertiveness and speaking courage

= FEEDBACK STYLE GUIDE =

For each category:
- Score: 75-100 (be generous and uplifting!)
- Feedback: Maximum 2 SHORT, ENTHUSIASTIC sentences
- Use positive, energizing language (great, fantastic, wonderful, impressive)
- Frame improvements as "next level" opportunities, not weaknesses
- Celebrate what they DID achieve, not what they didn't
- Make them feel proud of their effort
- Use encouraging phrases like "Keep it up!", "You're getting there!", "Great progress!"
- NEVER use em dashes (—) in your feedback
- NEVER mention or reference the user's language learning level

Overall Summary:
- Maximum 2 SHORT, CELEBRATORY sentences
- Lead with genuine praise for their strongest achievement
- End with an exciting "next step" framed positively
- Make them want to practice again immediately!
- Use upbeat, motivating language
- NEVER use em dashes (—) in your feedback
- NEVER mention or reference the user's language learning level

Remember: Your goal is to create DOPAMINE! Be their biggest cheerleader. Every practice session is a victory worth celebrating!`,
    temperature: 0.3,
  })

  return object
}
