import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { textApi } from '@/lib/api';
import { Save, FileText, RotateCcw, Info } from 'lucide-react';

interface TextEditorProps {
  profileName: string;
  fileType: 'titles' | 'descriptions';
}

export const TextEditor: React.FC<TextEditorProps> = ({ profileName, fileType }) => {
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, [profileName, fileType]);

  const loadContent = async () => {
    try {
      const response = await textApi.getTextFile(profileName, fileType);
      const fileContent = response.data.content;
      setContent(fileContent);
      setOriginalContent(fileContent);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load ${fileType}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await textApi.saveTextFile(profileName, fileType, content);
      toast({
        title: "Success",
        description: response.data.message,
      });
      setOriginalContent(content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to save ${fileType}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContent(originalContent);
  };

  const hasChanges = content !== originalContent;
  const lines = content.split('\n').filter(line => line.trim() !== '');

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading {fileType}...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {fileType === 'titles' ? 'Video Titles' : 'Video Descriptions'}
            <Badge variant="outline">{lines.length} lines</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fileType === 'titles' && (
          <div className="p-4 bg-info/10 rounded-lg border border-info/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-info mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-info">Title Guidelines:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• One title per line</li>
                  <li>• Titles are consumed sequentially</li>
                  <li>• Use spintax: {'{option1|option2|option3}'}</li>
                  <li>• Keep under 100 characters for best visibility</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {fileType === 'descriptions' && (
          <div className="p-4 bg-info/10 rounded-lg border border-info/20">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-info mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-info">Description Guidelines:</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• One description per line (random selection)</li>
                  <li>• Use spintax: {'{option1|option2|option3}'}</li>
                  <li>• Include keywords for better SEO</li>
                  <li>• Add hashtags and call-to-action</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            fileType === 'titles'
              ? 'Enter video titles, one per line...\n\nExample:\nAwesome Video Title {#1|#2|#3}\nAnother {Great|Amazing|Fantastic} Video\n{Top|Best} Tutorial for Beginners'
              : 'Enter video descriptions, one per line...\n\nExample:\nThis is an {amazing|awesome|incredible} video about {topic1|topic2}!\n\n👍 Like and Subscribe for more!\n\n#trending #viral #content'
          }
          className="min-h-[400px] font-mono text-sm"
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {lines.length} {fileType === 'titles' ? 'titles' : 'descriptions'} available
          </div>
          {hasChanges && (
            <div className="text-warning">Unsaved changes</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};