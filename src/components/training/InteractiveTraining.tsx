
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, FileText, Award, CheckCircle, PlayCircle } from 'lucide-react';

export const InteractiveTraining = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      title: 'Les Bases de l\'Hydroponie',
      description: 'Comprendre les principes fondamentaux',
      progress: 100,
      status: 'completed',
      duration: '2h 30min',
      lessons: 12,
      quiz: true,
      certificate: false
    },
    {
      id: 2,
      title: 'Gestion du pH et de la Nutrition',
      description: 'Optimiser les paramètres nutritionnels',
      progress: 60,
      status: 'in-progress',
      duration: '3h 15min',
      lessons: 15,
      quiz: true,
      certificate: false
    },
    {
      id: 3,
      title: 'Éclairage et Photopériode',
      description: 'Maîtriser l\'éclairage artificiel',
      progress: 0,
      status: 'not-started',
      duration: '2h 45min',
      lessons: 10,
      quiz: true,
      certificate: false
    },
    {
      id: 4,
      title: 'Maladies et Prévention',
      description: 'Identifier et traiter les problèmes',
      progress: 0,
      status: 'not-started',
      duration: '4h 00min',
      lessons: 18,
      quiz: true,
      certificate: false
    }
  ];

  const quizQuestions = [
    {
      question: 'Quel est le pH optimal pour la plupart des cultures hydroponiques ?',
      options: ['5.5 - 6.5', '6.5 - 7.5', '7.0 - 8.0', '4.0 - 5.0'],
      correct: 0
    },
    {
      question: 'Quelle est la principale cause de jaunissement des feuilles ?',
      options: ['Excès d\'eau', 'Carence en azote', 'Trop de lumière', 'pH trop bas'],
      correct: 1
    }
  ];

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble des modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="mt-2">{module.description}</CardDescription>
                </div>
                <Badge variant={
                  module.status === 'completed' ? 'default' :
                  module.status === 'in-progress' ? 'secondary' : 'outline'
                }>
                  {module.status === 'completed' ? 'Terminé' :
                   module.status === 'in-progress' ? 'En cours' : 'Nouveau'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Video className="w-4 h-4 mr-1" />
                    {module.lessons} leçons
                  </span>
                  <span>{module.duration}</span>
                </div>
                
                <Progress value={module.progress} className="h-2" />
                <p className="text-sm text-gray-600">{module.progress}% complété</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {module.quiz && (
                      <Badge variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Quiz
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedModule(module.id)}
                    variant={module.status === 'completed' ? 'outline' : 'default'}
                  >
                    {module.status === 'completed' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Revoir
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-1" />
                        {module.status === 'in-progress' ? 'Continuer' : 'Commencer'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz interactif */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Quiz Rapide - Testez vos connaissances</span>
          </CardTitle>
          <CardDescription>
            Question {currentQuiz + 1} sur {quizQuestions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{quizQuestions[currentQuiz].question}</h3>
            
            <div className="space-y-2">
              {quizQuestions[currentQuiz].options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedAnswer(index)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Progress value={((currentQuiz + 1) / quizQuestions.length) * 100} className="flex-1 mr-4" />
              <Button 
                onClick={() => setShowResult(true)}
                disabled={selectedAnswer === null}
              >
                Valider
              </Button>
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg ${
                selectedAnswer === quizQuestions[currentQuiz].correct 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="font-medium">
                  {selectedAnswer === quizQuestions[currentQuiz].correct 
                    ? '✅ Correct !' 
                    : '❌ Incorrect'}
                </p>
                <p className="text-sm mt-1">
                  La bonne réponse est : {quizQuestions[currentQuiz].options[quizQuestions[currentQuiz].correct]}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
