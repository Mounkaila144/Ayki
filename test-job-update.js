const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Données de test pour la création d'un utilisateur recruteur
const testRecruiter = {
  phone: '90123456', // Numéro du Niger valide
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'Recruiter',
  userType: 'recruiter'
};

// Données de test pour la création d'une entreprise
const testCompany = {
  name: 'Test Company',
  description: 'Une entreprise de test',
  industry: 'Technology',
  size: 'medium',
  location: 'Paris, France',
  website: 'https://test-company.com'
};

// Données de test pour la création d'une offre d'emploi
const testJobOffer = {
  title: 'Développeur Full Stack',
  description: 'Nous recherchons un développeur full stack expérimenté',
  requirements: 'React, Node.js, TypeScript',
  location: 'Paris',
  employmentType: 'full-time',
  experienceLevel: 'mid',
  remotePolicy: 'hybrid',
  salaryMin: '45000',
  salaryMax: '65000',
  currency: 'EUR',
  isUrgent: false,
  isFeatured: false
};

// Données de test pour la mise à jour
const updateJobData = {
  title: 'Senior Développeur Full Stack',
  description: 'Nous recherchons un développeur full stack senior',
  salaryMin: '55000',
  salaryMax: '75000',
  experienceLevel: 'senior',
  isUrgent: true,
  isFeatured: true
};

async function testJobUpdate() {
  let authToken = null;
  let jobId = null;

  try {
    console.log('🚀 Début du test de mise à jour des offres d\'emploi...\n');

    // 1. Inscription du recruteur
    console.log('1. Inscription du recruteur...');
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, testRecruiter);
      console.log('✅ Recruteur inscrit avec succès');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️  Recruteur déjà existant, on continue...');
      } else {
        throw error;
      }
    }

    // 2. Connexion du recruteur
    console.log('2. Connexion du recruteur...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      phone: testRecruiter.phone,
      password: testRecruiter.password
    });
    authToken = loginResponse.data.access_token;
    console.log('✅ Connexion réussie');

    // 3. Création d'une entreprise (si nécessaire)
    console.log('3. Création de l\'entreprise...');
    try {
      await axios.post(`${API_BASE_URL}/companies`, testCompany, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Entreprise créée avec succès');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️  Entreprise déjà existante, on continue...');
      } else {
        console.log('⚠️  Erreur lors de la création de l\'entreprise:', error.response?.data?.message || error.message);
      }
    }

    // 4. Création d'une offre d'emploi
    console.log('4. Création de l\'offre d\'emploi...');
    const createJobResponse = await axios.post(`${API_BASE_URL}/jobs`, testJobOffer, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    jobId = createJobResponse.data.id;
    console.log('✅ Offre d\'emploi créée avec succès, ID:', jobId);
    console.log('   Titre:', createJobResponse.data.title);
    console.log('   Salaire:', createJobResponse.data.salaryMin, '-', createJobResponse.data.salaryMax, createJobResponse.data.currency);

    // 5. Test de mise à jour de l'offre d'emploi (le test principal)
    console.log('\n🎯 5. Test de mise à jour de l\'offre d\'emploi...');
    console.log('   Données à mettre à jour:', JSON.stringify(updateJobData, null, 2));
    
    const updateResponse = await axios.patch(`${API_BASE_URL}/jobs/${jobId}`, updateJobData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Mise à jour réussie !');
    console.log('   Nouveau titre:', updateResponse.data.title);
    console.log('   Nouveau salaire:', updateResponse.data.salaryMin, '-', updateResponse.data.salaryMax, updateResponse.data.currency);
    console.log('   Niveau d\'expérience:', updateResponse.data.experienceLevel);
    console.log('   Urgent:', updateResponse.data.isUrgent);
    console.log('   En vedette:', updateResponse.data.isFeatured);

    // 6. Vérification que les données ont bien été mises à jour
    console.log('\n6. Vérification des données mises à jour...');
    const getJobResponse = await axios.get(`${API_BASE_URL}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const updatedJob = getJobResponse.data;
    console.log('✅ Données récupérées avec succès');
    
    // Vérifications
    const checks = [
      { field: 'title', expected: updateJobData.title, actual: updatedJob.title },
      { field: 'salaryMin', expected: updateJobData.salaryMin, actual: updatedJob.salaryMin },
      { field: 'salaryMax', expected: updateJobData.salaryMax, actual: updatedJob.salaryMax },
      { field: 'experienceLevel', expected: updateJobData.experienceLevel, actual: updatedJob.experienceLevel },
      { field: 'isUrgent', expected: updateJobData.isUrgent, actual: updatedJob.isUrgent },
      { field: 'isFeatured', expected: updateJobData.isFeatured, actual: updatedJob.isFeatured }
    ];

    let allChecksPass = true;
    checks.forEach(check => {
      const passed = check.expected == check.actual; // Utilisation de == pour gérer les conversions de type
      console.log(`   ${passed ? '✅' : '❌'} ${check.field}: ${check.actual} ${passed ? '(OK)' : `(attendu: ${check.expected})`}`);
      if (!passed) allChecksPass = false;
    });

    if (allChecksPass) {
      console.log('\n🎉 SUCCÈS ! Toutes les vérifications sont passées.');
      console.log('   Le problème de l\'erreur 500 lors de la mise à jour a été résolu !');
    } else {
      console.log('\n⚠️  Certaines vérifications ont échoué.');
    }

  } catch (error) {
    console.error('\n❌ ERREUR lors du test:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message || error.message);
    console.error('   Détails:', error.response?.data);
    
    if (error.response?.status === 500) {
      console.error('\n💡 L\'erreur 500 persiste. Vérifiez les logs du serveur pour plus de détails.');
    }
  } finally {
    // Nettoyage optionnel
    if (jobId && authToken) {
      try {
        console.log('\n🧹 Nettoyage: suppression de l\'offre de test...');
        await axios.delete(`${API_BASE_URL}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Offre supprimée');
      } catch (error) {
        console.log('⚠️  Erreur lors de la suppression:', error.response?.data?.message || error.message);
      }
    }
  }
}

// Exécution du test
testJobUpdate();
