import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../theme/Colors";

const StartUpScreen = ({ navigation }) => {

    useEffect(() => {
        const TryAuth = async () => {
            const userData = await AsyncStorage.getItem("UserData");
            console.log("Login time Data", userData)
            console.log(userData)
            if (userData != null) {
                const asynckData = JSON.parse(userData);
                 navigation.navigate('HomeScreen', {
                    userId: asynckData.userId
                });
            }
            else {
                navigation.navigate("Auth");
                return;
            }
        };
        TryAuth();
    }, []);

    return (
        <View style={styles.window}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    window: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default StartUpScreen;

