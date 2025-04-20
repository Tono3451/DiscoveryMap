import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UserData {
  username: string;
  email: string;
  lastName: string;
  birthdate: string; // Puedes usar Date si lo prefieres
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  // Guarda o actualiza los datos del usuario usando su UID como ID del documento
  saveUser(uid: string, user: UserData) {
    const userDocRef = doc(this.firestore, 'users', uid);
    return setDoc(userDocRef, user);
  }

  getUsers(): Observable<UserData[]> {
    const userRef = collection(this.firestore, 'users');
    return collectionData(userRef, { idField: 'id' }) as Observable<UserData[]>;
  }
}
