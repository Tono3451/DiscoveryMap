import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  private map: L.Map | undefined;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Inicializar el mapa
    this.map = L.map('map', {
      zoomControl: false // Desactiva el control de zoom predeterminado
    }).setView([40.4168, -3.7038], 6); // Coordenadas de Madrid, España

    // Añadir una capa de tiles (por ejemplo, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Mover el control de zoom a la esquina inferior derecha
    L.control.zoom({
      position: 'bottomright' // Puedes usar 'topleft', 'topright', 'bottomleft', o 'bottomright'
    }).addTo(this.map);
  }
}
