import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DE = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#D80027" d="M0 0h513v342H0z" />
    <Path d="M0 0h513v114H0z" />
    <Path fill="#FFDA44" d="M0 228h513v114H0z" />
  </Svg>
)
export default DE
