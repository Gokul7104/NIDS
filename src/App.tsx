import React, { useEffect, useState } from 'react';
import { IntrusionDetectionModel } from './ml/model';
import { Dashboard } from './components/Dashboard';
import { NetworkPacket, DetectionResult } from './types';
import { Shield } from 'lucide-react';

function App() {
  const [model] = useState(new IntrusionDetectionModel());
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [activeThreats, setActiveThreats] = useState(0);
  const [packetsAnalyzed, setPacketsAnalyzed] = useState(0);

  // Simulate network traffic and analysis
  useEffect(() => {
    const initializeModel = async () => {
      await model.initialize();
    };

    initializeModel();

    const simulateTraffic = () => {
      const packet: NetworkPacket = {
        timestamp: Date.now(),
        sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destinationIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        protocol: Math.random() > 0.5 ? 'TCP' : 'UDP',
        bytesTransferred: Math.floor(Math.random() * 2000000),
        packetsPerSecond: Math.floor(Math.random() * 2000)
      };

      // Feature extraction for ML model
      const features = [
        packet.bytesTransferred / 2000000,
        packet.packetsPerSecond / 2000,
        packet.protocol === 'TCP' ? 1 : 0,
        Math.random()
      ];

      // Analyze packet
      model.predict(features).then(threatScore => {
        const isAnomaly = model.detectAnomaly(packet.bytesTransferred, packet.packetsPerSecond);
        
        const result: DetectionResult = {
          timestamp: packet.timestamp,
          threat: threatScore,
          details: isAnomaly 
            ? `Anomalous traffic detected from ${packet.sourceIP}`
            : `Normal traffic pattern from ${packet.sourceIP}`
        };

        setDetectionResults(prev => [...prev.slice(-50), result]);
        setActiveThreats(prev => isAnomaly ? prev + 1 : prev);
        setPacketsAnalyzed(prev => prev + 1);
      });
    };

    const interval = setInterval(simulateTraffic, 2000);
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
              Network Intrusion Detection System
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-8">
        <Dashboard 
          detectionResults={detectionResults}
          activeThreats={activeThreats}
          packetsAnalyzed={packetsAnalyzed}
        />
      </main>
    </div>
  );
}

export default App;