import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IT = (props: SvgProps) => (
  <Svg viewBox="0 0 513 342" {...props}>
    <Path fill="#F4F5F0" d="M342 0H0v341.3h512V0z" />
    <Path fill="#008C45" d="M0 0h171v342H0z" />
    <Path fill="#CD212A" d="M342 0h171v342H342z" />
  </Svg>
)
export default IT
