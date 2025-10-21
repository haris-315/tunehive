import * as MediaLibrary from 'expo-media-library';

export const getMusic = async () => {
  try {
    // Check current permission status
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status !== 'granted') {
      // Request permission if not granted
      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.error('Permission denied for audio access');
        return;
      }
    }

    // Proceed with fetching audio assets
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: ['audio'], // Use array for mediaType
    });
    console.log('Audio assets:', media.assets);
  } catch (error) {
    console.error('Error accessing media:', error);
  }
};