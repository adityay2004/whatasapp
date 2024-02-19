import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import ChatList from '../components/ChatList';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theme/Colors';
import {useNavigation} from '@react-navigation/native';
import {getDeviceId} from '../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatListScreen = () => {

  const navigation = useNavigation();

  const [userId, setUserId] = useState();
  const uniqueId="55080acf224c5360"

  useEffect(() => {
    const TryAuth = async () => {
        const userData = await AsyncStorage.getItem("UserData");
        console.log("Login time Data", userData)
        console.log(userData)
        if (userData != null) {
            const asyncData = JSON.parse(userData);
            setUserId(asyncData.userId)
        }
        else {
            navigation.navigate("Auth");
            return;
        }
    };
    TryAuth();
}, [userId]);

  // useEffect(() => {
  //   getDeviceId().then(id =>
  //     setUserId(id)

  //     //  setUserId(uniqueId)
       
  //      );
  // }, []);

  const onNavigate = () => {
    navigation.navigate('ContactScreen', {
      userId: userId,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChatList userId={userId} />
      </ScrollView>
      <TouchableOpacity style={styles.contactIcon} onPress={onNavigate}>
        <VectorIcon
          name="message-reply-text"
          type="MaterialCommunityIcons"
          size={22}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.background,
    flex: 1,
  },
  contactIcon: {
    backgroundColor: Colors.primaryColor,
    height: 50,
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default ChatListScreen;
