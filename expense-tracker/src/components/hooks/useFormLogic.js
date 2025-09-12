import * as Yup from 'yup'


export const loginFormSchema = Yup.object({
    name: Yup.string()
        .min(2,"Name Must Be Of Minimum Of 2 Charecters")
        .max(50,"Name Must Not Exceed the Length Of 50 Charecters")
        .matches(/^[a-zA-Z\s]+$/,"Name Can Only Contain Letter And Spaces")
        .required("Please Enter The Name"),
    password: Yup.string()
        .matches(/^\d{8}$/,"Password Must Be OF 8 Digits Only")
        .required("Please Enter The Password")
});
export const registerFormSchema = Yup.object({
    name: Yup.string()
        .min(2,"Name Must Be Of Minimum Of 2 Charecters")
        .max(50,"Name Must Be Of Maximum OF 50 Charecters")
        .matches(/^[a-zA-Z\s]+$/,"Name Can Only Contain Leter And Spaces")
        .required("Please Enter The Name"),
    email: Yup.string()
        .email("Invalid Input Credentials")
        .required("Please Enter The Email"),
    password: Yup.string()
        .matches(/^\d{8}$/,"Password Must Be Of 8 Digit Of Only")
        .required("Please Enter The Password"),
    roles: Yup.array()
        .of(Yup.string().oneOf(["USER","ADMIN","MANAGER"],"Invalid Role"))
        .min(1,"Atleast One Role Is required")
})
export const useFormLogic = () =>{

}