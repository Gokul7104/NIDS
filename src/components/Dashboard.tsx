import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Cpu, X, ArrowUpRight, Zap, Shield as ShieldIcon, Database, Network } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { DetectionResult } from '../types';

interface DashboardProps {
  detectionResults: DetectionResult[];
  activeThreats: number;
  packetsAnalyzed: number;
}

const THREAT_COLORS = ['#ef4444', '#f97316', '#eab308'];
const PROTOCOL_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6'];

export function Dashboard({ detectionResults, activeThreats, packetsAnalyzed }: DashboardProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Sample data for charts
  const threatDistribution = [
    { name: 'Critical', value: Math.floor(activeThreats * 0.3) },
    { name: 'High', value: Math.floor(activeThreats * 0.5) },
    { name: 'Medium', value: Math.floor(activeThreats * 0.2) }
  ];

  const protocolData = [
    { name: 'TCP', value: 65 },
    { name: 'UDP', value: 25 },
    { name: 'ICMP', value: 10 }
  ];

  const trafficData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    packets: Math.floor(Math.random() * 1000000),
    threats: Math.floor(Math.random() * 100)
  }));

  // Dynamic background animation
  useEffect(() => {
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw network grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Detailed content for each card
  const renderDetailedContent = () => {
    if (!selectedCard) return null;

    const contentMap = {
      threats: {
        title: "Active Threats Analysis",
        color: "red",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-4">Threat Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={threatDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {threatDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={THREAT_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value, 'Threats']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {threatDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THREAT_COLORS[index] }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-4">Attack Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'DDoS', value: 45 },
                        { name: 'SQL Injection', value: 30 },
                        { name: 'Brute Force', value: 25 }
                      ]}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, 'Percentage']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-gray-800 font-semibold mb-4">24-Hour Threat Timeline</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trafficData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                      formatter={(value: number) => [value, 'Threats']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="threats"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#threatGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )
      },
      packets: {
        title: "Network Traffic Analysis",
        color: "blue",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 font-semibold mb-4">Protocol Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={protocolData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {protocolData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PROTOCOL_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Usage']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {protocolData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PROTOCOL_COLORS[index] }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 font-semibold mb-4">24-Hour Traffic Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trafficData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="packetGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Packets']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="packets"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#packetGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-gray-800 font-semibold mb-2">Network Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Network className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Latency</div>
                  <div className="text-blue-600">12ms</div>
                </div>
                <div className="text-center">
                  <Database className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Packet Loss</div>
                  <div className="text-blue-600">0.01%</div>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Throughput</div>
                  <div className="text-blue-600">950 Mbps</div>
                </div>
                <div className="text-center">
                  <ShieldIcon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Security</div>
                  <div className="text-blue-600">Strong</div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      model: {
        title: "ML Model Performance",
        color: "purple",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-purple-800 font-semibold mb-4">Model Metrics</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Accuracy', value: 98.5 },
                        { name: 'Precision', value: 96.7 },
                        { name: 'Recall', value: 97.2 }
                      ]}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, 'Score']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-purple-800 font-semibold mb-4">Resource Usage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={Array.from({ length: 24 }, (_, i) => ({
                        hour: i,
                        cpu: Math.random() * 100,
                        memory: Math.random() * 100
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Usage']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        name="CPU"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#cpuGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        name="Memory"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#memoryGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-gray-800 font-semibold mb-2">Model Architecture</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Input Layer:</span>
                  <span>4 neurons (network features)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Hidden Layer 1:</span>
                  <span>16 neurons (ReLU activation)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Hidden Layer 2:</span>
                  <span>8 neurons (ReLU activation)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Output Layer:</span>
                  <span>1 neuron (Sigmoid activation)</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    };

    const content = contentMap[selectedCard as keyof typeof contentMap];
    if (!content) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className={`flex items-center justify-between p-4 border-b border-gray-100`}>
            <h2 className={`text-xl font-semibold text-${content.color}-600`}>{content.title}</h2>
            <button
              onClick={() => setSelectedCard(null)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            {content.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Dynamic Background */}
      <canvas
        id="bgCanvas"
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ opacity: 0.3 }}
      />

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div 
            className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 p-4 md:p-6 cursor-pointer transform hover:scale-105 ${
              selectedCard === 'threats' 
                ? 'border-red-300 ring-2 ring-red-100 bg-gradient-to-br from-red-50 to-white' 
                : 'border-gray-100 hover:border-red-200'
            }`}
            onClick={() => setSelectedCard(selectedCard === 'threats' ? null : 'threats')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Threats</p>
                <p className="text-xl md:text-2xl font-bold text-red-600 mt-1">{activeThreats}</p>
              </div>
              <div className={`p-3 rounded-lg ${selectedCard === 'threats' ? 'bg-red-100' : 'bg-red-50'}`}>
                <AlertTriangle className="text-red-600 w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 p-4 md:p-6 cursor-pointer transform hover:scale-105 ${
              selectedCard === 'system' 
                ? 'border-green-300 ring-2 ring-green-100 bg-gradient-to-br from-green-50 to-white' 
                : 'border-gray-100 hover:border-green-200'
            }`}
            onClick={() => setSelectedCard(selectedCard === 'system' ? null : 'system')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">System Status</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">Protected</p>
              </div>
              <div className={`p-3 rounded-lg ${selectedCard === 'system' ? 'bg-green-100' : 'bg-green-50'}`}>
                <Shield className="text-green-600 w-6 h-6" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 p-4 md:p-6 cursor-pointer transform hover:scale-105 ${
              selectedCard === 'packets' 
                ? 'border-blue-300 ring-2 ring-blue-100 bg-gradient-to-br from-blue-50 to-white' 
                : 'border-gray-100 hover:border-blue-200'
            }`}
            onClick={() => setSelectedCard(selectedCard === 'packets' ? null : 'packets')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Packets Analyzed</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">{packetsAnalyzed.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg ${selectedCard === 'packets' ? 'bg-blue-100' : 'bg-blue-50'}`}>
                <Activity className="text-blue-600 w-6 h-6" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 p-4 md:p-6 cursor-pointer transform hover:scale-105 ${
              selectedCard === 'model' 
                ? 'border-purple-300 ring-2 ring-purple-100 bg-gradient-to-br from-purple-50 to-white' 
                : 'border-gray-100 hover:border-purple-200'
            }`}
            onClick={() => setSelectedCard(selectedCard === 'model' ? null : 'model')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">ML Model Status</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600 mt-1">Active</p>
              </div>
              <div className={`p-3 rounded-lg ${selectedCard === 'model' ? 'bg-purple-100' : 'bg-purple-50'}`}>
                <Cpu className="text-purple-600 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Threat Detection Timeline</h2>
          <div className="h-[250px] md:h-[300px] -mx-4 md:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={detectionResults}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }} 
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Threat Level']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="threat" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Recent Alerts</h2>
          <div className="space-y-3 md:space-y-4">
            {detectionResults.slice(-5).reverse().map((result, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 md:p-4 rounded-lg border backdrop-blur-sm transition-colors duration-200 ${
                  result.threat > 0.7 
                    ? 'bg-red-50/80 border-red-100' 
                    : 'bg-yellow-50/80 border-yellow-100'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 md:w-6 md:h -6 md:h-6 ${
                  result.threat > 0.7 ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm md:text-base font-medium truncate text-gray-900">
                    {result.details}
                  </p>
                </div>
                <div className="md:ml-auto">
                  <span className={`inline-block px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    result.threat > 0.7 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(result.threat * 100).toFixed(1)}% Threat
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Content Modal */}
      {renderDetailedContent()}
    </div>
  );
}