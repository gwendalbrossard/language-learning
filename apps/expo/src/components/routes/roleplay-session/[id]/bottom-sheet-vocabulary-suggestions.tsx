import type { FC } from "react"
import React, { forwardRef, useState } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Volume2Icon } from "lucide-react-native"
import { ActivityIndicator, Alert, Dimensions, ScrollView, TouchableOpacity, View } from "react-native"

import type { RouterOutputs } from "@acme/api"

import { BottomSheetBackdrop } from "~/ui/bottom-sheet"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"
import MyModule from "../../../../../modules/my-module"

type VocabularySuggestion = RouterOutputs["profile"]["roleplaySession"]["getVocabularySuggestions"]["suggestions"][number]

type Props = {
  suggestions: VocabularySuggestion[]
}

type VocabularyCardProps = {
  suggestion: VocabularySuggestion
  onPlayPronunciation: (text: string) => void
  isLoadingPronunciation: boolean
}

const VocabularyCard: FC<VocabularyCardProps> = ({ suggestion, onPlayPronunciation, isLoadingPronunciation }) => {
  const handlePlayPronunciation = () => {
    onPlayPronunciation(suggestion.text)
  }

  return (
    <View className="flex w-full flex-row items-center justify-between gap-2 py-3 pl-4 pr-2">
      {/* Left */}
      <View className="flex flex-1 flex-row items-center gap-4">
        <TouchableOpacity onPress={handlePlayPronunciation} disabled={isLoadingPronunciation}>
          {isLoadingPronunciation && (
            <View className="size-6 items-center justify-center">
              <ActivityIndicator size="small" color="#3980F6" />
            </View>
          )}

          {!isLoadingPronunciation && <Volume2Icon size={24} className="text-primary-500" />}
        </TouchableOpacity>
        <View className="flex flex-1 flex-col">
          <Text className="text-base font-semibold text-neutral-700">{suggestion.text}</Text>
          {suggestion.romanization && <Text className="text-sm font-medium text-neutral-400">{suggestion.romanization}</Text>}
          <Text className="text-sm font-medium text-neutral-400">{suggestion.translation}</Text>
        </View>
      </View>
    </View>
  )
}

export const BottomSheetVocabularySuggestions = forwardRef<BottomSheetModal, Props>(({ suggestions }, ref) => {
  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile me not found")

  const [pronunciationCache, setPronunciationCache] = useState<Record<string, string>>({})

  const profileUtilsGetPronunciationMutation = useMutation(
    trpc.profile.utils.getPronunciation.mutationOptions({
      onSuccess: (data, variables) => {
        MyModule.playAudio({ audio: data.audioBase64 })

        // Cache the pronunciation by vocabulary text
        setPronunciationCache((prev) => ({
          ...prev,
          [variables.phrase]: data.audioBase64,
        }))
      },
      onError: (error) => {
        if (error.data?.code === "PAYMENT_REQUIRED") {
          Alert.alert("Subscription required", "You need to upgrade your plan to have access to this feature")
        } else {
          Alert.alert("An error occurred", error.message ? error.message : "An unknown error occurred")
        }
      },
    }),
  )

  const handlePlayPronunciation = async (text: string) => {
    // Use cached pronunciation if available
    if (pronunciationCache[text]) {
      MyModule.playAudio({ audio: pronunciationCache[text] })
      return
    }

    // Fetch pronunciation if not cached
    await profileUtilsGetPronunciationMutation.mutateAsync({
      phrase: text,
      language: profileMe.data.learningLanguage,
      organizationId: currentOrganizationId,
    })
  }
  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={BottomSheetBackdrop}
      snapPoints={["80%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.8}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
    >
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="border-b-2 border-neutral-100 px-4 pb-4 pt-1">
          <Text className="text-center text-lg font-semibold">Vocabulary Suggestions</Text>
        </View>

        {/* Body */}
        <ScrollView className="mb-4 flex-1 px-4 py-6">
          <View className="flex flex-col rounded-2xl border-2 border-neutral-100">
            {suggestions.map((suggestion, index) => (
              <React.Fragment key={`${suggestion.text}-${index}`}>
                <VocabularyCard
                  suggestion={suggestion}
                  onPlayPronunciation={handlePlayPronunciation}
                  isLoadingPronunciation={
                    profileUtilsGetPronunciationMutation.variables?.phrase === suggestion.text && profileUtilsGetPronunciationMutation.isPending
                  }
                />
                {index < suggestions.length - 1 && <View className="h-0.5 bg-neutral-100" />}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </BottomSheetModal>
  )
})

BottomSheetVocabularySuggestions.displayName = "BottomSheetVocabularySuggestions"
