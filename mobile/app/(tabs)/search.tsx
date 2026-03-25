import { useState, useCallback } from "react";
import {
  View, Text, TextInput, FlatList, Image,
  TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Platform
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  searchCineverse,
  cineverseItemToContentItem,
} from "../../../src/lib/cineverse";

const { width: W } = Dimensions.get("window");
const RED = "#E50914";
const CARD_W = (W - 48) / 3;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchCineverse(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });

  const items = (data?.items ?? []).map(cineverseItemToContentItem);

  const renderItem = useCallback(({ item }: { item: ReturnType<typeof cineverseItemToContentItem> }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() =>
        router.push({
          pathname: "/watch",
          params: { title: item.title, type: item.type, year: String(item.year), image: item.image },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.cardImg} resizeMode="cover" />
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{item.type === "Movie" ? "M" : "S"}</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      {item.year ? <Text style={styles.cardYear}>{item.year}</Text> : null}
    </TouchableOpacity>
  ), [router]);

  return (
    <View style={styles.root}>
      <View style={[styles.searchBar, Platform.OS === "web" ? { marginTop: 75 } : null]}>
        <Ionicons name="search" size={18} color="#666" style={{ marginLeft: 14 }} />
        <TextInput
          style={styles.input}
          placeholder="Search movies, shows..."
          placeholderTextColor="#444"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={{ marginRight: 12 }}>
            <Ionicons name="close-circle" size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {isFetching && query.length >= 2 && (
        <View style={styles.loadingRow}><ActivityIndicator size="small" color={RED} /></View>
      )}

      {!query && (
        <View style={styles.empty}>
          <Ionicons name="film-outline" size={56} color="#222" />
          <Text style={styles.emptyTitle}>Find something to watch</Text>
          <Text style={styles.emptySubtitle}>Search for movies and series</Text>
        </View>
      )}

      {query.length >= 2 && !isFetching && items.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={48} color="#222" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>Try a different title</Text>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.subjectId)}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  searchBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a",
    margin: 16, borderRadius: 12, borderWidth: 1, borderColor: "#2a2a2a",
  },
  input: { flex: 1, color: "#fff", fontFamily: "Inter_400Regular", fontSize: 15, paddingVertical: 12, paddingHorizontal: 10 },
  loadingRow: { alignItems: "center", paddingVertical: 8 },
  grid: { padding: 16, paddingTop: 4 },
  card: { flex: 1, maxWidth: CARD_W },
  cardImg: { width: "100%", aspectRatio: 2 / 3, borderRadius: 6, backgroundColor: "#1c1c1c", marginBottom: 6 },
  typeBadge: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(229,9,20,0.85)", width: 18, height: 18, borderRadius: 4, alignItems: "center", justifyContent: "center" },
  typeText: { color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold" },
  cardTitle: { color: "#ccc", fontFamily: "Inter_500Medium", fontSize: 11, lineHeight: 14 },
  cardYear: { color: "#555", fontFamily: "Inter_400Regular", fontSize: 10, marginTop: 2 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingBottom: 80 },
  emptyTitle: { color: "#444", fontFamily: "Inter_600SemiBold", fontSize: 16 },
  emptySubtitle: { color: "#333", fontFamily: "Inter_400Regular", fontSize: 13 },
});
