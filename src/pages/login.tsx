import AuthCard from '@/components/AuthCard'
import AuthSessionStatus from '@/components/AuthSessionStatus'
import Checkbox from '@/components/Checkbox'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import GuestLayout from '@/components/Layouts/GuestLayout'
import PrimaryButton from '@/components/PrimaryButton'
import { useAuth } from '@/hooks/auth'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'

interface ErrorMessages {
    rg_cbmerj?: string[]
    email?: string[]
    password?: string[]
    length?: number
}

const Login = () => {
    const { query } = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [rg_cbmerj, setRg_cbmerj] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState<ErrorMessages>({})
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        const reset = query && query.reset ? (query.reset as string) : ''
        if (reset.length > 0 && errors.length === 0) {
            setStatus(atob(reset))
        } else {
            setStatus(null)
        }
    })

    const submitForm: FormEventHandler = async event => {
        event.preventDefault()

        login({
            rg_cbmerj,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }
    const handleChangeRg_cbmerj = (event: any) => {
        const rg_cbmerj = event.target.value

        // only allow numbers and only 7 digits
        setRg_cbmerj(rg_cbmerj.replace(/\D/g, '').slice(0, 7))
    }

    return (
        <GuestLayout>
            <Head>
                <title>ProgPlan - Login</title>
            </Head>
            <AuthCard>
                {/* Session Status */}
                <AuthSessionStatus className="mb-4" status={status} />

                <form onSubmit={submitForm}>
                    {/* rg_cbmerj */}
                    <div>
                        <Label htmlFor="rg_cbmerj">RG CBMERJ</Label>

                        <Input
                            id="rg_cbmerj"
                            type="text"
                            value={rg_cbmerj}
                            className="block mt-1 w-full"
                            onChange={handleChangeRg_cbmerj}
                            required
                            isFocused={true}
                        />

                        <InputError
                            messages={errors.rg_cbmerj}
                            className="mt-2"
                        />
                    </div>
                    {/* Email Address */}
                    {/* <div className="mt-4">
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                            isFocused={true}
                        />

                        <InputError messages={errors.email} className="mt-2" />
                    </div> */}

                    {/* Password */}
                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                        />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Remember Me */}
                    <div className="block mt-4">
                        <label
                            htmlFor="remember_me"
                            className="inline-flex items-center">
                            <Checkbox
                                id="remember_me"
                                name="remember"
                                checked={shouldRemember}
                                onChange={event =>
                                    setShouldRemember(event.target.checked)
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                Lembrar minha senha
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/forgot-password"
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                            Esqueceu sua senha?
                        </Link>

                        <PrimaryButton className="ml-4">Login</PrimaryButton>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default Login
