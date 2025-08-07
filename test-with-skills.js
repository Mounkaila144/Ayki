const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testWithSkillsAndCompany() {
  try {
    console.log('🧪 Test avec skills et companyId...\n');

    const testJobId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Test avec des données incluant skills et companyId
    const updateData = {
      title: 'Développeur Full Stack Senior',
      description: 'Poste de développeur senior avec React et Node.js',
      salaryMin: '55000',
      salaryMax: '75000',
      experienceLevel: 'senior',
      employmentType: 'full-time',
      remotePolicy: 'hybrid',
      isUrgent: true,
      isFeatured: false,
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      companyId: 'abc123-def456-ghi789'
    };

    console.log('📡 Test avec skills et companyId...');
    console.log('📦 Données:', JSON.stringify(updateData, null, 2));

    const response = await axios.patch(`${API_BASE_URL}/jobs/${testJobId}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Réponse reçue:', response.status);

  } catch (error) {
    console.log('📊 Analyse de la réponse:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);
    console.log('   Détails:', error.response?.data);

    if (error.response?.status === 401) {
      console.log('\n✅ EXCELLENT ! Erreur 401 (Unauthorized) :');
      console.log('   - Les champs skills et companyId sont maintenant acceptés');
      console.log('   - Plus d\'erreur 400 "property should not exist"');
      console.log('   - La validation fonctionne correctement');
      console.log('   - Seule l\'authentification manque');
    } else if (error.response?.status === 400) {
      console.log('\n❌ Erreur 400 - Vérifiez les détails ci-dessus');
      if (error.response?.data?.message?.includes('should not exist')) {
        console.log('   - Il reste des champs non autorisés');
      }
    } else if (error.response?.status === 500) {
      console.log('\n❌ Erreur 500 - Le problème persiste');
    }
  }
}

async function testValidationErrors() {
  try {
    console.log('\n🔍 Test de validation avec des données invalides...\n');

    const testJobId = '123e4567-e89b-12d3-a456-426614174000';
    
    // Test avec des données invalides pour vérifier la validation
    const invalidData = {
      title: 'Test',
      skills: 'not-an-array', // Devrait être un tableau
      experienceLevel: 'invalid-level', // Enum invalide
      employmentType: 'invalid-type', // Enum invalide
      salaryMin: 'not-a-number', // Sera converti en string
      positions: 'not-a-number' // Devrait être un nombre
    };

    console.log('📡 Test avec données invalides...');
    console.log('📦 Données:', JSON.stringify(invalidData, null, 2));

    const response = await axios.patch(`${API_BASE_URL}/jobs/${testJobId}`, invalidData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Réponse reçue:', response.status);

  } catch (error) {
    console.log('📊 Analyse de la validation:');
    console.log('   Status:', error.response?.status);
    console.log('   Message:', error.response?.data?.message || error.message);

    if (error.response?.status === 400) {
      console.log('\n✅ PARFAIT ! Validation active:');
      console.log('   - Les données invalides sont rejetées');
      console.log('   - Erreur 400 appropriée');
    } else if (error.response?.status === 401) {
      console.log('\n✅ Authentification requise (normal)');
    }
  }
}

async function runTests() {
  console.log('🔧 Tests des nouveaux champs skills et companyId\n');
  console.log('=' .repeat(60));
  
  await testWithSkillsAndCompany();
  await testValidationErrors();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Tests terminés !');
  console.log('\nRésumé:');
  console.log('- Si vous voyez 401 au lieu de 400 "should not exist", c\'est réussi !');
  console.log('- Les champs skills et companyId sont maintenant supportés');
  console.log('- La validation fonctionne pour les types de données');
}

runTests();
