export const site = {
  name: "Prajapati Ceramic",
  fullName: "Prajapati Ceramic Pottery Studio",
  email: "prajapaticeramics@gmail.com",
  whatsapp: "9779869421616",
  instagram: "https://www.instagram.com/prajapaticeramic/",
  facebook: "",
  url: "https://prajapaticeramic.com.np",
  studios: ["Boudha", "Thamel"],
  // Prices are intentionally undisclosed. Keep opening hours null until owner-confirmed.
  // Optional operatingStatus can record current studio notices without changing layout.
  locations: [
    {
      name: "Boudha",
      address: "P993+5V, Boudha, Kathmandu 44600, Nepal",
      hours: null,
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Prajapati+Pottery+Studio+Boudha&query_place_id=ChIJBQiEJ1Qb6zkR7Ygj45rD77E",
    },
    {
      name: "Thamel",
      address: "Satghumti Chowk, Thamel, Kathmandu 44600, Nepal",
      hours: null,
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Prajapati+Pottery+Studio+Thamel&query_place_id=ChIJr0EcXtYZ6zkRTXCzuxYiXPY",
    },
  ] as {
    name: string;
    address: string | null;
    hours: string | null;
    mapUrl: string | null;
    operatingStatus?: string | null;
  }[],
};
export const experiences = [
  {
    id: "one-hour",
    name: "A little introduction",
    formal: "One-Hour Pottery Experience",
    duration: "1 hour",
    minutes: 60,
    category: "Experiences",
    tag: "THE FIRST TOUCH",
    description:
      "Meet the wheel, feel the clay, and discover the simple joy of making something with your own hands.",
    learn: "An introduction to centering clay and shaping a simple form.",
    audience: "First-timers, curious travelers & friends",
    image: "hands-clay",
    price: null,
  },
  {
    id: "two-hour",
    name: "Find your flow",
    formal: "Two-Hour Pottery Experience",
    duration: "2 hours",
    minutes: 120,
    category: "Experiences",
    tag: "MORE TIME TO MAKE",
    description:
      "Slow down and settle into the process. A little more time to explore, experiment, and make it your own.",
    learn: "More time to practice shaping, explore form, and build confidence.",
    audience: "Beginners, couples & creative explorers",
    image: "pottery-wheel",
    price: null,
  },
  {
    id: "private",
    name: "A moment of your own",
    formal: "Private Pottery Sessions",
    duration: "By arrangement",
    minutes: 120,
    category: "Groups & private",
    tag: "BETTER TOGETHER",
    description:
      "A shared moment away from the everyday. Bring your partner, family, or favorite people to the wheel.",
    learn: "A guided creative session adapted to your group.",
    audience: "Couples, friends, families & celebrations",
    image: "studio-group",
    price: null,
  },
  {
    id: "group",
    name: "Better, together",
    formal: "Group Pottery Experiences",
    duration: "By arrangement",
    minutes: 120,
    category: "Groups & private",
    tag: "SHARE A MOMENT",
    description: "Bring your favorite people. Make a memory by hand.",
    learn: "A guided pottery experience adapted to your group.",
    audience: "Friends, families & celebrations",
    image: "studio-celebration",
    price: null,
  },
  {
    id: "weekly",
    name: "A weekly moment for clay",
    formal: "Weekly Pottery Classes",
    duration: "Weekly sessions",
    minutes: 120,
    category: "Courses",
    tag: "KEEP CREATING",
    description:
      "Build a regular creative practice with structured guidance and room to grow.",
    learn: "Develop fundamental pottery skills through regular practice.",
    audience: "Beginners & returning makers",
    image: "workshop",
    price: null,
  },
  {
    id: "monthly",
    name: "Go a little deeper",
    formal: "Monthly Pottery Classes",
    duration: "Monthly course",
    minutes: 120,
    category: "Courses",
    tag: "YOUR CREATIVE PRACTICE",
    description:
      "Make space for a deeper understanding of clay, form, and craftsmanship.",
    learn:
      "A progressive course; the studio will confirm the syllabus and session schedule.",
    audience: "Committed beginners & developing makers",
    image: "hands-clay",
    price: null,
  },
  {
    id: "kids",
    name: "Small hands, big ideas",
    formal: "Kids’ Pottery Workshops",
    duration: "By arrangement",
    minutes: 60,
    category: "Groups & private",
    tag: "LET CURIOSITY LEAD",
    description:
      "Playful, hands-on activities that give young imaginations a little room to run.",
    learn: "Creative exploration with clay and age-appropriate guidance.",
    audience: "Children; please confirm age suitability with us",
    image: "studio-child",
    price: null,
  },
  {
    id: "corporate",
    name: "A different kind of teamwork",
    formal: "Corporate and Team-Building Workshops",
    duration: "By arrangement",
    minutes: 120,
    category: "Groups & private",
    tag: "CONNECT THROUGH CLAY",
    description:
      "Step away from screens and make a shared creative experience part of your team’s story.",
    learn: "Collaborative making adapted to your group and goals.",
    audience: "Companies, schools, colleges & organizations",
    image: "workshop",
    price: null,
  },
];
export const priceLabel = (price: number | null) =>
  price === null ? "Contact us for pricing" : `NPR ${price.toLocaleString()}`;
export const faqs = [
  [
    "Do I need any pottery experience?",
    "You can start with no experience. Our introductory sessions guide you through working with clay, step by step.",
  ],
  [
    "Can I take my pottery home the same day?",
    "Unfired clay is fragile. If you would like a finished ceramic piece, ask about assessment, drying, glazing, and kiln firing. The studio will confirm the timeline, fees, and collection options before you proceed.",
  ],
  [
    "Is glazing and firing included?",
    "Finishing options and any additional charges are confirmed separately. Ask the studio for the current class price and a finishing quote before booking.",
  ],
  [
    "How do bookings work?",
    "Choose a published session or request your preferred date. Your request stays pending until the studio accepts it. Keep your private tracking link to check the reservation status.",
  ],
  [
    "Which studio should I choose?",
    "We have studios in Boudha and Thamel, Kathmandu. See the studio locations page for directions and contact us before traveling.",
  ],
  [
    "Can children and private groups join?",
    "Yes, we offer children’s workshops and private group experiences. Tell us the ages, group size, and occasion so we can discuss a suitable session.",
  ],
];
export const articles = [
  {
    slug: "your-first-pottery-class",
    category: "A BEGINNER’S GUIDE",
    title: "Your first pottery class: come curious.",
    excerpt:
      "What to wear, what to expect, and why your first piece doesn’t need to be perfect.",
    image: "hands-clay",
    paragraphs: [
      "There is something wonderfully direct about clay. You touch it, it responds. Your first pottery session is a chance to notice that conversation, with an instructor there to guide you.",
      "Wear comfortable clothes you don’t mind getting a little clay on. Short nails can make shaping easier, and it helps to set rings and watches somewhere safe before you begin. Ask the studio about aprons and any other materials included in your chosen session.",
      "At the wheel, you will begin by getting to know how the clay moves. Centering and shaping take practice. A leaning bowl or a wobbly edge is part of learning; the aim is to enjoy the process and understand a little more with each attempt.",
      "Before leaving, discuss what happens to your piece. Drying, glazing, and firing need additional time. Let the studio know your travel plans so you can agree on a realistic finishing and collection arrangement.",
    ],
  },
  {
    slug: "from-clay-to-ceramic",
    category: "THE MAKING PROCESS",
    title: "From soft clay to something you can keep.",
    excerpt:
      "A simple guide to drying, glazing, and the transformative work of the kiln.",
    image: "pottery-wheel",
    paragraphs: [
      "The piece you shape in a workshop begins as soft clay. It needs careful drying before it can be fired. Rushing that stage can cause cracks, so the pace is set by the clay as much as by the maker.",
      "A first firing changes dry clay into ceramic. Glaze can then add color and surface character, followed by a firing suited to the materials and finish. The studio assesses each piece before agreeing on a suitable process.",
      "A glossy surface alone does not make a piece suitable for food. Clay, glaze, firing temperature, and the condition of the finished piece all matter. Ask the studio to assess the intended use, especially for mugs, bowls, and plates.",
      "Processing times and costs depend on the piece and kiln schedule. Ask for a current estimate, arrange collection before you leave Kathmandu, and confirm delivery availability rather than assuming it is included.",
    ],
  },
  {
    slug: "a-creative-pause-in-kathmandu",
    category: "KATHMANDU, SLOWLY",
    title: "Make room for a slower kind of souvenir.",
    excerpt:
      "Step into a creative experience and take a moment to make a memory by hand.",
    image: "workshop",
    paragraphs: [
      "A trip is often remembered in small moments: a conversation, an unfamiliar texture, the feeling of learning something new. A pottery session creates space for all three.",
      "Working with clay invites you to pay attention. Your hands find a rhythm, and the next small movement becomes more interesting than the next notification. You do not need to be an artist to enjoy that shift.",
      "At Prajapati Ceramic, our family’s pottery heritage is part of the experience we share. We welcome visitors who want to connect with making and meet a living craft through participation.",
      "Choose Boudha or Thamel to suit your plans, then request a session in advance. Tell us how long you are in Kathmandu and whether you hope to keep a finished piece. We can discuss options before you visit.",
    ],
  },
];
export const imageCredits = [
  {
    file: "pottery-wheel.jpg",
    url: "https://unsplash.com/photos/ObocATAlfE8",
    name: "Jonathan Cosens Photography / Unsplash",
  },
  {
    file: "hands-clay.jpg",
    url: "https://unsplash.com/photos/Bb7c5J3sHD0",
    name: "Vicky Hladynets / Unsplash",
  },
  {
    file: "workshop.jpg",
    url: "https://images.unsplash.com/photo-1686472947499-77d42e3b62f6",
    name: "Unsplash",
  },
  {
    file: "ceramics.jpg",
    url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61",
    name: "Unsplash",
  },
];
