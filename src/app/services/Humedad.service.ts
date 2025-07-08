// src/app/services/ws-humedad.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WsHumedadService {
  private socket!: WebSocket;

  public connect(): Observable<any> {
    return new Observable(observer => {
      this.socket = new WebSocket('ws://35.153.14.236');

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        observer.next(data);
      };

      this.socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        observer.error(event);
      };

      this.socket.onclose = () => {
        console.log('WebSocket cerrado');
        observer.complete();
      };
    });
  }
}
