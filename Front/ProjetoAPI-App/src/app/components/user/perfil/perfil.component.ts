import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {


  userUpdate = {} as UserUpdate;
  form!: FormGroup;
    
      get f(): any {
        return this.form.controls;
      }

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService
            ) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuário Carregado.', 'Sucesso!')
      },
      (error: any) => {
        console.log("Erro completo:", error);
        this.toastr.error('Usuário não carregado', 'Erro!');
        this.router.navigate(['/dashboard']);
      }
    ).add(() => this.spinner.hide());
  }


  public validation(): void {

        const formOptions: AbstractControlOptions = {
        validators: ValidatorField.MustMatch('password', 'confirmarPassword')
        };
    
    this.form = this.fb.group({
      userName: [''],
      titulo: ['NaoInformado', [Validators.required]],
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      funcao: ['NaoInformado', [Validators.required]],
      descricao: ['', [Validators.required]],
      password: ['', [Validators.nullValidator, Validators.minLength(4), Validators.maxLength(15)]],
      confirmarPassword: ['', Validators.nullValidator],
    }, formOptions)
  }

  onSubmit(): void {
      this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = { ...this.form.value}
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toastr.success('Usuario atualizado.', 'Sucesso!'),
      (error: any) => {
        this.toastr.error(error.error);
        console.log("Erro completo:", error);
      }

    ).add(() => this.spinner.hide());
  }

  public resetForm(event: any): void{
    event?.preventDefault();
    this.form.reset();
  }

}
