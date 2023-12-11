
  export default function NumberKeyBoard({navigation, setAuthenticated}: PinLockProps) {
  
    const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | null>(
      null,
    );
    const [dotArray, setDotArray] = useState<number[]>([]);
    const handlePinSubmit = () => {
      if (dotArray.length === 6) {
        const userEnterPassword = dotArray.join('');
        if (userEnterPassword === pincode) {
          setAuthenticated(true)
        } else {
          setIsPasswordCorrect(true);
        }
      } else {
        setIsPasswordCorrect(false);
      }
    };
    const handleSetDotArray = (number: number) => {
      if (dotArray.length < 6) {
        const newDotArray = [...dotArray, number];
        setDotArray(newDotArray);
      }
    };
    const handleDeleteDotArray = () => {
      if (dotArray.length > 0) {
        const newDotArray: number[] = dotArray.slice(0, -1);
        setDotArray(newDotArray);
      }
    };
    return (
      <View style={{justifyContent: 'center', height: '100%'}}>
        {isPasswordCorrect === null ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{fontSize: 16}}>
              Use your fingerprint or enter PIN to unlock
            </Text>
          </View>
        ) : (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{color:"red"}}>Incorrect Password. Try Again!</Text>
          </View>
        )}
        <View style={{marginTop: 30}}>
          <View style={styles.viewTextInput}>
            {dotArray.map((dot, i) => {
              return <View style={styles.dotInput} key={i}></View>;
            })}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                width: '100%',
                position: 'absolute',
              }}>
              <Text
                style={{fontSize: 22, fontWeight: '600', color: 'black'}}
                onPress={handlePinSubmit}>
                OK
              </Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
        </View>
        <View style={{marginTop: 30}}>
          {NUMBERS_GROUP.map((groupNumbers, j) => (
            <View key={j} style={styles.groupNumber}>
              {groupNumbers.map((number, i) => {
                return typeof number === 'number' ? (
                  <Text
                    key={`number${i}`}
                    style={styles.buttonNumber}
                    onPress={() => handleSetDotArray(number)}>
                    {number}
                  </Text>
                ) : number === 'icon' ? (
                  <View style={styles.buttonNumberIcon} key={`icon${i}`}>
                    <Feather
                      name="delete"
                      size={30}
                      color="black"
                      onPress={handleDeleteDotArray}
                    />
                  </View>
                ) : (
                  <View style={styles.buttonNumberHidden} key={`hidden${i}`} />
                );
              })}
            </View>
          ))}
        </View>
  
        <View style={{alignItems: 'center', marginBottom: 30, marginTop: 10}}>
          <Text style={{color: 'red', fontSize: 16, fontWeight: '500'}}>
            Forgot your PIN?
          </Text>
        </View>
        {supportFingerprint === true ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              marginTop: 10,
              bottom: 0,
              position: 'absolute',
              width: '100%',
            }}>
            {supportFingerprint && (
              <TouchableOpacity onPress={authenticateWithBiometrics}>
                <MaterialIcons name="fingerprint" size={70} color="black" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          ''
        )}
      </View>
    );
  }