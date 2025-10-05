import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Circle, G, Path } from "react-native-svg"

const KO = (props: SvgProps) => (
  <Svg viewBox="0 0 900 600" {...props}>
    <Path fill="#FFF" d="M0 0h900v600H0z" />
    <G transform="rotate(-56.31)">
      <Path stroke="#000" strokeWidth={25} d="M-75 228.3H75m-150 37.5H75m-150 37.5H75m-150 475H75m-150 37.5H75m-150 37.5H75" />
      <Path stroke="#FFF" strokeWidth={12.5} d="M0 753.3v125" />
      <Circle cy={540.8} r={150} fill="#ca163a" />
      <Path fill="#0e4896" d="M0 390.8c-41.4 0-75 33.6-75 75s33.6 75 75 75 75 33.6 75 75-33.6 75-75 75c-82.8 0-150-67.2-150-150s67.2-150 150-150z" />
    </G>
    <Path
      stroke="#000"
      strokeWidth={25}
      d="m231.56 535.73-83.205-124.808M262.76 514.928l-83.205-124.807m114.407 104.006-83.205-124.808m478.43-138.675-83.205-124.807M720.39 209.843 637.184 85.036m114.407 104.006L668.386 64.234"
    />
    <Path stroke="#FFF" strokeWidth={12.5} d="m205.6 462.897 31.202-20.8m389.981-259.989 36.444-24.296m31.202-20.801 31.202-20.801" />
  </Svg>
)
export default KO
