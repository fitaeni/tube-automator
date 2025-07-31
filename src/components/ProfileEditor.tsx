import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { profileApi, type Profile } from '@/lib/api';
import { FileManager } from './FileManager';
import { TextEditor } from './TextEditor';
import { Settings, ExternalLink, Save, Shield } from 'lucide-react';

interface ProfileEditorProps {
  profileName: string;
}

const YOUTUBE_CATEGORIES = [
  'People & Blogs',
  'Music',
  'Gaming',
  'Entertainment',
  'Howto & Style',
  'Science & Technology',
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profileName }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [profileName]);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getProfile(profileName);
      setProfile(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const response = await profileApi.saveProfile({
        ...profile,
        profile_name: profileName,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStartAuth = async () => {
    try {
      window.open(`/auth/${profileName}`, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start authentication",
        variant: "destructive",
      });
    }
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center p-8">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">{profileName}</h2>
          <Badge 
            variant={profile.auth_status === 'Authenticated' ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            <Shield className="h-3 w-3" />
            {profile.auth_status || 'Not Authenticated'}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleStartAuth}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Authenticate
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="titles">Titles</TabsTrigger>
          <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="num_audio">Number of Audio Files</Label>
                  <Input
                    id="num_audio"
                    type="number"
                    value={profile.num_audio}
                    onChange={(e) => updateProfile({ num_audio: e.target.value })}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="num_video">Number of Video Files</Label>
                  <Input
                    id="num_video"
                    type="number"
                    value={profile.num_video}
                    onChange={(e) => updateProfile({ num_video: e.target.value })}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">YouTube Category</Label>
                  <Select value={profile.category} onValueChange={(value) => updateProfile({ category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YOUTUBE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={profile.start_time}
                    onChange={(e) => updateProfile({ start_time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="schedule_slots">Schedule Slots (comma-separated, HH:MM format)</Label>
                <Input
                  id="schedule_slots"
                  value={profile.schedule_slots}
                  onChange={(e) => updateProfile({ schedule_slots: e.target.value })}
                  placeholder="07:00,13:00,19:00"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Example: 07:00,13:00,19:00 for three daily uploads
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="monetization"
                  checked={profile.monetization}
                  onCheckedChange={(checked) => updateProfile({ monetization: checked })}
                />
                <Label htmlFor="monetization">Enable Monetization</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Folder Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video_folder">Video Folder</Label>
                <Input
                  id="video_folder"
                  value={profile.video_folder}
                  onChange={(e) => updateProfile({ video_folder: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="audio_folder">Audio Folder</Label>
                <Input
                  id="audio_folder"
                  value={profile.audio_folder}
                  onChange={(e) => updateProfile({ audio_folder: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="thumb_folder">Thumbnail Folder</Label>
                <Input
                  id="thumb_folder"
                  value={profile.thumb_folder}
                  onChange={(e) => updateProfile({ thumb_folder: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="output_folder">Output Folder</Label>
                <Input
                  id="output_folder"
                  value={profile.output_folder}
                  onChange={(e) => updateProfile({ output_folder: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <FileManager profileName={profileName} />
        </TabsContent>

        <TabsContent value="titles">
          <TextEditor profileName={profileName} fileType="titles" />
        </TabsContent>

        <TabsContent value="descriptions">
          <TextEditor profileName={profileName} fileType="descriptions" />
        </TabsContent>
      </Tabs>
    </div>
  );
};