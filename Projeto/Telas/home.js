import React, { Component, useEffect, useState, useContext } from 'react';
import { View, Text,FlatList, Animated, TouchableOpacity, Image, Pressable, TouchableHighlight, ScrollView } from 'react-native';
import { estilos } from '../Styles/estilos';
import { ExerciseContext } from './ExerciseContext';
import { deleteSeriesTemplate, deleteTreinos, deleteTreinosTemplate, getAllExercicios, getLastSeriesByExercise, getLastTreinoTemplate, getSeriesTemplate, getTreinosTemplate, getTreinosTemplateById, getTreinoTemplate, getTreinosTemplateFull } from './database1';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';

export default function TelaNovoTreino({ navigation }){

  const { exercises, setExercises, clearExercises, setNomeTreino } = useContext(ExerciseContext);
  const [treinos, setTreinosTemplate] = useState([]);
  const [refresh, setRefresh] = useState(false);
  db = useSQLiteContext();

    useEffect(() => {
      
      loadTreinosTemplate();
    }, [refresh]);


    useFocusEffect(
      React.useCallback(() => {
        loadTreinosTemplate();
        //const results = getLastSeriesByExercise(db, 2);
        //console.log(results);
        setRefresh(!refresh);
        // Perform any other actions when the screen is focused
      }, [])
    );
    
    const iniciarTreinoTemplate = async ( item ) =>{
      console.log(item.idTreinoTemplate);
      const result = getTreinosTemplateById(db, item.idTreinoTemplate);
      console.log('NOME: '+ item.treinonome);
      setExercises(result);
      setNomeTreino(item.treinonome);
      //console.log(exercises);
      navigation.navigate('ExerciciosEscolhidos');
    };

    const loadTreinosTemplate = async () =>{
      //deleteTreinosTemplate(db);
      //deleteSeriesTemplate(db);
      console.log('carregando treinos');
      try {
          const results = await getTreinosTemplate(db);
          console.log('treinos carregados', results);
          // Agrupar os exercícios pelo ID do treino
      const treinosComExercicios = {};
      results.forEach(item => {
        if (!treinosComExercicios[item.idTreinoTemplate]) {
          treinosComExercicios[item.idTreinoTemplate] = {
            idTreinoTemplate: item.idTreinoTemplate,
            treinonome: item.treinonome,
            exercicios: []
          };
        }
        treinosComExercicios[item.idTreinoTemplate].exercicios.push({
          nome: item.exercicionome,
          qntSeries: item.qntSeries
        });
      });

      // Converter o objeto em uma matriz para fins de renderização
      const treinosArray = Object.values(treinosComExercicios);

      setTreinosTemplate(treinosArray);

        } catch (error) {
          console.error('Erro ao carregar treinosTemplate', error);
        }
      };
   
    
    iniciarTreinoVazio = () => {
      clearExercises();
      navigation.navigate('TelaNovoTreino');
    };
    criarTreinoTemplate = () => {
      clearExercises();
      navigation.navigate('TelaNovoTemplate');
    };

    const renderItem = ({ item }) => (
      
      <View style={estilos.unselectedItemContainer}>
        <TouchableOpacity onPress={() => iniciarTreinoTemplate(item)}>
        <Text >Nome: {item.treinonome}</Text>
        <Text style={estilos.texto}>Exercícios:</Text>
        <FlatList
          data={item.exercicios}
          renderItem={({ item: exercicio }) => (
            <View>
            <Text style={estilos.texto}>{exercicio.qntSeries} x </Text>
            <Text style={estilos.texto}>{exercicio.nome}</Text>
          </View>
          )}
          keyExtractor={(exercicio, index) => index.toString()}
        />
        </TouchableOpacity>
      </View>
      
    );
    return (
      
      <View style={estilos.container}>
      {/*header*/}
      <View style={estilos.header}>  
        <Image style={estilos.logo}source={require('../Styles/imgs/Logo.png')}/>
      </View>  
      {/*header*/}
       <View style={estilos.body}> 
        <Pressable style={estilos.butao} onPress={iniciarTreinoVazio}>
          <Text style={estilos.bTexto}>Iniciar treino vazio</Text>
        </Pressable>
        
        <TouchableOpacity onPress={this.toggleList1}>
          <Text style={estilos.bTexto}>Treinos Salvos</Text>
        </TouchableOpacity>
        
        <Animated.View style={[estilos.listaContainer]}>
          {/* Botão Criar novo Template */}
                <View>
                  <TouchableOpacity  
                onPress={criarTreinoTemplate}
              >
                <Image source={require('../Styles/imgs/X.png')} style={estilos.botaoAdd} />
              </TouchableOpacity>
                </View>
          <View estilos={estilos.itens}>
          <FlatList
            data={treinos}
            renderItem={renderItem}
            keyExtractor={(item) => item.idTreinoTemplate.toString()}
          />
          </View>
          {/* Adicione mais itens conforme necessário */}
        </Animated.View>
        </View>      
        {/*Footer vvv*/}
        <View style={estilos.footer}>
        <View>
            <TouchableHighlight onPress={() => navigation.navigate('TelaHistorico')}>
              <Image source={require('../Styles/imgs/historico.png')} style={estilos.footerImgs} />
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={() => navigation.navigate('TelaHome')}>
              <Image source={require('../Styles/imgs/halter.png')} style={estilos.footerImgsAtivado} />
            </TouchableHighlight>
          </View>
          <View>
            <TouchableHighlight onPress={() => navigation.navigate('TelaPerfil')}>
              <Image source={require('../Styles/imgs/perfil.png')} style={estilos.footerImgs} />
            </TouchableHighlight>
          </View>
        </View>
        {/*Footer ^^^*/}
      </View>
    );
  }