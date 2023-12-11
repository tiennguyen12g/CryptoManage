import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Touchable,
} from 'react-native';
import WaveBG from '../../assests/Icons/InitialIcons/waveBG';
import LogoTitle from '../../assests/Icons/InitialIcons/LogoTitle';
import Logo from '../../assests/Icons/InitialIcons/Logo';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {useTheme} from '../../Theme/ThemeContext';
import {ButtonBackground, ButtonBorder} from '../../Utilitys/CustomButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');
export default function InitialSign() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  // Get inset device

  return (
    <View
      style={{
          backgroundColor: theme.background,
        }}
    >
      <View style={{position: 'absolute', height: '100%'}}>
        <WaveBG width={width} />
        <View
          style={{
            transform: [{rotate: '180deg'}],
            position: 'absolute',
            bottom: 0,
          }}>
          <WaveBG width={width} />
        </View>
      </View>
      <View style={styles.mainContent}>
        <View style={{alignItems: 'center', marginBottom: 50}}>
          <Text style={{fontSize: 24, fontWeight: '600', bottom: 20}}>
            Welcome To
          </Text>
          <View style={{paddingTop: 10, paddingBottom: 20}}>
            <Logo />
          </View>
          <LogoTitle />
        </View>
        <TouchableOpacity
          style={{paddingTop: 10, paddingBottom: 10}}
          onPress={() => navigation.navigate('SignUp' as never)}>
          <ButtonBackground titleBtn="Sign Up" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingBottom: 10}}
          onPress={() => navigation.navigate('SignIn' as never)}>
          <ButtonBorder
            titleBtn="Sign In"
            heightBtn={40}
            borderWidth={10}
            fontSizeBtn={20}
            isTextGradient={true}
          />
        </TouchableOpacity>
        <Text>OR</Text>
        <View style={{paddingVertical: 10}}>
          <ButtonBorder
            titleBtn="Try demo"
            heightBtn={40}
            borderWidth={10}
            fontSizeBtn={20}
            isTextGradient={true}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    height: '100%',
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
