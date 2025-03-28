import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@environments/environment';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';
  loteAtual = {id: 0, nome: '', indice: 0};
  imagemURL ='assets/upload.png'
  file: File;

  get modoEditar(): boolean {
    return this.estadoSalvar == 'put';
  }

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any{
    return {    
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a', 
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  get bsConfigLote(): any{
    return {    
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY', 
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private ActivatedRouter: ActivatedRoute,
              private eventoService: EventoService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router,
              private loteService: LoteService,
              private modalService: BsModalService) 
  {
    this.localeService.use('pt-br')
   
  }

  public carregarEvento(): void {
    this.eventoId = +this.ActivatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId != null && this.eventoId != 0){
      
      this.spinner.show();

      this.estadoSalvar = 'put';

      
      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = {... evento};
          this.form.patchValue(this.evento);
          if(this.evento.imagemURL != ''){
            this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
          //this.carregarLotes();
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
          console.error(error);
        },
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar lotes', 'Erro!');
        console.error(error);
      }

    ).add(() => this.spinner.hide());
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]], 
      local: ['', [Validators.required, Validators.minLength(5)]], 
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]], 
      imagemURL: [''], 
      telefone: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([])
    });
  }

   adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
   }

   criarLote(lote: Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, [Validators.required]],
      preco: [lote.preco, [Validators.required]],
      dataInicio: [lote.dataInicio, [Validators.required]],
      dataFim: [lote.dataFim, [Validators.required]],
      quantidade: [lote.quantidade, [Validators.required]]
    });
   }

   public retornaTituloLote(nome: string): string{
     return nome == null || nome == ''? 'Nome do lote' : nome
   }

  public resetForm(event: any): void{
    event?.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl | null): any {
    return {'is-invalid': campoForm?.errors && campoForm?.touched}
  }

  public salvarEvento(): void {
     if(this.form.valid){
      this.spinner.show();

      this.evento = (this.estadoSalvar == 'post') 
                ? {...this.form.value}
                : { id: this.evento.id, ...this.form.value};

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com Sucesso.', 'Sucesso!');
          //this.estadoSalvar = 'put';
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`])
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento', 'Erro!');
        },
        () => this.spinner.hide(),
      );   
    }
  }

  public salvarLotes(): void {
    this.spinner.show();
    if(this.form.controls.lotes.valid) {
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe (
        () => {
          this.toastr.success('Lotes salvos com Sucesso.', 'Sucesso!');
          //this.lotes.reset();
        },
        (error: any) => {
          this.toastr,error('Erro ao tentar salvar lotes.', 'Erro!');
          console.error(error);
        }
      ).add(() => this.spinner.hide());

    }
  }

  public deletarLote(template: TemplateRef<any>, indice: number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;


    this.modalRef = this.modalService.show(template, {class:'modal-sm'} );
    //this.lotes.removeAt(indice);
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success('Lote deletado com Sucesso.', 'Sucesso!');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}.`, 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }

  onFileChange(ev: any): void{
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImage();
  }

  uploadImage(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {this.carregarEvento();
        this.toastr.success('Imagem atualizada com Sucesso.', 'Sucesso!')
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar a imagem', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }
}
