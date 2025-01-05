import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SwipeCard from './components/SwipeCard';
import Matches from './components/Matches';
import Profile from './components/Profile';
import Chat from './components/Chat';
import { getMatches, getPotentialMatches, createSwipe } from './services/api';
import './styles/main.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadPotentialMatches();
      loadMatches();
    }
  }, [currentUser]);

  const loadPotentialMatches = async () => {
    const data = await getPotentialMatches();
    setPotentialMatches(data);
  };

  const loadMatches = async () => {
    const data = await getMatches();
    setMatches(data);
  };

  const handleSwipe = async (isLike) => {
    if (potentialMatches.length === 0) return;
    
    const swipedUser = potentialMatches[0];
    const result = await createSwipe(swipedUser.id, isLike);
    
    if (result.is_mutual) {
      setMatches([...matches, swipedUser]);
    }
    
    setPotentialMatches(potentialMatches.slice(1));
  };

  const handleStartChat = (match) => {
    setCurrentChat(match);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-md mx-auto">
                  {potentialMatches.length > 0 ? (
                    <SwipeCard
                      user={potentialMatches[0]}
                      onSwipe={handleSwipe}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <h2 className="text-xl font-semibold">
                        No more potential matches!
                      </h2>
                      <p className="text-gray-600">
                        Check back later for new hackathon teammates
                      </p>
                    </div>
                  )}
                </div>
              }
            />
            <Route
              path="/matches"
              element={
                <Matches
                  matches={matches}
                  onStartChat={handleStartChat}
                />
              }
            />
            <Route
              path="/chat"
              element={
                currentChat ? (
                  <Chat match={currentChat} />
                ) : (
                  <Navigate to="/matches" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  user={currentUser}
                  onUpdate={setCurrentUser}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;