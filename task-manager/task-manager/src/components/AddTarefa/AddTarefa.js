import React, { useEffect, useRef, useState } from 'react'
import firebase from 'firebase/app'
import { FecharModal, MainContainer } from './styled'
import {TaskContainer, HeaderFormTarefa, ConteinerOpcoes, ContainerDescricao, ButtonsContainer } from '../GlobalStyles/GlobalStyles'

import imgFechar from '../../images/fechar.png'

const AddTarefa = (props) => {
    
    const[hasClosed, setHasClosed]=useState(false)
    const[titulo, setTitulo] = useState("")
    const[descricao, setDescricao] = useState("")
    const[prioridade, setPrioridade] = useState("")
    const[status, setStatus] = useState("")
    
    const fileInputRef = useRef()
  
    const fecharModal = (hasClosed) => {
        if(hasClosed){
            setHasClosed(true)
            props.setHasClicked(false)
        }
    }
    

    useEffect(()=>{
        fecharModal()

    },[setHasClosed])

    const onChangeTituloDaTarefa = (event) => {
        setTitulo(event.target.value)
    }
    const onChangeDescricao = (event) => {
        setDescricao(event.target.value)
    }

    const onChangePrioridade = (event) => {
        setPrioridade(event.target.value)
    }
    const onChangeStatus = (event) => {
        setStatus(event.target.value)
    }
    
    const enviarArquivoEpegarUrl = async  () =>{

        const file = fileInputRef.current.files[0]
        

            if(file){
                const storageRef = firebase.storage().ref()
                const newFileRef = storageRef.child(file.name)

                await newFileRef.put(file)

                return newFileRef.getDownloadURL()
            }
                return null
    }


    const criarTarefa = async (hasClosed) =>{

        fecharModal(hasClosed)
        
         

        const urlArquivo = await enviarArquivoEpegarUrl()

        const ref = firebase.firestore()
        .collection('usuarios')
        .doc(props.usuarioLogado.uid)
        .collection('TarefasUsuario')

        ref.add({
            criadaEm: new Date(),
            titulo: titulo,
            descricao: descricao,
            status: status,
            prioridade: prioridade,
            responsavel: props.usuarioLogado.email,
            arquivo: urlArquivo
        })
        props.pegarTarefaCriada()
    } 

    return(
        <MainContainer>
            {!hasClosed && 
            <TaskContainer>

                <HeaderFormTarefa>
                    
                    <h4>Adicionar nova tarefa</h4>
                    
                    <FecharModal onClick={fecharModal}>
                        <img src={imgFechar}/>
                    </FecharModal>
                </HeaderFormTarefa>
                
                <form onSubmit={criarTarefa}>
                    <label>T??tulo:</label>
                    <input type={'text'} value={titulo} required  onChange={onChangeTituloDaTarefa}/>
                
                
                    <ConteinerOpcoes>
                        <label>Prioridade:</label>
                        <select  value={prioridade} required onChange={onChangePrioridade}>
                            <option value="">Selecione</option>
                            <option value="Alta">Alta</option>
                            <option value="M??dia">M??dia</option>
                            <option value="Baixa">Baixa</option>
                        </select>

                        <label>Status:</label>
                        <select value={status} required onChange={onChangeStatus}>
                            <option value="">Selecione</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Conclu??da">Conclu??da</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                       

                    </ConteinerOpcoes>
                    
                    <ContainerDescricao>
                        <label>Descri????o da tarefa:</label>
                        <textarea type={'text'} rows="4" required cols="40" value={descricao}  onChange={onChangeDescricao} placeholder={'Descri????o da sua atividade'}/>

                    </ContainerDescricao>
                    <p>Respons??vel: {props.usuarioLogado && 
                        props.usuarioLogado.email}</p>
                        <label>Anexar arquivo:</label>
                        <input type={'file'} ref={fileInputRef} accept={'application/*,image/*'}/>

                <ButtonsContainer>
                    <button type={'submit'}>Adicionar tarefa</button>
                </ButtonsContainer>
                </form>
           </TaskContainer>}
        </MainContainer>
    )
}
export default AddTarefa