import dispatcher from "../dispatchers/dispatcher";
const API = 'https://swapi.co/api/';
let counter = 0;
let startTime = new Date();
export function _checkSearch(query,type,inputValue){
    let userName = sessionStorage.getItem('username');
    let search = false;
   
    let time = Math.floor((new Date()- startTime)/(1000 * 60));
    if(time===1){
        counter=0;
    }
    if(counter>=5 && userName==='Luke Skywalker' && type==='planet'){
        search = true;
    }else if(counter<5 && type==='planet'){
        search = true;
    }else if(type!=='planet'){
         search = true;
    }
    if(search){
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                
                if(type==='people'){
                    dispatcher.dispatch({
                        count:data.count,
                        people:data.results,
                        inputValue:inputValue,
                        type: 'PERSON_DETAILS',
                    }); 
                }else if(type==='planet'){
                    
                    if(inputValue.length===0){
                        if(counter===0){
                            startTime = new Date();
                        }
                        counter++;
                    }
                    inputValue = [...inputValue ,...data.results];
                    if(data.next){
                        _checkSearch(data.next.split("https://swapi.co/api/")[1],type,inputValue);
                    }else{
                        dispatcher.dispatch({
                            count:data.count,
                            planet:inputValue,
                            type: 'PLANET_DETAILS',
                        }); 
                    }
                    
                }
            }).catch(error=>{
                console.log('error',error);
            });
    }else{
        dispatcher.dispatch({
            type: 'TIME_LAPSED',
            planet:[], //if all the search results has to be empty.
        }); 
    }
}