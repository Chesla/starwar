import React, { Component } from 'react';
import FolderStore from '../stores/folderStores';
import {browserHistory} from 'react-router';


export default class List extends Component {
    constructor(props){
        super(props);
        this.state={
            currentFolders:props.folders,
            noOfFolders: FolderStore.getFolders(props.folders) || [],
            asc:true
        }
        this._getfolderChanges = this._getfolderChanges.bind(this);
    }
    componentWillMount(){
        FolderStore.on('change',this._getfolderChanges);
    }
    componentWillUnmount(){
        FolderStore.removeListener('change',this._getfolderChanges);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            currentFolders:nextProps.folders,
            noOfFolders: FolderStore.getFolders(nextProps.folders) || []
        })
    }
    _getfolderChanges(type){
        if(type==='NEW_FOLDER'){
            this.setState({
                noOfFolders: FolderStore.getFolders(this.state.currentFolders) || []
            })
        }else if(type==='RENAME_FOLDER'){
            let noOfFolders = FolderStore.getFolders(this.state.currentFolders) || [];
           
            this.setState({
                noOfFolders
            })
        }
    }
    _showFolders(){
        let {noOfFolders,currentFolders,asc} = this.state;
        
         
        if(asc){
                noOfFolders = noOfFolders.sort();
        }else{
            noOfFolders = noOfFolders.sort();
            noOfFolders.reverse();
        }
        return noOfFolders.map((f,i)=>{
            let url = !currentFolders ? '' :  '/'+currentFolders
            return(
                    <Folder url={url} f={f} key={`folder-${i}`}/>
                )
        })
       
    }
    _createFolder(){
        FolderStore.createFolder(this.state.currentFolders,'NewFolder')
    }
    sortFn(){
        this.setState({
            asc:!this.state.asc
        })
    }
    render() {
        return (
            <div>
                <button className="createfolder" onClick={this._createFolder.bind(this)}> Create Folder</button>
                {this.state.noOfFolders.length ?
                        <div className="list-header" onClick={this.sortFn.bind(this)}>
                             Names
                            {this.state.asc ? <i className="fa fa-sort-asc" aria-hidden="true"></i>  : 
                                <i className="fa fa-sort-desc" aria-hidden="true"></i>
                            }
                        </div>
                        :null
                }
                {this._showFolders()}
            </div>
        );
    }
}

class Folder extends Component{
    constructor(props){
        super(props);
        this.state={
            renameFolder:false,
            folderName:props.f
        }
        this._getfolderChanges = this._getfolderChanges.bind(this);
    }
    componentWillMount(){
        FolderStore.on('change',this._getfolderChanges);
    }
    componentWillUnmount(){
        FolderStore.removeListener('change',this._getfolderChanges);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            renameFolder:false,
            folderName:nextProps.f
        })
    }
    _getfolderChanges(type,url){
        let newUrl = this.props.url;
        if(type==='RENAME_FOLDER' && newUrl===url){
            this.setState({
                renameFolder:false,
            })
        }else if(type === 'RENAME_FOLDER_ERR' && newUrl===url){
            this.setState({
                renameFolder:false,
                folderName:this.props.f
            })
        }
    }
    changeFolderName(event,value){
        event.stopPropagation();
        this.setState({
            folderName:event.target.value
        })
       

    }
    enterNewFolderName(event){
        if(event.keyCode===13 && this.state.folderName.trim()){
            FolderStore.renameFolder(this.props.f,this.state.folderName,this.props.url)
        }else if(event.keyCode===27){
            this.setState({
                renameFolder:false,
                folderName:this.props.f
            })
        }
       
    }
    render(){
        let {url} = this.props;
        let {renameFolder,folderName} = this.state;
        return(
            <div className="folder-name-cnt"
                    onDoubleClick={()=>{
                            renameFolder ? '' : browserHistory.push(`${url}/${folderName}`)
                        }
                    }>
                <i className="fa fa-folder fa-2x" aria-hidden="true"></i> 
                <div className="folder-name" 
                    onClick={(event)=>{
                        event.stopPropagation();
                        this.setState({
                            renameFolder:true
                        });
                       
                    }}
                >
                     {renameFolder ?
                        <input type="text" 
                            className="folder-input"
                            value={folderName} 
                            onChange={this.changeFolderName.bind(this)}
                            onKeyDown={this.enterNewFolderName.bind(this)}/>
                        :
                        folderName
                     }
                </div>
            </div>
        )
    }
} 
 
