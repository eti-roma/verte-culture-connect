
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Trophy, Star } from 'lucide-react';

export const CommunityHub = () => {
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: 'Marie Dubois',
      avatar: 'MD',
      level: 'Expert',
      points: 2450,
      content: 'Excellente récolte d\'orge cette semaine ! Voici mes paramètres optimaux...',
      image: '/placeholder.svg',
      likes: 24,
      comments: 8,
      tags: ['orge', 'récolte', 'conseils']
    },
    {
      id: 2,
      author: 'Jean Martin',
      avatar: 'JM',
      level: 'Intermédiaire',
      points: 1200,
      content: 'Question sur le pH : comment maintenir un niveau stable ?',
      likes: 12,
      comments: 15,
      tags: ['pH', 'aide', 'débutant']
    }
  ];

  const topContributors = [
    { name: 'Marie Dubois', points: 2450, badge: 'Experte Orge' },
    { name: 'Pierre Legrand', points: 2100, badge: 'Maître pH' },
    { name: 'Sophie Bernard', points: 1800, badge: 'Guide Formation' },
  ];

  return (
    <div className="space-y-6">
      {/* Créer un nouveau post */}
      <Card>
        <CardHeader>
          <CardTitle>Partager avec la communauté</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Partagez votre expérience, posez une question..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">📷 Photo</Button>
              <Button variant="outline" size="sm">🏷️ Tags</Button>
            </div>
            <Button>Publier</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed principal */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback>{post.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{post.author}</h4>
                      <Badge variant="secondary">{post.level}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Trophy className="w-3 h-3 mr-1" />
                        {post.points} pts
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded-lg mb-3" />
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">#{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Top Contributeurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topContributors.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.points} points</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{user.badge}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="font-medium text-sm">Webinaire pH & Nutrition</p>
                  <p className="text-xs text-gray-500">Demain 14h00</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium text-sm">Challenge Photo du Mois</p>
                  <p className="text-xs text-gray-500">Se termine dans 5 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
