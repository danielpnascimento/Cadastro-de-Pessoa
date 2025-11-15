import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cadastro } from '../models/cadastro';
import { map, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  // 4° passo Criar a injeção assincrona e seu import '@angular/core'
  http = inject(HttpClient);

  // Criando um variável para abreviar a rota de saida do back
  API = "http://localhost:8080/api/cadastro";

  // Notifier para que componentes interessados possam reagir a alterações (save/update/delete)
  changed: Subject<void> = new Subject<void>();

  constructor() { }

  // *******ENDPOINTs "LISTAR e DELETAR"*******
  // Metodo que ira usar os dados do bd do back
  // E que faz a tabela do front ser carregada pelo dados do banco
  listAll(): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(this.API + "/listAll").pipe(
      map(cadastros => cadastros.map(cadastro => ({
        ...cadastro,
        foto: cadastro.foto ? `data:image/jpeg;base64,${cadastro.foto}` : null
      })))
    );
  }

  // SELEÇÃO POR ID
  findById(id: number): Observable<Cadastro> {
    return this.http.get<Cadastro>(this.API + "/findById/" + id).pipe(
      map(cadastro => ({
        ...cadastro,
        foto: cadastro.foto ? `data:image/jpeg;base64,${cadastro.foto}` : null
      }))
    );
  }

  // SALVAR
  save(cadastro: Cadastro): Observable<string> {
    return this.http.post<string>(this.API + "/save", cadastro,
      { responseType: 'text' as 'json' }).pipe(
        tap(() => this.changed.next())
      );
  }

  // UPDATE
  update(cadastro: Cadastro, id: number): Observable<string> {
    return this.http.put<string>(this.API + "/update/" + id, cadastro,
      { responseType: 'text' as 'json' }).pipe(
        tap(() => this.changed.next())
      );
  }

  // DELETAR
  delete(id: number): Observable<string> {
    return this.http.delete<string>(this.API + "/delete/" + id,
      //Quando usar retorno com string
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
