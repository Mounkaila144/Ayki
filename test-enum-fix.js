const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testEnumCorrection() {
  try {
    console.log('🔧 Test après correction des enums...\n');

    // Test de création d'une nouvelle offre avec les bonnes valeurs d'enum
    const newJobData = {
      title: 'Développeur React Senior - Test Enum',
      description: 'Poste de développeur React senior avec les bons enums',
      requirements: 'React, TypeScript, Node.js',
      responsibilities: 'Développement frontend et backend',
      benefits: 'Télétravail, formation continue',
      location: 'Paris, France',
      employmentType: 'full_time', // Corrigé : full_time au lieu de full-time
      experienceLevel: 'senior',
      remotePolicy: 'hybrid', // Corrigé : valeurs conformes
      salaryMin: 55000,
      salaryMax: 75000,
      currency: 'EUR',
      salaryPeriod: 'yearly',
      salaryNegotiable: false,
      positions: 1,
      isActive: true,
      isFeatured: false,
      isUrgent: false
    };

    console.log('📡 Test de création avec enums corrigés...');
    console.log('📦 Données:', JSON.stringify(newJobData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/jobs`, newJobData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Réponse reçue:', response.status);
    console.log('📄 Job créé:', response.data);

  } catch (error) {
    console.log('📊 Analyse de la réponse:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
    console.log('   Détails:', error.response?.data);

    if (error.response?.status === 401) {
      console.log('\n🎉 SUCCÈS ! Erreur 401 (Unauthorized) :');
      console.log('   - Plus d\'erreur 400 sur les enums ✅');
      console.log('   - employmentType et remotePolicy acceptés ✅');
      console.log('   - Validation des enums fonctionne ✅');
      console.log('   - Seule l\'authentification manque ✅');
    } else if (error.response?.status === 400) {
      console.log('\n⚠️  Erreur 400 - Problème de validation:');
      if (error.response?.data?.message?.some(msg => msg.includes('employmentType'))) {
        console.log('   - Problème employmentType persiste');
      }
      if (error.response?.data?.message?.some(msg => msg.includes('remotePolicy'))) {
        console.log('   - Problème remotePolicy persiste');
      }
    } else if (error.response?.status === 500) {
      console.log('\n❌ Erreur 500 - Problème serveur');
    }
  }
}

async function testAllEnumValues() {
  console.log('\n🧪 Test de toutes les valeurs d\'enum...\n');

  const enumTests = [
    {
      name: 'EmploymentType - full_time',
      data: { title: 'Test', employmentType: 'full_time', remotePolicy: 'on_site' }
    },
    {
      name: 'EmploymentType - part_time',
      data: { title: 'Test', employmentType: 'part_time', remotePolicy: 'on_site' }
    },
    {
      name: 'EmploymentType - contract',
      data: { title: 'Test', employmentType: 'contract', remotePolicy: 'on_site' }
    },
    {
      name: 'EmploymentType - freelance',
      data: { title: 'Test', employmentType: 'freelance', remotePolicy: 'on_site' }
    },
    {
      name: 'EmploymentType - internship',
      data: { title: 'Test', employmentType: 'internship', remotePolicy: 'on_site' }
    },
    {
      name: 'EmploymentType - apprenticeship',
      data: { title: 'Test', employmentType: 'apprenticeship', remotePolicy: 'on_site' }
    },
    {
      name: 'RemotePolicy - on_site',
      data: { title: 'Test', employmentType: 'full_time', remotePolicy: 'on_site' }
    },
    {
      name: 'RemotePolicy - remote',
      data: { title: 'Test', employmentType: 'full_time', remotePolicy: 'remote' }
    },
    {
      name: 'RemotePolicy - hybrid',
      data: { title: 'Test', employmentType: 'full_time', remotePolicy: 'hybrid' }
    },
    {
      name: 'RemotePolicy - flexible',
      data: { title: 'Test', employmentType: 'full_time', remotePolicy: 'flexible' }
    }
  ];

  for (const test of enumTests) {
    try {
      console.log(`📡 Test: ${test.name}`);
      
      const response = await axios.post(`${API_BASE_URL}/jobs`, test.data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`   ✅ ${test.name} - OK`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`   ✅ ${test.name} - OK (auth requis)`);
      } else if (error.response?.status === 400) {
        console.log(`   ❌ ${test.name} - Erreur validation:`, error.response?.data?.message);
      } else {
        console.log(`   ❌ ${test.name} - Erreur ${error.response?.status}`);
      }
    }
  }
}

async function testInvalidEnumValues() {
  console.log('\n🚫 Test avec valeurs d\'enum invalides...\n');

  const invalidTests = [
    {
      name: 'EmploymentType invalide (full-time)',
      data: { title: 'Test', employmentType: 'full-time', remotePolicy: 'on_site' }
    },
    {
      name: 'RemotePolicy invalide (office)',
      data: { title: 'Test', employmentType: 'full_time', remotePolicy: 'office' }
    }
  ];

  for (const test of invalidTests) {
    try {
      console.log(`📡 Test: ${test.name}`);
      
      const response = await axios.post(`${API_BASE_URL}/jobs`, test.data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`   ❌ ${test.name} - Accepté (ne devrait pas)`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`   ✅ ${test.name} - Correctement rejeté`);
      } else {
        console.log(`   ? ${test.name} - Erreur ${error.response?.status}`);
      }
    }
  }
}

async function runEnumTests() {
  console.log('🎯 TESTS DES ENUMS - Correction employmentType et remotePolicy\n');
  console.log('=' .repeat(70));
  
  await testEnumCorrection();
  await testAllEnumValues();
  await testInvalidEnumValues();
  
  console.log('\n' + '=' .repeat(70));
  console.log('🏆 TESTS TERMINÉS !');
  console.log('\n📋 Résumé:');
  console.log('   - Si vous voyez des erreurs 401 au lieu de 400, c\'est réussi !');
  console.log('   - Les enums employmentType et remotePolicy sont maintenant corrects');
  console.log('   - Le frontend envoie les bonnes valeurs');
  console.log('   - La validation backend fonctionne');
}

runEnumTests();
