import type { FC } from "react"
import React, { useState } from "react"
import { router, useLocalSearchParams } from "expo-router"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BookmarkIcon, Volume2Icon } from "lucide-react-native"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { RouterOutputs } from "~/utils/api"
import * as Button from "~/ui/button"
import { Text } from "~/ui/text"
import { trpc } from "~/utils/api"
import { useUserStore } from "~/utils/zustand/user-store"
import MyModule from "../../../../modules/my-module"

type VocabularyCardProps = {
  vocabulary: RouterOutputs["profile"]["lessonSession"]["get"]["vocabulary"][number]
  onPlayPronunciation: (text: string) => void
  isSelected: boolean
  onToggleSelect: (vocabularyId: string) => void
}
const VocabularyCard: FC<VocabularyCardProps> = ({ vocabulary, onPlayPronunciation, isSelected, onToggleSelect }) => {
  return (
    <View className="flex w-full flex-row items-center justify-between gap-2 py-3 pl-4 pr-2">
      {/* Left */}
      <View className="flex flex-1 flex-row items-center gap-4">
        <TouchableOpacity onPress={() => onPlayPronunciation(vocabulary.text)}>
          <Volume2Icon size={24} className="text-primary-500" />
        </TouchableOpacity>
        <View className="flex flex-1 flex-col">
          <Text className="text-base font-semibold text-neutral-700">{vocabulary.text}</Text>
          {vocabulary.romanization && <Text className="text-sm font-medium text-neutral-400">{vocabulary.romanization}</Text>}
          <Text className="text-sm font-medium text-neutral-400">{vocabulary.translation}</Text>
        </View>
      </View>

      {/* Right */}
      <View className="shrink-0">
        <TouchableOpacity className="items-center justify-center rounded-lg p-2" onPress={() => onToggleSelect(vocabulary.id)}>
          <BookmarkIcon size={24} className={isSelected ? "text-primary-500" : "text-neutral-400"} fill={isSelected ? "#3b82f6" : "none"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const LessonSessionIdEnded: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()

  const currentOrganizationId = useUserStore((state) => state.currentOrganizationId)
  if (!currentOrganizationId) throw new Error("Current organization ID not found")

  const profileMe = useQuery(trpc.profile.me.queryOptions())
  if (!profileMe.data) throw new Error("Profile me not found")

  const profileLessonSessionGet = useQuery(
    trpc.profile.lessonSession.get.queryOptions({ organizationId: currentOrganizationId, lessonSessionId: id }),
  )
  if (!profileLessonSessionGet.data) throw new Error("Lesson session not found")

  const [pronunciationCache, setPronunciationCache] = useState<Record<string, string>>({})
  const [selectedVocabulary, setSelectedVocabulary] = useState<Set<string>>(new Set())

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

  const profileLessonSessionVocabularyCreateManyMutation = useMutation(
    trpc.profile.lessonSession.vocabulary.createMany.mutationOptions({
      onSuccess: () => {
        router.replace(`/(tabs)/lessons`)
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

  const handleToggleVocabulary = (vocabularyId: string) => {
    setSelectedVocabulary((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(vocabularyId)) {
        newSet.delete(vocabularyId)
      } else {
        newSet.add(vocabularyId)
      }
      return newSet
    })
  }

  const handleToggleAll = () => {
    if (selectedVocabulary.size === profileLessonSessionGet.data.vocabulary.length) {
      // If all are selected, deselect all
      setSelectedVocabulary(new Set())
    } else {
      // Select all
      setSelectedVocabulary(new Set(profileLessonSessionGet.data.vocabulary.map((v) => v.id)))
    }
  }

  const handleContinue = async () => {
    if (selectedVocabulary.size > 0) {
      // Get the vocabulary texts for selected items
      const selectedVocabularyTexts = profileLessonSessionGet.data.vocabulary.filter((v) => selectedVocabulary.has(v.id)).map((v) => v.text)

      await profileLessonSessionVocabularyCreateManyMutation.mutateAsync({
        vocabulary: selectedVocabularyTexts,
        lessonSessionId: id,
        organizationId: currentOrganizationId,
      })
    } else {
      router.replace(`/(tabs)/lessons`)
    }
  }

  const stats = [
    {
      emoji: "🌟",
      title: "This Lesson",
      value: profileLessonSessionGet.data.vocabulary.length,
    },
    {
      emoji: "🔥",
      title: "All Time",
      value: profileMe.data.vocabularyLearned,
    },
  ]

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white p-4">
      <View className="flex-1 flex-col justify-between gap-6">
        {/* Header */}
        <View className="flex flex-col items-center gap-0.5">
          <Text className="text-center text-2xl font-bold text-neutral-700">🎉 Lesson Completed 🎉 </Text>
          <Text className="text-center text-sm font-medium text-neutral-400">
            Congratulations, you've completed the lesson! Review your vocabulary and continue your journey
          </Text>
        </View>

        {/* Content */}
        <ScrollView>
          <View className="flex flex-col gap-6">
            {/* Vocabulary Learned */}
            <View className="flex flex-col gap-2">
              <Text className="text-lg font-semibold text-neutral-700">Vocabulary Learned</Text>
              <View className="gap-2.5">
                {Array.from({ length: Math.ceil(stats.length / 2) }, (_, rowIndex) => (
                  <View key={rowIndex} className="flex-row gap-2.5">
                    {stats.slice(rowIndex * 2, rowIndex * 2 + 2).map((stat, colIndex) => (
                      <View key={rowIndex * 2 + colIndex} className="flex-1">
                        <View className="flex flex-row gap-2 rounded-2xl border-2 border-neutral-100 bg-white p-3">
                          <Text className="text-2xl">{stat.emoji}</Text>
                          <View className="flex flex-1 flex-col">
                            <Text className="line-clamp-1 text-lg font-black text-neutral-700">{stat.value}</Text>
                            <Text className="-mt-1 line-clamp-1 text-xs font-semibold text-neutral-400">{stat.title}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Review New Vocabulary */}
            <View className="flex flex-col gap-2">
              <View className="flex flex-row items-center justify-between gap-2">
                <Text className="text-lg font-semibold text-neutral-700">Review New Vocabulary</Text>
                <TouchableOpacity onPress={handleToggleAll}>
                  <Text className="text-sm font-semibold text-neutral-400">
                    {selectedVocabulary.size === profileLessonSessionGet.data.vocabulary.length ? "Unselect all" : "Select all"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex flex-col rounded-2xl border-2 border-neutral-100">
                {profileLessonSessionGet.data.vocabulary.map((vocabulary, i) => (
                  <React.Fragment key={vocabulary.id}>
                    <VocabularyCard
                      vocabulary={vocabulary}
                      onPlayPronunciation={handlePlayPronunciation}
                      isSelected={selectedVocabulary.has(vocabulary.id)}
                      onToggleSelect={handleToggleVocabulary}
                    />
                    {i < profileLessonSessionGet.data.vocabulary.length - 1 && <View className="h-0.5 bg-neutral-100" />}
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Actions */}
        <View className="flex flex-col gap-2">
          <Button.Root
            variant="primary"
            className="w-full"
            onPress={handleContinue}
            loading={profileLessonSessionVocabularyCreateManyMutation.isPending}
          >
            <Button.Text>Continue</Button.Text>
          </Button.Root>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LessonSessionIdEnded
