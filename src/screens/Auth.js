import React, { useReducer, useState, useCallback, useEffect } from "react";
import {
    View,
    Button,
    Text,
    StyleSheet,
    ToastAndroid,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Inputbox from "../components/Inputbox";
import { Colors } from "../theme/Colors";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Auth = () => {
    const [SignUp, setSignUp] = useState(false);
    const [loading, setloading] = useState(false);
    const [email, Setemail] = useState("")
    const [password, Setpassword] = useState("")
    const navigation = useNavigation();
    const [insertedid, Setinsertedid] = useState("")
    const handleSubmit = async () => {
        if (validateForm()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                setloading(true);
                let emailcheck = false;
                let action;
                if (SignUp) {
                    console.log("clicked1")
                    const res = await firestore().collection("users").where("email", "==", email).get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                emailcheck = true
                            })
                        });
                    if (!emailcheck) {
                        firestore()
                            .collection('users').add({
                                email: email,
                                password: password,
                                profilestatus: true
                            }).then((res) => {
                                const insertedId = res.id
                                Setinsertedid(insertedId)
                                console.log(insertedId)
                                setloading(false);
                                navigation.navigate('AddDetails', {
                                    userId: insertedId
                                });
                            })


                    }
                    else {
                        setloading(false);
                        Alert.alert("Error", "Account Aleady Exit.");
                    }

                } else {
                    console.log("clicked2")

                   await firestore().collection("users").where("email", "==", email).get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                           console.log(doc.id)
                          

                           AsyncStorage.removeItem("UserData")
                           AsyncStorage.setItem(
                               "UserData",
                               JSON.stringify({
                                   userId: doc.id,
                               })
                           );
                           navigation.navigate('HomeScreen', {
                               userId: doc.id
                           });

                        })
                    });

                }

                try {
                    if (SignUp) {

                    } else {
                        setloading(false);
                       // navigation.navigate("WhatsAppMain");
                    }
                } catch (e) {
                    console.log("Login Page Called", e.message)
                    setloading(false);
                }
            } else {
                Alert.alert("Error", "Please enter a valid email address.");
            }
        }
    };

    const validateForm = () => {
        let data = "";
        if (!email) data = data + "Email address is required \n";
        if (!password) data = data + "Password is required \n";
        if (data.length > 0) {
            Alert.alert("Error", data);
            return false;
        }
        else return true

    };

    return (
        <KeyboardAvoidingView behavior="position">
            <ScrollView style={styles.container}>
                <Text style={styles.Headtext}>Welcome to WhatsApp</Text>
                <Image
                    source={require("../assets/logo1.png")}
                    style={styles.image}
                />
                <Text style={styles.text}>
                    Welcome To{" "}
                    <Text >WhatsApp Clone </Text>
                    Please Sign Up Or Login Below to continue
                </Text>
                <View style={{ marginTop: 45 }}>
                    <Inputbox tittle="Email Address"
                        placeholder="abc@gmail.com" image={require('../assets/email-green.jpg')}
                        inputMode="email" secureTextEntry={false}
                        text={email} textchange={(text) => { Setemail(text) }} />
                    <Inputbox tittle="Password"
                        placeholder="****" inputMode="text"
                        image={require('../assets/key-green.jpg')}
                        secureTextEntry={true} text={password}
                        textchange={(text) => { Setpassword(text) }}></Inputbox>

                </View>
                <View style={styles.submit}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.primary} />
                    ) : (
                        <Button
                            title={SignUp ? "SignUp" : "Login"}
                            color={Colors.primaryColor}
                            style={{ marginTop: 10 }}
                            onPress={handleSubmit}
                        />
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            setSignUp(!SignUp);
                        }}
                    >
                        <Text style={styles.text}>
                            {SignUp
                                ? "Already Have an Account? Login"
                                : "Don't Have an Account? Sign Up"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    Headtext: {
        textAlign: "center",
        fontSize: 25,
        color: Colors.primaryColor,
        marginBottom: 20,
    },
    container: {
        margin: 10,
    },
    image: {
        width: 300,
        height: 300,
        alignSelf: "center",
    },
    text: {
        textAlign: "center",
        fontSize: 13,
        color: Colors.primaryColor,
        marginTop: 10,
        fontFamily: "open-sans",
    },
    submit: {
        marginHorizontal: 10,
        marginTop: 15,
    },
});

export default Auth;
