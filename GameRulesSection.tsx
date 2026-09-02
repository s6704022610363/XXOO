import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck, Sparkles, Trophy, MousePointerClick, RefreshCw, Zap } from 'lucide-react';

export const GameRulesSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section
      id="game-rules-section"
      aria-label="กฎกติกาและวิธีเล่นเกม XO"
      className="w-full max-w-4xl mx-auto mt-6 bg-slate-900/70 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md transition-all"
    >
      {/* Header Toggle */}
      <button
        id="btn-toggle-rules"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-slate-900/90 hover:bg-slate-850 border-b border-slate-800/80 transition-all text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              กฎกติกาและวิธีเล่น (Game Rules & How to Play)
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                อ่านง่าย
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              คู่มือการเล่นเกม XO 3x3 สองคน พร้อมขั้นตอนกดยืนยันตาเดิน
            </p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5 text-sm text-slate-300">
          {/* 3-Step How to Play with Confirmation System */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              <Zap className="w-4 h-4" />
              <span>ขั้นตอนและวิธีเล่น (How to Play - 3 ขั้นตอนง่ายๆ)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold font-mono flex items-center justify-center">
                      1
                    </span>
                    <MousePointerClick className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">เลือกช่องที่ต้องการ</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    แตะหรือคลิก 1 ช่องว่างบนตาราง 3x3 สัญลักษณ์ [X] หรือ [O] จะแสดงเป็นภาพตัวอย่าง (รอยืนยัน)
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between ring-1 ring-amber-500/30">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold font-mono flex items-center justify-center">
                      2
                    </span>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">ตรวจสอบและกดยืนยัน</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    กดปุ่ม <strong className="text-amber-300">"ยืนยันการเดิน"</strong> เพื่อลงเครื่องหมายจริง (หรือกด <span className="text-slate-300 font-mono">Enter</span>) หากเปลี่ยนใจกด "ยกเลิก" ได้
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-600 text-white text-xs font-bold font-mono flex items-center justify-center">
                      3
                    </span>
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">สลับตา & จำกัดเวลา 1 นาที</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ระบบจับเวลาเทิร์นละ <strong>1 นาที (60 วิ)</strong> หากหมดเวลาจะข้ามตาให้อีกฝ่ายทันที ผลัดกันเล่นจนรู้ผล
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rules & Win Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Winning Condition */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                <Trophy className="w-4 h-4" />
                <span>เงื่อนไขการชนะ (Winning Condition)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    ผู้เล่นที่วางเครื่องหมายของตนเองเรียงต่อกันครบ <strong>3 ช่องตรง</strong> จะเป็นผู้ชนะทันที
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    รูปแบบการเรียงชนะทั้ง 8 รูปแบบ: <strong>แนวนอน 3 แถว</strong>, <strong>แนวตั้ง 3 แถว</strong>, หรือ <strong>แนวทแยงมุม 2 เส้น</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* Draw Condition & Features */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>กติกาเวลาและผลเสมอ (Timer & Draw)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>ระบบจำกัดเวลา 1 นาที & ปุ่ม Stop:</strong> มีปุ่มกดหยุดเกม/หยุดเวลาชั่วคราว (Stop / เล่นต่อ) และหากเวลาหมดจะข้ามเทิร์นให้อีกฝ่ายอัตโนมัติ
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>ผลเสมอ (Draw):</strong> เมื่อวางเครื่องหมายครบทั้ง 9 ช่องบนกระดานแล้วไม่มีผู้ใดเรียงครบ 3 ช่อง
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
