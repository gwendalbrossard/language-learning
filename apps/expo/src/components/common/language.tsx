import type { SvgProps } from "react-native-svg"

import AR from "~/components/common/svg/flags/ar"
import DA from "~/components/common/svg/flags/da"
import DE from "~/components/common/svg/flags/de"
import EN from "~/components/common/svg/flags/en"
import ES from "~/components/common/svg/flags/es"
import FI from "~/components/common/svg/flags/fi"
import FR from "~/components/common/svg/flags/fr"
import IT from "~/components/common/svg/flags/it"
import JA from "~/components/common/svg/flags/ja"
import KO from "~/components/common/svg/flags/ko"
import NL from "~/components/common/svg/flags/nl"
import NO from "~/components/common/svg/flags/no"
import PL from "~/components/common/svg/flags/pl"
import PT from "~/components/common/svg/flags/pt"
import RU from "~/components/common/svg/flags/ru"
import SV from "~/components/common/svg/flags/sv"
import TR from "~/components/common/svg/flags/tr"
import ZH from "~/components/common/svg/flags/zh"

export type LanguageOption = {
  code: string
  emoji: string
  label: string
  icon: (props: SvgProps) => React.ReactNode
}

export const languageOptions: LanguageOption[] = [
  { code: "en-US", emoji: "🇺🇸", label: "English", icon: EN },
  { code: "zh-CN", emoji: "🇨🇳", label: "Chinese (Mandarin)", icon: ZH },
  { code: "es-ES", emoji: "🇪🇸", label: "Spanish", icon: ES },
  { code: "fr-FR", emoji: "🇫🇷", label: "French", icon: FR },
  { code: "ar-SA", emoji: "🇸🇦", label: "Arabic", icon: AR },
  { code: "ru-RU", emoji: "🇷🇺", label: "Russian", icon: RU },
  { code: "pt-PT", emoji: "🇵🇹", label: "Portuguese", icon: PT },
  { code: "ja-JP", emoji: "🇯🇵", label: "Japanese", icon: JA },
  { code: "de-DE", emoji: "🇩🇪", label: "German", icon: DE },
  { code: "it-IT", emoji: "🇮🇹", label: "Italian", icon: IT },
  { code: "ko-KR", emoji: "🇰🇷", label: "Korean", icon: KO },
  { code: "tr-TR", emoji: "🇹🇷", label: "Turkish", icon: TR },
  { code: "nl-NL", emoji: "🇳🇱", label: "Dutch", icon: NL },
  { code: "pl-PL", emoji: "🇵🇱", label: "Polish", icon: PL },
  { code: "sv-SE", emoji: "🇸🇪", label: "Swedish", icon: SV },
  { code: "no-NO", emoji: "🇳🇴", label: "Norwegian", icon: NO },
  { code: "da-DK", emoji: "🇩🇰", label: "Danish", icon: DA },
  { code: "fi-FI", emoji: "🇫🇮", label: "Finnish", icon: FI },
]
