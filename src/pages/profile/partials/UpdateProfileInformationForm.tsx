import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import PrimaryButton from '@/components/PrimaryButton'
import { useAuth } from '@/hooks/auth'
import axios, { csrf } from '@/lib/axios'
import { Transition } from '@headlessui/react'
import { FormEventHandler, useEffect, useState } from 'react'

interface ErrorMessages {
    rg_cbmerj?: string[]
    email?: string[]
    password?: string[]
    password_confirmation?: string[]
}

const UpdateProfileInformationForm = () => {
    const { user, resendEmailVerification } = useAuth({ middleware: 'auth' })
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<ErrorMessages>({})
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (user !== undefined) {
            setEmail(user.email ?? '')
        }
    }, [user])

    const submitForm: FormEventHandler = async event => {
        event.preventDefault()

        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .put('/api/profile', { email: email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Informações do perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Atualize suas informações de e-mail.
                </p>
            </header>

            <form onSubmit={submitForm} className="mt-6 space-y-6">
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {user?.must_verify_email &&
                    user?.email_verified_at === null && (
                        <div>
                            <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                                Seu email ainda não foi verificado.
                                <button
                                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                    onClick={() =>
                                        resendEmailVerification({
                                            setStatus,
                                            setErrors: () => {},
                                        })
                                    }>
                                    Clique aqui para reenviar o email de
                                    verificação
                                </button>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                    Um novo link de verificação foi enviado para
                                    o seu email.
                                </div>
                            )}
                        </div>
                    )}

                <div className="flex items-center gap-4">
                    <PrimaryButton>Salvar</PrimaryButton>

                    {status === 'profile-updated' && (
                        <Transition
                            show={true}
                            enterFrom="opacity-0"
                            leaveTo="opacity-0"
                            className="transition ease-in-out">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Salvo com sucesso.
                            </p>
                        </Transition>
                    )}
                </div>
            </form>
        </section>
    )
}

export default UpdateProfileInformationForm
