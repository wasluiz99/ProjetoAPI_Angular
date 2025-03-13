import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
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
    private spinner: NgxSpinnerService
    
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

}
