import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { getImage } from '../utils/helper';

const ChatList = ({ userId }) => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);
  console.log(userId)
  useEffect(() => {
    getChatList()
      .then(chatData => {
        console.log("==>", chatData)
        setChatList(chatData);
      })
      .catch(error => {
        console.log('error :', error);
      });
  }, [userId]);

  const getChatList = async () => {
    const userRef = firestore().collection('users').doc(userId);

    console.log(userRef)
    const allChatDoc = await firestore()
      .collection('chats')
      .where('participants', 'array-contains', userRef)
      .get();

    const chatData = await Promise.all(
      allChatDoc.docs.map(async chatDoc => {
        // Get User data from user data with reference of chats
        const data = chatDoc.data();
        const participants = await Promise.all(
          data.participants
            .filter(item => {
              return item.id != userId;
            })
            .map(async user => {
              const userDoc = await user.get();
              const userData = await userDoc.data();
              const id = user?.id;
              const name = userData?.name;
              const profile = userData?.profile;
              // const profile = await getImage(userData?.profile);
              return { id, name, profile };
            }),
        );

        const chatDocRef = chatDoc.ref;
        const lastMessageDoc = await chatDocRef
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        const lastMessage = lastMessageDoc?.docs?.length
          ? lastMessageDoc.docs[0].data()
          : {};

        return {
          lastMessage,
          otherUser: participants[0],
        };
      }),
    );
    return chatData;
  };

  const onNavigate = contactId => {
    navigation.navigate('ChatScreen', {
      contactId: contactId,
      userId: userId,
    });
  };

  return (
    <>
      {chatList.map(item => (
        <View key={item.otherUser?.id}>
          <TouchableOpacity
            onPress={() => onNavigate(item.otherUser?.id)}
            style={styles.container}>
            <View style={styles.leftContainer}>
              {item.otherUser?.profile && (
                <Image
                  source={{ uri: item.otherUser?.profile }}
                  style={styles.profileImg}
                />
              )}
              <View>
                <Text style={styles.username}>{item.otherUser?.name}</Text>
                <Text style={styles.message}>{item.lastMessage.body}</Text>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <Text style={styles.timeStamp}>
                {/* {formattedTime = new Intl.DateTimeFormat("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(dateObject)} */}
                {item.lastMessage.timestamp?.toDate().toDateString()}
              </Text>
              {item.mute && (
                <VectorIcon
                  type="MaterialCommunityIcons"
                  name="volume-variant-off"
                  size={22}
                  color={Colors.textGrey}
                  style={styles.muteIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    borderRadius: 50,
    height: 40,
    width: 40,
    marginRight: 15,
  },
  container: {
    backgroundColor: Colors.background,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: Colors.textColor,
    fontSize: 15,
    fontWeight: '500'
  },
  message: {
    color: Colors.textGrey,
    fontSize: 14,
    marginTop: 5,
  },
  leftContainer: {
    flexDirection: 'row',
  },
  timeStamp: {
    color: Colors.textGrey,
    fontSize: 12,
  },
  muteIcon: {
    marginTop: 5,
    marginLeft: 20,
  },
});

export default ChatList;
