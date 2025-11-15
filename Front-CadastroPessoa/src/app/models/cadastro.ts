
export class Cadastro {

  id: number | null = null; // Alterado para number | null
  foto: string | null; // Alterado para string | null para suportar campo opcional, String para Base64
  nome!: string;
  cpf!: string;
  rg!: string;
  uf!: string;
  pais!: string;
  nascimento!: string;
  sexo!: string;
  civil!: string;
  escolaridade!: string;
  profissao!: string;
  telefone!: string;
  telefoneRec!: string;
  nomepai!: string;
  nomemae!: string;
  email!: string;

  //Endereço
  cep!: string;
  rua!: string;
  bairro!: string;
  numero: number = 0 ;
  cidades!: string;
  estados!: string;
  complemento!: string;
  textarea!: string;

  constructor(
    id: number | null = null,
    foto: string | null = null, // String para Base64 e Alterado para string | null
    nome: string = '',
    cpf: string = '',
    rg: string = '',
    uf: string = '',
    pais: string = '',
    nascimento: string = '',
    sexo: string = '',
    civil: string = '',
    escolaridade: string = '',
    profissao: string = '',
    telefone: string = '',
    telefoneRec: string = '',
    nomepai: string = '',
    nomemae: string = '',
    email: string = '',

    //Endereço
    cep: string = '',
    rua: string = '',
    bairro: string = '',
    numero: number = 0,
    cidades: string = '',
    estados: string = '',
    complemento: string = '',
    textarea: string = ''
  ) {
    this.id = id;
    this.foto = foto;
    this.nome = nome;
    this.cpf = cpf;
    this.rg = rg;
    this.uf = uf;
    this.pais = pais;
    this.nascimento = nascimento;
    this.sexo = sexo;
    this.civil = civil;
    this.escolaridade = escolaridade;
    this.profissao = profissao;
    this.telefone = telefone;
    this.telefoneRec = telefoneRec;
    this.nomepai = nomepai;
    this.nomemae = nomemae;
    this.email = email;

    //Endereço
    this.cep = cep;
    this.rua = rua;
    this.bairro = bairro;
    this.numero = numero;
    this.cidades = cidades;
    this.estados = estados;
    this.complemento = complemento;
    this.textarea = textarea;
  }
}
