import {View, StyleSheet, Dimensions} from "react-native"
import Svg, { Circle, Rect, Polygon, Ellipse,Path } from "react-native-svg";


const {width, height} = Dimensions.get("screen")
const getRandomInt = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
export default function Circle_Square_Triangle_BG(){
    const shapes = [];
    // const s1 = getRandomInt(20, 280)
    // const s2 = getRandomInt(10, 360)
    // Add random circles
    for (let i = 0; i < 5; i++) {
      const size = getRandomInt(4, 12);
      const s1 = getRandomInt(10, width)
      const s2 = getRandomInt(10, height)
      shapes.push(
        <Circle
          key={`circle-${i}`}
          cx={s1}
          cy={s2}
          r={size}
          fill={getRandomColor()}
        />
      );
    }
  
    // Add random rectangles
    for (let i = 0; i < 5; i++) {
      const size = getRandomInt(4, 12);
      const s1 = getRandomInt(10, width)
      const s2 = getRandomInt(10, height)
      shapes.push(
        <Rect
          key={`rect-${i}`}
          x={s1}
          y={s2}
          width={size}
          height={size}
          fill={getRandomColor()}
        />
      );
    }

  // Add random ellipses
  for (let i = 0; i < 5; i++) {
    const width = getRandomInt(4, 20);
    const height = getRandomInt(4, 20);
    shapes.push(
      <Ellipse
        key={`ellipse-${i}`}
        cx={getRandomInt(20, 280)}
        cy={getRandomInt(20, 420)}
        rx={width / 2}
        ry={height / 2}
        fill={getRandomColor()}
      />
    );
  }

  
    return (
      <View style={{width:"100%", height:"100%" }}>
        <Svg height="100%" width="100%" >
          {shapes}
        </Svg>
      </View>
    );
    // return(
    //     <View>
    //         {/* View 1 */}
    //         <View style={{height: 100, borderWidth:1}}>
    //             <Circle />

    //         </View>
    //   {/* Circle */}
    //   <Svg height="100" width="100">
    //     <Circle cx="50" cy="50" r="50" fill="blue" />
    //   </Svg>

    //   {/* Rectangle */}
    //   <Svg height="100" width="150">
    //     <Rect width="150" height="100" fill="green" />
    //   </Svg>

    //   {/* Triangle */}
    //   <Svg height="100" width="100">
    //     <Polygon points="50,0 100,100 0,100" fill="red" />
    //   </Svg>
    //         {/* Square */}
    //         <Svg height="100" width="100">
    //     <Rect width="100" height="100" fill="green" />
    //   </Svg>

    //  {/* Hexagon */}
    //  <Svg height="100" width="100">
    //     <Polygon
    //       points="50,0 100,25 100,75 50,100 0,75 0,25"
    //       fill="purple"
    //     />
    //   </Svg>
    //   {/* Bubble */}
    //   <Svg height="120" width="120" viewBox="0 0 120 120">
    //     <Ellipse cx="60" cy="60" rx="60" ry="40" fill="lightblue" />
    //     <Path
    //       d="M60 0 C70 0, 80 30, 60 40 C40 30, 50 0, 60 0 Z"
    //       fill="lightblue"
    //     />
    //   </Svg>


    //     </View>
    // )
}

const styles = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 50,
        borderRightWidth: 50,
        borderBottomWidth: 100,
        borderStyle: 'solid',
        backgroundColor: 'red',
        transform: [{ rotate: '180deg' }],
    },
})