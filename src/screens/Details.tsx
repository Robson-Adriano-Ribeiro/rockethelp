import { useRoute } from '@react-navigation/native';
import { Text, VStack } from 'native-base'

import Header from '../components/Header'

type RouteParams = {
    orderId: string
}

export default function Details() {
    const route = useRoute()
    const { orderId } = route.params as RouteParams;

    return (
        <VStack flex={1} bg="blueGray.700">
            <Header title='Detalhes da solicitação' />
            <Text>{orderId}</Text>
        </VStack>
    )
}