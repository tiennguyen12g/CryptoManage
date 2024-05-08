import {ScrollView, StyleSheet, Text, TextInput, View, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, 
  Animated, ViewStyle
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useTheme} from '@react-navigation/native';

// Assets logo
import Logo from '../assests/Logo/Logo';
import Apple from '../assests/Icons/SocialMedia/apple';
import Facebook from '../assests/Icons/SocialMedia/facebook';
import Google from '../assests/Icons/SocialMedia/google';
import LogoShape from '../assests/Logo/LogoShape';

// Component
import Sign_In from '../App_Features/Account/Sign_In';

// Library
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PieChart} from "react-native-chart-tnbt"
import { TouchableOpacity } from 'react-native-gesture-handler';


// Utilitys
import CheckBox from '../Utilitys/CheckBox';
import CheckBoxSquare from '../Utilitys/CheckBoxSquare';

// Vector icons
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const {width, height} = Dimensions.get("screen");
export default function Home() {
  const {colors} = useTheme();
  const [listCoinValue, setListCoinValue] = useState<CoinValueDefined[]>([]);
  const [detectAddCoinAction, setDetectAddCoinAction] = useState<number>(0)

  const [coinName, setCoinName] = useState<string>('');
  const [valueCoin, setValueCoin] = useState<string>('');

  const [showAddCoin, setShowAddCoin] = useState<boolean>(false);
  const [boxActive, setBoxActive] = useState<string>("add");

  const [listCoinRemove, setListCoinRemove] = useState<number[]>([])
  
  useEffect(() => {
    async function GetData() {
      const getListCoinValue = await ListCoinValue()
        .then((value: any) => {
          console.log('value', value);
          return value;
        })
        .catch(err => {
          console.log('Error in Get', err);
        });
      setListCoinValue(getListCoinValue);
    }
    GetData();
  }, [detectAddCoinAction]);

  const handleAddMoreCoin = async () =>{
    // Store the JSON string from AsyncStorage
    const data : CoinValueDefined[] = [
      ...listCoinValue,
      {
        title: coinName.toUpperCase(),
        value: parseFloat(valueCoin),
      }
    ]
    const jsonData = await AsyncStorage.setItem('dataPieChart',JSON.stringify(data));
    setDetectAddCoinAction(prev => {
      return prev + 1;
    })
    
  }
  const handleShowAddCoinBox = () => {
    if(showAddCoin === false){
      setShowAddCoin(true)
    }
  }
  const handleCloseAddCoinBox = () => {
    if(showAddCoin){
      setShowAddCoin(false)
    }
  }

  const navigateAdd = () =>{
    setBoxActive('add');
    handleLineTabMove("add")
  }
  const navigateRemove = () =>{
    handleLineTabMove("remove")
    setBoxActive('remove');
    console.log('re-run');
  }
  const handleRemoveCoin = async () =>{

    // Create a new array excluding elements at specified indices
    const newArray = listCoinValue.filter((_, index) => !listCoinRemove.includes(index));
    setListCoinValue(newArray);
    await AsyncStorage.setItem('dataPieChart',JSON.stringify(newArray));

    console.log('Updated Array:', newArray); 
  }
  const handleListCoinRemove = (coinIndex: number) =>{
    if (listCoinRemove.includes(coinIndex)) {
      const indexToRemove = listCoinRemove.indexOf(coinIndex);
      if (indexToRemove !== -1) {
        // Element "b" found, remove it
        listCoinRemove.splice(indexToRemove, 1);
        console.log(`index ${coinIndex} remove`, listCoinRemove);
      } else {
        console.log(`${coinIndex} does not exist in the array.` );
      }
    } else {
      console.log('coinListRemove', listCoinRemove);
      setListCoinRemove(prev => {
        return [...prev, coinIndex]
      })
    }
  }

  const lineTabMove = useRef(new Animated.Value(0)).current;
  const handleLineTabMove = (tabName: string) => {
    const widthLine = (width - 30 - 20) / 2;
    let currentIndex = 0;

    if (tabName === "add") currentIndex = 0
    else if (tabName === "remove") currentIndex = 1;

    // Use "spring" mode
    // Animated.spring(lineTabMove, {
    //   toValue: widthLine * currentIndex,
    //   useNativeDriver: true,
    //   speed:3,
    // }).start();

    // Use "timing" mode
    Animated.timing(lineTabMove, {
      toValue: widthLine * currentIndex,
      duration: 500,
      useNativeDriver: true, // This is required for certain properties like 'marginLeft'
    }).start();
  }
 
  const lineStyle: Animated.WithAnimatedObject<ViewStyle> = {
    height: 2,
    width: '50%', 
    backgroundColor: "#0d89db",
    transform:[{translateX: lineTabMove}]
  };
  return (
<ScrollView style={{backgroundColor: 'white', width: '100%'}}>
  <View>
    {/* <View style={{backgroundColor: colors.background,width: 100,height: 100,}}></View>
    <Text style={{color: colors.secondary}}>Light Color</Text>
    <Text style={{color: colors.tertiary}}>Primary Color</Text>
    <Text style={{color: colors.secondary, fontSize: colors.sizeTitle}}>
      Dark Color
    </Text> */}

    <View style={[styles.container,{padding: 0}]}>
      <PieChart
        typeNo={1}
        data={listCoinValue}
        duration={1000}
        mainPie={
          {
             size: 280, 
             strokeWidth: 15
          }
       }
        animations={{
          clockwiseDirection: 'clockwise', // counter_clockwise or clockwise
        }}
        decorPie={{
          sizeDecorCircular: 280,
          strokeWidthDecorCircular: 25,
          seperateSlice: true,
          opacityDecorCircular: 0.5,
          annotation: true,
        }}
      />
      <View style={{padding:0, display:'flex', justifyContent:'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={handleShowAddCoinBox}>
          <View style={{marginTop:-10,}}>
            <MaterialIcons name='add-box' size={24} color={"gray"}/>
          </View>
        </TouchableOpacity>

        {/* Show box control list coin */}
        {showAddCoin && 
        <View style={[styles.boxAddAndDeleteCoin,{ }]}>
          <View style={[styles.decorAddRemoveBtn]}>
            <View style={{width:"50%", display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
              <TouchableOpacity onPress={navigateAdd}>
                <Text style={{color: boxActive === "add" ? "#0d89db" : "black", fontSize: 18}}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={{width:"50%", display:'flex', justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity onPress={navigateRemove}>  
                <Text style={{color: boxActive === "remove" ? "#0d89db" : "black", fontSize: 18}}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create animation for the lineHorizontal */}
          <View style={styles.lineContainer}>
            <Animated.View style={lineStyle} />
          </View>

          {/* Add new coin */}
          {boxActive === "add" && <View style={[styles.addCoinBox]}>
            <View style={{marginTop:10}}>
              <Text style={{fontWeight: "600"}}>Coin name</Text>
              <TextInput 
                style={[styles.textInputAddCoin]} 
                value={coinName} 
                onChangeText={(text) => setCoinName(text)}
              >
              </TextInput>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: "600"}}>Value</Text>
              <TextInput 
                style={[styles.textInputAddCoin]} 
                value={valueCoin} 
                onChangeText={(text) => setValueCoin(text)}
              >
              </TextInput>
            </View>
            <View style={{display:'flex', width:'auto'}}>
              <TouchableOpacity onPress={handleAddMoreCoin}>
                <Text style={[styles.addBtn]}>Add</Text>
              </TouchableOpacity>
              <View style={{marginTop:10, width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity onPress={handleCloseAddCoinBox}>
                    <AntDesign name='closecircleo' size={24} color={"gray"}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>}

          {/* Show box control remove */}
          {boxActive === "remove" && 
          <View style={[styles.removeCoinBox]}>
              <View style={{display:'flex', flexDirection:'row', width:"100%", marginBottom:10}}>
                <Text style={{width:"40%", fontSize:16,}}>Name</Text>
                <Text style={{width:"40%", fontSize:16,}}>Amount</Text>
                <Text style={{fontSize:16,}}>Selected</Text>
              </View>
              <ScrollView style={{maxHeight: 150, zIndex:5}}
                scrollEnabled={true}
                nestedScrollEnabled={true}
              >
                {listCoinValue.map((coin: CoinValueDefined, i)=> {
                  return (
                  <View style={{display:'flex', flexDirection:'row', width:"100%", }} key={i}>
                    <Text style={{width:"40%", marginBottom:10, fontWeight:"600"}}>{coin.title}</Text>
                    <Text style={{width:"40%", marginBottom:10}}>{coin.value}</Text>
                    <TouchableOpacity onPress={()=> handleListCoinRemove(i)} style={{width:'20%', alignSelf:'flex-end'}}>
                      <CheckBoxSquare label='' initialStatus={false} />
                    </TouchableOpacity>
                  </View>
                  )
                })}
              </ScrollView>
            <TouchableOpacity onPress={handleRemoveCoin}>
              <Text style={[styles.defaultBtn,{ color:"white", marginTop: 10,backgroundColor:'red'}]}>Remove</Text>
            </TouchableOpacity>
            <View style={{marginTop:10, width:'100%', display:'flex', justifyContent:'center', alignItems:'center', }}>
              <TouchableOpacity onPress={handleCloseAddCoinBox}>
                  <AntDesign name='closecircleo' size={24} color={"gray"}/>
              </TouchableOpacity>
            </View>
          </View>
          }
        </View>}
      </View>

    </View>

  </View>


  {/* This view use to avoid show content behind the tabBarBottomNavigator */}
  <View style={{marginBottom: 80, backgroundColor:"transparent"}}></View>

</ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding:15,
  },
  borderGradient: {
    borderRadius: 40, // Adjust the border radius as needed
    width: '80%',
    height: 80,
    padding: 10,
  },
  content: {
    height: 60,
    borderRadius: 30,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  boxAddAndDeleteCoin:{
    display:'flex', 
    // justifyContent:'space-between', 
    alignItems: 'center',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1, 
    borderRadius: 8,
    marginTop: -200,
    // backgroundColor: 'rgb(210, 227, 228)',
    backgroundColor:'white',
    width: width - 30,
    // minHeight:220,
    // maxHeight: 300,

  },
  addCoinBtn:{
    width:30, 
    height:20, 
    borderRadius: 5, 
    borderWidth: 1, 
    borderColor:"gray",
    display:"flex",
    justifyContent: "center",
    alignItems:"center",
    marginTop:0,
    padding:0,
  },
  textInputAddCoin:{
    borderColor: "gray",
    borderWidth:1,
    width: 300,
    height: 30,
    borderRadius: 5,
    paddingVertical:0,
    paddingHorizontal:10,
  },
  addBtn:{
    // borderColor: "gray",
    // borderWidth:1,
    width: "auto",
    height: 26,
    borderRadius: 5,
    paddingVertical:0,
    paddingHorizontal:5,
    fontSize:16,
    textAlign:'center',
    color: 'white',
    marginTop: 10,
    backgroundColor:'#0d89db',
  },
  defaultBtn:{
    // borderColor: "gray",
    // borderWidth:1,
    width: "auto",
    height: 26,
    borderRadius: 5,
    paddingVertical:0,
    paddingHorizontal:5,
    fontSize:16,
    // display:'flex',
    // justifyContent:'center',
    // alignItems:'center',
    textAlign:'center',
    color: '#0d89db',
  },
  closeBtn:{
    borderColor: "gray",
    borderWidth:1,
    width: 'auto',
    height: 26,
    borderRadius: 5,
    paddingVertical:0,
    paddingHorizontal:5,
    fontSize:16,
    textAlign:'center',
    color: 'red',
    marginTop: 10,
  },
  addCoinBox:{
    // display:'flex', 
    // justifyContent:'center', 
    // alignItems: 'center',
    // padding: 10,
    // borderColor: 'gray',
    // borderWidth: 1, 
    // borderRadius: 8,
    // marginTop: -100,
    // backgroundColor: 'rgb(210, 227, 228)'
  },
  lineContainer: {
    width: '100%',
    top:-1.5,
    
    // borderWidth: 1,
    // borderColor: 'gray',
  },
  decorAddRemoveBtn : {
    height:30, 
    display:'flex',
    width:'100%', 
    flexDirection:'row', 
    justifyContent:"space-evenly", 
    borderBottomWidth: 1,
    borderColor:'gray'
  },
  horizonalLine:{
    width: "50%",
    height:3,
    backgroundColor:"#0d89db",
    zIndex:10,
    marginTop:-2,
    // marginRight:(width - 50)/4
  },
  removeCoinBox:{
    width:'100%',
    paddingHorizontal: 20,
    paddingVertical:10,
  },
  closeXBtn:{
    width:30, 
    height: 30, 
    borderWidth:1, 
    color:'red', 
    borderRadius: 15, 
    textAlign:'center',  
    marginBottom: 20, 
    marginTop:10,
    padding:5,
  }
});

// Function get/set Item key in local device

interface CoinValueDefined {
  title: string,
  value: number,
}
const ListCoinValue = async () => {
  try {
    // Retrieve the JSON string from AsyncStorage
    const jsonData = await AsyncStorage.getItem('dataPieChart');

    if (jsonData !== null) {
      // Parse the JSON string back to an array or object
      const parsedData: CoinValueDefined[] = JSON.parse(jsonData);
      return parsedData;
    } else {
      // Handle the case where the key is not yet stored
      console.log('No data found in AsyncStorage. Initializing with default data.',);
      const initialData = [
        {
          title: 'NoCoin',
          value: 1,
        },
      ]
      return initialData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};
const dataInput = [
  {
    title: 'NoCoin',
    value: 100,
  },
  {
    title: 'USD',
    value: 11100,
  },
  {
    title: 'GMT',
    value: 11100,
  },
]