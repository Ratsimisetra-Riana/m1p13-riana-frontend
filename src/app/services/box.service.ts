import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Box { _id?: string; code: string; floor: number; zone: string }

@Injectable({ providedIn: 'root' })
export class BoxService {
  private api = (environment?.apiUrl || 'http://localhost:3000') + '/boxes';

  constructor(private http: HttpClient) {}

  list(): Observable<Box[]> {
    try { return this.http.get<Box[]>(this.api); } catch { return of(this.localList()); }
  }

  get(id: string): Observable<Box | null> {
    try { return this.http.get<Box>(`${this.api}/${id}`); } catch { return of(this.localList().find(b => b._id === id) || null); }
  }

  create(box: Box): Observable<Box> {
    try { return this.http.post<Box>(this.api, box); } catch {
      const created = { ...box, _id: 'box_' + Date.now() } as Box;
      const s = this.localList(); s.push(created); localStorage.setItem('cc_boxes', JSON.stringify(s));
      return of(created);
    }
  }

  update(id: string, box: Box): Observable<Box> {
    try { return this.http.put<Box>(`${this.api}/${id}`, box); } catch {
      const s = this.localList(); const idx = s.findIndex(b => b._id === id); if (idx !== -1) s[idx] = { ...s[idx], ...box } as Box; localStorage.setItem('cc_boxes', JSON.stringify(s));
      return of(s[idx]);
    }
  }

  delete(id: string): Observable<any> {
    try { return this.http.delete(`${this.api}/${id}`); } catch {
      const s = this.localList().filter(b => b._id !== id); localStorage.setItem('cc_boxes', JSON.stringify(s));
      return of({});
    }
  }

  private localList(): Box[] {
    try { return JSON.parse(localStorage.getItem('cc_boxes') || '[]'); } catch { return []; }
  }
}
