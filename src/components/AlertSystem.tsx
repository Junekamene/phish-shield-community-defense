
import { useEffect } from "react";
import { useThreat } from "@/context/ThreatContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, X } from "lucide-react";

export const AlertSystem = () => {
  const { alerts, removeAlert } = useThreat();

  useEffect(() => {
    // Auto-remove alerts after 5 seconds
    alerts.forEach(alert => {
      setTimeout(() => {
        removeAlert(alert.id);
      }, 5000);
    });
  }, [alerts, removeAlert]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          className={`${
            alert.type === "danger" 
              ? "bg-red-900/90 border-red-500 text-red-100" 
              : "bg-green-900/90 border-green-500 text-green-100"
          } backdrop-blur-lg animate-in slide-in-from-right-full`}
        >
          {alert.type === "danger" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">{alert.message}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAlert(alert.id)}
              className="h-6 w-6 p-0 ml-2 hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
