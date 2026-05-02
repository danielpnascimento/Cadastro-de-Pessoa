import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cadastro } from '../models/cadastro';
import { map, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  http = inject(HttpClient);

  API = "http://localhost:8080/api/cadastro";

  changed: Subject<void> = new Subject<void>();

  constructor() { }

  listAll(): Observable<Cadastro[]> {

    return this.http.get<Cadastro[]>(this.API + "/listAll").pipe(
      map(cadastros => cadastros.map(cadastro => ({
        ...cadastro,
        foto: cadastro.foto ? `data:image/jpeg;base64,${cadastro.foto}` : null
      })))
    );
  }


  findById(id: number): Observable<Cadastro> {
    return this.http.get<Cadastro>(this.API + "/findById/" + id).pipe(
      map(cadastro => ({
        ...cadastro,
        foto: cadastro.foto ? `data:image/jpeg;base64,${cadastro.foto}` : null
      }))
    );
  }

  save(cadastro: Cadastro): Observable<string> {
    return this.http.post<string>(this.API + "/save", cadastro,
      { responseType: 'text' as 'json' }).pipe(
        tap(() => this.changed.next())
      );
  }

  update(cadastro: Cadastro, id: number): Observable<string> {
    return this.http.put<string>(this.API + "/update/" + id, cadastro,
      { responseType: 'text' as 'json' }).pipe(
        tap(() => this.changed.next())
      );
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(this.API + "/delete/" + id,
      { responseType: 'text' as 'json' }).pipe(
        tap(() => this.changed.next())
      );
  }

  findByNome(nome: string): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(this.API + "/findByNome?nome=" + nome).pipe(
      map(cadastros => cadastros.map(cadastro => ({
        ...cadastro,
        foto: cadastro.foto ? 'data:image/jpeg;base64,' + cadastro.foto : null
      })))
    );
  }
}
