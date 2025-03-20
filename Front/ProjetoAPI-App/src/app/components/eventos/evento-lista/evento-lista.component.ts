import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;
  public eventosFiltrados: Evento[] = [];
  public eventos: Evento[] = [];
  public eventoId = 0;
  public eventoTema = '';

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
    this.carregarEventos();   
  }

  public carregarEventos(): void{ 
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

  openModal(event: any, template: TemplateRef<any>, eventoId: number, eventoTema: string) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.eventoTema = eventoTema;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        this.toastr.success('O Evento foi deletado com Sucesso', 'Deletado!');
        this.carregarEventos();
        
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoTema}`, 'Erro!');
      },
    ).add(() => this.spinner.hide());

    
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

}
