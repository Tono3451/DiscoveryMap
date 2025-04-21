import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {Router, RouterLink} from '@angular/router';
import {Firestore, doc, getDoc, collection, getDocs, query, where, deleteDoc} from '@angular/fire/firestore';
import { onAuthStateChanged } from '@angular/fire/auth';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: any;
  userData: any = null;
  activeTab: 'posted' | 'saved' = 'posted';
  userMemories: any[] = [];
  savedMemories: any[] = [];

  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {}


  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user;

        const userDocRef = doc(this.firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          this.userData = docSnap.data();
        }

        // Obtener recuerdos creados por el usuario
        const eventsRef = collection(this.firestore, 'events');
        const q = query(eventsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        this.userMemories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
    });

  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('Sesión cerrada');
        this.router.navigate(['/']); // Redirige al inicio
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

  async deleteMemory(memoryId: string) {
    try {
      await deleteDoc(doc(this.firestore, 'events', memoryId));
      this.userMemories = this.userMemories.filter(memory => memory.id !== memoryId);
      console.log('Evento eliminado');
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  }


}
