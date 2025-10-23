import { ZProfileVocabularyCreateManySchema } from "@acme/validators"

import { organizationUnlimitedProcedure } from "../../../trpc"

export const createMany = organizationUnlimitedProcedure.input(ZProfileVocabularyCreateManySchema).mutation(async ({ ctx, input }) => {
  const createdVocabularies = await ctx.db.vocabulary.createMany({
    data: input.vocabulary.map((vocabulary) => ({
      type: vocabulary.type,
      text: vocabulary.text,
      romanization: vocabulary.romanization,
      translation: vocabulary.translation,
      learningLanguage: vocabulary.learningLanguage,

      profileId: ctx.profile.id,
      organizationId: ctx.organization.id,
    })),
  })

  return createdVocabularies
})
