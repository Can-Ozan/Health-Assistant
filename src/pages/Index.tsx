import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Camera, 
  Eye, 
  Timer, 
  Activity, 
  Heart, 
  Users, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Bell,
  CheckCircle
} from "lucide-react";
import { PostureMonitor } from "@/components/PostureMonitor";
import { ExerciseGuide } from "@/components/ExerciseGuide";
import { StreamerMode } from "@/components/StreamerMode";
import { HealthStats } from "@/components/HealthStats";
import { ReminderSystem } from "@/components/ReminderSystem";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [postureScore, setPostureScore] = useState(85);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [streamerMode, setStreamerMode] = useState(false);
  const [todayStats, setTodayStats] = useState({
    sessionsCompleted: 6,
    exercisesCompleted: 12,
    breaksTaken: 8,
    hoursWorked: 7.5
  });

  // Posture sekmesine geçildiğinde otomatik başlat (izin istemek için)
  useEffect(() => {
    if (activeTab === "posture" && !isMonitoring) {
      setIsMonitoring(true);
    }
  }, [activeTab, isMonitoring]);

  // Simüle edilmiş duruş skoru güncellemesi
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setPostureScore(prev => {
          const change = Math.random() * 10 - 5; // -5 ile +5 arası değişim
          return Math.max(0, Math.min(100, prev + change));
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "posture":
        return <PostureMonitor isActive={isMonitoring} score={postureScore} />;
      case "exercises":
        return <ExerciseGuide />;
      case "streamer":
        return <StreamerMode isActive={streamerMode} setIsActive={setStreamerMode} />;
      case "stats":
        return <HealthStats stats={todayStats} />;
      default:
        return <DashboardContent />;
    }
  };

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-wellness bg-clip-text text-transparent mb-4">
          Akıllı Ergonomi Asistanı
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Evden çalışanlar için geliştirilmiş akıllı sağlık ve ergonomi sistemi. 
          Duruşunuzu kontrol edin, sağlıklı alışkanlıklar geliştirin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-wellness text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Duruş Skoru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{postureScore}%</div>
            <p className="text-sm opacity-90">
              {postureScore >= 80 ? "Mükemmel" : postureScore >= 60 ? "İyi" : "Dikkat Gerekli"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Bugünkü Seans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{todayStats.sessionsCompleted}</div>
            <p className="text-sm text-muted-foreground">Tamamlanan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Göz Egzersizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-energy">{todayStats.exercisesCompleted}</div>
            <p className="text-sm text-muted-foreground">Bu gün</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Sağlık Skoru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">92%</div>
            <p className="text-sm text-muted-foreground">Çok iyi</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Duruş Kontrolü
            </CardTitle>
            <CardDescription>
              Kameranızı kullanarak gerçek zamanlı duruş analizi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Monitoring Durumu</span>
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? "Aktif" : "Pasif"}
              </Badge>
            </div>
            <Progress value={postureScore} className="h-2" />
            <div className="flex gap-2">
              <Button
                variant={isMonitoring ? "warning" : "wellness"}
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex-1"
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Durdur
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Başlat
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Akıllı Hatırlatmalar
            </CardTitle>
            <CardDescription>
              Kişiselleştirilmiş sağlık önerileri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReminderSystem />
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Hızlı Eylemler</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="energy" onClick={() => setActiveTab("exercises")}>
            <Eye className="h-4 w-4" />
            Göz Egzersizi
          </Button>
          <Button variant="calm" onClick={() => setActiveTab("exercises")}>
            <RotateCcw className="h-4 w-4" />
            Esneme Hareketleri
          </Button>
          <Button variant="wellness" onClick={() => setActiveTab("posture")}>
            <Camera className="h-4 w-4" />
            Duruş Kontrolü
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("streamer")}>
            <Users className="h-4 w-4" />
            Yayıncı Modu
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-wellness rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">ErgoAsistan</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {[
                { id: "dashboard", label: "Ana Sayfa", icon: Monitor },
                { id: "posture", label: "Duruş", icon: Activity },
                { id: "exercises", label: "Egzersizler", icon: Eye },
                { id: "streamer", label: "Yayıncı", icon: Users },
                { id: "stats", label: "İstatistikler", icon: Heart }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={activeTab === id ? "default" : "ghost"}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? "Monitoring" : "Offline"}
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Index;