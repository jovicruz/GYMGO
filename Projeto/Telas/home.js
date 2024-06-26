import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Pressable, Alert,TouchableHighlight } from 'react-native';
import { estilos } from '../Styles/estilos';
import { ExerciseContext } from './ExerciseContext';
import { deleteSeriesTemplate, deleteTreinosTemplate, getTreinosTemplateById, getTreinosTemplate, deleteTreinoTemplateById } from './database1';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default function TelaNovoTreino({ navigation }) {
  const { exercises, setExercises, clearExercises, setNomeTreino } = useContext(ExerciseContext);
  const [treinos, setTreinosTemplate] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    loadTreinosTemplate();
  }, [refresh]);

  useFocusEffect(
    React.useCallback(() => {
      loadTreinosTemplate();
      setRefresh(!refresh);
    }, [])
  );

  const iniciarTreinoTemplate = async (item) => {
    const result = await getTreinosTemplateById(db, item.idTreinoTemplate);
    setExercises(result);
    setNomeTreino(item.treinonome);
    navigation.navigate('ExerciciosEscolhidos');
  };

  const loadTreinosTemplate = async () => {
    try {
      const results = await getTreinosTemplate(db);
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

      const treinosArray = Object.values(treinosComExercicios);
      setTreinosTemplate(treinosArray);
    } catch (error) {
      console.error('Erro ao carregar treinosTemplate', error);
    }
  };

  const iniciarTreinoVazio = () => {
    clearExercises();
    navigation.navigate('TelaNovoTreino');
  };

  const criarTreinoTemplate = () => {
    clearExercises();
    navigation.navigate('TelaNovoTemplate');
  };

  const handleLongPress = (item) => {
    Alert.alert(
      "Excluir Treino",
      "Você deseja realmente excluir esse treino?",
      [
        {
          text: "Não",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => {
            deleteTreinoTemplateById(db, item.idTreinoTemplate);
            setRefresh(!refresh);
          }
        }
      ]
    );
  };

  const rightSwipeActions = (progress, dragX, item) => {
    return (
      <TouchableOpacity style={estilos.BotaoDesilizado} onPress={() => handleLongPress(item)}>
        <Text style={estilos.txtBig}>
          Excluir
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => rightSwipeActions(progress, dragX, item)}
    >
      <View style={estilos.ItemContainer}>
        <TouchableOpacity onPress={() => iniciarTreinoTemplate(item)} onLongPress={() => handleLongPress(item)}>
          <Text style={estilos.TextoBold}>Nome: {item.treinonome}</Text>
          <Text style={estilos.texto}>Exercícios:</Text>
          <FlatList
            data={item.exercicios}
            renderItem={({ item: exercicio }) => (
              <View style={estilos.doladoExercicio}>
                <Text style={estilos.texto}>{exercicio.qntSeries} x </Text>
                <Text style={estilos.texto}>{exercicio.nome}</Text>
              </View>
            )}
            keyExtractor={(exercicio, index) => index.toString()}
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={estilos.container}>
      {/*header*/}
      <View style={estilos.header}>
        <Image style={estilos.logo} source={require('../Styles/imgs/Logo.png')} />
      </View>
      {/*header*/}
      <View style={estilos.body}>
        <Pressable style={estilos.butao} onPress={iniciarTreinoVazio}>
          <Text style={estilos.bTexto}>Iniciar treino vazio</Text>
        </Pressable>
        <Text style={estilos.bTexto}>Treinos Salvos</Text>

        <View style={[estilos.listaContainer]}>
          <View style={estilos.botaoVoltar}>
            <TouchableOpacity onPress={criarTreinoTemplate}>
              <Image source={require('../Styles/imgs/X.png')} style={estilos.botaoAdd} />
            </TouchableOpacity>
          </View>
          <View style={estilos.itens}>
            <FlatList
              data={treinos}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 250 }}
              keyExtractor={(item) => item.idTreinoTemplate.toString()}
            />
          </View>
        </View>
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
    </GestureHandlerRootView>
  );
}
