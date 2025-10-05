import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const JA = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#FFF" d="M0 0h512v342H0z" />
    <Circle cx={256.5} cy={171} r={96} fill="#D80027" />
  </Svg>
)
export default JA
