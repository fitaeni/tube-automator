import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { profileApi, type Profile } from '@/lib/api';
import { Plus, Settings, Trash2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ProfileListProps {
  profiles: string[];
  onSelectProfile: (profileName: string) => void;
  selectedProfile: string | null;
  onProfilesUpdate: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  onSelectProfile,
  selectedProfile,
  onProfilesUpdate,
}) => {
  const [profilesData, setProfilesData] = useState<Record<string, Profile>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [clientSecretFile, setClientSecretFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfilesData = async () => {
      const data: Record<string, Profile> = {};
      for (const profileName of profiles) {
        try {
          const response = await profileApi.getProfile(profileName);
          data[profileName] = response.data;
        } catch (error) {
          console.error(`Failed to load profile ${profileName}:`, error);
        }
      }
      setProfilesData(data);
    };

    if (profiles.length > 0) {
      loadProfilesData();
    }
  }, [profiles]);

  const handleAddProfile = async () => {
    if (!newProfileName || !clientSecretFile) {
      toast({
        title: "Missing information",
        description: "Please provide profile name and client secret file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('profile_name', newProfileName);
    formData.append('client_secret_file', clientSecretFile);

    try {
      const response = await profileApi.addProfile(formData);
      toast({
        title: "Success",
        description: response.data.message,
      });
      setShowAddDialog(false);
      setNewProfileName('');
      setClientSecretFile(null);
      onProfilesUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileName: string) => {
    if (!confirm(`Are you sure you want to delete profile "${profileName}"?`)) {
      return;
    }

    try {
      const response = await profileApi.deleteProfile(profileName);
      toast({
        title: "Success",
        description: response.data.message,
      });
      onProfilesUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  const getAuthIcon = (authStatus?: string) => {
    switch (authStatus) {
      case 'Authenticated':
        return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'Authenticated (Token Expired)':
        return <ShieldAlert className="h-4 w-4 text-warning" />;
      default:
        return <Shield className="h-4 w-4 text-destructive" />;
    }
  };

  const getAuthVariant = (authStatus?: string) => {
    switch (authStatus) {
      case 'Authenticated':
        return 'default' as const;
      case 'Authenticated (Token Expired)':
        return 'secondary' as const;
      default:
        return 'destructive' as const;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profiles</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profileName">Profile Name</Label>
                <Input
                  id="profileName"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                />
              </div>
              <div>
                <Label htmlFor="clientSecret">Client Secret File</Label>
                <Input
                  id="clientSecret"
                  type="file"
                  accept=".json"
                  onChange={(e) => setClientSecretFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={handleAddProfile} disabled={loading} className="w-full">
                {loading ? 'Adding...' : 'Add Profile'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profileName) => {
          const profile = profilesData[profileName];
          return (
            <Card
              key={profileName}
              className={`cursor-pointer transition-all hover:shadow-glow ${
                selectedProfile === profileName ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectProfile(profileName)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{profileName}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {profile && (
                      <Badge variant={getAuthVariant(profile.auth_status)} className="flex items-center gap-1">
                        {getAuthIcon(profile.auth_status)}
                        {profile.auth_status?.split(' ')[0] || 'Not Auth'}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProfile(profileName);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profile && (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>Start Time: {profile.start_time}</div>
                    <div>Category: {profile.category}</div>
                    <div>Schedule: {profile.schedule_slots?.split(',').length || 0} slots</div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No profiles yet</h3>
          <p className="text-muted-foreground">Create your first profile to get started</p>
        </div>
      )}
    </div>
  );
};