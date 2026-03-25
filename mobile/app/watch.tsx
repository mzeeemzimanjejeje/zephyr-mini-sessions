import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Dimensions, Platform
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchImdbId, EMBED_SOURCES } from "../../src/lib/cineverse";

const RED = "#E50914";
const { width: W } = Dimensions.get("window");

export default function WatchScreen() {
  const { title, type, year } = useLocalSearchParams<{
    title: string; type: "Movie" | "Series"; year: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [imdbId, setImdbId] = useState<string | null>(null);
  const [sourceIdx, setSourceIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const contentType = type ?? "Movie";
  const mediaType = contentType === "Movie" ? "movie" : "tv";
  const isSeries = contentType === "Series";

  useEffect(() => {
    setImdbId(null);
    setSourceIdx(0);
    setLoading(true);
    const yearNum = year ? parseInt(year) || undefined : undefined;
    fetchImdbId(title ?? "", yearNum).then(setImdbId);
  }, [title, year]);

  const embedUrl = imdbId
    ? EMBED_SOURCES[sourceIdx]?.(mediaType, imdbId, season, episode) ?? ""
    : "";

  const nextSource = () => {
    if (sourceIdx + 1 < EMBED_SOURCES.length) {
      setSourceIdx((i) => i + 1);
      setLoading(true);
    }
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.root}>
      {/* Player */}
      <View style={styles.player}>
        {imdbId === null ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={RED} />
            <Text style={styles.hint}>Finding content…</Text>
          </View>
        ) : (
          <>
            {loading && (
              <View style={[styles.center, StyleSheet.absoluteFill]}>
                <ActivityIndicator size="large" color={RED} />
                <Text style={styles.hint}>Player {sourceIdx + 1}/{EMBED_SOURCES.length}</Text>
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
                const url = req.url;
                if (!url.startsWith("http")) return false;
                const ads = ["popads", "adserv", "ads.php", "click.", "doubleclick", "googlesyndication"];
                return !ads.some((a) => url.includes(a));
              }}
            />
          </>
        )}
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, { top: topInset }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
        <TouchableOpacity
          onPress={nextSource}
          style={[styles.iconBtn, sourceIdx + 1 >= EMBED_SOURCES.length && { opacity: 0.3 }]}
          disabled={sourceIdx + 1 >= EMBED_SOURCES.length}
        >
          <Ionicons name="refresh" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: bottomInset + 6 }]}>
        <Text style={styles.sourcePill}>Player {sourceIdx + 1}/{EMBED_SOURCES.length}</Text>

        {isSeries && (
          <View style={styles.epRow}>
            <TouchableOpacity
              style={styles.epBtn}
              onPress={() => { if (episode > 1) { setEpisode((e) => e - 1); setLoading(true); } else if (season > 1) { setSeason((s) => s - 1); setEpisode(1); setLoading(true); } }}
            >
              <Ionicons name="play-skip-back" size={14} color="#aaa" />
            </TouchableOpacity>
            <Text style={styles.epLabel}>S{season} · E{episode}</Text>
            <TouchableOpacity style={styles.epBtn} onPress={() => { setEpisode((e) => e + 1); setLoading(true); }}>
              <Ionicons name="play-skip-forward" size={14} color="#aaa" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.epBtn, { marginLeft: 6 }]} onPress={() => { setSeason((s) => s + 1); setEpisode(1); setLoading(true); }}>
              <Text style={styles.epBtnText}>S{season + 1} →</Text>
            </TouchableOpacity>
          </View>
        )}

        {sourceIdx + 1 < EMBED_SOURCES.length && (
          <TouchableOpacity style={styles.nextBtn} onPress={nextSource}>
            <Ionicons name="refresh" size={12} color="#888" />
            <Text style={styles.nextBtnText}>Next Player</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  player: { flex: 1 },
  webview: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000", gap: 10 },
  hint: { color: "#555", fontFamily: "Inter_400Regular", fontSize: 13 },
  topBar: {
    position: "absolute", left: 0, right: 0,
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  bottomBar: {
    backgroundColor: "rgba(10,10,10,0.95)", paddingTop: 10, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap",
    borderTopWidth: 1, borderTopColor: "#1a1a1a",
  },
  sourcePill: { color: "#444", fontFamily: "Inter_500Medium", fontSize: 11 },
  epRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  epBtn: { backgroundColor: "#1f1f1f", padding: 7, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  epLabel: { color: "#ccc", fontFamily: "Inter_600SemiBold", fontSize: 13, minWidth: 58, textAlign: "center" },
  epBtnText: { color: "#aaa", fontFamily: "Inter_600SemiBold", fontSize: 11 },
  nextBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#1f1f1f", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginLeft: "auto" },
  nextBtnText: { color: "#888", fontFamily: "Inter_500Medium", fontSize: 11 },
});
