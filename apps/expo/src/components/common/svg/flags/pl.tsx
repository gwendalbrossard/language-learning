import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

const PL = (props: SvgProps) => (
  <Svg viewBox="0 85.333 512 341.333" {...props}>
    <G fill="#FFF">
      <Path d="M0 85.337h512v341.326H0z" />
      <Path d="M0 85.337h512V256H0z" />
    </G>
    <Path fill="#D80027" d="M0 256h512v170.663H0z" />
  </Svg>
)
export default PL
