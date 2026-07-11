-- Migration 0003_filieres_seed: Import des filières de base pour le quiz d'orientation

INSERT INTO filieres (nom, description) VALUES
('Sciences & Ingénierie', 'Études scientifiques, physique, chimie, mathématiques, ingénierie et technologies industrielles.'),
('Informatique & Numérique', 'Développement logiciel, réseaux, intelligence artificielle, cybersécurité et systèmes d''information.'),
('Santé & Médecine', 'Études médicales, pharmaceutiques, odontologie, soins infirmiers et professions paramédicales.'),
('Sciences Sociales & Travail Social', 'Sociologie, psychologie, assistance sociale, anthropologie et médiation communautaire.'),
('Droit & Sciences Politiques', 'Études juridiques, droit public et privé, relations internationales et sciences politiques.'),
('Économie & Gestion', 'Gestion d''entreprise, comptabilité, finance, marketing, commerce et sciences économiques.'),
('Lettres & Sciences Humaines', 'Langues, histoire, géographie, philosophie et littérature.'),
('Agriculture & Environnement', 'Agronomie, foresterie, gestion de l''eau, développement durable et sciences environnementales.'),
('Arts, Communication et Journalisme', 'Design, arts plastiques, journalisme, relations publiques et communication d''entreprise.'),
('Tourisme & Hôtellerie', 'Gestion d''hôtels, agences de voyage, guidage touristique et valorisation du patrimoine.');
