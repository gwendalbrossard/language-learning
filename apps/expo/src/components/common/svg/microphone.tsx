import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

const Microphone = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <G fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
      <Path fill="currentColor" d="M9 6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V6z" />
      <Path d="M12 18v0a7 7 0 0 1-7-7v0-1m7 8v0a7 7 0 0 0 7-7v0-1m-7 8v3" />
    </G>
  </Svg>
)
export default Microphone
