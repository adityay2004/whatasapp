import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { Colors } from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';
import firestore from '@react-native-firebase/firestore';

const ChatBody = ({ chatId, userId }) => {
  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(snapShot => {
        const allMessages = snapShot.docs.map(snap => {
          return snap.data();
        });
        setMessages(allMessages);
      });
  }, []);

  const UserMessageView = ({ message, time }) => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userInnerContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.time}>{time}</Text>
          <VectorIcon
            name="check-double"
            type="FontAwesome5"
            color={Colors.blue}
            size={12}
            style={styles.doubleCheck}
          />
        </View>
      </View>
    );
  };

  const UserImageView = ({ image, time }) => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userInnerContainerimage}>
          <Image source={{ uri: image }} style={{ height: 130, width: 100 }} />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text style={styles.time}>{time}</Text>
            <VectorIcon
              name="check-double"
              type="FontAwesome5"
              color={Colors.blue}
              size={12}
              style={styles.doubleCheck}
            />
          </View>

        </View>
      </View>
    );
  };

  const OtherUserImageView = ({ image, time }) => {
    return (
      <View style={styles.otherUserContainer}>
        <View style={styles.otherUserImageContainer}>
          <Image source={{ uri: image }} style={{ height: 130, width: 100 }} />
          <Text style={styles.time1}>{time}</Text>
        </View>
      </View>
    );
  };

  const OtherUserMessageView = ({ message, time }) => {
    return (
      <View style={styles.otherUserContainer}>
        <View style={styles.otherUserInnerContainer}>
          <Text style={styles.message1}>{message}</Text>
          <Text style={styles.time1}>{time}</Text>
        </View>
      </View>
    );
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}>
        {messages.map(item => (
          <>
            {item.image ? (
              <>
                {item.sender === userId ? (
                  <UserImageView
                    image={item.image}
                    time={new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      //second: "2-digit",
                    }).format(item.timestamp?.toDate())}
                    // time={item.timestamp?.toDate().toDateString()}
                  />
                ) : (
                  <OtherUserImageView
                    image={item.image}
                    time={new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    //  second: "2-digit",
                    }).format(item.timestamp?.toDate())}
                    // time={item.timestamp?.toDate().toDateString()}
                  />
                )}
              </>
            ) : (
              <>
                {item.sender === userId ? (
                  <UserMessageView
                    message={item.body}
                    time={new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                     // second: "2-digit",
                    }).format(item.timestamp?.toDate())}
                    // time={item.timestamp?.toDate().toDateString()}
                  />
                ) : (
                  <OtherUserMessageView
                    message={item.body}
                    time={new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      //second: "2-digit",
                    }).format(item.timestamp?.toDate())}
                    // time={item.timestamp?.toDate().toDateString()}
                  />
                )}
              </>

            )}

          </>

        ))}
      </ScrollView>
      <View style={styles.scrollIcon}>
        <View style={styles.scrollDownArrow}>
          <VectorIcon
            name="angle-dobule-down"
            type="Fontisto"
            size={12}
            color={Colors.white}
            onPress={scrollToBottom}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  otherUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  userInnerContainer: {
    backgroundColor: Colors.chatboxcolor1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userInnerContainerimage: {
    backgroundColor: Colors.chatboxcolor1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'flex-end',
  },
  message: {
    fontSize: 13,
    color: Colors.white,
  },
  time: {
    fontSize: 9,
    color: Colors.white,
    marginLeft: 5,
  },
  message1: {
    fontSize: 13,
    color: Colors.black1,
  },
  time1: {
    fontSize: 9,
    color: Colors.black1,
    marginLeft: 5,
  },
  doubleCheck: {
    marginLeft: 5,
  },
  otherUserInnerContainer: {
    backgroundColor: Colors.chatboxcolor2,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  otherUserImageContainer: {
    backgroundColor: Colors.chatboxcolor2,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'flex-end',
  },
  scrollDownArrow: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 50,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ChatBody;
