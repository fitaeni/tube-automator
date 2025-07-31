import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { filesApi, type FilesData } from '@/lib/api';
import { 
  Upload, 
  Trash2, 
  Video, 
  Music, 
  Image, 
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';

interface FileManagerProps {
  profileName: string;
}

export const FileManager: React.FC<FileManagerProps> = ({ profileName }) => {
  const [files, setFiles] = useState<FilesData>({ videos: [], audios: [], thumbs: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  const loadFiles = useCallback(async () => {
    try {
      const response = await filesApi.listFiles(profileName);
      setFiles(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [profileName, toast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFileUpload = async (acceptedFiles: File[], fileType: string) => {
    if (acceptedFiles.length === 0) return;

    setUploading(fileType);
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('profile_name', profileName);
      formData.append('file_type', fileType);

      try {
        await filesApi.uploadFile(formData);
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
    setUploading(null);
    loadFiles();
  };

  const handleFileDelete = async (fileName: string, fileType: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    try {
      await filesApi.deleteFile(profileName, fileName, fileType);
      toast({
        title: "Success",
        description: `${fileName} deleted successfully`,
      });
      loadFiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const FileSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    files: string[];
    fileType: string;
    acceptedTypes: string;
    color: string;
  }> = ({ title, icon, files, fileType, acceptedTypes, color }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles, fileType),
      accept: acceptedTypes.split(',').reduce((acc, type) => {
        acc[type.trim()] = [];
        return acc;
      }, {} as Record<string, string[]>),
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              {title}
              <Badge variant="outline">{files.length}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={loadFiles}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? `Drop ${title.toLowerCase()} here...`
                : `Drag & drop ${title.toLowerCase()}, or click to select`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Accepted: {acceptedTypes}
            </p>
            {uploading === fileType && (
              <div className="mt-2 text-sm text-primary">Uploading...</div>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileName) => (
              <div
                key={fileName}
                className="flex items-center justify-between p-2 rounded border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-sm truncate" title={fileName}>
                    {fileName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileDelete(fileName, fileType)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {files.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No files uploaded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading files...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <FileSection
        title="Videos"
        icon={<Video className="h-5 w-5 text-blue-500" />}
        files={files.videos}
        fileType="videos"
        acceptedTypes="video/mp4,video/mov,video/mkv,.mp4,.mov,.mkv"
        color="bg-blue-500"
      />
      
      <FileSection
        title="Audio"
        icon={<Music className="h-5 w-5 text-green-500" />}
        files={files.audios}
        fileType="audios"
        acceptedTypes="audio/mp3,audio/wav,audio/m4a,.mp3,.wav,.m4a"
        color="bg-green-500"
      />
      
      <FileSection
        title="Thumbnails"
        icon={<Image className="h-5 w-5 text-purple-500" />}
        files={files.thumbs}
        fileType="thumbs"
        acceptedTypes="image/png,image/jpg,image/jpeg,.png,.jpg,.jpeg"
        color="bg-purple-500"
      />
    </div>
  );
};