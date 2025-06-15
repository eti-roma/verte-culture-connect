
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageCircle, ThumbsUp, Share, Calendar } from 'lucide-react';

export const Community = () => {
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: 'Jean Dupont',
      avatar: 'JD',
      date: '2024-01-15',
      content: 'Excellents résultats avec mon nouveau système d\'éclairage LED ! Mes cultures d\'orge atteignent maintenant 9.2 kg/m² en moyenne. Qui a des expériences similaires ?',
      likes: 12,
      comments: 5,
      tags: ['LED', 'Orge', 'Rendement'],
      image: true
    },
    {
      id: 2,
      author: 'Marie Martin',
      avatar: 'MM',
      date: '2024-01-14',
      content: 'Question pour la communauté : comment gérez-vous l\'humidité pendant les mois d\'hiver ? J\'ai remarqué une baisse de croissance récemment.',
      likes: 8,
      comments: 12,
      tags: ['Humidité', 'Hiver', 'Question'],
      image: false
    },
    {
      id: 3,
      author: 'Pierre Moreau',
      avatar: 'PM',
      date: '2024-01-13',
      content: 'Nouveau projet : installation d\'un système de récupération d\'eau de pluie. Économie d\'eau de 40% prévue ! Je partagerai les résultats dans quelques semaines.',
      likes: 15,
      comments: 7,
      tags: ['Écologie', 'Économie', 'Innovation'],
      image: true
    },
    {
      id: 4,
      author: 'Sophie Durand',
      avatar: 'SD',
      date: '2024-01-12',
      content: 'Astuce du jour : ajoutez 0.5ml de solution nutritive supplémentaire par litre lors des jours nuageux. Mes cultures maintiennent une croissance constante même en hiver !',
      likes: 20,
      comments: 9,
      tags: ['Astuce', 'Nutrition', 'Hiver'],
      image: false
    }
  ];

  const discussions = [
    { title: 'Meilleurs variétés pour débuter', replies: 23, lastActivity: '2h' },
    { title: 'Systèmes automatisés vs manuels', replies: 18, lastActivity: '4h' },
    { title: 'Optimisation des coûts énergétiques', replies: 31, lastActivity: '6h' },
    { title: 'Problèmes de moisissures', replies: 12, lastActivity: '1j' },
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      console.log('Nouveau post:', newPost);
      setNewPost('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Communauté</h2>
        <p className="text-lg text-gray-600">
          Partagez vos expériences et apprenez avec d'autres producteurs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>Partager une Expérience</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Partagez vos découvertes, posez vos questions ou donnez des conseils à la communauté..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    📷 Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    📊 Données
                  </Button>
                </div>
                <Button 
                  onClick={handlePostSubmit}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={!newPost.trim()}
                >
                  Publier
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{post.author}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                      
                      {post.image && (
                        <div className="w-full h-48 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="text-green-600">📷 Image partagée</div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-6 pt-2 border-t">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                          <Share className="w-4 h-4" />
                          <span className="text-sm">Partager</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Statistiques</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-600">Membres actifs</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-gray-600">Posts cette semaine</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">Discussions actives</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discussions Populaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discussions.map((discussion, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {discussion.title}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{discussion.replies} réponses</span>
                    <span>il y a {discussion.lastActivity}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Rejoignez des Groupes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Découvrez des groupes spécialisés par région ou par type de culture
              </p>
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                Voir les Groupes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
