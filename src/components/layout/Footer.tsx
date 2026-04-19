import React from 'react';
import { Landmark, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Landmark className="h-6 w-6 text-sky-500" />
              <span className="text-xl font-bold">PanipOne</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The official digital portal for Barangay Panipuan. Empowering residents with information and accessibility.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-sky-500 transition-colors">Home</Link></li>
              <li><Link to="/directory" className="hover:text-sky-500 transition-colors">Local Directory</Link></li>
              <li><Link to="/officials" className="hover:text-sky-500 transition-colors">Barangay Officials</Link></li>
              <li><Link to="/login" className="hover:text-sky-500 transition-colors flex items-center gap-1.5 mt-4">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Portal
              </Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-sky-500 mt-0.5" />
                <span>Barangay Hall, Panipuan Road, San Fernando, Pampanga</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-sky-500" />
                <span>(045) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-sky-500" />
                <span>hello@panipuan.gov.ph</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Emergency</h3>
            <div className="rounded-xl border bg-white dark:bg-slate-900 p-4 shadow-sm">
              <p className="text-xs font-medium text-destructive uppercase tracking-wider mb-2">24/7 Hotline</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">911</p>
              <p className="text-xs text-muted-foreground mt-1">Direct to Barangay Response Team</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Barangay Panipuan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}