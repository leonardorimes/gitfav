export class GitHubUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}` 

        return fetch(endpoint)
        .then(data => data.json()) 
        .then(({name, login, public_repos, followers}) =>({
            name,
            login,
            public_repos,
            followers
        }));
    }
}

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root);
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@gitfav')) || []
    }

    save(){
        localStorage.setItem('@gitfav', JSON.stringify(this.entries))
    }

    async add(username){

        try{
            const user = await GitHubUser.search(username);
            

            if(user.login === undefined){
                throw new Error("Usuário não encontrado")
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }catch(err){
           
            alert(err.message)
        }
    }

    delete(user){
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries;
        this.update()
        this.save()
    }


}


export class FavoritesView  extends Favorites {

    constructor(root){
        super(root)
        this.tbody = this.root.querySelector('table tbody');

        this.update()
        this.onadd()
        this.checkEntries()
    }

    onadd(){
        const addButton = document.querySelector('.header__form__btn');
        addButton.onclick = () => {
            this.checkEntries()
            const { value } =  this.root.querySelector('.header__form__input')
            this.add(value)
        }
    }

 

    update(){
        this.removeAllTr();
            this.entries.forEach( user => {
                const row = this.createRow()

                row.querySelector('.user img').src = `https://github.com/${user.login}.png`
                row.querySelector('.user img').alt = `Imagem de ${user.name}`
                row.querySelector('.user p').textContent = user.name
                row.querySelector('.followers').textContent = user.followers

                row.querySelector('.remove').onclick = () => {
                   
                    const isOK = confirm('Are you sure you want to remove this user?')
                    if(isOK) {
                        this.delete(user)
                        this.checkEntries()
                        
                    }
                }
                
                this.tbody.append(row)
                

            })
        }
            createRow(){

                const tr = document.createElement('tr');
        
                tr.innerHTML =    `
                
                <td class="user">
                    <img src="https://github.com/leonardorimes.png" alt="Imagem de leonardorimes">
                    <a href="https://github.com/leonardorimes" target="_blank">
                        <p>jeff bala</p>
                        
                    </a>
                </td>
                <td class="repositories">
                    5
                </td>
                <td class="followers">
                    1
                </td>
                <td> <button class="remove">&times; </button> </td>`
        
                return tr
            }

            removeAllTr(){
                this.tbody.querySelectorAll('tr')
                .forEach((tr) => {
                    tr.remove();
                })
            }

            checkEntries(){
                if(this.entries.length == 0){
                    const noFavorites = document.querySelector(".noFavorites")
                    noFavorites.classList.toggle("disabled")
                }
            }
    }
