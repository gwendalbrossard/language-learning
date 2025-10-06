import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const GraduationCap = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      stroke="#979FAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2 8c0 1.342 8.096 5 9.988 5 1.891 0 9.987-3.658 9.987-5s-8.096-5.001-9.987-5.001c-1.892 0-9.988 3.659-9.988 5Z"
    />
    <Path
      stroke="#979FAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m5.992 11 1.251 5.8c.086.398.284.769.614 1.005 2.222 1.595 6.034 1.595 8.256 0 .33-.236.527-.607.613-1.005l1.251-5.8M20.48 9.499V16.5m0 0c-.792 1.447-1.142 2.222-1.497 3.5-.077.456-.016.685.297.889.128.082.28.112.432.112h1.519a.798.798 0 0 0 .457-.126c.291-.2.366-.421.287-.874-.311-1.188-.708-2-1.496-3.5Z"
    />
  </Svg>
)
export default GraduationCap
