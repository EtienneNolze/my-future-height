export type Lang = "de" | "fr" | "en" | "es";

export const LANG_LABELS: Record<Lang, string> = {
  de: "DE",
  fr: "FR",
  en: "EN",
  es: "ES",
};

export interface Dict {
  badge: string;
  h1_part1: string;
  h1_tall: string;
  h1_part2: string;
  h1_grow: string;
  h1_q: string;
  intro: string;

  card_title: string;
  card_desc: string;
  unit_label: string;
  unit_cm: string;
  unit_in: string;

  sec1_title: string;
  sec1_sub: string;
  sec2_title: string;
  sec2_sub: string;
  sec3_title: string;
  sec3_sub: string;
  sec4_title: string;
  sec4_sub: string;

  age: string;
  age_ph: string;
  yrs: string;

  gender: string;
  male: string;
  female: string;

  ethnicity: string;
  eth_european: string;
  eth_east_asian: string;
  eth_south_asian: string;
  eth_se_asian: string;
  eth_african: string;
  eth_middle_eastern: string;
  eth_latin: string;
  eth_mixed: string;
  dont_know: string;

  current_height: string;
  mom_height: string;
  dad_height: string;
  leave_blank: string;

  weight: string;
  sitting_height: string;
  leg_length: string;
  inseam: string;
  arm_span: string;
  arm_span_hint: string;
  shoulder: string;
  hand_length: string;
  shoe_size: string;
  shoe_size_hint: string;
  head_circ: string;
  optional: string;

  spurt_age: string;
  still_growing: string;
  yes: string;
  no_stopped: string;
  no: string;
  growth_last_year: string;
  growth_spurt: string;
  spurt_not_yet: string;
  spurt_now: string;
  spurt_done: string;

  nutrition: string;
  nut_needs_work: string;
  nut_okay: string;
  nut_balanced: string;
  nut_very_healthy: string;

  sleep: string;
  sleep_lt7: string;
  sleep_7_8: string;
  sleep_8_9: string;
  sleep_9p: string;

  exercise: string;
  ex_none: string;
  ex_light: string;
  ex_moderate: string;
  ex_very: string;

  chronic: string;
  preterm: string;
  smoking: string;
  hormones: string;

  estimate_btn: string;
  reset_btn: string;
  err_age: string;
  err_height: string;

  result_title: string;
  result_desc: string;
  likely_range: string;
  remember_label: string;
  remember_text: string;
  method_text_pre: string;
  method_text_strong: string;
  method_text_post: string;
  important_pre: string;
  important_strong: string;
  important_post: string;

  language: string;
}

const en: Dict = {
  badge: "Personalized height estimate for kids & teens",
  h1_part1: "How ",
  h1_tall: "tall",
  h1_part2: " will you ",
  h1_grow: "grow",
  h1_q: "?",
  intro:
    "Answer as many questions as you can — anything you don't know, just pick \"I don't know\". The more you fill in, the more accurate the estimate.",
  card_title: "Your growth profile",
  card_desc: "Switch between centimeters and inches. Skip anything you don't know.",
  unit_label: "Measurement unit",
  unit_cm: "cm",
  unit_in: "inches",
  sec1_title: "1. Most important",
  sec1_sub: "These have the biggest impact on the estimate.",
  sec2_title: "2. Body measurements",
  sec2_sub:
    "Optional — useful if parents' heights are unknown. Arm span ≈ adult height, and foot length tracks adult height well.",
  sec3_title: "3. Growth & development",
  sec3_sub: "Only relevant if you're still growing.",
  sec4_title: "4. Lifestyle & health",
  sec4_sub: "These nudge the final height a little.",
  age: "Your age",
  age_ph: "e.g. 13",
  yrs: "yrs",
  gender: "Gender at birth",
  male: "Male",
  female: "Female",
  ethnicity: "Ethnic / regional background",
  eth_european: "European",
  eth_east_asian: "East Asian",
  eth_south_asian: "South Asian",
  eth_se_asian: "South-East Asian",
  eth_african: "African",
  eth_middle_eastern: "Middle Eastern",
  eth_latin: "Latin American",
  eth_mixed: "Mixed / Other",
  dont_know: "I don't know",
  current_height: "Your current height",
  mom_height: "Mom's height",
  dad_height: "Dad's height",
  leave_blank: "Leave blank if unknown",
  weight: "Weight",
  sitting_height: "Sitting height",
  leg_length: "Leg length",
  inseam: "Inseam",
  arm_span: "Arm span",
  arm_span_hint: "Fingertip to fingertip",
  shoulder: "Shoulder width",
  hand_length: "Hand length",
  shoe_size: "Shoe size",
  shoe_size_hint: "Foot length is estimated from your shoe size",
  head_circ: "Head circumference",
  optional: "optional",
  spurt_age: "Age at growth spurt (if known)",
  still_growing: "Are you still growing?",
  yes: "Yes",
  no_stopped: "No, I've stopped",
  no: "No",
  growth_last_year: "How much did you grow last year?",
  growth_spurt: "Growth spurt status",
  spurt_not_yet: "Hasn't started yet",
  spurt_now: "Happening now",
  spurt_done: "Already finished",
  nutrition: "Nutrition",
  nut_needs_work: "Needs work",
  nut_okay: "Okay",
  nut_balanced: "Balanced",
  nut_very_healthy: "Very healthy",
  sleep: "Sleep per night",
  sleep_lt7: "Less than 7 hours",
  sleep_7_8: "7–8 hours",
  sleep_8_9: "8–9 hours",
  sleep_9p: "9+ hours",
  exercise: "Exercise / sports",
  ex_none: "Not active",
  ex_light: "Light (1–2 days/week)",
  ex_moderate: "Moderate (3–5 days/week)",
  ex_very: "Very active (6+ days/week)",
  chronic: "Chronic illness?",
  preterm: "Born preterm?",
  smoking: "Mother smoked during pregnancy?",
  hormones: "Any hormone treatment?",
  estimate_btn: "Estimate my height",
  reset_btn: "Start over",
  err_age: "Please enter an age between 2 and 25 years.",
  err_height: "Please enter your current height.",
  result_title: "Your estimated adult height",
  result_desc: "Based on everything you told us.",
  likely_range: "likely range:",
  remember_label: "Remember:",
  remember_text: " this is a personalized estimate, not a medical prediction.",
  method_text_pre: "It combines the ",
  method_text_strong: "mid-parental height (Tanner method)",
  method_text_post:
    ", your current growth rate, and basic anthropometric rules like arm span and foot length.",
  important_pre: "The most important inputs are ",
  important_strong: "age, gender, parents' heights, current height, and recent yearly growth",
  important_post: ".",
  language: "Language",
};

const de: Dict = {
  badge: "Personalisierte Grössenschätzung für Kinder & Jugendliche",
  h1_part1: "Wie ",
  h1_tall: "gross",
  h1_part2: " wirst du ",
  h1_grow: "werden",
  h1_q: "?",
  intro:
    "Beantworte so viele Fragen wie möglich — was du nicht weisst, wähle einfach „Ich weiss nicht“. Je mehr du ausfüllst, desto genauer die Schätzung.",
  card_title: "Dein Wachstumsprofil",
  card_desc: "Wechsle zwischen Zentimetern und Zoll. Überspringe, was du nicht weisst.",
  unit_label: "Masseinheit",
  unit_cm: "cm",
  unit_in: "Zoll",
  sec1_title: "1. Am wichtigsten",
  sec1_sub: "Diese Angaben beeinflussen die Schätzung am stärksten.",
  sec2_title: "2. Körpermässe",
  sec2_sub:
    "Optional — hilfreich, wenn die Elterngrösse unbekannt ist. Armspanne ≈ Erwachsenengrösse, Fußlänge korreliert gut mit Grösse.",
  sec3_title: "3. Wachstum & Entwicklung",
  sec3_sub: "Nur relevant, wenn du noch wächst.",
  sec4_title: "4. Lebensstil & Gesundheit",
  sec4_sub: "Diese verschieben das Ergebnis leicht.",
  age: "Dein Alter",
  age_ph: "z. B. 13",
  yrs: "J.",
  gender: "Geschlecht bei Geburt",
  male: "Männlich",
  female: "Weiblich",
  ethnicity: "Ethnische / regionale Herkunft",
  eth_european: "Europäisch",
  eth_east_asian: "Ostasiatisch",
  eth_south_asian: "Südasiatisch",
  eth_se_asian: "Südostasiatisch",
  eth_african: "Afrikanisch",
  eth_middle_eastern: "Nahöstlich",
  eth_latin: "Lateinamerikanisch",
  eth_mixed: "Gemischt / Andere",
  dont_know: "Ich weiss nicht",
  current_height: "Deine aktuelle Grösse",
  mom_height: "Grösse der Mutter",
  dad_height: "Grösse des Vaters",
  leave_blank: "Leer lassen, wenn unbekannt",
  weight: "Gewicht",
  sitting_height: "Sitzhöhe",
  leg_length: "Beinlänge",
  inseam: "Schrittlänge",
  arm_span: "Armspanne",
  arm_span_hint: "Fingerspitze zu Fingerspitze",
  shoulder: "Schulterbreite",
  hand_length: "Handlänge",
  shoe_size: "Schuhgrösse",
  shoe_size_hint: "Die Fußlänge wird aus deiner Schuhgrösse geschätzt",
  head_circ: "Kopfumfang",
  optional: "optional",
  spurt_age: "Alter beim Wachstumsschub (falls bekannt)",
  still_growing: "Wächst du noch?",
  yes: "Ja",
  no_stopped: "Nein, ich bin ausgewachsen",
  no: "Nein",
  growth_last_year: "Wie viel bist du letztes Jahr gewachsen?",
  growth_spurt: "Status des Wachstumsschubs",
  spurt_not_yet: "Hat noch nicht begonnen",
  spurt_now: "Findet gerade statt",
  spurt_done: "Bereits abgeschlossen",
  nutrition: "Ernährung",
  nut_needs_work: "Verbesserungsbedürftig",
  nut_okay: "Okay",
  nut_balanced: "Ausgewogen",
  nut_very_healthy: "Sehr gesund",
  sleep: "Schlaf pro Nacht",
  sleep_lt7: "Weniger als 7 Stunden",
  sleep_7_8: "7–8 Stunden",
  sleep_8_9: "8–9 Stunden",
  sleep_9p: "9+ Stunden",
  exercise: "Bewegung / Sport",
  ex_none: "Nicht aktiv",
  ex_light: "Leicht (1–2 Tage/Woche)",
  ex_moderate: "Moderat (3–5 Tage/Woche)",
  ex_very: "Sehr aktiv (6+ Tage/Woche)",
  chronic: "Chronische Krankheit?",
  preterm: "Frühgeburt?",
  smoking: "Hat die Mutter in der Schwangerschaft geraucht?",
  hormones: "Hormonbehandlung?",
  estimate_btn: "Grösse schätzen",
  reset_btn: "Neu starten",
  err_age: "Bitte gib ein Alter zwischen 2 und 25 Jahren ein.",
  err_height: "Bitte gib deine aktuelle Grösse ein.",
  result_title: "Deine geschätzte Erwachsenengrösse",
  result_desc: "Basierend auf allem, was du angegeben hast.",
  likely_range: "wahrscheinlicher Bereich:",
  remember_label: "Hinweis:",
  remember_text: " Dies ist eine personalisierte Schätzung, keine medizinische Vorhersage.",
  method_text_pre: "Sie kombiniert die ",
  method_text_strong: "mittlere Elterngrösse (Tanner-Methode)",
  method_text_post:
    ", deine aktuelle Wachstumsrate und einfache anthropometrische Regeln wie Armspanne und Fußlänge.",
  important_pre: "Die wichtigsten Eingaben sind ",
  important_strong:
    "Alter, Geschlecht, Grösse der Eltern, aktuelle Grösse und jüngstes Jahreswachstum",
  important_post: ".",
  language: "Sprache",
};

const es: Dict = {
  badge: "Estimación personalizada de altura para niños y adolescentes",
  h1_part1: "Cómo serás de ",
  h1_tall: "alto",
  h1_part2: "",
  h1_grow: "",
  h1_q: "?",
  intro:
    "Responde tantas preguntas como puedas — lo que no sepas, elige \"No lo sé\". Cuanto más completes, más precisa será la estimación.",
  card_title: "Tu perfil de crecimiento",
  card_desc: "Cambia entre centímetros y pulgadas. Omite lo que no sepas.",
  unit_label: "Unidad de medida",
  unit_cm: "cm",
  unit_in: "pulgadas",
  sec1_title: "1. Lo más importante",
  sec1_sub: "Tienen el mayor impacto en la estimación.",
  sec2_title: "2. Medidas corporales",
  sec2_sub:
    "Opcional — útil si no se conoce la altura de los padres. La envergadura ≈ altura adulta, y la longitud del pie predice bien la altura.",
  sec3_title: "3. Crecimiento y desarrollo",
  sec3_sub: "Solo relevante si aún estás creciendo.",
  sec4_title: "4. Estilo de vida y salud",
  sec4_sub: "Ajustan ligeramente la altura final.",
  age: "Tu edad",
  age_ph: "p. ej. 13",
  yrs: "años",
  gender: "Sexo al nacer",
  male: "Hombre",
  female: "Mujer",
  ethnicity: "Origen étnico / regional",
  eth_european: "Europeo",
  eth_east_asian: "Asiático oriental",
  eth_south_asian: "Sudasiático",
  eth_se_asian: "Sudeste asiático",
  eth_african: "Africano",
  eth_middle_eastern: "Medio Oriente",
  eth_latin: "Latinoamericano",
  eth_mixed: "Mixto / Otro",
  dont_know: "No lo sé",
  current_height: "Tu altura actual",
  mom_height: "Altura de la madre",
  dad_height: "Altura del padre",
  leave_blank: "Déjalo en blanco si no lo sabes",
  weight: "Peso",
  sitting_height: "Altura sentado",
  leg_length: "Longitud de pierna",
  inseam: "Entrepierna",
  arm_span: "Envergadura",
  arm_span_hint: "De la punta de un dedo a la otra",
  shoulder: "Anchura de hombros",
  hand_length: "Longitud de la mano",
  shoe_size: "Talla de zapato",
  shoe_size_hint: "La longitud del pie se estima a partir de tu talla de zapato",
  head_circ: "Perímetro craneal",
  optional: "opcional",
  spurt_age: "Edad del estirón (si se conoce)",
  still_growing: "¿Sigues creciendo?",
  yes: "Sí",
  no_stopped: "No, ya paré",
  no: "No",
  growth_last_year: "¿Cuánto creciste el año pasado?",
  growth_spurt: "Estado del estirón",
  spurt_not_yet: "Aún no ha empezado",
  spurt_now: "Está ocurriendo ahora",
  spurt_done: "Ya terminó",
  nutrition: "Nutrición",
  nut_needs_work: "Necesita mejorar",
  nut_okay: "Regular",
  nut_balanced: "Equilibrada",
  nut_very_healthy: "Muy saludable",
  sleep: "Sueño por noche",
  sleep_lt7: "Menos de 7 horas",
  sleep_7_8: "7–8 horas",
  sleep_8_9: "8–9 horas",
  sleep_9p: "9+ horas",
  exercise: "Ejercicio / deporte",
  ex_none: "Inactivo",
  ex_light: "Ligero (1–2 días/semana)",
  ex_moderate: "Moderado (3–5 días/semana)",
  ex_very: "Muy activo (6+ días/semana)",
  chronic: "¿Enfermedad crónica?",
  preterm: "¿Nacido prematuro?",
  smoking: "¿Fumó la madre durante el embarazo?",
  hormones: "¿Algún tratamiento hormonal?",
  estimate_btn: "Estimar mi altura",
  reset_btn: "Empezar de nuevo",
  err_age: "Por favor, introduce una edad entre 2 y 25 años.",
  err_height: "Por favor, introduce tu altura actual.",
  result_title: "Tu altura adulta estimada",
  result_desc: "Basado en todo lo que nos contaste.",
  likely_range: "rango probable:",
  remember_label: "Recuerda:",
  remember_text: " esta es una estimación personalizada, no una predicción médica.",
  method_text_pre: "Combina la ",
  method_text_strong: "altura media parental (método de Tanner)",
  method_text_post:
    ", tu tasa de crecimiento actual y reglas antropométricas básicas como la envergadura y la longitud del pie.",
  important_pre: "Los datos más importantes son ",
  important_strong:
    "edad, sexo, altura de los padres, altura actual y crecimiento anual reciente",
  important_post: ".",
  language: "Idioma",
};

const fr: Dict = {
  badge: "Estimation personnalisée de la taille pour enfants et ados",
  h1_part1: "Quelle ",
  h1_tall: "taille",
  h1_part2: " vas-tu ",
  h1_grow: "atteindre",
  h1_q: "?",
  intro:
    "Réponds à autant de questions que possible — pour ce que tu ne sais pas, choisis « Je ne sais pas ». Plus tu en remplis, plus l'estimation est précise.",
  card_title: "Ton profil de croissance",
  card_desc: "Bascule entre centimètres et pouces. Passe ce que tu ne sais pas.",
  unit_label: "Unité de mesure",
  unit_cm: "cm",
  unit_in: "pouces",
  sec1_title: "1. Le plus important",
  sec1_sub: "Ces éléments ont le plus d'impact sur l'estimation.",
  sec2_title: "2. Mesures corporelles",
  sec2_sub:
    "Optionnel — utile si la taille des parents est inconnue. L'envergure ≈ taille adulte et la longueur du pied suit bien la taille.",
  sec3_title: "3. Croissance & développement",
  sec3_sub: "Pertinent uniquement si tu grandis encore.",
  sec4_title: "4. Mode de vie & santé",
  sec4_sub: "Ils ajustent légèrement la taille finale.",
  age: "Ton âge",
  age_ph: "ex. 13",
  yrs: "ans",
  gender: "Sexe à la naissance",
  male: "Homme",
  female: "Femme",
  ethnicity: "Origine ethnique / régionale",
  eth_european: "Européenne",
  eth_east_asian: "Asie de l'Est",
  eth_south_asian: "Asie du Sud",
  eth_se_asian: "Asie du Sud-Est",
  eth_african: "Africaine",
  eth_middle_eastern: "Moyen-Orient",
  eth_latin: "Amérique latine",
  eth_mixed: "Mixte / Autre",
  dont_know: "Je ne sais pas",
  current_height: "Ta taille actuelle",
  mom_height: "Taille de la mère",
  dad_height: "Taille du père",
  leave_blank: "Laisse vide si inconnu",
  weight: "Poids",
  sitting_height: "Hauteur assise",
  leg_length: "Longueur de jambe",
  inseam: "Entrejambe",
  arm_span: "Envergure",
  arm_span_hint: "Du bout d'un doigt à l'autre",
  shoulder: "Largeur d'épaules",
  hand_length: "Longueur de la main",
  shoe_size: "Pointure",
  shoe_size_hint: "La longueur du pied est estimée à partir de ta pointure",
  head_circ: "Périmètre crânien",
  optional: "facultatif",
  spurt_age: "Âge de la poussée de croissance (si connu)",
  still_growing: "Grandis-tu encore ?",
  yes: "Oui",
  no_stopped: "Non, j'ai arrêté",
  no: "Non",
  growth_last_year: "De combien as-tu grandi l'an dernier ?",
  growth_spurt: "État de la poussée de croissance",
  spurt_not_yet: "Pas encore commencée",
  spurt_now: "En cours",
  spurt_done: "Déjà terminée",
  nutrition: "Nutrition",
  nut_needs_work: "À améliorer",
  nut_okay: "Correcte",
  nut_balanced: "Équilibrée",
  nut_very_healthy: "Très saine",
  sleep: "Sommeil par nuit",
  sleep_lt7: "Moins de 7 heures",
  sleep_7_8: "7–8 heures",
  sleep_8_9: "8–9 heures",
  sleep_9p: "9+ heures",
  exercise: "Exercice / sport",
  ex_none: "Inactif",
  ex_light: "Léger (1–2 j/semaine)",
  ex_moderate: "Modéré (3–5 j/semaine)",
  ex_very: "Très actif (6+ j/semaine)",
  chronic: "Maladie chronique ?",
  preterm: "Né prématuré ?",
  smoking: "La mère a-t-elle fumé pendant la grossesse ?",
  hormones: "Traitement hormonal ?",
  estimate_btn: "Estimer ma taille",
  reset_btn: "Recommencer",
  err_age: "Merci d'entrer un âge entre 2 et 25 ans.",
  err_height: "Merci d'entrer ta taille actuelle.",
  result_title: "Ta taille adulte estimée",
  result_desc: "D'après tout ce que tu nous as dit.",
  likely_range: "fourchette probable :",
  remember_label: "Rappel :",
  remember_text: " ceci est une estimation personnalisée, pas une prédiction médicale.",
  method_text_pre: "Elle combine la ",
  method_text_strong: "taille mi-parentale (méthode de Tanner)",
  method_text_post:
    ", ton taux de croissance actuel et des règles anthropométriques de base comme l'envergure et la longueur du pied.",
  important_pre: "Les données les plus importantes sont ",
  important_strong:
    "l'âge, le sexe, la taille des parents, la taille actuelle et la croissance annuelle récente",
  important_post: ".",
  language: "Langue",
};

export const DICTS: Record<Lang, Dict> = { de, fr, en, es };
