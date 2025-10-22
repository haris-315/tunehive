import { streamMusic } from "@/app/core/engine/media/load";
import { playAudio } from "@/app/core/engine/player/player";
import TuneHivePalette from "@/app/core/themes/colors";
import MyFAB from "@/components/ui/fab";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


import LinearGradient from 'react-native-linear-gradient';

import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 54) / 2; // two columns with spacing

export default function HomePage() {
    const [musicFiles, setMusicFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await streamMusic((batch) => {
                setMusicFiles((prev) => {
                    const all = [...prev, ...batch];
                    // Deduplicate by URI
                    const unique = Array.from(
                        new Map(all.map((item) => [item.uri, item])).values()
                    );
                    return unique;
                });
            });
            setLoading(false);
        })();
    }, []);

    const renderItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => playAudio(item.uri)}
                activeOpacity={0.8}
            >
                {/* Thumbnail */}
                {item.thumbnail ? (
                    <Image
                        source={{ uri: item.thumbnail }}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.thumbnailFallback}>
                        <Icon
                            name="music"
                            size={40}
                            color={TuneHivePalette.colors.accentLimeGreen}
                        />
                    </View>
                )}

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>
                        {item.title || item.filename || "Unknown Track"}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {item.artist || "Unknown Artist"}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (



        <View style={styles.bg}>
            <LinearGradient
                colors={[TuneHivePalette.colors.deepOlive, TuneHivePalette.colors.primaryDarkGreen, TuneHivePalette.colors.accentLimeGreen, TuneHivePalette.colors.primaryDarkGreen, TuneHivePalette.colors.primaryDarkGreen,]}
            />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>🎶 Your Library</Text>
            </View>

            {/* Loader */}
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator
                        size="large"
                        color={TuneHivePalette.colors.accentLimeGreen}
                    />
                    <Text style={styles.loadingText}>Scanning your music...</Text>
                </View>
            )}

            {/* Music Grid */}
            <FlatList
                data={musicFiles}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
            />

            <MyFAB></MyFAB>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 18,
        backgroundColor: TuneHivePalette.colors.primaryDarkGreen,
    },
    header: {
        marginBottom: 16,
    },
    headerText: {
        fontSize: 26,
        fontWeight: "700",
        color: TuneHivePalette.colors.secondaryOffWhite,
    },
    loader: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 80,
    },
    loadingText: {
        color: TuneHivePalette.colors.tertiaryLightGray,
        marginTop: 10,
        fontSize: 14,
    },
    list: {
        paddingBottom: 80,
    },
    row: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 14,
        backgroundColor: "#fafafa20",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    thumbnailImage: {
        width: "100%",
        height: CARD_WIDTH,
        backgroundColor: "#233a2d12",
    },
    thumbnailFallback: {
        width: "100%",
        height: CARD_WIDTH,
        backgroundColor: "#233a2d",
        justifyContent: "center",
        alignItems: "center",
    },
    info: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    title: {
        color: TuneHivePalette.colors.secondaryOffWhite,
        fontSize: 14,
        fontWeight: "600",
    },
    artist: {
        color: TuneHivePalette.colors.tertiaryLightGray,
        fontSize: 12,
        marginTop: 3,
    },
});
