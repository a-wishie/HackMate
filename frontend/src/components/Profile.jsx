import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProfile } from '../services/api';

const Profile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    github_url: user?.github_url || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    looking_for: user?.looking_for || [],
    experience_years: user?.experience_years || 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(formData);
      onUpdate(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (e, field) => {
    const values = e.target.value.split(',').map(v => v.trim());
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">GitHub URL</label>
            <Input
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Skills (comma-separated)
            </label>
            <Input
              value={formData.skills.join(', ')}
              onChange={(e) => handleArrayInput(e, 'skills')}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Interests (comma-separated)
            </label>
            <Input
              value={formData.interests.join(', ')}
              onChange={(e) => handleArrayInput(e, 'interests')}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Looking For (comma-separated)
            </label>
            <Input
              value={formData.looking_for.join(', ')}
              onChange={(e) => handleArrayInput(e, 'looking_for')}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Years of Experience
            </label>
            <Input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              min="0"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Profile;