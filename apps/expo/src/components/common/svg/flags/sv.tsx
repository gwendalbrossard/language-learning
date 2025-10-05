import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const SV = (props: SvgProps) => (
  <Svg viewBox="0 85.333 512 341.333" {...props}>
    <Path fill="#0052B4" d="M0 85.333h512V426.67H0z" />
    <Path fill="#FFDA44" d="M192 85.33h-64v138.666H0v64h128v138.666h64V287.996h320v-64H192z" />
  </Svg>
)
export default SV
