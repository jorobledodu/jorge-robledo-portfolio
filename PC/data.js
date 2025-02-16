const games = [
  {
    title: "Pixel Dungeon Quest",
    description: "A roguelike dungeon crawler with pixel art graphics. Fight monsters, collect loot, and survive increasingly difficult levels in this challenging adventure.",
    imageUrl: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e",
    link: "#",
    technologies: ["Unity", "C#", "Pixel Art"],
    year: 2023,
    status: "released"
  },
  {
    title: "Space Traders",
    description: "An interstellar trading simulation where players manage their fleet, trade resources between planets, and build their space empire.",
    imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5",
    link: "#",
    technologies: ["Unreal Engine", "C++", "3D Modeling"],
    year: 2023,
    status: "inDevelopment"
  },
  {
    title: "Ninja Platformer",
    description: "A fast-paced 2D platformer where you play as a ninja, using wall jumps, double jumps, and special abilities to navigate challenging levels.",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477",
    link: "#",
    technologies: ["Godot", "GDScript", "2D Animation"],
    year: 2022,
    status: "released"
  },
  {
    title: "Chess Master AI",
    description: "A modern chess game with an advanced AI opponent that adapts to your playing style. Features multiple difficulty levels and online multiplayer.",
    imageUrl: "https://images.unsplash.com/photo-1560174038-da43ac74f01b",
    link: "#",
    technologies: ["React", "TypeScript", "AI/ML"],
    year: 2023,
    status: "beta"
  }
];

const menuStructure = [
  {
    name: 'games',
    type: 'directory',
    children: games.map(game => ({
      name: game.title,
      type: 'game',
      game
    }))
  },
  {
    name: 'projects',
    type: 'directory',
    children: []
  },
  {
    name: 'about.txt',
    type: 'file'
  }
];