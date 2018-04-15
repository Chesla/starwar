import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";
class StarwarStores extends EventEmitter{
	constructor(){
		super();
		this.planets=[];
	}
	_isValid(count,people,input){
		if(count===0){
			this.emit('change','RESULT_INVALID')
		}
		else{
			let validResult = false;
			for(let i=0;i<people.length;i++){
				if(people[i].birth_year===input.password && people[i].name===input.name){
					validResult = true;
				}
			}
			if(validResult){
				sessionStorage.setItem('username',input.name);
				this.emit('change','RESULT_VALID');
			}else{
				this.emit('change','RESULT_INVALID');
			}
		}
	}
	_planets(count,planet){
		planet.sort(function(a,b){
			var aPop = a.population==="unknown" ? 0 : parseInt(a.population);
			var bPop = b.population==="unknown" ? 0 : parseInt(b.population);
			if (aPop < bPop)
		    	return -1;
		  	if (aPop > bPop)
		    	return 1;
		  	return 0;
		})

		this.planets = planet;
		this.emit('change','PLANET_RESULT')
	}
	getPlanets(){
		return this.planets || [];
	}
	_handleActions(action){
		switch(action.type){
			case 'PERSON_DETAILS' : {
				this._isValid(action.count,action.people,action.inputValue);
				break;
			}
			case 'PLANET_DETAILS' :{
				this._planets(action.count,action.planet);
				break;
			}
			case 'TIME_LAPSED':{
				this.planets = [];
				this.emit('change','TIME_LAPSED');
				break;
			}
		}
	}
}

const starwarStores = new StarwarStores();
dispatcher.register(starwarStores._handleActions.bind(starwarStores));
export default starwarStores;
