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

  @Input() cadastroSeletor: Cadastro = new Cadastro();
  @Output() retorno = new EventEmitter<Cadastro>();

  router = inject(ActivatedRoute);
  cadastroService = inject(CadastroService);
  lista: Cadastro[] = [];

  form!: FormGroup;
  activeTab: 'dados' | 'endereco' = 'dados';
  loadingCEP = false;
  erroCEP: string | null = null;
  fotoPreview: string | null = null;

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

    const id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
    this.listAll();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      foto: [null],
      nome: ['', [
        Validators.required,
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

      // Endereço
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      bairro: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cidades: ['', Validators.required],
      estados: ['', Validators.required],
      complemento: ['', Validators.required],
      textarea: [''],
    });

    const initiallyEdit = !!(this.cadastroSeletor && this.cadastroSeletor.id && Number(this.cadastroSeletor.id) > 0);
    this.setCpfRgDisabled(initiallyEdit);

    this.form.get('cep')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 8);
      let formatted = digits;

      if (digits.length > 5) {
        formatted = digits.replace(/(\d{5})(\d{1,3})/, '$1-$2');
      }

      if (value !== formatted) {
        this.form.get('cep')?.setValue(formatted, { emitEvent: false });
      }
    });

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
        control.setErrors(null);
      }
    });

    this.form.get('rg')?.valueChanges.subscribe((value: string | null) => {
      const control = this.form.get('rg');
      if (!control) return;

      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 9);

      let formatted = digits;
      if (digits.length > 8) {
        formatted = digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
      } else if (digits.length > 5) {
        formatted = digits.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (digits.length > 2) {
        formatted = digits.replace(/(\d{2})(\d{1,3})/, '$1.$2');
      }

      if (value !== formatted) {
        control.setValue(formatted, { emitEvent: false });
      }
      if (!digits) {
        control.setErrors({ required: true });
      } else if (digits.length === 9) {
        if (/^(\d)\1+$/.test(digits)) {
          control.setErrors({ invalidRG: true });
        } else {
          const regex = /^\d{2}\.\d{3}\.\d{3}-\d{1}$/;
          if (!regex.test(formatted)) {
            control.setErrors({ invalidRG: true });
          } else {
            if (control.errors) {
              const { invalidRG, ...rest } = control.errors;
              control.setErrors(Object.keys(rest).length ? rest : null);
            }
          }
        }
      } else {
        control.setErrors({ invalidRG: true });
      }
    });
    this.form.get('nascimento')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 8);
      let formatted = digits;

      if (digits.length > 4) {
        formatted = digits.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
      } else if (digits.length > 2) {
        formatted = digits.replace(/(\d{2})(\d{1,2})/, '$1/$2');
      }

      if (value !== formatted) {
        this.form.get('nascimento')?.setValue(formatted, { emitEvent: false });
      }
    });
    this.form.get('telefone')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 11);
      let formatted = digits;

      if (digits.length > 6) {
        formatted = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (digits.length > 2) {
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

    this.form.get('telefoneRec')?.valueChanges.subscribe(value => {
      const safe = (value ?? '').toString();
      const digits = safe.replace(/\D/g, '').substring(0, 11);
      let formatted = digits;

      if (digits.length > 6) {
        formatted = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (digits.length > 2) {
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

    if (this.cadastroSeletor && this.cadastroSeletor.id) {
      const fotoRaw = this.normalizeFoto(this.cadastroSeletor.foto);
      this.form.patchValue({ ...this.cadastroSeletor, foto: fotoRaw });
      this.fotoPreview = this.cadastroSeletor.foto
        ? this.cadastroSeletor.foto.startsWith('data:image')
          ? this.cadastroSeletor.foto
          : `data:image/jpeg;base64,${this.cadastroSeletor.foto}`
        : null;
    }

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cadastroSeletor']) {
      this.activeTab = 'dados';
    }

    if (changes['cadastroSeletor'] && this.form && this.cadastroSeletor && this.cadastroSeletor.id) {
      const fotoRaw = this.normalizeFoto(this.cadastroSeletor.foto);
      this.form.patchValue({ ...this.cadastroSeletor, foto: fotoRaw });
      this.fotoPreview = this.cadastroSeletor.foto
        ? this.cadastroSeletor.foto.startsWith('data:image')
          ? this.cadastroSeletor.foto
          : `data:image/jpeg;base64,${this.cadastroSeletor.foto}`
        : null;
      this.setCpfRgDisabled(true);
    }

    else if (changes['cadastroSeletor'] && this.form && (!this.cadastroSeletor || !this.cadastroSeletor.id)) {
      this.form.reset();
      this.fotoPreview = null;
      this.setCpfRgDisabled(false);
    }
  }

  save(): void {
    if (this.form?.valid) {
      this.cadastroSeletor = { ...this.cadastroSeletor, ...this.form.value };
      if (this.cadastroSeletor.foto) {
        this.cadastroSeletor.foto = this.normalizeFoto(this.cadastroSeletor.foto as string) as string;
      }

      const cadastroId = this.cadastroSeletor.id ? Number(this.cadastroSeletor.id) : null;
      const isUpdate = cadastroId && cadastroId > 0;

      if (isUpdate) {
        this.cadastroService.update(this.cadastroSeletor, cadastroId).subscribe({
          next: mensagem => {
            this.cadastroService.findById(cadastroId).subscribe({
              next: updatedFromServer => {
                Swal.fire({
                  title: String(mensagem || 'Atualizado com sucesso'),
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.retorno.emit(updatedFromServer);
                });
              },
              error: errFetch => {
                Swal.fire({
                  title: String(mensagem || 'Atualizado com sucesso'),
                  icon: 'success',
                  confirmButtonText: 'Ok'
                }).then(() => {
                  this.retorno.emit(this.cadastroSeletor);
                });
              }
            });
          },
          error: erro => {
            const msg = erro.message || (typeof erro.error === 'string'
              ? erro.error
              : (erro.error?.message ? erro.error.message : "Erro ao atualizar"));

            Swal.fire({ title: msg, icon: 'error', confirmButtonText: 'Ok' });
          }
        });
      }

      else {
        this.cadastroSeletor.id = null;
        this.cadastroService.save(this.cadastroSeletor).subscribe({
          next: mensagem => {
            Swal.fire({
              title: String(mensagem || 'Salvo com sucesso'),
              icon: 'success',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.retorno.emit(this.cadastroSeletor);
            });
          },
          error: erro => {
            const msg = erro.message || (typeof erro.error === 'string'
              ? erro.error
              : (erro.error?.message ? erro.error.message : "Erro ao salvar"));

            Swal.fire({ title: msg, icon: 'error', confirmButtonText: 'Ok' });
          }
        });
      }
    }

    else {
      this.form.markAllAsTouched();
      this.form.get('cpf')?.markAsTouched();
      this.form.get('rg')?.markAsTouched();
      const missing = this.getMissingRequiredFields();
      if (missing.length) {
        const html = `<p>Preencha os campos obrigatórios:</p><ul style="text-align:left">${missing.map(f => `<li>${f}</li>`).join('')}</ul>`;
        Swal.fire({ title: 'Campos faltando', html, icon: 'warning', confirmButtonText: 'Ok' });
      }
    }
  }

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
      if (control.disabled) return;
      if (key === 'textarea') return;
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

  onSubmit(): void {
    if (this.form?.valid) {
      this.cadastroSeletor = { ...this.cadastroSeletor, ...this.form.value };
      this.save();
    } else if (this.form) {
      this.form.markAllAsTouched();
      this.form.get('cpf')?.markAsTouched();
      this.form.get('rg')?.markAsTouched();
    } else {
      Swal.fire({ title: 'Erro: Formulário não inicializado', icon: 'error', confirmButtonText: 'Ok' });
    }
  }

  findById(id: number) {
    this.cadastroService.findById(id).subscribe({
      next: retorno => {
        this.cadastroSeletor = retorno;
        const fotoRaw = this.normalizeFoto(this.cadastroSeletor.foto);
        this.form.patchValue({ ...this.cadastroSeletor, foto: fotoRaw });
        this.fotoPreview = this.cadastroSeletor.foto
          ? this.cadastroSeletor.foto.startsWith('data:image')
            ? this.cadastroSeletor.foto
            : `data:image/jpeg;base64,${this.cadastroSeletor.foto}`
          : null;
        this.setCpfRgDisabled(true);
      },
      error: erro => {
        Swal.fire({ title: 'Erro ao buscar cadastro', icon: 'error', confirmButtonText: 'Ok' });
      }
    });
  }

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

  listAll() {
    this.cadastroService.listAll().subscribe({
      next: lista => {
        this.lista = lista;
      },
      error: erro => {
        Swal.fire({
          title: 'Erro ao listar cadastros',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  setActiveTab(tab: 'dados' | 'endereco') {
    this.activeTab = tab;
  }


  validarCPF(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
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

  normalizeFoto(value: string | null | undefined): string | null {
    if (!value) return null;
    if (typeof value !== 'string') return null;
    if (value.startsWith('data:')) {
      const idx = value.indexOf(',');
      return idx >= 0 ? value.substring(idx + 1).replace(/\s/g, '') : null;
    }
    return value.replace(/\s/g, '');
  }

  permitirSomenteLetras(event: KeyboardEvent): void {
    const char = event.key;
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]$/;
    if (!regex.test(char)) {
      event.preventDefault();
    }
  }

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

  onFileChange(files: FileList | null): void {
    if (!files || files.length === 0) {
      this.form.patchValue({ foto: null });
      this.fotoPreview = null;
      return;
    }

    const file = files[0];
    if (file.size > 100 * 1024) {
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
        base64String = base64String.split(',')[1];
      }

      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      if (!base64Regex.test(base64String)) {
        Swal.fire({ title: 'Erro na imagem', icon: 'error', confirmButtonText: 'Ok' });
        this.form.patchValue({ foto: null });
        this.fotoPreview = null;
        return;
      }

      base64String = base64String.replace(/\s/g, '');
      this.form.patchValue({ foto: base64String });
      this.fotoPreview = `data:image/jpeg;base64,${base64String}`;
    };

    reader.onerror = () => {
      Swal.fire({ title: 'Erro ao ler arquivo', icon: 'error', confirmButtonText: 'Ok' });
      this.form.patchValue({ foto: null });
      this.fotoPreview = null;
    };
    reader.readAsDataURL(file);
  }

  buscarCEP() {
    const cepVal = this.form.get('cep')?.value ?? '';
    const cep = cepVal.toString().replace(/\D/g, '');
    if (cep.length !== 8) return;

    this.loadingCEP = true;
    this.erroCEP = null;

    this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (res: any) => {
        if (res.erro) {
          this.erroCEP = 'CEP não encontrado.';
          this.form.patchValue({ rua: '', bairro: '', cidades: '', estados: '' });
          this.form.get('cep')?.setErrors({ invalidCEP: true });
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

  get cidadeAtual(): string {
    return this.form.get('cidades')?.value || '';
  }

  isCidadeAtualForaDaLista(): boolean {
    const cidade = this.cidadeAtual;
    return cidade ? !this.cidades.some(c => c.value === cidade) : false;
  }

  permitirSomenteNumeros(event: KeyboardEvent): void {
    const key = event.key ?? '';
    const allowedControlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedControlKeys.includes(key)) return;
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
    }
  }

  clearPhoto(): void {
    this.form.patchValue({ foto: null });
    this.fotoPreview = null;
  }

}

