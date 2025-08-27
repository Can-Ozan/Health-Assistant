import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Monitor,
  AlertCircle,
  Eye
} from "lucide-react";

interface PostureMonitorProps {
  isActive: boolean;
  score: number;
}

export const PostureMonitor = ({ isActive, score }: PostureMonitorProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [postureWarnings, setPostureWarnings] = useState<string[]>([]);
  const [lastWarningTime, setLastWarningTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      requestCameraPermission();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isActive]);

  // Simulated posture analysis
  useEffect(() => {
    if (isActive && hasPermission) {
      const interval = setInterval(() => {
        analyzePosture();
      }, 5000); // Her 5 saniyede bir analiz

      return () => clearInterval(interval);
    }
  }, [isActive, hasPermission, score]);

  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Kamera erişimi reddedildi:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const analyzePosture = () => {
    // Simulated posture analysis based on score
    const warnings: string[] = [];
    
    if (score < 70) {
      warnings.push("Sırtınızı daha dik tutun");
      warnings.push("Ekrana daha yakın değil, daha uzak oturun");
    }
    
    if (score < 50) {
      warnings.push("Omuzlarınızı geriye çekin");
      warnings.push("Boyununuzu daha dik tutun");
    }
    
    if (score < 30) {
      warnings.push("Acil: Duruşunuzu düzeltin!");
      warnings.push("5 dakika mola verin");
    }

    if (warnings.length > 0) {
      setPostureWarnings(warnings);
      setLastWarningTime(new Date());
    } else {
      setPostureWarnings([]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Mükemmel" };
    if (score >= 60) return { variant: "secondary" as const, text: "İyi" };
    return { variant: "destructive" as const, text: "Dikkat!" };
  };

  const postureAdvice = [
    "Ayaklarınız yere tam olarak bassın",
    "Ekran göz hizanızda olmalı",
    "Kollarınız 90 derece açıda olsun",
    "Sırtınız sandalyeye yaslanmalı",
    "Her 20 dakikada uzağa bakın"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Duruş Monitoring Sistemi
          </CardTitle>
          <CardDescription>
            Gerçek zamanlı duruş analizi ve akıllı uyarılar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Kamera Feed */}
          <div className="relative bg-muted rounded-lg overflow-hidden">
            {hasPermission && stream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                {hasPermission === false ? (
                  <div className="text-center space-y-2">
                    <CameraOff className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Kamera erişimi gerekli
                    </p>
                    <Button variant="outline" onClick={requestCameraPermission}>
                      <Camera className="h-4 w-4 mr-2" />
                      Kameraya İzin Ver
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Monitor className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Monitoring başlatılıyor...
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Overlay Skorı */}
            {isActive && hasPermission && (
              <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <Badge {...getScoreBadge(score)}>
                    {getScoreBadge(score).text}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Duruş Skoru */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Duruş Skoru</span>
              <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                {score}%
              </span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Uyarılar */}
      {postureWarnings.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Duruş Uyarıları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {postureWarnings.map((warning, index) => (
                <Alert key={index} className="border-warning/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}
              {lastWarningTime && (
                <p className="text-xs text-muted-foreground">
                  Son uyarı: {lastWarningTime.toLocaleTimeString('tr-TR')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ergonomi Önerileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Doğru Duruş İpuçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {postureAdvice.map((advice, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">{advice}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hızlı Eylemler */}
      <div className="flex flex-wrap gap-2">
        <Button variant="wellness" className="flex-1">
          <Eye className="h-4 w-4" />
          Göz Egzersizi
        </Button>
        <Button variant="energy" className="flex-1">
          <Settings className="h-4 w-4" />
          Esneme Hareketi
        </Button>
        <Button variant="calm" className="flex-1">
          Kısa Mola
        </Button>
      </div>
    </div>
  );
};