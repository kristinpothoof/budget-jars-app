//
// GENERAL AREA FUNCTIONS
//
/*
class Area{
    constructor(name){
        this.name = name
        this.id = this.name.replace(/\s+/g, '')
        this.dom = document.querySelector(`#${this.id}`)
    }
    addListener(e,f){
        e.addEventListener('click',f)
    }
    toggleVisibility(){
        let x = document.querySelector(`#${this.id}`);
        x.classList.toggle('hidden')
    }
    clearInput(id){
        document.querySelector(`#${id}`).value = '';
    }
    notification(message){
        UIkit.notification(`<span uk-icon='icon: check'></span> ${message}`, {timeout: 3000});
    }
}

class AddJarArea extends Area {
    constructor(name){
        super(name);
    }

    //run when user clicks 'save' on a new jar
    addNewJar(event){
        event.preventDefault();

        //get user inputs
        let jarName = document.querySelector('#jarName').value;
        let jarTarget = document.querySelector('#jarTargetAmount').value;

        //create new Jar object in jarArea.listOfJars array
        jarArea.listOfJars.push(new Jar(jarName,jarTarget));
       
        //add new jar to local storage


        //append new jar to the DOM
        jarArea.listOfJars[jarArea.listOfJars.length-1].displayInDOM();

        //hide and clear 'New Jar' form
        document.querySelector('#jarName').value = '';
        document.querySelector('#jarTargetAmount').value = '';
        this.toggleVisibility();

        //alert change
        this.notification('Jar successfully added');
    }
}
*/

//
// 'ABOUT' AREA
//
let aboutArea = {
    showArea: function(){
        let aboutArea = document.querySelector('#about');
        aboutArea.classList.toggle('hidden')
    }
}


//
// ADD JAR AREA
//

let addJarArea = {

    //toggle visibility of 'add jar' area
    showArea: function(){
        let addJarArea = document.querySelector('#addJarArea');
        addJarArea.classList.toggle('hidden')
    },

    //run when user clicks 'save' on a new jar
    addNewJar: function(event){
        event.preventDefault();

        //get user inputs
        let jarName = document.querySelector('#jarName').value;
        let jarTarget = document.querySelector('#jarTargetAmount').value;

        //create new Jar object in jarArea.listOfJars array
        jarArea.listOfJars.push(new Jar(jarName,jarTarget));
       
        //add new jar to local storage


        //append new jar to the DOM
        jarArea.listOfJars[jarArea.listOfJars.length-1].displayInDOM();


        //hide and clear 'New Jar' form
        document.querySelector('#jarName').value = '';
        document.querySelector('#jarTargetAmount').value = '';
        addJarArea.showArea();
        updateJarArea.showArea();

        //alert change
        UIkit.notification("<span uk-icon='icon: check'></span> Jar successfully added", {timeout: 3000});
    }
}


//
// UPDATE JAR AREA
//
let updateJarArea = {
    dom: document.querySelector('#updateJarArea'),
    selectedJar: '',
    selectedJarDOM: document.querySelector('#selectedJar'),
    showArea: function(ev){

        // toggle show/hide section
        let updateJarAreaDOM = document.querySelector('#updateJarArea');
        updateJarAreaDOM.classList.toggle('hidden');
        totalsArea.updateTotals();
        
        if(ev !== undefined){
            let domArray = ev.path;
            if(typeof(domArray)=='object'){

                // get targeted ID from click event
                let arr = Object.values(domArray);
                for(let i=0;i<arr.length;i++){
                    if (arr[i].className =='jarRow'){
                        updateJarArea.selectedJar = arr[i].id;
                    }
                }
            }
        }
    },
    runTransaction: function(event){
        event.preventDefault();

        //get input
        let transactionAmount = document.querySelector('#transactionAmount').value

        //alert change
        UIkit.notification("<span uk-icon='icon: check'></span> Jar successfully updated", {timeout: 3000});
    },

    transactionAmount: function(){
        return document.querySelector('#transactionAmount').value
    },
    addFunds: function(event){
        event.preventDefault();
        let t = updateJarArea.transactionAmount()
        console.log(updateJarArea.selectedJar)
        
        jarArea.listOfJars.forEach((x,i) => {

            if(x.id==updateJarArea.selectedJar){
                x.addFunds(t);
                x.displayInDOM();
            }
        })
        
        //hide and clear 'Update Jar' form
        document.querySelector('#transactionAmount').value = '';
        updateJarArea.showArea();

        //update totals
        totalsArea.updateTotals();
    },
    removeFunds: function(event){
        event.preventDefault();
        let t = updateJarArea.transactionAmount()

        jarArea.listOfJars.forEach((x,i) => {

            if(x.id==updateJarArea.selectedJar){
                x.spendFunds(t);
                x.displayInDOM();
            }
        })

        //hide and clear 'Update Jar' form
        document.querySelector('#transactionAmount').value = '';
        updateJarArea.showArea();

        //update totals
        totalsArea.updateTotals();

    }
}

//
// JAR LIST DISPLAY AREA
//

let jarArea = {
    dom: document.querySelector('#jarArea'),
    listOfJars: [],
    loadJars: function(){

        //get jars from local storage

        //append each jar to the DOM
        this.listOfJars.forEach((x,i) => {
            
        })

        totalsArea.updateTotals();

    },
    
}

//
// TOTALS DISPLAY AREA
//
let totalsArea = {
    updateTotals: function(){
        let savedDOM = document.querySelector('#totalSaved');
        let targetDOM = document.querySelector('#totalTarget');

        let savedTotal = 0;
        let targetTotal = 0;

        jarArea.listOfJars.forEach(x => {
            savedTotal += Number(x.saved);
            targetTotal += Number(x.target);
        })
        savedDOM.innerHTML = "$" + savedTotal;
        targetDOM.innerHTML = "$" + targetTotal;
    }
}

//
// JAR CLASS
//

class Jar{
    constructor(name, target){
        this.name = name
        this.id = this.name.replace(/\s+/g, '')
        this.target = target
        this.saved = 0
        this.amountToSave = this.target - this.saved
        this.domTemplate = `<td><h3>${this.name}</h3></td><td>$${this.saved}</td><td>$${this.target}</td><td><i class="fa-solid fa-chevron-right"></i></td>`
    }
    addFunds(dollars){
        this.saved += Number(dollars)
        this.amountToSave -= Number(dollars)
        if(this.saved >= this.target){
            UIkit.notification(`<span uk-icon='icon: check'></span> You have met your ${this.name} goal!`, {status: 'success', timeout: 3000});
        }
        else{
            UIkit.notification("<span uk-icon='icon: check'></span> Jar successfully updated", {timeout: 3000});
        }
    }
    spendFunds(dollars){
        this.saved -= Number(dollars)
        this.amountToSave += Number(dollars)
        if(this.saved <= 0){
            UIkit.notification(`<span uk-icon='icon: check'></span> Your ${this.name} jar has $0 in it.`, {status: 'danger', timeout: 3000});
            this.saved = 0;
            this.amountToSave = this.target;
        }
        else{
            UIkit.notification("<span uk-icon='icon: check'></span> Jar successfully updated", {timeout: 3000});
        }
    }
    transferFunds(dollars,otherJar){
        this.spendFunds(dollars)
        otherJar.addFunds(dollars)
    }
    displayInDOM(){
        this.dom = document.querySelector(`#${this.id}`);
        if(this.dom===null){
            let tr = document.createElement('tr');
            tr.setAttribute('id',this.id);
            tr.setAttribute('class','jarRow');
            tr.setAttribute('onClick',updateJarArea.showArea(this.id))
            tr.innerHTML = this.domTemplate;
            jarArea.dom.appendChild(tr);
            tr.addEventListener('click', updateJarArea.showArea);
        }
        else{
            this.dom.innerHTML = `<td><h3>${this.name}</h3></td><td>$${this.saved}</td><td>$${this.target}</td><td><i class="fa-solid fa-chevron-right"></i></td>`;
        }

    }
    
}


//
// EVENT LISTENERS
//

let showAboutAreaButton = document.querySelector('#showAbout');
showAboutAreaButton.addEventListener('click',aboutArea.showArea);

let hideAboutAreaButton = document.querySelector('#closeAbout');
hideAboutAreaButton.addEventListener('click',aboutArea.showArea)

let showAddJarAreaButton = document.querySelector('#showAddJarArea');
showAddJarAreaButton.addEventListener('click',addJarArea.showArea);

let newJarButton = document.querySelector('#newJar');
newJarButton.addEventListener('click',addJarArea.addNewJar);

let addFundsButton = document.querySelector('#addFunds');
addFundsButton.addEventListener('click', updateJarArea.addFunds)

let removeFundsButton = document.querySelector('#removeFunds');
removeFundsButton.addEventListener('click', updateJarArea.removeFunds)