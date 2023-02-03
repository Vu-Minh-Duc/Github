// Đối thượng Validator
//con may ngao
function Validator( options) {
 var selectorRules={};
//Hàm thực hiện validate 
 function validate(inputElement,rule){
    var errorMessage;
    var errorElement=inputElement.parentElement.querySelector(options.errorSelector);        
    //lấy ra các rules của selector  
    var rules=selectorRules[rule.selector];
      //lặp qua từng rule & kiểm tra
      // Nếu có lỗi dừng việc kiêm tra
      for (var i=0;i<rules.length;i++){
        errorMessage=rules[i](inputElement.value);
           if (errorMessage) break;
    }  
   
   
     if (errorMessage){
   errorElement.innerText=errorMessage;
    inputElement.parentElement.classList.add('invalid');
} else {errorElement.innerText='';
          inputElement.parentElement.classList.remove('invalid');      
        }
        return !errorMessage                                                                 
        }
// lấy element của form cần validate
var formElement=document.querySelector(options.form);
 if (formElement){
    // khi submit form
           formElement.onsubmit=function (e) {
            e.preventDefault(); 
            var isFormValid=true;
            // Lặp qua từng rules và validate
            options.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selector);
                 var isValid=validate(inputElement, rule);
                 if (!isValid) {
                    isFormValid= true;
                 }
            });
            

             
             if (isFormValid){
            if (typeof options.onSubmit === 'function') {
                var Enableinputs=formElement.querySelector('[name]');
                var formValues=Array.from(Enableinputs).reduce(function(values,input) {
                 return values[input.name]=input.value && values ;
                },{});
            options.onSubmit(formValues);
            console.log(formValues);
            }
        
            }


        }
    };


           // lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,.....)
     options.rules.forEach(function(rule){
        // lưu lại các rules cho mỗi input
        if (Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test);
         } else {
            selectorRules[rule.selector]=[rule.test];
         }
        
         var inputElement=formElement.querySelector(rule.selector);
        
         if (inputElement) {
            // Xử lý trường hợp blur khỏi input
             inputElement.onblur=function () {
            // value:inputElement.value
            //test func:rule.test
            validate(inputElement, rule);
           // đã tách code thành function phía trên 
        } 
        // Xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput= function() {
            var errorElement=inputElement.parentElement.querySelector('.form-message');
            errorElement.innerText='';
            inputElement.parentElement.classList.remove('invalid');
        }
     }
 });}

// Định nghĩa rules
// nguyên tắc của các rules:
//1.Khi có lỗi =>trả ra mesage lỗi
// 2. khi hợp lệ => không trả ra cái gf cả ( undefined) 
Validator.isRequired=function(selector){
return {selector:selector,
 test: function(value) {
    // dùng trim loại bỏ các dấu cách
    return value.trim() ? undefined:'Vui lòng nhâp trường này' 
 }
};
}
Validator.isEmail=function(selector) {
    return {selector:selector,
        test: function(value) {
           var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
             return regex.test(value) ? undefined:'trường này phải là  email';
        }
       };
}
Validator.minLength=function(selector,min) {
    return {selector:selector,
        test: function(value) {
           var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
             return value.length >= min ? undefined:`vui lòng nhập tối thiểu ${min} kí tự`;
        }
       };
}
Validator.isConfirmed= function(selector,getCofirmValue,message) {
    return {
        selector:selector,
        test:function(value) {
            return value === getCofirmValue () ? undefined: message || 'Giá trị nhập không chính xác';
        }
    }
}