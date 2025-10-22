import { Buffer } from 'buffer';
import * as MediaLibrary from 'expo-media-library';
import { parseBlob } from 'music-metadata-browser';

global.Buffer = global.Buffer || Buffer;

/**
 * Custom enriched audio file type.
 */
export interface AudioFile {
  id: string;
  uri: string;
  filename: string;
  duration: number;
  title: string;
  artist: string;
  album: string;
  thumbnail?: string | null; // base64 album art
}

/**
 * Streams enriched audio files in batches.
 * Each batch contains full metadata and calls `onBatch` when ready.
 */
export const streamMusic = async (
  onBatch: (batch: AudioFile[]) => void
) => {
  try {
    // ✅ Check and request permissions
    let { status } = await MediaLibrary.getPermissionsAsync();
    if (status !== 'granted') {
      const permission = await MediaLibrary.requestPermissionsAsync();
      status = permission.status;
    }
    if (status !== 'granted') {
      console.error('Permission denied for audio access');
      return;
    }

    // Pagination control
    let hasNextPage = true;
    let after: string | undefined = undefined;

    while (hasNextPage) {
      // Fetch audio assets in chunks
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 30, // Adjust this for performance
        after,
      });

      // Process all items in this batch concurrently
      const enrichedBatch = await Promise.all(
        media.assets.map(async (file) => {
          try {
            const response = await fetch(file.uri);
            const blob = await response.blob();
            const metadata = await parseBlob(blob);

            const common = metadata.common || {};
            const picture = common.picture?.[0];

            let thumbnail: string | null = null;
            if (picture?.data) {
              const base64 = Buffer.from(picture.data).toString('base64');
              thumbnail = `data:${picture.format};base64,${base64}`;
            }
            // console.log(thumbnail)
            return {
              id: file.id,
              uri: file.uri,
              filename: file.filename,
              duration: metadata.format.duration ?? file.duration,
              title: common.title || file.filename,
              artist: common.artist || 'Unknown Artist',
              album: common.album || 'Unknown Album',
              thumbnail,
            } as AudioFile;
          } catch (err) {
            console.warn(`⚠️ Error reading metadata for ${file.filename}:`, err);
            return {
              id: file.id,
              uri: file.uri,
              filename: file.filename,
              duration: file.duration,
              title: file.filename,
              artist: 'Unknown Artist',
              album: 'Unknown Album',
              thumbnail: null,
            } as AudioFile;
          }
        })
      );
      // console.log(enrichedBatch)
      // ✅ Emit enriched batch
      if (enrichedBatch.length > 0) {
        onBatch(enrichedBatch);
      }

      // Move to next batch
      hasNextPage = media.hasNextPage;
      after = media.endCursor;
    }
  } catch (error) {
    console.error('Error accessing or parsing audio:', error);
  }
};
