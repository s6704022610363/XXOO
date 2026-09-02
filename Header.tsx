import React from 'react';
import { Volume2, VolumeX, History, Settings, RotateCcw, Swords, Pause, Play } from 'lucide-react';
import { GameScore, PlayerSettings } from '../types';

interface HeaderProps {
  score: GameScore;
  settings: PlayerSettings;
  isPaused: boolean;
  gameStatus: 'in_progress' | 'won' | 'draw';
  onTogglePause: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onResetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  settings,
  isPaused,
  gameStatus,
  onTogglePause,
  onToggleSound,
  onOpenSettings,
  onOpenHistory,
  onResetGame,
}) => {
  const canPause = gameStatus === 'in_progress';

  return (
    <header
      id="app-header"
      className="w-full max-w-4xl mx-auto flex flex-row items-center justify-between gap-2 p-3 sm:py-3.5 sm:px-6 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div
          id="brand-logo"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 id="app-title" className="text-base sm:text-xl font-bold tracking-tight text-white truncate">
              เกม XO <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">3x3</span>
            </h1>
          </div>
          <p id="app-subtitle" className="text-[11px] sm:text-xs text-slate-400 truncate hidden xs:block">
            ระบบยืนยันตาเดิน • จับเวลา 1 นาที
          </p>
        </div>
      </div>

      {/* Controls & Quick Actions */}
      <div id="header-action-group" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Stop / Pause / Resume Button */}
        {canPause && (
          <button
            id="btn-toggle-pause"
            onClick={onTogglePause}
            title={isPaused ? 'เล่นเกมต่อ (Resume Timer)' : 'หยุดเวลาชั่วคราว (Stop Timer)'}
            className={`min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-md ${
              isPaused
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 animate-pulse shadow-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25 shadow-amber-500/10'
            }`}
            aria-label={isPaused ? 'กดเพื่อเล่นต่อ' : 'กดเพื่อหยุดเวลา'}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>เล่นต่อ</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-current shrink-0" />
                <span>Stop</span>
              </>
            )}
          </button>
        )}

        <button
          id="btn-sound-toggle"
          onClick={onToggleSound}
          title={settings.soundEnabled ? 'ปิดเสียง (Mute)' : 'เปิดเสียง (Unmute)'}
          className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-xl border flex items-center justify-center transition-all ${
            settings.soundEnabled
              ? 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700'
              : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'
          }`}
          aria-label="สลับเสียงเอฟเฟกต์"
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          id="btn-open-history"
          onClick={onOpenHistory}
          title="ดูประวัติการแข่งขัน (Match History)"
          className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
        >
          <History className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">ประวัติ (#{score.roundsPlayed + 1})</span>
        </button>

        <button
          id="btn-open-settings"
          onClick={onOpenSettings}
          title="ตั้งค่าชื่อผู้เล่น (Player Settings)"
          className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center"
          aria-label="ตั้งค่าเกม"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          id="btn-reset-round"
          onClick={onResetGame}
          title="เริ่มใหม่ (รีเซ็ตจำนวนรอบและสถิติทั้งหมดเป็น 0)"
          className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">เริ่มใหม่ทั้งหมด</span>
        </button>
      </div>
    </header>
  );
};
