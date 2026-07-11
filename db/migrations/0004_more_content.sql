-- ============================================================
-- Bacversité : Contenu complémentaire (juillet 2026)
-- Écoles privées additionnelles, grandes écoles publiques
-- manquantes, concours et bourses supplémentaires
-- ============================================================

-- ============ ÉCOLES : PRIVÉES ADDITIONNELLES ============

INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('Institut Supérieur d''Informatique (ISI)', 'Privé', 'Dakar',
 'Génie Logiciel, Réseaux et Systèmes, Cybersécurité, Data Science/IA, MIAGE, Gestion (Finance, Banque, Assurance)',
 'Variable selon filière, campus également à Keur Massar, Kaolack, Diourbel, Kaffrine, Ziguinchor',
 'Dossier de candidature, licences, masters et cycle ingénieur, fondé en 1994',
 '(+221) 33 822 19 21', 'https://www.isi.sn'),

('Institut Africain de Management (IAM)', 'Privé', 'Dakar',
 'Management, Commerce, Gestion',
 'Variable selon filière',
 'Dossier de candidature',
 '(+221) 33 869 36 36', 'https://www.iam.sn'),

('Groupe SUPDECO Dakar (École Supérieure de Commerce)', 'Privé', 'Dakar',
 'Commerce, Gestion, Management',
 'Variable selon filière',
 'Dossier de candidature + tests d''admission',
 '(+221) 33 849 69 19', NULL),

('ITECOM (Institut Technique de Commerce)', 'Privé', 'Dakar',
 'Commerce, Gestion, Techniques commerciales',
 'Variable selon filière',
 'Dossier de candidature',
 '(+221) 33 842 31 59', NULL),

('Dakar Institute of Technology (DIT)', 'Privé', 'Dakar',
 'Intelligence Artificielle, Big Data, Génie Logiciel',
 'Variable selon filière',
 'Première école d''ingénieurs spécialisée en IA d''Afrique de l''Ouest, dossier de candidature, reconnue par l''État depuis 2021 et accréditée ANAQ-SUP',
 NULL, 'https://dit.sn'),

('ESTM (École Supérieure de Technologie et de Management)', 'Privé', 'Dakar',
 'Management, Gestion d''Entreprise, Ingénierie Informatique, Génie Électrique, Énergies Renouvelables',
 'Variable selon filière',
 'Dossier de candidature, plus de 15 formations accréditées ANAQSUP et reconnues CAMES, fondée en 2001',
 NULL, 'https://www.estm.sn');

-- ============ ÉCOLES : GRANDES ÉCOLES PUBLIQUES MANQUANTES ============

INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('École des Bibliothécaires, Archivistes et Documentalistes (EBAD)', 'Public', 'Dakar',
 'Sciences de l''Information et de la Documentation, Bibliothéconomie, Archivistique',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC toutes séries, rattachée à l''UCAD',
 NULL, NULL),

('École Supérieure d''Économie Appliquée (ESEA, ex-ENEA)', 'Public', 'Dakar',
 'Économie Appliquée, Statistique, Planification',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC séries L, S, G, 24 ans au plus au 1er janvier de l''année du concours',
 NULL, NULL),

('Institut National Supérieur de l''Éducation Populaire et du Sport (INSEPS)', 'Public', 'Dakar',
 'Activités Physiques et Sportives, Éducation et Motricité, Management du Sport',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC + épreuves sportives',
 NULL, NULL),

('Institut des Sciences de la Terre (IST)', 'Public', 'Dakar',
 'Géologie, Sciences de la Terre, Ressources Minières',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC séries S1, S2, S4, S5 (moyenne Terminale ≥ 11,5/20), rattaché à l''UCAD',
 NULL, NULL),

('Institut Universitaire de Pêche et Aquaculture (IUPA)', 'Public', 'Dakar',
 'Pêche, Aquaculture, Sciences Halieutiques',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC série S, moins de 23 ans au 1er octobre de l''année du concours, rattaché à l''UCAD',
 NULL, NULL);

-- ============ CONCOURS ADDITIONNELS ============

INSERT INTO concours (nom, filieres, date_limite, conditions, ecoles_liees) VALUES
('Concours IUPA - Licence Pro Pêche et Aquaculture', 'Pêche, Aquaculture',
 '2027-08-01',
 'BAC série S, moins de 23 ans au 1er octobre de l''année du concours',
 'Institut Universitaire de Pêche et Aquaculture (IUPA)'),

('Concours IST (Institut des Sciences de la Terre)', 'Géologie, Sciences de la Terre',
 '2027-07-31',
 'BAC séries S1, S2, S4, S5, moyenne Terminale ≥ 11,5/20',
 'Institut des Sciences de la Terre (IST)'),

('Concours EAA - École des Officiers de l''Armée de l''Air', 'Formation Militaire, Aéronautique',
 '2027-05-15',
 'Niveau Première S ou BAC+2 selon la voie, épreuves organisées les années paires',
 'École des Officiers de l''Armée de l''Air (EAA), Thiès'),

('Concours Police Nationale (Sous-Officier)', 'Sécurité, Administration',
 '2027-08-15',
 'Niveau BAC',
 'École Nationale de Police'),

('Concours ESOGEN - École des Sous-Officiers de la Gendarmerie', 'Sécurité, Défense',
 '2027-05-31',
 'Niveau BFEM ou BAC, avoir accompli au moins partiellement le service militaire',
 'École des Sous-Officiers de la Gendarmerie Nationale (ESOGEN), Fatick'),

('CREM - Concours de Recrutement des Élèves-Maîtres', 'Enseignement, Éducation',
 '2027-08-15',
 'Niveau BAC, 3 étapes : présélection, admissibilité, entretien',
 'Centres Régionaux de Formation des Personnels de l''Éducation (CRFPE)');

-- ============ BOURSES ADDITIONNELLES ============

INSERT INTO bourses (nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature) VALUES
('Bourse du Gouvernement Français (BGF)', 'France',
 'Prise en charge scolarité + logement + assurance maladie + allocation mensuelle de 700 à 1000 €/mois',
 NULL,
 'Financée par le Ministère français des Affaires étrangères, tous niveaux, candidature via Campus France Dakar',
 'https://www.senegal.campusfrance.org'),

('Bourses Fondation Sonatel (spécialisation médicale)', 'Sénégal',
 'Prise en charge des frais de spécialisation médicale',
 NULL,
 'Titulaire d''un Doctorat en Médecine avec pré-admission en spécialité (hématologie, neurologie, chirurgie, pédiatrie, etc.), ou étudiant déjà inscrit non boursier',
 NULL),

('Bourses ICCR (Indian Council for Cultural Relations)', 'Inde',
 'Prise en charge scolarité + allocation, variable selon le programme',
 '2027-04-15',
 'Licence, Master, Doctorat, Postdoctorat, Recherche',
 NULL),

('Bourses Portugal (Master)', 'Portugal',
 'Variable selon programme',
 NULL,
 '2 places de Master ouvertes aux étudiants sénégalais pour 2026-2027, se renseigner auprès du MESRI',
 'https://mesrisenegal.sn/bourses-detudes/'),

('Bourses Konrad-Adenauer-Stiftung (KAS)', 'Allemagne',
 'Variable selon programme',
 NULL,
 'Fondation politique allemande, bourses pour études et recherche, se renseigner auprès du bureau KAS Sénégal-Gambie',
 'https://www.kas.de/fr/web/senegal');
