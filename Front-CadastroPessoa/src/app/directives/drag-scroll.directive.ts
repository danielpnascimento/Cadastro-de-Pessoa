import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDragScroll]'
})
export class DragScrollDirective {
  // Estado interno
  private isDown = false;     // true enquanto o usuário estiver "arrastando"
  private startX = 0;         // posição X inicial do clique/touch (relativa ao elemento)
  private startY = 0;         // posição Y inicial do clique/touch (relativa ao elemento)
  private scrollLeft = 0;     // scrollLeft do elemento no início do arraste
  private scrollTop = 0;      // scrollTop do elemento no início do arraste

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Visual hint: cursor e estilos iniciais para indicar que o elemento é arrastável.
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    // Garante que o container tenha overflow disponível para rolar
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'auto');
    // Evita seleção de texto durante o arraste
    this.renderer.setStyle(this.el.nativeElement, 'user-select', 'none');
    // opcional: this.renderer.setStyle(this.el.nativeElement, 'touch-action', 'pan-y'); // evita navegação indesejada em alguns casos
  }

  // MOUSE DOWN → inicia arraste
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    // calcula posição inicial relativa ao elemento
    this.startX = event.pageX - this.el.nativeElement.offsetLeft;
    this.startY = event.pageY - this.el.nativeElement.offsetTop;
    // registra scroll inicial para usar de base no cálculo
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.scrollTop = this.el.nativeElement.scrollTop;
    // altera cursor enquanto arrastando
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
  }

  // mouseup / mouseleave / blur -> finaliza arraste (sem distinção)
  @HostListener('mouseleave')
  @HostListener('mouseup')
  @HostListener('blur')
  onMouseUpLeave() {
    this.isDown = false;
    // restaura cursor
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  // MOUSE MOVE -> enquanto isDown true, calcula deslocamento e aplica scroll
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return; // só processa se estiver arrastando
    event.preventDefault();   // evita seleção/arrasto do browser
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const y = event.pageY - this.el.nativeElement.offsetTop;

    // walk = deslocamento * fator de sensibilidade (0.85 mais suave)
    const walkX = (x - this.startX) * 0.85; // Velocidade horizontal
    const walkY = (y - this.startY) * 0.85; // Velocidade vertical

    // aplica scroll invertendo o walk (para comportamento "arrastar o conteúdo")
    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.el.nativeElement.scrollTop = this.scrollTop - walkY;
  }

  // TOUCH START -> inicia arraste por toque
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.isDown = true;
    this.startX = touch.pageX - this.el.nativeElement.offsetLeft;
    this.startY = touch.pageY - this.el.nativeElement.offsetTop;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.scrollTop = this.el.nativeElement.scrollTop;
  }

  // TOUCH END -> finaliza arraste por toque
  @HostListener('touchend')
  onTouchEnd() {
    this.isDown = false;
  }

  // TOUCH MOVE -> comport. similar ao mousemove, com sensibilidade diferente (1.5)
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isDown) return;
    event.preventDefault(); // evita scroll nativo enquanto arrasta
    const touch = event.touches[0];
    const x = touch.pageX - this.el.nativeElement.offsetLeft;
    const y = touch.pageY - this.el.nativeElement.offsetTop;

    const walkX = (x - this.startX) * 1.5; // toque costuma ser menos preciso -> fator maior
    const walkY = (y - this.startY) * 1.5;

    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.el.nativeElement.scrollTop = this.scrollTop - walkY;
  }
}

//Funciona para arrastar a tabela no listagem componente no eixo y e x
