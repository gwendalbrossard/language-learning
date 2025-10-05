import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const FI = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#FFF" d="M0 0h513v342H0z" />
    <Path fill="#2E52B2" d="M513 129.3V212H203.7v130H121V212H0v-82.7h121V0h82.7v129.3z" />
  </Svg>
)
export default FI
