'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Partner {
  id: string;
  name: string;
  logo: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    order: 0,
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/partners');
      setPartners(response.data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des partenaires:', error);
      toast.error('Erreur lors du chargement des partenaires');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logoFile && !editingPartner) {
      toast.error('Veuillez sélectionner un logo');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('isActive', formData.isActive.toString());

      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      if (editingPartner) {
        await api.patch(`/partners/${editingPartner.id}`, formDataToSend);
        toast.success('Partenaire mis à jour avec succès');
      } else {
        await api.post('/partners', formDataToSend);
        toast.success('Partenaire ajouté avec succès');
      }

      resetForm();
      loadPartners();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du partenaire:', error);
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      order: partner.order,
      isActive: partner.isActive,
    });
    setLogoPreview(`${process.env.NEXT_PUBLIC_API_URL}${partner.logo}`);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      return;
    }

    try {
      await api.delete(`/partners/${id}`);
      toast.success('Partenaire supprimé avec succès');
      loadPartners();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', partner.name);
      formDataToSend.append('order', partner.order.toString());
      formDataToSend.append('isActive', (!partner.isActive).toString());

      await api.patch(`/partners/${partner.id}`, formDataToSend);
      toast.success(`Partenaire ${partner.isActive ? 'désactivé' : 'activé'} avec succès`);
      loadPartners();
    } catch (error: any) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', order: 0, isActive: true });
    setLogoFile(null);
    setLogoPreview(null);
    setEditingPartner(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Partenaires</h1>
          <p className="text-gray-600 mt-1">
            Gérez les logos des partenaires affichés sur la page d'accueil
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Annuler' : 'Ajouter un partenaire'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPartner ? 'Modifier le partenaire' : 'Nouveau partenaire'}
            </CardTitle>
            <CardDescription>
              Ajoutez le nom et le logo du partenaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du partenaire *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Google, Microsoft..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordre d'affichage
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo * {editingPartner && '(Laissez vide pour garder le logo actuel)'}
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  required={!editingPartner}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Aperçu"
                      className="h-20 w-auto object-contain border rounded p-2"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Actif (visible sur la page d'accueil)
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPartner ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des partenaires ({partners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun partenaire</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par ajouter un partenaire.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className={`border rounded-lg p-4 ${
                    partner.isActive ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{partner.name}</h3>
                      <p className="text-sm text-gray-500">Ordre: {partner.order}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        partner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {partner.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="mb-3 bg-gray-100 rounded p-2 h-24 flex items-center justify-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${partner.logo}`}
                      alt={partner.name}
                      className="max-h-20 w-auto object-contain"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(partner)}
                      className="flex-1"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(partner)}
                    >
                      {partner.isActive ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(partner.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
