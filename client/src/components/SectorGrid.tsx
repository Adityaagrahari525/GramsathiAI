import React from 'react';
import { ArrowRight, Tractor, HeartHandshake, Briefcase, GraduationCap, Home, Shield, SunMedium, Wrench } from 'lucide-react';
import { SECTORS_LIST } from '../data/schemesData';

interface SectorGridProps {
  onSelectSector: (sectorId: string) => void;
  onViewAll: () => void;
}

export const SectorGrid: React.FC<SectorGridProps> = ({
  onSelectSector,
  onViewAll,
}) => {
  const getSectorIcon = (id: string) => {
    switch (id) {
      case 'agriculture':
        return <Tractor className="w-5 h-5 text-emerald-600" />;
      case 'women':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'msme':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-amber-600" />;
      case 'housing':
        return <Home className="w-5 h-5 text-teal-600" />;
      case 'social':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'irrigation':
        return <SunMedium className="w-5 h-5 text-orange-600" />;
      case 'skill':
        return <Wrench className="w-5 h-5 text-sky-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
      {/* Header with Title & All Sectors Link */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-bold text-[#1850b5] tracking-widest uppercase mb-1">
            Maharashtra Civic Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Schemes by Sector & Need
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            All official schemes synchronised with Maharashtra State Portal, Aaple Sarkar, and National Portals.
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#1850b5] hover:text-[#0f3675] hover:underline"
        >
          <span>View all sectors (30+ links)</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* 8 Sector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SECTORS_LIST.map((sector) => (
          <div
            key={sector.id}
            onClick={() => onSelectSector(sector.id)}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getSectorIcon(sector.id)}
                </div>
                <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {sector.schemesCount} Schemes
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#1850b5] transition-colors line-clamp-1">
                {sector.title}
              </h4>
              <div className="text-xs text-slate-500 font-medium mb-2.5">
                {sector.titleMr}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {sector.highlights}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#1850b5] group-hover:translate-x-1 transition-transform">
              <span>Browse {sector.title.split('&')[0].trim()} Schemes</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
