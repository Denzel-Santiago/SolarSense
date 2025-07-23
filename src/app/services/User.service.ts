import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Interface/Membresia'; 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://apigeneral.serveirc.com/api/memberships';
  private authToken = '$2a$10$Wgs8JL0bkgcZ2MZ2uNy.MY10bcBr6Dw6X7n55f2Q/QQj2Ws0';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

   upgradeToPremium(userId: number): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.put(url, {});
  }

  downgradeToFree(userId: number): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}/downgrade`;
    return this.http.post(url, {});
  }

createUser(usuario: any): Observable<any> {
  const url = 'https://apigeneral.serveirc.com/api/memberships/register';
  return this.http.post(url, usuario, {
    headers: this.getAuthHeaders(),
  });
}


updateUser(userId: number, usuario: any): Observable<any> {
  const url = `${this.baseUrl}/user/${userId}/update`; 
  return this.http.put(url, usuario, {
    headers: this.getAuthHeaders(),
  });
}

deleteUser(userId: number): Observable<any> {
  const url = `${this.baseUrl}/user/${userId}/delete`; 
  return this.http.delete(url, {
    headers: this.getAuthHeaders(),
  });
}

  
}
