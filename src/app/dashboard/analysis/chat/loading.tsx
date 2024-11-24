"use client"; 
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const HexagonLoadingAnimation = () => {
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [mounted, setMounted] = useState(false);
  const [showSecondTitle, setShowSecondTitle] = useState(false);
  const { theme } = useTheme(); 

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const calculateHexagonPoints = (
    centerX: number,
    centerY: number,
    radius: number,
    points: number
  ): { x: number; y: number }[] => {
    const angle = (2 * Math.PI) / points;
    return Array.from({ length: points }, (_, i) => ({
      x: centerX + radius * Math.cos(angle * i - Math.PI / 2),
      y: centerY + radius * Math.sin(angle * i - Math.PI / 2),
    }));
  };
  
  const centerX = 250;
  const centerY = 200; // y 좌표를 위로 조정
  const nodePositions = [
    { x: centerX, y: centerY },
    ...calculateHexagonPoints(centerX, centerY, 60, 6),
    ...calculateHexagonPoints(centerX, centerY, 120, 6),
  ];

  const connections = [];
  for (let i = 1; i <= 6; i++) {
    connections.push({ start: 0, end: i });
  }
  for (let i = 1; i <= 6; i++) {
    connections.push({ start: i, end: i + 6 });
    connections.push({ start: i, end: ((i % 6) + 1) + 6 });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newActiveNodes = new Set();
      const numActive = Math.floor(Math.random() * 2) + 2;
      
      if (Math.random() > 0.7) {
        newActiveNodes.add(0);
      }
      
      while (newActiveNodes.size < numActive) {
        const randomIndex = Math.floor(Math.random() * nodePositions.length);
        newActiveNodes.add(randomIndex);
      }
      
      setActiveNodes(newActiveNodes);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg">
      <div className="relative w-[500px] h-[350px]"> {/* 높이 줄임 */}
        <svg className="w-full h-full" viewBox="0 0 500 350"> {/* viewBox 높이 조정 */}
          {/* 연결선 */}
          {connections.map((conn, index) => {
            const start = nodePositions[conn.start];
            const end = nodePositions[conn.end];
            const isActive = activeNodes.has(conn.start) && activeNodes.has(conn.end);
            
            return (
              <line
                key={`conn-${index}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isActive ? theme === 'dark' ?"#FBFFEA" : "#60A5FA" : theme === 'dark' ?'#FDFFF4':"#E2E8F0"}
                strokeWidth={isActive ? "2" : "1"}
                className={`transition-all duration-1000 ${
                  isActive ? 'opacity-70' : 'opacity-30'
                }`}
              />
            );
          })}
          
          {/* 노드 */}
          {nodePositions.map((node, index) => (
            <g key={`node-${index}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={index === 0 ? "12" : "8"}
                fill={activeNodes.has(index) ? theme === 'dark' ?'#F6FCDF':"#3B82F6" : theme === 'dark' ?'#D0D8B1':"#94A3B8"}
                className={`transition-all duration-1000 ${
                  activeNodes.has(index) ? 'opacity-100' : 'opacity-40'
                }`}
              />
              
              {activeNodes.has(index) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={index === 0 ? "16" : "12"}
                  fill="none"
                  stroke={theme === 'dark' ?"#FBFFEA" : "60A5FA"}
                  strokeWidth="2"
                  className="transition-all duration-1000 opacity-40"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      
      {/* Loading text - 간격 줄이고 패딩 조정 */}
      <div className="flex flex-col items-center justify-center mt-2"> {/* flex-column으로 변경 */}
        <p className="text-lg font-medium text-gray-700 dark:text-white">GPT 분석중...</p>
        <div className="flex items-center justify-center mt-1">
          <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
          <div className="flex gap-1 ml-2">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce" 
              style={{ backgroundColor: theme === 'dark' ? '#F6FCDF' : '#3B82F6', animationDelay: '0ms' }}
            ></div>
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce" 
              style={{ backgroundColor: theme === 'dark' ? '#F6FCDF' : '#3B82F6', animationDelay: '200ms' }}
            ></div>
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce" 
              style={{ backgroundColor: theme === 'dark' ? '#F6FCDF' : '#3B82F6', animationDelay: '400ms' }}
            ></div>
          </div>
      </div>
        </div>
        
</div>

  );
};

export default HexagonLoadingAnimation;