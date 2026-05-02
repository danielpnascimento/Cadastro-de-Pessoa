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
  private offcanvas!: Offcanvas;
  isOffcanvasOpen = false;
  pendingReload = false;

  // Dados
  lista: Cadastro[] = [];
  listaFiltrada: Cadastro[] = [];
  cadastroEdit: Cadastro = new Cadastro();

  // Paginação
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  // Busca
  searchControl = new FormControl('');
  noResults = false;

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

  profissaoMap: { [key: string]: string } = {};
  constructor(private cadastroService: CadastroService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.profissaoMap = Object.fromEntries(this.profissoes.map(p => [p.value, p.text]));
    this.loadCadastros();

    const offcanvasEl = document.getElementById('offcanvasCadastro');
    if (offcanvasEl) {
      this.offcanvas = new Offcanvas(offcanvasEl, { backdrop: true, keyboard: true, scroll: false });

      offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        this.isOffcanvasOpen = false;
        const backdrop = document.querySelector('.offcanvas-backdrop');
        backdrop?.remove();
        if (this.pendingReload) { this.pendingReload = false; this.loadCadastros(); }
      });
    }

    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(v => {
      this.filtrarCadastros(v || '');
      this.currentPage = 1;
      this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
      this.noResults = this.listaFiltrada.length === 0 && String(v || '').trim() !== '';
    });

    this.cadastroService.changed.subscribe(() => {
      if (this.isOffcanvasOpen) { this.pendingReload = true; return; }
      this.loadCadastros();
    });
  }

  loadCadastros(): void {
    this.cadastroService.listAll().subscribe({
      next: dados => {
        const now = Date.now();
        this.lista = (dados || []).map((c, i) => ({ ...(c as any), rowKey: now + i }));
        this.listaFiltrada = [...this.lista];
        this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
        try { this.cd.detectChanges(); } catch { }
      },
      error: () => Swal.fire({ title: 'Ocorreu um erro ao listar cadastros', icon: 'error', confirmButtonText: 'Ok' })
    });
  }

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

  getItemsPaginated() {
    const pSize = Number(this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    return this.listaFiltrada.slice(start, start + this.pageSize);
  }
  get totalPagesArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  trackById(_index: number, item: Cadastro) {
    return (item as any)?.rowKey ? `${item.id}_${(item as any).rowKey}` : `${item.id}`;
  }
  changePage(page: number) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }

  onPageSizeChange() {
    this.pageSize = Number(this.pageSize);
    this.currentPage = 1;
    this.totalPages = Math.max(1, Math.ceil(this.listaFiltrada.length / this.pageSize));
    try { this.cd.detectChanges(); } catch { }
  }

  get totalItens(): number {
    return this.lista.length;
  }

  abrirOffcanvas(c?: Cadastro) { this.cadastroEdit = c ? { ...c } : new Cadastro(); this.isOffcanvasOpen = true; this.offcanvas?.show(); }
  fecharOffcanvas() { this.offcanvas?.hide(); this.isOffcanvasOpen = false; if (this.pendingReload) { this.pendingReload = false; this.loadCadastros(); } }

  retornoCadastro(cadastro: Cadastro) {
    if (!cadastro || !cadastro.id) { this.loadCadastros(); this.fecharOffcanvas(); return; }

    const foto = cadastro.foto ? (String(cadastro.foto).startsWith('data:')
      ? cadastro.foto : `data:image/jpeg;base64,${cadastro.foto}`) : null;
    const updated = { ...(cadastro as any), foto, rowKey: Date.now() } as Cadastro;

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
        }, error: () => { }
      });
    }, 0);
  }

  getProfissaoLabel(value?: string | null): string {
    if (!value) return '';
    return this.profissaoMap[value] || value;
  }

  edit(c: Cadastro) { this.cadastroEdit = { ...c }; this.abrirOffcanvas(c); }

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
