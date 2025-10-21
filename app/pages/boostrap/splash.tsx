import TuneHivePalette from "@/app/core/themes/colors";
import React, { useEffect, useRef } from "react";
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SplashScreen({ navigation }: any) {
    const fadeAnim = useRef(new Animated.Value(0)).current;        // for slogan fade
    const imageAnim = useRef(new Animated.Value(-.5)).current;       // for image fade/scale
    const slideAnim = useRef(new Animated.Value(80)).current;      // for slogan slide
    const titleAnim = useRef(new Animated.Value(50)).current;      // title slide

    const buttonScale = useRef(new Animated.Value(0.6)).current;   // for button bounce

    useEffect(() => {
        // Parallel animation for image and slogan
        Animated.parallel([
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 4,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(titleAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start();
    }, [])

    return (
        <View style={styles.bg}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#121212"
            />

            {/* Title */}
            <Animated.View style={{ transform: [{ translateY: titleAnim }], }}>
                <View>
                    <Text style={styles.tuneHive}>TuneHive</Text>
                </View>
            </Animated.View>

            {/* Animated Headphones Image */}
            <Animated.Image
                style={[
                    styles.image,
                    {
                        opacity: imageAnim,
                        transform: [
                            {
                                scale: imageAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1],
                                }),
                            },
                        ],
                    },
                ]}
                source={require('../../../assets/splash/headphones.png')}
            />

            {/* Animated Slogan */}
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                    width: '100%',
                }}
            >
                <View style={styles.slogan}>
                    <Text style={styles.journey}>Start Your Sonic Journey</Text>
                    <Text style={styles.subhead}>
                        Dive into a world of music -- millions of songs, custom playlists, and every genre you love
                    </Text>
                </View>
            </Animated.View>

            {/* Animated Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}><View style={styles.button}>
                    <View style={styles.leading}>
                        <Icon name="fast-forward" size={16} color="white" />
                    </View>
                    <Text style={styles.buttonText}>Turn on your music</Text>
                    <View style={styles.trailing}>
                        <Svg width={30} height={30} viewBox="0 0 96 96" fill="#ffffff">
                            <Path d="M84,43.1052V42a36,36,0,0,0-72,0v1.1052A17.971,17.971,0,0,0,0,60V72A18.02,18.02,0,0,0,18,90a5.9966,5.9966,0,0,0,6-6V42a24,24,0,0,1,48,0V84a5.9966,5.9966,0,0,0,6,6A18.02,18.02,0,0,0,96,72V60A17.971,17.971,0,0,0,84,43.1052Z" />
                        </Svg>
                    </View>
                </View></TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: TuneHivePalette.colors.primaryDarkGreen,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 38,
        paddingHorizontal: 14,
    },
    tuneHive: {
        fontSize: TuneHivePalette.textStyles.heading.fontSize,
        color: TuneHivePalette.colors.accentLimeGreen,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 16,
    },
    journey: {
        fontSize: 40,
        color: TuneHivePalette.colors.secondaryOffWhite,
        textAlign: "left",
        maxWidth: 280,
        marginBottom: 8,
    },
    subhead: {
        fontSize: 14,
        color: TuneHivePalette.colors.tertiaryLightGray,
        textAlign: "left",
        maxWidth: 380,
        marginBottom: 24,
    },
    image: {
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginBottom: 24,
    },
    slogan: {
        maxWidth: 380,
        textAlign: 'left',
    },
    button: {
        width: "100%",
        backgroundColor: "#e7e7e71a",
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 6
    },
    leading: {
        width: 60,
        height: 60,
        borderRadius: 300,
        backgroundColor: TuneHivePalette.colors.accentLimeGreen,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        flex: 1,
        textAlign: 'center',
        color: "white",
        fontSize: 16,
        fontWeight: '700',
    },
    trailing: {
        width: 60,
        height: 60,
        borderRadius: 300,
        backgroundColor: "#e7e7e724",
        justifyContent: 'center',
        alignItems: 'center',
    },
});
