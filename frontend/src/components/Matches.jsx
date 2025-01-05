import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

const Matches = ({ matches = [] }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-6">Your Matches</h2>
        <p className="text-gray-600">No matches found yet. Keep swiping!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Matches</h2>
      {matches.map((match) => {
        const skills = match?.skills || [];
        
        return (
          <Card key={match?.id || Math.random()} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={match?.profile_picture || "/api/placeholder/100/100"}
                  alt={match?.name || 'User'}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{match?.name || 'Anonymous User'}</h3>
                      <p className="text-sm text-gray-600 mb-2">{match?.bio || 'No bio available'}</p>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 3 && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            +{skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onStartChat?.(match)}
                      className="whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Matches;