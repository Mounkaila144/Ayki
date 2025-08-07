import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardStatsDto {
  @ApiProperty({ description: 'Nombre total de candidats' })
  totalCandidates: number;

  @ApiProperty({ description: 'Nombre total de recruteurs' })
  totalRecruiters: number;

  @ApiProperty({ description: 'Nombre d\'utilisateurs actifs' })
  activeUsers: number;

  @ApiProperty({ description: 'Nombre d\'utilisateurs inactifs' })
  inactiveUsers: number;

  @ApiProperty({ description: 'Nouvelles inscriptions ce mois' })
  newUsersThisMonth: number;

  @ApiProperty({ description: 'Connexions récentes (7 derniers jours)' })
  recentLogins: number;

  @ApiProperty({ description: 'Nombre total d\'offres d\'emploi' })
  totalJobOffers: number;

  @ApiProperty({ description: 'Nombre total de candidatures' })
  totalApplications: number;

  @ApiProperty({ description: 'Candidatures ce mois' })
  applicationsThisMonth: number;

  @ApiProperty({ description: 'Entretiens programmés' })
  scheduledInterviews: number;

  @ApiProperty({ description: 'Taux de complétion des profils candidats (%)' })
  candidateProfileCompletion: number;

  @ApiProperty({ description: 'Taux de complétion des profils recruteurs (%)' })
  recruiterProfileCompletion: number;
}
