import {StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, ScrollViewBase, Platform} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InitialPages from '../../assests/Icons/InitialIcons/InitialIcons';
import IntroClass from './IntroClass';
import { useTheme } from '../../Theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();
const {width, height} = Dimensions.get("screen");
const introPageNo = 3;
export default function Introduction2() {
  // Get inset of the Ios device
  const insets = useSafeAreaInsets();
  const insetTop = insets.top;
  const insetBottom = insets.bottom;
  const heightIos = height - insetTop - insetBottom;
  
  const [dotActive, setDotActive] = useState<number>(1);
  const {theme} = useTheme();
  const scrollViewRef = useRef<ScrollView | null>(null);

  const renderDots = () => {
    const dots = [];
    for (let i = 1; i <= introPageNo; i++) {
      dots.push(
        <View
          key={`dot${i}`}
          style={[
            styles.dot,
            dotActive === i
              ? {backgroundColor: theme.activeIcon}
              : {backgroundColor: theme.deactiveIcon},
          ]}
        >
            
        </View>,
      );
    }
    return dots;
  };

  const handleNextPage = () => {
    if(dotActive < introPageNo){
      setDotActive((prev) => {
        return (prev + 1)
      });
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: width * (dotActive), animated: true });
      }
    };

  }
  const handlePreviousPage = () => {
    if(dotActive > 1){
      setDotActive((prev) => {
        return (prev - 1)
      });
      if (scrollViewRef.current) {
        // Explain. The original Axis is top-left (0,0), scrollTo with x = 1 * screenWidth. 
        //it means the first point go to is (screenWidth, y=0); and the second point go to (2*screenWidth,0);
        // When you are in the second point , you want to click button to scroll previous point. 
        // you have to go to the first point, its coordinate is (screenWidth, y=0). Go from (2*screenWidth,0) back to (screenWidth, y=0);
        // and from the first point, you want to back the initial image, you have to go the original point (0,0);

        // at the third image the dotActive is 3. and we have go to the first point (width,0). 
        // so we have formular x= width * (dotActive - 2)
        scrollViewRef.current.scrollTo({ x: width * (dotActive - 2), animated: true });
      }
    };
  }

  const handleScroll = (event: any) => {
    if(Platform.OS === "android"){
      const offsetX = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.ceil(offsetX / width) + 1;
      console.log("android",pageIndex)
      setDotActive(pageIndex);
      return ;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.floor(offsetX / width) + 1;
    console.log("ios",pageIndex)
    setDotActive(pageIndex);
  };

  const navigation = useNavigation();
  const goToSign_In_Up_Page = () => {
    navigation.navigate("InitialSign" as never);
  }
  return (
    <View 
      style={[
        styles.container, 
        
        {
          paddingTop: Platform.OS === 'ios' ? 0: 0,
          marginBottom: Platform.OS === 'ios' ? 0 : 0,
        },
      ]}
    >
      {/* the dot show the number of page and the current page in the screen */}
      <ScrollView 
        contentContainerStyle={[
          styles.imageAndSologan, 
          {
            width: 3 * width, 
            height: Platform.OS === "ios" ? heightIos * 0.8 : height * 0.8,
          }
        ]}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
          {InitialPages.map((object, i) => {
            return (
              <View style={styles.viewPage} key={`page${i}`}>
                <IntroClass
                  name={object.name}
                  logoTitle={object.logoTitle}
                  image={object.image}
                  contentTitle={object.contentTitle}
                  content={object.content}
                  pageNo={object.pageNo}
                />
              </View>
            );
          })}
      </ScrollView>
      <View 
        style={[
          styles.dotAndNavigate,
          {
            height: Platform.OS === "ios" ? (heightIos * 0.2) : (height * 0.2), //50 is total pading Value in imageAndSologan
            marginTop: Platform.OS === "ios" ? 0 : 0,
            top: Platform.OS === "ios" ? 0 : 0,
          }
        ]}
      >
        <View style={styles.arrangeDotAndGetStart}>
          <View style={styles.arrangeDot}>
            {renderDots()}
          </View>
          <TouchableOpacity onPress={goToSign_In_Up_Page} style={{height:"50%", justifyContent:"center",}}>
              <LinearGradient
                colors={['#FFC200', '#e61603']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.getStartBtn}
              >
                <Text style={{fontSize:20, color:theme.textButtonGradient, fontWeight:"600"}}>GET START</Text>
              </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  imageAndSologan: {
    flexDirection: 'row',
  },
  viewPage:{
    width:width,
    justifyContent:"center",
    alignItems:'center',
    paddingHorizontal:20,

  },
  arrangeDotAndGetStart:{
    justifyContent:"space-evenly",
    alignItems:'center',
    flexDirection:"column",
    paddingTop:10,
    paddingBottom:20,
    bottom: 40,
  },
  arrangeDot:{
    height:"50%",
    justifyContent:"center",
    flexDirection:"row",
    padding:10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal:5
  },
  dotAndNavigate: {
    // height: 0.3 * height - 50, // 50 is padding of the above view
  },
  arrangeNavigate:{
    height:"50%",
    justifyContent:"space-between",
    alignItems:'center',
    flexDirection:"row",
    paddingHorizontal: 20,
  },
  getStartBtn:{
    width:280, 
    height:40,
    borderRadius:20,
    justifyContent:"center",
    alignItems:'center',
    bottom:0,
  }
});
