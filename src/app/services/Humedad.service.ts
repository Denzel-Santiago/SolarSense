// src/app/services/ws-humedad.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WsHumedadService implements OnDestroy {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private readonly url = 'ws://35.153.14.236:8001/ws/humidity'; 

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[WebSocket] Conexión establecida');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (error) {
          console.error('[WebSocket] Error al parsear el mensaje:', error);
        }
      };

      this.socket.onerror = (event) => {
        console.error('[WebSocket] Error de conexión:', event);
      };

      this.socket.onclose = (event) => {
        console.warn('[WebSocket] Conexión cerrada', event);
        // Aquí podrías intentar reconectar si quieres
      };
    } catch (error) {
      console.error('[WebSocket] Error al iniciar la conexión:', error);
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
