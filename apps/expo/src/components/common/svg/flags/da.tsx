import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DA = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#c60c30" d="M0 0h513v342H0z" />
    <Path fill="#FFF" d="M190 0h-60v140H0v60h130v142h60V200h323v-60H190z" />
  </Svg>
)
export default DA
