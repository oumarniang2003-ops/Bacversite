import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic();

const MODEL = "claude-opus-5";

const EcoleUpdateSchema = z.object({
  type: z.enum(["Public", "Privé"]).nullable(),
  ville: z.string().nullable(),
  filieres: z.string().nullable(),
  frais: z.string().nullable(),
  conditions_admission: z.string().nullable(),
  contact: z.string().nullable(),
  site_web: z.string().nullable(),
});

export type EcoleUpdate = z.infer<typeof EcoleUpdateSchema>;

const ConcoursItemSchema = z.object({
  nom: z.string(),
  filieres: z.string().nullable(),
  date_limite: z
    .string()
    .nullable()
    .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "date_limite doit être au format YYYY-MM-DD ou null",
    }),
  conditions: z.string().nullable(),
  ecoles_liees: z.string().nullable(),
});

export type ConcoursItem = z.infer<typeof ConcoursItemSchema>;

const ConcoursListSchema = z.object({
  concours: z.array(ConcoursItemSchema),
});

/**
 * Extract the last JSON object/array found in a text blob.
 * Claude is instructed to answer with JSON only, but this guards
 * against stray prose or markdown fences.
 */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  return JSON.parse(candidate.trim());
}

async function runResearch(prompt: string): Promise<string> {
  const runner = client.beta.messages.toolRunner({
    model: MODEL,
    max_tokens: 4096,
    output_config: { effort: "low" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }],
    messages: [{ role: "user", content: prompt }],
  });

  let finalText = "";
  for await (const message of runner) {
    if (message.stop_reason === "pause_turn") {
      runner.pushMessages({ role: "assistant", content: message.content });
      continue;
    }
    for (const block of message.content) {
      if (block.type === "text") finalText = block.text;
    }
  }
  return finalText;
}

/**
 * Search the web for up-to-date info about one école and return the
 * fields that should be refreshed, or null if nothing reliable was found.
 */
export async function researchEcole(
  nom: string,
  ville: string | null
): Promise<EcoleUpdate | null> {
  const prompt = `Recherche sur le web les informations à jour (2026) sur l'établissement d'enseignement supérieur suivant au Sénégal : "${nom}"${
    ville ? ` (ville : ${ville})` : ""
  }.

Trouve : type (Public ou Privé), ville, filières proposées, frais de scolarité/inscription, conditions d'admission, contact (téléphone/email), site web officiel.

Réponds UNIQUEMENT avec un objet JSON, sans texte autour, au format exact :
{"type": "Public"|"Privé"|null, "ville": string|null, "filieres": string|null, "frais": string|null, "conditions_admission": string|null, "contact": string|null, "site_web": string|null}

Mets null pour tout champ que tu ne trouves pas avec une source fiable. N'invente aucune information.`;

  try {
    const text = await runResearch(prompt);
    const parsed = EcoleUpdateSchema.safeParse(extractJson(text));
    if (!parsed.success) {
      console.error(`researchEcole: réponse invalide pour "${nom}"`, parsed.error.message);
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.error(`researchEcole: échec pour "${nom}"`, error);
    return null;
  }
}

/**
 * Search the web for concours (grandes écoles, fonction publique, etc.)
 * open in Sénégal, including their deadlines.
 */
export async function discoverConcours(): Promise<ConcoursItem[]> {
  const prompt = `Recherche sur le web les concours d'entrée aux grandes écoles et à la fonction publique actuellement ouverts ou annoncés pour 2026-2027 au Sénégal (ESP, UCAD, UGB, ENA, écoles de santé, écoles militaires/paramilitaires, etc.).

Réponds UNIQUEMENT avec un objet JSON, sans texte autour, au format exact :
{"concours": [{"nom": string, "filieres": string|null, "date_limite": "YYYY-MM-DD"|null, "conditions": string|null, "ecoles_liees": string|null}]}

Inclus uniquement des concours réels que tu peux confirmer par une source. N'invente rien. Si tu n'en trouves aucun, renvoie {"concours": []}.`;

  try {
    const text = await runResearch(prompt);
    const parsed = ConcoursListSchema.safeParse(extractJson(text));
    if (!parsed.success) {
      console.error("discoverConcours: réponse invalide", parsed.error.message);
      return [];
    }
    return parsed.data.concours;
  } catch (error) {
    console.error("discoverConcours: échec", error);
    return [];
  }
}
