import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;
  public eventosFiltrados: Evento[] = [];
  public eventos: Evento[] = [];

  public isCollapsed = false;
  public widthImg = 150;
  public marginImg = 2;
  private _listFilter = '';

  constructor(private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    
  ) { }


  public get listFilter(){
    return this._listFilter
  }

  public set listFilter(value: string){
    this._listFilter = value
    this.eventosFiltrados = this.listFilter ? this.EventFilter(this.listFilter) : this.eventos;
  }

  public EventFilter(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: {tema: string; local: string;}) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 
      || evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();   
  }

  public getEventos(): void{ 
    this.eventoService.getEventos().subscribe({
      next: (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos', 'Erro!')
      },
      
      complete: () => this.spinner.hide()
    });    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com Sucesso', 'Deletado!');
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
