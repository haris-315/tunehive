import { usePlayer } from "@/components/ui/fab";
import { Audio } from "expo-av";

// --- GLOBAL STATE ---
export let currentSound: Audio.Sound | null = null;
let isInitialized = false;

// --- INITIAL SETUP ---
export const initAudio = async () => {
    if (isInitialized) return;

    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        isInitialized = true;
        console.log("🎧 Audio mode initialized");
    } catch (err) {
        console.error("Error initializing audio mode:", err);
    }
};

// --- PLAY AUDIO ---
export const playAudio = async (uri: string): Promise<Audio.Sound | null> => {
    const setIsPlaying = usePlayer.getState().setIsPlaying;

    try {
        await initAudio();

        // Stop and unload existing sound
        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            currentSound = null;
        }

        // Create a new sound
        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true, progressUpdateIntervalMillis: 500 }
        );

        currentSound = sound;

        // Handle playback completion
        sound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) return;

            if (status.didJustFinish && !status.isLooping) {
                console.log("✅ Playback finished");
            }
        });

        setIsPlaying(true);

        return sound;
    } catch (error) {
        console.error("Error playing audio:", error);
        return null;
    }
};

// --- PAUSE AUDIO ---
export const pauseAudio = async () => {
    const setIsPlaying = usePlayer.getState().setIsPlaying;

    try {
        setIsPlaying(false);

        if (currentSound) {
            const status = await currentSound.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
                await currentSound.pauseAsync();
                console.log("⏸ Audio paused");
            }
        }
    } catch (err) {
        console.error("Error pausing audio:", err);
    }
};

// --- RESUME AUDIO ---
export const resumeAudio = async () => {
    const setIsPlaying = usePlayer.getState().setIsPlaying;

    try {
        setIsPlaying(true);

        if (currentSound) {
            const status = await currentSound.getStatusAsync();
            if (status.isLoaded && !status.isPlaying) {
                await currentSound.playAsync();
                console.log("▶️ Audio resumed");
            }
        }
    } catch (err) {
        console.error("Error resuming audio:", err);
    }
};

// --- STOP AUDIO ---
export const stopAudio = async () => {
    const setIsPlaying = usePlayer.getState().setIsPlaying;

    try {
        setIsPlaying(false);

        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            currentSound = null;
            console.log("⏹ Audio stopped");
        }
    } catch (err) {
        console.error("Error stopping audio:", err);
    }
};

// --- LOOP / REPEAT CONTROL ---
export const toggleRepeat = async (loop: boolean = false) => {
    try {
        await currentSound?.setIsLoopingAsync(loop);
        console.log(loop ? "🔁 Loop enabled" : "➡️ Loop disabled");
    } catch (err) {
        console.error("Error setting loop:", err);
    }
};

// --- SEEK CONTROL ---
export const seekTo = async (millis: number) => {
    try {
        await currentSound?.setPositionAsync(millis);
        console.log(`⏩ Seeked to ${millis / 1000}s`);
    } catch (err) {
        console.error("Error seeking:", err);
    }
};

// --- VOLUME CONTROL ---
export const setVolume = async (volume: number) => {
    try {
        if (volume < 0 || volume > 1) volume = Math.max(0, Math.min(1, volume));
        await currentSound?.setVolumeAsync(volume);
        console.log(`🔊 Volume set to ${Math.round(volume * 100)}%`);
    } catch (err) {
        console.error("Error setting volume:", err);
    }
};

// --- GET STATUS ---
export const getAudioStatus = async (): Promise<any> => {
    try {
        if (!currentSound) return null;
        return await currentSound.getStatusAsync();
    } catch (err) {
        console.error("Error fetching audio status:", err);
        return null;
    }
};

// --- CHECK IF PLAYING ---
export const isAudioPlaying = async (): Promise<boolean> => {
    try {
        const status = await getAudioStatus();
        return status?.isPlaying ?? false;
    } catch {
        return false;
    }
};
