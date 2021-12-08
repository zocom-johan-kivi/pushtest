const API_URL = 'https://api.jsonbin.io/v3/b/61a5ff2801558c731ccb769f',
      API_KEY = '$2b$10$n5D6fyvlqrvS00B/Icmir.Rl7YkX6E8YTw3qjTW2ns8Mmb41EFa2a',
      PUSH_KEY = 'BJMifOd0_wibi5pBE5iYjmWERxNnZ6dXCceNxJTzLNV0farOZZ_pNOW3-KfrXPQpDuJIZcqwWSgV5sHONR24NMg'//'BOZGoy3XBimNMwTFc08sctwfCsKAkZYb3LDUCx39ecNv4KeBkIDBIfvi0IniaCLG2KTWpxxBYdV8H_tUFbj_RSs';

window.addEventListener('load', async () => {
    if('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('serviceworker.js');
        } catch(err) {
            console.error('Whooopsie!', err)
        }
    }
});

const App = {
    todos: [],
    el: {
        button: document.querySelector('button#add'),
        todos: document.querySelector('.todos'),
        input: document.querySelector('input'),
        subscribe: document.querySelector('button#subscribe'),
    },
    async addTodo(){
        
        let text = this.el.input.value;
        if(text.length){
            
            this.todos.push({
                id: parseInt(this.todos.length +1),
                text: text,
                done: false
            })

            await this.setData();
        }
    },
    render(){
        this.el.todos.innerHTML = '';

        this.todos.forEach(todo => {
            this.el.todos.insertAdjacentHTML('beforeend', `<li>${todo.text}</li>`)
        })

    },
    async getData(){
        
        if(localStorage.getItem(['todo'])){
            this.todos = JSON.parse(localStorage.getItem('todo')).todos;
            this.render();
        }

        try {

            let resp = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json',
                    'X-Master-Key' : API_KEY
                }
            });

            let data = await resp.json();  
            this.todos = data.record.todos;

        } catch(err) {
            console.error(err)
        }
    },
    async setData(){

        localStorage.setItem('todo', JSON.stringify({ todos: this.todos }));

        try {

            await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'X-Master-Key' : API_KEY
                },
                body: JSON.stringify({ todos: this.todos})
            });

        } catch(err) {
            console.error(err);
        }
    },
    /* subscribe(){
        Notification.requestPermission(async (status) => {
            console.log('Notification permission status:', status);
        
        })
    },*/
    async subscribe(){
        await Notification.requestPermission().then(g => console.log(g));
        let sw = await navigator.serviceWorker.ready;
        let subState = await sw.pushManager.getSubscription();
        console.log(subState)
        new Notification('New insult', { body: 'ello' });
        let push = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: PUSH_KEY
        })
        console.log(JSON.stringify(push));
    },
    async init(){

        this.el.button.addEventListener('click', () => {
            this.addTodo();
            this.el.input.value = '';
            this.render();
        });

        this.el.subscribe.addEventListener('click', () => {
            this.subscribe();
        });

        await this.getData();
    
        this.render();
       }
};

App.init()
