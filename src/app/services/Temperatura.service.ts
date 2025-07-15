import { Injectable, OnDestroy } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsTemperaturaService implements OnDestroy {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private readonly url = 'ws://52.5.78.90:8003/ws/temperature'; 

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[WebSocket] Conexión de temperatura establecida');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageSubject.next(data);
        } catch (error) {
          console.error('[WebSocket] Error al parsear mensaje de temperatura:', error);
        }
      };

      this.socket.onerror = (event) => {
        console.error('[WebSocket] Error de conexión de temperatura:', event);
      };

      this.socket.onclose = (event) => {
        console.warn('[WebSocket] Conexión de temperatura cerrada', event);
        // Opcional: podrías intentar reconectar aquí
      };
    } catch (error) {
      console.error('[WebSocket] Error al iniciar conexión de temperatura:', error);
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
