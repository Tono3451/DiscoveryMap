import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {Router, RouterLink} from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  imports: [
    RouterLink
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

        const usersRef = collection(this.firestore, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          this.userData = querySnapshot.docs[0].data();
        } else {
          console.warn('No se encontraron datos adicionales para este usuario.');
        }
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

}
