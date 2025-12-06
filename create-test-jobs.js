const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Données de test réalistes pour créer des offres d'emploi
const testJobs = [
  {
    title: 'Développeur React Senior',
    description: 'Nous recherchons un développeur React senior pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies comme React 18, TypeScript, et Next.js. Vous serez responsable du développement de nouvelles fonctionnalités et de l\'amélioration de l\'expérience utilisateur.',
    requirements: 'React, TypeScript, Node.js, 5+ ans d\'expérience, Git, Jest, Redux, GraphQL',
    responsibilities: 'Développement de nouvelles fonctionnalités, code review, mentoring des développeurs juniors, architecture frontend, optimisation des performances',
    benefits: 'Télétravail flexible, formation continue, mutuelle premium, tickets restaurant, 13ème mois',
    location: 'Paris, France',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    remotePolicy: 'hybrid',
    salaryMin: '55000',
    salaryMax: '75000',
    currency: 'EUR',
    positions: 2,
    isUrgent: false,
    isFeatured: true,
    isActive: true,
    status: 'active'
  },
  {
    title: 'Designer UX/UI Junior',
    description: 'Rejoignez notre équipe design pour créer des expériences utilisateur exceptionnelles. Poste idéal pour un designer junior motivé souhaitant évoluer dans une startup dynamique. Vous participerez à la conception d\'interfaces modernes et intuitives.',
    requirements: 'Figma, Adobe Creative Suite, portfolio requis, bases en HTML/CSS, Sketch, Principle',
    responsibilities: 'Création de maquettes, tests utilisateurs, collaboration avec les développeurs, recherche UX, wireframing',
    benefits: 'Formation design, équipement fourni, ambiance startup, événements équipe, budget formation',
    location: 'Lyon, France',
    employmentType: 'full_time',
    experienceLevel: 'junior',
    remotePolicy: 'on_site',
    salaryMin: '35000',
    salaryMax: '45000',
    currency: 'EUR',
    positions: 1,
    isUrgent: true,
    isFeatured: false,
    isActive: true,
    status: 'active'
  },
  {
    title: 'Développeur Full Stack Freelance',
    description: 'Mission freelance pour développer une application web complète dans le domaine de la fintech. Projet passionnant avec une startup en croissance. Vous travaillerez en autonomie sur l\'ensemble de la stack technique.',
    requirements: 'JavaScript, Python, React, Django, PostgreSQL, Docker, AWS, autonomie',
    responsibilities: 'Développement frontend et backend, déploiement, maintenance, documentation technique, tests',
    benefits: 'Tarif attractif, flexibilité horaire, projet innovant, possibilité de prolongation, télétravail total',
    location: 'Remote',
    employmentType: 'freelance',
    experienceLevel: 'mid',
    remotePolicy: 'remote',
    salaryMin: '400',
    salaryMax: '600',
    currency: 'EUR',
    positions: 1,
    isUrgent: false,
    isFeatured: false,
    isActive: true,
    status: 'active'
  },
  {
    title: 'Stage Développement Mobile',
    description: 'Stage de 6 mois dans une équipe mobile pour développer des applications iOS et Android. Excellente opportunité d\'apprentissage dans une entreprise reconnue. Vous participerez au développement d\'applications utilisées par des milliers d\'utilisateurs.',
    requirements: 'React Native ou Flutter, motivation, études en informatique, bases en Git, JavaScript',
    responsibilities: 'Développement d\'applications mobiles, tests, documentation, participation aux réunions équipe, veille technologique',
    benefits: 'Encadrement personnalisé, formation, possibilité d\'embauche, tickets restaurant, transport remboursé',
    location: 'Toulouse, France',
    employmentType: 'internship',
    experienceLevel: 'entry',
    remotePolicy: 'hybrid',
    salaryMin: '800',
    salaryMax: '1200',
    currency: 'EUR',
    positions: 2,
    isUrgent: false,
    isFeatured: false,
    isActive: true,
    status: 'active'
  },
  {
    title: 'Lead Developer',
    description: 'Poste de lead developer pour encadrer une équipe de 5 développeurs et définir l\'architecture technique de nos produits. Leadership technique et vision stratégique requis. Vous serez responsable de la roadmap technique et de la montée en compétences de l\'équipe.',
    requirements: 'Leadership, architecture logicielle, 8+ ans d\'expérience, microservices, cloud, Kubernetes',
    responsibilities: 'Management technique, architecture, code review, recrutement, formation équipe, définition des standards',
    benefits: 'Salaire attractif, stock-options, télétravail total, budget formation, conférences',
    location: 'Bordeaux, France',
    employmentType: 'full_time',
    experienceLevel: 'lead',
    remotePolicy: 'flexible',
    salaryMin: '70000',
    salaryMax: '90000',
    currency: 'EUR',
    positions: 1,
    isUrgent: true,
    isFeatured: true,
    isActive: true,
    status: 'active'
  },
  {
    title: 'Data Scientist',
    description: 'Rejoignez notre équipe data pour analyser et modéliser des données complexes. Vous travaillerez sur des projets d\'IA et de machine learning passionnants dans le domaine de la santé. Impact direct sur l\'amélioration des soins.',
    requirements: 'Python, R, Machine Learning, SQL, statistiques, PhD ou Master, TensorFlow, PyTorch',
    responsibilities: 'Analyse de données, modélisation ML, visualisation, présentation résultats, recherche appliquée',
    benefits: 'Recherche appliquée, conférences, publications, environnement stimulant, impact social',
    location: 'Grenoble, France',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    remotePolicy: 'hybrid',
    salaryMin: '50000',
    salaryMax: '70000',
    currency: 'EUR',
    positions: 1,
    isUrgent: false,
    isFeatured: true,
    isActive: true,
    status: 'active'
  }
];

async function createTestJobs() {
  console.log('🚀 Création d\'offres d\'emploi de test avec données réalistes...\n');

  for (let i = 0; i < testJobs.length; i++) {
    const job = testJobs[i];
    try {
      console.log(`📝 Création de l'offre ${i + 1}/${testJobs.length}: ${job.title}`);
      
      const response = await axios.post(`${API_BASE_URL}/jobs`, job, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        console.log(`   ✅ Offre créée avec succès (ID: ${response.data.id})`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`   ⚠️  Authentification requise pour créer l'offre "${job.title}"`);
        console.log(`   💡 Vous devez être connecté en tant que recruteur pour créer des offres`);
      } else if (error.response?.status === 400) {
        console.log(`   ❌ Erreur de validation pour "${job.title}":`, error.response?.data?.message);
      } else {
        console.log(`   ❌ Erreur pour "${job.title}":`, error.response?.status, error.response?.data?.message);
      }
    }
  }
}

async function testJobListingAPI() {
  console.log('\n🔍 Test de l\'API de récupération des offres...\n');

  try {
    const response = await axios.get(`${API_BASE_URL}/jobs`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ API de récupération fonctionnelle`);
    console.log(`📊 Nombre d'offres récupérées: ${response.data.length}`);
    
    if (response.data.length > 0) {
      console.log('\n📋 Aperçu des offres:');
      response.data.forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} - ${job.company?.name || 'Entreprise non spécifiée'}`);
        console.log(`      📍 ${job.location || 'Localisation non spécifiée'}`);
        console.log(`      💼 ${job.employmentType} - ${job.experienceLevel}`);
        console.log(`      💰 ${job.salaryMin || '?'} - ${job.salaryMax || '?'} ${job.currency || 'EUR'}`);
        console.log(`      🏷️  ${job.isFeatured ? '⭐ En vedette' : ''} ${job.isUrgent ? '🔥 Urgent' : ''}`);
        console.log('');
      });
    }

  } catch (error) {
    console.log('❌ Erreur lors de la récupération des offres:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
  }
}

async function runTests() {
  console.log('🎯 CRÉATION ET TEST DES OFFRES D\'EMPLOI\n');
  console.log('=' .repeat(60));
  
  await createTestJobs();
  await testJobListingAPI();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Tests terminés !');
  console.log('\n📋 Résumé:');
  console.log('   - Tentative de création d\'offres de test (nécessite authentification)');
  console.log('   - Test de l\'API de récupération des offres (fonctionne sans auth)');
  console.log('\n🚀 Le composant JobListings devrait maintenant afficher les vraies données !');
  console.log('\n💡 Pour tester complètement:');
  console.log('   1. Démarrez le serveur frontend: npm run dev');
  console.log('   2. Allez sur /dashboard/candidate');
  console.log('   3. Cliquez sur l\'onglet "Annonces"');
  console.log('   4. Vous devriez voir les offres d\'emploi de la base de données');
}

runTests();
