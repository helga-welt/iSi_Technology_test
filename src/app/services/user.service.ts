import { inject, Injectable } from '@angular/core'
import { environmentStaging } from '../../environments/environment.staging';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environmentStaging.apiUrl;

  private http = inject(HttpClient);

  getUsers(): Observable<IUser[]> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer fake-jwt-token')
    .set('Content-Type', 'application/json');

    return this.http.get<IUser[]>(`${this.url}users`, {
      headers
    });
  }

  getUser(userId: number): Observable<IUser> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer fake-jwt-token')
    .set('Content-Type', 'application/json');

    return this.http.get<IUser>(`${this.url}users/${userId}`, {
      headers
    });
  }

  createUser(data: IUser): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer fake-jwt-token')
    .set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.url}users`,
      data,
      {
        headers
      });
  }

  updateUser(userId: number, data: IUser): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer fake-jwt-token')
    .set('Content-Type', 'application/json');

    return this.http.put<any>(`${this.url}users/${userId}`,
      data,
      {
        headers
      });
  }

  deleteUser(userId: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer fake-jwt-token')
    .set('Content-Type', 'application/json');

    return this.http.delete<any>(`${this.url}users/${userId}`,
      {
        headers
      });
  }
}
