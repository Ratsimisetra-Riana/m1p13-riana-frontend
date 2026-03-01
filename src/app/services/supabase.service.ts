import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { createClient } from '@supabase/supabase-js'

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabaseUrl = environment.supabaseUrl;
  private supabaseAnonKey = environment.supabaseAnonKey;
  supabase  = createClient(this.supabaseUrl, this.supabaseAnonKey);
  //private bucket = 'products';

  constructor(private http: HttpClient) {}

  /**
   * Upload a file to Supabase Storage
   */
  /*uploadFile(file: File, folder: string = ''): Observable<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = folder ? `${folder}/${timestamp}-${random}.${extension}` : `${timestamp}-${random}.${extension}`;

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ Key: string }>(
      `${this.supabaseUrl}/storage/v1/object/public/images/${filename}`,
      formData,
      {
        headers: {
        'apikey': this.supabaseAnonKey,
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    ).pipe(
      map((response) => {
        return `${this.supabaseUrl}/storage/v1/object/public/images/${response.Key}`;
      }),
      catchError((error) => {
        console.error('Supabase upload error:', error);
        throw error;
      })
    );
  }*/

 



// Upload file using standard upload - returns Observable
uploadFile(file: File): Observable<string> {
  const fileName = `${Date.now()}_${file.name}`;
  
  return from(
    this.supabase.storage
      .from('images') // Use your bucket name
      .upload(fileName, file)
  ).pipe(
    map(({ data, error }) => {
      if (error) {
        throw error;
      }      
      // Get the public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('images')
        .getPublicUrl(data.path);
      
      return publicUrl;
    }),
    catchError(error => {
      console.error('Supabase upload error:', error);
      throw error;
    })
  );
}
  /**
   * Upload multiple files
   */
  uploadFiles(files: File[]): Observable<string[]> {
    if (!files || files.length === 0) {
      return of([]);
    }

    const uploads = files.map(file => this.uploadFile(file));
    return forkJoin(uploads);
  }

  /**
   * Delete a file from Supabase Storage
   */
  deleteFile(fileUrl: string): Observable<any> {
    const path = fileUrl.replace(`${this.supabaseUrl}/storage/v1/object/public/images/`, '');
    
    return this.http.delete(
      `${this.supabaseUrl}/storage/v1/object/public/images/${path}`,
      {
        headers: {
          'apikey': this.supabaseAnonKey,
          'Authorization': `Bearer ${this.supabaseAnonKey}`
        }
      }
    );
  }
}
