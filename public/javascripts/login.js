function change_login_ui()
{
    var language = document.getElementById('language');
    var form_head = document.getElementById('form-head');
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var btn_login = document.getElementById('id_btn_login');
    var label_remember = document.getElementById('label_remember');
    var label_message = document.getElementById('id_message');
    if(language.value=="zh-cn"){
        form_head.innerHTML = "业务控制平台";
        username.placeholder = "用户名";
        password.placeholder = "密码";
        btn_login.innerHTML = "登陆";
        label_message.innerHTML = "";
        label_remember.innerHTML = "<input type='checkbox' value='remember-me'> 记住我";
    }
    else if(language.value=="en"){
        form_head.innerHTML = "Service Control Platform";
        username.placeholder = "username";
        password.placeholder = "Password";
        btn_login.innerHTML = "Sign in";
        label_message.innerHTML = "";
        label_remember.innerHTML = "<input type='checkbox' value='remember-me'> Remember me";
    }

}