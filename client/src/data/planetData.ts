export interface PlanetData {
  name: string;
  radius: number; // Visual radius for the 3D model
  distance: number; // Distance from sun for orbital positioning
  color: string;
  orbitSpeed: number; // Speed multiplier for orbital animation
  rotationSpeed: number; // Speed of planet rotation
  facts: {
    diameter: string;
    distanceFromSun: string;
    orbitalPeriod: string;
    dayLength: string;
    temperature: string;
    composition: string;
    moons: string;
    interestingFacts: string[];
  };
}

export const planetsData: PlanetData[] = [
  {
    name: "Mercury",
    radius: 0.8,
    distance: 12,
    color: "#8C7853",
    orbitSpeed: 4.15,
    rotationSpeed: 0.01,
    facts: {
      diameter: "4,879 km",
      distanceFromSun: "58 million km",
      orbitalPeriod: "88 Earth days",
      dayLength: "176 Earth days",
      temperature: "-173°C to 427°C",
      composition: "Iron core, rocky surface",
      moons: "0",
      interestingFacts: [
        "Closest planet to the Sun",
        "Has extreme temperature variations",
        "One day lasts longer than one year",
        "Has a very thin atmosphere"
      ]
    }
  },
  {
    name: "Venus",
    radius: 1.2,
    distance: 18,
    color: "#FFC649",
    orbitSpeed: 1.62,
    rotationSpeed: -0.005,
    facts: {
      diameter: "12,104 km",
      distanceFromSun: "108 million km",
      orbitalPeriod: "225 Earth days",
      dayLength: "243 Earth days",
      temperature: "462°C average",
      composition: "Carbon dioxide atmosphere, rocky surface",
      moons: "0",
      interestingFacts: [
        "Hottest planet in the solar system",
        "Rotates backwards (retrograde)",
        "Surface pressure 90x that of Earth",
        "Often called Earth's 'twin' due to similar size"
      ]
    }
  },
  {
    name: "Earth",
    radius: 1.3,
    distance: 25,
    color: "#6B93D6",
    orbitSpeed: 1.0,
    rotationSpeed: 0.02,
    facts: {
      diameter: "12,756 km",
      distanceFromSun: "150 million km",
      orbitalPeriod: "365.25 days",
      dayLength: "24 hours",
      temperature: "-89°C to 58°C",
      composition: "Nitrogen-oxygen atmosphere, water and land",
      moons: "1",
      interestingFacts: [
        "Only known planet with life",
        "71% of surface is covered by water",
        "Has a protective magnetic field",
        "The only planet not named after a Roman god"
      ]
    }
  },
  {
    name: "Mars",
    radius: 1.0,
    distance: 35,
    color: "#CD5C5C",
    orbitSpeed: 0.53,
    rotationSpeed: 0.018,
    facts: {
      diameter: "6,792 km",
      distanceFromSun: "228 million km",
      orbitalPeriod: "687 Earth days",
      dayLength: "24.6 hours",
      temperature: "-87°C to -5°C",
      composition: "Carbon dioxide atmosphere, iron oxide surface",
      moons: "2 (Phobos and Deimos)",
      interestingFacts: [
        "Known as the 'Red Planet'",
        "Has the largest volcano in the solar system (Olympus Mons)",
        "Evidence of ancient water flows",
        "Home to the largest dust storms in the solar system"
      ]
    }
  },
  {
    name: "Jupiter",
    radius: 4.0,
    distance: 55,
    color: "#D8CA9D",
    orbitSpeed: 0.084,
    rotationSpeed: 0.045,
    facts: {
      diameter: "142,984 km",
      distanceFromSun: "778 million km",
      orbitalPeriod: "12 Earth years",
      dayLength: "9.9 hours",
      temperature: "-108°C average",
      composition: "Hydrogen and helium gas giant",
      moons: "95+ (including Io, Europa, Ganymede, Callisto)",
      interestingFacts: [
        "Largest planet in the solar system",
        "Great Red Spot is a giant storm",
        "Acts as a 'cosmic vacuum cleaner'",
        "Has a faint ring system"
      ]
    }
  },
  {
    name: "Saturn",
    radius: 3.5,
    distance: 75,
    color: "#FAD5A5",
    orbitSpeed: 0.034,
    rotationSpeed: 0.038,
    facts: {
      diameter: "120,536 km",
      distanceFromSun: "1.4 billion km",
      orbitalPeriod: "29.5 Earth years",
      dayLength: "10.7 hours",
      temperature: "-139°C average",
      composition: "Hydrogen and helium gas giant",
      moons: "146+ (including Titan, Enceladus)",
      interestingFacts: [
        "Famous for its prominent ring system",
        "Less dense than water",
        "Titan has lakes of liquid methane",
        "Hexagonal storm at north pole"
      ]
    }
  },
  {
    name: "Uranus",
    radius: 2.2,
    distance: 95,
    color: "#4FD0E7",
    orbitSpeed: 0.012,
    rotationSpeed: -0.03,
    facts: {
      diameter: "51,118 km",
      distanceFromSun: "2.9 billion km",
      orbitalPeriod: "84 Earth years",
      dayLength: "17.2 hours",
      temperature: "-197°C average",
      composition: "Water, methane, and ammonia ices",
      moons: "27+ (including Miranda, Ariel)",
      interestingFacts: [
        "Rotates on its side (98° tilt)",
        "Coldest planetary atmosphere in solar system",
        "Has faint rings",
        "Discovered by William Herschel in 1781"
      ]
    }
  },
  {
    name: "Neptune",
    radius: 2.1,
    distance: 115,
    color: "#4B70DD",
    orbitSpeed: 0.006,
    rotationSpeed: 0.032,
    facts: {
      diameter: "49,528 km",
      distanceFromSun: "4.5 billion km",
      orbitalPeriod: "165 Earth years",
      dayLength: "16.1 hours",
      temperature: "-201°C average",
      composition: "Water, methane, and ammonia ices",
      moons: "16+ (including Triton)",
      interestingFacts: [
        "Windiest planet with speeds up to 2,100 km/h",
        "Discovered through mathematical predictions",
        "Triton orbits backwards",
        "Deep blue color from methane in atmosphere"
      ]
    }
  }
];
