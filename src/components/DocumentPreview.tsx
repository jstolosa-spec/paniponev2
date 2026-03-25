import React from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';
interface DocumentPreviewProps {
  title: string;
  residentName: string;
  date: string;
}
export function DocumentPreview({ title, residentName, date }: DocumentPreviewProps) {
  return (
    <div className="bg-white border-[12px] border-slate-100 p-12 shadow-inner font-serif text-slate-900 max-w-2xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-sky-500 p-2 rounded-full">
            <Landmark className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-500">Republic of the Philippines</h1>
        <h2 className="text-xl font-black">BARANGAY PANIPUAN</h2>
        <h3 className="text-xs uppercase tracking-widest font-bold">Office of the Punong Barangay</h3>
      </div>
      <div className="text-center mb-12">
        <h4 className="text-3xl font-black border-y-2 border-slate-900 py-4 mb-8">{title.toUpperCase()}</h4>
      </div>
      <div className="space-y-6 leading-relaxed text-lg">
        <p>TO WHOM IT MAY CONCERN:</p>
        <p>
          This is to certify that <span className="font-black underline decoration-2">{residentName}</span>, 
          of legal age, is a bona fide resident of this Barangay with postal address at 
          <span className="font-bold"> Barangay Panipuan, San Fernando, Pampanga</span>.
        </p>
        <p>
          Based on our records, the above-named person is of good moral character and 
          has no derogatory record on file in this office as of this date.
        </p>
        <p>
          Issued this <span className="font-bold">{date}</span> for whatever legal purpose it may serve.
        </p>
      </div>
      <div className="mt-20 flex justify-end">
        <div className="text-center w-64">
          <div className="relative mb-0">
             <span className="absolute -top-12 left-1/2 -translate-x-1/2 font-script text-4xl text-sky-800/40 select-none pointer-events-none italic">
                Ricardo P. Santos
             </span>
             <div className="border-t-2 border-slate-900 pt-2">
               <p className="font-black text-sm uppercase">Hon. Ricardo P. Santos</p>
               <p className="text-xs font-bold text-slate-500 uppercase">Punong Barangay</p>
             </div>
          </div>
          <div className="mt-4 flex justify-center opacity-30">
            <ShieldCheck className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}