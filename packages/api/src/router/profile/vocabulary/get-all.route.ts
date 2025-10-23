import { vocabularySelect } from "@acme/db"
import { ZProfileVocabularyGetAllSchema } from "@acme/validators"

import { organizationProcedure } from "../../../trpc"

export const getAll = organizationProcedure.input(ZProfileVocabularyGetAllSchema).query(async ({ ctx }) => {
  const vocabularies = await ctx.db.vocabulary.findMany({
    where: {
      AND: [{ profileId: ctx.profile.id }, { organizationId: ctx.organization.id }],
    },
    select: vocabularySelect,
  })

  return vocabularies
})
