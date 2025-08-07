// Script de test pour créer des annonces de recruteurs
const testJobData = {
  title: "Développeur Full Stack React/Node.js",
  description: "Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant React et Node.js.",
  requirements: "- 3+ années d'expérience en développement web\n- Maîtrise de React et Node.js\n- Connaissance de TypeScript\n- Expérience avec les bases de données (MongoDB, PostgreSQL)",
  location: "Paris, France",
  employmentType: "full_time",
  experienceLevel: "mid",
  remotePolicy: "hybrid",
  salaryMin: "45000",
  salaryMax: "55000",
  currency: "EUR",
  isUrgent: false,
  isFeatured: true,
  status: "published"
};

const testJobData2 = {
  title: "Designer UX/UI Senior",
  description: "Rejoignez notre équipe créative en tant que Designer UX/UI Senior. Vous concevrez des expériences utilisateur exceptionnelles pour nos produits digitaux.",
  requirements: "- 5+ années d'expérience en design UX/UI\n- Maîtrise de Figma, Sketch, Adobe Creative Suite\n- Portfolio démontrant des projets web et mobile\n- Expérience en recherche utilisateur",
  location: "Lyon, France",
  employmentType: "full_time",
  experienceLevel: "senior",
  remotePolicy: "remote",
  salaryMin: "50000",
  salaryMax: "65000",
  currency: "EUR",
  isUrgent: true,
  isFeatured: false,
  status: "published"
};

console.log("Données de test prêtes pour la création d'annonces de recruteurs");
console.log("Job 1:", JSON.stringify(testJobData, null, 2));
console.log("Job 2:", JSON.stringify(testJobData2, null, 2));