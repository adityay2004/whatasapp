import React, { useReducer, useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    Alert,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "react-native-image-picker";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import ImgPicker from "../components/ImagePicker";
import Inputbox from "../components/Inputbox";
import { Colors } from "../theme/Colors";
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";


const AddDetails = props => {
    const { userId } = props.route.params;
    const navigation = useNavigation();
    const [profileurl, setProfileUrl] = useState("")
    const [isModalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState();
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const [name, setname] = useState("");
    const [discription, setdiscription] = useState("");
    const [imagetext, Setimagetext] = useState("")

    useEffect(() => {

    }, []);

    const OnpressBtn = () => {
        setModalVisible(true);
    };



    const updateData = async () => {
        console.log("button click called", userId)
        try {
            firestore().collection("users").doc(userId)
                .update({
                    name: name,
                    description: discription,
                    profilestatus: false,
                    profile: profileurl
                });

            setloading(false);
            return true
        } catch (error) {
            console.log(error);
            setloading(false);
            return false
        }
    }

    const ChooseFromGallery = async () => {
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
            setProfileUrl(url)
            setImage(url)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                console.log(err);
            }

        };
        setModalVisible(false);

    };


    const dispatchUserHandler = async () => {
        setloading(true);
        seterror(null);
        const status = await updateData();
        if (status) {
            AsyncStorage.removeItem("UserData")
            AsyncStorage.setItem(
                "UserData",
                JSON.stringify({
                    userId: userId,
                })
            );
            navigation.navigate('HomeScreen', {
                userId: userId
            });
        }
    };



    return (
        <KeyboardAvoidingView behavior="position">
            <ScrollView style={styles.container}>
                <Text style={styles.Headtext}>Enter Your Details </Text>
                <Text style={[styles.text, { marginTop: 10 }]}>
                    Please fill the following information.{" "}
                    <Text >
                        This will be visible in your profile and to other users too
                    </Text>
                </Text>
                <View style={styles.textarease}>
                    <Inputbox tittle="Your Name"
                        placeholder="Aditya Yadav"
                        inputMode="text" secureTextEntry={false}
                        text={name} textchange={(text) => setname(text)} />
                    <Inputbox tittle="Description"
                        placeholder="About YourSelf"
                        inputMode="text" secureTextEntry={false}
                        text={discription} textchange={(text) => setdiscription(text)} />
                </View>
                <ImgPicker OnpressBtn={OnpressBtn} image={image} />
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.primaryColor} />
                ) : (
                    <Button
                        title={"Create My Account"}
                        color={Colors.accent}
                        style={{ marginTop: 10 }}
                        onPress={dispatchUserHandler}
                    />
                )}
            </ScrollView>
            <Modal // Modal code
                onBackdropPress={() => {
                    setModalVisible(false);
                }}
                onSwipeComplete={() => {
                    setModalVisible(false);
                }}
                swipeDirection="down"
                avoidKeyboard={true}
                isVisible={isModalVisible}
                style={styles.modal}
                animationInTiming={600}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text style={styles.Headtext}>Upload Photo</Text>
                        <Text style={styles.text}>Select Pic for your profile picture</Text>
                    </View>
                    <View>

                        <TouchableOpacity
                            style={styles.ModalButton}
                            onPress={ChooseFromGallery.bind()}
                        >
                            <Text style={styles.ModalButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.ModalButton}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.ModalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    Headtext: {
        textAlign: "center",
        fontSize: 20,
        color: Colors.primaryColor,
    },
    container: {
        margin: 15,
    },
    text: {
        textAlign: "center",
        fontSize: 13,
        color: Colors.primaryColor,
        marginBottom: 10,
        fontFamily: "open-sans",
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContainer: {
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: "center",
        width: "100%",
    },
    ModalButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: Colors.primaryColor,
        alignItems: "center",
        marginVertical: 5,
    },
    ModalButtonText: {
        fontSize: 17,
        color: "white",
    },
    textarease: {
        marginTop: 25,
        marginLeft: -10,
        marginBottom: 10
    },
});


export default AddDetails