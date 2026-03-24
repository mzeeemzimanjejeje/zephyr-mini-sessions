export interface CastMember {
  name: string;
  character: string;
  photo: string;
  knownFor: string[];
}

export interface TitleDetail {
  plot: string;
  director?: string;
  classification: string;
  cast: CastMember[];
}

function avatar(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1c1c1c&color=e5e5e5&size=200&bold=true&font-size=0.38`;
}

export const titleDetails: Record<number, TitleDetail> = {
  // The Night Agent
  1: {
    plot: "A low-level FBI agent working the night shift at the White House answers a call on a crisis hotline and is thrust into a conspiracy that reaches the highest levels of the US government.",
    director: "Seth Gordon",
    classification: "A high-stakes political thriller with espionage, action sequences, and a romance subplot. Fast-paced and suspenseful.",
    cast: [
      { name: "Gabriel Basso",      character: "Peter Sutherland", photo: avatar("Gabriel Basso"),     knownFor: ["The Night Agent"] },
      { name: "Luciane Buchanan",   character: "Rose Larkin",       photo: avatar("Luciane Buchanan"), knownFor: ["The Night Agent"] },
      { name: "Hong Chau",          character: "Diane Farr",        photo: avatar("Hong Chau"),        knownFor: ["The Night Agent", "The Whale", "Downsizing"] },
      { name: "Eve Harlow",         character: "Chelsea Arrington", photo: avatar("Eve Harlow"),       knownFor: ["The Night Agent", "The 100"] },
      { name: "Fola Evans-Akingbola", character: "Janet Vest",      photo: avatar("Fola Evans"),       knownFor: ["The Night Agent"] },
      { name: "D.B. Woodside",      character: "Gordon Wick",       photo: avatar("DB Woodside"),      knownFor: ["The Night Agent", "24", "Suits"] },
    ],
  },

  // Game of Thrones
  112: {
    plot: "Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for thousands of years.",
    director: "David Benioff & D.B. Weiss",
    classification: "Epic fantasy drama. Political intrigue, war, dragons, and moral complexity. One of the most ambitious TV series ever made.",
    cast: [
      { name: "Emilia Clarke",  character: "Daenerys Targaryen", photo: avatar("Emilia Clarke"),  knownFor: ["Game of Thrones", "Last Christmas", "Me Before You"] },
      { name: "Kit Harington", character: "Jon Snow",           photo: avatar("Kit Harington"), knownFor: ["Game of Thrones"] },
      { name: "Peter Dinklage", character: "Tyrion Lannister",  photo: avatar("Peter Dinklage"), knownFor: ["Game of Thrones", "Avengers: Infinity War", "Three Billboards"] },
      { name: "Lena Headey",   character: "Cersei Lannister",   photo: avatar("Lena Headey"),   knownFor: ["Game of Thrones", "300", "Dredd"] },
      { name: "Sophie Turner",  character: "Sansa Stark",        photo: avatar("Sophie Turner"),  knownFor: ["Game of Thrones", "X-Men: Apocalypse"] },
      { name: "Maisie Williams", character: "Arya Stark",        photo: avatar("Maisie Williams"), knownFor: ["Game of Thrones"] },
      { name: "Jason Momoa",   character: "Khal Drogo",          photo: avatar("Jason Momoa"),   knownFor: ["Game of Thrones", "Aquaman", "Fast X"] },
      { name: "Nikolaj Coster-Waldau", character: "Jaime Lannister", photo: avatar("Nikolaj Waldau"), knownFor: ["Game of Thrones", "Shot Caller"] },
    ],
  },

  // Prison Break
  115: {
    plot: "A structural engineer deliberately gets himself incarcerated at the same prison as his wrongfully condemned brother, with a plan to help him escape.",
    director: "Paul Scheuring",
    classification: "A gripping crime thriller packed with suspense, clever plotting, and cat-and-mouse tension. Addictive from the first episode.",
    cast: [
      { name: "Wentworth Miller",  character: "Michael Scofield",    photo: avatar("Wentworth Miller"),  knownFor: ["Prison Break", "The Flash"] },
      { name: "Dominic Purcell",   character: "Lincoln Burrows",     photo: avatar("Dominic Purcell"),   knownFor: ["Prison Break", "Legends of Tomorrow"] },
      { name: "Sarah Wayne Callies", character: "Sara Tancredi",     photo: avatar("Sarah Callies"),     knownFor: ["Prison Break", "The Walking Dead"] },
      { name: "Robert Knepper",    character: "Theodore 'T-Bag' Bagwell", photo: avatar("Robert Knepper"), knownFor: ["Prison Break", "Heroes"] },
      { name: "Amaury Nolasco",    character: "Fernando Sucre",      photo: avatar("Amaury Nolasco"),    knownFor: ["Prison Break", "Transformers"] },
      { name: "Wade Williams",     character: "Brad Bellick",        photo: avatar("Wade Williams"),     knownFor: ["Prison Break"] },
    ],
  },

  // The Vampire Diaries
  117: {
    plot: "The story of two vampire brothers obsessed with the same girl, who bears a striking resemblance to the vampire who turned them — 145 years ago.",
    director: "Kevin Williamson & Julie Plec",
    classification: "Supernatural romance drama with dark fantasy elements, love triangles, and gothic intrigue. Teen drama meets vampire lore.",
    cast: [
      { name: "Nina Dobrev",    character: "Elena Gilbert / Katherine Pierce", photo: avatar("Nina Dobrev"),    knownFor: ["The Vampire Diaries", "Flatliners", "Degrassi"] },
      { name: "Paul Wesley",    character: "Stefan Salvatore",                 photo: avatar("Paul Wesley"),    knownFor: ["The Vampire Diaries", "Tell Me a Story"] },
      { name: "Ian Somerhalder", character: "Damon Salvatore",                photo: avatar("Ian Somerhalder"), knownFor: ["The Vampire Diaries", "Lost", "V Wars"] },
      { name: "Candice King",   character: "Caroline Forbes",                  photo: avatar("Candice King"),   knownFor: ["The Vampire Diaries", "The Originals"] },
      { name: "Kat Graham",     character: "Bonnie Bennett",                   photo: avatar("Kat Graham"),     knownFor: ["The Vampire Diaries"] },
      { name: "Steven R. McQueen", character: "Jeremy Gilbert",               photo: avatar("Steven McQueen"), knownFor: ["The Vampire Diaries"] },
    ],
  },

  // Person of Interest
  118: {
    plot: "An ex-CIA operative and a mysterious billionaire work as a private vigilante team, using an all-seeing surveillance machine to prevent violent crimes before they happen.",
    director: "Jonathan Nolan",
    classification: "Sci-fi action thriller with philosophical undertones. Explores surveillance, AI, free will, and justice. Consistently brilliant writing.",
    cast: [
      { name: "Jim Caviezel",    character: "John Reese",     photo: avatar("Jim Caviezel"),    knownFor: ["Person of Interest", "The Passion of the Christ", "Count of Monte Cristo"] },
      { name: "Michael Emerson", character: "Harold Finch",   photo: avatar("Michael Emerson"), knownFor: ["Person of Interest", "Lost", "The Magnificent Seven"] },
      { name: "Taraji P. Henson", character: "Joss Carter",   photo: avatar("Taraji Henson"),   knownFor: ["Person of Interest", "Empire", "Hidden Figures", "Benjamin Button"] },
      { name: "Kevin Chapman",   character: "Lionel Fusco",   photo: avatar("Kevin Chapman"),   knownFor: ["Person of Interest"] },
      { name: "Amy Acker",       character: "Root / Shaw",    photo: avatar("Amy Acker"),       knownFor: ["Person of Interest", "Angel", "Cabin in the Woods"] },
      { name: "Sarah Shahi",     character: "Sameen Shaw",    photo: avatar("Sarah Shahi"),     knownFor: ["Person of Interest", "Sex/Life"] },
    ],
  },

  // Deadpool & Wolverine
  13: {
    plot: "Deadpool is offered a chance to join the Time Variance Authority but opts to recruit a variant Wolverine to help save his universe instead.",
    director: "Shawn Levy",
    classification: "Superhero action-comedy. Irreverent, self-aware, and packed with Marvel Easter eggs. Not suitable for kids — lots of R-rated humor and violence.",
    cast: [
      { name: "Ryan Reynolds", character: "Wade Wilson / Deadpool", photo: avatar("Ryan Reynolds"), knownFor: ["Deadpool & Wolverine", "Deadpool", "Free Guy", "The Proposal"] },
      { name: "Hugh Jackman",  character: "Logan / Wolverine",      photo: avatar("Hugh Jackman"),  knownFor: ["Deadpool & Wolverine", "Logan", "X-Men", "The Greatest Showman"] },
      { name: "Emma Corrin",   character: "Cassandra Nova",         photo: avatar("Emma Corrin"),   knownFor: ["Deadpool & Wolverine", "The Crown"] },
      { name: "Matthew Macfadyen", character: "Agent Paradox",      photo: avatar("Matthew Macfadyen"), knownFor: ["Deadpool & Wolverine", "Succession", "Pride & Prejudice"] },
      { name: "Morena Baccarin", character: "Vanessa",              photo: avatar("Morena Baccarin"), knownFor: ["Deadpool & Wolverine", "Deadpool", "Firefly"] },
    ],
  },

  // One Piece
  111: {
    plot: "A young pirate with rubber powers sets sail with a ragtag crew to find the legendary treasure 'One Piece' and become King of the Pirates.",
    director: "Marc Jobst (Lead Director)",
    classification: "Adventure action series. A live-action adaptation of the beloved anime/manga. Colorful, fun, and surprisingly faithful to the source material.",
    cast: [
      { name: "Iñaki Godoy",       character: "Monkey D. Luffy",    photo: avatar("Inaki Godoy"),      knownFor: ["One Piece", "Who Killed Sara?"] },
      { name: "Mackenyu",          character: "Roronoa Zoro",        photo: avatar("Mackenyu"),         knownFor: ["One Piece", "Rurouni Kenshin"] },
      { name: "Emily Rudd",        character: "Nami",                photo: avatar("Emily Rudd"),       knownFor: ["One Piece", "Fear Street"] },
      { name: "Jacob Romero",      character: "Usopp",               photo: avatar("Jacob Romero"),     knownFor: ["One Piece"] },
      { name: "Taz Skylar",        character: "Sanji",               photo: avatar("Taz Skylar"),       knownFor: ["One Piece"] },
      { name: "Jeff Ward",         character: "Buggy the Clown",     photo: avatar("Jeff Ward"),        knownFor: ["One Piece", "Agents of S.H.I.E.L.D."] },
    ],
  },

  // Rebel Ridge
  3: {
    plot: "A former Marine encounters systemic corruption when his bicycle is seized by local police in a small town, setting off a tense confrontation.",
    director: "Jeremy Saulnier",
    classification: "Slow-burn action thriller with social commentary on policing and civil asset forfeiture. Tense, grounded, and powerful.",
    cast: [
      { name: "Aaron Pierre",      character: "Terry Richmond",      photo: avatar("Aaron Pierre"),     knownFor: ["Rebel Ridge", "Mufasa", "The Underground Railroad"] },
      { name: "Don Johnson",       character: "Sandy Burnne",        photo: avatar("Don Johnson"),      knownFor: ["Rebel Ridge", "Miami Vice", "Nash Bridges", "Django Unchained"] },
      { name: "AnnaSophia Robb",   character: "Summer McBride",      photo: avatar("AnnaSophia Robb"),  knownFor: ["Rebel Ridge", "Charlie and the Chocolate Factory", "The Way Way Back"] },
      { name: "David Harbour",     character: "Langeleigh",          photo: avatar("David Harbour"),    knownFor: ["Rebel Ridge", "Stranger Things", "Black Widow", "Hellboy"] },
    ],
  },

  // Teen Wolf
  113: {
    plot: "A teenager is bitten by a werewolf and must balance high school life with his new supernatural powers while protecting those he loves from dark forces.",
    director: "Jeff Davis",
    classification: "Supernatural teen drama. A modern take on classic werewolf mythology mixed with high school social dynamics and romance.",
    cast: [
      { name: "Tyler Posey",       character: "Scott McCall",        photo: avatar("Tyler Posey"),      knownFor: ["Teen Wolf", "Jane the Virgin"] },
      { name: "Dylan O'Brien",     character: "Stiles Stilinski",    photo: avatar("Dylan OBrien"),     knownFor: ["Teen Wolf", "The Maze Runner", "American Assassin"] },
      { name: "Holland Roden",     character: "Lydia Martin",        photo: avatar("Holland Roden"),    knownFor: ["Teen Wolf"] },
      { name: "Crystal Reed",      character: "Allison Argent",      photo: avatar("Crystal Reed"),     knownFor: ["Teen Wolf", "Gotham"] },
      { name: "Tyler Hoechlin",    character: "Derek Hale",          photo: avatar("Tyler Hoechlin"),   knownFor: ["Teen Wolf", "Superman & Lois"] },
      { name: "Colton Haynes",     character: "Jackson Whittemore",  photo: avatar("Colton Haynes"),    knownFor: ["Teen Wolf", "Arrow"] },
    ],
  },

  // The Gorge
  15: {
    plot: "Two highly-skilled operatives are stationed on opposite sides of a massive gorge and develop a long-distance romance — until something emerges from below.",
    director: "Scott Derrickson",
    classification: "Action-horror romance. A genre blend that starts as a mystery and escalates into full sci-fi action horror. Unique and unexpected.",
    cast: [
      { name: "Miles Teller",      character: "Levi",                photo: avatar("Miles Teller"),     knownFor: ["The Gorge", "Top Gun: Maverick", "Whiplash", "Fantastic Four"] },
      { name: "Anya Taylor-Joy",   character: "Drasa",               photo: avatar("Anya Taylor-Joy"),  knownFor: ["The Gorge", "The Queen's Gambit", "Last Night in Soho", "The Menu"] },
      { name: "Sigourney Weaver",  character: "The Keeper",          photo: avatar("Sigourney Weaver"), knownFor: ["The Gorge", "Aliens", "Avatar", "Ghostbusters"] },
    ],
  },

  // Ghost Doctor
  14: {
    plot: "An arrogant top surgeon becomes a ghost after an accident and can only interact with the world through a rookie doctor who is able to see him.",
    director: "Boo Sung-chul",
    classification: "Korean romantic comedy-drama with fantasy elements. Heartwarming, funny, and touching. Perfect for fans of K-drama.",
    cast: [
      { name: "Rain",              character: "Cha Young-min",       photo: avatar("Rain"),             knownFor: ["Ghost Doctor", "Ninja Assassin", "Speed Racer"] },
      { name: "Kim Bum",           character: "Go Seung-tak",        photo: avatar("Kim Bum"),          knownFor: ["Ghost Doctor", "Boys Over Flowers"] },
      { name: "Uee",               character: "Oh Soo-jung",         photo: avatar("Uee"),              knownFor: ["Ghost Doctor", "Marriage Contract"] },
    ],
  },
};

export const genreInfo: Record<string, { icon: string; description: string; color: string }> = {
  "Action":    { icon: "⚔️", description: "High-octane sequences, fights, and adrenaline-fuelled set pieces", color: "bg-red-600/20 text-red-400 border-red-600/30" },
  "Drama":     { icon: "🎭", description: "Character-driven storytelling with emotional depth and complex narratives", color: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30" },
  "Comedy":    { icon: "😂", description: "Light-hearted humour, witty dialogue, and feel-good moments", color: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30" },
  "Thriller":  { icon: "🔪", description: "Suspense, tension, and edge-of-your-seat storytelling", color: "bg-purple-600/20 text-purple-400 border-purple-600/30" },
  "Horror":    { icon: "👻", description: "Fear-inducing, spine-chilling, and psychologically unsettling", color: "bg-gray-600/20 text-gray-400 border-gray-600/30" },
  "Sci-Fi":    { icon: "🚀", description: "Futuristic technology, space, AI, and speculative fiction", color: "bg-blue-600/20 text-blue-400 border-blue-600/30" },
  "Romance":   { icon: "❤️", description: "Love stories, relationship dynamics, and emotional connections", color: "bg-pink-600/20 text-pink-400 border-pink-600/30" },
  "Adventure": { icon: "🗺️", description: "Exploration, quests, and journeys into the unknown", color: "bg-green-600/20 text-green-400 border-green-600/30" },
  "Crime":     { icon: "🕵️", description: "Investigations, heists, and the underworld of criminal activity", color: "bg-zinc-600/20 text-zinc-400 border-zinc-600/30" },
  "Fantasy":   { icon: "🧙", description: "Magic, mythical creatures, and worlds beyond our imagination", color: "bg-violet-600/20 text-violet-400 border-violet-600/30" },
  "Mystery":   { icon: "🔮", description: "Puzzles, secrets, and the thrill of uncovering hidden truths", color: "bg-teal-600/20 text-teal-400 border-teal-600/30" },
  "Anime":     { icon: "🌸", description: "Japanese animation with rich storytelling and distinctive art style", color: "bg-rose-600/20 text-rose-400 border-rose-600/30" },
  "Animation": { icon: "🎨", description: "Animated storytelling for all ages with vibrant visuals", color: "bg-orange-600/20 text-orange-400 border-orange-600/30" },
};
