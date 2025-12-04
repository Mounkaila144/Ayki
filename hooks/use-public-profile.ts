'use client';

import { useState, useEffect } from 'react';
import { apiClient, authUtils } from '@/lib/api';

export interface PublicProfile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  avatar?: string;
  skills: Array<{
    id: string;
    name: string;
    level: string;
    yearsOfExperience: number;
  }>;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    fieldOfStudy: string;
    graduationYear: number | null;
    grade: string;
    description: string;
  }>;
}

export function usePublicProfile(slug: string) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getPublicProfile(slug);
        setProfile(response);
      } catch (err: any) {
        console.error('Erreur lors du chargement du profil:', err);
        setError(err.message || 'Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  return { profile, loading, error };
}

/**
 * Hook pour obtenir le slug du profil de l'utilisateur connecté
 */
export function useMyProfileSlug() {
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlug = async () => {
      try {
        if (!authUtils.isAuthenticated()) {
          setLoading(false);
          return;
        }

        const user = authUtils.getUser();
        if (user?.profile) {
          // Générer le slug à partir du prénom et nom
          const generatedSlug = generateSlug(user.profile.firstName, user.profile.lastName, user.id);
          setSlug(generatedSlug);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du slug:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlug();
  }, []);

  return { slug, loading };
}

/**
 * Génère un slug unique pour un profil
 */
export function generateSlug(firstName: string, lastName: string, userId?: string): string {
  const cleanText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const firstSlug = cleanText(firstName);
  const lastSlug = cleanText(lastName);

  // Format: prenom-nom ou prenom-nom-id si besoin d'unicité
  if (userId) {
    const shortId = userId.substring(0, 8);
    return `${firstSlug}-${lastSlug}-${shortId}`;
  }

  return `${firstSlug}-${lastSlug}`;
}

/**
 * Génère l'URL complète du profil public
 */
export function getProfileUrl(slug: string): string {
  if (typeof window === 'undefined') {
    return `/profile/${slug}`;
  }

  const baseUrl = window.location.origin;
  return `${baseUrl}/profile/${slug}`;
}

/**
 * Copie le lien du profil dans le presse-papier
 */
export async function copyProfileLink(slug: string): Promise<boolean> {
  try {
    // Vérifier que le slug est valide
    if (!slug || slug.trim() === '') {
      console.error('Slug invalide ou vide');
      return false;
    }

    const url = getProfileUrl(slug);
    console.log('Tentative de copie du lien:', url);

    // Méthode moderne avec Clipboard API
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        console.log('Lien copié avec succès via Clipboard API');
        return true;
      } catch (clipboardErr) {
        console.warn('Échec Clipboard API, tentative avec fallback:', clipboardErr);
        // Continue avec le fallback ci-dessous
      }
    }

    // Fallback pour les navigateurs plus anciens ou contextes non-sécurisés
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      if (successful) {
        console.log('Lien copié avec succès via execCommand');
        return true;
      } else {
        console.error('execCommand a échoué');
        return false;
      }
    } catch (err) {
      console.error('Erreur lors de execCommand:', err);
      textArea.remove();
      return false;
    }
  } catch (err) {
    console.error('Erreur lors de la copie du lien:', err);
    return false;
  }
}

/**
 * Partage le profil via l'API Web Share (mobile)
 */
export async function shareProfile(slug: string, name: string): Promise<boolean> {
  try {
    // Vérifier que le slug est valide
    if (!slug || slug.trim() === '') {
      console.error('Slug invalide ou vide');
      return false;
    }

    const url = getProfileUrl(slug);
    console.log('Tentative de partage du profil:', url);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil de ${name} sur AYKI`,
          text: `Découvrez le profil professionnel de ${name}`,
          url: url
        });
        console.log('Profil partagé avec succès via Web Share API');
        return true;
      } catch (shareErr: any) {
        // Si l'utilisateur annule le partage, c'est une erreur de type AbortError
        if (shareErr.name === 'AbortError') {
          console.log('Partage annulé par l\'utilisateur');
          return false;
        }
        console.warn('Échec Web Share API, tentative avec fallback:', shareErr);
        // Continue avec le fallback ci-dessous
      }
    }

    // Fallback: copier dans le presse-papier
    return await copyProfileLink(slug);
  } catch (err) {
    console.error('Erreur lors du partage:', err);
    return false;
  }
}
