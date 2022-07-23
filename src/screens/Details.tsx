import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, Input, Text, VStack, ScrollView, useTheme } from 'native-base'
import firestore from '@react-native-firebase/firestore'

import Header from '../components/Header'
import { OrderProps } from '../components/Orders';
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import { Alert, Button } from 'react-native';
import Loading from '../components/Loading';
import { DesktopTower, ClipboardText, CircleWavyCheck, Hourglass } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { convertOrderFirestoreDTOToOrderDetails } from '../mapper/order.mapper';

type RouteParams = {
    orderId: string
}

export type OrderDetails = OrderProps & {
    description: string,
    solution: string,
    closed: string
}

export default function Details() {
    const route = useRoute()
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { orderId } = route.params as RouteParams;
    const [isLoading, setIsLoading] = useState(true)
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
    const [solution, setSolution] = useState('')

    function getOrderById(orderId: string) {
        setIsLoading(true)
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then((doc) => {
                const orderDetails = convertOrderFirestoreDTOToOrderDetails(doc.id, doc.data())
                setOrder(orderDetails)
            }).catch((error) => {
                Alert.alert('Detalhamento', 'Não foi possível carregar os detalhes da solicitação')
            }).finally(() => {
                setIsLoading(false)
            })
    }

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Solicitação', 'Informa a solução para encerrar a solicitação');
        }

        setIsLoading(true)
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            }).then((response) => {
                Alert.alert('Solicitação', 'Solicitação encerrada.');
                navigation.goBack();
            }).catch((error) => {
                console.log(error);
                Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação');
                setIsLoading(false)
            })
    }

    useEffect(() => {
        getOrderById(orderId)
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title="Solicitação" />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="equipamento"
                    description={`Patrimônio ${order.patrimony}`}
                    icon={DesktopTower}
                />

                <CardDetails
                    title="descrição do problema"
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}
                />

                <CardDetails
                    title="solução"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        order.status === 'open' &&
                        <Input
                            placeholder="Descrição da solução"
                            onChangeText={setSolution}
                            color={colors.gray[200]}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }
                </CardDetails>
            </ScrollView>

            {
                order.status === 'open' &&
                <Button
                    title="Encerrar solicitação"
                    m={5}
                    onPress={handleOrderClose}
                />
            }
        </VStack>
    )
}