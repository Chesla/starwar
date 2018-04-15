import React, { Component } from 'react';

import './App.css';
import {checkSearch} from'./actions/starwaraction';
import StarwarStores from './stores/starwarstores';
class App extends Component {
    constructor(props){
        super(props);
        this.state={
            userName:'',
            password:'',
            message:''
        }
        this.checkSubmit = this.checkSubmit.bind(this);
        this._getstarwarstores = this._getstarwarstores.bind(this);

    }
    componentWillMount(){
        StarwarStores.on('change',this._getstarwarstores);
    }
    
    componentWillUnmount(){
         StarwarStores.removeListener('change',this._getstarwarstores);
    }
    checkSubmit(){
        let {userName,password}=this.state;
        if(userName==='' || password===''){
            this.setState({
                message:'Please provide User Name and Password'
            })
            return false;
        }
        checkSearch(`people/?search=${userName}`,'people',{name:userName,password:password})
    }
    _getstarwarstores(type){
        if(type==='NO_RESULT'){
            this.setState({
                message:'User is not valid'
            })
        }else if(type==='RESULT_VALID'){
            this.setState({
                message:''
            })
            this.props.history.push('/search');
        }else if(type==='RESULT_INVALID'){
            this.setState({
                message:'User and Password doesnot match.'
            })
        }
    }
    render() {
        let {userName,password,message}=this.state;
        return (
            <div className="main-cnt">
                <div className="login-form-hd"> Welcome to Star Wars </div>
                <div className="login-form">
                    <div className="login-cnt">
                        <div className="label-header">
                            User Name
                        </div>
                        <input 
                            className="login-search"
                            type="text" 
                            value={userName}
                            onChange={(event)=>{
                                this.setState({
                                    userName:event.target.value
                                })
                            }
                        }/>
                    </div>
                    <div className="login-cnt">
                        <div className="label-header">
                            Password
                        </div>
                        <input 
                            className="login-search"
                            type="password" 
                            value={password}
                            onChange={(event)=>{
                                this.setState({
                                    password:event.target.value
                                })
                            }
                        }/>
                    </div>
                    <button className="login-btn" 
                        onClick={this.checkSubmit}>
                        Login
                    </button>
                </div>
                <div className="error-message" >{message}</div>
            </div>
        )
    }
}

export default App;
