import AuthCard from '@/components/AuthCard'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import GuestLayout from '@/components/Layouts/GuestLayout'
import PrimaryButton from '@/components/PrimaryButton'
import { useAuth } from '@/hooks/auth'
import Head from 'next/head'
import Link from 'next/link'
import { FormEventHandler, useState } from 'react'

interface ErrorMessages {
    rg_cbmerj?: string[]
    email?: string[]
    password?: string[]
    password_confirmation?: string[]
}

const Register = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })
    const [rg_cbmerj, setRg_cbmerj] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<ErrorMessages>({})

    const submitForm: FormEventHandler = event => {
        event.preventDefault()

        register({
            rg_cbmerj,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
            setStatus: () => {},
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
                <title>ProgPlan - Cadastro de Concorrentes</title>
            </Head>
            <AuthCard>
                <form onSubmit={submitForm}>
                    
                    {/* rg */}
                    <div>
                        <Label htmlFor="rg_cbmerj">RG CBMERJ</Label>

                        <Input
                            id="rg_cbmerj"
                            type="text"
                            value={rg_cbmerj}
                            className="block mt-1 w-full"
                            onChange={handleChangeRg_cbmerj}
                            required
                            autoFocus
                        />

                        <InputError
                            messages={errors.rg_cbmerj}
                            className="mt-2"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="mt-4">
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />

                        <InputError messages={errors.email} className="mt-2" />
                    </div>

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
                            autoComplete="new-password"
                        />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mt-4">
                        <Label htmlFor="passwordConfirmation">
                            Confirm Password
                        </Label>

                        <Input
                            id="passwordConfirmation"
                            type="password"
                            value={passwordConfirmation}
                            className="block mt-1 w-full"
                            onChange={event =>
                                setPasswordConfirmation(event.target.value)
                            }
                            required
                        />

                        <InputError
                            messages={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/login"
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
                            Already registered?
                        </Link>

                        <PrimaryButton className="ml-4">Register</PrimaryButton>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default Register
