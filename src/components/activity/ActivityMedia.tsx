import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { cachedUri, prefetchVideo } from "@/lib/videoCache";

type Props = {
  imageUrl: string;
  videoUrl?: string | null;
  /** Play the loop — keep false for non-focused cards so only one player runs. */
  active?: boolean;
  style?: StyleProp<ViewStyle>;
  recyclingKey?: string;
};

/**
 * Activity visual: photo poster with a looping, muted animation layered on top
 * once the video is ready. Touches pass through (deck gestures stay intact).
 */
export function ActivityMedia({ imageUrl, videoUrl, active = false, style, recyclingKey }: Props) {
  const showVideo = !!videoUrl && active;
  const opacity = useSharedValue(0);
  const [ready, setReady] = useState(false);

  // prefer the on-disk copy (instant) — falls back to streaming the remote url
  const source = showVideo ? (cachedUri(videoUrl) ?? videoUrl) : null;
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  // cache this video for next time even if we had to stream it now
  useEffect(() => {
    if (showVideo) void prefetchVideo(videoUrl);
  }, [showVideo, videoUrl]);

  useEffect(() => {
    if (!showVideo) {
      setReady(false);
      opacity.value = 0;
      return;
    }
    const sub = player.addListener("statusChange", ({ status }) => {
      if (status === "readyToPlay") {
        setReady(true);
        opacity.value = withTiming(1, { duration: 220 });
      }
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVideo, player]);

  const videoStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={[style, { overflow: "hidden" }]} pointerEvents="none">
      <Image
        source={imageUrl}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={150}
        recyclingKey={recyclingKey}
      />
      {showVideo && (
        <Animated.View style={[StyleSheet.absoluteFill, videoStyle]}>
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />
        </Animated.View>
      )}
    </View>
  );
}
