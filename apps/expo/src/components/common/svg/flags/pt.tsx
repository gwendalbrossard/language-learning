import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const PT = (props: SvgProps) => (
  <Svg viewBox="0 85.333 512 341.333" {...props}>
    <Path fill="#D80027" d="M0 85.337h512v341.326H0z" />
    <Path fill="#6DA544" d="M196.641 85.337v341.326H0V85.337z" />
    <Circle cx={196.641} cy={256} r={64} fill="#FFDA44" />
    <Path fill="#D80027" d="M160.638 224v40.001c0 19.882 16.118 36 36 36s36-16.118 36-36V224h-72z" />
    <Path fill="#FFF" d="M196.638 276c-6.617 0-12-5.383-12-12v-16h24.001v16c-.001 6.616-5.385 12-12.001 12z" />
  </Svg>
)
export default PT
