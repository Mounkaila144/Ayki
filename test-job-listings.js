const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Données de test pour créer quelques offres d'emploi
const testJobs = [
  {
    title: 'Développeur React Senior',
    description: 'Nous recherchons un développeur React senior pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies.',
    requirements: 'React, TypeScript, Node.js, 5+ ans d\'expérience',
    responsibilities: 'Développement de nouvelles fonctionnalités, code review, mentoring des juniors',
    benefits: 'Télétravail flexible, formation continue, mutuelle premium',
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
    isActive: true
  },
  {
    title: 'Designer UX/UI Junior',
    description: 'Rejoignez notre équipe design pour créer des expériences utilisateur exceptionnelles. Poste idéal pour un junior motivé.',
    requirements: 'Figma, Adobe Creative Suite, portfolio requis',
    responsibilities: 'Création de maquettes, tests utilisateurs, collaboration avec les développeurs',
    benefits: 'Formation, équipement fourni, ambiance startup',
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
    isActive: true
  },
  {
    title: 'Développeur Full Stack Freelance',
    description: 'Mission freelance pour développer une application web complète. Projet passionnant avec une startup en croissance.',
    requirements: 'JavaScript, Python, bases de données, autonomie',
    responsibilities: 'Développement frontend et backend, déploiement, maintenance',
    benefits: 'Tarif attractif, flexibilité, projet innovant',
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
    isActive: true
  },
  {
    title: 'Stage Développement Mobile',
    description: 'Stage de 6 mois dans une équipe mobile pour développer des applications iOS et Android.',
    requirements: 'React Native ou Flutter, motivation, études en informatique',
    responsibilities: 'Développement d\'applications mobiles, tests, documentation',
    benefits: 'Encadrement, formation, possibilité d\'embauche',
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
    isActive: true
  },
  {
    title: 'Lead Developer',
    description: 'Poste de lead developer pour encadrer une équipe de 5 développeurs et définir l\'architecture technique.',
    requirements: 'Leadership, architecture logicielle, 8+ ans d\'expérience',
    responsibilities: 'Management technique, architecture, code review, recrutement',
    benefits: 'Salaire attractif, stock-options, télétravail total',
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
    isActive: true
  }
];

async function createTestJobs() {
  console.log('🚀 Création d\'offres d\'emploi de test...\n');

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
      response.data.slice(0, 3).forEach((job, index) => {
        console.log(`   ${index + 1}. ${job.title} - ${job.company?.name || 'Entreprise non spécifiée'}`);
        console.log(`      📍 ${job.location || 'Localisation non spécifiée'}`);
        console.log(`      💼 ${job.employmentType} - ${job.experienceLevel}`);
        console.log(`      💰 ${job.salaryMin || '?'} - ${job.salaryMax || '?'} ${job.currency || 'EUR'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.log('❌ Erreur lors de la récupération des offres:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
  }
}

async function testJobFiltering() {
  console.log('\n🔎 Test des filtres...\n');

  const filterTests = [
    {
      name: 'Filtrage par type de contrat (full_time)',
      params: { employmentType: 'full_time' }
    },
    {
      name: 'Filtrage par niveau d\'expérience (senior)',
      params: { experienceLevel: 'senior' }
    },
    {
      name: 'Filtrage par politique de télétravail (remote)',
      params: { remotePolicy: 'remote' }
    },
    {
      name: 'Recherche par mot-clé (React)',
      params: { search: 'React' }
    },
    {
      name: 'Filtrage par localisation (Paris)',
      params: { location: 'Paris' }
    }
  ];

  for (const test of filterTests) {
    try {
      const queryParams = new URLSearchParams(test.params).toString();
      const response = await axios.get(`${API_BASE_URL}/jobs?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ ${test.name}: ${response.data.length} résultat(s)`);
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur ${error.response?.status}`);
    }
  }
}

async function runAllTests() {
  console.log('🎯 TESTS DU COMPOSANT JOB LISTINGS\n');
  console.log('=' .repeat(50));
  
  await createTestJobs();
  await testJobListingAPI();
  await testJobFiltering();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Tests terminés !');
  console.log('\n📋 Résumé:');
  console.log('   - Création d\'offres de test (peut nécessiter une authentification)');
  console.log('   - Test de l\'API de récupération des offres');
  console.log('   - Test des filtres de recherche');
  console.log('\n🚀 Le composant JobListings devrait maintenant fonctionner avec des données !');
  console.log('\n💡 Pour tester complètement:');
  console.log('   1. Démarrez le serveur frontend: npm run dev');
  console.log('   2. Allez sur /dashboard/candidate');
  console.log('   3. Cliquez sur l\'onglet "Annonces"');
  console.log('   4. Testez la recherche et les filtres');
}

runAllTests();
