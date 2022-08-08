import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

interface MarcadorColor{
  color: string,
  marker?: mapboxgl.Marker
  centro?: [number, number]
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `.mapa-container{
      width: 100%;
      height: 100%;
  }
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
  }
    li{
      cursor: pointer;
    }`
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map
  zoomLevel: number = 15
  center: [number, number]= [-64.46542677250105,-31.243795647574608]

  //Array de Marcadores

  marcadores: MarcadorColor[] =[]

  constructor() { }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom: this.zoomLevel
  });

  /* const marker = new mapboxgl.Marker()
    .setLngLat(this.center)
    .addTo(this.mapa) */

    this.leerLocalStorage()
  }

  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo({
      center: marker.getLngLat()
    })
  }

  agregarMArcador(){
    //esto genera un color aleatorio para cada marcador
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    })
    .setLngLat(this.center)
    .addTo(this.mapa)

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    })

    this.guardarMarcadoresLocalStorage()
    
    nuevoMarcador.on('dragend', ()=>{
      this.guardarMarcadoresLocalStorage()
    })
  }

  guardarMarcadoresLocalStorage(){

    const langLatArr: MarcadorColor[] = [] 
    this.marcadores.forEach(m=>{
      const color = m.color
      const {lng , lat} = m.marker!.getLngLat()

      langLatArr.push({
        color: color,
        centro: [lng, lat]
      });
    })
    localStorage.setItem('marcadores', JSON.stringify(langLatArr))
  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return
    }
    const lngLatArr : MarcadorColor[] = JSON.parse( localStorage.getItem('marcadores')!)

    lngLatArr.forEach(m =>{
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      }).setLngLat(m.centro!)
        .addTo(this.mapa)

        this.marcadores.push({
          color: m.color,
          marker: newMarker
        })

        newMarker.on('dragend', ()=>{
          this.guardarMarcadoresLocalStorage()
        })
    })
  }

  borrarMarcador(index: number){
    this.marcadores[index].marker?.remove()
    this.marcadores.splice(index, 1)
    this.guardarMarcadoresLocalStorage()
  }

  }
