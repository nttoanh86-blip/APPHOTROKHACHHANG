/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { GameSection } from './components/GameSection';
import { SavingsCalculator } from './components/SavingsCalculator';
import { LoanScheduleCalculator } from './components/LoanScheduleCalculator';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchNetworkSection } from './components/BranchNetworkSection';
import { FarewellModal } from './components/FarewellModal';
import { KioskFooter } from './components/KioskFooter';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [isFarewellOpen, setIsFarewellOpen] = useState<boolean>(false);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // Smooth GSAP transition on tab switch
  useEffect(() => {
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleBackToMainMenu = () => {
    setActiveTab('faq');
  };

  const handleEndConversation = () => {
    setIsFarewellOpen(true);
  };

  const handleRestartKiosk = () => {
    setActiveTab('faq');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 selection:bg-[#003B70] selection:text-white">
      {/* Kiosk Header */}
      <Header
        activeTab={activeTab}
        onEndConversation={handleEndConversation}
        onResetToHome={handleBackToMainMenu}
      />

      {/* 7 Features Navigation Bar */}
      <Navigation activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Main Dynamic Workspace Area */}
      <main className="flex-1 w-full" ref={contentContainerRef}>
        {activeTab === 'faq' && (
          <FaqSection
            onBackToMainMenu={handleBackToMainMenu}
            onEndConversation={handleEndConversation}
          />
        )}

        {activeTab === 'download-app' && <AppDownloadSection />}

        {activeTab === 'games' && <GameSection />}

        {activeTab === 'savings' && <SavingsCalculator />}

        {activeTab === 'loans' && <LoanScheduleCalculator />}

        {activeTab === 'products' && <FeaturedProductsSection />}

        {activeTab === 'branches' && <BranchNetworkSection />}
      </main>

      {/* Counter Kiosk Footer */}
      <KioskFooter />

      {/* Farewell Modal: "Cảm ơn Quý khách đã sử dụng dịch vụ của VietinBank..." */}
      <FarewellModal
        isOpen={isFarewellOpen}
        onClose={() => setIsFarewellOpen(false)}
        onRestart={handleRestartKiosk}
      />
    </div>
  );
}
