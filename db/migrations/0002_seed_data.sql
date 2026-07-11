-- Seed data for ecoles
INSERT INTO ecoles (nom, type, ville, filieres, frais, conditions_admission, contact, site_web) VALUES
('École Supérieure Polytechnique de Dakar (ESP)', 'Public', 'Dakar', 
 'Génie Informatique, Génie Électrique, Génie Civil, Génie Chimique et Biologie Appliquée, Gestion', 
 'Gratuit (régime boursier d''État), droits d''inscription d''environ 150 000 FCFA/an.', 
 'Sélection sur dossier académique et épreuves de concours d''entrée pour les bacheliers de l''année.', 
 '+221 33 864 51 96 / scolarite@esp.sn', 'https://www.esp.sn'),

('École Polytechnique de Thiès (EPT)', 'Public', 'Thiès', 
 'Génie Civil, Génie Électromécanique, Génie Informatique et Télécommunications', 
 'Gratuit (régime boursier), inscription annuelle de 100 000 FCFA.', 
 'Concours national d''entrée après le Baccalauréat (Séries S1, S2, S3, T).', 
 '+221 33 951 13 96 / info@ept.sn', 'https://www.ept.sn'),

('Université Cheikh Anta Diop (UCAD)', 'Public', 'Dakar', 
 'Médecine, Sciences Juridiques, Lettres et Sciences Humaines, Sciences et Technologies, Sciences Économiques', 
 '25 000 FCFA/an (droits d''inscription réglementés).', 
 'Titulaire du Baccalauréat sénégalais ou équivalent, pré-inscription en ligne via la plateforme d''orientation Campusen.', 
 '+221 33 825 05 30 / rectorat@ucad.edu.sn', 'https://www.ucad.sn'),

('Université Gaston Berger (UGB)', 'Public', 'Saint-Louis', 
 'Sciences Appliquées, Technologies, Sciences de la Santé, Sciences Juridiques et Politiques, Économie et Gestion', 
 '25 000 FCFA/an.', 
 'Sélection et orientation nationale par le ministère de l''Enseignement Supérieur (Plateforme Campusen).', 
 '+221 33 961 23 56 / info@ugb.sn', 'https://www.ugb.sn'),

('Institut Supérieur de Management (ISM)', 'Privé', 'Dakar', 
 'Management, Marketing, Finance, Droit des Affaires, Management de Projets, Sciences Politiques', 
 'À partir de 1 800 000 FCFA/an.', 
 'Dossier de candidature + Test écrit d''aptitudes logiques et linguistiques + Entretien de motivation.', 
 '+221 33 869 76 76 / admission@ism.edu.sn', 'https://www.ism.sn');

-- Seed data for concours
INSERT INTO concours (nom, filieres, date_limite, conditions, ecoles_liees) VALUES
('Concours d''Entrée à l''École Supérieure Polytechnique (ESP)', 
 'Génie Informatique, Génie Civil, Génie Électrique, Gestion, Biologie Appliquée', 
 '2026-07-28', 
 'Être titulaire du Baccalauréat de l''année en cours dans les séries scientifiques ou techniques (S, T, G), âge maximum de 22 ans au 1er octobre.', 
 'ESP Dakar'),

('Concours d''Entrée à l''École Polytechnique de Thiès (EPT)', 
 'Génie Civil, Électromécanique, Télécommunications', 
 '2026-08-05', 
 'Être titulaire d''un Bac scientifique (S1, S2, S3, T) de l''année en cours, moyenne académique élevée requise en Mathématiques et Physique.', 
 'EPT Thiès'),

('Concours de l''École Nationale d''Économie Appliquée (ENEA/ISSEG)', 
 'Planification Économique, Statistique, Démographie, Aménagement du Territoire', 
 '2026-07-22', 
 'Ouvert aux bacheliers sénégalais toutes séries ou titulaires d''un diplôme équivalent, âge limite de 25 ans.', 
 'ISSEG Dakar (ex-ENEA)');

-- Seed data for bourses
INSERT INTO bourses (nom, pays, montant, date_limite, conditions_eligibilite, lien_candidature) VALUES
('Bourse Nationale d''Excellence du Sénégal', 'Sénégal', 
 '60 000 FCFA / mois + indemnités annuelles d''équipement', 
 '2026-08-10', 
 'Avoir la nationalité sénégalaise, être titulaire du Baccalauréat avec mention Bien ou Très Bien, et être régulièrement inscrit dans un établissement public d''enseignement supérieur au Sénégal.', 
 'https://www.campusen.sn'),

('Bourse d''Excellence Eiffel (Gouvernement Français)', 'France', 
 '1 181 € / mois (Master) ou 1 800 € / mois (Doctorat) + transport et couverture santé', 
 '2026-08-01', 
 'Réservé aux étudiants étrangers d''excellence présentés par un établissement d''enseignement supérieur français pour une formation de Master ou de Doctorat. Âge maximum de 25 ans.', 
 'https://www.campusfrance.org'),

('Bourse de Coopération Marocaine (AMCI)', 'Maroc', 
 'Allocation de subsistance mensuelle + exonération totale des frais d''inscription universitaire', 
 '2026-07-20', 
 'Être de nationalité sénégalaise, titulaire du Baccalauréat de l''année avec mention, sélection et dépôt des dossiers gérés par la Direction des Bourses du Sénégal.', 
 'https://www.amci.ma');

-- Seed data for etudes_etranger
INSERT INTO etudes_etranger (pays, procedures, cout_vie_estime, partenaires, visa_info) VALUES
('France', 
 '1. Création de dossier sur la plateforme en ligne Campus France Sénégal.
2. Choix des formations et soumission du dossier académique.
3. Entretien d''évaluation académique obligatoire.
4. Réception des avis d''admission des établissements.
5. Dépôt de la demande de visa après acceptation définitive.', 
 'Environ 800 € à 1 000 € / mois (logement, transports, nourriture et assurance compris).', 
 'Campus France Sénégal, Universités publiques françaises (Sorbonne, Lyon, Montpellier...) et Grandes Écoles.', 
 'Passeport valide, attestation d''admission de Campus France, justificatif de ressources financières minimales (bloquées ou garanties d''au moins 615 €/mois), et attestation d''hébergement en France.'),

('Canada', 
 '1. Demande d''admission directement auprès des universités canadiennes (DLI).
2. Obtention de la Lettre d''Acceptation officielle.
3. Demande de Certificat d''Acceptation du Québec (CAQ) si vous étudiez au Québec.
4. Dépôt en ligne de la demande de Permis d''Études auprès d''Immigration, Réfugiés et Citoyenneté Canada (IRCC).', 
 'Environ 1 500 CAD à 2 000 CAD / mois selon la province (excluant les frais de scolarité).', 
 'Universités canadiennes (Laval, Montréal, Ottawa, Sherbrooke...) et Collèges agréés.', 
 'Preuve de lettre d''acceptation, preuve de ressources financières suffisantes pour couvrir les frais de subsistance (au moins 20 635 CAD/an) plus les frais de scolarité, et examen médical.'),

('Maroc', 
 '1. Candidature auprès de l''AMCI via la Direction des Bourses du Sénégal (pour les bourses).
2. Dépôt direct auprès des universités privées ou instituts marocains.
3. Validation de l''inscription officielle.
4. Demande de visa d''études auprès de l''Ambassade du Maroc à Dakar.', 
 'Environ 3 500 DH à 5 000 DH / mois (~220 000 à 320 000 FCFA).', 
 'AMCI (Agence Marocaine de Coopération Internationale), Université Mohammed V de Rabat, Université Cadi Ayyad de Marrakech.', 
 'Passeport valide, attestation d''admission, justificatif d''hébergement au Maroc, et preuve de moyens financiers suffisants pour la durée du séjour.');
