import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Construire les paramètres de requête
    const queryParams = new URLSearchParams();

    // Ajouter les paramètres de recherche et filtrage
    const search = searchParams.get('search');
    const employmentType = searchParams.get('employmentType');
    const experienceLevel = searchParams.get('experienceLevel');
    const remotePolicy = searchParams.get('remotePolicy');
    const location = searchParams.get('location');
    const salaryMin = searchParams.get('salaryMin');
    const salaryMax = searchParams.get('salaryMax');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    if (search) queryParams.append('search', search);
    if (employmentType) queryParams.append('employmentType', employmentType);
    if (experienceLevel) queryParams.append('experienceLevel', experienceLevel);
    if (remotePolicy) queryParams.append('remotePolicy', remotePolicy);
    if (location) queryParams.append('location', location);
    if (salaryMin) queryParams.append('salaryMin', salaryMin);
    if (salaryMax) queryParams.append('salaryMax', salaryMax);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    // Appel à l'API backend (pas d'authentification requise pour la lecture publique)
    const response = await fetch(`${API_BASE_URL}/jobs?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Désactiver le cache pour avoir des données fraîches
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des offres d\'emploi',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Récupérer le token d'authentification depuis les headers
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    // Appel à l'API backend pour créer une offre
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de l\'offre d\'emploi',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
