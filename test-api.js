// Script de test pour vérifier les API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🔍 Test des endpoints API...\n');

  try {
    // Test 1: Vérifier si le serveur répond
    console.log('1. Test de connexion au serveur...');
    const serverResponse = await axios.get('http://localhost:3000');
    console.log('✅ Serveur accessible:', serverResponse.data);

    // Test 2: Test des avis populaires
    console.log('\n2. Test des avis populaires...');
    const reviewsResponse = await axios.get(`${API_BASE}/reviews/popular?limit=5`);
    console.log('✅ Avis populaires:', reviewsResponse.data.length, 'résultats');
    console.log('Données:', JSON.stringify(reviewsResponse.data, null, 2));

    // Test 3: Test des critiques populaires
    console.log('\n3. Test des critiques populaires...');
    const criticsResponse = await axios.get(`${API_BASE}/users/top-critics?limit=3`);
    console.log('✅ Critiques populaires:', criticsResponse.data.length, 'résultats');
    console.log('Données:', JSON.stringify(criticsResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
