import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Map interests to filieres
const INTEREST_FILIERE_MAP: Record<string, string[]> = {
  "Sciences/Logique": ["Sciences & Ingénierie", "Informatique & Numérique"],
  "Aider les autres/Santé": ["Santé & Médecine", "Sciences Sociales & Travail Social"],
  "Droit/Justice": ["Droit & Sciences Politiques"],
  "Chiffres/Gestion": ["Économie & Gestion"],
  "Lecture/Écriture": ["Lettres & Sciences Humaines"],
  "Informatique/Technologie": ["Informatique & Numérique"],
  "Nature/Agriculture": ["Agriculture & Environnement"],
  "Créativité/Communication": ["Arts, Communication & Journalisme"],
  "Voyager/Contact humain": ["Tourisme & Hôtellerie"],
};

// Map filieres to search keywords for matching ecoles
const FILIERE_KEYWORDS: Record<string, string[]> = {
  "Sciences & Ingénierie": ["Sciences", "Ingénierie", "Génie", "Physique", "Chimie", "Mathématiques"],
  "Informatique & Numérique": ["Informatique", "Numérique", "Développement", "Réseaux", "Cybersécurité", "Systems", "Digital"],
  "Santé & Médecine": ["Santé", "Médecine", "Pharmacie", "Soins", "Infirmier", "Obstétrique"],
  "Sciences Sociales & Travail Social": ["Social", "Sociologie", "Psychologie", "Travail Social"],
  "Droit & Sciences Politiques": ["Droit", "Politique", "Juridique"],
  "Économie & Gestion": ["Économie", "Gestion", "Comptabilité", "Finance", "Management", "Commerce"],
  "Lettres & Sciences Humaines": ["Lettres", "Humaines", "Philosophie", "Histoire", "Géographie", "Langues"],
  "Agriculture & Environnement": ["Agriculture", "Environnement", "Agronomie", "Agricole"],
  "Arts, Communication & Journalisme": ["Arts", "Communication", "Journalisme", "Audiovisuel", "Multimédia"],
  "Tourisme & Hôtellerie": ["Tourisme", "Hôtellerie", "Hôtel", "Voyage"],
};

export async function POST(req: Request) {
  try {
    const { bacSerie, interests, budget, etranger } = await req.json();

    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json({ error: "Les centres d'intérêt sont requis." }, { status: 400 });
    }

    const ALL_FILIERES = [
      "Sciences & Ingénierie",
      "Santé & Médecine",
      "Droit & Sciences Politiques",
      "Économie & Gestion",
      "Lettres & Sciences Humaines",
      "Informatique & Numérique",
      "Agriculture & Environnement",
      "Arts, Communication & Journalisme",
      "Tourisme & Hôtellerie",
      "Sciences Sociales & Travail Social",
    ];

    // Initialize all scores to 0
    const scores: Record<string, number> = {};
    ALL_FILIERES.forEach((f) => {
      scores[f] = 0;
    });

    // 1. Scoring based on interests
    interests.forEach((interest) => {
      const matchedFilieres = INTEREST_FILIERE_MAP[interest];
      if (matchedFilieres) {
        matchedFilieres.forEach((filiere) => {
          scores[filiere] = (scores[filiere] || 0) + 1;
        });
      }
    });

    // 2. Scoring based on BAC series
    if (bacSerie) {
      const isScientific = ["S1", "S2", "S3", "S4", "S5"].includes(bacSerie);
      const isLiterary = ["L1", "L2"].includes(bacSerie);
      const isGestion = bacSerie === "G";
      const isTechnique = bacSerie === "T";

      if (isScientific) {
        scores["Sciences & Ingénierie"] += 2;
        scores["Santé & Médecine"] += 2;
        scores["Informatique & Numérique"] += 2;
        scores["Agriculture & Environnement"] += 2;
      } else if (isLiterary) {
        scores["Lettres & Sciences Humaines"] += 2;
        scores["Droit & Sciences Politiques"] += 2;
        scores["Arts, Communication & Journalisme"] += 2;
      } else if (isGestion) {
        scores["Économie & Gestion"] += 2;
        scores["Tourisme & Hôtellerie"] += 2;
      } else if (isTechnique) {
        scores["Sciences & Ingénierie"] += 2;
        scores["Informatique & Numérique"] += 2;
      }

      // Toutes séries: léger bonus de +1 pour Sciences Sociales & Travail Social
      scores["Sciences Sociales & Travail Social"] += 1;
    }

    // Sort filieres by score descending
    const sortedFilieres = Object.entries(scores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([nom]) => nom);

    // If none matched, select a few default ones
    let selectedFiliereNames = sortedFilieres.slice(0, 3);
    if (selectedFiliereNames.length === 0) {
      selectedFiliereNames = ["Sciences & Ingénierie", "Informatique & Numérique", "Économie & Gestion"];
    }

    // 2. Fetch descriptions of selected filieres
    const filieresDb = await query(
      "SELECT nom, description FROM filieres WHERE nom = ANY($1)",
      [selectedFiliereNames]
    );

    // Maintain sorting order based on scores
    const recommendedFilieres = selectedFiliereNames
      .map((fName) => {
        const dbItem = filieresDb.rows.find((r) => r.nom === fName);
        return {
          nom: fName,
          description: dbItem ? dbItem.description : "Filière universitaire et professionnelle de premier plan.",
          ecoles: [] as any[],
        };
      });

    // 3. Find ecoles for each filiere
    const isPublicOnly = budget === "Public uniquement - budget limité";

    for (const recommended of recommendedFilieres) {
      const keywords = FILIERE_KEYWORDS[recommended.nom] || [recommended.nom];
      
      // Build SQL with ILIKE dynamic OR clauses
      const selectParts: string[] = [];
      const queryParams: any[] = [];

      keywords.forEach((kw, index) => {
        queryParams.push(`%${kw}%`);
        selectParts.push(`filieres ILIKE $${index + 1}`);
      });

      let sql = `
        SELECT id, nom, type, ville
        FROM ecoles
        WHERE (${selectParts.join(" OR ")})
      `;

      if (isPublicOnly) {
        sql += " AND type = 'Public'";
      }

      sql += " ORDER BY nom ASC LIMIT 5";

      const schoolsDb = await query(sql, queryParams);
      recommended.ecoles = schoolsDb.rows;
    }

    // 4. International recommendations if applicable
    let etrangerData = null;
    const wantsAbroad = etranger === "Oui, c'est mon objectif" || etranger === "Peut-être";

    if (wantsAbroad) {
      const paysDb = await query("SELECT id, pays, cout_vie_estime FROM etudes_etranger ORDER BY pays ASC");
      const boursesDb = await query("SELECT id, nom, pays, montant FROM bourses ORDER BY id DESC LIMIT 3");
      
      etrangerData = {
        pays: paysDb.rows,
        bourses: boursesDb.rows,
      };
    }

    return NextResponse.json({
      recommendations: recommendedFilieres,
      etranger: etrangerData,
    });
  } catch (error) {
    console.error("Erreur lors de la logique du quiz :", error);
    return NextResponse.json({ error: "Erreur serveur lors de la soumission du quiz." }, { status: 500 });
  }
}
