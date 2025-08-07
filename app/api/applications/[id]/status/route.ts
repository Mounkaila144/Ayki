import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;
    const body = await request.json();
    
    // Récupérer le token d'authentification depuis les headers
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    // Valider le statut
    const validStatuses = [
      'pending', 'reviewed', 'shortlisted', 'interview_scheduled', 'interviewed',
      'second_interview', 'final_interview', 'reference_check', 'offer_made',
      'offer_accepted', 'offer_declined', 'rejected', 'withdrawn', 'hired'
    ];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Appel à l'API backend pour mettre à jour le statut
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify({ status: body.status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour du statut',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
