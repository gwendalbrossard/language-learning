import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const NL = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#FFF" d="M0 114h513v114H0z" />
    <Path fill="#cd1f2a" d="M0 0h513v114H0z" />
    <Path fill="#1d4185" d="M0 228h513v114H0z" />
  </Svg>
)
export default NL
