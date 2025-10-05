import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const FR = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#FFF" d="M0 0h513v342H0z" />
    <Path fill="#00318A" d="M0 0h171v342H0z" />
    <Path fill="#D80027" d="M342 0h171v342H342z" />
  </Svg>
)
export default FR
