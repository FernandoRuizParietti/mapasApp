import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `.mapa-container{
      width: 100%;
      height: 100%;
  }
  .row{
    background-color: white;
    border-radius: 5px;
    position: fixed;
    bottom: 50px;
    left: 50px;
    padding: 10px;
    z-index: 999;
    width:400px;
  }`
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy{

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map
  zoomLevel: number = 13
  center: [number, number]= [-64.46542677250105,-31.243795647574608]


  constructor() { 
  }

  //Siempre Debo destruir los Listeners
  ngOnDestroy(): void {
    this.mapa.off('zoom',()=>{}),
    this.mapa.off('zoomend',()=>{}),
    this.mapa.off('move',()=>{})
  }


  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom: this.zoomLevel
  });

  //Listener para obtener el zoom del mapa
  this.mapa.on('zoom',(evento)=>{
    this.zoomLevel = this.mapa.getZoom()
  })

  //Listener para limitar el zoomIn del mapa
  this.mapa.on('zoomend',(evento)=>{ 
    if(this.mapa.getZoom()>18){
      this.mapa.zoomTo(18)
    }
  })

  //Listener para obtener la Lat y Long del mapa
  this.mapa.on('move', (evento)=>{
    const target = evento.target
    const {lng , lat} = target.getCenter()
    this.center = [lng, lat]
    
  })
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

  zoomOut(){
   this.mapa.zoomOut();
  }

  zoomCambio(valor:string){
    this.mapa.zoomTo(Number(valor)) //esto convierte el string a numero
  }
}
