export interface ContentItem {
  id: number;
  title: string;
  type: 'Movie' | 'Series';
  image: string;
  rating?: number;
  votes?: string;
  year: number;
  country: string;
  genres: string[];
}

export const trending: ContentItem[] = [
  { id: 1, title: "The Night Agent", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/18/b9bffdc2304fc634195192d7464a6d44.jpg", rating: 7.4, votes: "157K", year: 2023, country: "United States", genres: ["Action", "Drama", "Thriller"] },
  { id: 2, title: "Wolf King", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/c21f4cf384f79e64b5e05631da964e90.jpg", rating: 6.5, year: 2025, country: "United Kingdom", genres: ["Animation", "Adventure"] },
  { id: 3, title: "Rebel Ridge", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/893748c5358e54c27af8b762573fbc01.jpg", rating: 6.8, year: 2024, country: "United States", genres: ["Action", "Crime"] },
  { id: 4, title: "The Perfect Couple", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/bacba95a201fc9f62cbec2dcdcef8134.jpg", rating: 6.5, year: 2024, country: "United States", genres: ["Crime", "Drama"] },
  { id: 5, title: "Our Universe", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/409c3a7c16f3b4ba8f1d594a7854e35e.jpg", rating: 7.2, year: 2026, country: "Korea", genres: ["Comedy", "Drama"] },
  { id: 6, title: "Knuckles", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/05/ca6b60c4a227b59b8c6627e0fffcaa13.jpg", rating: 6.1, year: 2024, country: "United States", genres: ["Action", "Adventure"] },
  { id: 7, title: "Barbie Dreamhouse Adventures", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/e9cc02b0c4ae7899fc5a4ba1d928c486.jpg", rating: 6.7, year: 2018, country: "United States", genres: ["Animation", "Comedy"] },
  { id: 8, title: "Predator: Badlands", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/da4b5b75a164d5d596e5ac8e98cf23c0.jpg", rating: 7.3, year: 2025, country: "United States", genres: ["Action", "Adventure"] },
  { id: 9, title: "Who Rules the World", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2025/09/22/e5bf0ca825eebff1514bee2a77c6e9d4.jpeg", rating: 8.2, year: 2022, country: "China", genres: ["Action", "Drama"] },
  { id: 10, title: "Mushoku Tensei: Jobless Reincarnation", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/023dd82e001b16bf87f06566a513249a.jpg", rating: 8.2, year: 2022, country: "Japan", genres: ["Anime", "Action"] },
  { id: 11, title: "The Accountant 2", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/3bde3f76f0d7a5b28acbcf6a2cb3de9c.jpg", rating: 6.6, year: 2025, country: "United States", genres: ["Action", "Crime"] },
  { id: 12, title: "The Escape of the Seven", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/b7b6303b36b1a969a27896cc275bb3f0.jpg", rating: 6.2, year: 2023, country: "Korea", genres: ["Drama", "Mystery"] },
  { id: 13, title: "Deadpool & Wolverine", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/6e191b172a67548f44c5989770124217.jpg", rating: 7.5, year: 2024, country: "United States", genres: ["Action", "Adventure"] },
  { id: 14, title: "Ghost Doctor", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/df9b1393a603fa172810d1fa7154cc04.jpg", rating: 7.9, year: 2024, country: "Korea", genres: ["Comedy", "Fantasy"] },
  { id: 15, title: "The Gorge", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/7b75327840946461280d017d4d187bfc.jpg", rating: 6.7, year: 2025, country: "United Kingdom", genres: ["Action", "Adventure"] },
  { id: 16, title: "Shadow Force", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/87f17c92f1a8d0b3044dcec34ffa7077.jpg", rating: 4.7, year: 2025, country: "United States", genres: ["Action", "Drama"] },
  { id: 17, title: "Canary Black", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/03/22/9d63b459abe61ed0abb560586f77a811-s.jpg", rating: 5.4, year: 2024, country: "United Kingdom", genres: ["Action", "Drama"] },
  { id: 18, title: "Last Prisoner", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2025/05/21/5af386e3b43f3e0426285c3d17165659.jpeg", rating: 6.5, year: 2025, country: "United States", genres: ["Drama"] },
];

export const hotAndPopular: ContentItem[] = [
  { id: 101, title: "War Machine", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/02/05/d5be2dae572c023092eae5a207458296.jpg", rating: 6.5, year: 2026, country: "United Kingdom", genres: ["Action", "Sci-Fi"] },
  { id: 102, title: "Scream 7", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/03/22/d0e6cc369e3db4705f56ec508dad216b.jpg", rating: 5.7, year: 2026, country: "United States", genres: ["Horror", "Mystery"] },
  { id: 103, title: "The Bluff", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/01/31/e149dd18ab2d5db830ae96f59f0a41bf.jpg", rating: 7.1, year: 2026, country: "United States", genres: ["Action", "Adventure"] },
  { id: 104, title: "Shelter", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/02/26/cb7fbc0c72d901935139a6ddb0e936a5.jpg", rating: 6.3, year: 2026, country: "United Kingdom", genres: ["Action", "Thriller"] },
  { id: 105, title: "Cold Storage", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/02/26/0af39e05535ac45025f56427b411c4de.jpg", rating: 6.4, year: 2026, country: "United States", genres: ["Comedy", "Horror"] },
  { id: 106, title: "MONICA", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/03/07/ca6c8de0a414257c84c0d552f7e9d608.jpg", year: 2026, country: "Nigeria", genres: ["Drama"] },
  { id: 107, title: "HEAVEN MUST WAIT", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/03/09/b9b45c51af667f7ed214fa90ae0483e0.jpg", year: 2026, country: "Nigeria", genres: ["Drama"] },
  { id: 108, title: "Good Luck, Have Fun, Don't Die", type: "Movie", image: "https://pbcdnw.aoneroom.com/image/2026/02/06/53693f433662244101a4df4c4d38278a.jpg", rating: 7.3, year: 2026, country: "Germany", genres: ["Action", "Adventure"] },
  { id: 109, title: "Beauty in Black", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/22/005f24402a3eb1a4c715867c73a6f24e.jpg", rating: 5.8, year: 2024, country: "United States", genres: ["Drama"] },
  { id: 110, title: "Fatal Seduction", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/02/28/150f3e6018cb0cda3daed413d7193e61.jpg", rating: 5.0, year: 2023, country: "South Africa", genres: ["Crime", "Drama"] },
  { id: 111, title: "One Piece", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/34ae35dac2710074be44f06842b8ac86.jpg", rating: 8.3, year: 2023, country: "United Kingdom", genres: ["Action", "Adventure"] },
  { id: 112, title: "Game of Thrones", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/4d78066a556fd124f810aebdeaba98f3.jpg", rating: 9.2, year: 2011, country: "United States", genres: ["Action", "Adventure"] },
  { id: 113, title: "Teen Wolf", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/8c2361ea97cd52332b9540a731ee26d3.jpg", rating: 7.7, year: 2011, country: "United States", genres: ["Action", "Drama"] },
  { id: 114, title: "Pursuit of Jade", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2025/11/03/ff95becc8a6c133a67f99dce1b7886e3.jpg", rating: 6.8, year: 2026, country: "China", genres: ["Drama", "Romance"] },
  { id: 115, title: "Prison Break", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/cfed5f62c5b9d25558785fa2b6f099d2.jpg", rating: 8.3, year: 2005, country: "United States", genres: ["Action", "Crime"] },
  { id: 116, title: "Sistas", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/00039a0dc9ee53a96d824e487ddceed5.jpg", rating: 5.7, year: 2019, country: "United States", genres: ["Comedy", "Drama"] },
  { id: 117, title: "The Vampire Diaries", type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/cc2e447b636be4a800cedbaccc21b7dc.jpg", rating: 7.7, year: 2009, country: "United States", genres: ["Drama", "Fantasy"] },
];

export const movies: ContentItem[] = trending.filter(c => c.type === "Movie").concat(
  hotAndPopular.filter(c => c.type === "Movie")
);

export const series: ContentItem[] = trending.filter(c => c.type === "Series").concat(
  hotAndPopular.filter(c => c.type === "Series")
);

export const allContent: ContentItem[] = [...trending, ...hotAndPopular];

export const genres = ["Action", "Comedy", "Sci-Fi", "Horror", "Romance", "Thriller", "Drama", "Adventure", "Crime", "Fantasy", "Mystery", "Anime", "Animation", "Sci-Fi"];

export const hero = trending[0];
