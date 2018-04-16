import React, { Component } from 'react';
import {debounce} from 'throttle-debounce';
import {checkSearch} from'./actions/starwaraction';
import StarwarStores from './stores/starwarstores';
class SearchPage extends Component {
    constructor(props){
        super(props);
        this.state={
            planetName:'',
            planets:[],
            gotPlanets:true,
            msg:''
        }
        this.checkPlanets = debounce(2000, this.checkPlanets);
        this._getstarwarstores = this._getstarwarstores.bind(this);
        if(!sessionStorage.getItem('username')){
             this.props.history.replace('/');
        }
    }
    componentWillMount(){
        StarwarStores.on('change',this._getstarwarstores);
    }
    
    componentWillUnmount(){
         StarwarStores.removeListener('change',this._getstarwarstores);
    }
    planetChange(e) {
        this.setState({
            planetName:e.target.value,
            gotPlanets:false
        })
        this.checkPlanets(e.target.value);
    }
    checkPlanets(){
        let {planetName}=this.state;
        let planets = [];
        checkSearch(`planets/?search=${planetName}`,'planet',planets);
    }
    _getstarwarstores(type){
        if(type==='PLANET_RESULT'){
            let planets = StarwarStores.getPlanets();
            this.setState({
                planets,
                gotPlanets:true,
                msg:''
            })
        }else if(type==='TIME_LAPSED'){
            this.setState({
                gotPlanets:true,
                planets:[],
                msg:'Maximum hit per minute is completed. Please wait for sometime and then make a request.'
            })
        }
    }
    getPlanets(){
        let {planets} = this.state;
        let prevPopluation = 0;
        let index = 0;
        let fontInc = 0;
        return planets.map((p,i)=>{
            let presentPopulation = p.population==="unknown" ? 0 : parseInt(p.population);
            if(i==0){
                prevPopluation=p.population==="unknown" ? 0 : parseInt(p.population)
            }else{
                if(presentPopulation==prevPopluation){
                    fontInc = fontInc;
                }else{
                    fontInc++;
                }
                prevPopluation=presentPopulation;
            }
            return ( <div className="planetItem"
                            key={p.name} 
                            style={{fontSize:`${12+fontInc}px`}}>
                        {p.name},{presentPopulation}
                    </div>
            )
        })
    }
    render() {
        let {gotPlanets,msg}= this.state;
        return (
            <div className="main-cnt">
                <div className="label-header"> Search Planets </div>
                <div className="error-message">{msg}</div>
                <input 
                        className="planetSearch"
                        type="text" 
                        onKeyUp={this.planetChange.bind(this)}
                />
                <div className="planetContainer">

                    {!gotPlanets ? <div className="loader"></div> : this.getPlanets()}
                </div>
            </div>
        )
    }
}

export default SearchPage;
