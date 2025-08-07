import { DataSource } from 'typeorm';
import { Skill, SkillCategory } from '../../entities/skill.entity';

export async function seedInitialData(dataSource: DataSource) {
  const skillRepository = dataSource.getRepository(Skill);

  // Compétences techniques de base
  const technicalSkills = [
    // Frontend
    { name: 'React', category: SkillCategory.FRAMEWORK, subcategory: 'Frontend' },
    { name: 'Vue.js', category: SkillCategory.FRAMEWORK, subcategory: 'Frontend' },
    { name: 'Angular', category: SkillCategory.FRAMEWORK, subcategory: 'Frontend' },
    { name: 'JavaScript', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'TypeScript', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'HTML', category: SkillCategory.TECHNICAL, subcategory: 'Markup' },
    { name: 'CSS', category: SkillCategory.TECHNICAL, subcategory: 'Styling' },
    { name: 'Sass', category: SkillCategory.TECHNICAL, subcategory: 'Styling' },
    { name: 'Tailwind CSS', category: SkillCategory.FRAMEWORK, subcategory: 'CSS' },

    // Backend
    { name: 'Node.js', category: SkillCategory.TECHNICAL, subcategory: 'Runtime' },
    { name: 'Python', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'Java', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'PHP', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'C#', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'Go', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'Rust', category: SkillCategory.TECHNICAL, subcategory: 'Programming' },
    { name: 'Express.js', category: SkillCategory.FRAMEWORK, subcategory: 'Backend' },
    { name: 'NestJS', category: SkillCategory.FRAMEWORK, subcategory: 'Backend' },
    { name: 'Django', category: SkillCategory.FRAMEWORK, subcategory: 'Backend' },
    { name: 'Flask', category: SkillCategory.FRAMEWORK, subcategory: 'Backend' },
    { name: 'Spring Boot', category: SkillCategory.FRAMEWORK, subcategory: 'Backend' },
    { name: 'Laravel', category: SkillCategory.FRAMEWORK, subcategory: 'Backend' },

    // Bases de données
    { name: 'PostgreSQL', category: SkillCategory.DATABASE, subcategory: 'SQL' },
    { name: 'MySQL', category: SkillCategory.DATABASE, subcategory: 'SQL' },
    { name: 'MongoDB', category: SkillCategory.DATABASE, subcategory: 'NoSQL' },
    { name: 'Redis', category: SkillCategory.DATABASE, subcategory: 'Cache' },
    { name: 'Elasticsearch', category: SkillCategory.DATABASE, subcategory: 'Search' },

    // Cloud & DevOps
    { name: 'AWS', category: SkillCategory.CLOUD, subcategory: 'Platform' },
    { name: 'Azure', category: SkillCategory.CLOUD, subcategory: 'Platform' },
    { name: 'Google Cloud', category: SkillCategory.CLOUD, subcategory: 'Platform' },
    { name: 'Docker', category: SkillCategory.TOOL, subcategory: 'Containerization' },
    { name: 'Kubernetes', category: SkillCategory.TOOL, subcategory: 'Orchestration' },
    { name: 'Jenkins', category: SkillCategory.TOOL, subcategory: 'CI/CD' },
    { name: 'GitLab CI', category: SkillCategory.TOOL, subcategory: 'CI/CD' },
    { name: 'GitHub Actions', category: SkillCategory.TOOL, subcategory: 'CI/CD' },

    // Outils
    { name: 'Git', category: SkillCategory.TOOL, subcategory: 'Version Control' },
    { name: 'Figma', category: SkillCategory.DESIGN, subcategory: 'UI/UX' },
    { name: 'Adobe XD', category: SkillCategory.DESIGN, subcategory: 'UI/UX' },
    { name: 'Photoshop', category: SkillCategory.DESIGN, subcategory: 'Graphics' },

    // Méthodologies
    { name: 'Agile', category: SkillCategory.METHODOLOGY, subcategory: 'Project Management' },
    { name: 'Scrum', category: SkillCategory.METHODOLOGY, subcategory: 'Project Management' },
    { name: 'Kanban', category: SkillCategory.METHODOLOGY, subcategory: 'Project Management' },
    { name: 'TDD', category: SkillCategory.METHODOLOGY, subcategory: 'Development' },

    // Compétences soft
    { name: 'Leadership', category: SkillCategory.SOFT, subcategory: 'Management' },
    { name: 'Communication', category: SkillCategory.SOFT, subcategory: 'Interpersonal' },
    { name: 'Travail en équipe', category: SkillCategory.SOFT, subcategory: 'Collaboration' },
    { name: 'Résolution de problèmes', category: SkillCategory.SOFT, subcategory: 'Analytical' },
    { name: 'Créativité', category: SkillCategory.SOFT, subcategory: 'Innovation' },
    { name: 'Adaptabilité', category: SkillCategory.SOFT, subcategory: 'Flexibility' },

    // Langues
    { name: 'Français', category: SkillCategory.LANGUAGE, subcategory: 'Native' },
    { name: 'Anglais', category: SkillCategory.LANGUAGE, subcategory: 'International' },
    { name: 'Espagnol', category: SkillCategory.LANGUAGE, subcategory: 'International' },
    { name: 'Allemand', category: SkillCategory.LANGUAGE, subcategory: 'International' },
    { name: 'Italien', category: SkillCategory.LANGUAGE, subcategory: 'International' },
  ];

  // Vérifier si les compétences existent déjà
  const existingSkills = await skillRepository.find();
  if (existingSkills.length === 0) {
    const skills = technicalSkills.map((skillData, index) => 
      skillRepository.create({
        ...skillData,
        isActive: true,
        isVerified: true,
        sortOrder: index,
        demandScore: Math.floor(Math.random() * 100) + 1,
      })
    );

    await skillRepository.save(skills);
    console.log(`✅ ${skills.length} compétences créées avec succès`);
  } else {
    console.log('⚠️ Les compétences existent déjà, seed ignoré');
  }
}
