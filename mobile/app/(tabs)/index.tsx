import { useQuery } from "@tanstack/react-query";
import {
  View, Text, ScrollView, FlatList, Image,
  TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Platform
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { fetchHome, ContentItem } from "../../lib/api";

const { width: W } = Dimensions.get("window");
const RED = "#E50914";
const CARD_W = (W - 48) / 3;

function StarRating({ value }: { value: string }) {
  const num = parseFloat(value);
  if (!num) return null;
  return (
    <View style={styles.star}>
      <Ionicons name="star" size={10} color="#FFD700" />
      <Text style={styles.starText}>{num.toFixed(1)}</Text>
    </View>
  );
}

function MovieCard({ item }: { item: ContentItem }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_W }]}
      activeOpacity={0.75}
      onPress={() =>
        router.push({
          pathname: "/watch",
          params: {
            title: item.title,
            type: item.type,
            year: item.year,
            image: item.image,
          },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.cardImg} resizeMode="cover" />
      <View style={styles.cardOverlay}>
        <StarRating value={item.rating} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.year}</Text>
      </View>
    </TouchableOpacity>
  );
}

function HeroBanner({ items }: { items: ContentItem[] }) {
  const router = useRouter();
  if (!items.length) return null;
  const item = items[0];
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/watch",
          params: { title: item.title, type: item.type, year: item.year, image: item.image },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.heroImg} resizeMode="cover" />
      <View style={styles.heroOverlay} />
      <View style={styles.heroInfo}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{item.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <View style={styles.heroMeta}>
          {item.year ? <Text style={styles.heroMetaText}>{item.year}</Text> : null}
          {item.genre ? <Text style={styles.heroMetaText}>{item.genre.split(",")[0]}</Text> : null}
        </View>
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() =>
            router.push({
              pathname: "/watch",
              params: { title: item.title, type: item.type, year: item.year, image: item.image },
            })
          }
        >
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.playBtnText}>Watch Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ContentRow({ title, items }: { title: string; items: ContentItem[] }) {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(i) => String(i.subjectId)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.rowCard}
            activeOpacity={0.75}
            onPress={() =>
              router.push({
                pathname: "/watch",
                params: { title: item.title, type: item.type, year: item.year, image: item.image },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.rowImg} resizeMode="cover" />
            <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={RED} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Ionicons name="wifi-outline" size={48} color="#444" />
        <Text style={styles.errorText}>Could not load content</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroBanner items={data.banner} />
      {data.sections.map((sec) => (
        <ContentRow key={sec.title} title={sec.title} items={sec.items} />
      ))}
      {data.sections.length === 0 && data.banner.length === 0 && (
        <View style={[styles.center, { marginTop: 80 }]}>
          <Text style={styles.errorText}>No content available</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" },
  // Hero
  heroImg: { width: W, height: W * 1.2, maxHeight: 480 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: W * 1.2,
    maxHeight: 480,
    backgroundImage: undefined,
    backgroundColor: "transparent",
  },
  heroInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 28,
    background: undefined,
  },
  heroBadge: {
    backgroundColor: RED,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  heroBadgeText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1 },
  heroTitle: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 26, marginBottom: 6 },
  heroMeta: { flexDirection: "row", gap: 12, marginBottom: 14 },
  heroMetaText: { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", fontSize: 13 },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: RED,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  playBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  // Sections
  section: { marginTop: 24 },
  sectionTitle: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12, paddingHorizontal: 16 },
  rowCard: { width: 110 },
  rowImg: { width: 110, height: 160, borderRadius: 6, backgroundColor: "#1c1c1c" },
  rowTitle: { color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 5 },
  // Card grid
  card: { marginHorizontal: 4, marginBottom: 12 },
  cardImg: { width: "100%", height: CARD_W * 1.45, borderRadius: 6, backgroundColor: "#1c1c1c" },
  cardOverlay: { position: "absolute", top: 6, left: 6 },
  cardInfo: { paddingTop: 5 },
  cardTitle: { color: "#e0e0e0", fontFamily: "Inter_500Medium", fontSize: 11, lineHeight: 15 },
  cardMeta: { color: "#666", fontFamily: "Inter_400Regular", fontSize: 10, marginTop: 2 },
  star: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  starText: { color: "#FFD700", fontFamily: "Inter_600SemiBold", fontSize: 10 },
  errorText: { color: "#555", fontFamily: "Inter_400Regular", fontSize: 14, marginTop: 12 },
});
