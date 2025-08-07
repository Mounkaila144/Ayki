"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Search, FileUser, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import styles from './homepage.module.css';

// Custom hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
}

export default function HomePage() {
  const [heroRef, heroInView] = useIntersectionObserver();
  const [featuresRef, featuresInView] = useIntersectionObserver();
  const [ctaRef, ctaInView] = useIntersectionObserver();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Sparkles className="w-5 h-5 text-white transition-transform duration-300" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                AYKI
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="font-medium transition-all duration-300 hover:scale-105 hover:bg-blue-50">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          ref={heroRef}
          className={`relative mb-16 transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Hero Content with Image */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Connectez les
                <span className={`${styles['gradient-text']} font-extrabold`}> talents </span>
                aux opportunités
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                AYKI est la plateforme qui simplifie le recrutement en connectant directement
                les meilleurs candidats avec les entreprises qui recherchent leurs compétences.
              </p>

              {/* Quick Stats */}
              <div className="flex justify-center lg:justify-start space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-500">Candidats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-500">Entreprises</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className={`relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 ${styles.glowing}`}>
                <Image
                  src="/personne qui travail au bureau.png"
                  alt="Personne travaillant au bureau"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-green-600/20 mix-blend-overlay"></div>
                {/* Shimmer effect */}
                <div className={`absolute inset-0 ${styles.shimmer} opacity-30`}></div>
              </div>

              {/* Floating elements */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full opacity-20 ${styles.floating}`}></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Call to Action Cards */}
        <div
          ref={ctaRef}
          className={`transition-all duration-1000 delay-300 ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Commencez votre parcours</h3>
            <p className="text-lg text-gray-600">Choisissez votre profil et rejoignez notre communauté</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-blue-500 relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 ${styles['card-hover']}`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>

              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                  <Users className="w-8 h-8 text-blue-600 transition-transform duration-300" />
                </div>
                <CardTitle className="text-2xl group-hover:text-blue-700 transition-colors duration-300">Je suis candidat</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Créez votre profil et trouvez l'emploi de vos rêves
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <Link href="/auth/signup?type=candidate">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Commencer mon profil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-green-500 relative overflow-hidden bg-gradient-to-br from-white to-green-50/50 ${styles['card-hover']}`}>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>

              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                  <Building2 className="w-8 h-8 text-green-600 transition-transform duration-300" />
                </div>
                <CardTitle className="text-2xl group-hover:text-green-700 transition-colors duration-300">Je suis recruteur</CardTitle>
                <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  Trouvez les meilleurs talents pour votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <Link href="/auth/signup?type=recruiter">
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Rechercher des talents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div
          ref={featuresRef}
          className={`mt-32 transition-all duration-1000 delay-500 ${
            featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir AYKI ?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font d'AYKI la plateforme de recrutement de référence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                <Search className="w-8 h-8 text-blue-600 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-700 transition-colors duration-300">Recherche Intelligente</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Filtrez par compétences, localisation et expérience pour trouver le match parfait.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                <FileUser className="w-8 h-8 text-green-600 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-green-700 transition-colors duration-300">Profils Détaillés</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                CV, compétences, expérience - toutes les informations essentielles en un coup d'œil.
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                <Sparkles className="w-8 h-8 text-purple-600 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-700 transition-colors duration-300">Interface Simplifiée</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Une expérience utilisateur épurée qui se concentre sur l'essentiel.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-green-600/5"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-600/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-6 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300">AYKI</h3>
          </div>

          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Connectons les talents aux opportunités. Rejoignez la révolution du recrutement.
          </p>

          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-sm text-gray-400">Gratuit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-sm text-gray-400">Possibilités</div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400">
              © 2025 AYKI. Tous droits réservés. Connectons les talents aux opportunités.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}