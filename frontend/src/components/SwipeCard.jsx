import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Github } from 'lucide-react';

const SwipeCard = ({ user, onSwipe }) => {
  const [exitDirection, setExitDirection] = useState(null);

  const handleSwipe = (direction) => {
    setExitDirection(direction);
    setTimeout(() => {
      onSwipe(direction === 'right');
      setExitDirection(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={user.id}
        initial={{ scale: 1 }}
        animate={{
          scale: 1,
          x: exitDirection === 'left' ? -300 : exitDirection === 'right' ? 300 : 0,
          rotate: exitDirection === 'left' ? -30 : exitDirection === 'right' ? 30 : 0,
        }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute w-full"
      >
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
              <img 
                src={user.profile_picture || "/api/placeholder/400/400"} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <a 
                  href={user.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>

              <p className="text-gray-600">{user.bio}</p>

              <div className="space-y-2">
                <h3 className="font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full p-6"
                  onClick={() => handleSwipe('left')}
                >
                  <ThumbsDown className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full p-6"
                  onClick={() => handleSwipe('right')}
                >
                  <ThumbsUp className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeCard;