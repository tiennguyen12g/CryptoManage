import {View, Text, TextProps} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from "@react-native-masked-view/masked-view";
interface Coordinate {
    x: number;
    y: number;
  }
interface GradienTextProps extends TextProps {
    colors?: string[],
    start?: Coordinate,
    end?: Coordinate,
}
export default function GradienText({ colors, style, start, end, ...props }: GradienTextProps){
    return(
        <MaskedView maskElement={<Text style={style} {...props} />}>
        <LinearGradient
          colors={colors ? colors : ["#F01500","#EEAF00",]}
          start={{ x: 0.25, y: 0.25 }}
          end={{ x: 1, y: 1 }}
        >
           <Text {...props} style={[style, { opacity: 0 }]} />
        </LinearGradient>
      </MaskedView>
    )
}
