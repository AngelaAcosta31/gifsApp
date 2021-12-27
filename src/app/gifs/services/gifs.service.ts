import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'LC0BSMEJE41hpzXmjoLDn1wb5LmCNv9U';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'

  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){

    return [...this._historial];
  }

  constructor(private http: HttpClient){

    /**Guardar el historial sin importar que se recargue la pagina */
    this._historial = JSON.parse(localStorage.getItem('historial')!)||[];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!)||[];
  }

  buscarGifs(query : string = ''){

    query = query.trim().toLowerCase();
    /**Agrega la busqueda al historial si no esta repetida, si ya existe no la agrega */
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      /**Para limitar la cantidad de busquedas que apareza en la lista */
      this._historial = this._historial.splice(0,15);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
                        .set('api_key',this.apiKey)
                        .set('limit','30')
                        .set('q',query);


    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{ params })
    .subscribe((respuesta) =>{
      console.log(respuesta.data);
      this.resultados= respuesta.data;

      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    })
  }
}
