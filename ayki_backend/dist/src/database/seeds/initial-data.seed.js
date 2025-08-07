"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = seedInitialData;
const skill_entity_1 = require("../../entities/skill.entity");
async function seedInitialData(dataSource) {
    const skillRepository = dataSource.getRepository(skill_entity_1.Skill);
    const technicalSkills = [
        { name: 'React', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Frontend' },
        { name: 'Vue.js', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Frontend' },
        { name: 'Angular', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Frontend' },
        { name: 'JavaScript', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'TypeScript', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'HTML', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Markup' },
        { name: 'CSS', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Styling' },
        { name: 'Sass', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Styling' },
        { name: 'Tailwind CSS', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'CSS' },
        { name: 'Node.js', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Runtime' },
        { name: 'Python', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'Java', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'PHP', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'C#', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'Go', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'Rust', category: skill_entity_1.SkillCategory.TECHNICAL, subcategory: 'Programming' },
        { name: 'Express.js', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Backend' },
        { name: 'NestJS', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Backend' },
        { name: 'Django', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Backend' },
        { name: 'Flask', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Backend' },
        { name: 'Spring Boot', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Backend' },
        { name: 'Laravel', category: skill_entity_1.SkillCategory.FRAMEWORK, subcategory: 'Backend' },
        { name: 'PostgreSQL', category: skill_entity_1.SkillCategory.DATABASE, subcategory: 'SQL' },
        { name: 'MySQL', category: skill_entity_1.SkillCategory.DATABASE, subcategory: 'SQL' },
        { name: 'MongoDB', category: skill_entity_1.SkillCategory.DATABASE, subcategory: 'NoSQL' },
        { name: 'Redis', category: skill_entity_1.SkillCategory.DATABASE, subcategory: 'Cache' },
        { name: 'Elasticsearch', category: skill_entity_1.SkillCategory.DATABASE, subcategory: 'Search' },
        { name: 'AWS', category: skill_entity_1.SkillCategory.CLOUD, subcategory: 'Platform' },
        { name: 'Azure', category: skill_entity_1.SkillCategory.CLOUD, subcategory: 'Platform' },
        { name: 'Google Cloud', category: skill_entity_1.SkillCategory.CLOUD, subcategory: 'Platform' },
        { name: 'Docker', category: skill_entity_1.SkillCategory.TOOL, subcategory: 'Containerization' },
        { name: 'Kubernetes', category: skill_entity_1.SkillCategory.TOOL, subcategory: 'Orchestration' },
        { name: 'Jenkins', category: skill_entity_1.SkillCategory.TOOL, subcategory: 'CI/CD' },
        { name: 'GitLab CI', category: skill_entity_1.SkillCategory.TOOL, subcategory: 'CI/CD' },
        { name: 'GitHub Actions', category: skill_entity_1.SkillCategory.TOOL, subcategory: 'CI/CD' },
        { name: 'Git', category: skill_entity_1.SkillCategory.TOOL, subcategory: 'Version Control' },
        { name: 'Figma', category: skill_entity_1.SkillCategory.DESIGN, subcategory: 'UI/UX' },
        { name: 'Adobe XD', category: skill_entity_1.SkillCategory.DESIGN, subcategory: 'UI/UX' },
        { name: 'Photoshop', category: skill_entity_1.SkillCategory.DESIGN, subcategory: 'Graphics' },
        { name: 'Agile', category: skill_entity_1.SkillCategory.METHODOLOGY, subcategory: 'Project Management' },
        { name: 'Scrum', category: skill_entity_1.SkillCategory.METHODOLOGY, subcategory: 'Project Management' },
        { name: 'Kanban', category: skill_entity_1.SkillCategory.METHODOLOGY, subcategory: 'Project Management' },
        { name: 'TDD', category: skill_entity_1.SkillCategory.METHODOLOGY, subcategory: 'Development' },
        { name: 'Leadership', category: skill_entity_1.SkillCategory.SOFT, subcategory: 'Management' },
        { name: 'Communication', category: skill_entity_1.SkillCategory.SOFT, subcategory: 'Interpersonal' },
        { name: 'Travail en équipe', category: skill_entity_1.SkillCategory.SOFT, subcategory: 'Collaboration' },
        { name: 'Résolution de problèmes', category: skill_entity_1.SkillCategory.SOFT, subcategory: 'Analytical' },
        { name: 'Créativité', category: skill_entity_1.SkillCategory.SOFT, subcategory: 'Innovation' },
        { name: 'Adaptabilité', category: skill_entity_1.SkillCategory.SOFT, subcategory: 'Flexibility' },
        { name: 'Français', category: skill_entity_1.SkillCategory.LANGUAGE, subcategory: 'Native' },
        { name: 'Anglais', category: skill_entity_1.SkillCategory.LANGUAGE, subcategory: 'International' },
        { name: 'Espagnol', category: skill_entity_1.SkillCategory.LANGUAGE, subcategory: 'International' },
        { name: 'Allemand', category: skill_entity_1.SkillCategory.LANGUAGE, subcategory: 'International' },
        { name: 'Italien', category: skill_entity_1.SkillCategory.LANGUAGE, subcategory: 'International' },
    ];
    const existingSkills = await skillRepository.find();
    if (existingSkills.length === 0) {
        const skills = technicalSkills.map((skillData, index) => skillRepository.create({
            ...skillData,
            isActive: true,
            isVerified: true,
            sortOrder: index,
            demandScore: Math.floor(Math.random() * 100) + 1,
        }));
        await skillRepository.save(skills);
        console.log(`✅ ${skills.length} compétences créées avec succès`);
    }
    else {
        console.log('⚠️ Les compétences existent déjà, seed ignoré');
    }
}
//# sourceMappingURL=initial-data.seed.js.map