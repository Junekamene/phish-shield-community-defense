
import { ThreatDashboard } from "@/components/ThreatDashboard";
import { SubmissionPanel } from "@/components/SubmissionPanel";
import { CommunityReports } from "@/components/CommunityReports";
import { AlertSystem } from "@/components/AlertSystem";
import { Header } from "@/components/Header";
import { ThreatProvider } from "@/context/ThreatContext";

const Dashboard = () => {
  return (
    <ThreatProvider>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10">
          <Header />
          <AlertSystem />
          
          <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ThreatDashboard />
              </div>
              <div className="space-y-8">
                <SubmissionPanel />
                <CommunityReports />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThreatProvider>
  );
};

export default Dashboard;
