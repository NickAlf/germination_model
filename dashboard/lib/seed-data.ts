export const GROWING_RECOMMENDATIONS = {
  Broccoli: {
    expected_germination_days: 5,
    optimal_temperature: 21,
    optimal_humidity: 75,
    success_rate: 0.89,
    growing_tips: [
      "Maintain consistent moisture without waterlogging",
      "Provide 12-14 hours of indirect light daily",
      "Harvest when cotyledons are fully developed",
      "Watch for purple stems indicating good nutrition",
    ],
  },
  Radish: {
    expected_germination_days: 3,
    optimal_temperature: 20,
    optimal_humidity: 80,
    success_rate: 0.94,
    growing_tips: [
      "Fast germination - check daily after day 2",
      "Pink/purple stems are normal and desirable",
      "Harvest early for mild flavor, later for spicy",
      "Excellent for beginners due to high success rate",
    ],
  },
  "Pea Shoots": {
    expected_germination_days: 8,
    optimal_temperature: 18,
    optimal_humidity: 70,
    success_rate: 0.82,
    growing_tips: [
      "Soak seeds 8-12 hours before planting",
      "Provide support for climbing varieties",
      "Harvest shoots when 2-4 inches tall",
      "Sweet flavor develops best in cooler conditions",
    ],
  },
  Sunflower: {
    expected_germination_days: 6,
    optimal_temperature: 22,
    optimal_humidity: 65,
    success_rate: 0.76,
    growing_tips: [
      "Remove hulls before planting for better germination",
      "Provide strong light once sprouted",
      "Harvest when first true leaves appear",
      "Nutty flavor intensifies with proper lighting",
    ],
  },
  Arugula: {
    expected_germination_days: 4,
    optimal_temperature: 19,
    optimal_humidity: 75,
    success_rate: 0.91,
    growing_tips: [
      "Cool weather crop - avoid high temperatures",
      "Peppery flavor develops with maturity",
      "Harvest young for salads, mature for cooking",
      "Succession plant every 2 weeks",
    ],
  },
  Kale: {
    expected_germination_days: 6,
    optimal_temperature: 20,
    optimal_humidity: 70,
    success_rate: 0.85,
    growing_tips: [
      "Tolerates cooler temperatures well",
      "Purple varieties need more light",
      "Harvest when 2-3 inches tall",
      "Massage leaves to reduce bitterness",
    ],
  },
  Mustard: {
    expected_germination_days: 4,
    optimal_temperature: 21,
    optimal_humidity: 75,
    success_rate: 0.88,
    growing_tips: [
      "Spicy flavor develops quickly",
      "Harvest young for mild taste",
      "Good companion with milder greens",
      "Grows well in cooler conditions",
    ],
  },
  Cabbage: {
    expected_germination_days: 7,
    optimal_temperature: 18,
    optimal_humidity: 80,
    success_rate: 0.83,
    growing_tips: [
      "Slower germination but very nutritious",
      "Purple varieties are more colorful",
      "Harvest when cotyledons are bright",
      "Mild, sweet flavor when young",
    ],
  },
  Chia: {
    expected_germination_days: 3,
    optimal_temperature: 22,
    optimal_humidity: 85,
    success_rate: 0.79,
    growing_tips: [
      "Very small seeds - use fine growing medium",
      "High humidity essential for germination",
      "Mucilaginous when wet - normal behavior",
      "Harvest microgreens, not for seed production",
    ],
  },
  Basil: {
    expected_germination_days: 8,
    optimal_temperature: 24,
    optimal_humidity: 70,
    success_rate: 0.81,
    growing_tips: [
      "Warm weather crop - needs higher temperatures",
      "Pinch flowers to maintain leaf production",
      "Aromatic oils develop with proper lighting",
      "Harvest frequently to encourage growth",
    ],
  },
}

export const SEED_CATEGORIES = {
  "Fast Growing": ["Radish", "Chia", "Arugula", "Mustard"],
  "Medium Growing": ["Broccoli", "Kale", "Sunflower"],
  "Slow Growing": ["Pea Shoots", "Cabbage", "Basil"],
  "Beginner Friendly": ["Radish", "Arugula", "Broccoli", "Mustard"],
  Advanced: ["Sunflower", "Chia", "Basil"],
}

export const ENVIRONMENTAL_RANGES = {
  temperature: { min: 16, max: 26, optimal: 21 },
  humidity: { min: 60, max: 90, optimal: 75 },
  light_hours: { min: 8, max: 16, optimal: 12 },
}
