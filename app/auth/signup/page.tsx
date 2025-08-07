"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Users, Building2, ArrowLeft, Eye, EyeOff, Phone, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthToast } from "@/hooks/use-auth-toast";
import styles from '../auth.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useAuthToast();
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | ''>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({
    firstName: false,
    lastName: false,
    phone: false,
    password: false,
    confirmPassword: false,
    company: false
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const type = searchParams.get('type');
    if (type === 'candidate' || type === 'recruiter') {
      setUserType(type);
    }
  }, [searchParams]);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim().length >= 2;
      case 'phone':
        // Validation pour numéro de téléphone du Niger (8 chiffres commençant par 9, 8, 7, ou 6)
        return /^[9876]\d{7}$/.test(value.replace(/\s/g, ''));
      case 'password':
        return value.length >= 8;
      case 'confirmPassword':
        return value === formData.password && value.length > 0;
      case 'company':
        return userType === 'recruiter' ? value.trim().length >= 2 : true;
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

  const getRequiredFields = () => {
    const requiredFields = ['firstName', 'lastName', 'phone', 'password', 'confirmPassword'];
    
    // Ajouter le champ company seulement pour les recruteurs
    if (userType === 'recruiter') {
      requiredFields.push('company');
    }
    
    return requiredFields;
  };

  const getCompletedFieldsCount = () => {
    return getRequiredFields().filter(field => 
      fieldValidation[field as keyof typeof fieldValidation]
    ).length;
  };

  const isFormValid = () => {
    return getRequiredFields().every(field => 
      fieldValidation[field as keyof typeof fieldValidation]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { apiClient, authUtils } = await import('@/lib/api');
      
      const signUpData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        userType: userType as 'candidate' | 'recruiter',
        ...(userType === 'recruiter' && { company: formData.company })
      };

      const response = await apiClient.signUp(signUpData);

      // Store authentication data
      authUtils.setToken(response.token);
      authUtils.setUser(response.user);

      showSuccess('Inscription réussie ! Redirection en cours...');

      // Redirect to appropriate dashboard
      setTimeout(() => {
        if (response.user.userType === 'candidate') {
          router.push('/dashboard/candidate');
        } else {
          router.push('/dashboard/recruiter');
        }
      }, 1500);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      showError(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl ${styles['float-animation']}`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl ${styles['float-animation']}`} style={{ animationDelay: '1s' }}></div>
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
              Choisissez votre profil
            </CardTitle>
            <CardDescription className={`text-gray-600 ${styles['slide-in-right']}`}>
              Sélectionnez le type de compte que vous souhaitez créer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setUserType('candidate')}
              variant="outline"
              className={`w-full h-20 flex items-center justify-start space-x-4 hover:bg-blue-50 hover:border-blue-300 ${styles['button-hover']} ${styles['slide-in-left']} border-2 transition-all duration-300`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Candidat</div>
                <div className="text-sm text-gray-500">Je recherche un emploi</div>
              </div>
            </Button>

            <Button
              onClick={() => setUserType('recruiter')}
              variant="outline"
              className={`w-full h-20 flex items-center justify-start space-x-4 hover:bg-green-50 hover:border-green-300 ${styles['button-hover']} ${styles['slide-in-right']} border-2 transition-all duration-300`}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Recruteur</div>
                <div className="text-sm text-gray-500">Je recrute des talents</div>
              </div>
            </Button>

            <div className={`text-center pt-4 ${styles['fade-in']}`} style={{ animationDelay: '0.4s' }}>
              <Link href="/">
                <Button variant="ghost" className={`text-sm ${styles['button-hover']}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${userType === 'candidate' ? 'bg-blue-400/10' : 'bg-green-400/10'} rounded-full blur-3xl ${styles['float-animation']}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 ${userType === 'candidate' ? 'bg-green-400/10' : 'bg-blue-400/10'} rounded-full blur-3xl ${styles['float-animation']}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 right-1/3 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl ${styles['pulse-animation']}`}></div>
      </div>

      <Card className={`w-full max-w-lg relative z-10 ${styles['card-hover']} ${styles['scale-in']} shadow-2xl border-0 bg-white/80 backdrop-blur-sm`}>
        <CardHeader className="text-center pb-6">
          <div className={`flex items-center justify-center space-x-2 mb-6 ${styles['slide-in-up']}`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${userType === 'candidate' ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700'} rounded-xl flex items-center justify-center ${styles['pulse-animation']} shadow-lg`}>
              {userType === 'candidate' ? <Users className="w-6 h-6 text-white" /> : <Building2 className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              AYKI
            </h1>
          </div>
          <CardTitle className={`text-2xl font-bold text-gray-800 mb-2 ${styles['slide-in-left']}`}>
            Inscription {userType === 'candidate' ? 'Candidat' : 'Recruteur'}
          </CardTitle>
          <CardDescription className={`text-gray-600 ${styles['slide-in-right']}`}>
            Créez votre compte pour commencer votre parcours
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className={`grid grid-cols-2 gap-4 ${styles['slide-in-left']}`} style={{ animationDelay: '0.2s' }}>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Prénom
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`${styles['input-focus']} h-12 ${
                      fieldValidation.firstName ? styles['field-success'] : ''
                    }`}
                    placeholder="John"
                    required
                  />
                  {fieldValidation.firstName && (
                    <CheckCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 ${styles['success-checkmark']}`} />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom
                </Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`${styles['input-focus']} h-12 ${
                      fieldValidation.lastName ? styles['field-success'] : ''
                    }`}
                    placeholder="Doe"
                    required
                  />
                  {fieldValidation.lastName && (
                    <CheckCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 ${styles['success-checkmark']}`} />
                  )}
                </div>
              </div>
            </div>

            {/* Company Field for Recruiters */}
            {userType === 'recruiter' && (
              <div className={`space-y-2 ${styles['slide-in-right']}`} style={{ animationDelay: '0.3s' }}>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Entreprise
                </Label>
                <div className="relative">
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`${styles['input-focus']} pl-10 h-12 ${
                      fieldValidation.company ? styles['field-success'] : ''
                    }`}
                    placeholder="Nom de votre entreprise"
                    required
                  />
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {fieldValidation.company && (
                    <CheckCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 ${styles['success-checkmark']}`} />
                  )}
                </div>
              </div>
            )}

            {/* Phone Field */}
            <div className={`space-y-2 ${styles['slide-in-left']}`} style={{ animationDelay: '0.4s' }}>
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
            <div className={`space-y-2 ${styles['slide-in-right']}`} style={{ animationDelay: '0.5s' }}>
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
              <p className="text-xs text-gray-500">
                Au moins 8 caractères
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className={`space-y-2 ${styles['slide-in-left']}`} style={{ animationDelay: '0.6s' }}>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`${styles['input-focus']} pl-10 pr-10 h-12 ${
                    fieldValidation.confirmPassword ? styles['field-success'] :
                    formData.confirmPassword && !fieldValidation.confirmPassword ? styles['field-error'] : ''
                  }`}
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {fieldValidation.confirmPassword && (
                  <CheckCircle className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 ${styles['success-checkmark']}`} />
                )}
                {formData.confirmPassword && !fieldValidation.confirmPassword && (
                  <AlertCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {formData.confirmPassword && !fieldValidation.confirmPassword && (
                <p className="text-xs text-red-500">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Submit Button */}
            <div className={`${styles['slide-in-up']}`} style={{ animationDelay: '0.7s' }}>
              <Button
                type="submit"
                className={`w-full h-12 ${
                  userType === 'candidate'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                } ${styles['button-hover']} text-white font-semibold text-lg shadow-lg`}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className={styles['loading-spinner']}></div>
                    Création en cours...
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className={`${styles['fade-in']}`} style={{ animationDelay: '0.8s' }}>
              <div className="flex justify-center space-x-2 mb-4">
                {getRequiredFields().map((key) => (
                  <div
                    key={key}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      fieldValidation[key as keyof typeof fieldValidation] ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-center text-gray-500">
                {getCompletedFieldsCount()} / {getRequiredFields().length} champs complétés
              </p>
            </div>

            {/* Links */}
            <div className={`text-center space-y-4 ${styles['fade-in']}`} style={{ animationDelay: '0.9s' }}>
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline">
                  Se connecter
                </Link>
              </p>

              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setUserType('')}
                  className={`text-sm ${styles['button-hover']} text-gray-600 hover:text-gray-800`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Changer de profil
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="hover:text-gray-700 underline">
                  conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link href="/privacy" className="hover:text-gray-700 underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}