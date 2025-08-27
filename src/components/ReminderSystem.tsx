import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Eye, 
  Clock, 
  RotateCcw, 
  CheckCircle, 
  X, 
  Timer,
  Coffee,
  Activity
} from "lucide-react";

interface Reminder {
  id: string;
  type: "eye" | "posture" | "break" | "stretch";
  title: string;
  message: string;
  timeLeft: number;
  totalTime: number;
  priority: "low" | "medium" | "high";
}

export const ReminderSystem = () => {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([
    {
      id: "eye-1",
      type: "eye",
      title: "Göz Egzersizi Zamanı",
      message: "20-20-20 kuralını uygulamanın zamanı geldi",
      timeLeft: 180,
      totalTime: 1200, // 20 dakika
      priority: "medium"
    },
    {
      id: "break-1",
      type: "break",
      title: "Kısa Mola",
      message: "5 dakikalık mola vermenizi öneriyoruz",
      timeLeft: 300,
      totalTime: 1800, // 30 dakika
      priority: "high"
    }
  ]);

  const [upcomingReminders, setUpcomingReminders] = useState([
    {
      type: "stretch",
      title: "Esneme Hareketi",
      time: "8 dakika",
      icon: RotateCcw
    },
    {
      type: "posture",
      title: "Duruş Kontrolü",
      time: "15 dakika",
      icon: Activity
    },
    {
      type: "eye",
      title: "Göz Dinlendirme",
      time: "22 dakika",
      icon: Eye
    }
  ]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReminders(prev => 
        prev.map(reminder => ({
          ...reminder,
          timeLeft: Math.max(0, reminder.timeLeft - 1)
        })).filter(reminder => reminder.timeLeft > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissReminder = (id: string) => {
    setActiveReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const completeReminder = (id: string) => {
    // Hatırlatıcıyı tamamla ve istatistikleri güncelle
    const reminder = activeReminders.find(r => r.id === id);
    if (reminder) {
      // Burada tamamlanan aktivite türüne göre istatistik güncelleme yapılabilir
      dismissReminder(id);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "eye": return Eye;
      case "posture": return Activity;
      case "break": return Coffee;
      case "stretch": return RotateCcw;
      default: return Bell;
    }
  };

  const getReminderColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-destructive bg-destructive/10";
      case "medium": return "border-warning bg-warning/10";
      case "low": return "border-primary bg-primary/10";
      default: return "border-muted bg-muted/10";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return { variant: "destructive" as const, text: "Acil" };
      case "medium": return { variant: "secondary" as const, text: "Orta" };
      case "low": return { variant: "outline" as const, text: "Düşük" };
      default: return { variant: "outline" as const, text: "Normal" };
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Aktif Hatırlatıcılar */}
      {activeReminders.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Aktif Hatırlatıcılar
          </h4>
          {activeReminders.map((reminder) => {
            const Icon = getReminderIcon(reminder.type);
            const progress = ((reminder.totalTime - reminder.timeLeft) / reminder.totalTime) * 100;
            
            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-lg border-2 transition-all animate-pulse-wellness ${getReminderColor(reminder.priority)}`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{reminder.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge {...getPriorityBadge(reminder.priority)}>
                        {getPriorityBadge(reminder.priority).text}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dismissReminder(reminder.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-muted-foreground">
                    {reminder.message}
                  </p>

                  {/* Progress and Time */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Kalan süre</span>
                      <span className="font-bold">{formatTime(reminder.timeLeft)}</span>
                    </div>
                    <Progress value={100 - progress} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => completeReminder(reminder.id)}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Tamamla
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dismissReminder(reminder.id)}
                    >
                      Ertele
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Yaklaşan Hatırlatıcılar */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Timer className="h-4 w-4" />
          Yaklaşan Etkinlikler
        </h4>
        <div className="space-y-2">
          {upcomingReminders.map((reminder, index) => {
            const Icon = reminder.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{reminder.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {reminder.time}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hızlı Eylemler */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Hızlı Eylemler</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="wellness" size="sm" className="h-12 flex-col gap-1">
            <Eye className="h-4 w-4" />
            <span className="text-xs">Göz Molası</span>
          </Button>
          <Button variant="energy" size="sm" className="h-12 flex-col gap-1">
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs">Esneme</span>
          </Button>
          <Button variant="calm" size="sm" className="h-12 flex-col gap-1">
            <Coffee className="h-4 w-4" />
            <span className="text-xs">Kısa Mola</span>
          </Button>
          <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Duruş Check</span>
          </Button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">Bugün Tamamlanan</p>
          </div>
          <div>
            <div className="text-lg font-bold text-energy">3</div>
            <p className="text-xs text-muted-foreground">Aktif Hatırlatıcı</p>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">89%</div>
            <p className="text-xs text-muted-foreground">Tamamlama Oranı</p>
          </div>
        </div>
      </div>
    </div>
  );
};