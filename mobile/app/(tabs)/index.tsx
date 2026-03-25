import { useQuery } from "@tanstack/react-query";
import {
  View, Text, ScrollView, FlatList, Image,
  TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Platform
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchCineverseHomepage,
  cineverseItemToContentItem,
  CineverseItem,
} from "../../../src/lib/cineverse";

const { width: W } = Dimensions.get("window");
const RED = "#E50914";

function StarRating({ value }: { value?: number }) {
  if (!value) return null;
  return (
    <View style={styles.star}>
      <Ionicons name="star" size={10} color="#FFD700" />
      <Text style={styles.starText}>{value.toFixed(1)}</Text>
    </View>
  );
}

function MovieCard({ item }: { item: ReturnType<typeof cineverseItemToContentItem> }) {
  const router = useRouter();
  const CARD_W = (W - 48) / 3;
  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_W }]}
      activeOpacity={0.75}
      onPress={() =>
        router.push({
          pathname: "/watch",
          params: { title: item.title, type: item.type, year: String(item.year), image: item.image },
        })
      }
    >
      <Image source={{ uri: item.image }} style={[styles.cardImg, { height: CARD_W * 1.45 }]} resizeMode="cover" />
      <View style={styles.cardOverlay}><StarRating value={item.rating} /></View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      {item.year ? <Text style={styles.cardMeta}>{item.year}</Text> : null}
    </TouchableOpacity>
  );
}

function HeroBanner({ item }: { item: CineverseItem }) {
  const router = useRouter();
  const mapped = cineverseItemToContentItem(item);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/watch",
          params: { title: mapped.title, type: mapped.type, year: String(mapped.year), image: mapped.image },
        })
      }
    >
      <Image source={{ uri: mapped.image }} style={styles.heroImg} resizeMode="cover" />
      <View style={styles.heroGrad} />
      <View style={styles.heroInfo}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{mapped.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.heroTitle}>{mapped.title}</Text>
        <View style={styles.heroMeta}>
          {mapped.year ? <Text style={styles.heroMetaText}>{mapped.year}</Text> : null}
          {mapped.genres[0] ? <Text style={styles.heroMetaText}>{mapped.genres[0]}</Text> : null}
        </View>
        <View style={styles.playBtn}>
          <Ionicons name="play" size={14} color="#fff" />
          <Text style={styles.playBtnText}>Watch Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ContentRow({ title, items }: { title: string; items: CineverseItem[] }) {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(i) => i.subjectId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        renderItem={({ item }) => {
          const mapped = cineverseItemToContentItem(item);
          return (
            <TouchableOpacity
              style={styles.rowCard}
              activeOpacity={0.75}
              onPress={() =>
                router.push({
                  pathname: "/watch",
                  params: { title: mapped.title, type: mapped.type, year: String(mapped.year), image: mapped.image },
                })
              }
            >
              <Image source={{ uri: mapped.image }} style={styles.rowImg} resizeMode="cover" />
              <Text style={styles.rowTitle} numberOfLines={1}>{mapped.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default function HomeScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: fetchCineverseHomepage,
  });

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={RED} /></View>;
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Ionicons name="wifi-outline" size={48} color="#333" />
        <Text style={styles.errorText}>Could not load content</Text>
      </View>
    );
  }

  const hero = data.bannerItems[0]?.subject;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      {hero && <HeroBanner item={hero} />}
      {data.sections.map((sec) => (
        <ContentRow key={sec.title + sec.position} title={sec.title} items={sec.subjects} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", gap: 12 },
  heroImg: { width: W, height: Math.min(W * 1.2, 480) },
  heroGrad: { position: "absolute", bottom: 0, left: 0, right: 0, height: 260, backgroundColor: "transparent" },
  heroInfo: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 28 },
  heroBadge: { backgroundColor: RED, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 8 },
  heroBadgeText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 1 },
  heroTitle: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 26, marginBottom: 6 },
  heroMeta: { flexDirection: "row", gap: 12, marginBottom: 14 },
  heroMetaText: { color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", fontSize: 13 },
  playBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: RED, alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  playBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  section: { marginTop: 24 },
  sectionTitle: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 16, marginBottom: 12, paddingHorizontal: 16 },
  rowCard: { width: 110 },
  rowImg: { width: 110, height: 160, borderRadius: 6, backgroundColor: "#1c1c1c" },
  rowTitle: { color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", fontSize: 11, marginTop: 5 },
  card: { marginHorizontal: 4, marginBottom: 12 },
  cardImg: { width: "100%", borderRadius: 6, backgroundColor: "#1c1c1c" },
  cardOverlay: { position: "absolute", top: 6, left: 6 },
  cardTitle: { color: "#e0e0e0", fontFamily: "Inter_500Medium", fontSize: 11, lineHeight: 15, marginTop: 5 },
  cardMeta: { color: "#666", fontFamily: "Inter_400Regular", fontSize: 10, marginTop: 2 },
  star: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  starText: { color: "#FFD700", fontFamily: "Inter_600SemiBold", fontSize: 10 },
  errorText: { color: "#555", fontFamily: "Inter_400Regular", fontSize: 14 },
});
