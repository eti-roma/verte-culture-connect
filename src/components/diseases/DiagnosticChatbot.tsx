
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Bot, User, Camera, FileText } from 'lucide-react';

export const DiagnosticChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '👋 Bonjour ! Je suis votre assistant expert en diagnostic. Décrivez-moi le problème que vous observez sur vos cultures.',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [diagnosticStep, setDiagnosticStep] = useState(0);

  const diagnosticFlow = [
    {
      question: 'Sur quelle culture observez-vous le problème ?',
      options: ['Orge', 'Blé', 'Maïs', 'Luzerne', 'Autre']
    },
    {
      question: 'Quels symptômes observez-vous ?',
      options: ['Feuilles jaunes', 'Feuilles brunes', 'Taches sur les feuilles', 'Croissance ralentie', 'Racines noires']
    },
    {
      question: 'Depuis quand observez-vous ces symptômes ?',
      options: ['Aujourd\'hui', 'Cette semaine', 'Ce mois-ci', 'Plus anciens']
    }
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');

    // Simuler une réponse du bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: generateBotResponse(currentMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string) => {
    if (userMessage.toLowerCase().includes('jaune')) {
      return '🔍 Les feuilles jaunes peuvent indiquer plusieurs problèmes :\n\n• **Carence en azote** (très fréquent)\n• **Excès d\'arrosage**\n• **pH trop élevé**\n\nPouvez-vous me dire quelle est la couleur de vos racines ?';
    } else if (userMessage.toLowerCase().includes('brun')) {
      return '⚠️ Les feuilles brunes suggèrent :\n\n• **Brûlure nutritive** (excès d\'engrais)\n• **Maladie fongique**\n• **Stress thermique**\n\nAvez-vous récemment changé votre solution nutritive ?';
    } else {
      return '🤔 Pour mieux vous aider, pouvez-vous :\n\n• Prendre une photo du problème\n• Me dire quels sont vos paramètres actuels (pH, EC)\n• Préciser depuis quand vous observez cela\n\nCela m\'aidera à vous donner un diagnostic plus précis !';
    }
  };

  const quickDiagnoses = [
    {
      title: 'Feuilles jaunes',
      description: 'Diagnostic rapide pour jaunissement',
      severity: 'medium',
      solutions: ['Vérifier le pH', 'Ajuster l\'azote', 'Contrôler l\'arrosage']
    },
    {
      title: 'Croissance lente',
      description: 'Retard de développement',
      severity: 'low',
      solutions: ['Vérifier l\'éclairage', 'Optimiser la température', 'Contrôler les nutriments']
    },
    {
      title: 'Racines noires',
      description: 'Problème racinaire critique',
      severity: 'high',
      solutions: ['Changer la solution', 'Améliorer l\'oxygénation', 'Traiter le pathogène']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Assistant Diagnostic IA</span>
              </CardTitle>
              <CardDescription>
                Décrivez vos symptômes pour un diagnostic personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Décrivez votre problème..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-1" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Rapport
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Diagnostics rapides */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Diagnostics Rapides</CardTitle>
              <CardDescription>Solutions pour problèmes courants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickDiagnoses.map((diagnosis, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{diagnosis.title}</h4>
                      <Badge variant={
                        diagnosis.severity === 'high' ? 'destructive' :
                        diagnosis.severity === 'medium' ? 'secondary' : 'outline'
                      }>
                        {diagnosis.severity === 'high' ? 'Urgent' :
                         diagnosis.severity === 'medium' ? 'Modéré' : 'Faible'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{diagnosis.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Solutions :</p>
                      {diagnosis.solutions.map((solution, i) => (
                        <p key={i} className="text-xs text-gray-600">• {solution}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
