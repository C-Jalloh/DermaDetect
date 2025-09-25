import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const DataStorageIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={24}
    height={24}
    fill="#e3e3e3"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M440-160H260q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520v-286l64 62 56-56-160-160-160 160 56 56 64-62v286Z" />
  </Svg>
)

export default DataStorageIcon