import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface EventData {
  title: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private firestore: Firestore) {}

  addEvent(event: EventData) {
    const eventRef = collection(this.firestore, 'events');
    return addDoc(eventRef, {
      ...event,
      createdAt: Date.now()
    });
  }

  getEvents(): Observable<EventData[]> {
    const eventRef = collection(this.firestore, 'events');
    return collectionData(eventRef, { idField: 'id' }) as Observable<EventData[]>;
  }
}
