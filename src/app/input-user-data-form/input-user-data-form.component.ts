import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})
export class InputUserDataFormComponent implements OnInit {

  registered = false;
  submitted = false;
  userForm: FormGroup;
  serviceErrors: any;
  guid: string;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { 
    this.http.get('/api/v1/generate_uid').subscribe((data:any) => {
      this.guid = data.guid;
    },
    error => {
      console.log("There was an error generating the proper GUID on the server", error);
    });
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      fname : ['', Validators.required],
      lname : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      zip : ['', [Validators.required, Validators.pattern('^[0-9]{6}(?:-[0-9]{5})?$')]],
      password : ['', [Validators. required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]]
    });
  }

  onSubmit(){
    this.submitted = true;
    if(this.userForm.invalid){
      return;
    }
    else{
      let data: any = Object.assign({ guid: this.guid }, this.userForm.value);
      this.http.post('/api/v1/customer', data).subscribe((data: any) => {
        let path = '/user' + data.customer.uid;
        this.router.navigate([path]);
      },
      error => {
        this.serviceErrors = error.error.error;
      });
      this.registered = true;
    }
      
  }

  invalidFirstName(){
    return (this.submitted && (this.serviceErrors.fname != null || this.userForm.controls.fname.errors != null));
  }

  invalidLastName(){
    return (this.submitted && (this.serviceErrors.lname != null ||this.userForm.controls.lname.errors != null));
  }

  invalidEmail(){
    return (this.submitted && (this.serviceErrors.email != null ||this.userForm.controls.email.errors != null));
  }

  invalidZipcode(){
    return (this.submitted && (this.serviceErrors.zip != null ||this.userForm.controls.zip.errors != null));
  }

  invalidPassword(){
  	return (this.submitted && (this.serviceErrors.password != null ||this.userForm.controls.password.errors != null));
  }
}
