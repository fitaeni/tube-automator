import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { ProfileList } from './ProfileList';
import { ProfileEditor } from './ProfileEditor';
import { LogViewer } from './LogViewer';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProfiles = async () => {
    try {
      // Since the backend doesn't have a dedicated profiles endpoint,
      // we'll try to make a request and extract profile info from errors/responses
      // For now, we'll start with a default profile that matches the backend
      setProfiles(['Contoh Profil']); // This matches the default "Contoh Profil" in the backend
    } catch (error) {
      console.error('Failed to load profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleProfilesUpdate = () => {
    loadProfiles();
    // If the selected profile was deleted, clear selection
    if (selectedProfile && !profiles.includes(selectedProfile)) {
      setSelectedProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {!selectedProfile ? (
              <ProfileList
                profiles={profiles}
                onSelectProfile={setSelectedProfile}
                selectedProfile={selectedProfile}
                onProfilesUpdate={handleProfilesUpdate}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Profiles
                  </button>
                </div>
                <ProfileEditor profileName={selectedProfile} />
              </div>
            )}
          </div>
          
          <div>
            <LogViewer />
          </div>
        </div>
      </main>
    </div>
  );
};