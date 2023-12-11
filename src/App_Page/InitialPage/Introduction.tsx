import {StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, ScrollViewBase, Platform} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InitialPages from '../../assests/Icons/InitialIcons/InitialIcons';
import IntroClass from './IntroClass';
import { useTheme } from '../../Theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';


const {width, height} = Dimensions.get("screen");
const introPageNo = 3;
const ITEM_COUNT = introPageNo;
const ITEM_SIZE = width;
const ITEM_MARGIN = 0;
export default function Introduction() {
  // Get inset of the device
  const insets = useSafeAreaInsets();
  const insetTop = insets.top;
  const insetBottom = insets.bottom;
  
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
  return (
    <View style={[styles.container, {backgroundColor: "red"}]}>
      {/* the dot show the number of page and the current page in the screen */}
      <ScrollView 
        contentContainerStyle={[styles.imageAndSologan, {width: 3 * width}]}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
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
      <View style={styles.dotAndNavigate}>
        <View style={styles.arrangeDotAndGetStart}>
          <View style={styles.arrangeDot}>
            {renderDots()}
          </View>
          <View style={{height:"50%", justifyContent:"flex-end"}}>
            {dotActive === introPageNo ? (
              <LinearGradient
                colors={['#FFC200', '#e61603']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.getStartBtn}
              >
                <Text style={{fontSize:20, color:theme.textButtonGradient, fontWeight:"600"}}>GET START</Text>
              </LinearGradient>
            ): ("")}
          </View>
        </View>

        {/* Button to switch pages from previous to next */}
        {/* <View style={styles.arrangeNavigate}>
          <TouchableOpacity 
            style={{ flexDirection:"row", opacity: dotActive !== 1 ? 1 : 0 }}
            onPress={handlePreviousPage}
            disabled={dotActive === 1}
          > 
            <View style={{justifyContent:"center"}}>
              <MaterialIcons
                name="arrow-back-ios"
                size={20}
                color={theme.deactiveIcon}
                key="back"
              />
            </View>
            <Text style={{marginLeft:5, fontSize: theme.sizeNormalText}}>Previous</Text>
          </TouchableOpacity> 

          <TouchableOpacity
            style={{flexDirection:"row", opacity: dotActive !== introPageNo ? 1 : 0,}} 
            onPress={handleNextPage}
            disabled={dotActive === 3}
          >
            <Text style={{marginRight:10, fontSize: theme.sizeNormalText}}>Next</Text>
            <View style={{justifyContent:"center"}}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                color={theme.deactiveIcon}
                key="forward"
              />     
            </View>       
          </TouchableOpacity>
        </View> */}
      </View>
      {/* <TouchableOpacity style={styles.getStartBtn}>

      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    flex:1,
  },
  imageAndSologan: {
    // width: '300%',
    height: 0.7 * height,
    flexDirection: 'row',

  },
  viewPage:{
    width:width,
    justifyContent:"center",
    alignItems:'center',
    paddingHorizontal:20,

  },
  arrangeDotAndGetStart:{
    height:"50%",
    // justifyContent:"center",
    alignItems:'center',
    flexDirection:"column",
    paddingTop:10,
    //  borderWidth:1,
  },
  arrangeDot:{
    height:"50%",
    justifyContent:"center",
    flexDirection:"row",
    padding:10,
    // borderWidth:1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal:5
  },
  dotAndNavigate: {
    height: 0.25 * height,
  },
  arrangeNavigate:{
    height:"50%",
    justifyContent:"space-between",
    alignItems:'center',
    flexDirection:"row",
    paddingHorizontal: 20,
    // borderWidth:1,
  },
  getStartBtn:{
    width:280, 
    height:40,
    borderRadius:20,
    justifyContent:"center",
    alignItems:'center',
    bottom:0,
        // borderWidth:1,
  }
});
