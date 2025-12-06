const mysql = require('mysql2/promise');

async function checkSkills() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ayki_db'
    });

    console.log('✓ Connecté à la base de données\n');

    // Vérifier la structure de user_skills
    console.log('--- Structure de user_skills ---');
    const [structure] = await connection.query(`
      DESCRIBE user_skills
    `);
    console.table(structure);

    // Récupérer quelques compétences avec leurs niveaux
    console.log('\n--- Compétences de l\'utilisateur 114bf29d% ---');
    const [skills] = await connection.query(`
      SELECT
        us.id,
        us.level,
        us.yearsOfExperience,
        s.name as skillName
      FROM user_skills us
      LEFT JOIN skills s ON us.skillId = s.id
      WHERE us.userId LIKE '114bf29d%'
      ORDER BY us.createdAt DESC
      LIMIT 10
    `);

    if (skills.length === 0) {
      console.log('⚠ Aucune compétence trouvée pour cet utilisateur');

      // Chercher tous les utilisateurs avec des compétences
      console.log('\n--- Tous les utilisateurs avec compétences ---');
      const [allSkills] = await connection.query(`
        SELECT
          us.userId,
          us.level,
          us.yearsOfExperience,
          s.name as skillName,
          up.firstName,
          up.lastName
        FROM user_skills us
        LEFT JOIN skills s ON us.skillId = s.id
        LEFT JOIN user_profiles up ON us.userId = up.userId
        LIMIT 20
      `);
      console.table(allSkills);
    } else {
      console.table(skills);
    }

  } catch (error) {
    console.error('✗ Erreur:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkSkills();
