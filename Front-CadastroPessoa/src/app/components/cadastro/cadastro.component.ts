import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cadastro } from '../../models/cadastro';
import { CadastroService } from '../../services/cadastro.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit, OnChanges {

  @Input() cadastro: Cadastro = new Cadastro(); // obrigatório para receber [cadastro] do listagem
  @Output() retorno = new EventEmitter<Cadastro>(); // para emitir eventos de volta ao salvar/atualizar

  // *****Para o back part1*****
  // Injeções via inject() (alternativa ao constructor injection)
  // Trazer os dados de campo já cadastrado recupera rota (usado para buscar por id se houver)
  router = inject(ActivatedRoute);
  //Injetado para a busca no banco serviço de cadastro (usa HTTP internamente)
  cadastroService = inject(CadastroService);
  //Criando uma lista para chamar os dados do bd
  lista: Cadastro[] = [];
  // **********

  form!: FormGroup;
  activeTab: 'dados' | 'endereco' = 'dados';
  //CEP
  loadingCEP = false;  // indica que a busca está em andamento
  erroCEP: string | null = null; // mensagem de erro do CEP
  fotoPreview: string | null = null; // Para prévia da imagem

  estadosEmissorRG = [
    { text: 'SSP/AC', value: 'AC' },
    { text: 'SSP/AL', value: 'AL' },
    { text: 'SSP/AP', value: 'AP' },
    { text: 'SSP/AM', value: 'AM' },
    { text: 'SSP/BA', value: 'BA' },
    { text: 'SSP/CE', value: 'CE' },
    { text: 'SSP/DF', value: 'DF' },
    { text: 'SSP/ES', value: 'ES' },
    { text: 'SSP/GO', value: 'GO' },
    { text: 'SSP/MA', value: 'MA' },
    { text: 'SSP/MT', value: 'MT' },
    { text: 'SSP/MS', value: 'MS' },
    { text: 'SSP/MG', value: 'MG' },
    { text: 'SSP/PA', value: 'PA' },
    { text: 'SSP/PB', value: 'PB' },
    { text: 'SSP/PR', value: 'PR' },
    { text: 'SSP/PE', value: 'PE' },
    { text: 'SSP/PI', value: 'PI' },
    { text: 'SSP/RJ', value: 'RJ' },
    { text: 'SSP/RN', value: 'RN' },
    { text: 'SSP/RS', value: 'RS' },
    { text: 'SSP/RO', value: 'RO' },
    { text: 'SSP/RR', value: 'RR' },
    { text: 'SSP/SC', value: 'SC' },
    { text: 'SSP/SP', value: 'SP' },
    { text: 'SSP/SE', value: 'SE' },
    { text: 'SSP/TO', value: 'TO' }
  ];

  paises = [
    { text: 'Afeganistão', value: 'AF' },
    { text: 'África do Sul', value: 'ZA' },
    { text: 'Albânia', value: 'AL' },
    { text: 'Alemanha', value: 'DE' },
    { text: 'Andorra', value: 'AD' },
    { text: 'Angola', value: 'AO' },
    { text: 'Antígua e Barbuda', value: 'AG' },
    { text: 'Arábia Saudita', value: 'SA' },
    { text: 'Argélia', value: 'DZ' },
    { text: 'Argentina', value: 'AR' },
    { text: 'Armênia', value: 'AM' },
    { text: 'Austrália', value: 'AU' },
    { text: 'Áustria', value: 'AT' },
    { text: 'Azerbaijão', value: 'AZ' },
    { text: 'Bahamas', value: 'BS' },
    { text: 'Bangladesh', value: 'BD' },
    { text: 'Barbados', value: 'BB' },
    { text: 'Barein', value: 'BH' },
    { text: 'Bélgica', value: 'BE' },
    { text: 'Belize', value: 'BZ' },
    { text: 'Benin', value: 'BJ' },
    { text: 'Bolívia', value: 'BO' },
    { text: 'Bósnia e Herzegovina', value: 'BA' },
    { text: 'Botsuana', value: 'BW' },
    { text: 'Brasil', value: 'BR' },
    { text: 'Brunei', value: 'BN' },
    { text: 'Bulgária', value: 'BG' },
    { text: 'Burquina Fasso', value: 'BF' },
    { text: 'Burundi', value: 'BI' },
    { text: 'Butão', value: 'BT' },
    { text: 'Cabo Verde', value: 'CV' },
    { text: 'Camarões', value: 'CM' },
    { text: 'Camboja', value: 'KH' },
    { text: 'Canadá', value: 'CA' },
    { text: 'Catar', value: 'QA' },
    { text: 'Cazaquistão', value: 'KZ' },
    { text: 'Chade', value: 'TD' },
    { text: 'Chile', value: 'CL' },
    { text: 'China', value: 'CN' },
    { text: 'Chipre', value: 'CY' },
    { text: 'Colômbia', value: 'CO' },
    { text: 'Comores', value: 'KM' },
    { text: 'Congo', value: 'CG' },
    { text: 'Coreia do Norte', value: 'KP' },
    { text: 'Coreia do Sul', value: 'KR' },
    { text: 'Costa do Marfim', value: 'CI' },
    { text: 'Costa Rica', value: 'CR' },
    { text: 'Croácia', value: 'HR' },
    { text: 'Cuba', value: 'CU' },
    { text: 'Dinamarca', value: 'DK' },
    { text: 'Djibuti', value: 'DJ' },
    { text: 'Dominica', value: 'DM' },
    { text: 'Egito', value: 'EG' },
    { text: 'El Salvador', value: 'SV' },
    { text: 'Emirados Árabes Unidos', value: 'AE' },
    { text: 'Equador', value: 'EC' },
    { text: 'Eritreia', value: 'ER' },
    { text: 'Eslováquia', value: 'SK' },
    { text: 'Eslovênia', value: 'SI' },
    { text: 'Espanha', value: 'ES' },
    { text: 'Estados Unidos', value: 'US' },
    { text: 'Estônia', value: 'EE' },
    { text: 'Etiópia', value: 'ET' },
    { text: 'Fiji', value: 'FJ' },
    { text: 'Filipinas', value: 'PH' },
    { text: 'Finlândia', value: 'FI' },
    { text: 'França', value: 'FR' },
    { text: 'Gabão', value: 'GA' },
    { text: 'Gâmbia', value: 'GM' },
    { text: 'Gana', value: 'GH' },
    { text: 'Geórgia', value: 'GE' },
    { text: 'Granada', value: 'GD' },
    { text: 'Grécia', value: 'GR' },
    { text: 'Guatemala', value: 'GT' },
    { text: 'Guiana', value: 'GY' },
    { text: 'Guiné', value: 'GN' },
    { text: 'Guiné-Bissau', value: 'GW' },
    { text: 'Guiné Equatorial', value: 'GQ' },
    { text: 'Haiti', value: 'HT' },
    { text: 'Holanda', value: 'NL' },
    { text: 'Honduras', value: 'HN' },
    { text: 'Hungria', value: 'HU' },
    { text: 'Iémen', value: 'YE' },
    { text: 'Ilhas Marshall', value: 'MH' },
    { text: 'Ilhas Salomão', value: 'SB' },
    { text: 'Índia', value: 'IN' },
    { text: 'Indonésia', value: 'ID' },
    { text: 'Irã', value: 'IR' },
    { text: 'Iraque', value: 'IQ' },
    { text: 'Irlanda', value: 'IE' },
    { text: 'Islândia', value: 'IS' },
    { text: 'Israel', value: 'IL' },
    { text: 'Itália', value: 'IT' },
    { text: 'Jamaica', value: 'JM' },
    { text: 'Japão', value: 'JP' },
    { text: 'Jordânia', value: 'JO' },
    { text: 'Kiribati', value: 'KI' },
    { text: 'Kosovo', value: 'XK' },
    { text: 'Kuwait', value: 'KW' },
    { text: 'Laos', value: 'LA' },
    { text: 'Lesoto', value: 'LS' },
    { text: 'Letônia', value: 'LV' },
    { text: 'Líbano', value: 'LB' },
    { text: 'Libéria', value: 'LR' },
    { text: 'Líbia', value: 'LY' },
    { text: 'Liechtenstein', value: 'LI' },
    { text: 'Lituânia', value: 'LT' },
    { text: 'Luxemburgo', value: 'LU' },
    { text: 'Macedônia do Norte', value: 'MK' },
    { text: 'Madagascar', value: 'MG' },
    { text: 'Malásia', value: 'MY' },
    { text: 'Malaui', value: 'MW' },
    { text: 'Maldivas', value: 'MV' },
    { text: 'Mali', value: 'ML' },
    { text: 'Malta', value: 'MT' },
    { text: 'Marrocos', value: 'MA' },
    { text: 'Maurícia', value: 'MU' },
    { text: 'Mauritânia', value: 'MR' },
    { text: 'México', value: 'MX' },
    { text: 'Moçambique', value: 'MZ' },
    { text: 'Moldávia', value: 'MD' },
    { text: 'Mônaco', value: 'MC' },
    { text: 'Mongólia', value: 'MN' },
    { text: 'Montenegro', value: 'ME' },
    { text: 'Namíbia', value: 'NA' },
    { text: 'Nauru', value: 'NR' },
    { text: 'Nepal', value: 'NP' },
    { text: 'Nicarágua', value: 'NI' },
    { text: 'Nigéria', value: 'NG' },
    { text: 'Noruega', value: 'NO' },
    { text: 'Nova Zelândia', value: 'NZ' },
    { text: 'Omã', value: 'OM' },
    { text: 'Países Baixos', value: 'NL' },
    { text: 'Palau', value: 'PW' },
    { text: 'Panamá', value: 'PA' },
    { text: 'Papua-Nova Guiné', value: 'PG' },
    { text: 'Paquistão', value: 'PK' },
    { text: 'Paraguai', value: 'PY' },
    { text: 'Peru', value: 'PE' },
    { text: 'Polônia', value: 'PL' },
    { text: 'Portugal', value: 'PT' },
    { text: 'Quênia', value: 'KE' },
    { text: 'Quirguistão', value: 'KG' },
    { text: 'Reino Unido', value: 'GB' },
    { text: 'República Centro-Africana', value: 'CF' },
    { text: 'República Checa', value: 'CZ' },
    { text: 'República Democrática do Congo', value: 'CD' },
    { text: 'República Dominicana', value: 'DO' },
    { text: 'Romênia', value: 'RO' },
    { text: 'Ruanda', value: 'RW' },
    { text: 'Rússia', value: 'RU' },
    { text: 'São Cristóvão e Neves', value: 'KN' },
    { text: 'São Marino', value: 'SM' },
    { text: 'São Tomé e Príncipe', value: 'ST' },
    { text: 'São Vicente e Granadinas', value: 'VC' },
    { text: 'Senegal', value: 'SN' },
    { text: 'Serra Leoa', value: 'SL' },
    { text: 'Sérvia', value: 'RS' },
    { text: 'Síria', value: 'SY' },
    { text: 'Somália', value: 'SO' },
    { text: 'Sri Lanka', value: 'LK' },
    { text: 'Suazilândia', value: 'SZ' },
    { text: 'Sudão', value: 'SD' },
    { text: 'Sudão do Sul', value: 'SS' },
    { text: 'Suécia', value: 'SE' },
    { text: 'Suíça', value: 'CH' },
    { text: 'Suriname', value: 'SR' },
    { text: 'Tailândia', value: 'TH' },
    { text: 'Taiwan', value: 'TW' },
    { text: 'Tajiquistão', value: 'TJ' },
    { text: 'Tanzânia', value: 'TZ' },
    { text: 'Timor-Leste', value: 'TL' },
    { text: 'Togo', value: 'TG' },
    { text: 'Tonga', value: 'TO' },
    { text: 'Trinidad e Tobago', value: 'TT' },
    { text: 'Tunísia', value: 'TN' },
    { text: 'Turcomenistão', value: 'TM' },
    { text: 'Turquia', value: 'TR' },
    { text: 'Tuvalu', value: 'TV' },
    { text: 'Ucrânia', value: 'UA' },
    { text: 'Uganda', value: 'UG' },
    { text: 'Uruguai', value: 'UY' },
    { text: 'Uzbequistão', value: 'UZ' },
    { text: 'Vanuatu', value: 'VU' },
    { text: 'Vaticano', value: 'VA' },
    { text: 'Venezuela', value: 'VE' },
    { text: 'Vietnã', value: 'VN' },
    { text: 'Zâmbia', value: 'ZM' },
    { text: 'Zimbábue', value: 'ZW' }
  ];

  sexo = [
    { text: 'Masculino', value: 'M' },
    { text: 'Feminino', value: 'F' }
  ];

  civil = [
    { text: 'Solteiro(a)', value: 'SOLTEIRO(A)' },
    { text: 'Casado(a)', value: 'CASADO(A)' },
    { text: 'Divorciado(a)', value: 'DIVORCIADO(A)' },
    { text: 'Viúvo(a)', value: 'VIUVO(A)' },
    { text: 'Separado(a)', value: 'SEPARADO(A)' },
    { text: 'União Estável', value: 'UNIAO_ESTAVEL' }
  ];

  //  Para projeto spring com banco não deixar espaço em branco como FUNDAMENTAL INCOMPLETO
  escolaridade = [
    { text: 'EF Incompleto', value: 'FUNDAMENTAL_INCOMPLETO' },
    { text: 'EF Completo', value: 'FUNDAMENTAL_COMPLETO' },
    { text: 'EM Incompleto', value: 'MEDIO_INCOMPLETO' },
    { text: 'EM Completo', value: 'MEDIO_COMPLETO' },
    { text: 'ES Incompleto', value: 'SUPERIOR_INCOMPLETO' },
    { text: 'ES Completo', value: 'SUPERIOR_COMPLETO' },
    { text: 'Pós-Graduação', value: 'POS_GRADUACAO' },
    { text: 'Mestrado', value: 'MESTRADO' },
    { text: 'Doutorado', value: 'DOUTORADO' }
  ];

  // array de profissão onde o text é o que aparece na tela e o value é o que vai para o banco
  // para se tratada pelo array de profissões na listagem e exibir apenas o text e não o value
  // pq pegar o text por aqui não funciona na tabela da listagem
  profissao = [
    { text: 'Desenvolvedor(a)', value: 'DESENVOLVEDOR(A)' },
    { text: 'A. de Sistemas', value: 'ANALISTA_SISTEMAS' },
    { text: 'Administrador(a)', value: 'ADMINISTRADOR(A)' },
    { text: 'Engenheiro(a)', value: 'ENGENHEIRO(A)' },
    { text: 'Eletricista', value: 'ELETRICISTA' },
    { text: 'Mestre de Obra', value: 'MESTRE_DE_OBRA' },
    { text: 'Professor(a)', value: 'PROFESSOR(A)' },
    { text: 'Médico(a)', value: 'MEDICO(A)' },
    { text: 'Advogado(a)', value: 'ADVOGADO(A)' },
    { text: 'Técnico(a)', value: 'TECNICO(A)' },
    { text: 'Motorista', value: 'MOTORISTA' },
    { text: 'Vendedor(a)', value: 'VENDEDOR(A)' },
    { text: 'Autônomo', value: 'AUTONOMO' },
    { text: 'Estudante', value: 'ESTUDANTE' },
    { text: 'Aposentado(a)', value: 'APOSENTADO(A)' },
    { text: 'Outros', value: 'OUTROS' }
  ];

  //Endereço
  cidades = [
    { text: 'Acre', value: 'AC' },
    { text: 'Alagoas', value: 'AL' },
    { text: 'Amapá', value: 'AP' },
    { text: 'Amazonas', value: 'AM' },
    { text: 'Bahia', value: 'BA' },
    { text: 'Ceará', value: 'CE' },
    { text: 'Distrito Federal', value: 'DF' },
    { text: 'Espírito Santo', value: 'ES' },
    { text: 'Goiás', value: 'GO' },
    { text: 'Maranhão', value: 'MA' },
    { text: 'Mato Grosso', value: 'MT' },
    { text: 'Mato Grosso do Sul', value: 'MS' },
    { text: 'Minas Gerais', value: 'MG' },
    { text: 'Pará', value: 'PA' },
    { text: 'Paraíba', value: 'PB' },
    { text: 'Paraná', value: 'PR' },
    { text: 'Pernambuco', value: 'PE' },
    { text: 'Piauí', value: 'PI' },
    { text: 'Rio de Janeiro', value: 'RJ' },
    { text: 'Rio Grande do Norte', value: 'RN' },
    { text: 'Rio Grande do Sul', value: 'RS' },
    { text: 'Rondônia', value: 'RO' },
    { text: 'Roraima', value: 'RR' },
    { text: 'Santa Catarina', value: 'SC' },
    { text: 'São Paulo', value: 'SP' },
    { text: 'Sergipe', value: 'SE' },
    { text: 'Tocantins', value: 'TO' }
  ];

  estados = [
    { text: 'AC', value: 'AC' },
    { text: 'AL', value: 'AL' },
    { text: 'AP', value: 'AP' },
    { text: 'AM', value: 'AM' },
    { text: 'BA', value: 'BA' },
    { text: 'CE', value: 'CE' },
    { text: 'DF', value: 'DF' },
    { text: 'ES', value: 'ES' },
    { text: 'GO', value: 'GO' },
    { text: 'MA', value: 'MA' },
    { text: 'MT', value: 'MT' },
    { text: 'MS', value: 'MS' },
    { text: 'MG', value: 'MG' },
    { text: 'PA', value: 'PA' },
    { text: 'PB', value: 'PB' },
    { text: 'PR', value: 'PR' },
    { text: 'PE', value: 'PE' },
    { text: 'PI', value: 'PI' },
    { text: 'RJ', value: 'RJ' },
    { text: 'RN', value: 'RN' },
    { text: 'RS', value: 'RS' },
    { text: 'RO', value: 'RO' },
    { text: 'RR', value: 'RR' },
    { text: 'SC', value: 'SC' },
    { text: 'SP', value: 'SP' },
    { text: 'SE', value: 'SE' },
    { text: 'TO', value: 'TO' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {

    // *****Para o back part2*****
    const id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
    this.listAll();
  }

  //  ngOnInit monta o FormGroup com validações
  //  configura form valueChanges para mascaras/validações dinâmicas (cep, cpf, rg, telefone, etc)
  //  se o @Input cadastro já veio com id, faz patchValue e prepara preview da foto
  ngOnInit(): void {
    this.form = this.fb.group({
      // Dados
      foto: [null],
      nome: ['', [
        Validators.required,
        // permite letras (com acentos) e espaços — NÃO permite números nem símbolos
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
      ]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      rg: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/)]],
      uf: ['', Validators.required],
      pais: ['', Validators.required],
      nascimento: ['', [Validators.required,
      Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/)
      ]],
      sexo: ['', Validators.required],
      civil: ['', Validators.required],
      escolaridade: ['', Validators.required],
      profissao: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      telefoneRec: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      nomepai: ['', Validators.required],
      nomemae: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      // Aba Endereço
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      bairro: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Garante apenas números
      cidades: ['', Validators.required],
      estados: ['', Validators.required],
      complemento: ['', Validators.required],
      textarea: ['',],
    });

    // Se já estiver em modo  de edição (recebendo um cadastro com id), desabilita CPF e RG
    const initiallyEdit = !!(this.cadastro && this.cadastro.id && Number(this.cadastro.id) > 0);
    this.setCpfRgDisabled(initiallyEdit);

    // Formatações automáticas (CEP, CPF, RG, telefone, etc.)
    this.form.get('cep')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 8); // apenas números, máximo 8 para cep
      let formatted = digits;

      if (digits.length > 5) {
        formatted = digits.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      }

      if (value !== formatted) {
        this.form.get('cep')?.setValue(formatted, { emitEvent: false }); // evita loop infinito
      }
    });

    // Formata CPF automaticamente enquanto digita
    this.form.get('cpf')?.valueChanges.subscribe((value: string | null) => {
      const control = this.form.get('cpf');
      if (!control) return;
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 11);

      // --- formatação visual ---
      let formatted = digits;
      if (digits.length > 9) {
        formatted = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      } else if (digits.length > 6) {
        formatted = digits.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (digits.length > 3) {
        formatted = digits.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }

      if (value !== formatted) {
        control.setValue(formatted, { emitEvent: false });
      }

      // Validação de CPF válido
      if (!digits) {
        control.setErrors({ required: true });
        return;
      }

      if (digits.length < 11) {
        control.setErrors({ invalidCPF: true });
        return;
      }

      const isValid = this.validarCPF(digits);
      if (!isValid) {
        control.setErrors({ invalidCPF: true });
      } else {
        control.setErrors(null); // limpa todos os erros se válido
      }
    });

    // Formata RG automaticamente enquanto digita
    this.form.get('rg')?.valueChanges.subscribe((value: string | null) => {
      const control = this.form.get('rg');
      if (!control) return;

      // Pega apenas os números, máximo 9
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 9);

      // --- Formatação visual ---
      let formatted = digits;
      if (digits.length > 8) {
        formatted = digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
      } else if (digits.length > 5) {
        formatted = digits.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (digits.length > 2) {
        formatted = digits.replace(/(\d{2})(\d{1,3})/, '$1.$2');
      }

      // Atualiza o valor no input sem emitir outro evento
      if (value !== formatted) {
        control.setValue(formatted, { emitEvent: false });
      }

      // Validação RG: só marca inválido se tiver 9 dígitos
      if (!digits) {
        control.setErrors({ required: true });
      } else if (digits.length === 9) {
        // Evita sequência de números iguais
        if (/^(\d)\1+$/.test(digits)) {
          control.setErrors({ invalidRG: true });
        } else {
          const regex = /^\d{2}\.\d{3}\.\d{3}-\d{1}$/;
          if (!regex.test(formatted)) {
            control.setErrors({ invalidRG: true });
          } else {
            // RG válido, remove o erro
            if (control.errors) {
              const { invalidRG, ...rest } = control.errors;
              control.setErrors(Object.keys(rest).length ? rest : null);
            }
          }
        }
      } else {
        // Menos de 9 dígitos: ainda inválido, mas não mostra erro "valid"
        control.setErrors({ invalidRG: true });
      }
    });

    // Formata "mask" a data de nascimento automaticamente enquanto digita
    this.form.get('nascimento')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      // Remove tudo que não for número
      const digits = safe.replace(/\D/g, '').substring(0, 8); // Máx 8 dígitos: DDMMYYYY
      let formatted = digits;

      if (digits.length > 4) {
        // DDMMYYYY → DD/MM/YYYY
        formatted = digits.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
      } else if (digits.length > 2) {
        // DDMM → DD/MM
        formatted = digits.replace(/(\d{2})(\d{1,2})/, '$1/$2');
      }

      if (value !== formatted) {
        this.form.get('nascimento')?.setValue(formatted, { emitEvent: false }); // evita loop
      }
    });

    // Formata telefone automaticamente
    this.form.get('telefone')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 11); // máximo 11 dígitos
      let formatted = digits;

      if (digits.length > 6) { // formato celular: (99) 99999-9999
        formatted = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (digits.length > 2) { // formato fixo: (99) 9999-9999
        formatted = digits.replace(/(\d{2})(\d{1,4})/, '($1) $2');
      }

      if (value !== formatted) {
        this.form.get('telefone')?.setValue(formatted, { emitEvent: false });
      }
      const allSame = digits.split('').every((char: string) => char === digits[0]);
      if (allSame && digits.length >= 8) {
        this.form.get('telefone')?.setErrors({ invalidPhone: true });
      } else if (this.form.get('telefone')?.errors?.['invalidPhone']) {
        this.form.get('telefone')?.setErrors(null);
      }
    });

    // Formata telefone recado automaticamente
    this.form.get('telefoneRec')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 11); // máximo 11 dígitos
      let formatted = digits;

      if (digits.length > 6) { // formato celular: (99) 99999-9999
        formatted = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (digits.length > 2) { // formato fixo: (99) 9999-9999
        formatted = digits.replace(/(\d{2})(\d{1,4})/, '($1) $2');
      }

      if (value !== formatted) {
        this.form.get('telefoneRec')?.setValue(formatted, { emitEvent: false });
      }
      const allSame = digits.split('').every((char: string) => char === digits[0]);
      if (allSame && digits.length >= 8) {
        this.form.get('telefoneRec')?.setErrors({ invalidPhone: true });
      } else if (this.form.get('telefoneRec')?.errors?.['invalidPhone']) {
        this.form.get('telefoneRec')?.setErrors(null);
      }
    });

    // Preenche o formulário com o @Input cadastro, já preenchido, aplica patchValue e preview
    if (this.cadastro && this.cadastro.id) {
      // Normaliza foto para o formulário: o backend armazena apenas em Base64 (sem prefixo),
      // mas em alguns fluxos a propriedade pode vir com prefixo `data:image/...;base64,`.
      const fotoRaw = this.normalizeFoto(this.cadastro.foto);
      this.form.patchValue({ ...this.cadastro, foto: fotoRaw });
      // Ajuste para garantir que a foto seja exibida (preview sempre com prefixo)
      this.fotoPreview = this.cadastro.foto
        ? this.cadastro.foto.startsWith('data:image')
          ? this.cadastro.foto
          : `data:image/jpeg;base64,${this.cadastro.foto}`
        : null;
    }
  }

  // ngOnChanges
  // sincroniza o form quando o @Input cadastro muda (ex.: pai abre offcanvas com outro item)
  // reseta o form se cadastro vier vazio (modo novo)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cadastro'] && this.form && this.cadastro && this.cadastro.id) {
      const fotoRaw = this.normalizeFoto(this.cadastro.foto);
      this.form.patchValue({ ...this.cadastro, foto: fotoRaw });
      // Ajuste para garantir que a foto seja exibida
      this.fotoPreview = this.cadastro.foto
        ? this.cadastro.foto.startsWith('data:image')
          ? this.cadastro.foto
          : `data:image/jpeg;base64,${this.cadastro.foto}`
        : null;
      // Desabilita CPF e RG no modo edição
      this.setCpfRgDisabled(true);
    } else if (changes['cadastro'] && this.form && (!this.cadastro || !this.cadastro.id)) {
      this.form.reset();
      this.fotoPreview = null;
      // Reabilita CPF e RG ao criar novo
      this.setCpfRgDisabled(false);
    }
  }

  save(): void {
    if (this.form?.valid) {
      // Aqui não devemos sobrescrever com `new Cadastro()` porque isso zera o id
      // e faz o fluxo sempre cair no 'save' (POST) em vez de 'update' (PUT).
      this.cadastro = { ...this.cadastro, ...this.form.value };
      // Se a foto estiver no formato dataURI (ex.: 'data:image/...;base64,AAA...'),
      // o backend espera apenas o base64 puro. Normalizamos aqui.
      if (this.cadastro.foto) {
        this.cadastro.foto = this.normalizeFoto(this.cadastro.foto as string) as string;
      }

      // Verifica se é update (id numérico > 0)
      const cadastroId = this.cadastro.id ? Number(this.cadastro.id) : null;
      const isUpdate = cadastroId && cadastroId > 0;

      if (isUpdate) {
        // UPDATE chama o endpoint de update (PUT). Preserva o id para evitar conflito de CPF.
        this.cadastroService.update(this.cadastro, cadastroId).subscribe({
          next: mensagem => {
            // Ao atualizar com sucesso, tentamos recuperar a versão canônica do servidor
            this.cadastroService.findById(cadastroId).subscribe({
              next: updatedFromServer => {
                // Emite os dados retornados pelo servidor para o componente pai
                Swal.fire({
                  title: String(mensagem || 'Atualizado com sucesso'),
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.retorno.emit(updatedFromServer);
                });
              },
              error: errFetch => {
                // Se falhar ao buscar a versão do servidor, emite o objeto local como fallback
                // Em vez de um log de console, exibimos uma notificação ao usuário
                Swal.fire({
                  title: String(mensagem || 'Atualizado com sucesso'),
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.retorno.emit(this.cadastro);
                });
              }
            });
          },
          error: erro => {
            // Extrai mensagem do backend de forma robusta e exibe para o usuário
            const backendMsg = typeof erro.error === 'string'
              ? erro.error
              : (erro.error?.message ? erro.error.message : JSON.stringify(erro.error));
            const msg = backendMsg && backendMsg.toLowerCase().includes('cpf')
              ? backendMsg
              : `Erro ao atualizar: ${backendMsg}`;
            Swal.fire({ title: msg, icon: 'error', confirmButtonText: 'Ok' });
          }
        });
      } else {
        // NOVO CADASTRO chama save create (POST)
        this.cadastro.id = null;
        this.cadastroService.save(this.cadastro).subscribe({
          next: mensagem => {
            Swal.fire({
              title: String(mensagem || 'Salvo com sucesso'),
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.retorno.emit(this.cadastro);
            });
          },
          error: erro => {
            const backendMsg = typeof erro.error === 'string'
              ? erro.error
              : (erro.error?.message ? erro.error.message : JSON.stringify(erro.error));
            const msg = backendMsg && backendMsg.toLowerCase().includes('cpf')
              ? backendMsg
              : `Erro ao salvar: ${backendMsg}`;
            Swal.fire({ title: msg, icon: 'error', confirmButtonText: 'Ok' });
          }
        });
      }
    } else {
      // Marca todos como touched primeiro para popular control.errors
      this.form.markAllAsTouched();
      // Lista campos obrigatórios não preenchidos (exceto textarea)
      const missing = this.getMissingRequiredFields();
      if (missing.length) {
        const html = `<p>Preencha os campos obrigatórios:</p><ul style="text-align:left">${missing.map(f => `<li>${f}</li>`).join('')}</ul>`;
        Swal.fire({ title: 'Campos faltando', html, icon: 'warning', confirmButtonText: 'Ok' });
      }
    }
  }

  // Retorna lista de rótulos dos campos required que estão inválidos/empty (ignora campos desabilitados)
  getMissingRequiredFields(): string[] {
    if (!this.form) return [];
    const labels: { [key: string]: string } = {
      foto: 'Foto', nome: 'Nome', cpf: 'CPF', rg: 'RG', uf: 'UF', pais: 'País', nascimento: 'Nascimento', sexo: 'Sexo',
      civil: 'Estado civil', escolaridade: 'Escolaridade', profissao: 'Profissão', telefone: 'Telefone', telefoneRec: 'Telefone (Recado)',
      nomepai: 'Nome do pai', nomemae: 'Nome da mãe', email: 'E-mail', cep: 'CEP', bairro: 'Bairro', rua: 'Rua', numero: 'Número',
      cidades: 'Cidade', estados: 'Estado', complemento: 'Complemento'
    };
    const missing: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (!control) return;
      // Ignora campos desabilitados (ex.: cpf/rg em edição)
      if (control.disabled) return;
      // Ignora textarea (opcional)
      if (key === 'textarea') return;
      // Considera como faltando se inválido e contém erro 'required' OR se value é vazio and control has validators
      const val = control.value;
      const isEmpty = val === null || val === undefined || (typeof val === 'string' && val.trim() === '');
      const hasRequired = !!control.errors?.['required'] || isEmpty && (key in labels);
      if (hasRequired) {
        const label = labels[key] || key;
        if (!missing.includes(label)) missing.push(label);
      }
    });
    return missing;
  }

  // onSubmit chamado pelo (ngSubmit)="onSubmit()"
  // apenas delega para save() se form válido (também marca touched se inválido)
  onSubmit(): void {
    if (this.form?.valid) {
      this.cadastro = { ...this.cadastro, ...this.form.value };
      this.save();
    } else if (this.form) {
      this.form.markAllAsTouched();
    } else {
      // Formulário não inicializado — informar o usuário
      Swal.fire({ title: 'Erro: Formulário não inicializado', icon: 'error', confirmButtonText: 'Ok' });
    }
  }

  //FINDBYID
  // findById(id) Recupera um cadastro pelo id no backend e preenche o formulário
  // Atualiza a pré-visualização da foto e ajusta o estado de edição (desabilita CPF/RG)
  findById(id: number) {
    this.cadastroService.findById(id).subscribe({
      next: retorno => {
        this.cadastro = retorno;
        const fotoRaw = this.normalizeFoto(this.cadastro.foto);
        this.form.patchValue({ ...this.cadastro, foto: fotoRaw });
        // Ajuste para garantir que a foto seja exibida
        this.fotoPreview = this.cadastro.foto
          ? this.cadastro.foto.startsWith('data:image')
            ? this.cadastro.foto
            : `data:image/jpeg;base64,${this.cadastro.foto}`
          : null;
        // Estamos no modo edição quando buscamos por id — desabilitar CPF e RG
        this.setCpfRgDisabled(true);
      },
      error: erro => {
        // Exibir erro ao usuário em vez de logar no console
        Swal.fire({ title: 'Erro ao buscar cadastro', icon: 'error', confirmButtonText: 'Ok' });
      }
    });
  }

  // Desabilita ou reabilita os campos CPF e RG dependendo do modo (edição/criação)
  setCpfRgDisabled(disabled: boolean): void {
    if (!this.form) return;
    const cpfControl = this.form.get('cpf');
    const rgControl = this.form.get('rg');
    if (!cpfControl || !rgControl) return;
    if (disabled) {
      cpfControl.disable({ emitEvent: false });
      rgControl.disable({ emitEvent: false });
    } else {
      cpfControl.enable({ emitEvent: false });
      rgControl.enable({ emitEvent: false });
    }
  }

  // listAll() Busca todos os cadastros no backend e atualiza o array local `lista`.
  // Em caso de erro exibe uma notificação ao usuário.
  listAll() {
    this.cadastroService.listAll().subscribe({
      //Aqui retorna o Ok (requisições) do back
      next: lista => {
        //Essa lista vem da lista do array acima, que recebe a lista do back!
        this.lista = lista;
      },
      error: erro => {
        // Notificar usuário caso a listagem falhe ou back estiver offline
        // porém e substituida pela msg em loadCadastros no listagem.ts
        Swal.fire({
          title: 'Erro ao listar cadastros',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  // Altera a aba ativa do formulário (dados / endereço)
  setActiveTab(tab: 'dados' | 'endereco') {
    this.activeTab = tab;
  }

  //  Implementa a validação oficial do CPF (digitos verificadores)
  //  Retorna true se válido, false caso contrário
  validarCPF(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // todos iguais
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  // Normaliza valor de foto: remove prefixo data URI se presente e retorna apenas Base64 puro
  normalizeFoto(value: string | null | undefined): string | null {
    if (!value) return null;
    if (typeof value !== 'string') return null;
    // Se for data URI, pega parte após a vírgula
    if (value.startsWith('data:')) {
      const idx = value.indexOf(',');
      return idx >= 0 ? value.substring(idx + 1).replace(/\s/g, '') : null;
    }
    // Caso já seja Base64 puro, remove quebras de linha/espacos
    return value.replace(/\s/g, '');
  }

  // bloqueia números/caracteres inválidos no input de nome
  permitirSomenteLetras(event: KeyboardEvent): void {
    const char = event.key;
    // único caractere (letra com acento) ou espaço
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]$/;
    if (!regex.test(char)) {
      event.preventDefault();
    }
  }

  // onPasteLetters(event)
  // limpa tudo que não for letra ao colar (nome)
  // substitui valor no input e atualiza o FormControl
  onPasteLetters(event: ClipboardEvent): void {
    const clipboard = event.clipboardData?.getData('text') ?? '';
    const cleaned = clipboard.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const newValue = input.value.slice(0, start) + cleaned + input.value.slice(end);
    input.value = newValue;
    this.form.get('nome')?.setValue(newValue);
  }

  // onFileChange(files)
  // Lida com seleção de arquivo de imagem, converte para base64, valida tamanho/ formato
  // Atualiza o campo `foto` do form com o Base64 puro e define `fotoPreview` para exibição
  onFileChange(files: FileList | null): void {
    if (!files || files.length === 0) {
      this.form.patchValue({ foto: null });
      // Nenhuma foto selecionada
      this.fotoPreview = null;
      return;
    }
    const file = files[0];
    if (file.size > 100 * 1024) { // Limite de 100KB pra evitar 431
      Swal.fire({ title: 'Arquivo muito grande! <br> Limite de 100kb.', icon: 'error', confirmButtonText: 'Ok' });
      this.form.patchValue({ foto: null });
      this.fotoPreview = null;
      return;
    }
    if (!file.type.startsWith('image/')) {
      Swal.fire({ title: 'Formato inválido', icon: 'error', confirmButtonText: 'Ok' });
      this.form.patchValue({ foto: null });
      this.fotoPreview = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;

      if (base64String.includes(',')) {
        base64String = base64String.split(',')[1]; // Remove prefixo
      }
      // Validação reforçada para Base64
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      // Validar Base64
      if (!base64Regex.test(base64String)) {
        // Base64 inválido — informar usuário e limpar campo
        Swal.fire({ title: 'Erro na imagem', icon: 'error', confirmButtonText: 'Ok' });
        this.form.patchValue({ foto: null });
        this.fotoPreview = null;
        return;
      }
      // Remove possíveis quebras de linha ou espaços
      base64String = base64String.replace(/\s/g, '');
      this.form.patchValue({ foto: base64String });
      // Usa JPEG no preview atualmente; se quiser suportar PNG dinamicamente, detecte file.type
      this.fotoPreview = `data:image/jpeg;base64,${base64String}`; // Define prévia
    };

    reader.onerror = () => {
      // Erro ao ler o arquivo — mostrar aviso ao usuário
      Swal.fire({ title: 'Erro ao ler arquivo', icon: 'error', confirmButtonText: 'Ok' });
      this.form.patchValue({ foto: null });
      this.fotoPreview = null;
    };
    reader.readAsDataURL(file);
  }


  //**ENDEREÇO**
  buscarCEP() {
    const cepVal = this.form.get('cep')?.value ?? '';
    const cep = cepVal.toString().replace(/\D/g, '');
    if (cep.length !== 8) return;

    //Aqui faz aparecer o buscando... abaixo do input que está lá no html
    this.loadingCEP = true;
    this.erroCEP = null;

    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (res: any) => {
        if (res.erro) { // CEP não encontrado
          this.erroCEP = 'CEP não encontrado.';
          this.form.patchValue({ rua: '', bairro: '', cidades: '', estados: '' });
          this.form.get('cep')?.setErrors({ invalidCEP: true }); // <-- marca inválido
        } else {
          this.form.patchValue({
            rua: res.logradouro,
            bairro: res.bairro,
            cidades: res.localidade,
            estados: res.uf
          });
          this.form.get('cep')?.setErrors(null);
        }
        this.loadingCEP = false;
      },
      error: () => {
        this.erroCEP = 'Erro ao buscar CEP.';
        this.loadingCEP = false;
        this.form.get('cep')?.setErrors({ invalidCEP: true });
      }
    });
  }

  // Preenche o campo  automaticamente após o cep ser válido
  get cidadeAtual(): string {
    return this.form.get('cidades')?.value || '';
  }

  // Aqui valida o cep para não ter validação 1111 111 e
  // mesmo não tendo no array cidades ele preencher pq vem da API viacep!!
  isCidadeAtualForaDaLista(): boolean {
    const cidade = this.cidadeAtual;
    return cidade ? !this.cidades.some(c => c.value === cidade) : false;
  }

  // Bloqueia letras e caracteres especiais telefone
  permitirSomenteNumeros(event: KeyboardEvent): void {
    // Permitir apenas dígitos (0-9) e teclas de controle como Backspace, Delete e setas
    const key = event.key ?? '';
    const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedControlKeys.includes(key)) return;
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
    }
  }

  // Método limpa o campo foto do form e a preview
  clearPhoto(): void {
    this.form.patchValue({ foto: null });
    this.fotoPreview = null;
  }
}

