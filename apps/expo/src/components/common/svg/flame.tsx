import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Flame = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      fill="#FF9600"
      d="M10.064 1.889a.75.75 0 0 1 1.028.15l2.897 3.725 1.411-1.88a.75.75 0 0 1 1.117-.093c2.54 2.414 4.233 6.544 4.233 9.71a8.75 8.75 0 1 1-17.5 0c0-2.134.814-4.394 2.047-6.418 1.236-2.03 2.93-3.882 4.767-5.194Z"
    />
    <Path
      fill="#FFC700"
      d="M10.553 8.75a.75.75 0 0 1 .547.3l2.524 3.366 1.394-1.17a.75.75 0 0 1 1.155.242c.37.75.577 1.606.577 2.512 0 2.814-2.046 5.25-4.75 5.25S7.25 16.814 7.25 14c0-1.144.453-2.163.997-2.994.545-.833 1.217-1.531 1.723-2.037a.75.75 0 0 1 .583-.218Z"
    />
  </Svg>
)
export default Flame
