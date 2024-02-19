import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import WhatsappLogo from '../assets/whatsapp-logo.png';
import { Colors } from '../theme/Colors';
import VectorIcon from '../utils/VectorIcon';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const logOut = () => {
    AsyncStorage.removeItem("UserData")
    navigation.navigate("Auth")
  }
  return (
    <View style={styles.container}>
      <Image source={WhatsappLogo} style={styles.logoStyle} />
      <View style={styles.headerIcons}>
        <VectorIcon
          type="Feather"
          name="camera"
          color={Colors.secondaryColor}
          size={22}
        />

        <VectorIcon
          type="Ionicons"
          name="search"
          color={Colors.secondaryColor}
          size={20}
          style={styles.iconStyle}
        />

        <TouchableOpacity onPress={()=>logOut()}>
          <VectorIcon
            type="Entypo"
            name="dots-three-vertical"
            color={Colors.secondaryColor}
            size={18}
          />
        </TouchableOpacity>

      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryColor,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: Colors.primaryColor,
    marginBottom: -1
  },
  logoStyle: {
    height: 25,
    width: 110,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconStyle: {
    marginHorizontal: 25,
  },
});

export default Header;
