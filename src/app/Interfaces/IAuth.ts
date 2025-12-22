

export interface IRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ApiResponseAuth{
    message:string;
    displayName:string;
    email:string;
    token:string;
    refreshToken:string;
  

}
export interface IForgotPassword{
    email:string
}

export interface IResetPassword{
    newPassword:string,
    token:string,
    email:string
}

export interface IConfirmEmail{
    token:string,
    userId:string
}
