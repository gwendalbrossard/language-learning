import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const RU = (props: SvgProps) => (
  <Svg viewBox="0 85.333 512 341.333" {...props}>
    <Path fill="#FFF" d="M0 85.33v341.332h512V85.33z" />
    <Path fill="#0052B4" d="M0 85.333h512V426.67H0z" />
    <Path fill="#FFF" d="M0 85.333h512v113.775H0z" />
    <Path fill="#D80027" d="M0 312.884h512v113.775H0z" />
  </Svg>
)
export default RU
