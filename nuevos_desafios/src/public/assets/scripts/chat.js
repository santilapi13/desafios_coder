const socket = io()

let user = ''
let divMensajes = document.getElementById('messages')
let inputMensajes = document.getElementById('msg')

inputMensajes.addEventListener('keyup', evt => {
    if (evt.key === 'Enter' && evt.target.value.trim() !== '') {
        socket.emit('newMessage', {
            user, 
            message: evt.target.value.trim()
        });
        evt.target.value='';
        inputMensajes.focus();           
    }
});

Swal.fire({
    title: "Who are you?",
    input: "text",
    text: "Insert your nickname",
    inputValidator: (value) => {
        return !value && "Nickname is required"
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value;
    document.title = user;
    inputMensajes.focus();         

    socket.emit('id', user);

    socket.on('welcome', messages => {
        let txt=''
        messages.forEach(msg => {
            txt+=`<p class="msg"><strong>${msg.user}</strong>:<i>${msg.message}</i></p><br>`
        })

        divMensajes.innerHTML=txt
        divMensajes.scrollTop=divMensajes.scrollHeight;
    })

    socket.on('newUser',name => {
        Swal.fire({
            text:`${name} has connected`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on('messageRecieved', msg => {
        let txt=''
        txt+=`<p class="msg"><strong>${msg.user}</strong>:<i>${msg.message}</i></p><br>`

        divMensajes.innerHTML += txt
        divMensajes.scrollTop = divMensajes.scrollHeight;

    })

    socket.on('userDisconnected', user => {
        Swal.fire({
            text: `${user.user} has left`,
            toast: true,
            position: "top-right"
        })
    })

});