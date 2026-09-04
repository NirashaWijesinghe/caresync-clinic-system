import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend }) {
  const colorMap = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50/50",
      iconBg: "bg-blue-600 text-white shadow-md shadow-blue-500/20",
      border: "border-blue-100/80",
    },
    teal: {
      bg: "bg-gradient-to-br from-teal-50 to-emerald-50/50",
      iconBg: "bg-teal-600 text-white shadow-md shadow-teal-500/20",
      border: "border-teal-100/80",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-pink-50/50",
      iconBg: "bg-purple-600 text-white shadow-md shadow-purple-500/20",
      border: "border-purple-100/80",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-orange-50/50",
      iconBg: "bg-amber-600 text-white shadow-md shadow-amber-500/20",
      border: "border-amber-100/80",
    },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-6 rounded-3xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 ${currentTheme.border}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${currentTheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        <div className="flex items-center gap-2 pt-1">
          {trend && (
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
          {subtitle && <p className="text-xs font-medium text-slate-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}