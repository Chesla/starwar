import React, { Component } from 'react';
import {browserHistory} from 'react-router';



export default class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            folders:props.folders.split('/')
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            folders:nextProps.folders.split('/')
        })
    }
    changeRoute(url,event){
        browserHistory.replace(url);
    }
    showBreadCrumps(){
        let {folders} = this.state;
        let prev = '';
        return folders.map((f,i)=>{
            prev = prev+'/'+f;
            return(
               
                <div key={`header-${i}`}
                    className={i===folders.length-1 ? "breadCrump-title active" : "breadCrump-title"} 
                    onClick={i===folders.length-1 ? null :this.changeRoute.bind(this,prev)}>
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                    <span> {f} </span>
                </div>
            )
        })
    }
    render() {
        return (
            <div className="breadcrump-cnt">
            {this.props.folders &&
                <div className="breadCrump-title" onClick={()=>{window.history.back()}}>
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </div>
            }
                <div className="breadCrump-title" onClick={this.changeRoute.bind(this,'')}>
                    HOME
                </div> 
               {this.showBreadCrumps()}
            </div>
        );
    }
}

 
