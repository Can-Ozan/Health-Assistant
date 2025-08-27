import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
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
import { CameraStatus } from "./CameraStatus";

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
      startCameraAndMonitoring();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isActive]);

  // Simulated posture analysis
  useEffect(() => {
    if (isActive && hasPermission && stream) {
      const interval = setInterval(() => {
        analyzePosture();
      }, 5000); // Her 5 saniyede bir analiz

      return () => clearInterval(interval);
    }
  }, [isActive, hasPermission, score, stream]);

  const startCameraAndMonitoring = async () => {
    console.log('Kamera başlatılıyor...');
    await requestCameraPermission();
  };

  const requestCameraPermission = async () => {
    try {
      console.log('Kamera izni isteniyor...');
      
      // Cihazları kontrol et (bazı tarayıcılarda izin verilmeden boş dönebilir)
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Bulunan video cihazları (ön kontrol):', videoDevices.length);
      } catch (e) {
        console.log('Cihaz listesi alınamadı, getUserMedia ile devam edilecek');
      }

      const constraints = {
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      };

      console.log('Kamera stream başlatılıyor...', constraints);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Kamera stream başarılı:', mediaStream.getTracks().length, 'track');
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('Video element stream atandı');
        
        // Video yüklendiğinde play et
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata yüklendi, play ediliyor...');
          videoRef.current?.play().catch(console.error);
        };
      }
      
    } catch (error) {
      console.error('Kamera erişim hatası:', error);
      
      let errorMessage = 'Kamera erişimi başarısız';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Kamera izni reddedildi. Lütfen tarayıcı ayarlarından kamera iznini etkinleştirin.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Kamera bulunamadı. Lütfen kameranızın bağlı olduğundan emin olun.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Kamera kullanımda veya erişilemiyor.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Kamera ayarları desteklenmiyor.';
        }
      }
      
      setHasPermission(false);
      setPostureWarnings([errorMessage]);
    }
  };

  const stopCamera = () => {
    console.log('Kamera durduruluyor...');
    
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Track durduruluyor:', track.kind, track.label);
        track.stop();
      });
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    
    setHasPermission(null);
    console.log('Kamera durduruldu');
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
      {/* Kamera Sistem Durumu */}
      <CameraStatus />
      
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Duruş Monitoring Sistemi
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover-scale">
                  <Settings className="h-4 w-4" />
                  Ayarlar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kamera Ayarları</DialogTitle>
                  <DialogDescription>
                    Kamera iznini yenileyebilir ve akış ayarlarını düzenleyebilirsiniz.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Button onClick={requestCameraPermission} variant="wellness" className="w-full">
                    <Camera className="h-4 w-4" />
                    İzni Yenile ve Kamerayı Aç
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    İzin vermediyseniz tarayıcınızın site ayarlarından kamerayı etkinleştirin.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="secondary">Kapat</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Gerçek zamanlı duruş analizi ve akıllı uyarılar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Kamera Feed */}
          <div className="relative bg-muted rounded-lg overflow-hidden">
            {hasPermission && stream ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 object-cover"
                  onCanPlay={() => {
                    console.log('Video canPlay event');
                    if (videoRef.current) {
                      videoRef.current.play().catch(console.error);
                    }
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                  }}
                />
                {/* Kamera aktif göstergesi */}
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  CANLI
                </div>
              </div>
            ) : hasPermission === false ? (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <CameraOff className="h-12 w-12 mx-auto text-destructive" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-destructive">
                      Kamera Erişimi Reddedildi
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Duruş analizi için kamera erişimi gereklidir
                    </p>
                  </div>
                  <Button variant="outline" onClick={requestCameraPermission}>
                    <Camera className="h-4 w-4 mr-2" />
                    Tekrar Dene
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Monitor className="h-12 w-12 mx-auto text-primary animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Kamera Erişimi İsteniyor...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lütfen tarayıcınızdan kamera iznini onaylayın
                    </p>
                  </div>
                </div>
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