import type { FC } from "react"
import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { useFormContext } from "react-hook-form"

import type { TProfileOnboardSchema } from "@acme/validators"

import type { StepProps } from "~/components/common/step"
import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import RadioItemWithEmoji from "../../../common/radio-item-with-emoji"

type LanguageOption = {
  code: string
  emoji: string
  label: string
}

const languageOptions: LanguageOption[] = [
  { code: "en-US", emoji: "🇺🇸", label: "English" },
  { code: "zh-CN", emoji: "🇨🇳", label: "Chinese (Mandarin)" },
  { code: "es-ES", emoji: "🇪🇸", label: "Spanish" },
  { code: "fr-FR", emoji: "🇫🇷", label: "French" },
  { code: "ar-SA", emoji: "🇸🇦", label: "Arabic" },
  { code: "ru-RU", emoji: "🇷🇺", label: "Russian" },
  { code: "pt-PT", emoji: "🇵🇹", label: "Portuguese" },
  { code: "ja-JP", emoji: "🇯🇵", label: "Japanese" },
  { code: "de-DE", emoji: "🇩🇪", label: "German" },
  { code: "it-IT", emoji: "🇮🇹", label: "Italian" },
  { code: "ko-KR", emoji: "🇰🇷", label: "Korean" },
  { code: "tr-TR", emoji: "🇹🇷", label: "Turkish" },
  { code: "nl-NL", emoji: "🇳🇱", label: "Dutch" },
  { code: "pl-PL", emoji: "🇵🇱", label: "Polish" },
  { code: "sv-SE", emoji: "🇸🇪", label: "Swedish" },
  { code: "no-NO", emoji: "🇳🇴", label: "Norwegian" },
  { code: "da-DK", emoji: "🇩🇰", label: "Danish" },
  { code: "fi-FI", emoji: "🇫🇮", label: "Finnish" },
]

const LearningLanguage: FC<StepProps> = ({ onContinue, onBack, progress }) => {
  const { setValue, watch } = useFormContext<TProfileOnboardSchema>()
  const learningLanguage = watch("learningLanguage")

  const handleSelect = (value: string) => {
    setValue("learningLanguage", value)
  }

  return (
    <Step.Container>
      <Step.Progress onBack={onBack} progress={progress} />

      <Step.Header>
        <Step.HeaderTitle>What language would you like to learn?</Step.HeaderTitle>
        <Step.HeaderDescription>Choose from the most popular languages to start your learning journey.</Step.HeaderDescription>
      </Step.Header>

      <Step.Body>
        <RadioGroupPrimitive.Root value={learningLanguage} onValueChange={handleSelect} className="flex w-full flex-col gap-2.5">
          {languageOptions.map((option) => (
            <RadioItemWithEmoji
              key={option.code}
              emoji={option.emoji}
              label={option.label}
              value={option.code}
              checked={learningLanguage === option.code}
              onCheckedChange={handleSelect}
            />
          ))}
        </RadioGroupPrimitive.Root>
      </Step.Body>

      <Step.Bottom>
        <Button.Root onPress={onContinue} size="lg" variant="primary" className="w-full" disabled={!learningLanguage}>
          <Button.Text>Continue</Button.Text>
        </Button.Root>
      </Step.Bottom>
    </Step.Container>
  )
}

export default LearningLanguage
