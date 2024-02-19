import { View, Text, TextInput, StyleSheet, Alert, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { Colors } from '../theme/Colors';
import firestore from '@react-native-firebase/firestore';
import Wallpaper from '../assets/wallpaper.jpeg';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';

const ChatFooter = ({ userId, chatRef }) => {
  const [message, setMessage] = useState('');
  const [sendEnable, setSendEnable] = useState(false);

  const onChange = value => {
    setMessage(value);
    setSendEnable(false);
    if (value.length > 0)
      setSendEnable(true);

  };

  const onSend = () => {
    chatRef.collection('messages').add({
      body: message,
      sender: userId,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    setMessage('');
    setSendEnable(false);
  };
  const onSendAttachment = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      });
      console.log(res);
      const imageUri = res[0].fileCopyUri;
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri = imageUri;
      const task = storage().ref(filename).putFile(uploadUri);
      try {
        await task;
      } catch (e) {
        console.error(e);
      }

      const url = await storage().ref(filename).getDownloadURL();
      console.log(url);
      chatRef.collection('messages').add({
        body: message,
        sender: userId,
        image: url,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });


    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log(err);
      }
    }
  };
  return (

    <ImageBackground source={Wallpaper} style={styles.container} >
      <View style={styles.leftContainer}>
        <View style={styles.row}>
          <VectorIcon
            type="MaterialIcons"
            name="emoji-emotions"
            size={24}
            color={Colors.white}
          />
          <TextInput
            placeholder="Message"
            placeholderTextColor={Colors.textGrey}
            onChangeText={value => onChange(value)}
            style={styles.inputStyle}
            value={message}
          />
        </View>
        <View style={styles.row}>
          <VectorIcon
            type="Entypo"
            name="attachment"
            size={18}
            color={Colors.white}
            onPress={onSendAttachment}
          />
          {!sendEnable && (
            <>
              <VectorIcon
                type="FontAwesome"
                name="rupee"
                size={20}
                color={Colors.white}
                style={styles.iconStyle}
              />
              <VectorIcon
                type="FontAwesome"
                name="camera"
                size={18}
                color={Colors.white}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.rightContainer}>
        {sendEnable ? (
          <VectorIcon
            type="MaterialCommunityIcons"
            name="send"
            size={25}
            color={Colors.white}
            onPress={onSend}
          />
        ) : (
          <VectorIcon
            type="MaterialCommunityIcons"
            name="microphone"
            size={25}
            color={Colors.white}
          />
        )}

      </View>

    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    width: '85%',
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconStyle: {
    marginHorizontal: 25,
  },
  rightContainer: {
    backgroundColor: Colors.teal,
    padding: 10,
    borderRadius: 50,
  },
  inputStyle: {
    fontSize: 17,
    color: Colors.white,
    marginLeft: 5,
  },
});

export default ChatFooter;
