const  fieldEntry = document.getElementById('password');

const showPassword = () =>{


    if(fieldEntry.type === 'password'){
    
        fieldEntry.type = 'text';
    }else{
    
        fieldEntry.type  = 'password';
    }

};
