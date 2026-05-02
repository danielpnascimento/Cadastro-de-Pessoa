import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cadastro } from '../models/cadastro';
import { BehaviorSubject, map, Observable, of, Subject, throwError } from 'rxjs';
import { CsvService } from './csv.service';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  API = "http://localhost:8080/api/cadastro";

  changed: Subject<void> = new Subject<void>();

  //Lista em memória mockada
  private cadastros$ = new BehaviorSubject<Cadastro[]>([]);

  constructor(private http: HttpClient,
    private csvService: CsvService) {

    this.csvService.loadCadastros().subscribe(dados => {
      this.cadastros$.next(dados);
    });


  }

  listAll(): Observable<Cadastro[]> {
    return this.cadastros$.asObservable().pipe(
      map(cadastros => cadastros.map(cadastro => {
        let fotoExibicao = cadastro.foto;
        if (fotoExibicao && !fotoExibicao.startsWith('data:image')) {
          fotoExibicao = `data:image/jpeg;base64,${fotoExibicao}`;
        }

        return { ...cadastro, foto: fotoExibicao };
      }))
    );
  }

  findById(id: number): Observable<Cadastro> {
    return this.listAll().pipe(
      map(cadastros => cadastros.find(c => c.id === id)!)
    );
  }

  save(cadastro: Cadastro): Observable<string> {
    const atual = this.cadastros$.value;

    const cpfExiste = atual.some(c => c.cpf === cadastro.cpf);
    if (cpfExiste) {
      return throwError(() => new Error("Este CPF já está cadastrado no sistema!"));
    }

    const rgExiste = atual.some(c => c.rg === cadastro.rg);
    if (rgExiste) {
      return throwError(() => new Error("Este RG já está cadastrado no sistema!"));
    }

    cadastro.id = atual.length + 1;
    this.cadastros$.next([...atual, cadastro]);
    return of("Cadastro realizado com sucesso!");
  }

  update(cadastro: Cadastro, id: number): Observable<string> {
    const list = this.cadastros$.value;
    const cpfExiste = list.some(c => c.cpf === cadastro.cpf && c.id !== id);
    if (cpfExiste) {
      return throwError(() => new Error("Este CPF já pertence a outro cadastro!"));
    }
    const rgExiste = list.some(c => c.rg === cadastro.rg && c.id !== id);
    if (rgExiste) {
      return throwError(() => new Error("Este RG já pertence a outro cadastro!"));
    }

    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index] = { ...cadastro, id };
      this.cadastros$.next([...list]);
      return of("Atualizado com sucesso!");
    }
    return of("Erro: Registro não encontrado!");
  }
  delete(id: number): Observable<string> {
    const novaLista = this.cadastros$.value.filter(c => c.id !== id);
    this.cadastros$.next(novaLista);
    return of("Deletado com sucesso!");
  }

  findByNome(nome: string): Observable<Cadastro[]> {
    return this.listAll().pipe(
      map(cadastros => cadastros.filter(c =>
        c.nome.toLowerCase().includes(nome.toLowerCase())
      ))
    );
  }
}


