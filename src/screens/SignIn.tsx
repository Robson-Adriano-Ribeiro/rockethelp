import { useState } from 'react'
import { Alert } from 'react-native';
import { Heading, VStack, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import auth from '@react-native-firebase/auth'

import Input from '../components/Input'
import Button from '../components/Button'
import Logo from '../assets/logo_primary.svg'


export default function SignIn() {
    const { colors } = useTheme()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState('s')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    function handleSingIn() {
        if (!userName || !password) {
            return Alert.alert('Entrar', 'Informe email e senha')
        }

        setIsLoading(true)
        auth()
            .signInWithEmailAndPassword(userName, password)
            .then(response => {
            })
            .catch((error) => {
                console.log('Error signIn', error)

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Entrar', 'E-mail inválido.')
                }

                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    return Alert.alert('Entrar', 'Usuário ou senha inválida.')
                }

                return Alert.alert('Entrar', 'Não foi possível acessar.')
            }).finally(() => {
                setIsLoading(false)
            })

    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />
            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta {name}
            </Heading>

            <Input placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setUserName}
            />
            <Input placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title='Entrar'
                mt={8}
                w="full"
                onPress={handleSingIn}
                isLoading={isLoading} />
        </VStack>
    )
}