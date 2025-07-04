
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Enregistrer l'erreur
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      componentStack: errorInfo.componentStack
    };
    
    const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
    errors.push(errorData);
    localStorage.setItem('app-errors', JSON.stringify(errors));
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-800 dark:text-red-200">
                Une erreur s'est produite
              </CardTitle>
              <CardDescription>
                L'application a rencontré une erreur inattendue. L'erreur a été enregistrée pour analyse.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button onClick={this.handleRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Recharger la page
              </Button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium">
                    Détails de l'erreur (développement)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
