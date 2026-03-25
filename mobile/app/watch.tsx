import { useEffect, useState, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Dimensions, Platform, SafeAreaView
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchImdbId, EMBED_SOURCES } from "../lib/api";

const RED = "#E50914";
const { width: W, height: H } = Dimensions.get("window");

export default function WatchScreen() {
  const { title, type, year, image } = useLocalSearchParams<{
    title: string; type: "Movie" | "Series"; year: string; image: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [imdbId, setImdbId] = useState("");
  const [sourceIdx, setSourceIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const contentType = type ?? "Movie";
  const isSeries = contentType === "Series";

  useEffect(() => {
    setImdbId("");
    setSourceIdx(0);
    setLoading(true);
    fetchImdbId(title ?? "", year).then(setImdbId);
  }, [title, year]);

  const embedUrl = imdbId
    ? EMBED_SOURCES[sourceIdx](imdbId, contentType, season, episode)
    : "";

  const nextSource = () => {
    if (sourceIdx + 1 < EMBED_SOURCES.length) {
      setSourceIdx((i) => i + 1);
      setLoading(true);
    }
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.root}>
      {/* Player area */}
      <View style={styles.playerContainer}>
        {!imdbId ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={RED} />
            <Text style={styles.loadingText}>Finding content…</Text>
          </View>
        ) : (
          <>
            {loading && (
              <View style={[styles.center, StyleSheet.absoluteFill]}>
                <ActivityIndicator size="large" color={RED} />
                <Text style={styles.loadingText}>Loading player {sourceIdx + 1}/{EMBED_SOURCES.length}</Text>
              </View>
            )}
            <WebView
              key={`${sourceIdx}-${imdbId}-${season}-${episode}`}
              source={{ uri: embedUrl }}
              style={styles.webview}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                if (sourceIdx + 1 < EMBED_SOURCES.length) nextSource();
              }}
              onShouldStartLoadWithRequest={(req) => {
                // Block obvious ad redirects
                const url = req.url;
                if (!url.startsWith("http")) return false;
                const blocked = ["popads", "adserv", "ads.php", "click.", "track.", "doubleclick", "googlesyndication"];
                if (blocked.some((b) => url.includes(b))) return false;
                return true;
              }}
            />
          </>
        )}
      </View>

      {/* Header controls */}
      <View style={[styles.header, { top: topInset }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <TouchableOpacity onPress={nextSource} style={styles.switchBtn} disabled={sourceIdx + 1 >= EMBED_SOURCES.length}>
          <Ionicons name="refresh" size={18} color={sourceIdx + 1 < EMBED_SOURCES.length ? "#fff" : "#444"} />
        </TouchableOpacity>
      </View>

      {/* Bottom controls */}
      <View style={[styles.bottomBar, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 8 }]}>
        <Text style={styles.sourcePill}>Player {sourceIdx + 1}/{EMBED_SOURCES.length}</Text>

        {isSeries && (
          <View style={styles.episodeRow}>
            <TouchableOpacity
              style={styles.epBtn}
              onPress={() => {
                if (episode > 1) { setEpisode((e) => e - 1); setLoading(true); }
                else if (season > 1) { setSeason((s) => s - 1); setEpisode(1); setLoading(true); }
              }}
            >
              <Ionicons name="play-skip-back" size={14} color="#aaa" />
            </TouchableOpacity>

            <Text style={styles.epLabel}>S{season} · E{episode}</Text>

            <TouchableOpacity
              style={styles.epBtn}
              onPress={() => { setEpisode((e) => e + 1); setLoading(true); }}
            >
              <Ionicons name="play-skip-forward" size={14} color="#aaa" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.epBtn, { marginLeft: 8 }]}
              onPress={() => { setSeason((s) => s + 1); setEpisode(1); setLoading(true); }}
            >
              <Text style={styles.seasonBtnText}>S{season + 1}</Text>
            </TouchableOpacity>
          </View>
        )}

        {sourceIdx + 1 < EMBED_SOURCES.length && (
          <TouchableOpacity style={styles.nextPlayerBtn} onPress={nextSource}>
            <Ionicons name="refresh" size={13} color="#aaa" />
            <Text style={styles.nextPlayerText}>Next Player</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  playerContainer: { flex: 1 },
  webview: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    gap: 12,
  },
  loadingText: { color: "#555", fontFamily: "Inter_400Regular", fontSize: 13 },
  // Header
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  switchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  // Bottom
  bottomBar: {
    backgroundColor: "rgba(10,10,10,0.95)",
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  sourcePill: {
    color: "#444",
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  episodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  epBtn: {
    backgroundColor: "#1f1f1f",
    padding: 7,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  epLabel: {
    color: "#ccc",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    minWidth: 60,
    textAlign: "center",
  },
  seasonBtnText: {
    color: "#aaa",
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  nextPlayerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1f1f1f",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: "auto",
  },
  nextPlayerText: {
    color: "#888",
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
});
