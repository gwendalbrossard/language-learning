import type { SvgProps } from "react-native-svg"
import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Book = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      stroke="#979FAD"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.501 7h-7m3.999 4h-4M20 22H6a2 2 0 0 1-2-2m0 0a2 2 0 0 1 2-2h14V6c0-1.886 0-2.828-.586-3.414C18.828 2 17.886 2 16 2h-6c-2.828 0-4.243 0-5.121.879C4 3.757 4 5.172 4 8v12Z"
    />
    <Path stroke="#979FAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 18s-1 .763-1 2 1 2 1 2" />
  </Svg>
)
export default Book
