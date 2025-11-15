import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* Componentes */
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListagemComponent } from './components/listagem/listagem.component';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { DragScrollDirective } from './directives/drag-scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    ListagemComponent,
    CadastroComponent,
    DragScrollDirective
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    CommonModule

  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
