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
  imdbId?: string;
}

const p = (id: string) => `https://images.metahub.space/poster/large/${id}/img`;

export const trending: ContentItem[] = [
  { id: 1,  title: "The Night Agent",               type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/18/b9bffdc2304fc634195192d7464a6d44.jpg", rating: 7.4, votes: "157K", year: 2023, country: "United States", genres: ["Action","Drama","Thriller"],   imdbId: "tt15475902" },
  { id: 2,  title: "Wolf King",                     type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/c21f4cf384f79e64b5e05631da964e90.jpg", rating: 6.5, year: 2025, country: "United Kingdom",  genres: ["Animation","Adventure"],       imdbId: "tt20917940" },
  { id: 3,  title: "Rebel Ridge",                   type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/03/23/893748c5358e54c27af8b762573fbc01.jpg", rating: 6.8, year: 2024, country: "United States", genres: ["Action","Crime"],               imdbId: "tt11816990" },
  { id: 4,  title: "The Perfect Couple",            type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/bacba95a201fc9f62cbec2dcdcef8134.jpg", rating: 6.5, year: 2024, country: "United States", genres: ["Crime","Drama"],                imdbId: "tt14688458" },
  { id: 5,  title: "Our Universe",                  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/23/409c3a7c16f3b4ba8f1d594a7854e35e.jpg", rating: 7.2, year: 2026, country: "Korea",         genres: ["Comedy","Drama"],               imdbId: "tt39453765" },
  { id: 6,  title: "Knuckles",                      type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/05/ca6b60c4a227b59b8c6627e0fffcaa13.jpg", rating: 6.1, year: 2024, country: "United States", genres: ["Action","Adventure"],           imdbId: "tt28439596" },
  { id: 7,  title: "Barbie Dreamhouse Adventures",  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/e9cc02b0c4ae7899fc5a4ba1d928c486.jpg", rating: 6.7, year: 2018, country: "United States", genres: ["Animation","Comedy"],           imdbId: "tt7529654"  },
  { id: 8,  title: "Predator: Badlands",            type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/01/26/da4b5b75a164d5d596e5ac8e98cf23c0.jpg", rating: 7.3, year: 2025, country: "United States", genres: ["Action","Adventure"],           imdbId: "tt31227572" },
  { id: 9,  title: "Who Rules the World",           type: "Series", image: "https://pbcdnw.aoneroom.com/image/2025/09/22/e5bf0ca825eebff1514bee2a77c6e9d4.jpeg",rating: 8.2, year: 2022, country: "China",         genres: ["Action","Drama"],               imdbId: "tt14950036" },
  { id: 10, title: "Mushoku Tensei",                type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/023dd82e001b16bf87f06566a513249a.jpg", rating: 8.2, year: 2022, country: "Japan",         genres: ["Anime","Action"],               imdbId: "tt12123068" },
  { id: 11, title: "The Accountant 2",              type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/01/27/3bde3f76f0d7a5b28acbcf6a2cb3de9c.jpg", rating: 6.6, year: 2025, country: "United States", genres: ["Action","Crime"],               imdbId: "tt7068946"  },
  { id: 12, title: "The Escape of the Seven",       type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/b7b6303b36b1a969a27896cc275bb3f0.jpg", rating: 6.2, year: 2023, country: "Korea",         genres: ["Drama","Mystery"],              imdbId: "tt29198828" },
  { id: 13, title: "Deadpool & Wolverine",          type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/01/27/6e191b172a67548f44c5989770124217.jpg", rating: 7.5, year: 2024, country: "United States", genres: ["Action","Adventure"],           imdbId: "tt6263850"  },
  { id: 14, title: "Ghost Doctor",                  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/df9b1393a603fa172810d1fa7154cc04.jpg", rating: 7.9, year: 2022, country: "Korea",         genres: ["Comedy","Fantasy"],             imdbId: "tt16493854" },
  { id: 15, title: "The Gorge",                     type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/01/26/7b75327840946461280d017d4d187bfc.jpg", rating: 6.7, year: 2025, country: "United Kingdom", genres: ["Action","Adventure"],           imdbId: "tt13654226" },
  { id: 16, title: "Shadow Force",                  type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/01/26/87f17c92f1a8d0b3044dcec34ffa7077.jpg", rating: 4.7, year: 2025, country: "United States", genres: ["Action","Drama"],               imdbId: "tt11092020" },
  { id: 17, title: "Canary Black",                  type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/03/22/9d63b459abe61ed0abb560586f77a811-s.jpg",rating: 5.4, year: 2024, country: "United Kingdom", genres: ["Action","Drama"],               imdbId: "tt20048582" },
  { id: 18, title: "Last Prisoner",                 type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2025/05/21/5af386e3b43f3e0426285c3d17165659.jpeg", rating: 6.5, year: 2025, country: "United States", genres: ["Drama"] },
];

export const hotAndPopular: ContentItem[] = [
  { id: 101, title: "War Machine",                      type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/02/05/d5be2dae572c023092eae5a207458296.jpg", rating: 6.5, year: 2026, country: "United Kingdom",  genres: ["Action","Sci-Fi"],                imdbId: "tt15940132" },
  { id: 102, title: "Scream 7",                         type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/03/22/d0e6cc369e3db4705f56ec508dad216b.jpg", rating: 5.7, year: 2026, country: "United States",  genres: ["Horror","Mystery"],               imdbId: "tt27047903" },
  { id: 103, title: "The Bluff",                        type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/01/31/e149dd18ab2d5db830ae96f59f0a41bf.jpg", rating: 7.1, year: 2026, country: "United States",  genres: ["Action","Adventure"],             imdbId: "tt14181714" },
  { id: 104, title: "Shelter",                          type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/02/26/cb7fbc0c72d901935139a6ddb0e936a5.jpg", rating: 6.3, year: 2026, country: "United Kingdom",  genres: ["Action","Thriller"],              imdbId: "tt32357218" },
  { id: 105, title: "Cold Storage",                     type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/02/26/0af39e05535ac45025f56427b411c4de.jpg", rating: 6.4, year: 2026, country: "United States",  genres: ["Comedy","Horror"],                imdbId: "tt8879928"  },
  { id: 106, title: "MONICA",                           type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/03/07/ca6c8de0a414257c84c0d552f7e9d608.jpg",                year: 2026, country: "Nigeria",           genres: ["Drama"] },
  { id: 107, title: "HEAVEN MUST WAIT",                 type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/03/09/b9b45c51af667f7ed214fa90ae0483e0.jpg",                year: 2026, country: "Nigeria",           genres: ["Drama"] },
  { id: 108, title: "Good Luck, Have Fun, Don't Die",   type: "Movie",  image: "https://pbcdnw.aoneroom.com/image/2026/02/06/53693f433662244101a4df4c4d38278a.jpg", rating: 7.3, year: 2026, country: "Germany",           genres: ["Action","Adventure"],             imdbId: "tt1341338"  },
  { id: 109, title: "Beauty in Black",                  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/03/22/005f24402a3eb1a4c715867c73a6f24e.jpg", rating: 5.8, year: 2024, country: "United States",  genres: ["Drama"],                          imdbId: "tt31260386" },
  { id: 110, title: "Fatal Seduction",                  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/02/28/150f3e6018cb0cda3daed413d7193e61.jpg", rating: 5.0, year: 2023, country: "South Africa",   genres: ["Crime","Drama"],                  imdbId: "tt23289882" },
  { id: 111, title: "One Piece",                        type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/34ae35dac2710074be44f06842b8ac86.jpg", rating: 8.3, year: 2023, country: "United States",  genres: ["Action","Adventure"],             imdbId: "tt11737004" },
  { id: 112, title: "Game of Thrones",                  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/4d78066a556fd124f810aebdeaba98f3.jpg", rating: 9.2, year: 2011, country: "United States",  genres: ["Action","Adventure"],             imdbId: "tt0944947"  },
  { id: 113, title: "Teen Wolf",                        type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/8c2361ea97cd52332b9540a731ee26d3.jpg", rating: 7.7, year: 2011, country: "United States",  genres: ["Action","Drama"],                 imdbId: "tt1567432"  },
  { id: 114, title: "Pursuit of Jade",                  type: "Series", image: "https://pbcdnw.aoneroom.com/image/2025/11/03/ff95becc8a6c133a67f99dce1b7886e3.jpg", rating: 6.8, year: 2026, country: "China",           genres: ["Drama","Romance"],                imdbId: "tt35316225" },
  { id: 115, title: "Prison Break",                     type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/cfed5f62c5b9d25558785fa2b6f099d2.jpg", rating: 8.3, year: 2005, country: "United States",  genres: ["Action","Crime"],                 imdbId: "tt0455275"  },
  { id: 116, title: "Sistas",                           type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/26/00039a0dc9ee53a96d824e487ddceed5.jpg", rating: 5.7, year: 2019, country: "United States",  genres: ["Comedy","Drama"],                 imdbId: "tt7764808"  },
  { id: 117, title: "The Vampire Diaries",              type: "Series", image: "https://pbcdnw.aoneroom.com/image/2026/01/27/cc2e447b636be4a800cedbaccc21b7dc.jpg", rating: 7.7, year: 2009, country: "United States",  genres: ["Drama","Fantasy"],                imdbId: "tt1405406"  },
  { id: 118, title: "Person of Interest",               type: "Series", image: p("tt1839578"),                                                                         rating: 8.4, year: 2011, country: "United States",  genres: ["Action","Crime","Sci-Fi"],        imdbId: "tt1839578"  },
];

// ── Popular Movies ────────────────────────────────────────────────────────────
export const popularMovies: ContentItem[] = [
  { id: 201, title: "Inception",                         type: "Movie",  image: p("tt1375666"),  rating: 8.8, votes: "2.6M", year: 2010, country: "United States", genres: ["Action","Sci-Fi","Thriller"],   imdbId: "tt1375666"  },
  { id: 202, title: "Interstellar",                      type: "Movie",  image: p("tt0816692"),  rating: 8.7, votes: "2.1M", year: 2014, country: "United States", genres: ["Adventure","Drama","Sci-Fi"],   imdbId: "tt0816692"  },
  { id: 203, title: "The Dark Knight",                   type: "Movie",  image: p("tt0468569"),  rating: 9.0, votes: "2.9M", year: 2008, country: "United States", genres: ["Action","Crime","Drama"],        imdbId: "tt0468569"  },
  { id: 204, title: "Oppenheimer",                       type: "Movie",  image: p("tt15398776"), rating: 8.3, votes: "900K", year: 2023, country: "United States", genres: ["Drama","History","Thriller"],    imdbId: "tt15398776" },
  { id: 205, title: "Dune: Part Two",                    type: "Movie",  image: p("tt15239678"), rating: 8.5, votes: "620K", year: 2024, country: "United States", genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt15239678" },
  { id: 206, title: "John Wick: Chapter 4",              type: "Movie",  image: p("tt10366206"), rating: 7.7, votes: "450K", year: 2023, country: "United States", genres: ["Action","Crime","Thriller"],     imdbId: "tt10366206" },
  { id: 207, title: "Top Gun: Maverick",                 type: "Movie",  image: p("tt1745960"),  rating: 8.3, votes: "660K", year: 2022, country: "United States", genres: ["Action","Drama"],                imdbId: "tt1745960"  },
  { id: 208, title: "Avatar: The Way of Water",          type: "Movie",  image: p("tt1630029"),  rating: 7.6, votes: "580K", year: 2022, country: "United States", genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt1630029"  },
  { id: 209, title: "Spider-Man: No Way Home",           type: "Movie",  image: p("tt10872600"), rating: 8.3, votes: "860K", year: 2021, country: "United States", genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt10872600" },
  { id: 210, title: "The Batman",                        type: "Movie",  image: p("tt1877830"),  rating: 7.8, votes: "790K", year: 2022, country: "United States", genres: ["Action","Crime","Drama"],        imdbId: "tt1877830"  },
  { id: 211, title: "Joker",                             type: "Movie",  image: p("tt7286456"),  rating: 8.4, votes: "1.3M", year: 2019, country: "United States", genres: ["Crime","Drama","Thriller"],      imdbId: "tt7286456"  },
  { id: 212, title: "Black Panther: Wakanda Forever",    type: "Movie",  image: p("tt9114286"),  rating: 6.7, votes: "420K", year: 2022, country: "United States", genres: ["Action","Adventure"],            imdbId: "tt9114286"  },
  { id: 213, title: "Everything Everywhere All at Once", type: "Movie",  image: p("tt6710474"),  rating: 7.8, votes: "680K", year: 2022, country: "United States", genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt6710474"  },
  { id: 214, title: "Killers of the Flower Moon",        type: "Movie",  image: p("tt5537002"),  rating: 7.6, votes: "280K", year: 2023, country: "United States", genres: ["Crime","Drama","History"],       imdbId: "tt5537002"  },
  { id: 215, title: "Poor Things",                       type: "Movie",  image: p("tt14230458"), rating: 7.8, votes: "240K", year: 2023, country: "United Kingdom",genres: ["Comedy","Drama","Sci-Fi"],       imdbId: "tt14230458" },
  { id: 216, title: "Saltburn",                          type: "Movie",  image: p("tt17351924"), rating: 7.4, votes: "310K", year: 2023, country: "United Kingdom",genres: ["Drama","Mystery","Thriller"],    imdbId: "tt17351924" },
  { id: 217, title: "Mission: Impossible – Dead Reckoning", type: "Movie", image: p("tt9603212"), rating: 7.7, votes: "310K", year: 2023, country: "United States", genres: ["Action","Adventure","Thriller"], imdbId: "tt9603212" },
  { id: 218, title: "Fast X",                            type: "Movie",  image: p("tt5433140"),  rating: 5.9, votes: "260K", year: 2023, country: "United States", genres: ["Action","Adventure"],            imdbId: "tt5433140"  },
  { id: 219, title: "Aquaman and the Lost Kingdom",      type: "Movie",  image: p("tt9663764"),  rating: 5.5, votes: "200K", year: 2023, country: "United States", genres: ["Action","Adventure"],            imdbId: "tt9663764"  },
  { id: 220, title: "The Equalizer 3",                   type: "Movie",  image: p("tt7144666"),  rating: 7.1, votes: "210K", year: 2023, country: "United States", genres: ["Action","Crime","Thriller"],     imdbId: "tt7144666"  },
  { id: 221, title: "Bullet Train",                      type: "Movie",  image: p("tt12706536"), rating: 7.3, votes: "430K", year: 2022, country: "United States", genres: ["Action","Comedy","Thriller"],    imdbId: "tt12706536" },
  { id: 222, title: "The Gray Man",                      type: "Movie",  image: p("tt1649418"),  rating: 6.5, votes: "390K", year: 2022, country: "United States", genres: ["Action","Thriller"],             imdbId: "tt1649418"  },
  { id: 223, title: "Extraction 2",                      type: "Movie",  image: p("tt14539740"), rating: 7.0, votes: "310K", year: 2023, country: "United States", genres: ["Action","Thriller"],             imdbId: "tt14539740" },
  { id: 224, title: "Wonka",                             type: "Movie",  image: p("tt6166392"),  rating: 7.0, votes: "230K", year: 2023, country: "United Kingdom",genres: ["Adventure","Comedy","Fantasy"],   imdbId: "tt6166392"  },
  { id: 225, title: "Barbie",                            type: "Movie",  image: p("tt1517268"),  rating: 6.9, votes: "640K", year: 2023, country: "United States", genres: ["Adventure","Comedy"],            imdbId: "tt1517268"  },
  { id: 226, title: "The Shawshank Redemption",          type: "Movie",  image: p("tt0111161"),  rating: 9.3, votes: "2.9M", year: 1994, country: "United States", genres: ["Drama"],                         imdbId: "tt0111161"  },
  { id: 227, title: "Forrest Gump",                      type: "Movie",  image: p("tt0109830"),  rating: 8.8, votes: "2.2M", year: 1994, country: "United States", genres: ["Drama","Romance"],               imdbId: "tt0109830"  },
  { id: 228, title: "Pulp Fiction",                      type: "Movie",  image: p("tt0110912"),  rating: 8.9, votes: "2.3M", year: 1994, country: "United States", genres: ["Crime","Drama","Thriller"],      imdbId: "tt0110912"  },
  { id: 229, title: "The Matrix",                        type: "Movie",  image: p("tt0133093"),  rating: 8.7, votes: "2.0M", year: 1999, country: "United States", genres: ["Action","Sci-Fi"],               imdbId: "tt0133093"  },
  { id: 230, title: "Goodfellas",                        type: "Movie",  image: p("tt0099685"),  rating: 8.7, votes: "1.2M", year: 1990, country: "United States", genres: ["Crime","Drama"],                 imdbId: "tt0099685"  },
  { id: 231, title: "Fight Club",                        type: "Movie",  image: p("tt0137523"),  rating: 8.8, votes: "2.3M", year: 1999, country: "United States", genres: ["Drama","Mystery","Thriller"],    imdbId: "tt0137523"  },
  { id: 232, title: "Gladiator II",                      type: "Movie",  image: p("tt9218128"),  rating: 7.1, votes: "310K", year: 2024, country: "United States", genres: ["Action","Adventure","Drama"],    imdbId: "tt9218128"  },
  { id: 233, title: "Alien: Romulus",                    type: "Movie",  image: p("tt18412256"), rating: 7.3, votes: "220K", year: 2024, country: "United States", genres: ["Horror","Sci-Fi","Thriller"],    imdbId: "tt18412256" },
  { id: 234, title: "Twisters",                          type: "Movie",  image: p("tt12584954"), rating: 7.2, votes: "195K", year: 2024, country: "United States", genres: ["Action","Adventure"],            imdbId: "tt12584954" },
  { id: 235, title: "Moana 2",                           type: "Movie",  image: p("tt11048780"), rating: 7.0, votes: "170K", year: 2024, country: "United States", genres: ["Animation","Adventure","Comedy"], imdbId: "tt11048780" },
  { id: 236, title: "Inside Out 2",                      type: "Movie",  image: p("tt22022452"), rating: 7.8, votes: "260K", year: 2024, country: "United States", genres: ["Animation","Adventure","Comedy"], imdbId: "tt22022452" },
  { id: 237, title: "Kingdom of the Planet of the Apes", type: "Movie",  image: p("tt11389872"), rating: 7.1, votes: "220K", year: 2024, country: "United States", genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt11389872" },
  { id: 238, title: "Furiosa",                           type: "Movie",  image: p("tt12037194"), rating: 7.8, votes: "230K", year: 2024, country: "Australia",     genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt12037194" },
  { id: 239, title: "Smile 2",                           type: "Movie",  image: p("tt22687790"), rating: 6.9, votes: "120K", year: 2024, country: "United States", genres: ["Horror","Mystery","Thriller"],   imdbId: "tt22687790" },
  { id: 240, title: "Longlegs",                          type: "Movie",  image: p("tt21056880"), rating: 5.9, votes: "140K", year: 2024, country: "United States", genres: ["Crime","Horror","Mystery"],       imdbId: "tt21056880" },
];

// ── Top TV Series ─────────────────────────────────────────────────────────────
export const topSeries: ContentItem[] = [
  { id: 301, title: "House of the Dragon",        type: "Series", image: p("tt11198330"), rating: 8.4, votes: "460K", year: 2022, country: "United States", genres: ["Action","Adventure","Drama"],    imdbId: "tt11198330" },
  { id: 302, title: "The Last of Us",             type: "Series", image: p("tt3581920"),  rating: 8.8, votes: "560K", year: 2023, country: "United States", genres: ["Action","Adventure","Drama"],    imdbId: "tt3581920"  },
  { id: 303, title: "Squid Game",                 type: "Series", image: p("tt10919420"), rating: 8.0, votes: "620K", year: 2021, country: "Korea",         genres: ["Action","Drama","Mystery"],      imdbId: "tt10919420" },
  { id: 304, title: "Wednesday",                  type: "Series", image: p("tt13443470"), rating: 7.4, votes: "490K", year: 2022, country: "United States", genres: ["Comedy","Mystery","Sci-Fi"],     imdbId: "tt13443470" },
  { id: 305, title: "Severance",                  type: "Series", image: p("tt11280740"), rating: 8.7, votes: "350K", year: 2022, country: "United States", genres: ["Drama","Mystery","Sci-Fi"],      imdbId: "tt11280740" },
  { id: 306, title: "The Bear",                   type: "Series", image: p("tt14452776"), rating: 8.6, votes: "280K", year: 2022, country: "United States", genres: ["Comedy","Drama"],                imdbId: "tt14452776" },
  { id: 307, title: "Yellowstone",                type: "Series", image: p("tt4236770"),  rating: 8.7, votes: "290K", year: 2018, country: "United States", genres: ["Drama"],                         imdbId: "tt4236770"  },
  { id: 308, title: "Euphoria",                   type: "Series", image: p("tt8772296"),  rating: 8.4, votes: "480K", year: 2019, country: "United States", genres: ["Drama"],                         imdbId: "tt8772296"  },
  { id: 309, title: "Succession",                 type: "Series", image: p("tt4820466"),  rating: 8.9, votes: "440K", year: 2018, country: "United States", genres: ["Drama"],                         imdbId: "tt4820466"  },
  { id: 310, title: "Peaky Blinders",             type: "Series", image: p("tt2442560"),  rating: 8.8, votes: "650K", year: 2013, country: "United Kingdom",genres: ["Crime","Drama"],                 imdbId: "tt2442560"  },
  { id: 311, title: "Breaking Bad",               type: "Series", image: p("tt0903747"),  rating: 9.5, votes: "2.1M", year: 2008, country: "United States", genres: ["Crime","Drama","Thriller"],      imdbId: "tt0903747"  },
  { id: 312, title: "Better Call Saul",           type: "Series", image: p("tt3032476"),  rating: 9.0, votes: "630K", year: 2015, country: "United States", genres: ["Crime","Drama"],                 imdbId: "tt3032476"  },
  { id: 313, title: "Dark",                       type: "Series", image: p("tt5753856"),  rating: 8.8, votes: "440K", year: 2017, country: "Germany",        genres: ["Crime","Drama","Mystery"],       imdbId: "tt5753856"  },
  { id: 314, title: "Stranger Things",            type: "Series", image: p("tt4574334"),  rating: 8.7, votes: "1.3M", year: 2016, country: "United States", genres: ["Drama","Fantasy","Horror"],      imdbId: "tt4574334"  },
  { id: 315, title: "The Boys",                   type: "Series", image: p("tt1190634"),  rating: 8.7, votes: "700K", year: 2019, country: "United States", genres: ["Action","Comedy","Crime"],       imdbId: "tt1190634"  },
  { id: 316, title: "The Mandalorian",            type: "Series", image: p("tt8111088"),  rating: 8.7, votes: "520K", year: 2019, country: "United States", genres: ["Action","Adventure","Sci-Fi"],   imdbId: "tt8111088"  },
  { id: 317, title: "Ozark",                      type: "Series", image: p("tt5071412"),  rating: 8.5, votes: "440K", year: 2017, country: "United States", genres: ["Crime","Drama","Thriller"],      imdbId: "tt5071412"  },
  { id: 318, title: "Ted Lasso",                  type: "Series", image: p("tt10986410"), rating: 8.8, votes: "310K", year: 2020, country: "United States", genres: ["Comedy","Drama"],                imdbId: "tt10986410" },
  { id: 319, title: "Outer Banks",                type: "Series", image: p("tt8688634"),  rating: 7.6, votes: "240K", year: 2020, country: "United States", genres: ["Action","Adventure","Mystery"],   imdbId: "tt8688634"  },
  { id: 320, title: "Bridgerton",                 type: "Series", image: p("tt8740790"),  rating: 7.3, votes: "210K", year: 2020, country: "United States", genres: ["Drama","Romance"],               imdbId: "tt8740790"  },
  { id: 321, title: "Emily in Paris",             type: "Series", image: p("tt8662438"),  rating: 6.9, votes: "130K", year: 2020, country: "United States", genres: ["Comedy","Drama","Romance"],      imdbId: "tt8662438"  },
  { id: 322, title: "The Rings of Power",         type: "Series", image: p("tt7631058"),  rating: 6.9, votes: "310K", year: 2022, country: "United Kingdom",genres: ["Action","Adventure","Drama"],    imdbId: "tt7631058"  },
  { id: 323, title: "Andor",                      type: "Series", image: p("tt9253284"),  rating: 8.4, votes: "240K", year: 2022, country: "United States", genres: ["Action","Adventure","Drama"],    imdbId: "tt9253284"  },
  { id: 324, title: "Cobra Kai",                  type: "Series", image: p("tt7221388"),  rating: 8.5, votes: "260K", year: 2018, country: "United States", genres: ["Action","Drama"],                imdbId: "tt7221388"  },
  { id: 325, title: "All of Us Are Dead",         type: "Series", image: p("tt10327252"), rating: 7.5, votes: "160K", year: 2022, country: "Korea",         genres: ["Action","Drama","Horror"],       imdbId: "tt10327252" },
  { id: 326, title: "1923",                       type: "Series", image: p("tt13991232"), rating: 8.6, votes: "120K", year: 2022, country: "United States", genres: ["Drama"],                         imdbId: "tt13991232" },
  { id: 327, title: "The White Lotus",            type: "Series", image: p("tt13315664"), rating: 7.9, votes: "160K", year: 2021, country: "United States", genres: ["Comedy","Drama","Mystery"],      imdbId: "tt13315664" },
  { id: 328, title: "Industry",                   type: "Series", image: p("tt10548832"), rating: 7.8, votes: "50K",  year: 2020, country: "United Kingdom",genres: ["Drama","Thriller"],              imdbId: "tt10548832" },
  { id: 329, title: "The Crown",                  type: "Series", image: p("tt4786824"),  rating: 8.7, votes: "280K", year: 2016, country: "United Kingdom",genres: ["Drama","History"],               imdbId: "tt4786824"  },
  { id: 330, title: "Slow Horses",                type: "Series", image: p("tt5875444"),  rating: 8.0, votes: "100K", year: 2022, country: "United Kingdom",genres: ["Crime","Drama","Thriller"],      imdbId: "tt5875444"  },
];

export const movies: ContentItem[] = [
  ...trending.filter(c => c.type === "Movie"),
  ...hotAndPopular.filter(c => c.type === "Movie"),
  ...popularMovies,
];

export const series: ContentItem[] = [
  ...trending.filter(c => c.type === "Series"),
  ...hotAndPopular.filter(c => c.type === "Series"),
  ...topSeries,
];

export const allContent: ContentItem[] = [
  ...trending,
  ...hotAndPopular,
  ...popularMovies,
  ...topSeries,
];

export const genres = ["Action","Comedy","Sci-Fi","Horror","Romance","Thriller","Drama","Adventure","Crime","Fantasy","Mystery","Anime","Animation","History"];

export const hero = trending[0];
