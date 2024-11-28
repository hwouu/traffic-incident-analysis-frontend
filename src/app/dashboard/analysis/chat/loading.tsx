"use client"; 
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const HexagonLoadingAnimation = () => {
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [mounted, setMounted] = useState(false);
  const [showSecondTitle, setShowSecondTitle] = useState(false);
  const { theme } = useTheme(); 

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
  const centerY = 200;
  const nodePositions = [
    { x: centerX, y: centerY },
    ...calculateHexagonPoints(centerX, centerY, 60, 6),
    ...calculateHexagonPoints(centerX, centerY, 120, 6),
  ];

  const connections: { start: number; end: number }[] = [];
  for (let i = 1; i <= 6; i++) {
    connections.push({ start: 0, end: i });
  }
  for (let i = 1; i <= 6; i++) {
    connections.push({ start: i, end: i + 6 });
    connections.push({ start: i, end: ((i % 6) + 1) + 6 });
  }

  // 주어진 노드와 연결된 모든 노드의 인덱스를 반환하는 함수
  const getConnectedNodes = (nodeIndex: number) => {
    const connected = new Set<number>();
    connections.forEach(conn => {
      if (conn.start === nodeIndex) {
        connected.add(conn.end);
      }
      if (conn.end === nodeIndex) {
        connected.add(conn.start);
      }
    });
    return Array.from(connected);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newActiveNodes = new Set<number>();
      
      // 중앙 노드를 80% 확률로 활성화
      if (Math.random() > 0.5) {
        newActiveNodes.add(0);
      }
      
      // 4-6개의 노드를 활성화
      const numActive = Math.floor(Math.random() * 3) + 4;
      
      // 이미 활성화된 노드와 연결된 노드들 중에서 우선적으로 선택
      while (newActiveNodes.size < numActive) {
        const activeNodesArray = Array.from(newActiveNodes);
        if (activeNodesArray.length > 0 && Math.random() > 0.5) {
          // 현재 활성화된 노드 중 하나를 무작위로 선택
          const randomActiveNode = activeNodesArray[Math.floor(Math.random() * activeNodesArray.length)];
          // 선택된 노드와 연결된 노드들을 가져옴
          const connectedNodes = getConnectedNodes(randomActiveNode);
          // 연결된 노드 중 하나를 무작위로 선택하여 활성화
          if (connectedNodes.length > 0) {
            const randomConnected = connectedNodes[Math.floor(Math.random() * connectedNodes.length)];
            newActiveNodes.add(randomConnected);
            continue;
          }
        }
        
        // 연결된 노드를 선택하지 않았을 경우, 무작위 노드 선택
        const randomIndex = Math.floor(Math.random() * nodePositions.length);
        newActiveNodes.add(randomIndex);
      }
      
      setActiveNodes(newActiveNodes);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg">
      <div className="relative w-[500px] h-[350px]">
        <svg className="w-full h-full" viewBox="0 0 500 380">
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
                stroke={isActive ? theme === 'dark' ? "#FBFFEA" : "#60A5FA" : theme === 'dark' ? '#FDFFF4' : "#E2E8F0"}
                strokeWidth={isActive ? "3" : "1"}
                className={`transition-all duration-1000 ${
                  isActive ? 'opacity-90' : 'opacity-20'
                }`}
              />
            );
          })}
          
          {nodePositions.map((node, index) => (
            <g key={`node-${index}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={index === 0 ? "12" : "8"}
                fill={activeNodes.has(index) ? theme === 'dark' ? '#F6FCDF' : "#3B82F6" : theme === 'dark' ? '#D0D8B1' : "#94A3B8"}
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
                  stroke={theme === 'dark' ? "#FBFFEA" : "#60A5FA"}
                  strokeWidth="2"
                  className="transition-all duration-1000 opacity-40"
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-2 space-y-4">
        <p className="text-lg font-medium text-gray-700 dark:text-white">GPT 분석중...</p>
        <div className="flex items-center justify-center">
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