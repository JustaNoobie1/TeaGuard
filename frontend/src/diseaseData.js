export const DISEASE_INFO = {

  // ── 1. Tea algal leaf spot ──────────────────────────────────────────────
  "Tea algal leaf spot": {
    cause: "Caused by the parasitic alga Cephaleuros virescens. Thrives in conditions of high humidity, poor canopy ventilation, and prolonged leaf wetness common in heavily shaded, low-elevation tea gardens.",
    type: "Algal Disease",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Canopy Management", detail: "Prune overcrowded branches every season to improve airflow and reduce leaf wetness duration within the bush canopy." },
        { heading: "Irrigation Method", detail: "Switch from overhead sprinklers to drip irrigation systems to keep foliage consistently dry and reduce algal spore germination." },
        { heading: "Shade Regulation", detail: "Reduce excessive shade tree cover; aim for 30–40% shade to balance temperature and humidity without promoting algal growth." },
        { heading: "Field Sanitation", detail: "Remove and destroy all infected leaves and plant debris immediately to eliminate spore sources before the rainy season." },
        { heading: "Drainage Improvement", detail: "Install proper field drainage channels to prevent water stagnation around plant roots and reduce ambient humidity." },
        { heading: "Resistant Varieties", detail: "Where available, plant TRI or UPASI-recommended cultivars with documented tolerance to algal leaf spot under field conditions." },
      ],
    },
    treatment: {
      title: "Chemical & Biological Treatment",
      icon: "🧪",
      color: "#b45309",
      bg: "#fdf6ee",
      border: "#f5d08a",
      items: [
        { heading: "Copper Oxychloride Spray", detail: "Apply 0.3% copper oxychloride (3 g/L water) every 10–14 days during peak infection periods. Coat both leaf surfaces thoroughly." },
        { heading: "Bordeaux Mixture", detail: "Prepare 1% Bordeaux mixture (100 g copper sulfate + 100 g lime per 10 L water) and spray fortnightly as a broad-spectrum algaecide." },
        { heading: "Copper Hydroxide", detail: "Use copper hydroxide (Kocide 3000) at label-recommended rates; provides systemic redistribution and extended residual protection." },
        { heading: "Trichoderma-based Biocontrol", detail: "Apply Trichoderma viride or T. harzianum formulations (10⁸ CFU/g) as a soil drench to enhance plant immunity and suppress secondary fungal infection." },
        { heading: "Neem Oil Spray", detail: "Spray 3% neem oil with 0.5% emulsifier monthly as a preventive biological shield; disrupts algal metabolism without chemical residues." },
        { heading: "Post-treatment Follow-up", detail: "Reassess 3 weeks after first copper application; if regrowth of algal patches occurs, repeat the Bordeaux cycle and improve cultural controls." },
      ],
    },
  },

  // ── 2. Brown Blight ─────────────────────────────────────────────────────
  "Brown Blight": {
    cause: "Caused by the fungus Colletotrichum theae-sinensis. Spreads via rain splash and wind-driven conidia during warm, wet seasons; particularly aggressive in dense, poorly ventilated plantations.",
    type: "Fungal Disease",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Site Selection & Drainage", detail: "Plant only in well-draining soils with slopes of 5–15° where possible. Install contour drains to prevent waterlogging after heavy rain." },
        { heading: "Post-flush Pruning", detail: "Prune bushes after every harvesting flush to open the canopy. Remove dead wood promptly to eliminate fungal sporulation sites." },
        { heading: "Disease-free Planting Material", detail: "Source certified, pathogen-tested vegetative cuttings from reputable nurseries. Quarantine new material for 14 days before field planting." },
        { heading: "Balanced Fertilization", detail: "Maintain balanced N:P:K ratios; excessive nitrogen produces soft, disease-susceptible tissue. Supplement with potassium to improve cell wall integrity." },
        { heading: "Lime Sulfur Application", detail: "Apply lime sulfur (1.5%) during the dormant season before new flush emergence to suppress fungal inoculum carry-over between seasons." },
        { heading: "Wound Management", detail: "Seal all pruning wounds with a Bordeaux paste or wound sealant immediately after cutting to prevent pathogen ingress through exposed tissue." },
      ],
    },
    treatment: {
      title: "Chemical & Biological Treatment",
      icon: "🧪",
      color: "#b45309",
      bg: "#fdf6ee",
      border: "#f5d08a",
      items: [
        { heading: "Carbendazim (MBC Fungicide)", detail: "Apply Carbendazim 50 WP at 1 g/L water as a systemic curative spray; penetrates infected tissue and arrests fungal spread within 48–72 hours." },
        { heading: "Thiophanate-methyl", detail: "Spray Thiophanate-methyl 70 WP at 1.5 g/L water every 14 days during wet season. Alternate with a contact fungicide to prevent resistance." },
        { heading: "Copper Oxychloride", detail: "Use as a contact protective fungicide at 2.5 g/L water; apply before rain events to form a protective copper barrier on leaf surfaces." },
        { heading: "Iprodione (Post-harvest)", detail: "Apply Iprodione 50 WP at 2 g/L to harvested areas to manage post-harvest blight spread on remaining plant tissue." },
        { heading: "Pseudomonas fluorescens Biocontrol", detail: "Drench soil and spray foliage with Pseudomonas fluorescens (10⁸ CFU/mL) to colonize plant surfaces and suppress Colletotrichum germination biologically." },
        { heading: "Tool & Equipment Sanitation", detail: "Disinfect all harvesting and pruning tools with 70% ethanol or 2% sodium hypochlorite solution between rows to prevent mechanical pathogen transfer." },
      ],
    },
  },

  // ── 3. Gray Blight ──────────────────────────────────────────────────────
  "Gray Blight": {
    cause: "Caused by the fungi Pestalotiopsis theae and Cercospora puerariicola. Prevalent in shaded, humid plantation environments with inadequate sanitation and stressed plants.",
    type: "Fungal Disease",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Shade Management", detail: "Reduce excessive shade tree canopy cover; maintain no more than 30–35% shade to lower relative humidity below 80% within the tea field." },
        { heading: "Field Drainage", detail: "Construct proper surface and subsurface drainage to prevent soil waterlogging. Fungi sporulate prolifically in waterlogged, anaerobic soil conditions." },
        { heading: "Nitrogen Management", detail: "Avoid excessive nitrogen application. Soft, succulent growth produced by high-N fertilization is significantly more susceptible to gray blight infection." },
        { heading: "Field Sanitation", detail: "Collect and burn all infected leaf litter and pruning residues. Do not compost infected material as spores remain viable in partially decomposed tissue." },
        { heading: "Crop Rotation Consideration", detail: "In nursery beds, practice rotation of non-host crops every 2–3 years to break the fungal inoculum cycle in soil and planting media." },
        { heading: "Pre-season Copper Spray", detail: "Apply a preventive copper fungicide spray 2–3 weeks before the onset of the rainy season to protect new flush tissue from initial infection." },
      ],
    },
    treatment: {
      title: "Chemical & Biological Treatment",
      icon: "🧪",
      color: "#b45309",
      bg: "#fdf6ee",
      border: "#f5d08a",
      items: [
        { heading: "Bordeaux Mixture (1%)", detail: "Prepare and apply 1% Bordeaux mixture (100 g CuSO₄ + 100 g slaked lime per 10 L) at 2-week intervals during the disease-prone season." },
        { heading: "Mancozeb 75 WP", detail: "Spray Mancozeb at 2.5 g/L water as a broad-spectrum protectant fungicide. Covers both Pestalotiopsis and Cercospora components of gray blight." },
        { heading: "Hexaconazole (Systemic)", detail: "Apply Hexaconazole 5 EC at 1 mL/L water as a systemic triazole fungicide for advanced infections; translocates within plant tissue to eliminate established colonies." },
        { heading: "Trifloxystrobin", detail: "Use Trifloxystrobin 25 WG at 0.5 g/L for strobilurin-based systemic control with a 14-day residual; highly effective against Pestalotiopsis." },
        { heading: "Bacillus subtilis Biocontrol", detail: "Apply Bacillus subtilis (e.g., Serenade) at 5 mL/L water as a foliar spray; produces iturin and surfactin lipopeptides that lyse fungal cell membranes." },
        { heading: "Infected Tissue Removal", detail: "Physically remove and burn all grayish-spotted leaves at first sign of infection. Prune 10 cm below the lowest visible lesion to ensure complete removal." },
      ],
    },
  },

  // ── 4. Helopeltis ───────────────────────────────────────────────────────
  "Helopeltis": {
    cause: "Caused by Helopeltis theivora (Tea mosquito bug), a hemipteran pest that pierces young shoots with its stylet to feed on plant sap, injecting toxic saliva that causes wilting and characteristic blackened die-back lesions.",
    type: "Insect Pest",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Regular Scout Monitoring", detail: "Inspect new flushes and young shoots weekly during the active growing season. Record pest counts per 100 shoots to track population trends." },
        { heading: "Weed Management", detail: "Maintain strict weed-free conditions across the plantation and a 3 m buffer zone. Weeds serve as alternative hosts and breeding reservoirs for Helopeltis." },
        { heading: "Yellow Sticky Traps", detail: "Deploy yellow sticky traps at canopy height (1 trap per 50 m²) to monitor adult populations and provide early warning of infestation build-up." },
        { heading: "Avoidance of Over-fertilization", detail: "Lush, succulent flush growth produced by excessive nitrogen strongly attracts Helopeltis. Maintain balanced N:P:K and avoid applying nitrogen before flush emergence." },
        { heading: "Shade Tree Management", detail: "Reduce dense shade that creates the humid microclimate preferred by Helopeltis. Pruning shade trees during peak pest season reduces pest pressure significantly." },
        { heading: "Conservation of Natural Enemies", detail: "Avoid broad-spectrum insecticides during non-critical periods to preserve populations of parasitic wasps (Erythmelus spp.) and predatory spiders that naturally regulate Helopeltis." },
      ],
    },
    treatment: {
      title: "Chemical & Biological Treatment",
      icon: "🧪",
      color: "#b45309",
      bg: "#fdf6ee",
      border: "#f5d08a",
      items: [
        { heading: "Deltamethrin (Pyrethroid)", detail: "Spray Deltamethrin 2.8 EC at 1 mL/L water during early morning when adults are most active. Effective knock-down contact insecticide with 7-day residual." },
        { heading: "Lambda-cyhalothrin", detail: "Apply Lambda-cyhalothrin 5 EC at 0.5 mL/L water; provides faster knock-down than Deltamethrin and is effective against both nymphs and adults." },
        { heading: "Azadirachtin (Neem-based)", detail: "Use Azadirachtin 0.03 EC at 3–5 mL/L as an IGR (insect growth regulator) that disrupts nymph development and adult reproduction without leaving harmful residues." },
        { heading: "Spinosad", detail: "Apply Spinosad 45 SC at 0.5 mL/L water; a biologically-derived GABA-agonist insecticide with excellent activity against Helopeltis nymphs and low mammalian toxicity." },
        { heading: "Emergency Shoot Pruning", detail: "For heavy localized infestations, prune all heavily infested shoot tips and remove from the field immediately. Bag and destroy — do not leave on the ground." },
        { heading: "Spray Timing Protocol", detail: "Always spray during early morning (6–8 AM) or late evening (5–7 PM) to maximize insect contact and minimize evaporation loss. Repeat every 7–10 days until population drops below the economic threshold." },
      ],
    },
  },

  // ── 5. Red spider ───────────────────────────────────────────────────────
  "Red spider": {
    cause: "Caused by Oligonychus coffeae (Red spider mite), a phytophagous mite that feeds on the upper leaf surface, causing characteristic reddish-bronze discoloration, defoliation, and significant yield reduction in dry seasons.",
    type: "Mite Pest",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Systematic Leaf Monitoring", detail: "Inspect the undersides and upper surfaces of mature leaves every 7–10 days. Use a hand lens (×10) to detect early-stage nymph and egg colonies." },
        { heading: "Soil Moisture Management", detail: "Maintain consistent soil moisture through mulching (sugarcane trash, coir) to reduce drought stress, which is the primary predisposing factor for mite outbreaks." },
        { heading: "Windbreak Planting", detail: "Establish windbreaks of Grevillea or Leucaena on field margins to reduce wind-driven mite dispersal between sections of the plantation." },
        { heading: "Avoid Broad-spectrum Insecticides", detail: "Refrain from using broad-spectrum organophosphates during non-critical periods as these eliminate phytoseiid mite predators, leading to red spider mite population explosions." },
        { heading: "Predatory Mite Introduction", detail: "Introduce Phytoseiulus persimilis or Neoseiulus californicus at 5–10 individuals per plant as a biological release in hotspot areas; these predators consume 5–20 spider mites per day." },
        { heading: "Field Edge Monitoring", detail: "Begin inspections from field margins inward, as red spider mite infestations consistently originate from peripheral rows and spread centripetally under hot, dry conditions." },
      ],
    },
    treatment: {
      title: "Chemical & Biological Treatment",
      icon: "🧪",
      color: "#b45309",
      bg: "#fdf6ee",
      border: "#f5d08a",
      items: [
        { heading: "Dicofol Acaricide", detail: "Apply Dicofol 18.5 EC at 2.5 mL/L water as a specific ovicidal and adulticidal acaricide. Effective against all life stages including eggs — critical for breaking the population cycle." },
        { heading: "Propargite", detail: "Spray Propargite 57 EC at 2 mL/L water; a long-residual acaricide particularly effective in hot, dry conditions that promote mite population build-up." },
        { heading: "Spiromesifen", detail: "Apply Spiromesifen 240 SC at 0.5 mL/L for systemic control. Inhibits lipid biosynthesis in mites, affecting all life stages; 21-day residual protects new flush." },
        { heading: "Neem Oil (Organic)", detail: "Spray cold-pressed neem oil at 3% concentration (30 mL/L) with 0.5 mL/L emulsifier. Disrupts mite feeding and egg-laying; use as a rotation option to delay chemical resistance." },
        { heading: "High-pressure Water Wash", detail: "For low-to-moderate infestations, use high-pressure water spray (250–300 PSI) to physically dislodge mite colonies from leaf surfaces; follow with a neem oil spray." },
        { heading: "Acaricide Rotation Protocol", detail: "Never apply the same acaricide group twice consecutively. Rotate between Group 6 (Dicofol), Group 23 (Spiromesifen), and biological options every spray cycle to prevent resistance development." },
      ],
    },
  },

  // ── 6. Green mirid bug ──────────────────────────────────────────────────
  "Green mirid bug": {
    cause: "Caused by Empoasca species (Tea green leafhopper / Green mirid bug), which sucks phloem sap from young leaves and shoots, injecting toxic saliva that causes leaf curl, marginal scorching, and significant reduction in young shoot quality and quantity.",
    type: "Insect Pest",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Weekly Scouting Programme", detail: "Conduct systematic weekly field walks, recording leafhopper counts per 100 shoots. Use a 20-beat sample method (shake shoots into a tray) to estimate nymph density." },
        { heading: "Trap Cropping", detail: "Plant Sesbania or Crotalaria as trap crops around field margins to divert leafhopper populations away from the main tea crop during peak population periods." },
        { heading: "Alternate Host Removal", detail: "Remove weeds such as Euphorbia spp. and Lantana camara from field boundaries; these are primary alternate hosts that sustain leafhopper populations between flushes." },
        { heading: "Kaolin Clay Application", detail: "Spray 5% kaolin clay (particle film) on young flush foliage to create a physical barrier that deters leafhopper landing, feeding, and oviposition behavior." },
        { heading: "Natural Enemy Conservation", detail: "Preserve populations of Anagrus spp. egg parasitoids and lycosid spiders by avoiding insecticide applications in non-hotspot areas during the parasitoid flight period." },
        { heading: "Harvesting Frequency", detail: "Maintain a shorter plucking interval (7 days instead of 10–14 days) during peak leafhopper season to remove eggs and nymphs on young shoots before population build-up." },
      ],
    },
    treatment: {
      title: "Chemical & Biological Treatment",
      icon: "🧪",
      color: "#b45309",
      bg: "#fdf6ee",
      border: "#f5d08a",
      items: [
        { heading: "Imidacloprid (Neonicotinoid)", detail: "Apply Imidacloprid 70 WG at 0.3 g/L water as a systemic insecticide translocated into phloem sap, providing residual protection for 14–21 days against phloem-feeding leafhoppers." },
        { heading: "Thiamethoxam", detail: "Spray Thiamethoxam 25 WG at 0.3 g/L water; rapid systemic uptake and translocation make it highly effective against both nymphs and adults feeding on new flush tissue." },
        { heading: "Spinosad (Bioinsecticide)", detail: "Use Spinosad 45 SC at 0.5 mL/L water as a fermentation-derived bioinsecticide; GABA-agonist mechanism provides excellent leafhopper control with only 1-day pre-harvest interval." },
        { heading: "Malathion (Contact)", detail: "Apply Malathion 50 EC at 2 mL/L water during peak adult activity (early morning and dusk); a broad-spectrum contact insecticide for rapid suppression of high-density infestations." },
        { heading: "Beauveria bassiana (Biological)", detail: "Spray Beauveria bassiana (1×10⁸ conidia/mL) during cool, humid conditions; the entomopathogenic fungus infects and kills leafhopper nymphs and adults within 3–7 days of contact." },
        { heading: "Repeat Application Schedule", detail: "After initial knockdown, reassess population 10–14 days later. If counts exceed 5 nymphs per shoot, apply a second rotation spray. Always rotate chemical groups to delay insecticide resistance." },
      ],
    },
  },

  // ── 7. Healthy leaf ─────────────────────────────────────────────────────
  "Healthy leaf": {
    cause: "No disease or pest detected. Your tea plant appears to be in excellent health. Maintain your current management programme to sustain productivity and disease resistance.",
    type: "Healthy Plant",
    prevention: {
      title: "Prevention & Cultural Practices",
      icon: "🌿",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Regular Field Monitoring", detail: "Continue scouting every 7–10 days across all sections of the plantation. Early detection of any disease or pest is the single most cost-effective management strategy." },
        { heading: "Balanced Fertilization", detail: "Maintain the recommended NPK schedule for your soil type. Conduct soil and foliar analysis annually to fine-tune nutrient application and avoid deficiency or toxicity." },
        { heading: "Irrigation Consistency", detail: "Ensure consistent soil moisture at the 30–45 cm root zone depth. Avoid both drought stress and overwatering, which predispose plants to opportunistic diseases." },
        { heading: "Canopy & Pruning Hygiene", detail: "Carry out scheduled collar pruning and tipping operations. Remove dead wood promptly and disinfect pruning tools between rows to prevent pathogen introduction." },
        { heading: "Biodiversity & Natural Enemy Support", detail: "Maintain habitat strips with flowering plants (Lantana, Marigold) on field margins to support populations of beneficial insects and natural pest predators year-round." },
        { heading: "Record Keeping", detail: "Log all spray applications, pruning operations, yield data, and weather events. Historical records help identify seasonal disease patterns and optimize management timing." },
      ],
    },
    treatment: {
      title: "Preventive Sprays & Best Practices",
      icon: "🌱",
      color: "#2d7a4f",
      bg: "#e6f7ee",
      border: "#b6dfc4",
      items: [
        { heading: "Monthly Neem Oil Spray", detail: "Apply 3% cold-pressed neem oil with 0.5% emulsifier monthly as a broad-spectrum preventive biological shield against fungal spores, mites, and soft-bodied insects." },
        { heading: "Pre-season Copper Spray", detail: "Apply a single 0.3% copper oxychloride spray 2–3 weeks before the onset of the rainy season to establish a preventive fungal barrier on leaf surfaces." },
        { heading: "Soil Health Management", detail: "Apply farmyard manure (10–15 t/ha/year) and biofertilizers (Azospirillum, Phosphobacteria) to maintain soil organic matter above 3% and support beneficial microbial communities." },
        { heading: "Foliar Nutrition", detail: "Apply micronutrient foliar spray (Zinc, Boron, Manganese) at the recommended rates during active flush stages to maintain optimal plant immunity and quality." },
        { heading: "Routine Soil Testing", detail: "Conduct soil pH and nutrient analysis every 6 months. Maintain soil pH between 4.5–5.5 for optimal tea growth and adjust lime or sulfur applications accordingly." },
        { heading: "Integrated Pest Management", detail: "Follow a structured IPM calendar combining cultural, biological, and minimal chemical inputs. Document spray rotations to ensure systematic resistance management across the season." },
      ],
    },
  },
};

export const MODEL_DETAILS = [
  { label: "Input", value: "224 × 224 RGB" },
  { label: "Backbone", value: "ResNet50" },
  { label: "Explainability", value: "Grad-CAM" },
  { label: "Test accuracy", value: "93.86%" },
];

