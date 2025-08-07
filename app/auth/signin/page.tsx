"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft, Eye, EyeOff, Phone, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthToast } from "@/hooks/use-auth-toast";
import { apiClient, authUtils } from "@/lib/api";
import styles from '../auth.module.css';

export default function SignInPage() {
  const router = useRouter();
  const { showSuccess, showError } = useAuthToast();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({
    phone: false,
    password: false
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'phone':
        // Validation pour numéro de téléphone du Niger (8 chiffres commençant par 9, 8, 7, ou 6)
        return /^[9876]\d{7}$/.test(value.replace(/\s/g, ''));
      case 'password':
        return value.length >= 6;
      default:
        return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Formatage automatique du numéro de téléphone
    if (field === 'phone') {
      // Supprime tous les caractères non numériques
      const cleanValue = value.replace(/\D/g, '');
      // Formate le numéro avec des espaces (ex: 90 12 34 56)
      const formattedValue = cleanValue.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
      setFieldValidation(prev => ({
        ...prev,
        [field]: validateField(field, formattedValue)
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      setFieldValidation(prev => ({
        ...prev,
        [field]: validateField(field, value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.signIn({
        phone: formData.phone.replace(/\s/g, ''), // Supprimer tous les espaces
        password: formData.password
      });

      // Store authentication data
      authUtils.setToken(response.token);
      authUtils.setUser(response.user);

      showSuccess('Connexion réussie ! Redirection en cours...');

      // Redirect to appropriate dashboard based on user role
      setTimeout(() => {
        if (response.user.adminRole) {
          // Redirect admin users to admin dashboard
          router.push('/admin/dashboard');
        } else if (response.user.userType === 'candidate') {
          router.push('/dashboard/candidate');
        } else {
          router.push('/dashboard/recruiter');
        }
      }, 1500);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      showError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl ${styles['float-animation']}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl ${styles['float-animation']}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 right-1/3 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl ${styles['pulse-animation']}`}></div>
      </div>

      <Card className={`w-full max-w-md relative z-10 ${styles['card-hover']} ${styles['scale-in']} shadow-2xl border-0 bg-white/80 backdrop-blur-sm`}>
        <CardHeader className="text-center pb-6">
          <div className={`flex items-center justify-center space-x-2 mb-6 ${styles['slide-in-up']}`}>
            <div className={`w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center ${styles['pulse-animation']} shadow-lg`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AYKI
            </h1>
          </div>
          <CardTitle className={`text-2xl font-bold text-gray-800 mb-2 ${styles['slide-in-left']}`}>
            Bon retour !
          </CardTitle>
          <CardDescription className={`text-gray-600 ${styles['slide-in-right']}`}>
            Connectez-vous à votre compte pour continuer
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Field */}
            <div className={`space-y-2 ${styles['slide-in-left']}`} style={{ animationDelay: '0.2s' }}>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Numéro de téléphone
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`${styles['input-focus']} pl-10 h-12 ${
                    fieldValidation.phone ? styles['field-success'] : ''
                  }`}
                  placeholder="90 12 34 56"
                  maxLength={11} // 8 chiffres + 3 espaces
                  required
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {fieldValidation.phone && (
                  <CheckCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 ${styles['success-checkmark']}`} />
                )}
              </div>
              <p className="text-xs text-gray-500">
                Format : 90 12 34 56 (numéro du Niger)
              </p>
            </div>

            {/* Password Field */}
            <div className={`space-y-2 ${styles['slide-in-right']}`} style={{ animationDelay: '0.3s' }}>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`${styles['input-focus']} pl-10 pr-10 h-12 ${
                    fieldValidation.password ? styles['field-success'] : ''
                  }`}
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {fieldValidation.password && (
                  <CheckCircle className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 ${styles['success-checkmark']}`} />
                )}
              </div>
            </div>



            {/* Submit Button */}
            <div className={`${styles['slide-in-up']}`} style={{ animationDelay: '0.4s' }}>
              <Button
                type="submit"
                className={`w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 ${styles['button-hover']} text-white font-semibold text-lg shadow-lg`}
                disabled={!fieldValidation.phone || !fieldValidation.password || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className={styles['loading-spinner']}></div>
                    Connexion en cours...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </div>

            {/* Links */}
            <div className={`text-center space-y-4 ${styles['fade-in']}`} style={{ animationDelay: '0.6s' }}>
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline">
                  S'inscrire gratuitement
                </Link>
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link href="/">
                  <Button variant="ghost" className={`text-sm ${styles['button-hover']} text-gray-600 hover:text-gray-800`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>

              {/* Forgot Password Link */}
              <p className="text-xs text-gray-500">
                <Link href="/auth/forgot-password" className="hover:text-gray-700 transition-colors">
                  Mot de passe oublié ?
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}