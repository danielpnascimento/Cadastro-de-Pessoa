import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cadastro } from '../models/cadastro';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  loadCadastros(): Observable<Cadastro[]> {
    return this.http.get('assets/data/cadastro.csv', { responseType: 'text' })
      .pipe(
        map(data => this.parseCadastroCSV(data))
      );
  }

  private parseCadastroCSV(data: string): Cadastro[] {
    const cleanData = data.replace(/\r/g, '');
    const lines = cleanData.split('\n').filter(l => l.trim() !== '');
    if (lines.length <= 1) return [];

    const dataLines = lines.slice(1);

    return dataLines.map(line => {
      const v = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const clean = (val: string) => val ? val.replace(/^"|"$/g, '').trim() : '';

      const cadastro = new Cadastro();
      cadastro.id = v[0] ? Number(clean(v[0])) : null;
      cadastro.bairro = clean(v[1]);
      cadastro.cep = clean(v[2]);
      cadastro.cidades = clean(v[3]);
      cadastro.civil = clean(v[4]);
      cadastro.complemento = clean(v[5]);
      cadastro.cpf = clean(v[6]);
      cadastro.email = clean(v[7]);
      cadastro.escolaridade = clean(v[8]);
      cadastro.estados = clean(v[9]);
      cadastro.foto = clean(v[10]);
      cadastro.nascimento = clean(v[11]);
      cadastro.nome = clean(v[12]);
      cadastro.nomemae = clean(v[13]);
      cadastro.nomepai = clean(v[14]);
      cadastro.numero = v[15] ? Number(clean(v[15])) : 0;
      cadastro.pais = clean(v[16]);
      cadastro.profissao = clean(v[17]);
      cadastro.rg = clean(v[18]);
      cadastro.rua = clean(v[19]);
      cadastro.sexo = clean(v[20]);
      cadastro.telefone = clean(v[21]);
      cadastro.telefoneRec = clean(v[22]);
      cadastro.textarea = clean(v[23]);
      cadastro.uf = clean(v[24]);

      return cadastro;
    });
  }
}
