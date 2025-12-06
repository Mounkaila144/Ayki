const mysql = require('mysql2/promise');

async function fixDatabase() {
  let connection;

  try {
    // Créer une connexion à la base de données
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Mettez votre mot de passe MySQL ici si nécessaire
      database: 'ayki_db'
    });

    console.log('✓ Connecté à la base de données MySQL');

    // Vérifier la structure actuelle de user_skills
    console.log('\n--- Structure actuelle de user_skills ---');
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, COLUMN_KEY, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'ayki_db'
      AND TABLE_NAME = 'user_skills'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('Colonnes existantes:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.COLUMN_KEY === 'PRI' ? '[PRIMARY KEY]' : ''}`);
    });

    // Supprimer la table user_skills
    console.log('\n--- Suppression de la table user_skills ---');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('DROP TABLE IF EXISTS user_skills');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Table user_skills supprimée avec succès');

    console.log('\n✓ Opération terminée avec succès!');
    console.log('⚠ Redémarrez maintenant votre serveur NestJS pour que TypeORM recréé la table avec la bonne structure.');

  } catch (error) {
    console.error('✗ Erreur:', error.message);
    console.error('\nSi le problème persiste, exécutez manuellement cette requête SQL:');
    console.error('  SET FOREIGN_KEY_CHECKS = 0;');
    console.error('  DROP TABLE IF EXISTS user_skills;');
    console.error('  SET FOREIGN_KEY_CHECKS = 1;');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Connexion fermée');
    }
  }
}

fixDatabase();
