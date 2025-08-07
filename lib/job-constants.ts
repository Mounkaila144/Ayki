// Constantes pour les offres d'emploi

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Temps plein', icon: '🕘' },
  { value: 'part_time', label: 'Temps partiel', icon: '⏰' },
  { value: 'contract', label: 'Contrat', icon: '📄' },
  { value: 'freelance', label: 'Freelance', icon: '💼' },
  { value: 'internship', label: 'Stage', icon: '🎓' },
  { value: 'apprenticeship', label: 'Apprentissage', icon: '🔧' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Débutant (0-2 ans)', icon: '🌱' },
  { value: 'junior', label: 'Junior (1-3 ans)', icon: '🌿' },
  { value: 'mid', label: 'Intermédiaire (2-5 ans)', icon: '🌳' },
  { value: 'senior', label: 'Senior (5+ ans)', icon: '🌲' },
  { value: 'lead', label: 'Lead/Manager', icon: '👑' },
  { value: 'executive', label: 'Exécutif', icon: '💎' },
] as const;

export const REMOTE_POLICIES = [
  { value: 'on_site', label: 'Bureau uniquement', icon: '🏢' },
  { value: 'hybrid', label: 'Hybride', icon: '🔄' },
  { value: 'remote', label: 'Télétravail complet', icon: '🏠' },
  { value: 'flexible', label: 'Flexible', icon: '⚡' },
] as const;

export const JOB_STATUS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'paused', label: 'En pause', color: 'yellow' },
  { value: 'closed', label: 'Fermée', color: 'red' },
  { value: 'draft', label: 'Brouillon', color: 'gray' },
] as const;

export const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'USD', label: 'Dollar US ($)', symbol: '$' },
  { value: 'GBP', label: 'Livre Sterling (£)', symbol: '£' },
  { value: 'CHF', label: 'Franc Suisse (CHF)', symbol: 'CHF' },
  { value: 'CAD', label: 'Dollar Canadien (CAD)', symbol: 'CAD' },
] as const;

export const SALARY_PERIODS = [
  { value: 'yearly', label: 'Par an' },
  { value: 'monthly', label: 'Par mois' },
  { value: 'daily', label: 'Par jour' },
  { value: 'hourly', label: 'Par heure' },
] as const;

// Fonctions utilitaires
export const getEmploymentTypeLabel = (type: string): string => {
  return EMPLOYMENT_TYPES.find(t => t.value === type)?.label || type;
};

export const getExperienceLevelLabel = (level: string): string => {
  return EXPERIENCE_LEVELS.find(l => l.value === level)?.label || level;
};

export const getRemotePolicyLabel = (policy: string): string => {
  return REMOTE_POLICIES.find(p => p.value === policy)?.label || policy;
};

export const getJobStatusLabel = (status: string): string => {
  return JOB_STATUS.find(s => s.value === status)?.label || status;
};

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCIES.find(c => c.value === currency)?.symbol || currency;
};

export const getSalaryPeriodLabel = (period: string): string => {
  return SALARY_PERIODS.find(p => p.value === period)?.label || period;
};

// Fonction pour formater le salaire
export const formatSalary = (
  min?: string | number, 
  max?: string | number, 
  currency = 'EUR',
  period = 'yearly'
): string => {
  const symbol = getCurrencySymbol(currency);
  const periodLabel = getSalaryPeriodLabel(period);
  
  if (!min && !max) return 'Salaire non spécifié';
  
  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseInt(num) : num;
    return new Intl.NumberFormat('fr-FR').format(value);
  };
  
  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} ${symbol} ${periodLabel.toLowerCase()}`;
  }
  if (min) {
    return `À partir de ${formatNumber(min)} ${symbol} ${periodLabel.toLowerCase()}`;
  }
  if (max) {
    return `Jusqu'à ${formatNumber(max)} ${symbol} ${periodLabel.toLowerCase()}`;
  }
  
  return '';
};

// Fonction pour calculer le temps écoulé
export const getTimeAgo = (date: string): string => {
  const now = new Date();
  const jobDate = new Date(date);
  const diffInMs = now.getTime() - jobDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  
  if (diffInHours < 1) {
    return 'À l\'instant';
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays}j`;
  } else if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  } else {
    return `Il y a ${diffInMonths} mois`;
  }
};

// Fonction pour valider les filtres de salaire
export const validateSalaryRange = (min: string, max: string): { isValid: boolean; error?: string } => {
  if (!min && !max) return { isValid: true };
  
  const minNum = min ? parseInt(min) : 0;
  const maxNum = max ? parseInt(max) : Infinity;
  
  if (min && isNaN(minNum)) {
    return { isValid: false, error: 'Le salaire minimum doit être un nombre valide' };
  }
  
  if (max && isNaN(maxNum)) {
    return { isValid: false, error: 'Le salaire maximum doit être un nombre valide' };
  }
  
  if (min && max && minNum > maxNum) {
    return { isValid: false, error: 'Le salaire minimum ne peut pas être supérieur au maximum' };
  }
  
  if (minNum < 0 || maxNum < 0) {
    return { isValid: false, error: 'Les salaires ne peuvent pas être négatifs' };
  }
  
  return { isValid: true };
};

// Fonction pour générer des suggestions de recherche
export const getSearchSuggestions = (searchTerm: string, jobs: any[]): string[] => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const suggestions = new Set<string>();
  const searchLower = searchTerm.toLowerCase();
  
  jobs.forEach(job => {
    // Suggestions basées sur le titre
    if (job.title.toLowerCase().includes(searchLower)) {
      suggestions.add(job.title);
    }
    
    // Suggestions basées sur l'entreprise
    if (job.company?.name.toLowerCase().includes(searchLower)) {
      suggestions.add(job.company.name);
    }
    
    // Suggestions basées sur la localisation
    if (job.location?.toLowerCase().includes(searchLower)) {
      suggestions.add(job.location);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
};

// Types TypeScript
export type EmploymentType = typeof EMPLOYMENT_TYPES[number]['value'];
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]['value'];
export type RemotePolicy = typeof REMOTE_POLICIES[number]['value'];
export type JobStatusType = typeof JOB_STATUS[number]['value'];
export type Currency = typeof CURRENCIES[number]['value'];
export type SalaryPeriod = typeof SALARY_PERIODS[number]['value'];
