import axios, { csrf } from '@/lib/axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

declare type AuthMiddleware = 'auth' | 'guest'

interface IUseAuth {
    middleware: AuthMiddleware
    redirectIfAuthenticated?: string
}

interface ErrorMessages {
    rg_cbmerj?: string[]
    name?: string[]
    email?: string[]
    password?: string[]
    password_confirmation?: string[]
}

interface IApiRequest {
    setErrors: React.Dispatch<React.SetStateAction<ErrorMessages>>
    setStatus: React.Dispatch<React.SetStateAction<any | null>>
    [key: string]: any
}

export interface User {
    id?: number
    rg_cbmerj?: string
    email?: string
    email_verified_at?: string
    must_verify_email?: boolean // this is custom attribute
    created_at?: string
    updated_at?: string
}

export interface MilitarData {
    nome_guerra: string
    quadro: string
    graduacao_abreviacao: string
    obm_atual: string
    lotacao: string
    data_de_nascimento: string
    rg: string
    alistamento: string
    foto: string
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: IUseAuth) => {
    const router = useRouter()

    const {
        data: user,
        error,
        mutate,
    } = useSWR<User>('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    async function getMilitarData(rg_cbmerj: string | undefined) {
        const url = process.env.NEXT_PUBLIC_API_CBMERJ_URL
        const secret_id = process.env.NEXT_PUBLIC_API_CBMERJ_SECRET_ID
        const secret_key = process.env.NEXT_PUBLIC_API_CBMERJ_SECRET_KEY
        const response = await fetch(`${url}/militar/efetivo/search`, {
            method: 'POST',
            body: JSON.stringify({
                rg: rg_cbmerj,
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'secret-id': `${secret_id}`,
                'secret-key': `${secret_key}`,
            } as HeadersInit,
        })
        const data = await response.json()
        console.log(data)

        return data
    }

    const register = async (args: IApiRequest) => {
        const { setErrors, ...props } = args

        await csrf()

        setErrors({})

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async (args: IApiRequest) => {
        const { setErrors, setStatus, ...props } = args

        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async (args: IApiRequest) => {
        const { setErrors, setStatus, email } = args
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async (args: IApiRequest) => {
        const { setErrors, setStatus, ...props } = args
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = (args: IApiRequest) => {
        const { setStatus } = args

        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }
    useEffect(() => {
        getMilitarData(user?.rg_cbmerj)
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            if (redirectIfAuthenticated) {
                router.push(redirectIfAuthenticated)
            }
        }
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        ) {
            if (redirectIfAuthenticated) {
                router.push(redirectIfAuthenticated)
            }
        }
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
