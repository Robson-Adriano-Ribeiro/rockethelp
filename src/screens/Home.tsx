import { useEffect, useState } from 'react';
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { VStack, HStack, IconButton, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut, ChatTeardropText, User } from 'phosphor-react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import Logo from '../assets/logo_secondary.svg'
import Filter from '../components/Filter';
import Button from '../components/Button';
import Loading from '../components/Loading'

import Order, { OrderProps } from '../components/Orders';
import dataFormat from '../utils/firestoreDataFormat';

export default function Home() {
    const navigation = useNavigation()
    const { colors } = useTheme()
    const [isLoading, setIsLoading] = useState(true)
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
    const [orders, setOrders] = useState<OrderProps[]>([])

    function handleOpenNewOrder() {
        navigation.navigate('new')
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId })
    }

    function handleLogout() {
        auth().signOut()
            .catch((error) => {
                console.log(error)
                return Alert.alert('Sair', 'Não foi possível deslogar da aplicação')
            })
    }

    function getOrders() {
        setIsLoading(true)
        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, created_at } = doc.data()

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dataFormat(created_at)
                    }
                })

                setOrders(data)
                setIsLoading(false)
            })

        return subscriber
    }

    useEffect(() => {
        getOrders()
    }, [])

    useEffect(() => {
        getOrders()
    }, [statusSelected])

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}>
                <Logo />
                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />} onPress={handleLogout}
                />
            </HStack>
            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">Solicitações</Heading>
                    <Text color="gray.200">{orders.length}</Text>
                </HStack>
                <HStack space={3} mb={8}>
                    <Filter title="em andamento" type="open" isActive={statusSelected === 'open'} onPress={() => setStatusSelected('open')}
                    />
                    <Filter title="finalizados" type="closed" isActive={statusSelected === 'closed'} onPress={() => setStatusSelected('closed')} />
                </HStack>

                {isLoading ?
                    <Loading /> :
                    <FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não possui {'\n'}
                                    solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                                </Text>
                            </Center>
                        )} />}
            </VStack>

            <Button title="Nova Solicitação" onPress={handleOpenNewOrder} />
        </VStack>
    )
}