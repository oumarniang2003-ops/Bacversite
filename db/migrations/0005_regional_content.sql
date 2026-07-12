-- ============================================================
-- Bacversité : Contenu complémentaire régional (juillet 2026)
-- ============================================================

-- ============ ÉCOLES : RÉGIONALES ET PRIVÉES ADDITIONNELLES ============

INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('École Polytechnique de Thiès (EPT)', 'Public', 'Thiès',
 'Génie Civil, Génie Électrique, Informatique, Technologies Industrielles',
 'Frais subventionnés par l''État',
 'Concours d''entrée niveau BAC séries S1, S2, S3, T1, formations orientées employabilité',
 NULL, NULL),

('Centre de Formation Africain du Sénégal (CEFAS)', 'Privé', 'Dakar',
 'Santé, Technique, Management (Licence, Master, certifications professionnelles)',
 'Variable selon filière',
 'Dossier de candidature, agréé par le Ministère de l''Enseignement Supérieur et le Ministère de la Formation Professionnelle. 5 campus à Dakar + campus régionaux à Kaffrine, Touba-Mbacké et Saint-Louis',
 NULL, NULL),

('AFI - L''Université de l''Entreprise', 'Privé', 'Dakar',
 'Formation professionnelle, académique et entrepreneuriale, orientée employabilité',
 'Variable selon filière',
 'Dossier de candidature, plus de 2 500 étudiants, fort lien avec le monde de l''entreprise',
 NULL, NULL),

('Université du Sahel (UNIS)', 'Privé', 'Dakar',
 'Filières diverses',
 'Variable selon filière',
 'Dossier de candidature',
 NULL, NULL),

('Université Dakar Bourguiba (UDB)', 'Privé', 'Dakar',
 'Filières diverses',
 'Variable selon filière',
 'Dossier de candidature',
 NULL, NULL),

('Université Amadou Hampaté Bâ (UAHB)', 'Privé', 'Dakar',
 'Filières diverses',
 'Variable selon filière',
 'Dossier de candidature',
 NULL, NULL),

('Université Souleymane Niang (USNM)', 'Public', 'Matam',
 'Filières à préciser (ouverture prévue octobre 2026)',
 'Frais subventionnés par l''État (à confirmer à l''ouverture)',
 'Nouvelle université publique en cours d''ouverture, orientation via Campusen',
 NULL, NULL),

('Centre Ouest Africain de Formation et d''Études Bancaires (COFEB)', 'Public', 'Dakar',
 'Banque, Finance, Économie (diplôme équivalent Master II)',
 'Frais pris en charge dans le cadre institutionnel BCEAO/UEMOA',
 'Centre de formation bancaire et financière de la BCEAO, formations diplômantes et sessions spécialisées pour cadres de banques et administrations économiques de l''UEMOA',
 NULL, NULL);

-- ============ BOURSES ADDITIONNELLES ============

INSERT INTO bourses (nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature) VALUES
('Bourses ITEC (India Technical and Economic Cooperation)', 'Inde',
 'Formations courtes entièrement prises en charge (frais + logement + allocation)',
 NULL,
 'Programmes de formation professionnelle courte durée (2 semaines à 3 mois) dans divers domaines techniques et de gestion',
 NULL),

('Bourse d''excellence TotalEnergies Sénégal', 'Sénégal',
 'Variable selon programme',
 NULL,
 'Excellents résultats académiques, filières liées à l''énergie et aux sciences de l''ingénieur, se renseigner auprès de la Fondation TotalEnergies',
 NULL);
