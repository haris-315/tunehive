import { currentSound, resumeAudio } from '@/app/core/engine/player/player';
import TuneHivePalette from '@/app/core/themes/colors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {create} from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  setIsPlaying: (stat: boolean) => void;
}
export const usePlayer = create<PlayerState>(set => ({isPlaying: false, setIsPlaying: (isPlaying : any) => set({isPlaying : isPlaying})}));
const MyFAB = () => {
    const {isPlaying, setIsPlaying} = usePlayer();
    useEffect(() => {
        if (!currentSound) return;

        // Subscribe to playback status updates
        const subscription = currentSound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) return;
            setIsPlaying(status.isPlaying);
        });

        // Cleanup when unmounted or sound changes
        return () => {
            if (currentSound) currentSound.setOnPlaybackStatusUpdate(null);
        };
    }, [currentSound]);

    const handlePress = async () => {
        try {
            if (!currentSound) return;

            const status = await currentSound.getStatusAsync();

            if (status.isLoaded && status.isPlaying) {
                await currentSound.pauseAsync();
                setIsPlaying(false);
            } else {
                await resumeAudio();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error('Error toggling playback:', err);
        }
    };

    return (
        <TouchableOpacity style={styles.fab} onPress={handlePress}>
            <Icon
                name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                size={44}
                color="#fff"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 68,
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
        right: 24,
        bottom: 30,
        backgroundColor: TuneHivePalette.colors.accentLimeGreen,
        borderRadius: 34,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default MyFAB;
