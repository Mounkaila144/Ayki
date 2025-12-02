'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/api';

type UserRole = 'candidate' | 'recruiter' | 'admin';

interface UseRoleProtectionOptions {
  requiredRole: UserRole;
  redirectTo?: string;
}

interface UseRoleProtectionReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
}

/**
 * Hook personnalisé pour protéger les pages selon le rôle de l'utilisateur
 *
 * @param options - Options de configuration
 * @param options.requiredRole - Le rôle requis pour accéder à la page ('candidate' | 'recruiter' | 'admin')
 * @param options.redirectTo - URL de redirection optionnelle si l'utilisateur n'a pas le bon rôle
 *
 * @returns Objet contenant l'état d'autorisation et de chargement
 *
 * @example
 * // Dans une page dashboard candidat
 * const { isAuthorized, isLoading } = useRoleProtection({ requiredRole: 'candidate' });
 *
 * @example
 * // Dans une page dashboard recruteur avec redirection personnalisée
 * const { isAuthorized } = useRoleProtection({
 *   requiredRole: 'recruiter',
 *   redirectTo: '/auth/signin'
 * });
 */
export function useRoleProtection({
  requiredRole,
  redirectTo
}: UseRoleProtectionOptions): UseRoleProtectionReturn {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Vérifier l'authentification et le rôle
    const checkRoleAccess = () => {
      try {
        // 1. Vérifier si l'utilisateur est authentifié
        if (!authUtils.isAuthenticated()) {
          console.log('[useRoleProtection] Utilisateur non authentifié - Redirection vers signin');
          router.push('/auth/signin');
          setIsLoading(false);
          return;
        }

        // 2. Récupérer les données utilisateur depuis le localStorage
        const user = authUtils.getUser();

        if (!user) {
          console.log('[useRoleProtection] Données utilisateur introuvables - Redirection vers signin');
          authUtils.logout();
          return;
        }

        const currentUserRole = user.userType as UserRole;
        setUserRole(currentUserRole);

        // 3. Vérifier si l'utilisateur a le bon rôle
        if (currentUserRole !== requiredRole) {
          console.log(`[useRoleProtection] Rôle non autorisé - Requis: ${requiredRole}, Actuel: ${currentUserRole}`);

          // Rediriger vers la page appropriée selon le rôle
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            // Redirection automatique vers le dashboard approprié
            const dashboardMap: Record<UserRole, string> = {
              candidate: '/dashboard/candidate',
              recruiter: '/dashboard/recruiter',
              admin: '/admin/dashboard'
            };

            const correctDashboard = dashboardMap[currentUserRole];
            console.log(`[useRoleProtection] Redirection vers le dashboard approprié: ${correctDashboard}`);
            router.push(correctDashboard);
          }

          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // 4. L'utilisateur a le bon rôle
        console.log(`[useRoleProtection] Accès autorisé pour le rôle: ${currentUserRole}`);
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('[useRoleProtection] Erreur lors de la vérification du rôle:', error);
        authUtils.logout();
      }
    };

    checkRoleAccess();
  }, [requiredRole, redirectTo, router]);

  return {
    isAuthorized,
    isLoading,
    userRole
  };
}

/**
 * Composant wrapper pour protéger les pages selon le rôle
 * Peut être utilisé pour wrapper des pages entières
 *
 * @example
 * export default function CandidateDashboard() {
 *   return (
 *     <RoleProtectedPage requiredRole="candidate">
 *       <div>Contenu du dashboard candidat</div>
 *     </RoleProtectedPage>
 *   );
 * }
 */
export function RoleProtectedPage({
  children,
  requiredRole,
  redirectTo,
  loadingComponent
}: {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}) {
  const { isAuthorized, isLoading } = useRoleProtection({ requiredRole, redirectTo });

  if (isLoading) {
    return loadingComponent || (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
