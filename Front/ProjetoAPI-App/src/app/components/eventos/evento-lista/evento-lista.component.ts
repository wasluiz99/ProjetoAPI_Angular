import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResul, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { fileURLToPath } from 'url';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;
  public eventos: Evento[] = [];
  public eventoId = 0;
  public eventoTema = '';
  public pagination = {} as Pagination;

  public isCollapsed = false;
  public widthImg = 150;
  public marginImg = 2;

  constructor(private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    
  ) { }

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public EventFilter(evt: any): void{

    if(this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          ).subscribe(
            (paginatedResult: PaginatedResul<Evento[]>) => {
              this.eventos = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
           (error: any) => {
              this.spinner.hide();
              this.toastr.error('Erro ao carregar os eventos', 'Erro!')
            },
          ).add(() => this.spinner.hide()); 
        }
      )
    }
    this.termoBuscaChanged.next(evt.value); 
  }

  public ngOnInit(): void {
    this.pagination = {currentPage: 1, itemsPerPage: 3, totalItems: 1} as Pagination;
    this.carregarEventos();   
  }

  public mostraImagem(imagemURL: string): string {
    return imagemURL != ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/semImagem.png';
  }

  public carregarEventos(): void{ 
    this.spinner.show();

    this.eventoService.getEventos(
      this.pagination.currentPage,
      this.pagination.itemsPerPage).subscribe(
      (paginatedResult: PaginatedResul<Evento[]>) => {
        this.eventos = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
     (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos', 'Erro!')
      },
    
    ).add(() => this.spinner.hide());  
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

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

}
