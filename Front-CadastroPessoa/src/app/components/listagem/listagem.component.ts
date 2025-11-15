import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Cadastro } from '../../models/cadastro';
import { FormControl } from '@angular/forms';
import { Offcanvas } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss']
})
export class ListagemComponent implements OnInit {
  // Instância do offcanvas bootstrap (manipulação DOM)
  private offcanvas!: Offcanvas;
  isOffcanvasOpen = false;
  pendingReload = false;

  // Dados
  lista: Cadastro[] = [];
  listaFiltrada: Cadastro[] = [];
  // Para modal ou offcanvas "refete a quantidade dos atributos da model e tipo"
  // cadastroEdit: Cadastro = new Cadastro(0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', '', '', '');
  // Esse modo pega os valores definido na model fica mais limpo e recomendado do que o de cima!
  cadastroEdit: Cadastro = new Cadastro();

  // Paginação
  pageSize = 5; // Limite de exibição
  currentPage = 1;
  totalPages = 1;

  // Busca
  searchControl = new FormControl('');
  noResults = false;

  // Mapeamento de profissões de cadastro pegando o text e não o value no array para exibir de
  // forma legível na tabela pq se não fica (ex: 'ANALISTA_SISTEMAS' ao invés de 'A. de Sistemas')
  profissoes: Array<{ text: string, value: string }> = [
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

  // Mapa para lookup rápido (value -> text)
  profissaoMap: { [key: string]: string } = {};

  // Injetando serviço e ChangeDetectorRef que será usado para forçar detecção de mudanças
  // ele faz o f5 na tabela sem precisar recarregar manualmente após fazer alterações
  constructor(private cadastroService: CadastroService, private cd: ChangeDetectorRef) { }

  // ngOnInit: inicializa mapa, carrega dados, configura offcanvas e subscription do searchControl
  ngOnInit(): void {
    // Prepara o mapa de profissões para lookup/pesquisa conversão rápida
    this.profissaoMap = Object.fromEntries(this.profissoes.map(p => [p.value, p.text]));

    // Carrega os cadastros iniciais
    this.loadCadastros();

    // Inicializa offcanvas usando o elemento do DOM (Bootstrap native)
    const offcanvasEl = document.getElementById('offcanvasCadastro');
    if (offcanvasEl) {
      this.offcanvas = new Offcanvas(offcanvasEl, { backdrop: true, keyboard: true, scroll: false });

      // Quando o offcanvas for fechado, limpa flag e, se necessário, recarrega dados
      offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        this.isOffcanvasOpen = false;
        const backdrop = document.querySelector('.offcanvas-backdrop');
        backdrop?.remove();
        if (this.pendingReload) { this.pendingReload = false; this.loadCadastros(); }
      });
    }

    // Subscription para o campo de busca com debounce
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(v => {
      this.filtrarCadastros(v || '');
      this.currentPage = 1;
      this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
      this.noResults = this.listaFiltrada.length === 0 && String(v || '').trim() !== '';
    });

    // Recarrega lista quando serviço emitir alteração (evento custom no service)
    this.cadastroService.changed.subscribe(() => {
      if (this.isOffcanvasOpen) { this.pendingReload = true; return; }
      this.loadCadastros();
    });
  }

  // loadCadastros: busca todos cadastros e atualiza listas + paginação
  loadCadastros(): void {
    this.cadastroService.listAll().subscribe({
      next: dados => {
        const now = Date.now();
        // adiciona rowKey para forçar re-render quando necessário (evita problemas de cache visual)
        this.lista = (dados || []).map((c, i) => ({ ...(c as any), rowKey: now + i }));
        this.listaFiltrada = [...this.lista];
        this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
        try { this.cd.detectChanges(); } catch { }
      },
      error: () => Swal.fire({ title: 'Ocorreu um erro ao listar cadastros', icon: 'error', confirmButtonText: 'Ok' })
    });
  }

  // filtrarCadastros: filtra localmente por id, nome, profissao palavra ao digitar na busca
  // ele buscar na tabela se tem e mostra só os resultados
  filtrarCadastros(termRaw: string) {
    const term = (termRaw || '').trim().toLowerCase();
    if (!term) { this.listaFiltrada = [...this.lista]; this.noResults = false; }
    else {
      this.listaFiltrada = this.lista.filter(c =>
        String(c.id || '').includes(term) || (c.nome || '').toLowerCase().includes(term) || (c.profissao || '').toLowerCase().includes(term)
      );
      this.noResults = this.listaFiltrada.length === 0;
    }
    this.currentPage = 1;
    this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
  }

  // Retorna os itens da página atual segundo o limite na paginação pageSize = 5;
  getItemsPaginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.listaFiltrada.slice(start, start + this.pageSize);
  }
  // Gera array de páginas para *ngFor no template 1,2,3,...totalPages
  get totalPagesArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  // trackBy para render mais eficiente (usa rowKey se existir)
  trackById(_index: number, item: Cadastro) {
    return (item as any)?.rowKey ? `${item.id}_${(item as any).rowKey}` : `${item.id}`;
  }
  // Ao mudar a página  2, 3... quando o usuário clica na paginação ele já checar e adciona
  // os itens e limites da quantidade de itens na lista conforme o maximo declarado no pageSize = 5;
  changePage(page: number) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }

  // Chamado quando de forma manual o dropdown de itens 5,10,20 ou todos na página
  onPageSizeChange() {
    // Ajusta a página atual e recalcula total de páginas com base na lista filtrada
    this.currentPage = 1;
    this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
    try { this.cd.detectChanges(); } catch { }
  }

  // Getter para o total de itens na tabela (atualiza automaticamente)
  get totalItens(): number {
    return this.lista.length;
  }

  // Abre offcanvas (se receber um cadastro, clona pra edição; senão cria novo) e aqui que
  // ao editar um cadastro, ele já trás os campos preenchidos do formulário
  abrirOffcanvas(c?: Cadastro) { this.cadastroEdit = c ? { ...c } : new Cadastro(); this.isOffcanvasOpen = true; this.offcanvas?.show(); }
  fecharOffcanvas() { this.offcanvas?.hide(); this.isOffcanvasOpen = false; if (this.pendingReload) { this.pendingReload = false; this.loadCadastros(); } }

  // Handler chamado quando o componente filho emite o cadastro salvo/atualizado
  retornoCadastro(cadastro: Cadastro) {
    if (!cadastro || !cadastro.id) { this.loadCadastros(); this.fecharOffcanvas(); return; }

    // Normaliza a foto: caso venha sem data: prefixa com data:image/jpeg;base64, (Binario)
    // EX:JPG → data:image/jpeg;base64,/9j/4AAQSkZJRgABA...
    // PNG → data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...
    // ele converter para string no banco dentro de um LongText (não e uma data).
    // E o angular recebe pelo prefixo data:image/...;base64, junta e exibe no retorno ao front
    // para o navegador entende!
    const foto = cadastro.foto ? (String(cadastro.foto).startsWith('data:')
      ? cadastro.foto : `data:image/jpeg;base64,${cadastro.foto}`) : null;
    const updated = { ...(cadastro as any), foto, rowKey: Date.now() } as Cadastro;

    // Atualiza lista local de forma imutável (melhor pra detecção de mudanças) ele e o principal
    // após o update no itens/id ele manda para tabela e o ChangeDetectorRef.detectChanges()
    // detectar e "força" essa att automaticamente sem precisar realizar manualmente o F5
    const idx = this.lista.findIndex(x => x.id === cadastro.id);
    if (idx !== -1) this.lista = [...this.lista.slice(0, idx), updated,
    ...this.lista.slice(idx + 1)];
    else this.lista = [updated, ...this.lista];

    const fidx = this.listaFiltrada.findIndex(x => x.id === cadastro.id);
    if (fidx !== -1) this.listaFiltrada = [...this.listaFiltrada.slice(0, fidx), updated, ...this.listaFiltrada.slice(fidx + 1)]; else this.listaFiltrada = [...this.lista];

    this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
    try { this.cd.detectChanges(); } catch { }

    if (this.pendingReload) this.pendingReload = false;
    this.fecharOffcanvas();

    // Isso garante que qualquer transformações feitas no backend sejam refletidas
    // Evita duplicações ou ids conflitantes, Atualiza só o item modificado, sem precisar
    // recarregar tudo, E ainda deixa a experiência do usuário suave e instantânea.
    setTimeout(() => {
      this.cadastroService.findById(cadastro.id as number).subscribe({
        next: srv => {
          const final = { ...(srv as any), rowKey: Date.now() } as Cadastro;
          const i = this.lista.findIndex(x => x.id === final.id);
          if (i !== -1) this.lista = [...this.lista.slice(0, i), final, ...this.lista.slice(i + 1)];
          const fi = this.listaFiltrada.findIndex(x => x.id === final.id);
          if (fi !== -1) this.listaFiltrada = [...this.listaFiltrada.slice(0, fi), final, ...this.listaFiltrada.slice(fi + 1)];
          this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
          try { this.cd.detectChanges(); } catch { }
        }, error: () => { /* Se falhar, mantemos a versão local */ }
      });
    }, 0);
  }

  // Retorna o rótulo de profissão dado o valor salvo (ex: 'ANALISTA_SISTEMAS' -> 'A. de Sistemas')
  // que e pego pelo value no formulário vindo o backend antes de ser tratado pelo array acima
  // profissoes: Array<{ text: string, value: string }> = [ { text: 'Desenvolvedor(a)', value: 'DESENVOLVEDOR(A)' },...]
  getProfissaoLabel(value?: string | null): string {
    if (!value) return '';
    return this.profissaoMap[value] || value;
  }

  // Edita: clona e abre offcanvas
  edit(c: Cadastro) { this.cadastroEdit = { ...c }; this.abrirOffcanvas(c); }

  // Exclui com msg de confirmação via SweetAlert2
  deleteById(c: Cadastro) {
    Swal.fire({
      title: 'Tem certeza que deseja deletar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    })
      .then(res => {
        if (res.isConfirmed && c.id) {
          this.cadastroService.delete(c.id).subscribe({
            next: msg => {
              Swal.fire({
                title: String(msg || 'Registro deletado'),
                icon: 'success', confirmButtonText: 'Ok'
              });
              // remove localmente e reaplica filtro
              this.lista = this.lista.filter(x => x.id !== c.id);
              this.filtrarCadastros(this.searchControl.value || '');
              this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
            }, error: err => {
              Swal.fire({
                title: err?.error?.message || 'Ocorreu um erro ao deletar',
                icon: 'error', confirmButtonText: 'Ok'
              });
            }
          });
        }
      });
  }
}
