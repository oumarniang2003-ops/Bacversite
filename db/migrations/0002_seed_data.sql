-- ============================================================
-- Bacversité : Import de contenu réel
-- Universités publiques, grandes écoles, écoles privées,
-- concours d''entrée, bourses d''études, guides études à l''étranger
-- Sources : sites officiels, Campusen, Campus France, Sencampus,
-- Kamerpower, VisaConnect Africa (vérifié juillet 2026)
-- NB : les dates de concours/bourses varient chaque année,
-- à reconfirmer sur les sites officiels avant chaque session.
-- ============================================================

-- Vider les tables existantes et réinitialiser les compteurs d'ID auto-incrémentés
TRUNCATE TABLE ecoles, concours, bourses, etudes_etranger RESTART IDENTITY CASCADE;

-- ============ ÉCOLES : UNIVERSITÉS PUBLIQUES ============

INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('Université Cheikh Anta Diop de Dakar (UCAD)', 'Public', 'Dakar',
 'Sciences et Techniques, Lettres et Sciences Humaines, Sciences Juridiques et Politiques, Sciences Économiques et de Gestion (FASEG), Médecine Pharmacie et Odonto-Stomatologie',
 'Environ 150 000 FCFA/an (facultés classiques), 300 000 FCFA/an (écoles nationales supérieures)',
 'Orientation via Campusen après le Bac, choix de vœux par ordre de préférence',
 '(+221) 33 824 01 24', 'https://www.ucad.sn'),

('Université Gaston Berger de Saint-Louis (UGB)', 'Public', 'Saint-Louis',
 'Lettres, Sciences Humaines, Droit, Sciences Économiques, Sciences Appliquées et Technologies, Sciences de la Santé',
 'Environ 150 000 FCFA/an',
 'Orientation via Campusen, meilleur ratio enseignant-étudiant que UCAD',
 NULL, 'https://www.ugb.sn'),

('Université Alioune Diop de Bambey (UADB)', 'Public', 'Bambey',
 'Sciences Appliquées et Technologies de l''Information et de la Communication (SATIC), Sciences Économiques et de Gestion, Sciences Agronomiques',
 'Environ 150 000 FCFA/an',
 'Orientation via Campusen',
 NULL, 'https://www.uadb.edu.sn'),

('Université Iba Der Thiam de Thiès (UIDT)', 'Public', 'Thiès',
 'Sciences et Technologies, Génie Civil, Droit, Économie et Gestion (7 établissements + École Doctorale Développement Durable)',
 'Environ 150 000 FCFA/an',
 'Orientation via Campusen',
 NULL, 'https://www.univ-thies.sn'),

('Université Assane Seck de Ziguinchor (UASZ)', 'Public', 'Ziguinchor',
 'Sciences de Gestion et Économiques, Sciences Humaines, Sciences Sociales, Technologie, Santé',
 'Environ 150 000 FCFA/an',
 'Orientation via Campusen, 4 UFR',
 NULL, 'https://www.uasz.sn'),

('Université du Sine Saloum El Hadji Ibrahima Niass (USSEIN)', 'Public', 'Kaolack',
 'Filières diverses réparties entre Kaolack, Fatick et Kaffrine',
 'Environ 150 000 FCFA/an',
 'Orientation via Campusen',
 NULL, NULL),

('Université Amadou Mahtar Mbow (UAM)', 'Public', 'Diamniadio',
 'Filières technologiques et professionnalisantes, campus de dernière génération',
 'Environ 150 000 FCFA/an',
 'Orientation via Campusen, université inaugurée en 2022',
 NULL, NULL),

('Université Virtuelle du Sénégal (UVS)', 'Public', 'Dakar (enseignement à distance)',
 'Informatique, Sciences de gestion, Droit, filières à distance', 'Environ 150 000 FCFA/an',
 'Enseignement entièrement à distance, orientation via Campusen',
 NULL, NULL);

-- ============ ÉCOLES : GRANDES ÉCOLES PUBLIQUES (accès par concours) ============

INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('École Supérieure Polytechnique de Dakar (ESP)', 'Public', 'Dakar',
 'Génie Civil, Génie Électrique, Informatique, Génie Mécanique (Cycle DUT et Cycle Ingénieur DIC)',
 'Frais réduits (subventionnés par l''État), environ 150 000 à 300 000 FCFA/an',
 'Concours d''entrée niveau BAC (séries L2, G, F6, S1, S2, S3, T1, T2) ou DUT/BTS/Licence 2 pour le cycle ingénieur',
 NULL, 'https://www.esp.sn'),

('École Nationale Supérieure d''Agriculture de Thiès (ENSA)', 'Public', 'Thiès',
 'Agronomie, Sciences Agricoles',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC, séries S1, S2, S3, S4, S5',
 NULL, NULL),

('Institut Polytechnique de Saint-Louis (IPSL)', 'Public', 'Saint-Louis',
 'Classes préparatoires intégrées, ingénierie',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC, séries S1, S2, S3',
 NULL, NULL),

('Institut Supérieur d''Enseignement Professionnel de Thiès (ISEP Thiès)', 'Public', 'Thiès',
 'Administration des Systèmes et Réseaux, Multimédia, Exploitation Agricole, Maintenance Ferroviaire, Management du Transport, Tourisme',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC, séries L2, G2, S, T, BT selon la filière',
 NULL, NULL),

('Centre d''Études des Sciences et Techniques de l''Information (CESTI)', 'Public', 'Dakar',
 'Journalisme, Communication, Production Audiovisuelle',
 'Frais de dossier d''environ 10 000 FCFA',
 'Concours niveau BAC (17-24 ans) ou Licence 3 ; ouvert aux bacheliers, élèves de Terminale et professionnels avec 4 ans d''expérience',
 'cesti@ucad.edu.sn / 77 587 07 64', NULL),

('École Nationale d''Administration (ENA)', 'Public', 'Dakar',
 'Administration Publique, Cycle A (Master), Cycle B (BAC), Cycle C',
 'Frais subventionnés par l''État',
 'Cycle A : Bac+4 minimum. Cycle B : niveau BAC. Nationalité sénégalaise exigée, casier judiciaire vierge',
 NULL, 'https://concoursena.sec.gouv.sn'),

('École Nationale de la Statistique et de l''Analyse Économique (ENSAE)', 'Public', 'Dakar',
 'Statistique, Économétrie, Ingénieur Statisticien Économiste (ISE)',
 'Frais subventionnés par l''État',
 'Concours ISE niveau Licence 3, concours ITS niveau BAC ou Licence 2 (séries S), très sélectif en mathématiques',
 NULL, NULL);

-- ============ ÉCOLES : PRIVÉES ============

INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('Groupe ISM (Institut Supérieur de Management)', 'Privé', 'Dakar',
 'Management, Droit des Affaires, Ingénierie Numérique, Digital, MBA (École de Management, École d''Ingénieurs, Madiba Leadership Institute, École de Droit)',
 'Environ 1 250 000 à 1 450 000 FCFA/an en Licence/Master',
 'Dossier (BAC légalisé, relevés de notes, CV) + tests de culture générale et anglais + entretien',
 '(+221) 33 869 76 77', 'https://www.groupeism.sn'),

('BEM Dakar (Bordeaux École de Management)', 'Privé', 'Dakar',
 'Commerce, Gestion, Management, Bachelor, MBA, DBA',
 'Entre 650 000 et 2 765 000 FCFA/an selon le programme',
 'Dossier de candidature, accueille des étudiants de plus de 30 nationalités',
 '(+221) 33 869 82 81', NULL),

('Suffolk University Dakar Campus (SUDC)', 'Privé', 'Dakar',
 'Programmes 100% en anglais, modèle académique américain',
 'Variable selon programme',
 'Dossier de candidature en anglais, adapté aux étudiants non-francophones',
 NULL, NULL),

('Université Catholique de l''Afrique de l''Ouest (UCAO)', 'Privé', 'Dakar',
 'Génie Juridique, Génie Gestion Économique, Sciences et Technologies, Langues et Affaires',
 'Droit d''inscription 40 000 FCFA + scolarité mensuelle 40 000 FCFA (9 mois) en L1',
 'Dossier de candidature, première université privée du Sénégal (créée en 1995)',
 '(+221) 33 825 36 11', NULL),

('Institut Supérieur de l''Éducation et de la Gouvernance (ISEG)', 'Privé', 'Dakar',
 'Gestion, Comptabilité, Commerce International',
 'Variable selon filière',
 'Dossier de candidature',
 NULL, NULL);

-- ============ CONCOURS (niveau post-BAC) ============
-- Dates indicatives pour la session 2026-2027, à reconfirmer chaque année

INSERT INTO concours (nom, filieres, date_limite, conditions, ecoles_liees) VALUES
('Concours ENA - Cycle B', 'Administration publique, Droit, Économie',
 '2027-04-07',
 'Niveau BAC, âge 18-33 ans au 1er janvier de l''année du concours, nationalité sénégalaise exigée. Inscription en ligne sur concoursena.sec.gouv.sn',
 'École Nationale d''Administration (ENA)'),

('Concours CESTI (Journalisme, Communication, Audiovisuel)', 'Journalisme, Communication, Production Audiovisuelle',
 '2027-05-25',
 'Bachelier ou élève de Terminale (17-24 ans), ou professionnel avec 4 ans d''expérience. Frais de dossier ~10 000 FCFA. Épreuves écrites puis pré-sélection',
 'CESTI (rattaché à l''UCAD)'),

('Concours ESP Dakar - Cycle DUT', 'Génie Civil, Génie Électrique, Informatique, Génie Mécanique',
 '2027-04-30',
 'BAC séries L2, G, F6, S1, S2, S3, T1, T2',
 'École Supérieure Polytechnique de Dakar (ESP)'),

('Concours ENSA Thiès (Agriculture)', 'Agronomie, Sciences Agricoles',
 '2027-05-31',
 'BAC séries S1, S2, S3, S4, S5',
 'École Nationale Supérieure d''Agriculture de Thiès'),

('Concours École Polytechnique de Thiès (EPT)', 'Ingénierie, Sciences et Technologies',
 '2027-06-01',
 'BAC séries S1, S2, S3, T1',
 'École Polytechnique de Thiès'),

('Concours ISEP Thiès (Techniciens Supérieurs)', 'Réseaux Informatiques, Multimédia, Agriculture, Transport Ferroviaire, Tourisme',
 '2027-09-01',
 'BAC séries L2, G2, S, T, BT selon la filière visée',
 'Institut Supérieur d''Enseignement Professionnel de Thiès (ISEP)'),

('Concours IPSL Saint-Louis (Classes préparatoires intégrées)', 'Ingénierie',
 '2027-06-30',
 'BAC séries S1, S2, S3',
 'Institut Polytechnique de Saint-Louis'),

('Concours ENSAE - Ingénieur Statisticien Économiste (ISE)', 'Statistique, Économétrie',
 '2027-01-31',
 'Niveau Licence 3 en Mathématiques ou Sciences Économiques, très sélectif',
 'ENSAE Dakar'),

('Concours ENSAE - Ingénieur des Travaux Statistiques (ITS voie BAC)', 'Statistique',
 '2027-01-31',
 'BAC série S, épreuves de présélection puis concours écrit',
 'ENSAE Dakar'),

('Concours ENDSS - Infirmier et Sage-femme d''État', 'Santé, Soins Infirmiers, Obstétrique',
 '2027-06-01',
 'Niveau BAC, concours organisé aussi dans les Centres Régionaux de Formation en Santé (CRFS)',
 'École Nationale de Développement Sanitaire et Social (ENDSS)'),

('Concours EBAD (Bibliothécaires, Archivistes, Documentalistes)', 'Sciences de l''Information et Documentation',
 '2027-06-09',
 'Niveau BAC toutes séries',
 'École des Bibliothécaires, Archivistes et Documentalistes (EBAD, UCAD)'),

('Concours INSEPS (Sport et Éducation Physique)', 'Sciences et Techniques des Activités Physiques et Sportives',
 '2027-10-01',
 'Niveau BAC + épreuves sportives, 24 ans au plus au 31 décembre de l''année du concours',
 'INSEPS Dakar'),

('Concours ESEA - ex ENEA (Économie Appliquée)', 'Économie Appliquée, Statistique',
 '2027-08-31',
 'BAC séries L, S, G, 24 ans au plus au 1er janvier de l''année du concours',
 'ESEA Dakar');

-- ============ BOURSES D'ÉTUDES ============

INSERT INTO bourses (nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature) VALUES
('Bourse de l''État sénégalais (bourse entière / demi-bourse)', 'Sénégal',
 '36 000 FCFA/mois (bourse entière), 60 000 FCFA/mois (médecine), 18 000 FCFA/mois (demi-bourse)',
 NULL,
 'Critères sociaux (revenus familiaux) et académiques (notes). Demande via les services sociaux de l''université lors de l''inscription sur Campusen',
 'https://campusen.sn'),

('Programme de Bourses France - Sénégal (Master/Doctorat)', 'France',
 'Prise en charge scolarité + allocation mensuelle (variable selon niveau)',
 '2027-02-04',
 'Nationalité sénégalaise, poursuite d''un Master ou séjour de recherche en France, toutes disciplines',
 'https://bourses.franceausenegal.com'),

('Bourse d''excellence Eiffel', 'France',
 '1 181 €/mois (Master), 1 700 €/mois (Doctorat)',
 NULL,
 'Excellents résultats académiques, candidature via l''établissement français choisi (date limite propre à chaque établissement, généralement début novembre)',
 'https://www.campusfrance.org'),

('Bourses AMCI (Agence Marocaine de Coopération Internationale)', 'Maroc',
 'Scolarité prise en charge + allocation d''environ 750 MAD/mois + logement en cité universitaire',
 NULL,
 '260 bourses offertes aux étudiants sénégalais pour 2026-2027, dossier à déposer via l''ambassade du Maroc à Dakar',
 NULL),

('Bourses Turquie (Türkiye Bursları)', 'Turquie',
 'Scolarité offerte + année de langue turque + allocation mensuelle (3000-5000 TL) + logement + billet d''avion',
 '2027-02-20',
 'Dossier de candidature en ligne, tous niveaux (Licence à Doctorat)',
 'https://www.turkiyeburslari.gov.tr'),

('Bourse Chine (China Scholarship Council - CSC)', 'Chine',
 'Prise en charge complète (scolarité, logement, allocation)',
 '2027-03-31',
 'Candidatures de décembre à mars, tous niveaux',
 NULL),

('Bourse Chevening', 'Royaume-Uni',
 'Prise en charge complète pour un Master d''un an',
 NULL,
 'Excellent niveau académique et d''anglais, potentiel de leadership',
 'https://www.chevening.org'),

('Bourse DAAD', 'Allemagne',
 'Variable selon programme (scolarité + allocation)',
 NULL,
 'Programmes en sciences, ingénierie ou développement durable',
 'https://www.daad.de'),

('Bourse Fulbright', 'États-Unis',
 'Prise en charge complète pour chercheurs et étudiants de Master',
 NULL,
 'Excellent niveau académique et d''anglais',
 NULL),

('Bourses de Master - Université Rose Dieng (France-Sénégal)', 'France / Sénégal',
 'Variable',
 NULL,
 'Admission 2026-2027 en cours, se renseigner auprès du MESRI',
 'https://mesrisenegal.sn/bourses-detudes/');

-- ============ ÉTUDES À L'ÉTRANGER (guides par pays) ============

INSERT INTO etudes_etranger (pays, procedures, cout_vie_estime, partenaires, visa_info) VALUES
('France',
 'Passer par Campus France Dakar pour la procédure de candidature (Études en France). Constituer un dossier académique, lettre de motivation, et passer un entretien si requis par l''établissement.',
 'Environ 800 à 1200 €/mois selon la ville (logement, alimentation, transport)',
 'Campus France Dakar, universités publiques françaises (frais très réduits pour les non-boursiers, moins de 250€/an de scolarité)',
 'Visa étudiant long séjour obligatoire, à demander après acceptation via Campus France et le consulat de France à Dakar'),

('Maroc',
 'Obtenir une admission dans un établissement marocain reconnu (public ou privé agréé). Déposer le dossier de candidature entre mai et juillet selon l''université. Demander le visa long séjour AVANT le départ (obligatoire pour les non-boursiers AMCI).',
 'Casablanca et Rabat plus chères que les villes de l''intérieur ; budget mensuel moyen estimé 150 000 à 250 000 FCFA',
 'Bourses AMCI disponibles (260 places pour 2026-2027), nombreuses universités publiques et privées agréées',
 'Visa étudiant obligatoire pour séjour de plus de 90 jours, délai de traitement 2 à 4 semaines (jusqu''à 6 en période de forte demande juin-août). Demande de carte de séjour obligatoire dans les 90 jours suivant l''arrivée'),

('Canada',
 'Obtenir une lettre d''acceptation d''un établissement désigné (DLI - liste officielle sur ircc.canada.ca). Si Québec visé : demander le CAQ (Certificat d''Acceptation du Québec) AVANT le permis d''études. Puis demande de permis d''études en ligne via IRCC.',
 'Entre 1200 et 1800 CAD/mois selon la ville (Montréal moins cher que Toronto/Vancouver)',
 'Universités québécoises (Montréal, UQAM, Laval, Sherbrooke) avec frais réduits pour francophones ; bourses Killam, bourses de la Francophonie canadienne, OIF',
 'Permis d''études obligatoire (>6 mois) + visa de résident temporaire. Preuve de fonds minimum 20 635 CAD pour la 1ère année (frais + 10 000 CAD de subsistance). Délai de traitement 8 à 16 semaines depuis le Sénégal'),

('Turquie',
 'Candidature via le programme Türkiye Bursları (bourses gouvernementales) ou directement auprès des universités turques pour les non-boursiers.',
 'Coût de la vie modéré, largement couvert par la bourse Türkiye Bursları si obtenue',
 'Programme de bourses Türkiye Bursları couvrant scolarité, logement, allocation et billet d''avion',
 'Visa étudiant à demander auprès de l''ambassade de Turquie, dossier facilité pour les boursiers du programme national'),

('Chine',
 'Candidature au China Scholarship Council (CSC) pour les bourses, ou directement auprès des universités chinoises. Dossiers généralement ouverts de décembre à mars.',
 'Variable selon la ville, largement couvert par la bourse CSC si obtenue',
 'China Scholarship Council (CSC), accords bilatéraux Sénégal-Chine',
 'Visa étudiant (visa X) à demander après obtention de la lettre d''admission et du formulaire JW202');
