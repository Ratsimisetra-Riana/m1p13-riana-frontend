import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FilterDef { key: string; type: 'select'|'checkbox'|'range'; options?: string[]; optionsString?: string }
export interface Category { _id?: string; name: string; parent?: string | null; filters?: FilterDef[] }

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = (environment?.apiUrl || 'http://localhost:3000') + '/categories';

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    try { return this.http.get<Category[]>(this.api); } catch { return of(this.localList()); }
  }

  get(id: string): Observable<Category | null> {
    try { return this.http.get<Category>(`${this.api}/${id}`); } catch { return of(this.localList().find(c => c._id === id) || null); }
  }

  create(cat: Category): Observable<Category> {
    try { return this.http.post<Category>(this.api, cat); } catch {
      const created = { ...cat, _id: 'cat_' + Date.now() } as Category;
      const s = this.localList(); s.push(created); localStorage.setItem('cc_categories', JSON.stringify(s));
      return of(created);
    }
  }

  update(id: string, cat: Category): Observable<Category> {
    try { return this.http.put<Category>(`${this.api}/${id}`, cat); } catch {
      const s = this.localList(); const idx = s.findIndex(c => c._id === id); if (idx !== -1) s[idx] = { ...s[idx], ...cat } as Category; localStorage.setItem('cc_categories', JSON.stringify(s));
      return of(s[idx]);
    }
  }

  delete(id: string): Observable<any> {
    try { return this.http.delete(`${this.api}/${id}`); } catch {
      const s = this.localList().filter(c => c._id !== id); localStorage.setItem('cc_categories', JSON.stringify(s));
      return of({});
    }
  }

  private localList(): Category[] {
    try { return JSON.parse(localStorage.getItem('cc_categories') || '[]'); } catch { return []; }
  }
}
